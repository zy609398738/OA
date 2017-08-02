(function () {
    YIUI.FormAdapt = function (options) {
        var Return = {
            formID: -1,
            compList: {},
            cellMap: {},
            gridMap: [],
            cellSubDtlCompMap: {},
            LVMap: [],
            panelMap: [],
            optMap: {},
            rootPanel: null,
            defCtKey: null,
            init: function (rootPanelObj) {
                if (!rootPanelObj) return;
                this.rootPanel = YIUI.create(rootPanelObj);
                this.loadComp(this.compList, this.rootPanel);
            },

            loadComp: function (array, parentCom) {
                parentCom.ofFormID = this.formID;
                parentCom.id = parentCom.ofFormID + "_" + parentCom.getMetaObj().key;
                if (parentCom.type == YIUI.CONTROLTYPE.LISTVIEW || parentCom.type == YIUI.CONTROLTYPE.GRID) {
                    this.loadCellMap(this.cellMap, parentCom);
                }
                if (parentCom.items && (parentCom instanceof YIUI.Panel)) {
                    this.panelMap[parentCom.getMetaObj().key] = parentCom;
                    for (var i = 0; i < parentCom.items.length; i++) {
                        this.loadComp(array, parentCom.items[i]);
                    }
                } else {
                    if (parentCom.type == YIUI.CONTROLTYPE.TOOLBAR) {
                        this.loadOptMap(this.optMap, parentCom);
                    }
                }
                array[parentCom.getMetaObj().key] = parentCom;
                var cellKey = parentCom.getMetaObj().bindingCellKey;
                var p_gridKey = parentCom.getMetaObj().parentGridKey;
                if (cellKey != null && p_gridKey != null) {
                    var gridMap = this.cellSubDtlCompMap[p_gridKey];
                    if (gridMap == null) {
                        gridMap = {};
                        this.cellSubDtlCompMap[p_gridKey] = gridMap;
                    }
                    if (gridMap[cellKey] == null) {
                        gridMap[cellKey] = [];
                    }
                    gridMap[cellKey].push(parentCom);
                }
            },
            loadOptMap: function (array, parentCom) {
                for (var i = 0, item, len = parentCom.items.length; i < len; i++) {
                    item = parentCom.items[i];
                    array[item.key] = {barKey: parentCom.getMetaObj().key, opt: item};
                    if (item.items) {
                        for (var j = 0, subItem, jlen = item.items.length; j < jlen; j++) {
                            subItem = item.items[j];
                            array[subItem.key] = {barKey: parentCom.getMetaObj().key, opt: subItem};
                        }
                    }
                }
            },
            loadCellMap: function (array, parentCom) {
                var i, len, celllist, cellLocation;
                if (parentCom.type == YIUI.CONTROLTYPE.LISTVIEW) {
                    for (i = 0, len = parentCom.columnInfo.length; i < len; i++) {
                        var columnInfo = parentCom.columnInfo[i];
                        columnInfo.tableKey = parentCom.getMetaObj().tableKey;
                        cellLocation = {};
                        cellLocation.tableKey = parentCom.getMetaObj().tableKey;
                        cellLocation.key = parentCom.getMetaObj().key;
                        cellLocation.column = i;
                        cellLocation.columnKey = columnInfo.columnKey;
                        cellLocation.row = -1;
                        this.addCellLocation(columnInfo.key, cellLocation);
                    }
                    this.LVMap.push(parentCom);
                } else if (parentCom.type == YIUI.CONTROLTYPE.GRID) {
                    var cellKeys = parentCom.dataModel.colModel.cells;
                    var gridTmp = {
                        key: parentCom.getMetaObj().key,
                        tableKey: parentCom.getMetaObj().tableKey
                    };
                    this.gridMap.push(gridTmp);
                    for (var key in cellKeys) {
                        var cellKeyObj = cellKeys[key];
                        if (cellKeyObj == undefined || cellKeyObj == null || cellKeyObj.length == 0) continue;
                        cellLocation = this.getCellLocation(cellKeyObj.key);
                        if (!cellLocation) {
                            cellLocation = {};
                            this.addCellLocation(cellKeyObj.key, cellLocation);
                        }
                        cellLocation.key = parentCom.getMetaObj().key;
                        cellLocation.column = cellKeyObj.colIndex;
                        cellLocation.row = -1;
                        cellLocation.tableKey = parentCom.getMetaObj().tableKey;
                        cellLocation.columnKey = cellKeyObj.columnKey;
                        for (var m = 0, mlen = parentCom.metaRowInfo.rows.length; m < mlen; m++) {
                            var metaRow = parentCom.metaRowInfo.rows[m];
                            if (metaRow.cellKeys.indexOf(cellKeyObj.key) != -1 && metaRow.rowType != "Detail") {
                                cellLocation.row = m;
                                break;
                            }
                        }
                    }
                }
            },

            addCellLocation: function (key, cellLocation) {
                this.cellMap[key] = cellLocation;
                //if(this.cellMap[key]) {
                //	this.cellMap[key].push(cellLocation);
                //} else {
                //	this.cellMap[key] = new Array(cellLocation);
                //}
            },
            getOptMap: function () {
                return this.optMap;
            },
            getListView: function (arg) {
                if ($.isNumeric(arg)) {
                    var index = YIUI.TypeConvertor.toInt(arg);
                    return this.LVMap[index];
                } else {
                    for (var i = 0, len = this.LVMap.length; i < len; i++) {
                        var lv = this.LVMap[i];
                        if (lv.getMetaObj().tableKey == arg) {
                            return lv;
                        }
                    }
                }
            },

            getPanel: function (key) {
                return this.panelMap[key];
            },
            getCellSubDtlCompMap: function () {
                return this.cellSubDtlCompMap;
            },
            getGridMap: function () {
                return this.gridMap;
            },
            getCompList: function () {
                return this.compList;
            },
            getComp: function (comKey) {
                return this.compList[comKey];
            },
            getRoot: function () {
                return this.rootPanel;
            },
            setRootPanel: function (rootPanel) {
                this.rootPanel = rootPanel;
            },

            setCompValue: function (key, value, fireEvent) {
                if (this.getComp(key) == undefined) {
                    YIUI.ViewException.throwException(YIUI.ViewException.NO_COMPONENT_KEY, key);
                }
                this.getComp(key).setValue(value, true, fireEvent);
            },
            setCellValByIndex: function (key, rowIndex, colIndex, value, fireEvent) {
                var comp = this.getComp(key);
                var type = comp == undefined ? -1 : comp.type;
                switch (type) {
                    case YIUI.CONTROLTYPE.LISTVIEW:
                        comp.setValByIndex(rowIndex, colIndex, value, true, fireEvent);
                        break;
                    case YIUI.CONTROLTYPE.GRID:
                        if (comp.getRowDataAt(rowIndex).isDetail) {
                            comp.setValueAt(rowIndex, colIndex, value, true, fireEvent, true);
                        }
                        break;
                    default:
                        YIUI.ViewException.throwException(YIUI.ViewException.NO_CELL_CANNOT_SET_VALUE);
                }
            },
            getCellValByIndex: function (key, rowIndex, colIndex) {
                var comp = this.getComp(key);
                var type = comp == undefined ? -1 : comp.type, value;
                switch (type) {
                    case YIUI.CONTROLTYPE.LISTVIEW:
                        value = comp.getValue(rowIndex, colIndex);
                        break;
                    case YIUI.CONTROLTYPE.GRID:
                        value = comp.getValueAt(rowIndex, colIndex);
                        break;
                    default:
                        YIUI.ViewException.throwException(YIUI.ViewException.CANNNOT_GET_NO_CELL_VALUE);
                }
                return value;
            },
            setCellValByKey: function (key, rowIndex, colKey, value, fireEvent) {
                var comp = this.getComp(key);
                var type = comp == undefined ? -1 : comp.type;
                switch (type) {
                    case YIUI.CONTROLTYPE.LISTVIEW:
                        comp.setValByKey(rowIndex, colKey, value, true, fireEvent);
                        break;
                    case YIUI.CONTROLTYPE.GRID:
                        if (rowIndex != -1 && comp.getRowDataAt(rowIndex).isDetail) {
                            comp.setValueByKey(rowIndex, colKey, value, true, fireEvent);
                        }
                        break;
                    default:
                        YIUI.ViewException.throwException(YIUI.ViewException.NO_CELL_CANNOT_SET_VALUE);
                }
            },
            getCellValByKey: function (key, rowIndex, colKey) {
                var comp = this.getComp(key);
                var type = comp == undefined ? -1 : comp.type, value;
                switch (type) {
                    case YIUI.CONTROLTYPE.LISTVIEW:
                        value = comp.getValByKey(rowIndex, colKey);
                        break;
                    case YIUI.CONTROLTYPE.GRID:
                        value = comp.getValueByKey(rowIndex, colKey);
                        break;
                    default:
                        YIUI.ViewException.throwException(YIUI.ViewException.CANNNOT_GET_NO_CELL_VALUE);
                }
                return value;
            },
            getCellLocation: function (key) {
                return this.cellMap[key];
            },
            setDefContainer: function (defContainer) {
                this.defContainer = defContainer;
            },
            getDefContainer: function () {
                if (this.defCtKey) {
                    return this.getComp(this.defCtKey);
                }
                return null;
            },
            setContainer: function (container) {
                this.container = container;
            },
            getContainer: function () {
                return this.container;
            },
            toJSON: function () {
                var jsonArr = [],
                    rootPanel = this.rootPanel;
                this.compToJson(rootPanel, jsonArr);
                return jsonArr;
            },
            compToJson: function (panel, comps) {
                var items = panel.items, item, comp;
                for (var i = 0, len = items.length; i < len; i++) {
                    item = items[i];
                    if (item instanceof YIUI.Panel) {
                        this.compToJson(item, comps);
                    } else if (!(item.type == YIUI.CONTROLTYPE.LISTVIEW || item.type == YIUI.CONTROLTYPE.GRID)) {
                        comp = {};
                        comp.key = item.getMetaObj().key;
                        if (item.type == YIUI.CONTROLTYPE.DATEPICKER) {
                            if (item.getValue()) {
                                comp.value = item.getValue().getTime();
                            } else {
                                comp.value = null;
                            }
                        } else {
                            comp.value = item.getValue();
                        }
                        comp.caption = item.caption;
                        comps.push(comp);
                    }
                }
            }
        };
        Return = $.extend(Return, options);
        Return.init(Return.rootPanelObj);
        return Return;
    };
})();
