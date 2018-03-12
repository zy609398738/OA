/**
 * Created by 陈瑞 on 2018/1/25.
 */
(function () {
    YIUI.ShowGridData = YIUI.extend({
        form: null,
        grid: null,
        init: function (form, grid) {
            this.form = form;
            this.grid = grid;
        },
        load: function (construct) {
            var show;
            if( this.form.type == YIUI.Form_Type.Report ) {
                show = new YIUI.ShowReportGridData(this.form,this.grid);
            } else {
                show = new YIUI.ShowNormalGridData(this.form,this.grid);
            }
            show.load(construct);
        }
    });

    YIUI.ShowNormalGridData = YIUI.extend({
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
            if (construct) {
                this.constructGrid();
            }
            var rowGroup = new YIUI.GridRowGroup(this.form, this.grid);
            rowGroup.group();

            var builder = new YIUI.GridRowBuilder(this.form, this.grid);
            builder.build();
        },
        constructGrid: function () {
            if (this.grid.hasColExpand) {
                var columnExpand = new YIUI.GridColumnExpand(this.form, this.grid);
                columnExpand.expand();

                this.grid.initLeafColumns();
                this.grid.initDataModel();

                YIUI.GridLookupUtil.buildCellLookup(this.form, this.grid);// 更新单元格位置信息
            }

            // if (this.grid.hasRowExpand) {
            //     var rowExpand = new YIUI.GridRowExpand(this.form, this.grid);
            //     rowExpand.dealRowExpand();
            // }

            YIUI.GridUtil.buildGroupHeaders(this.grid);//重建表头
        },
    });
    YIUI.GridRowBuilder = YIUI.extend({
        form: null,
        grid: null,
        init: function (form, grid) {
            this.form = form;
            this.grid = grid;
        },
        build: function () {
            this.grid.clearGridData();

            var table = this.form.getDocument().getByKey(this.grid.tableKey),
                metaObj = this.grid.getMetaObj(),
                rootRowLayer = metaObj.rowLayer,
                metaRow,
                rowObject;

            for (var i = 0;rowObject = rootRowLayer.objectArray[i]; i++) {
                switch (rowObject.objectType) {
                case YIUI.MetaGridRowObjectType.ROW:
                    metaRow = metaObj.rows[rowObject.rowIndex];
                    var rowIndex = YIUI.GridUtil.insertRow(this.grid, -1, metaRow, null, 0);
                    this.grid.getHandler().showFixRowData(this.form, this.grid, rowIndex);
                    break;
                case YIUI.MetaGridRowObjectType.AREA:
                    var root = this.grid.dataModel.rootBkmk;
                    this.loadGroup(table, rowObject, root, 0);
                    break;
                default:
                    break;
                }
            }
        },
        loadGroup:function (table,rowObject,groupBkmk,level) {
            var metaRow,
                obj;
            for (var j = 0;obj = rowObject.objectArray[j];j++) {
                switch (obj.objectType) {
                case YIUI.MetaGridRowObjectType.ROW:
                    metaRow = this.grid.getMetaObj().rows[obj.rowIndex];
                    YIUI.GridUtil.insertRow(this.grid, -1, metaRow, null, 0);
                    break;
                case YIUI.MetaGridRowObjectType.GROUP:
                    for (var k = 0, size = groupBkmk.getRowCount(); k < size; k++) {
                        level++;
                        this.buildRows(this.grid, table, groupBkmk.getRowAt(k), level);
                        level--;
                    }
                    break;
                default:
                    break;
                }
            }
        },
        buildRows: function (grid, table, group, level) {

            // 构建普通行
            var buildNormalRow = function (form, grid, table, group) {
                var metaGroup = group.getMetaGroup(),
                    metaObj = grid.getMetaObj(),
                    metaRow,
                    rowObj;
                for (var i = 0; rowObj = metaGroup.objectArray[i]; i++) {
                    metaRow = grid.getMetaObj().rows[rowObj.rowIndex];
                    switch (metaRow.rowType) {
                        case "Group":
                            YIUI.GridUtil.insertRow(grid, -1, metaRow, null, level);
                            break;
                        case "Detail":
                            level++;
                            var rowCount = group.getRowCount(),
                                start = 0,
                                end = rowCount;

                            if (grid.getMetaObj().pageLoadType == YIUI.PageLoadType.UI) {
                                var curPageIndex = grid.pageInfo.curPageIndex,
                                    pageRowCount = metaObj.pageRowCount;
                                curPageIndex = curPageIndex == null ? 0 : curPageIndex;
                                start = curPageIndex <= 0 ? 0 : curPageIndex * pageRowCount;
                                end = start + pageRowCount > rowCount ? rowCount : start + pageRowCount;
                            }

                            for (var m = start; m < end; m++) {
                                var rowIndex = YIUI.GridUtil.insertRow(grid, -1, metaRow, group.getRowAt(m), level);

                                grid.getHandler().showDetailRowData(form, grid, rowIndex);
                            }
                            level--;
                            break;
                    }
                }
            }

            // 构建树形行
            var buildTreeRow = function (form, grid, table, group) {

                var impl_build = function (grid, metaRow, table, group) {
                    var treeIndex = grid.treeIndex,
                        metaCell = metaRow.cells[treeIndex],
                        metaTree = metaCell.tree,
                        map = {},
                        bkmkList;

                    switch (metaTree.treeType) {
                        case YIUI.GridTreeType.DICT:
                            if (metaCell.cellType != YIUI.CONTROLTYPE.DICT) {
                                YIUI.ViewException.throwException(YIUI.ViewException.GRID_TREE_COLUMN_DEFINE_ERROR);
                            }
                            var editOpt = metaCell.editOptions,
                                itemKey = editOpt.itemKey,
                                bkmkRow,
                                OID,
                                item;

                            for (var i = 0, count = group.getRowCount(); i < count; i++) {
                                bkmkRow = group.getRowAt(i);
                                table.setByBkmk(bkmkRow.getBookmark());

                                OID = YIUI.TypeConvertor.toLong(table.getByKey(metaCell.columnKey));

                                item = YIUI.DictService.getSyncItem(itemKey, OID);
                                if ( item ) {
                                    var parentID = YIUI.TypeConvertor.toLong(getParentID(item));
                                    bkmkList = map[parentID];
                                    if( !bkmkList ) {
                                        bkmkList = [];
                                        map[parentID] = bkmkList;
                                    }
                                    bkmkList.push(bkmkRow);
                                }
                            }

                            bkmkList = map["0"];
                            if( bkmkList ) {
                                impl_buildTreeRow(form, grid, table, metaCell.columnKey, map, metaTree.isExpand, null, bkmkList, metaRow);
                            }
                            break;
                        case YIUI.GridTreeType.COMMON:
                            var foreign = metaTree.foreign,
                                parent = metaTree.parent,
                                fgnValue;

                            for (var i = 0, count = group.getRowCount(); i < count; i++) {
                                bkmkRow = group.getRowAt(i);
                                table.setByBkmk(bkmkRow.getBookmark());

                                fgnValue = table.getByKey(foreign);
                                fgnValue = YIUI.TypeConvertor.toBoolean(fgnValue) ? fgnValue : "_root";
                                bkmkList = map[fgnValue];
                                if( !bkmkList ) {
                                    bkmkList = [];
                                    map[fgnValue] = bkmkList;
                                }
                                bkmkList.push(bkmkRow);
                            }

                            bkmkList = map["_root"];
                            if( bkmkList ) {
                                impl_buildTreeRow(form, grid, table, parent, map, metaTree.isExpand, null, bkmkList, metaRow);
                            }
                            break;
                        default :
                            break;
                    }
                }

                var getParentID = function (item) {
                    var table = item.itemTables[item.mainTableKey],
                        parentID;
                    if (table.tableMode == YIUI.TableMode.HEAD) {
                        parentID = table.itemRows[0]["ParentID"];
                    }
                    return parentID;
                };

                var impl_buildTreeRow = function (form, grid, table, columnKey, map, expand, parentRow, bkmks, detailRow) {
                    for (var i = 0, length = bkmks.length; i < length; i++) {
                        var bkmkRow = bkmks[i],
                            rowIndex = YIUI.GridUtil.insertRow(grid, -1, metaRow, bkmkRow, 0),
                            rowData = grid.getRowDataAt(rowIndex);

                        grid.getHandler().showDetailRowData(form, grid, rowIndex);

                        if ( parentRow ) {
                            rowData.treeLevel = parentRow.treeLevel + 1;
                            var childRows = parentRow.childRows;
                            if ( !childRows ) {
                                childRows = [];
                                parentRow.childRows = childRows;
                            }
                            childRows.push(rowData.rowID);
                            rowData.parentRow = parentRow;
                        } else {
                            rowData.treeLevel = 0;
                        }

                        table.setByBkmk(bkmkRow.getBookmark());
                        var value = table.getByKey(columnKey),
                            bkmkList = map[value];

                        if (bkmkList) {
                            impl_buildTreeRow(form, grid, table, columnKey, map, expand, rowData, bkmkList, detailRow);
                        } else {
                            rowData.isLeaf = true;
                        }
                    }
                }

                var metaGroup = group.getMetaGroup(),
                    objectCount = metaGroup.objectArray.length,
                    metaRow,
                    rowObj;

                for (var i = 0; rowObj = metaGroup.objectArray[i]; i++) {
                    metaRow = grid.getMetaObj().rows[rowObj.rowIndex];
                    if (metaRow.rowType == 'Detail') {
                        impl_build(grid, metaRow, table, group);
                    }
                }
            }

            // 构建拓展行
            var buildExpandRow = function (form, grid) {
                // TODO
            }

            if( group.isLeaf ) {
                if (grid.getMetaObj().treeType != -1) {
                    buildTreeRow(this.form, this.grid, table, group);
                } else if (grid.hasRowExpand) {
                    buildExpandRow();
                } else {
                    buildNormalRow(this.form, this.grid, table, group);
                }
            } else {
                this.loadGroup(table,group.getMetaGroup(),group,level);
            }
        }
    });

    YIUI.ShowReportGridData = YIUI.extend({
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
            if (construct) {
                this.constructGrid();
            }
            var rowGroup = new YIUI.GridRowGroup(this.form, this.grid);
            rowGroup.group();

            var builder = new YIUI.ReportRowBuilder(this.form, this.grid);
            builder.build();
        },
        constructGrid: function () {
            if (this.grid.hasColExpand) {
                var columnExpand = new YIUI.GridColumnExpand(this.form, this.grid);
                columnExpand.expand();

                this.grid.initLeafColumns();
                this.grid.initDataModel();

                YIUI.GridLookupUtil.buildCellLookup(this.form, this.grid);// 更新单元格位置信息
            }

            // if (this.grid.hasRowExpand) {
            //     var rowExpand = new YIUI.GridRowExpand(this.form, this.grid);
            //     rowExpand.dealRowExpand();
            // }

            YIUI.GridUtil.buildGroupHeaders(this.grid);//重建表头
        },

        initLeafColumns: function () {
            var leafColumns = [];
            YIUI.GridUtil.initLeafColumns(this.grid.getMetaObj().columns, leafColumns);
            this.grid.getMetaObj().leafColumns = leafColumns;
        },

        buildColumnHeader: function () {
            var gridColumns = [], colObj;
            var leafColumns = this.grid.getMetaObj().leafColumns;
            for (var i = 0, metaColumn; metaColumn = leafColumns[i]; i++) {
                colObj = {};
                colObj.key = metaColumn.key;
                colObj.label = metaColumn.caption;
                colObj.formulaCaption = metaColumn.formulaCaption;
                if (metaColumn.refColumn != null) {
                    colObj.isExpandCol = true;
                    colObj.refColumn = metaColumn.refColumn.key;
                }
                colObj.name = "column" + i;
                colObj.parentKey = metaColumn.parentKey;
                colObj.index = i;
                colObj.width = metaColumn.width;
                colObj.hidden = false;
                colObj.sortable = metaColumn.sortable;
                colObj.visible = metaColumn.visible;
                colObj.columnType = metaColumn.columnType;
                gridColumns.push(colObj);
            }

            var cells = {},metaRow,metaCell,cell;
            for (var j = 0;metaRow = this.grid.getMetaObj().rows[j]; j++) {
                for (var m = 0;metaCell = metaRow.cells[m]; m++) {
                    cell = $.extend(true, {}, metaCell);
                    cell.colIndex = m;
                    cells[cell.key] = cell;
                }
            }
            this.grid.dataModel.colModel.columns = gridColumns;
            this.grid.dataModel.colModel.cells = cells;
        },
    });

    YIUI.ReportRowBuilder = YIUI.extend({
        form: null,
        grid: null,
        init: function (form, grid) {
            this.form = form;
            this.grid = grid;
        },
        build: function () {
            this.grid.clearGridData();

            var table = this.form.getDocument().getByKey(this.grid.tableKey),
                metaObj = this.grid.getMetaObj(),
                rootRowLayer = metaObj.rowLayer,
                metaRow,
                rowObject;

            for (var i = 0;rowObject = rootRowLayer.objectArray[i]; i++) {
                switch (rowObject.objectType) {
                case YIUI.MetaGridRowObjectType.ROW:
                    metaRow = metaObj.rows[rowObject.rowIndex];
                    var rowIndex = YIUI.GridUtil.insertRow(this.grid, -1, metaRow, null, 0);
                    this.grid.getHandler().showFixRowData(this.form, this.grid, rowIndex);
                    break;
                case YIUI.MetaGridRowObjectType.AREA:
                    var root = this.grid.dataModel.rootBkmk;
                    this.loadGroup(table, rowObject, root, 0);
                    break;
                default:
                    break;
                }
            }
        },
        loadGroup:function (table,rowObject,groupBkmk,level) {
            var metaRow,
                obj;
            for (var j = 0;obj = rowObject.objectArray[j];j++) {
                switch (obj.objectType) {
                case YIUI.MetaGridRowObjectType.ROW:
                    metaRow = this.grid.getMetaObj().rows[obj.rowIndex];
                    YIUI.GridUtil.insertRow(this.grid, -1, metaRow, null, 0);
                    break;
                case YIUI.MetaGridRowObjectType.GROUP:
                    for (var k = 0, size = groupBkmk.getRowCount(); k < size; k++) {
                        level++;
                        this.buildRows(this.grid, table, groupBkmk.getRowAt(k), level);
                        level--;
                    }
                    break;
                default:
                    break;
                }
            }
        },
        buildRows: function (grid, table, group, level) {

            // 构建普通行
            var buildNormalRow = function (form, grid, table, group) {
                var metaGroup = group.getMetaGroup(),
                    metaObj = grid.getMetaObj(),
                    metaRow,
                    rowObj;
                for (var i = 0; rowObj = metaGroup.objectArray[i]; i++) {
                    metaRow = grid.getMetaObj().rows[rowObj.rowIndex];
                    switch (metaRow.rowType) {
                        case "Group":
                            YIUI.GridUtil.insertRow(grid, -1, metaRow, null, level);
                            break;
                        case "Detail":
                            level++;
                            var rowCount = group.getRowCount(),
                                start = 0,
                                end = rowCount;

                            if (grid.getMetaObj().pageLoadType == YIUI.PageLoadType.UI) {
                                var curPageIndex = grid.pageInfo.curPageIndex,
                                    pageRowCount = metaObj.pageRowCount;
                                curPageIndex = curPageIndex == null ? 0 : curPageIndex;
                                start = curPageIndex <= 0 ? 0 : curPageIndex * pageRowCount;
                                end = start + pageRowCount > rowCount ? rowCount : start + pageRowCount;
                            }

                            for (var m = start; m < end; m++) {
                                var rowIndex = YIUI.GridUtil.insertRow(grid, -1, metaRow, group.getRowAt(m), level);

                                grid.getHandler().showDetailRowData(form, grid, rowIndex);
                            }
                            level--;
                            break;
                    }
                }
            }

            // 构建树形行
            var buildTreeRow = function (form, grid, table, group) {

                var impl_build = function (grid, metaRow, table, group) {
                    var treeIndex = grid.treeIndex,
                        metaCell = metaRow.cells[treeIndex],
                        metaTree = metaCell.tree,
                        map = {},
                        bkmkList;

                    switch (metaTree.treeType) {
                        case YIUI.GridTreeType.DICT:
                            if (metaCell.cellType != YIUI.CONTROLTYPE.DICT) {
                                YIUI.ViewException.throwException(YIUI.ViewException.GRID_TREE_COLUMN_DEFINE_ERROR);
                            }
                            var editOpt = metaCell.editOptions,
                                itemKey = editOpt.itemKey,
                                bkmkRow,
                                OID,
                                item;

                            for (var i = 0, count = group.getRowCount(); i < count; i++) {
                                bkmkRow = group.getRowAt(i);
                                table.setByBkmk(bkmkRow.getBookmark());

                                OID = YIUI.TypeConvertor.toLong(table.getByKey(metaCell.columnKey));

                                item = YIUI.DictService.getSyncItem(itemKey, OID);
                                if ( item ) {
                                    var parentID = YIUI.TypeConvertor.toLong(getParentID(item));
                                    bkmkList = map[parentID];
                                    if( !bkmkList ) {
                                        bkmkList = [];
                                        map[parentID] = bkmkList;
                                    }
                                    bkmkList.push(bkmkRow);
                                }
                            }

                            bkmkList = map["0"];
                            if( bkmkList ) {
                                impl_buildTreeRow(form, grid, table, metaCell.columnKey, map, metaTree.isExpand, null, bkmkList, metaRow);
                            }
                            break;
                        case YIUI.GridTreeType.COMMON:
                            var foreign = metaTree.foreign,
                                parent = metaTree.parent,
                                fgnValue;

                            for (var i = 0, count = group.getRowCount(); i < count; i++) {
                                bkmkRow = group.getRowAt(i);
                                table.setByBkmk(bkmkRow.getBookmark());

                                fgnValue = table.getByKey(foreign);
                                fgnValue = YIUI.TypeConvertor.toBoolean(fgnValue) ? fgnValue : "_root";
                                bkmkList = map[fgnValue];
                                if( !bkmkList ) {
                                    bkmkList = [];
                                    map[fgnValue] = bkmkList;
                                }
                                bkmkList.push(bkmkRow);
                            }

                            bkmkList = map["_root"];
                            if( bkmkList ) {
                                impl_buildTreeRow(form, grid, table, parent, map, metaTree.isExpand, null, bkmkList, metaRow);
                            }
                            break;
                        default :
                            break;
                    }
                }

                var getParentID = function (item) {
                    var table = item.itemTables[item.mainTableKey],
                        parentID;
                    if (table.tableMode == YIUI.TableMode.HEAD) {
                        parentID = table.itemRows[0]["ParentID"];
                    }
                    return parentID;
                };

                var impl_buildTreeRow = function (form, grid, table, columnKey, map, expand, parentRow, bkmks, detailRow) {
                    for (var i = 0, length = bkmks.length; i < length; i++) {
                        var bkmkRow = bkmks[i],
                            rowIndex = YIUI.GridUtil.insertRow(grid, -1, metaRow, bkmkRow, 0),
                            rowData = grid.getRowDataAt(rowIndex);

                        grid.getHandler().showDetailRowData(form, grid, rowIndex);

                        if ( parentRow ) {
                            rowData.treeLevel = parentRow.treeLevel + 1;
                            var childRows = parentRow.childRows;
                            if ( !childRows ) {
                                childRows = [];
                                parentRow.childRows = childRows;
                            }
                            childRows.push(rowData.rowID);
                            rowData.parentRow = parentRow;
                        } else {
                            rowData.treeLevel = 0;
                        }

                        table.setByBkmk(bkmkRow.getBookmark());
                        var value = table.getByKey(columnKey),
                            bkmkList = map[value];

                        if (bkmkList) {
                            impl_buildTreeRow(form, grid, table, columnKey, map, expand, rowData, bkmkList, detailRow);
                        } else {
                            rowData.isLeaf = true;
                        }
                    }
                }

                var metaGroup = group.getMetaGroup(),
                    objectCount = metaGroup.objectArray.length,
                    metaRow,
                    rowObj;

                for (var i = 0; rowObj = metaGroup.objectArray[i]; i++) {
                    metaRow = grid.getMetaObj().rows[rowObj.rowIndex];
                    if (metaRow.rowType == 'Detail') {
                        impl_build(grid, metaRow, table, group);
                    }
                }
            }

            if( group.isLeaf ) {
                if (grid.getMetaObj().treeType != -1) {
                    buildTreeRow(this.form, this.grid, table, group);
                } else {
                    buildNormalRow(this.form, this.grid, table, group);
                }
            } else {
                this.loadGroup(table,group.getMetaGroup(),group,level);
            }
        }
    });
})();
