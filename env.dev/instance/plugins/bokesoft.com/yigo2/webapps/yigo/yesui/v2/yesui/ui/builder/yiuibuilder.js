YIUI.YIUIBuilder = (function(){

    function _builder(formKey, templateKey){
        this._formKey = formKey;
        this._state = YIUI.Form_OperationState.Edit;
        this.templateKey = templateKey;
    };

    _builder.prototype.setContainer = function(container){
        this._container = container;
    };

    _builder.prototype.setParentForm = function(pForm){
        this._pForm = pForm;
    };

    _builder.prototype.setTarget= function(target){
        this._target = target;
    };

    _builder.prototype.setOperationState= function(state){
        this._state = state;
    };

    _builder.prototype.newEmpty= function(){
        var metaDef = null;
        if(this.templateKey){
            //反向模版用法， 为流程中专用， 根据流程权限加载， 所以这个地方不加载操作员权限
            metaDef = YIUI.MetaService.getMetaForm(this._formKey, this.templateKey);
        }else{
            metaDef = YIUI.MetaService.getMetaForm(this._formKey);
        }
        
//        var rightsDef = YIUI.RightsService.loadFormRights(this._formKey);

        return $.when(metaDef)
                    .then(function(meta){
                        var metaForm = new YIUI.MetaForm(meta);
                        var emptyForm = new YIUI.Form(metaForm);
//                        emptyForm.setFormRights(rights);
                        return emptyForm;
                    }).promise();

    };

    _builder.prototype.builder= function(form){
        var _target = this._target;

        if (_target != YIUI.FormTarget.MODAL) {
            if (_target == YIUI.FormTarget.STACK) {
                form.isStack = true;
            }
            this._container.build(form);
        }

        if(this._pForm){
            form.pFormID = this._pForm.formID;
        }
        
        form.setContainer(this._container);

        var metaForm = form.metaForm;
        var initState = metaForm.initState == YIUI.Form_OperationState.Edit ? this._state : metaForm.initState;

        form.setOperationState(initState);

        if(_target == YIUI.FormTarget.MODAL) {
            var popHeight = form.popHeight || "60%";
            var popWidth = form.popWidth || "40%";
            var dialogID = form.formID;
            var dialogDiv = $("<div id=" + dialogID + "></div>");
            
            var settings = {
                title: form.caption, 
                showClose: false, 
                width: popWidth, 
                height: popHeight
            };
            var root = form.getRoot();
            settings.resizeCallback = function() {
                var dialogContent = dialogDiv.dialogContent();
                if(root.hasLayout) {
                    root.doLayout(dialogContent.width(), dialogContent.height());
                } else {
                    root.setWidth(dialogContent.width());
                    root.setHeight(dialogContent.height());
                }
            }
            dialogDiv.modalDialog(null, settings);

            var ct = dialogDiv.dialogContent();
            ct.renderDom = function(form) {
        		dialogDiv.dialogContent().empty();
            	form.getRoot().render(dialogDiv.dialogContent());
            };
			ct.build = function() {
    			return false;
			};
			ct.removeForm = function(form) {
				dialogDiv.close();
				YIUI.FormStack.removeForm(form.formID);
			};
            form.setContainer(ct);
        }
        form.dealTabOrder();

        form.initViewDataMonitor();

        return YIUI.DocService.newDocument(form.metaForm.formKey).then(function(doc) {
                    form.setDocument(doc);

                    return form.doOnLoad().then(function(data){
                        if (_target == YIUI.FormTarget.MODAL) {
                            form.showDocument();
                        }else if(!form.willShow()){
                            form.showDocument();
                        }
                        return form;
                    });
                });
    };

    return _builder;
})();