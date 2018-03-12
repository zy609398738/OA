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
                
                var getFormError = function () {
                    var msg = form.errorInfo.errorMsg;
                    if( !msg ) {
                        msg = form.caption + " " + opt.hasError;
                    }
                    return msg;
                }
                
                var getRowError = function (grid,row,lineNo) {
                    var msg = rowData.errorMsg;
                    if( !msg ) {
                        msg = grid.caption + " " + opt.the + " " + lineNo + " " + opt.line + opt.hasError;
                    }
                    return msg;
                }
                
                var getCellError = function (grid,cell,column,lineNo) {
                    var msg = "";
                    if ( cell[4] ) {
                        msg = cellData[5];
                        if( !msg ) {
                            msg = grid.caption + " " + opt.the + " " + lineNo + " " + opt.line + " " + column.label + " " + opt.hasError;
                        }
                    } else if ( cellData[3] ) {
                        msg = grid.caption + " " + opt.the + " " + lineNo + " " + opt.line + " " + column.label + " " + opt.required;
                    }
                    return msg;
                }
                
                var getComError = function (com) {
                    var msg = "";
                    if (com.errorInfo && com.errorInfo.error) {
                        msg = com.errorInfo.msg;
                        if( !msg ) {
                            msg = com.caption + " " + opt.hasError;
                        }
                    } else if (com.isRequired() ) {
                        msg = com.caption + " " + opt.required;
                    }
                    return msg;
                }

                var self = this;
                if (form.errorInfo.error) {
                    this.showError(getFormError());
                }

                var rowData,
                    cellData,
                    com,
                    cm;

                for (var i in form.getComponentList()) {
                    com = form.getComponentList()[i];
                    if (com.type == YIUI.CONTROLTYPE.GRID) {
                        for (var ri = 0, size = com.getRowCount(); ri < size; ri++) {
                            rowData = com.getRowDataAt(ri);
                            if( rowData.rowType === 'Fix' || (rowData.rowType === 'Detail' && !YIUI.GridUtil.isEmptyRow(rowData)) ) {
                                if( rowData.error ) {
                                    self.showError(getRowError(com,ri + 1,rowData));
                                }

                                for (var ci = 0, length = com.getColumnCount(); ci < length; ci++) {
                                    cellData = com.getCellDataAt(ri, ci), cm = com.dataModel.colModel.columns[ci];
                                    if( cellData[3] || cellData[4] ) {
                                        self.showError(getCellError(com,cellData,cm,ri + 1));
                                    }
                                }
                            }
                        }
                    } else {
                        if( (com.errorInfo && com.errorInfo.error) || com.isRequired() ) {
                            self.showError(getComError(com));
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
    YIUI.EditOpt = function (form,checkUI) {

        var MASK = YIUI.FormUIStatusMask.ENABLE |
            YIUI.FormUIStatusMask.VISIBLE | YIUI.FormUIStatusMask.OPERATION;

        var MASKCHECK = YIUI.FormUIStatusMask.ENABLE| YIUI.FormUIStatusMask.VISIBLE |
            YIUI.FormUIStatusMask.OPERATION | YIUI.FormUIStatusMask.CHECKRULE;

        var Return = {
            doOpt: function(){
                return $.Deferred(function(def){
                            form.setInitOperationState(YIUI.Form_OperationState.Edit);
                            //设置操作状态
                            form.setOperationState(YIUI.Form_OperationState.Edit);
                            //重置界面状态
                            form.resetUIStatus(checkUI ? MASKCHECK : MASK);
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
                                if( dt.first() ) {
                                    dt.setByKey(YIUI.SystemField.OID_SYS_KEY, oid);
                                }
                            }
                            doc.setNew();
                            form.setDocument(doc);
                            form.setInitOperationState(YIUI.Form_OperationState.New);
                            form.setOperationState(YIUI.Form_OperationState.New);
                            if (refreshUI) {
                                form.showDocument();
                            }
                            return form; 
                        });
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
                        }).promise();
            }
        };
        return Return;
    };
})();