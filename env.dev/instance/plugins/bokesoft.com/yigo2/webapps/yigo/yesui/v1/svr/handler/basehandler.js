YIUI.Handler = (function () {
    var Return = {
        formatDate: function (date, format) {
            var o = {
                "M+": date.getMonth() + 1,
                "d+": date.getDate(),
                "h+": date.getHours(),
                "H+": date.getHours(),
                "m+": date.getMinutes(),
                "s+": date.getSeconds(),
                "q+": Math.floor((date.getMonth() + 3) / 3),
                "S": date.getMilliseconds()
            };
            if (/(y+)/.test(format)) {
                format = format.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
                for (var k in o) {
                    if (new RegExp("(" + k + ")").test(format)) {
                        format = format.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
                    }
                }
                return format;
            }
        },

        convertValue: function (value, type) {
            var ret;
            switch (type) {
                case DataType.STRING:
                    if (value == null || value == undefined) {
                        ret = '';
                    } else {
                        ret = '' + value;
                    }
                    break;
                case DataType.INT:
                case DataType.LONG:
                case DataType.DOUBLE:
                case DataType.FLOAT:
                case DataType.NUMERIC:
                    if (value == undefined || value == null || value == '') {
                        ret = 0;
                    } else {
                        if (value.toString().toLowerCase() == "true") value = 1;
                        if (value.toString().toLowerCase() == "false") value = 0;
                        ret = new Decimal(value, 10);
                    }
                    break;
                case DataType.BOOLEAN:
                    ret = value ? true : false;
                default:
                    ret = value;
            }
            return ret;
        },
        /**
         * 控件的点击事件(单击)
         */
        doOnClick: function (control) {
            var formID = control.ofFormID,
                form = YIUI.FormStack.getForm(formID),
                clickContent = control.clickContent;
            var cxt = {form: form};
            if (clickContent) {
                form.eval(clickContent, cxt, null);
            }
        },
        setValueToDocument: function (control, dataTable, columnKey, bookmark, newValue) {
            if (dataTable.indexByKey(columnKey) == -1) return;
            var type = control.type;
            var dataType = dataTable.cols[dataTable.indexByKey(columnKey)].type;
            bookmark == -1 ? dataTable.first() : dataTable.setByBkmk(bookmark);
            if (newValue == undefined || newValue == null) {
                newValue = Return.convertValue(newValue, dataType);
                dataTable.setByKey(columnKey, newValue);
            } else {
                switch (type) {
                    case YIUI.CONTROLTYPE.DICT:
                    case YIUI.CONTROLTYPE.DYNAMICDICT:
                    case YIUI.CONTROLTYPE.COMPDICT:
                        if (control.multiSelect) {
                            if (newValue.length > 0) {
                                var str = '';
                                for (var i = 0; i < newValue.length; i++) {
                                    str += ',' + newValue[i].oid;
                                }
                                str = str.substring(1);
                                dataTable.setByKey(columnKey, str);

                                if (type == YIUI.CONTROLTYPE.DYNAMICDICT || type == YIUI.CONTROLTYPE.COMPDICT) {
                                    dataTable.setByKey(columnKey + 'ItemKey', newValue[0].itemKey);
                                }
                            }
                        } else {
                            dataTable.setByKey(columnKey, newValue.oid);
                            if (type == YIUI.CONTROLTYPE.DYNAMICDICT || type == YIUI.CONTROLTYPE.COMPDICT) {
                                dataTable.setByKey(columnKey + 'ItemKey', newValue.itemKey);
                            }
                        }
                        break;
                    case YIUI.CONTROLTYPE.DATEPICKER:
                        if (newValue instanceof Date) {
                            newValue = newValue.getTime();
                        } else {
                            newValue = new Date(newValue).getTime();
                        }
                        dataTable.setByKey(columnKey, newValue);
                        break;
                    default:
                        newValue = Return.convertValue(newValue, dataType);
                        dataTable.setByKey(columnKey, newValue);
                }
            }
        },
        /**
         * 各控件的值变化事件
         * formID: 控件所在表单的ID
         * controlKey: 控件自身的key
         * newValue: 新的存储值
         */
        doValueChanged: function (control, newValue, commitValue, fireEvent) {
            var formID = control.ofFormID,
                metaObj = control.getMetaObj(),
                form = YIUI.FormStack.getForm(formID),
                columnKey = metaObj.columnKey,
                tableKey = metaObj.tableKey, dataTable,
                document = form.getDocument();
            if (tableKey) {
                dataTable = document.getByKey(tableKey);
            }
            if (commitValue) {
                if (control.getMetaObj().isSubDetail) {
                    var cellKey = control.getMetaObj().bindingCellKey;
                    var isToDo = (cellKey !== undefined && cellKey.length > 0);
                    var grid = form.getComponent(control.getMetaObj().parentGridKey), row, colInfoes, colInfo,
                        rowIndex = (grid == null ? -1 : grid.getFocusRowIndex());
                    if (grid && rowIndex >= 0 && rowIndex < grid.dataModel.data.length) {
                        if (isToDo) {
                            colInfoes = grid.getColInfoByKey(cellKey);
                            if (colInfoes !== null) {
                                for (var ci = 0, clen = colInfoes.length; ci < clen; ci++) {
                                    colInfo = colInfoes[ci];
                                    grid.setValueAt(rowIndex, colInfo.colIndex, newValue, true, fireEvent, true);
                                }
                            }
                        } else {
                            row = grid.dataModel.data[rowIndex];
                            if (row && row.isDetail && row.bookmark !== undefined) {
                                if (dataTable) {
                                    if(dataTable.tableMode == YIUI.TableMode.HEAD){
                                        this.setValueToDocument(control, dataTable, columnKey, -1, newValue);
                                    }else{
                                        this.setValueToDocument(control, dataTable, columnKey, row.bookmark, newValue);
                                    }
                                }
                            }
                        }
                    } else if (grid && rowIndex == -1 && isToDo) {
                        var lastRowIndex = grid.getLastDetailRowIndex();
                        if (lastRowIndex != -1) {
                            colInfoes = grid.getColInfoByKey(cellKey);
                            if (colInfoes !== null) {
                                grid.setFocusRowIndex(lastRowIndex);
                                grid.setCellFocus(lastRowIndex, grid.getCellIndexByKey(cellKey));
                                for (var ci = 0, clen = colInfoes.length; ci < clen; ci++) {
                                    colInfo = colInfoes[ci];
                                    grid.setValueAt(lastRowIndex, colInfo.colIndex, newValue, true, fireEvent, true);
                                }
                            }
                        }
                    }
                } else {
                    if (dataTable) {
                        this.setValueToDocument(control, dataTable, columnKey, -1, newValue);
                    }
                }

                // 触发事件之前需要做的事
        		form.getUIProcess().preFireValueChanged(metaObj.key);       
                if (fireEvent) {
                    form.getUIProcess().doValueChanged(metaObj.key);
                }
                //可用性
                form.getUIProcess().postFireValueChanged(metaObj.key);
                
                //依赖处理
//                var targetKey = form.getRelations()[metaObj.key];
//                if (targetKey) {
//                    for (var i = 0, len = targetKey.length; i < len; i++) {
//                        var targetCmp = form.getComponent(targetKey[i]);
//                        targetCmp && targetCmp.dependedValueChange(metaObj.key);
//                    }
//                }
            }
        },
        

    	validated: function(control) {
    		var passed = true;
    		var validation = control.validation;
			if ( validation ) {
				var formID = control.ofFormID,
                form = YIUI.FormStack.getForm(formID);
				passed = form.eval(validation, {form: form});
			}
    		return passed;
    	},
    	
        hasChanging: function(control) {
    		var hasChanging = false;
			var changing = control.valueChanging;
			if (changing) {
				hasChanging = true;
			}
    		return hasChanging;
    	},

        changing: function(control) {
			var changing = control.valueChanging;
			if (changing) {
				var formID = control.ofFormID,
                form = YIUI.FormStack.getForm(formID);
				form.eval(changing, {form: form});
			}
    	}

    };
    return Return;
})();
