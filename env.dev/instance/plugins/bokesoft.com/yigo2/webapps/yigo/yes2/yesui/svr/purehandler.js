YIUI.EventHandler = (function () {
    var Return = {

        /**
         * 菜单树的点击事件
         */
        doTreeClick: function (control, container) {
            var path = control.path, paras;
        	var target = control.target;
        	var node = $("[path='"+path+"']");
			var enable = node.attr("enable");
			if( enable !== undefined && !YIUI.TypeConvertor.toBoolean(enable) )
				return;
        	if (node.length > 0) {
        		var single = YIUI.TypeConvertor.toBoolean(node.attr("single"));
        		if(single) {
                    var formKey = node.attr("formKey");
                    paras = node.attr("paras");
                	var li = $("[formKey='"+formKey+"']", container.el);
                    if(!paras.isEmpty()) {
                    	li = $("[formKey='"+formKey+"'][paras='"+paras+"']", container.el);
                    }
                	if(li.length > 0) {
                		li.click();
                		return;
                	}
        		}
        	}
        	
    		Svr.SvrMgr.doPureTreeEvent(path).then(function(data){
				data.target = target;
                var cxt = {
            		entryPath: path,
            		entryParas: paras,
                	container: container
                };
            	YIUI.UIUtil.show(data, cxt, false, YIUI.ShowType.Tree);
            });
        	
        },

        doCloseForm: function (control) {
            var formID = control.ofFormID;
            var form = YIUI.FormStack.getForm(formID);
			if(form){
				form.fireClose();
			}
        }

    };
    return Return;
})();
