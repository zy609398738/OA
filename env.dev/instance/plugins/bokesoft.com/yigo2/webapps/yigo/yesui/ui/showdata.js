(function () {
    YIUI.ShowData = function (form) {
        var Return = {
            resetDocument: function () {
                var document = form.getDocument();
                if (document == null) {
                    return;
                }
                var table = null;
                for (var i = 0, len = document.tbls.length; i < len; i++) {
                    table = document.tbls[i];
                    table.first();
                }
            },
            loadHeader: function (cmp) {
                var document = form.getDocument();
                var tableKey = cmp.getMetaObj().tableKey;
                var table = tableKey && document.getByKey(tableKey);
                if (!table) {
                    return;
                }
                var columnKey = cmp.getMetaObj().columnKey, value = "";
                if (table.getRowCount() > 0) {
                    value = table.getByKey(columnKey);
                    if (cmp.type == YIUI.CONTROLTYPE.DYNAMICDICT) {
                        var itemKey = table.getByKey(columnKey + "ItemKey");
                        cmp.itemKey = itemKey;
                    }
                }
                cmp.setValue(value);
            },
            loadListView: function (listView) {
                var showLV = new YIUI.ShowListView(form, listView);
                showLV.load();
            },
            loadGrid: function (grid) {
                var showGrid = new YIUI.ShowGridData(form, grid);
                showGrid.load();
            },
            show: function () {
                this.resetDocument();
                var cmpList = form.getComponentList(), cmp;
                for (var i in cmpList) {
                    cmp = cmpList[i];
                    if (cmp.getMetaObj().isSubDetail) continue;
                    switch (cmp.type) {
                        case YIUI.CONTROLTYPE.LISTVIEW:
                            this.loadListView(cmp);
                            break;
                        case YIUI.CONTROLTYPE.GRID:
                            cmp.rootGroupBkmk = null;
                            this.loadGrid(cmp);
                            break;
                        case YIUI.CONTROLTYPE.CHART:
                            break;
                        default:
                            if (cmp instanceof YIUI.Control) {
                                if (cmp.needClean() && !cmp.condition) {
                                    cmp.setValue(null, false, false);
                                }
                                this.loadHeader(cmp);
                            }
                            break;
                    }
                }
                this.postShowData();
            },
            postShowData: function () {
                form.getUIProcess().doPostShowData(false);
                form.getUIProcess().calcToolBar();
                form.initFirstFocus();
            }
        };
        return Return;
    };
    YIUI.ShowListView = function (form, listView) {
        var Return = {
            load: function () {
                listView.clearAllRows();
                var document = form.getDocument();
                var tableKey = listView.getMetaObj().tableKey;
                if (!tableKey) return;
                var table = document.getByKey(tableKey);
                if (!table) return;
                listView.totalRowCount = table.allRows.length;
                var rows = [], row, col , colKey;
                for (var j = 0, length = table.getRowCount(); j < length; j++) {
                    row = {};
                    table.setPos(j);
                    for (var m = 0, length3 = listView.columnInfo.length; m < length3; m++) {
                        var column = listView.columnInfo[m];
                        var key = column.key;
                        row[key] = {};

                        var colKey = listView.columnInfo[m].columnKey;
                        //row[colKey].caption;
                        if (colKey) {
                            var caption = "", value = table.getByKey(colKey);
                            switch (column.columnType) {
                                case YIUI.CONTROLTYPE.DATEPICKER:
                                    if (value) {
                                        var date = new Date(parseInt(value));
                                        var format = "yyyy-MM-dd";
                                        if (!column.onlyDate) {
                                            format = "yyyy-MM-dd HH:mm:ss";
                                        }
                                        caption = date.Format(format);
                                        value = date.toString();
                                    }
                                    break;
                                case YIUI.CONTROLTYPE.DICT:
                                    var itemKey = column.itemKey;
                                    var oid = YIUI.TypeConvertor.toInt(value);
                                    caption = YIUI.DictService.getCaption(itemKey, oid);
                                    break;
                                case YIUI.CONTROLTYPE.COMBOBOX:
                                    var items = column.items;
                                    for (var i = 0, len = items.length, item; i < len; i++) {
                                        var item = items[i];
                                        if (item.value == value) {
                                            caption = item.caption;
                                            break;
                                        }
                                    }
                                    break;
                                case YIUI.CONTROLTYPE.NUMBEREDITOR:
                                    var decScale = column.decScale;
                                    var roundingMode = column.roundingMode;
                                    var d = null;
                                    if (value) {
                                        d = YIUI.TypeConvertor.toDecimal(value);
                                        caption = d.toFormat(decScale, roundingMode);
                                    }
                                    break;
                                default:
                                    caption = table.getByKey(colKey);
                                    break;
                            }
                            row[key].caption = caption;
                            row[key].value = value;
                        } else {
                            row[key].caption = column.caption;
                            row[key].value = column.caption;
                        }
                    }
                    rows.push(row);
                }
                if (!listView.getMetaObj().pageRowCount || listView.totalRowCount < listView.getMetaObj().pageRowCount) {
                    listView._pagination.hidePagination();
                } else if (listView.totalRowCount) {
                    listView._pagination.setTotalRowCount(listView.totalRowCount, true);
                }
                listView.data = rows;
                listView.addDataRow(rows);
                listView.addEmptyRow();
            }
        };
        return Return;
    };
//    YIUI.ShowGridData = function (form, grid) {
//        var Return = {
//            dealGridGroupRow: function () {
//
//            },
//            load: function () {
//                grid.clearGridData();
//                var document = form.getDocument();
//                var tableKey = grid.tableKey;
//                var addFixRow = function (metaFixRow, metaRowIndex) {
//                    var rowData = {};
//                    rowData.isDetail = false;
//                    rowData.isEditable = true;
//                    rowData.rowHeight = metaFixRow.rowHeight;
//                    rowData.rowID = grid.randID();
//                    rowData.metaRowIndex = metaRowIndex;
//                    rowData.rowType = metaFixRow.rowType;
//                    rowData.cellKeys = metaFixRow.cellKeys;
//                    rowData.data = [];
//                    rowData.cellBkmks = [];
//                    for (var ci = 0, clen = metaFixRow.cells.length; ci < clen; ci++) {
//                        var cellObj = metaFixRow.cells[ci];
//                        rowData.data[ci] = ["", cellObj.caption, false];
//                    }
//                    grid.dataModel.data.push(rowData);
//                    return rowData;
//                };
//                if (tableKey) {
//                    var table = document.getByKey(tableKey), beginIndex = 0, endIndex = table.getRowCount(), newRd,
//                        rootGroupBkmkArray = grid.rootGroupBkmk;
//                    if (rootGroupBkmkArray == null || rootGroupBkmkArray.length == 0) {
//                        rootGroupBkmkArray = [];
//                        table.beforeFirst();
//                        while (table.next()) {
//                            if (table.rows[table.pos].state != DataDef.R_Deleted) {
//                                rootGroupBkmkArray.push(table.getBkmk());
//                            }
//                        }
//                    }
//                    if (table) {
//                        if (grid.getPageInfo().pageLoadType == "UI") {
//                            beginIndex = (grid.getPageInfo().currentPage - 1) * grid.getPageInfo().pageRowCount;
//                            endIndex = grid.getPageInfo().currentPage * grid.getPageInfo().pageRowCount;
//                            if (endIndex > rootGroupBkmkArray.length) {
//                                endIndex = rootGroupBkmkArray.length;
//                            }
//                            grid.getPageInfo().totalRowCount = table.rows.length;
//                            grid.getPageInfo().totalPage = Math.ceil(table.rows.length/grid.getPageInfo().pageRowCount);
//                        }
//                        for (var index = 0, len = grid.metaRowInfo.rows.length; index < len; index++) {
//                            var metaRow = grid.metaRowInfo.rows[index];
//                            if (metaRow.rowType == "Fix" || metaRow.rowType == "Total") {
//                                var fixRow = addFixRow(metaRow, index);
//                                grid.el[0].insertGridRow(grid.getRowCount() - 1, fixRow);
//                            } else if (metaRow.rowType == "Group") {
//                                var fixRow = addFixRow(metaRow, index);
//                                grid.el[0].insertGridRow(grid.getRowCount() - 1, fixRow);
//                            } else if (metaRow.rowType == "Detail") {
//                                for (var i = beginIndex; i < endIndex; i++) {
//                                    newRd = grid.addGridRow(null, -1, false);
//                                    newRd.bookmark = rootGroupBkmkArray[i];
//                                    var rowIndex = grid.getRowIndexByID(newRd.rowID);
//                                    grid.showDetailRow(rowIndex, false);
//                                }
//                            }
//                        }
//                        grid.gridHandler.dealWithSequence(form, grid);
//                        grid.setGridEnable(grid.isEnable());
//                    }
//                }
//            }
//        };
//        return Return;
//    };
})();