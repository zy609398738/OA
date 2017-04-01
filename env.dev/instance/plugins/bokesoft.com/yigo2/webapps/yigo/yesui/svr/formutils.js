YIUI.FormUtil = (function () {
    var Return = {
		//opts 参数集{path: entryPath...}， ct 容器
		openEntry: function(opts, ct) {
			YIUI.EventHandler.doTreeClick(opts, ct);
		},
		//args 参数数组{formKey:xx, OID:xx, target:xx, paras:xx}
		openForm: function(args, ct) {
	        var formKey = args.formKey, OID = args.OID;
	        var target = YIUI.FormTarget.NEWTAB;
	        if (args.target) {
	            target = YIUI.FormTarget.parse(args.target);
	        }
	        var callParas;
	        if (args.callParas) {
	            callParas = args.callParas;
	        }
	        var data = {formKey: formKey, oid: OID.toString(), cmd: "PureOpenForm"};
	        if (callParas) {
	            data.callParas = callParas;
	        }
	        var success = function (jsonObj) {
	            var newForm = YIUI.FormBuilder.build(jsonObj, target);
	            if (target != YIUI.FormTarget.MODAL) {
	            	ct.build(newForm);
	            }
	            newForm.setOperationState(YIUI.Form_OperationState.Default);
	        };
	        Svr.SvrMgr.dealWithPureForm(data, success);
	        return true;
		}
    };

    return Return;
})();