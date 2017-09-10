YIUI.GridSumUtil = (function () {
    var Return = {
        evalAffectSum: function (form, grid, rowIndex, colIndex) {
            if( !grid.hasGroupRow && !grid.hasTotalRow )
                return;
            var rd = grid.dataModel.data[rowIndex],
                curGlevel = rd.rowGroupLevel,
                len = grid.dataModel.data.length,
                clen = grid.dataModel.colModel.columns.length,
                preRd, nextRd, column;
            for (var i = rowIndex - 1; i >= 0; i--) {    //向上遍历，计算相关分组头中的汇总
                preRd = grid.dataModel.data[i];
                if (preRd.rowType == "Group" && preRd.rowGroupLevel <= curGlevel) {
                    curGlevel = preRd.rowGroupLevel;
                    this.evalSumFieldValue(form, grid, i, colIndex);
                }
                if (preRd.rowGroupLevel == 0) {
                    break;
                }
            }
            curGlevel = rd.rowGroupLevel;
            for (var j = rowIndex + 1; j < len; j++) {   //向下遍历，计算相关分组尾中的汇总
                nextRd = grid.dataModel.data[j];
                if(nextRd.isDetail && nextRd.bookmark == null) continue;
                if (nextRd.rowType == "Group" && nextRd.rowGroupLevel <= curGlevel) {
                    curGlevel = nextRd.rowGroupLevel;
                    this.evalSumFieldValue(form, grid, j, colIndex);
                }
                if (nextRd.rowGroupLevel == 0) {
                    break;
                }
            }
            for (var k = 0; k < clen; k++) {          //计算行方向上的汇总
                column = grid.dataModel.colModel.columns[k];
                if (column.columnType && column.columnType === 'Total') {
                    this.evalSumFieldValue(form, grid, rowIndex, k);
                }
            }
            for (var m = 0; m < len; m++) {               //计算total行的汇总
                rd = grid.dataModel.data[m];
                if (rd.rowType == "Total") {
                    for (var n = 0; n < clen; n++) {
                        this.evalSumFieldValue(form, grid, m, n);
                    }
                }
            }
        },
        evalSumFieldValue: function (form, grid, rowIndex, colIndex) {
            var rowData = grid.dataModel.data[rowIndex], metaRow = grid.getMetaObj().rows[rowData.metaRowIndex],
                metaCell = metaRow.cells[colIndex], defaultFormulaValue = metaCell.defaultFormulaValue;
            if (defaultFormulaValue !== undefined && defaultFormulaValue.length > 0 && defaultFormulaValue.indexOf("Sum") != -1) {
                var value = form.eval(defaultFormulaValue, {form: form, target: metaCell.key, rowIndex: rowIndex, colIndex: colIndex}, null);
                grid.setValueAt(rowIndex, colIndex, value, true, false);
            }
        },
        evalSum: function (form, grid) {
            if( !grid.hasGroupRow && !grid.hasTotalRow )
                return;
            var length = grid.dataModel.data.length, cLength = grid.dataModel.colModel.columns.length, row;
            for (var i = 0; i < length; i++) {
                row = grid.dataModel.data[i];
                if (row.rowType == "Group" || row.rowType == "Total") {
                    for (var j = 0; j < cLength; j++) {
                        this.evalSumFieldValue(form, grid, i, j);
                    }
                }
            }
        }
    };
    return Return;
})();