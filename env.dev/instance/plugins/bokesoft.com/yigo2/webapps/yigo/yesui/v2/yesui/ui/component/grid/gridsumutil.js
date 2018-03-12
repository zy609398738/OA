YIUI.GridSumUtil = (function () {
    var Return = {
        evalSum: function (form, grid) {
            if( !grid.hasGroupRow && !grid.hasTotalRow )
                return;
            var length = grid.getRowCount(),
                size = grid.getColumnCount(),
                row;
            for (var i = 0; i < length; i++) {
                row = grid.getRowDataAt(i);
                if (row.rowType == "Group" || row.rowType == "Total") {
                    for (var j = 0; j < size; j++) {
                        this.evalSumFieldValue(form, grid, i, j);
                    }
                }
            }
        },
        evalAffectTreeSum: function (form, grid, rowIndex, colIndex) { //计算树形表格的层级汇总
            if( grid.treeIndex != -1 ) {
                var row = grid.getRowDataAt(rowIndex),
                    treeLevel = row.treeLevel - 1;
                for( var i = rowIndex - 1;i >= 0;--i ) {
                    if( treeLevel < 0 ) {
                        break;
                    }
                    var gridRow = grid.getRowDataAt(i);
                    if( gridRow.treeLevel == treeLevel ) {
                        this.sumTreeRow(form,grid,i,colIndex);
                        treeLevel--;
                    }
                }
            }
        },
        evalAffectSum: function (form, grid, rowIndex, colIndex) {
            if ( grid.hasGroupRow ) {
                var row = grid.getRowDataAt(rowIndex),
                    curGroupLevel = row.rowGroupLevel,
                    preRd,
                    nextRd,
                    column;
                for (var i = rowIndex - 1; i >= 0; i--) {    //向上遍历，计算相关分组头中的汇总
                    preRd = grid.getRowDataAt(i);
                    if (preRd.rowType == "Group" && preRd.rowGroupLevel <= curGroupLevel) {
                        curGroupLevel = preRd.rowGroupLevel;
                        this.evalSumFieldValue(form, grid, i, colIndex);
                    }
                    if (preRd.rowGroupLevel == 0) {
                        break;
                    }
                }
                curGroupLevel = row.rowGroupLevel;
                for (var j = rowIndex + 1,count = grid.getRowCount(); j < count; j++) {   //向下遍历，计算相关分组尾中的汇总
                    nextRd = grid.getRowDataAt(j);
                    if (nextRd.rowType == "Group" && nextRd.rowGroupLevel <= curGroupLevel) {
                        curGroupLevel = nextRd.rowGroupLevel;
                        this.evalSumFieldValue(form, grid, j, colIndex);
                    }
                    if (nextRd.rowGroupLevel == 0) {
                        break;
                    }
                }
            }

            if( grid.hasTotalRow ) {
                var size = grid.getColumnCount();
                for (var m = 0,count = grid.getRowCount(); m < count; m++) {   //计算total行的汇总
                    row = grid.getRowDataAt(m);
                    if (row.rowType == "Total") {
                        for (var n = 0; n < size; n++) {
                            this.evalSumFieldValue(form, grid, m, n);
                        }
                    }
                }
            }
        },

        sumTreeRow:function (form, grid, rowIndex, colIndex) {
            var rowData = grid.getRowDataAt(rowIndex),
                metaRow = grid.getMetaObj().rows[rowData.metaRowIndex],
                metaCell = metaRow.cells[colIndex],
                formula = metaCell.defaultFormulaValue;
            if( formula && formula.indexOf('Sum') != -1 ) {
                var value = form.eval(formula, {form: form, inSide: true, rowIndex: rowIndex, colIndex: colIndex}, null);
                grid.setValueAt(rowIndex, colIndex, value, true, false);
            }
        },

        evalSumFieldValue: function (form, grid, rowIndex, colIndex) {
            var rowData = grid.dataModel.data[rowIndex],
                metaRow = grid.getMetaObj().rows[rowData.metaRowIndex],
                metaCell = metaRow.cells[colIndex],
                formula = metaCell.defaultFormulaValue;
            if ( formula ) {
                var value = form.eval(formula, {form: form, inSide: true, rowIndex: rowIndex, colIndex: colIndex}, null);
                grid.setValueAt(rowIndex, colIndex, value, false, false);
            }
        }
    };
    return Return;
})();