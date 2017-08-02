(function () {
    YIUI.UICheckOpt = function (form) {
        var Return = {
    		showError: function (errorMsg, type) {
            	if(type == YIUI.Dialog_Type.WARN) {
					errorMsg = errorMsg.replace("Uncaught Error: ", "");
					var dialog = $("<div></div>").attr("id", "warn_dialog");
		            dialog.modalDialog(errorMsg, {title: "警告", showClose: true, type: YIUI.Dialog_Type.WARN, height: 200, width: 400});
				} else {
	            	$.error(errorMsg);
				}
            },
            doOpt: function () {
                var self = this, result = true;
                if (form.errorInfo.error) {
                    this.showError("表单(" + form.formKey + " " + form.formCaption + "):" + form.errorInfo.errorMsg);
                    return false;
                }
                for (var i in form.getComponentList()) {
                    var er, ec, isBreak = false, comp = form.getComponentList()[i], rd;
                    if (comp.type == YIUI.CONTROLTYPE.GRID) {
                        for (var m = 0; m < comp.errorInfoes.rows.length; m++) {
                            er = comp.errorInfoes.rows[m];
                            rd = comp.dataModel.data[er.rowIndex];
                            if (rd == null || (rd.bookmark === undefined && rd.isDetail)) continue;
                            self.showError("表格(" + comp.key + " " + comp.caption + ")第" + (er.rowIndex + 1) + "行:" + er.errorMsg);
                            result = false;
                            isBreak = true;
                            break;
                        }
                        if (isBreak) break;
                        for (var n = 0; n < comp.errorInfoes.cells.length; n++) {
                            ec = comp.errorInfoes.cells[n];
                            rd = comp.dataModel.data[ec.rowIndex];
                            if (rd == null || (rd.bookmark === undefined && rd.isDetail)) continue;
                            self.showError("表格(" + comp.key + " " + comp.caption + ")第" + (ec.rowIndex + 1)
                                + "行,第" + (ec.colIndex + (comp.showRowHead ? 1 : 0)) + "列:" + ec.errorMsg);
                            result = false;
                            isBreak = true;
                            break;
                        }
                        if (isBreak) break;
                        for (var ri = 0, rlen = comp.getRowCount(); ri < rlen; ri++) {
                            var rowData = comp.getRowDataAt(ri);
                            if (rowData == null || (rowData.isDetail && rowData.bookmark == null)) continue;
                            for (var ci = 0, clen = comp.getColumnCount(); ci < clen; ci++) {
                                var cellData = comp.getCellDataAt(ri, ci), cm = comp.dataModel.colModel.columns[ci];
                                if (cellData[3]) {
                                    self.showError("表格(" + comp.key + " " + comp.caption + ")\n第" + (ri + 1)
                                        + "行,第" + (ci + (comp.showRowHead ? 1 : 0)) + "列:" + cm.label + "为必填项");
                                    result = false;
                                    isBreak = true;
                                    break;
                                }
                            }
                        }
                        if (isBreak) break;
                    } else {
                        if (!((comp.errorInfo && comp.errorInfo.error) || comp.isRequired())) continue;
                        var parentGridKey = comp.getMetaObj().parentGridKey;
                        if (comp.getMetaObj().isSubDetail && parentGridKey != null && parentGridKey != "") {
                            var grid = form.getComponent(parentGridKey);
                            if (grid == null || grid.getFocusRowIndex() == -1) continue;
                            var pRowData = grid.getRowDataAt(grid.getFocusRowIndex());
                            if (pRowData.isDetail && pRowData.bookmark == null)   continue;
                        }
                        if (comp.errorInfo && comp.errorInfo.error) {
                            self.showError("表单控件(" + comp.key + " " + comp.caption + "):" + comp.errorInfo.msg);
                            result = false;
                            break;
                        } else if (comp.isRequired()) {
                            self.showError("表单控件(" + comp.key + " " + comp.caption + ")是必填项，当前未填值。");
                            result = false;
                            break;
                        }
                    }
                }
                return result;
            }
        };
        return Return;
    };
    YIUI.EditOpt = function (form) {
        var Return = {
            doOpt: function () {
                //设置初始操作状态，主要用于判断数据对象是如何生成的
                form.setInitOperationState(YIUI.Form_OperationState.Edit);
                //设置操作状态
                form.setOperationState(YIUI.Form_OperationState.Edit);
                //重置界面状态
                form.resetUIStatus(YIUI.FormUIStatusMask.ENABLE
                    | YIUI.FormUIStatusMask.VISIBLE | YIUI.FormUIStatusMask.OPERATION);
                //获取计算表达式处理类
//                form.getUIProcess().checkAll(); //TODO 目前屏蔽状态转换后的检查，之后再进行处理
                //在表单进入编辑状态的时候为orderIndex为1的首个组件设定焦点
                form.initFirstFocus();
            }
        };
        return Return;
    };

    YIUI.SaveOpt = function (form) {
        var Return = {
            doOpt: function () {
                // 将表单置为默认操作状态
                form.setOperationState(YIUI.Form_OperationState.Default);

                var paras = {};
                paras.service = "PureOpt";
                paras.cmd = "GetOptScript";
                paras.formKey = form.formKey;
                paras.type = YIUI.OptScript.SAVE;
                var formula = Svr.Request.getSyncData(Svr.SvrMgr.ServletURL, paras);
                form.eval(formula, {form: form}, null);
            }
        };
        return Return;
    };


    YIUI.LoadOpt = function (form) {
        var Return = {
            doOpt: function () {
                form.setOperationState(YIUI.Form_OperationState.Default);
                var paras = {};
                paras.service = "PureOpt";
                paras.cmd = "GetOptScript";
                paras.formKey = form.formKey;
                paras.type = YIUI.OptScript.LOAD;
                var formula = Svr.Request.getSyncData(Svr.SvrMgr.ServletURL, paras);
                form.eval(formula, {form: form}, null);
            }
        };
        return Return;
    };

    YIUI.NewOpt = function (form, refreshUI) {
        var Return = {
            doOpt: function () {
                var paras = {};
                paras.service = "PureOpt";
                paras.cmd = "GetNewDocument";
                paras.formKey = form.formKey;
                paras.type = YIUI.OptScript.LOAD;
                var document = Svr.Request.getSyncData(Svr.SvrMgr.ServletURL, paras);

                form.setDocument(document);
                
                form.setInitOperationState(YIUI.Form_OperationState.New);
                form.setOperationState(YIUI.Form_OperationState.New);

                if (refreshUI) {
                    form.showDocument();
                    form.resetUIStatus(YIUI.FormUIStatusMask.ENABLE | YIUI.FormUIStatusMask.VISIBLE | YIUI.FormUIStatusMask.OPERATION);
                }
            }
        };
        return Return;
    };

    YIUI.CopyNewOpt = function (form) {
        var Return = {
            doOpt: function () {
                var paras = {};
                paras.service = "PureOpt";
                paras.cmd = "GetNewCopyDocument";
                paras.formKey = form.formKey;
                paras.type = YIUI.OptScript.LOAD;
                var docStr = YIUI.DataUtil.toJSONDoc(form.getDocument());
                paras.document = $.toJSON(docStr);
                var document = Svr.Request.getSyncData(Svr.SvrMgr.ServletURL, paras);
                if (document) {
                    form.setDocument(document);
                }
                form.setInitOperationState(YIUI.Form_OperationState.New);
                form.setOperationState(YIUI.Form_OperationState.New);
                form.showDocument();
                form.resetUIStatus(YIUI.FormUIStatusMask.ENABLE | YIUI.FormUIStatusMask.VISIBLE | YIUI.FormUIStatusMask.OPERATION);
            }
        };
        return Return;
    };
})();
