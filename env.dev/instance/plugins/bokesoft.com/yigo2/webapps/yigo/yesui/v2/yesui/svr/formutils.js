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

			var builder = new YIUI.YIUIBuilder(formKey);
				builder.setContainer(ct);
				builder.setTarget(target);

				builder.setOperationState(YIUI.Form_OperationState.Default);

				builder.newEmpty().then(function(emptyForm){

					var filterMap = emptyForm.getFilterMap();
					filterMap.setOID(OID);

					
					
					
					emptyForm.setOptQueue(new YIUI.OptQueue(new YIUI.LoadOpt(emptyForm)));

					builder.builder(emptyForm);
				});
					return true;
				}
			 };

     return Return;
 })();