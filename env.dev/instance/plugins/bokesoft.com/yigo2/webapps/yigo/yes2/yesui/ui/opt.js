(function () {
    YIUI.OptQueue = function(opts) {
        var reFun = function(opts) {
            var Return = {
                optArray: [],
                init: function() {
                    if (opts) {
                        if($.isArray(opts)) {
                            for ( var i = 0, len = opts.length; i < len; i++ ) {
                                this.optArray.push(opts[i]);
                            }
                        } else {
                            this.optArray.push(opts);
                        }
                    }
                },
                doOpt: function() {
                    for (var i = 0, len = this.optArray.length; i < len; i++) {
                        var opt = this.optArray[i];
                        opt.doOpt();
                    }
                    this.optArra = [];
                }
            };
            Return.init();
            return Return;
        };
        return reFun(opts);
    };
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
                var self = this;
                if (form.errorInfo.error) {
                    this.showError("表单(" + form.formKey + " " + form.formCaption + "):" + form.errorInfo.errorMsg);
                }
                for (var i in form.getComponentList()) {
                    var comp = form.getComponentList()[i];
                    if (comp.type == YIUI.CONTROLTYPE.GRID) {
                        for (var ri = 0, size = comp.getRowCount(); ri < size; ri++) {
                            var rowData = comp.getRowDataAt(ri);

                            if (rowData == null || !rowData.isDetail || rowData.bookmark == null)
                                continue;

                            if( rowData.error ) {
                                self.showError("表格(" + comp.key + " " + comp.caption + ")第" + (ri + 1) + "行:" + rowData.errorMsg);
                            }

                            for (var ci = 0, length = comp.getColumnCount(); ci < length; ci++) {
                                var cellData = comp.getCellDataAt(ri, ci), cm = comp.dataModel.colModel.columns[ci];
                                if ( cellData[3] ) {
                                    self.showError("表格(" + comp.key + " " + comp.caption + ")\n第" + (ri + 1)
                                        + "行,第" + (ci + (comp.getMetaObj().showRowHead ? 1 : 0)) + "列:" + cm.label + "为必填项");
                                } else if ( cellData[4] ) {
                                    self.showError("表格(" + comp.key + " " + comp.caption + ")第" + (ri + 1)
                                        + "行,第" + (ci + (comp.getMetaObj().showRowHead ? 1 : 0)) + "列:" + cellData[5]);
                                }
                            }
                        }
                    } else {
                        if (comp.errorInfo && comp.errorInfo.error) {
                            self.showError("表单控件(" + comp.key + " " + comp.caption + "):" + comp.errorInfo.msg);
                        } else if (comp.isRequired()) {
                            self.showError("表单控件(" + comp.key + " " + comp.caption + ")是必填项，当前未填值。");
                        }
                    }
                }
                return true;
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