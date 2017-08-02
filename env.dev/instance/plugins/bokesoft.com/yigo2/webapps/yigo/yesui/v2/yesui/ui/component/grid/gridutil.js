(function () {
    YIUI.ShowGridData = YIUI.extend({
        form: null,
        grid: null,
        init: function (form, grid) {
            this.form = form;
            this.grid = grid;
        },
        load: function (construct) {
            var doc = this.form.getDocument();
            if (doc == null)
                return;
            var dataTable = doc.getByKey(this.grid.tableKey);
            if( construct ) {
                this.constructGrid();
            }
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
            this.initLeafColumns(); // 初始化子叶列

            if (this.grid.hasColExpand) {
                var columnExpand = new YIUI.GridColumnExpand(this.form, this.grid);
                columnExpand.expand();

                this.initLeafColumns();
                this.buildColumnHeader();

                YIUI.GridLookupUtil.buildCellLookup(this.form,this.grid);// 更新单元格位置信息
            }

            if (this.grid.hasRowExpand) {
                var rowExpand = new YIUI.GridRowExpand(this.form, this.grid);
                rowExpand.dealRowExpand();
            }

            YIUI.GridUtil.buildGroupHeaders(this.grid);//重建表头
        },

        initLeafColumns:function () {
            var leafColumns = [];
            YIUI.GridUtil.initLeafColumns(this.grid.getMetaObj().columns, leafColumns);
            this.grid.getMetaObj().leafColumns = leafColumns;
        },

        buildColumnHeader: function () {
            var gridColumns = [], cells = {}, colObj;
            var leafColumns = this.grid.getMetaObj().leafColumns;
            for (var i = 0,metaColumn;metaColumn = leafColumns[i]; i++) {
                colObj = {};
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

                    var newRowIndex = YIUI.GridUtil.insertRow(this.grid, -1, metaRow, null, 0);

                    this.grid.getHandler().showFixRowData(this.form, this.grid, newRowIndex);

                } else if (rowObj.objectType == YIUI.MetaGridRowObjectType.AREA) {
                    var root = this.grid.dataModel.rootBkmk, groupLevel = 0;
                    for (var j = 0, jLen = rowObj.objectArray.length; j < jLen; j++) {
                        var subObj = rowObj.objectArray[j];
                        if (subObj.objectType == YIUI.MetaGridRowObjectType.ROW) {
                            metaRow = this.grid.getMetaObj().rows[subObj.rowIndex];
                            YIUI.GridUtil.insertRow(this.grid, -1, metaRow, null, 0);
                        } else if (subObj.objectType == YIUI.MetaGridRowObjectType.GROUP) {
                            for (var k = 0, kLen = root.getRowCount(); k < kLen; k++) {
                                this.buildGroupRows(this.grid, dataTable, groupLevel, root.getRowAt(k));
                            }
                        }
                    }
                }
            }
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
            var metaGrid = this.grid.getMetaObj(), detailRow = this.grid.getDetailMetaRow();
            if (detailRow == null) {
                YIUI.ViewException.throwException(YIUI.ViewException.NO_DETAIL_ROW_DEFINE);
            }
            var dataTable = this.form.getDocument().getByKey(this.grid.tableKey);
            var treeIndex = this.grid.treeIndex, treeCell = detailRow.cells[treeIndex],
                metaTree = treeCell.tree,bkmkMap = {},id,bkmk;
            dataTable.beforeFirst();
            switch (metaTree.treeType) {
                case YIUI.GridTreeType.DICT:
                    if (treeCell.cellType != YIUI.CONTROLTYPE.DICT) {
                        YIUI.ViewException.throwException(YIUI.ViewException.GRID_TREE_COLUMN_DEFINE_ERROR);
                    }
                    var editOpt = treeCell.editOptions, itemKey = editOpt.itemKey,
                        dictFilter = YIUI.DictHandler.getDictFilter(this.form, treeCell.key, editOpt.itemFilters, itemKey);
                    while (dataTable.next()) {
                        id = YIUI.TypeConvertor.toLong(dataTable.getByKey(treeCell.columnKey));
                        bkmk = new YIUI.DetailRowBkmk();
                        bkmk.setBookmark(dataTable.getBkmk());
                        bkmkMap[id] = bkmk;
                    }
                    this.buildTreeRelation(bkmkMap, dictFilter, metaTree.isExpand, itemKey, editOpt.sortColumns, detailRow);
                    break;
                case YIUI.GridTreeType.COMMON:
                    var fgn2RowMap = {},fgnValue,rows,key;
                    while (dataTable.next()) {
                        id = dataTable.getByKey(metaTree.parent);
                        if( id != null ){
                            bkmk = new YIUI.DetailRowBkmk();
                            bkmk.setBookmark(dataTable.getBkmk());
                            bkmkMap[id] = bkmk;
                        }
                        fgnValue = dataTable.getByKey(metaTree.foreign);
                        key = YIUI.TypeConvertor.toBoolean(fgnValue) ? fgnValue : "_root";
                        rows = fgn2RowMap[key];
                        if( !rows ) {
                            rows = [];
                            fgn2RowMap[key] = rows;
                        }
                        rows.push(id);
                    }
                    var rootItems = fgn2RowMap["_root"];// 根节点
                    if( rootItems ) {
                        this.buildCustomRow(fgn2RowMap,bkmkMap,metaTree.isExpand,rootItems,detailRow);
                    }
                    break;
                case YIUI.GridTreeType.CUSTOM:

                    break;
                default :
                    break;
            }
        },

        buildCustomRow:function (fgn2RowMap, bkmkMap, expand, items, metaRow, parentRow) {
            var bkmkRow,newRowIndex,rowData;
            for (var i = 0, len = items.length; i < len; i++) {
                bkmkRow = bkmkMap[items[i]];
                newRowIndex = YIUI.GridUtil.insertRow(this.grid, -1, metaRow, bkmkRow, 0);
                rowData = this.grid.dataModel.data[newRowIndex];
                rowData.treeLevel = parentRow ? parentRow.treeLevel + 1 : 0;
                this.grid.getHandler().showDetailRowData(this.form, this.grid, newRowIndex);
                if (parentRow != null) {
                    var childRows = parentRow.childRows;
                    if ( !childRows ) {
                        childRows = [];
                        parentRow.childRows = childRows;
                    }
                    childRows.push(rowData.rowID);
                    rowData.parentRow = parentRow;
                }
                var _items = fgn2RowMap[items[i]];
                if ( _items ) {
                    rowData.isExpand = expand;
                    this.buildCustomRow(fgn2RowMap, bkmkMap, expand, _items, metaRow, rowData);
                } else {
                    rowData.isLeaf = true;
                }
            }
        },
	       
        buildTreeRelation: function (bkmkMap, filter, expand, itemKey, sortColumns, metaRow) {
            var items = YIUI.DictService.getAllItems(itemKey, filter, YIUI.DictStateMask.Enable);
            var getParentID = function (item, colKey) {
                var table = item.itemTables[item.mainTableKey];
                var value;
                if (table.itemRows.length > 0) {
                    if (table.tableMode == YIUI.TableMode.HEAD) {
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
            if ( roots ) {
                this.buildTreeRow(PID2ItemMap, bkmkMap, expand, roots, metaRow, 0);// 根据层次关系构建表格行
            }
        },
        buildTreeRow: function (PID2ItemMap, bkmkMap, expand, items, metaRow, parentRow) {
            for (var i = 0, len = items.length; i < len; i++) {
                var item = items[i], 

                opts = {oid: item.oid, caption: item.caption, itemKey: item.itemKey},
                itemData = new YIUI.ItemData(opts);

                var bkmkRow = bkmkMap[itemData.oid];

                var newRowIndex = YIUI.GridUtil.insertRow(this.grid, -1, metaRow, bkmkRow, 0);
                var rowData = this.grid.dataModel.data[newRowIndex];
                rowData.treeLevel = parentRow ? parentRow.treeLevel + 1 : 0;
                if ( bkmkRow ) {
                    this.grid.getHandler().showDetailRowData(this.form, this.grid, newRowIndex);
                } else {
                    this.grid.setValueAt(newRowIndex,this.grid.treeIndex,itemData);
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
                    rowData.isExpand = expand;
                    this.buildTreeRow(PID2ItemMap, bkmkMap, expand, itemsList, metaRow, rowData);
                } else {
                    rowData.isLeaf = true;
                }
            }
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
                rowData.rowHeight = metaRow.rowHeight || 32;
                rowData.rowID = grid.randID();
                rowData.data = [];
                rowData.cellBkmks = [];
                rowData.backColor = "";

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
                var rowData = initRowData(metaRow, groupLevel), metaCell, value, meta;
         
                for (var i = 0, len = metaRow.cells.length; i < len; i++) {
                    metaCell = metaRow.cells[i],meta = metaCell.editOptions;

                    var value = null,caption = '';

                    switch (metaCell.cellType){
                    case YIUI.CONTROLTYPE.LABEL:
                    case YIUI.CONTROLTYPE.BUTTON:
                    case YIUI.CONTROLTYPE.HYPERLINK:
                        if( !metaCell.hasDB ) {
                            caption = metaRow.cells[i].caption;
                        }
                        break;
                    case YIUI.CONTROLTYPE.NUMBEREDITOR:
                        value = new Decimal(0);
                        if ( meta.zeroString ) {
                            caption = meta.zeroString;
                        } else if (meta.showZero) {
                            var opt = {};
                            opt.mDec = $.isDefined(meta.scale) ? meta.scale : 2;
                            caption = YIUI.DecimalFormat.format(0, opt) ;
                        }
                        break;
                    case YIUI.CONTROLTYPE.TEXTEDITOR:
                    case YIUI.CONTROLTYPE.TEXTBUTTON:
                    case YIUI.CONTROLTYPE.CHECKLISTBOX:
                        value = '';
                        break;
                    }
                    rowData.data.push([value,caption,true]);
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
                        cellData = [null,'',true];
                        if ( !metaCell.tableKey && !metaCell.columnKey
                            && (metaCell.cellType == YIUI.CONTROLTYPE.LABEL
                            || metaCell.cellType == YIUI.CONTROLTYPE.BUTTON
                            || metaCell.cellType == YIUI.CONTROLTYPE.HYPERLINK)) {
                            cellData[1] = metaRow.cells[i].caption;
                        }
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

            // 插行以后,更新固定行位置
            var form = YIUI.FormStack.getForm(grid.ofFormID);
            YIUI.GridLookupUtil.updateFixPos(form,grid);

            return newRowIndex;
        },
        buildGroupHeaders: function (grid) {

            var self = this,leafColumns = grid.getMetaObj().leafColumns;

            var initGroupHeaderArray = function (columns,groupHeaders) {
                var ghArray = [],groupHeader, nextColumns = [], _leafColumns;
                for (var i = 0,column;column = columns[i]; i++) {
                    if (column.columns == null || column.columns.length == 0)
                        continue;

                    _leafColumns = [];

                    self.initLeafColumns(column.columns, _leafColumns);

                    groupHeader = {
                        startColumnName: "column" + leafColumns.indexOf(_leafColumns[0]),
                        numberOfColumns: _leafColumns.length,
                        titleText:column.caption
                    };

                    ghArray.push(groupHeader);
                    nextColumns = nextColumns.concat(column.columns);
                }

                if (ghArray.length > 0) {
                    groupHeaders.push(ghArray);
                }

                if (nextColumns.length > 0) {
                    initGroupHeaderArray(nextColumns,groupHeaders);
                }
            }

            var groupHeaders = [],rootColumns = grid.getMetaObj().columns;
            initGroupHeaderArray(rootColumns,groupHeaders);
            grid.setGroupHeaders(groupHeaders);
        },

        initLeafColumns:function (columns, leafColumns) {
            for (var i = 0,column; column = columns[i]; i++) {
                if (column.columns != null && column.columns.length > 0) {
                    this.initLeafColumns(column.columns, leafColumns);
                } else {
                    leafColumns.push(column);
                }
            }
        },

        isEmptyRow: function(rowData){
            if( rowData ) {
                return rowData.rowType == 'Detail' ? (rowData.bookmark == null && rowData.bkmkRow == null) : false;
            }
            return false;
        }
    };
    return Return;
})();