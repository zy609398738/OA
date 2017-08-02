YIUI.TreeHandler = (function () {
    var Return = {
		/**
         * 菜单树的点击事件
         */
        doTreeClick: function (control, container) {
        	var nodeKey = control.nodeKey;
        	var parameters = control.parameters;
        	var formKey = control.formKey;
            var paras = {};
            paras.nodeKey = nodeKey;
            paras.eventType = Svr.SvrMgr.EventType.Click;
            paras.formKey = control.formKey;
            paras.entryParas = parameters;
            var jsonObj = Svr.SvrMgr.doPureTreeEvent(paras);
            if (!jsonObj) {
            	var li = $("#tab_" + formKey + "_" + nodeKey);
                li.click();
                return;
            }
            var form = YIUI.FormBuilder.build(jsonObj);
            form.entryKey = nodeKey;
            container.add(form);
        }
    };
    Return = $.extend({}, YIUI.Handler, Return);
    return Return;
})();
