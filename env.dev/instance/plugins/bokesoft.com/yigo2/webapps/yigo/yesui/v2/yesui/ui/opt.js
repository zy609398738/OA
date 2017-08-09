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

                    var self = this;
                    var stackExecOpt = function(){
                        if(self.optArray.length > 0){
                            var o = self.optArray.shift();
                            return o.doOpt().then(stackExecOpt);
                        }

                        return $.Deferred(function(def){
                                    def.resolve();
                                },function(err){
                                    self.optArray = [];
                                    throw err;
                                }).promise();
                    };

                    var opt = self.optArray.shift();

                    return opt.doOpt().then(stackExecOpt);
                }
            };
            Return.init();
            return Return;
        };
        return reFun(opts);
    };

    YIUI.UICheckOpt = function (form) {
    	var opt = YIUI.I18N.opt;
        var Return = {
            showError: function (errorMsg, type) {
                if(type == YIUI.Dialog_Type.WARN) {
                    errorMsg = errorMsg.replace("Uncaught Error: ", "");
                    var dialog = $("<div></div>").attr("id", "warn_dialog");
                    dialog.modalDialog(errorMsg, {title: opt.warning, showClose: true, type: YIUI.Dialog_Type.WARN, height: 200, width: 400});
                } else {
                    $.error(errorMsg);
                }
            },

            _doOpt: function () {
                var self = this;
                if (form.errorInfo.error) {
                    this.showError(opt.form +"(" + form.formKey + " " + form.formCaption + "):" + form.errorInfo.errorMsg);
                }
                for (var i in form.getComponentList()) {
                    var comp = form.getComponentList()[i];
                    if (comp.type == YIUI.CONTROLTYPE.GRID) {
                        for (var ri = 0, size = comp.getRowCount(); ri < size; ri++) {
                            var rowData = comp.getRowDataAt(ri);

                            if (rowData == null || !rowData.isDetail || rowData.bookmark == null)
                                continue;

                            if( rowData.error ) {
                                self.showError(opt.table+"(" + comp.key + " " + comp.caption + ")" +opt.the + (ri + 1) + opt.line + rowData.errorMsg);
                            }

                            for (var ci = 0, length = comp.getColumnCount(); ci < length; ci++) {
                                var cellData = comp.getCellDataAt(ri, ci), cm = comp.dataModel.colModel.columns[ci];
                                if ( cellData[3] ) {
                                    self.showError(opt.table+"(" + comp.key + " " + comp.caption + ")\n"+opt.the + (ri + 1)
                                        + opt.lineThe + (ci + (comp.getMetaObj().showRowHead ? 1 : 0)) + opt.column + cm.label + opt.required);
                                } else if ( cellData[4] ) {
                                    self.showError(opt.table+"(" + comp.key + " " + comp.caption + ")" + opt.the + (ri + 1)
                                        + opt.lineThe + (ci + (comp.getMetaObj().showRowHead ? 1 : 0)) + opt.column + cellData[5]);
                                }
                            }
                        }
                    } else {
                        if (comp.errorInfo && comp.errorInfo.error) {
                            self.showError(opt.formControl+"(" + comp.key + " " + comp.caption + "):" + comp.errorInfo.msg);
                        } else if (comp.isRequired()) {
                            self.showError(opt.formControl+ "(" + comp.key + " " + comp.caption + ")"+ opt.noFill);
                        }
                    }
                }
                return true;
            },

            doOpt: function(){
                var self = this;
                return $.Deferred(function(def){
                            self._doOpt();
                            def.resolve(true);
                        }).promise();
            }


        };
        return Return;
    };
    YIUI.EditOpt = function (form) {
        var Return = {
            doOpt: function(){
                return $.Deferred(function(def){
                            form.setInitOperationState(YIUI.Form_OperationState.Edit);
                            //设置操作状态
                            form.setOperationState(YIUI.Form_OperationState.Edit);
                            //重置界面状态
                            form.resetUIStatus(YIUI.FormUIStatusMask.ENABLE
                                | YIUI.FormUIStatusMask.VISIBLE | YIUI.FormUIStatusMask.OPERATION);
                            //获取计算表达式处理类
                            //form.getUIProcess().checkAll(); //TODO 目前屏蔽状态转换后的检查，之后再进行处理
                            //在表单进入编辑状态的时候为orderIndex为1的首个组件设定焦点
                            form.initFirstFocus();
                            def.resolve(true);
                        }).promise();
            }
        };
        return Return;
    };

    YIUI.SaveOpt = function (form) {
        var Return = {
            doOpt: function(){
                return $.Deferred(function(def){
                            var metaForm = form.metaForm;

                            var scriptCollection = metaForm.scriptCollection;
                            var saveScript = scriptCollection["save"];

                            if(saveScript){
                                form.eval(saveScript, {form: form}, null); 
                            }

                            form.setOperationState(YIUI.Form_OperationState.Default);

                            def.resolve(true);
                        }).promise();
            }
        };
        return Return;
    };


    YIUI.LoadOpt = function (form) {
        var Return = {
            doOpt: function(){
                return $.Deferred(function(def){
                            var metaForm = form.metaForm;

                            var scriptCollection = metaForm.scriptCollection;
                            var loadScript = scriptCollection["load"];

                            if(loadScript){
                                form.eval(loadScript, {form: form}, null); 
                            }

                            def.resolve(true);
                        }).promise();
            }
        };
        return Return;
    };

    YIUI.NewOpt = function (form, refreshUI) {
        var Return = {
            doOpt: function () {

                var docDef = YIUI.DocService.newDocument(form.formKey);
                var oidDef = YIUI.RemoteService.applyNewOID();

                return $.when(docDef, oidDef)
                        .then(function(doc, oid){
                            if(!doc){
                                return;
                            }
                            if(form.metaForm.type == YIUI.Form_Type.Entity && doc.mainTableKey){
                                doc.oid = oid;
                                var dt = doc.getByKey(doc.mainTableKey);
                                dt.setByKey(YIUI.SystemField.OID_SYS_KEY, oid);
                            }
                            doc.setNew();
                            form.setDocument(doc);
                            form.setInitOperationState(YIUI.Form_OperationState.New);
                            form.setOperationState(YIUI.Form_OperationState.New);
                            if (refreshUI) {
                                form.showDocument();
                                //form.resetUIStatus(YIUI.FormUIStatusMask.ENABLE | YIUI.FormUIStatusMask.VISIBLE | YIUI.FormUIStatusMask.OPERATION);
                            }  
                            return form; 
                        });

                // var paras = {};
                // paras.service = "PureOpt";
                // paras.cmd = "GetNewDocument";
                // paras.formKey = form.formKey;
                // paras.type = YIUI.OptScript.LOAD;
                // var document = Svr.Request.getSyncData(Svr.SvrMgr.ServletURL, paras);

                // form.setDocument(document);

                // form.setInitOperationState(YIUI.Form_OperationState.New);
                // form.setOperationState(YIUI.Form_OperationState.New);

                // if (refreshUI) {
                //     form.showDocument();
                //     //form.resetUIStatus(YIUI.FormUIStatusMask.ENABLE | YIUI.FormUIStatusMask.VISIBLE | YIUI.FormUIStatusMask.OPERATION);
                // }
            }
        };
        return Return;
    };

    YIUI.CopyNewOpt = function (form) {
        var Return = {
            doOpt: function(){
                return $.Deferred(function(def){
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
                          //  form.resetUIStatus(YIUI.FormUIStatusMask.ENABLE | YIUI.FormUIStatusMask.VISIBLE | YIUI.FormUIStatusMask.OPERATION);
                        }).promise();
            }
        };
        return Return;
    };
})();