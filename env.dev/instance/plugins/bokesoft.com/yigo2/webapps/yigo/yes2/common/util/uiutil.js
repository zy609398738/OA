/**
 * Created by 陈瑞 on 2017/3/4 use WebStorm.
 */
var YIUI = YIUI || {};
YIUI.UIUtils = (function () {
    var Return = {
        checkAccessControl: function (form,context, key) {
            var cellLocation = form.getCellLocation(key),
                metaComp = form.getComponent(key),
                result = true, dataTable, value;
            if (cellLocation != null && context != null) {
                var grid = form.getComponent(cellLocation.key),
                    metaCell = grid.getMetaCellByKey(key);
                if (metaCell != null && this.accessControl(form, metaCell)) {
                    if (cellLocation.row != null && cellLocation.row != -1) {
                        dataTable = form.getDocument().getByKey(metaCell.tableKey);
                        value = 0;
                        if (dataTable.first()) {
                            value = YIUI.TypeConvertor.toInt(dataTable.getByKey(metaCell.columnKey + "_CF"));
                        }
                        if ((value & YIUI.FormUIStatusMask.ENABLE) != 0) {
                            result = false;
                        }
                    } else if (context.rowIndex != null && context.rowIndex != -1) {
                        dataTable = form.getDocument().getByKey(grid.tableKey);
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
                if (this.accessControlByComp(form, metaComp)) {
                    dataTable = form.getDocument().getByKey(metaComp.tableKey);
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
    };
    return Return;
})();
