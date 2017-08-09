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
			var single = false;
        	if (node.length > 0) {
        		single = YIUI.TypeConvertor.toBoolean(node.attr("single"));
//        		if(single) {
//                    var formKey = node.attr("formKey");
                    paras = node.attr("paras");
//                	var li = $("[formKey='"+formKey+"']", container.el);
//                    if(!paras.isEmpty()) {
//                    	li = $("[formKey='"+formKey+"'][paras='"+paras+"']", container.el);
//                    }
//                	if(li.length > 0) {
//                		li.click();
//                		return;
//                	}
//        		}
        	}
        	
            var formKey = node.attr("formKey");

            var builder = new YIUI.YIUIBuilder(formKey);
            builder.setContainer(container);
            builder.setTarget(target);

            YIUI.MetaService.getMetaFormByEntry(path)
                .then(function(meta){

                    if(single) {
                    	var li = $("[formKey='"+formKey+"']", container.el);
                        if(paras && !paras.isEmpty()) {
                        	li = $("[formKey='"+formKey+"'][paras='"+paras+"']", container.el);
                        }
                    	if(li.length > 0) {
                    		li.click();
                    		return;
                    	}
                    }
                	
                    var metaForm = new YIUI.MetaForm(meta);
                    var emptyForm = new YIUI.Form(metaForm);
                    emptyForm.single = single;
                    emptyForm.entryPath = path;
                    emptyForm.entryParas = paras;
                    if((emptyForm.type == YIUI.Form_Type.Entity ||emptyForm.type == YIUI.Form_Type.Dict)
                        && emptyForm.metaForm.initState == YIUI.Form_OperationState.New){

                        emptyForm.setOptQueue(new YIUI.OptQueue(new YIUI.NewOpt(emptyForm)));
                    }

                    builder.builder(emptyForm);
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
