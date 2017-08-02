(function () {
    YIUI.GridRowExpand = YIUI.extend({
        form: null,
        grid: null,
        init: function (form, grid) {
            this.form = form;
            this.grid = grid;
        },
        dealRowExpand: function () {
            var metaGrid = this.grid.getMetaObj(), detailRow = metaGrid.rows[metaGrid.detailMetaRowIndex],
                rowExpandIndex = metaGrid.rowExpandIndex, expandCell = detailRow.cells[rowExpandIndex],
                rowExpand = expandCell.rowExpand, values = this.grid.getRowExpandModel();
            values.length = 0;
            switch (rowExpand.expandType) {
                case YIUI.RowExpandType.DICT:
                    var itemKey = rowExpand.itemKey, filter, opt = expandCell.editOptions;
                    if (expandCell.cellType == YIUI.CONTROLTYPE.DICT) {
                        filter = YIUI.DictHandler.getDictFilter(this.form, expandCell.key, opt.itemFilters, opt.itemKey);
                    }
                    var items = YIUI.DictService.getDictChildren(itemKey, {itemKey: itemKey, oid: 0}, filter, YIUI.DictStateMask.Enable);
                    var sortColumns = rowExpand.sortColumns;
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
                    for (var j = 0, jlen = items.length; j < jlen; j++) {
                        values.push(items[j].oid);
                    }
                    break;
                case YIUI.RowExpandType.QUERY:
                    var metaQueryDef = rowExpand.queryDef, paras = metaQueryDef.parameters.paras , paraValues = [];
                    for (var i = 0, len = metaQueryDef.length; i < len; i++) {
                        var sourceType = paras[i].sourceType;
                        switch (sourceType) {
                            case YIUI.ParameterSourceType.CONST:
                                paraValues.push(paras[i].value);
                                break;
                            case YIUI.ParameterSourceType.FORMULA:
                                paraValues.push(this.form.eval(paras[i].formula, {form: this.form}, null));
                                break;
                            case YIUI.ParameterSourceType.FIELD:
                                var cellLoc = this.form.getCellLocation(paras[i].fieldKey), value;
                                if (cellLoc != null) {
                                    value = this.form.getCellValByKey(cellLoc.key, cellLoc.row, cellLoc.col);
                                } else {
                                    value = this.form.getComponentValue(paras[i].fieldKey);
                                }
                                if (typeof value == "object") {
                                    value = value.oid;
                                }
                                paraValues.push(value);
                                break;
                        }
                    }
                    var serviceParas = {
                        cmd: "GetRowExpandItems",
                        service: "GetRowExpandItems",
                        formKey: this.form.formKey,
                        cellKey: expandCell.key,
                        param: paraValues
                    };
                    var list = Svr.Request.getSyncData(Svr.SvrMgr.ServletURL, serviceParas);
                    for (var m = 0, mlen = list.length; m < mlen; m++) {
                        values.push(list[j]);
                    }
                    break;
                default:
                    YIUI.ViewException.throwException(YIUI.ViewException.UNDEFINED_ROW_EXPAND_TYPE);
            }
        }
    });
})();