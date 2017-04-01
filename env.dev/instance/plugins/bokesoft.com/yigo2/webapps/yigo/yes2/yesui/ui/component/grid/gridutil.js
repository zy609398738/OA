(function () {
    YIUI.ShowGridData = YIUI.extend({
        form: null,
        grid: null,
        init: function (form, grid) {
            this.form = form;
            this.grid = grid;
        },
        load: function () {
            var doc = this.form.getDocument();
            if (doc == null) return;
            var tableKey = this.grid.tableKey;
            var dataTable = doc.getByKey(tableKey);
            this.grid.initPageOpts();
            this.constructGrid();
            var gridRowGroup = new YIUI.GridRowGroup(this.form, this.grid), builder;
            gridRowGroup.group();
            if (this.grid.getMetaObj().treeType != -1) {
                builder = new YIUI.GridTreeBuilder(this.form, this.grid);
            } else if (this.grid.hasRowExpand) {
                builder = new YIUI.GridRowExpandBuilder(this.form, this.grid);
            } else {
                builder = new YIUI.GridNormalRowBuilder(this.form, this.grid);
            }
            builder.build();
        },
        constructGrid: function () {
            if (this.grid.hasColExpand) {
                var columnExpand = new YIUI.GridColumnExpand(this.form, this.grid);
                columnExpand.expand();
                this.buildColumnHeader();
            }
            if (this.grid.hasRowExpand) {
                var rowExpand = new YIUI.GridRowExpand(this.form, this.grid);
                rowExpand.dealRowExpand();
            }
        },
        buildColumnHeader: function () {
            var leafColumns = [];
            var initLeafColumns = function (columns, leafColumns) {
                for (var i = 0, len = columns.length; i < len; i++) {
                    var column = columns[i];
                    if (column.columns != null && column.columns.length > 0) {
                        initLeafColumns(column.columns, leafColumns);
                    } else {
                        leafColumns.push(column);
                    }
                }
            };
            initLeafColumns(this.grid.getMetaObj().columns, leafColumns);
            var gridColumns = [], cells = {};
            for (var i = 0, len = leafColumns.length; i < len; i++) {
                var metaColumn = leafColumns[i], colObj = {};
                colObj.key = metaColumn.key;
                colObj.label = metaColumn.caption;
                colObj.formulaCaption = metaColumn.formulaCaption;
                if (metaColumn.refColumn != null) {
                    colObj.isExpandCol = true;
                    colObj.refColumn = metaColumn.refColumn.key;
                }
                colObj.name = "column" + i;
                colObj.index = i;
                colObj.width = metaColumn.width;
                colObj.hidden = false;
                colObj.sortable = metaColumn.sortable;
                colObj.visible = metaColumn.visible;
                colObj.visibleDependency = metaColumn.visibleDependency;
                colObj.columnType = metaColumn.columnType;
                if (this.grid.treeColIndex >= 0 && i == this.grid.treeColIndex) {
                    colObj.editable = false;
                }
                gridColumns.push(colObj);
            }
            for (var j = 0, jLen = this.grid.getMetaObj().rows.length; j < jLen; j++) {
                var metaRow = this.grid.getMetaObj().rows[j];
                for (var m = 0, mLen = metaRow.cells.length; m < mLen; m++) {
                    var metaCell = metaRow.cells[m], cellObj = $.extend(true, {}, metaCell);
                    cellObj.colIndex = m;
                    if (metaCell.cellType == YIUI.CONTROLTYPE.COMBOBOX || metaCell.cellType == YIUI.CONTROLTYPE.CHECKLISTBOX) {
                        var items = [], item;
                        switch (metaCell.sourceType) {
                            case YIUI.COMBOBOX_SOURCETYPE.STATUS:
                                var statusItems = this.form.statusItems;
                                if (statusItems != null && statusItems.length > 0) {
                                    for (var k = 0, kLen = statusItems.length; k < kLen; k++) {
                                        item = {value: statusItems[k].value, caption: statusItems[k].caption};
                                        items.push(item);
                                    }
                                    cellObj.option.items = items;
                                }
                                break;
                            case YIUI.COMBOBOX_SOURCETYPE.PARAGROUP:
                                var paraGroups = this.form.paraGroups;
                                if (paraGroups != null && paraGroups.length > 0) {
                                    for (var h = 0, hLen = paraGroups.length; h < hLen; k++) {
                                        item = {value: paraGroups[h].value, caption: paraGroups[h].caption};
                                        items.push(item);
                                    }
                                    cellObj.option.items = items;
                                }
                                break;
                        }
                    }
                    cells[cellObj.key] = cellObj;
                    if (metaRow.rowType == "Detail" && metaCell.cellType == YIUI.CONTROLTYPE.CHECKBOX && metaCell.isSelect) {
                        gridColumns[j].isSelect = true;
                    }
                }
            }
            this.grid.dataModel.colModel.columns = gridColumns;
            this.grid.dataModel.colModel.cells = cells;
        },
        calcRowDataByLayer: function (form, grid, dataTable) {  //层次数据过滤计算。
            var defaultLayer = grid.getMetaObj().defaultLayer;
            if (dataTable == null || defaultLayer == -1) return;
            if (dataTable.getColByKey("Layer") == null || dataTable.getColByKey("Hidden") == null) {
                YIUI.ViewException.throwException(YIUI.ViewException.LAYER_OR_HIDDEN_NO_DEFINE);
            }
            var layerTree = {};
            dataTable.beforeFirst();
            while (dataTable.next()) {
                var layer = dataTable.getByKey("Layer");
                layer = (layer == null ? 0 : layer);
                var rows = layerTree[layer];
                if (rows == null) {
                    rows = [];
                    layerTree[layer] = rows;
                }
                var curBookmark = dataTable.getBookmark();
                if (!$.inArray(curBookmark, rows)) {
                    rows.push(curBookmark);
                }
                dataTable.setByKey("Hidden", 0);
                //TODO 没处理完，主要是DataTable的过滤没法处理
            }
        }
    });
    YIUI.GridNormalRowBuilder = YIUI.extend({
        form: null,
        grid: null,
        init: function (form, grid) {
            this.form = form;
            this.grid = grid;
        },
        build: function () {
            this.grid.clearGridData();
            var document = this.form.getDocument(), dataTable = document.getByKey(this.grid.tableKey),
                rootRowLayer = this.grid.getMetaObj().rowLayer, gridData = this.grid.dataModel.data, metaRow;
            for (var i = 0, len = rootRowLayer.objectArray.length; i < len; i++) {
                var rowObj = rootRowLayer.objectArray[i];
                if (rowObj.objectType == YIUI.MetaGridRowObjectType.ROW) {
                    metaRow = this.grid.getMetaObj().rows[rowObj.rowIndex];
                    YIUI.GridUtil.insertRow(this.grid, -1, metaRow, null, 0);
                    //this.addFixRowData(gridData, metaRow);
                } else if (rowObj.objectType == YIUI.MetaGridRowObjectType.AREA) {
                    var root = this.grid.dataModel.rootBkmk, groupLevel = 0;
                    for (var j = 0, jLen = rowObj.objectArray.length; j < jLen; j++) {
                        var subObj = rowObj.objectArray[j];
                        if (subObj.objectType == YIUI.MetaGridRowObjectType.ROW) {
                            metaRow = this.grid.getMetaObj().rows[subObj.rowIndex];
                            YIUI.GridUtil.insertRow(this.grid, -1, metaRow, null, 0);
                            // this.addTotalRow(gridData, metaRow, groupLevel);
                        } else if (subObj.objectType == YIUI.MetaGridRowObjectType.GROUP) {
                            for (var k = 0, kLen = root.getRowCount(); k < kLen; k++) {
                                this.buildGroupRows(this.grid, dataTable, groupLevel, root.getRowAt(k));
                            }
                        }
                    }
                }
            }
            //重建表头
            YIUI.GridUtil.buildGroupHeaders(this.grid);
        },
        buildGroupRows: function (grid, dataTable, groupLevel, parentgroup) {
            var gridData = grid.dataModel.data;
            var metaGridRowGroup = parentgroup.getMetaGroup(), objectCount = metaGridRowGroup.objectArray.length, metaRow;
            if (parentgroup.isLeaf) {
                for (var i = 0; i < objectCount; i++) {
                    var subObj = metaGridRowGroup.objectArray[i];
                    metaRow = this.grid.getMetaObj().rows[subObj.rowIndex];
                    switch (metaRow.rowType) {
                        case "Group":
                            YIUI.GridUtil.insertRow(this.grid, -1, metaRow, null, groupLevel);
                            //this.addTotalRow(gridData, metaRow, groupLevel);
                            break;
                        case "Detail":
                            groupLevel++;
                            var rowCount = parentgroup.getRowCount();
                            var start = 0, end = rowCount;

                            if (this.grid.getMetaObj().pageLoadType == YIUI.PageLoadType.UI) {
                                var curPageIndex = this.grid.pageInfo.curPageIndex,
                                    pageRowCount = this.grid.getMetaObj().pageRowCount;
                                curPageIndex = curPageIndex == null ? 0 : curPageIndex;
                                start = curPageIndex <= 0 ? 0 : curPageIndex * pageRowCount;
                                end = start + pageRowCount > rowCount ? rowCount : start + pageRowCount;
                            }

                            for (var m = start; m < end; m++) {
                                var bkmkRow = parentgroup.getRowAt(m);
                                var newRowIndex = YIUI.GridUtil.insertRow(grid, -1, metaRow, bkmkRow, groupLevel);

                                this.grid.getHandler().showDetailRowData(this.form, this.grid, newRowIndex);
                            }
                            groupLevel--;
                            break;
                    }
                }
            } else {
                for (var j = 0; j < objectCount; j++) {
                    var rowObj = metaGridRowGroup.objectArray[j];
                    metaRow = this.grid.getMetaObj().rows[rowObj.rowIndex];
                    if (rowObj.objectType == YIUI.MetaGridRowObjectType.ROW) {
                        YIUI.GridUtil.insertRow(grid, -1, metaRow, null, groupLevel);
                    } else {
                        for (var k = 0, kLen = parentgroup.getRowCount(); k < kLen; k++) {
                            groupLevel++;
                            this.buildGroupRows(grid, dataTable, groupLevel, parentgroup.getRowAt(k));
                            groupLevel--;
                        }
                    }
                }
            }
        }
    });
    YIUI.GridRowExpandBuilder = YIUI.extend({
        form: null,
        grid: null,
        init: function (form, grid) {
            this.form = form;
            this.grid = grid;
        },
        build: function () {
            this.grid.clearGridData();
            var dataTable = this.form.getDocument().getByKey(this.grid.tableKey);
            var detailRow = this.grid.getDetailMetaRow();
            var rowExpandIndex = this.grid.rowExpandIndex;
            var expandCell = detailRow.cells[rowExpandIndex];
            var leafGroup = this.getLeafGroupBkmkFromRoot(this.grid.dataModel.rootBkmk);
            if (leafGroup == null)
                return;
            var bkmkMap = {}, detailRowBkmk, bkmk, value;
            for (var i = 0, len = leafGroup.getRowCount(); i < len; i++) {
                bkmk = leafGroup.getRowAt(i);
                if (this.grid.hasColExpand) {
                    detailRowBkmk = bkmk.getAt(0);
                } else {
                    detailRowBkmk = bkmk;
                }
                dataTable.setByBkmk(detailRowBkmk.getBookmark());
                var colInfo = dataTable.getColByKey(expandCell.columnKey);
                value = YIUI.TypeConvertor.toDataType(colInfo.type, dataTable.getByKey(expandCell.columnKey));
                if (value != null) {
                    bkmkMap[value] = bkmk;
                }
            }
            var expandModel = this.grid.getRowExpandModel();
            for (var j = 0, size = expandModel.length; j < size; j++) {
                value = expandModel[j];
                bkmk = bkmkMap[value];
                var newRowIndex = YIUI.GridUtil.insertRow(this.grid, -1, detailRow, bkmk, 0);
                if( bkmk != undefined ) {
                    this.grid.getHandler().showDetailRowData(this.form, this.grid, newRowIndex);
                } else {
                    this.grid.setValueAt(newRowIndex,rowExpandIndex,value);
                }
            }
            YIUI.GridUtil.reConstructGrid(this.grid);
        },

        getLeafGroupBkmkFromRoot: function (groupRowBkmk) {
            for (var i = 0, len = groupRowBkmk.getRowCount(); i < len; i++) {
                var bkmk = groupRowBkmk.getRowAt(i);
                if (bkmk.getRowType() == YIUI.IRowBkmk.Group) {
                    if (bkmk.isLeaf) {
                        return bkmk;
                    }
                }
            }
            return null;
        }
    });

    YIUI.GridTreeBuilder = YIUI.extend({
        form: null,
        grid: null,
        init: function (form, grid) {
            this.form = form;
            this.grid = grid;
        },
        build: function () {
            this.grid.clearGridData();
            var metaGrid = this.grid.getMetaObj(), detailRow = metaGrid.rows[metaGrid.detailMetaRowIndex];
            if (detailRow == null) {
                YIUI.ViewException.throwException(YIUI.ViewException.NO_DETAIL_ROW_DEFINE);
            }
            var dataTable = this.form.getDocument().getByKey(this.grid.tableKey);
            var treeIndex = this.grid.treeIndex, metaColumn = metaGrid.columns[treeIndex];
            switch (metaColumn.treeType) {
                case "Dict":
                    var treeMetaCell = detailRow.cells[treeIndex];
                    if (treeMetaCell.cellType != YIUI.CONTROLTYPE.DICT) {
                        YIUI.ViewException.throwException(YIUI.ViewException.GRID_TREE_COLUMN_DEFINE_ERROR);
                    }
                    var editOpt = treeMetaCell.editOptions, itemKey = editOpt.itemKey,
                        dictFilter = YIUI.DictHandler.getDictFilter(this.form, treeMetaCell.key, editOpt.itemFilters, itemKey);
                    if (dataTable == null) break;
                    dataTable.beforeFirst();
                    var bkmkMap = {};
                    while (dataTable.next()) {
                        var id = YIUI.TypeConvertor.toLong(dataTable.getByKey(treeMetaCell.columnKey));
                        var bkmk = new YIUI.DetailRowBkmk();
                        bkmk.setBookmark(dataTable.getBkmk());
                        bkmkMap[id] = bkmk;
                    }
                    this.buildTreeRelation(bkmkMap, dictFilter, metaColumn.isExpand, itemKey, editOpt.sortColumns, detailRow);
                    break;
                default :
                    break;
            }
            YIUI.GridUtil.reConstructGrid(this.grid);
        },

        buildTreeRelation: function (bkmkMap, filter, expand, itemKey, sortColumns, metaRow) {
            var items = YIUI.DictService.getAllItems(itemKey, filter, YIUI.DictStateMask.Enable);
            if (sortColumns != null && sortColumns.length > 0) {
                var compareItem = function (item1, item2) {
                    var result;
                    for (var i = 0, len = sortColumns.length; i < len; i++) {
                        var sortColumn = sortColumns[i];
                        var value1 = YIUI.DictService.getDictValue(itemKey, item1.oid, sortColumn.column),
                            value2 = YIUI.DictService.getDictValue(itemKey, item2.oid, sortColumn.column);
                        switch (sortColumn.dataType) {
                            case YIUI.DataType.INT:
                            case YIUI.DataType.DOUBLE:
                            case YIUI.DataType.NUMERIC:
                            case YIUI.DataType.LONG:
                            case YIUI.DataType.FLOAT:
                                var n1 = YIUI.TypeConvertor.toDecimal(value1), n2 = YIUI.TypeConvertor.toDecimal(value2);
                                result = n1.comparedTo(n2);
                                break;
                            case YIUI.DataType.STRING:
                            case YIUI.DataType.TEXT:
                            case YIUI.DataType.FIXED_STRING:
                                result = value1.localeCompare(value2);
                                break;
                            case YIUI.DataType.DATE:
                            case YIUI.DataType.DATETIME:
                                var d1 = YIUI.TypeConvertor.toDate(value1), d2 = YIUI.TypeConvertor.toDate(value2);
                                result = d1.getTime() - d2.getTime();
                                break;
                            case YIUI.DataType.BOOLEAN:
                                var b1 = YIUI.TypeConvertor.toBoolean(value1), b2 = YIUI.TypeConvertor.toBoolean(value2);
                                if (b1 == true && b2 == false) {
                                    result = 1;
                                } else if (b1 == false && b2 == true) {
                                    result = -1;
                                }
                                break;
                        }
                        if (result != 0) {
                            break;
                        }
                    }
                    return result;
                };
                items.sort(compareItem);
            }
            var getParentID = function (item, colKey) {
                var tableKey = null, pos = colKey.indexOf(".");
                if (pos > 0) {
                    tableKey = colKey.substring(0, pos);
                    colKey = colKey.substring(pos + 1);
                } else {
                    tableKey = item.mainTableKey;
                }
                var table = item.itemTables[tableKey];
                if (table == null) return null;
                var value = null;
                if (table.itemRows.length > 0) {
                    if (table.tableMode == 0) {
                        value = table.itemRows[0][colKey];
                    } else {
                        var list = [];
                        for (var j = 0, jlen = table.itemRows.length; j < jlen; j++) {
                            list.push(table.itemRows[j][colKey]);
                        }
                        value = list;
                    }
                }
                return value;
            };
            var PID2ItemMap = {};
            for (var i = 0, len = items.length; i < len; i++) {
                var item = items[i], parentID = getParentID(item, "ParentID");
                var itemsList = PID2ItemMap[parentID];
                if (itemsList == null) {
                    itemsList = [];
                    PID2ItemMap[parentID] = itemsList;
                }
                itemsList.push(item);
            }
            var roots = PID2ItemMap["0"];
            if (roots != null) {
                this.buildTreeRow(PID2ItemMap, bkmkMap, expand, null, roots, metaRow, 0);// 根据层次关系构建表格行
            }
            for (var m = 0, mLen = this.grid.dataModel.data.length; m < mLen; m++) {
                var rowData = this.grid.dataModel.data[m], rowID = rowData.rowID;
                if (this.grid.rowIDMap == null) {
                    this.grid.rowIDMap = {};
                }
                this.grid.rowIDMap[rowID] = m;
            }
        },
        buildTreeRow: function (PID2ItemMap, bkmkMap, expand, parentRow, items, metaRow, treeLevel) {
            for (var i = 0, len = items.length; i < len; i++) {
                var item = items[i], itemData = {oid: item.oid, caption: item.caption, itemKey: item.itemKey};

                var bkmkRow = bkmkMap[itemData.oid];

                var newRowIndex = YIUI.GridUtil.insertRow(this.grid, -1, metaRow, bkmkRow, 0);
                // var rowData = this.grid.dataModel.data[newRowIndex];
                //var rowData = this.addDetailRow(this.grid.dataModel.data, metaRow);
                if ( bkmkRow ) {
                    //var bkmk = bkmkMap[itemData.oid];
                    // if (bkmk instanceof  YIUI.ExpandRowBkmk) {
                    //     for (var h = 0, hLen = bkmk.size(); h < hLen; h++) {
                    //         realBkmk.push(bkmk.getAt(h).getBookmark());
                    //     }
                    // } else {
                    //     realBkmk = bkmk.getBookmark();
                    // }
                    // rowData.bookmark = realBkmk;
                    // rowData.bkmkRow = bkmk;
                    var rowData = this.grid.dataModel.data[newRowIndex]
                    rowData.treeLevel = treeLevel;
                    rowData.isExpand = expand;
                    // this.grid.getHandler().showDetailRowData(this.form, this.grid, this.grid.getRowCount() - 1, false);
                    this.grid.getHandler().showDetailRowData(this.form, this.grid, newRowIndex);
                }
                if (parentRow != null) {
                    var childRows = parentRow.childRows;
                    if (childRows == null) {
                        childRows = [];
                        parentRow.childRows = childRows;
                    }
                    childRows.push(rowData.rowID);
                    rowData.parentRow = parentRow;
                }
                var itemsList = PID2ItemMap[item.oid];
                if (itemsList != null) {
                    this.buildTreeRow(PID2ItemMap, bkmkMap, expand, rowData, itemsList, metaRow, treeLevel + 1);
                } else {
                    rowData.isLeaf = true;
                }
            }
        },
        addDetailRow: function (gridData, metaRow) {
            var rowData = {};
            rowData.isDetail = true;
            rowData.isEditable = true;
            rowData.rowHeight = metaRow.rowHeight;
            rowData.rowID = this.grid.randID();
            rowData.metaRowIndex = this.grid.getMetaObj().rows.indexOf(metaRow);
            rowData.rowType = "Detail";
            rowData.cellKeys = metaRow.cellKeys;
            rowData.data = [];
            rowData.cellBkmks = [];
            gridData.push(rowData);
            for (var i = 0, len = metaRow.cells.length; i < len; i++) {
                var metaCell = metaRow.cells[i], value = null;
                if (metaCell.tableKey == undefined
                    && metaCell.columnKey == undefined
                    && (metaCell.cellType == YIUI.CONTROLTYPE.LABEL
                    || metaCell.cellType == YIUI.CONTROLTYPE.BUTTON
                    || metaCell.cellType == YIUI.CONTROLTYPE.HYPERLINK)) {
                    value = metaRow.cells[i].caption;
                }
                value = this.grid.getCellNeedValue(gridData.length - 1, i, value, true);
                rowData.data.push(value);
                rowData.cellBkmks.push(null);
            }
            return rowData;
        }
    });
})();

YIUI.GridUtil = (function () {
    var Return = {
        //表格数据模型中加行
        insertRow: function(grid, rowIndex, metaRow, bookmarkRow, groupLevel){
            var initRowData = function(metaRow, groupLevel){
                var rowData = {};
                rowData.rowType = metaRow.rowType;
                rowData.metaRowIndex = grid.getMetaObj().rows.indexOf(metaRow);
                rowData.cellKeys = metaRow.cellKeys;
                rowData.isDetail = metaRow.rowType == 'Detail' ? true : false;
                rowData.isEditable = (metaRow.rowType == 'Total' || metaRow.rowType == 'Group') ? false : true;
                rowData.rowHeight = metaRow.rowHeight;
                rowData.rowID = grid.randID();
                rowData.data = [];
                rowData.cellBkmks = [];

                if( bookmarkRow ) {
                    rowData.bkmkRow = bookmarkRow;
                    if (bookmarkRow instanceof YIUI.ExpandRowBkmk) {
                        rowData.bookmark = [];
                        for (var h = 0, hLen = bookmarkRow.size(); h < hLen; h++) {
                            rowData.bookmark.push(bookmarkRow.getAt(h).getBookmark());
                        }
                    } else {
                        rowData.bookmark = bookmarkRow.getBookmark();
                    }
                }

                if( groupLevel !== undefined ) {
                    rowData.rowGroupLevel = groupLevel;
                }

                if(metaRow.rowType == 'Group'){
                    rowData.isGroupHead = metaRow.isGroupHead;
                    rowData.isGroupTail = metaRow.isGroupTail;
                }

                return rowData;
            },
            //添加明细行
            addDetailRow = function (metaRow, groupLevel) {
                var rowData = initRowData(metaRow, groupLevel), metaCell, value;
         
                for (var i = 0, len = metaRow.cells.length; i < len; i++) {
                    metaCell = metaRow.cells[i];
                    value = [null,'',true];
                    if ( !metaCell.tableKey && !metaCell.columnKey
                        && (metaCell.cellType == YIUI.CONTROLTYPE.LABEL
                        || metaCell.cellType == YIUI.CONTROLTYPE.BUTTON
                        || metaCell.cellType == YIUI.CONTROLTYPE.HYPERLINK)) {
                        value[1] = metaRow.cells[i].caption;
                    }else if(metaCell.cellType == YIUI.CONTROLTYPE.NUMBEREDITOR){
                        var meta = metaCell.editOptions;

                        if(meta.zeroString){
                            value[1] = meta.zeroString;
                        }else if(meta.showZero){
                            var opt = {};
                            opt.mDec = $.isDefined(meta.scale) ? meta.scale : 2;
                            value[1] = YIUI.DecimalFormat.format(0, opt) ;
                        }

                    }
                    //value = this.grid.getCellNeedValue(gridData.length - 1, i, value, true);
                    rowData.data.push(value);
                    rowData.cellBkmks.push(null);
                }
                return rowData;
            },
            //添加汇总行
            addTotalRow = function (metaRow, groupLevel) {
                var rowData = initRowData(metaRow, groupLevel);
        
                for (var i = 0, len = metaRow.cells.length; i < len; i++) {
                    var metaCell = metaRow.cells[i], cellData = {};
                    cellData = [metaCell.caption, metaCell.caption];
                    rowData.data.push(cellData);
                }
                return rowData;
            },
            //添加固定行
            addFixRow = function (metaRow) {
                var rowData = initRowData(metaRow);
            
                for (var i = 0, len = metaRow.cells.length; i < len; i++) {
                    var metaCell = metaRow.cells[i], cellData = {};
                    if (metaCell.tableKey) {
                        // var dataTable = this.form.getDocument().getByKey(metaCell.tableKey);
                        // if (dataTable == null) break;
                        // if (dataTable.isValid()) {
                            cellData = [null,'',true];
                            if ( !metaCell.tableKey && !metaCell.columnKey
                                && (metaCell.cellType == YIUI.CONTROLTYPE.LABEL
                                || metaCell.cellType == YIUI.CONTROLTYPE.BUTTON
                                || metaCell.cellType == YIUI.CONTROLTYPE.HYPERLINK)) {
                                cellData[1] = metaRow.cells[i].caption;
                            }
                        // }
                    } else {
                        cellData = [metaCell.caption, metaCell.caption, false];
                    }
                    rowData.data.push(cellData);
                }
                return rowData;
            } ;

            var rowData = null;
            switch(metaRow.rowType){
                case "Group":
                case "Total":
                    rowData = addTotalRow(metaRow, groupLevel);
                    break;
                case "Detail":
                    rowData = addDetailRow(metaRow, groupLevel);
                    break;
                case "Fix":
                    rowData = addFixRow(metaRow, groupLevel);
                    break;
                default:
                    console.log("error row type");
            }

            var data = grid.dataModel.data, len = data.length,
            dtrRowIndex = grid.getMetaObj().detailMetaRowIndex;

            var newRowIndex = 0;
            if (rowIndex >= 0) {
                newRowIndex = rowIndex;
                data.splice(rowIndex, 0, rowData);
            } else {
                newRowIndex = data.length;
                data.push(rowData);
            }
            if( grid.hasFixRow ) {
                YIUI.GridLookupUtil.updateFixPos(YIUI.FormStack.getForm(grid.ofFormID),grid);
            }

            return newRowIndex;

        },
        reConstructGrid: function (grid) {
            Return.buildGroupHeaders(grid);
            if (grid.getOuterEl()[0] == null) return;
            var width = grid.getOuterEl().width() + 2, height = grid.getOuterEl().height() + 2;
            grid.getOuterEl().remove();
            grid.onRender(grid.container);
            grid.el[0].grid.populate();
            grid.el.setGridWidth(width);
            grid.el.setGridHeight(height);
        },
        buildGroupHeaders: function (grid) {
            var groupHeaders = [];
            var calcLeafColumns = function (column, leafColumns) {
                for (var i = 0, len = column.columns.length; i < len; i++) {
                    var subCol = column.columns[i];
                    if (subCol.columns == null || subCol.columns.length == 0) {
                        leafColumns.push(subCol);
                    } else {
                        calcLeafColumns(subCol, leafColumns);
                    }
                }
            };
            var gridLeafColumns = [], rootColumn = {columns: grid.getMetaObj().columns};
            calcLeafColumns(rootColumn, gridLeafColumns);
            var initGroupHeaderArray = function (columns, groupHeaders) {
                var groupHeaderArray = [], nextColumns = [], column;
                for (var i = 0, len = columns.length; i < len; i++) {
                    column = columns[i];
                    if (column.columns != null && column.columns.length > 0) {
                        var leafColumns = [], groupHeaderObj = {}, index = -1;
                        calcLeafColumns(column, leafColumns);
                        index = gridLeafColumns.indexOf(leafColumns[0]);
                        groupHeaderObj.startColumnName = "column" + index;
                        groupHeaderObj.numberOfColumns = leafColumns.length;
                        groupHeaderObj.titleText = column.caption;
                        groupHeaderArray.push(groupHeaderObj);
                        nextColumns = nextColumns.concat(column.columns);
                    }
                }
                if (groupHeaderArray.length > 0) {
                    groupHeaders.push(groupHeaderArray);
                }
                if (nextColumns.length > 0) {
                    initGroupHeaderArray(nextColumns, groupHeaders);
                }
            };
            initGroupHeaderArray(grid.getMetaObj().columns, groupHeaders);
            grid.groupHeaders = groupHeaders;
        },

        isEmptyRow: function(rowData){
            if( rowData ) {
                return rowData.rowType == 'Detail' ? rowData.bookmark == null : true;
            }
            return true;
        }
    };
    return Return;
})();