YIUI.ToolBarHandler = (function () {
    var Return = {
        /**
         * 控件的点击事件(单击)
         */
        doOnClick: function (control) {
            var formID = control.ofFormID;
            var item = control.item;
            if(item.formID) {
            	formID = item.formID;
            }
            var form = YIUI.FormStack.getForm(formID);
            var cxt = {form: form, optKey: item.key};
            var excpAction = item.excpAction;
            try {
            	var action = item.action;
                var preAction = item.preAction;
    			if (preAction) {
    				form.eval(preAction, cxt, null);
    			}

                if (action) {
                    form.eval(action, cxt, null);
                }
                var _form = YIUI.FormStack.getForm(control.ofFormID);
                if (_form != null && _form.getUIProcess())
                	_form.getUIProcess().resetUIStatus(YIUI.FormUIStatusMask.OPERATION);
                
			} catch (e) {
				if(excpAction) {
					try {
						form.eval(excpAction, cxt);
					} catch (t) {
					}
				}
				$.error(e.message);
			}
            
        }
    };
    Return = $.extend({}, YIUI.Handler, Return);
    return Return;
})();
