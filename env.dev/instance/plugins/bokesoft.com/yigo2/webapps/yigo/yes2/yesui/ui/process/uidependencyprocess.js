/**
 * Created by 陈瑞 on 2017/3/14 use WebStorm.
 */
YIUI.UIDependencyProcess = (function () {

    // 单例对象
    var Return = {
        valueChanged:function (form,component) {
            var relations = form.dependency.relationTree;
            var targetFields,targetField,targetComp,cellLocation,grid;
            for (var dependencyField in relations) {
                if (dependencyField !== component.key)
                    continue;
                var targetFields = relations[dependencyField];
                for (var i = 0, len = targetFields.length; i < len; i++) {
                    targetField = targetFields[i];
                    targetComp = form.getComponent(targetField);
                    if (targetComp != null) {
                        targetComp.dependedValueChange(dependencyField);
                    } else {
                        cellLocation = form.getCellLocation(targetField);
                        grid = form.getComponent(cellLocation.key);
                        grid.dependedValueChange(targetField, dependencyField, null);
                    }
                }
            }
        },

        cellValueChanged:function (form, grid, rowIndex, colIndex, cellKey) {
            var relations = form.dependency.relationTree, targetFields, targetField;
            for (var dependencyField in relations) {
                if ( dependencyField !== cellKey )
                    continue;
                targetFields = relations[dependencyField];
                for (var i = 0, len = targetFields.length; i < len; i++) {
                    targetField = targetFields[i];
                    grid.doPostCellValueChanged(rowIndex, dependencyField, targetField, null);
                }
            }
        },

        doAfterInsertRow:function (grid, rowIndex) {
            var gridRow = grid.getRowDataAt(rowIndex), metaRow = grid.getMetaObj().rows[gridRow.metaRowIndex];
            for (var i = 0, len = metaRow.cells.length; i < len; i++) {
                var metaCell = metaRow.cells[i];
                if (metaCell.cellType == YIUI.CONTROLTYPE.DYNAMIC) {
                    //TODO 刷新动态单元格
                }
            }
        }
    }

    return Return;
})();