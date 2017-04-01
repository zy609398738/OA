(function () {
    YIUI.GridRowExpand = YIUI.extend({
        form: null,
        grid: null,
        init: function (form, grid) {
            this.form = form;
            this.grid = grid;
        },
        dealRowExpand: function () {
            var detailRow = this.grid.getDetailMetaRow();
            var expandCell = detailRow.cells[this.grid.rowExpandIndex];
            var rowExpand = expandCell.rowExpand, values = [];
            switch (rowExpand.expandType) {
                case YIUI.RowExpandType.DICT:
                    var itemKey = rowExpand.itemKey, filter, opt = expandCell.editOptions;
                    if (expandCell.cellType == YIUI.CONTROLTYPE.DICT) {
                        filter = YIUI.DictHandler.getDictFilter(this.form, expandCell.key, opt.itemFilters, opt.itemKey);
                    }
                    var items = YIUI.DictService.getAllItems(itemKey, filter, YIUI.DictStateMask.Enable);
                    var sortColumns = rowExpand.sortColumns;
                    if (sortColumns != null && sortColumns.length > 0) {
                        items.sort(function (item1, item2) {
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
                        });
                    }
                    for (var m = 0, size = items.length; m < size; m++) {
                        values.push(items[m].oid);
                    }
                    break;
                case YIUI.RowExpandType.QUERY:
                    var metaQueryDef = rowExpand.queryDef, paras = metaQueryDef.parameters.paras , paraValues = [];
                    for (var i = 0, len = paras.length; i < len; i++) {
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
                        param: $.toJSON(paraValues)
                    };
                    var list = Svr.Request.getSyncData(Svr.SvrMgr.ServletURL, serviceParas);
                    for (var m = 0, size = list.length; m < size; m++) {
                        values.push(list[m]);
                    }
                    break;
                case YIUI.RowExpandType.FORMULA:
                    var content = rowExpand.content;
                    if( !content ) {
                        YIUI.ViewException.throwException(YIUI.ViewException.NO_EXPANDSOURCE_RESULT_GET);
                    }
                    var cxt = new View.Context(this.form);
                    var result = this.form.eval($.trim(content),cxt,null);
                    if( !result )
                        return;
                    if( result instanceof DataDef.DataTable ) {
                        result.beforeFirst();
                        while (result.next()) {
                            values.push(result.get(0));
                        }
                    } else if ( $.isString(result) ) {
                        values = values.concat(result.split(","));
                    } else if ( $.isArray(result) ) {
                        values = values.concat(result);
                    }
                    break;
                default:
                    YIUI.ViewException.throwException(YIUI.ViewException.UNDEFINED_ROW_EXPAND_TYPE);
            }
            this.grid.setRowExpandModel(values);
        }
    });
})();