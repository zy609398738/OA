(function () {
    YIUI.DefaultStatusProxy = YIUI.extend({
        form: null,
        init: function (form) {
            this.form = form;
        },
        validateEnable: function (key, content, context, formEnable) {
            var result = false;
            if (content != null && content.length > 0) {
                result = YIUI.TypeConvertor.toBoolean(this.form.eval(content, context, null));
            } else {
                result = formEnable;
            }
            return this.checkAccessControl(context, key) ? result : false;
        },
        validateEnableByTree: function (key, syntaxTree, context, formEnable) {
            var result = false;
            if (syntaxTree != null) {
                result = YIUI.TypeConvertor.toBoolean(this.form.evalByTree(syntaxTree, context, null));
            } else {
                result = formEnable;
            }
            return this.checkAccessControl(context, key) ? result : false;
        },
        validateVisible: function (key, content, context) {
            if (content != null && content.length > 0) {
                return YIUI.TypeConvertor.toBoolean(this.form.eval(content, context, null));
            }
            return true;
        },
        validateVisibleByTree: function (key, syntaxTree, context) {
            if (syntaxTree != null) {
                return YIUI.TypeConvertor.toBoolean(this.form.evalByTree(syntaxTree, context, null));
            }
            return true;
        },
        checkAccessControl: function (context, key) {
            var cellLocation = this.form.getCellLocation(key),
                metaComp = this.form.getComponent(key),
                result = true, dataTable, value;
            if (cellLocation != null && context != null) {
                var grid = this.form.getComponent(cellLocation.key);
                if(grid.type != YIUI.CONTROLTYPE.GRID) return result;
                var metaCell = grid.getMetaCellByKey(key);
                if (metaCell != null && this.accessControl(this.form, metaCell)) {
                    if (cellLocation.row != null && cellLocation.row != -1) {
                        dataTable = this.form.getDocument().getByKey(metaCell.tableKey);
                        value = 0;
                        if (dataTable.first()) {
                            value = YIUI.TypeConvertor.toInt(dataTable.getByKey(metaCell.columnKey + "_CF"));
                        }
                        if ((value & YIUI.FormUIStatusMask.ENABLE) != 0) {
                            result = false;
                        }
                    } else if (context.rowIndex != null && context.rowIndex != -1) {
                        dataTable = this.form.getDocument().getByKey(grid.tableKey);
                        var rowData = grid.getRowDataAt(context.rowIndex);
                        if (rowData.isDetail && rowData.bookmark != null) {
                            if (grid.hasColExpand) {
                                var rowBkmk = rowData.bookmark[0];
                                dataTable.setByBkmk(rowBkmk);
                            } else {
                                dataTable.setByBkmk(rowData.bookmark);
                            }
                            value = YIUI.TypeConvertor.toInt(dataTable.getByKey(metaCell.columnKey + "_CF"));
                            if ((value & YIUI.FormUIStatusMask.ENABLE) != 0) {
                                result = false;
                            }
                        }
                    }
                }
            } else if (metaComp != null) {
                if (this.accessControlByComp(this.form, metaComp)) {
                    dataTable = this.form.getDocument().getByKey(metaComp.tableKey);
                    value = 0;
                    if (dataTable.first()) {
                        value = YIUI.TypeConvertor.toInt(dataTable.getByKey(metaComp.columnKey + "_CF"));
                    }
                    if ((value & YIUI.FormUIStatusMask.ENABLE) != 0) {
                        result = false;
                    }
                }
            }
            return result;
        },
        accessControl: function (form, metaCell) {
            if(metaCell && metaCell.tableKey && metaCell.columnKey){
                var doc = form.getDocument();
                if(doc){
                    var dataTable = doc.getByKey(metaCell.tableKey);
                    if (dataTable == null)
                        return false;
                    var cellKey = metaCell.columnKey;
                    if (cellKey == null || cellKey.length == 0)
                        return false;
                    return dataTable.getColByKey(cellKey).getAccessControl();
                }
            }
            return false;
        },
        accessControlByComp: function (form, comp) {
            if(comp && comp.tableKey && comp.columnKey){
                var doc = form.getDocument();
                if(doc){
                    var dataTable = doc.getByKey(comp.tableKey);
                    if (dataTable == null)
                        return false;
                    var cellKey = comp.columnKey;
                    if (cellKey == null || cellKey.length == 0)
                        return false;
                    return dataTable.getColByKey(cellKey).getAccessControl();
                }
            }
            return false;
        }
    });
    YIUI.HostStatusProxy = YIUI.extend({
        info: null,
        init: function (info) {
            this.info = info;
        },
        containsEnableKey: function (key) {
            var enableList = this.info["enableList"];
            return enableList ? $.inArray(key, enableList) != -1 : false;
        },
        containsUnVisibleKey: function (key) {
            var unVisibleList = this.info["visibleList"];
            return unVisibleList ? $.inArray(key, unVisibleList) != -1 : false;
        },
        containsOperationKey: function (key) {
            var optList = this.info["optList"];
            return optList ? $.inArray(key, optList) != -1 : false;
        }
    });
})();