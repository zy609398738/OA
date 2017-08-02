YIUI.EventHandler = (function () {
    var Return = {

        /**
         * 菜单树的点击事件
         */
        doTreeClick: function (control, container) {
            var path = control.path;
        	var target = control.target;
        	var node = $("[path='"+path+"']");
            var enable = node.attr("enable");
            if( enable !== undefined && !YIUI.TypeConvertor.toBoolean(enable) )
                return;
        	if (node.length > 0) {
        		var single = YIUI.TypeConvertor.toBoolean(node.attr("single"));
        		if(single) {
                    var formKey = node.attr("formKey");
                    var paras = node.attr("paras");
                	var li = $("[formKey='"+formKey+"'][paras='"+paras+"']", container.el);
                	if(li.length > 0) {
                		li.click();
                		return;
                	}
        		}
        	}

            var data = {};
            data.path = path;
            data.async = true;
            var success = function(jsonObj) {
            	var pFormID;
            	var form = YIUI.FormBuilder.build(jsonObj, target);
                form.entryPath = path;
                form.entryParas = paras;
                if(form.target != YIUI.FormTarget.MODAL) {
                	container.build(form);
                	pFormID = form.formID;
                }
                if(form.getOperationState() == YIUI.Form_OperationState.New) {
                	form.resetUIStatus(YIUI.FormUIStatusMask.ENABLE | YIUI.FormUIStatusMask.VISIBLE | YIUI.FormUIStatusMask.OPERATION);
                    form.getUIProcess().checkAll();
                    form.initFirstFocus();
                }
                if(form.postShow) {
                	form.eval(form.postShow, {form: form});
                }
            };
            Svr.SvrMgr.doPureTreeEvent(data, success);
            
        },

        doCloseForm: function (control) {
            var formID = control.ofFormID;
            var form = YIUI.FormStack.getForm(formID);
            form.fireClose();
        }

    };
    return Return;
})();
