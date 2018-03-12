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
		},

		openWorkItem: function(args, ct) {
			var WID = args.WID;
			var target = YIUI.FormTarget.NEWTAB;
 	        if (args.target) {
 	            target = YIUI.FormTarget.parse(args.target);
 	        }
			
			var onlyOpen = false;
			if (args.onlyOpen) {
				onlyOpen = args.onlyOpen;
			}

			var loadInfo = true;
			if (args.loadInfo) {
				loadInfo = args.loadInfo;
			}

			var tsParas;
			if (args.tsParas) {
				tsParas = args.tsParas;
			}

			YIUI.BPMService.loadWorkitemInfo(WID).then(function(info){
				if(!info){
            		$.error("工作项不可用");
            	}

				var formKey = info.FormKey;
				var OID = info.OID;

				var existsAttachment = info.AttachmentType >= 0;
				if (existsAttachment) {
				OID = info.AttachmentOID;
				formKey = info.AttachmentPara;
				if (info.AttachmentOperateType == YIUI.AttachmentOperateType.NEW && OID < 0) {
					var builder = new YIUI.YIUIBuilder(formKey);
					builder.setContainer(ct);
					builder.setTarget(YIUI.FormTarget.NEWTAB);
					builder.setTemplateKey(onlyOpen ? "" : info.TemplateKey);
					builder.newEmpty().then(function(emptyForm){
						if (!onlyOpen) {
							// emptyForm.setSysExpVals(YIUI.BPMConstants.WORKITEM_INFO, info);
							emptyForm.setTemplateKey(info.TemplateKey);
						}
						// 代表新界面由代办页面打开
						emptyForm.setSysExpVals(YIUI.BPMConstants.WORKITEM_VIEW, YIUI.BPMConstants.WORKITEM_VIEW);

						emptyForm.setOptQueue(new YIUI.OptQueue(new YIUI.NewOpt(emptyForm)));
						
						if( info.State === YIUI.WorkItem_State.NEW && loadInfo) {
							emptyForm.setSysExpVals(YIUI.BPMKeys.WORKITEM_INFO, info);
						}
						emptyForm.setSysExpVals(YIUI.BPMKeys.LOAD_WORKITEM_INFO, false);
						
						return builder.builder(emptyForm);
					}).then(function(data){
						var doc = data.getDocument();
						doc.putExpData(YIUI.BPMKeys.REGISTER_ATTACHMENT, WID);
						});
						return true;
					}
				}

				var builder = new YIUI.YIUIBuilder(formKey);
				builder.setContainer(ct);
				builder.setTemplateKey(onlyOpen ? "" : info.TemplateKey);
				builder.setOperationState(YIUI.Form_OperationState.Default);

				builder.newEmpty().then(function(emptyForm){
					// 代表新界面由代办页面打开
					emptyForm.setSysExpVals(YIUI.BPMConstants.WORKITEM_VIEW, YIUI.BPMConstants.WORKITEM_VIEW);

					var filterMap = emptyForm.getFilterMap();
					filterMap.setOID(OID);

					if( info.State === YIUI.WorkItem_State.NEW && loadInfo ) {
                        emptyForm.setSysExpVals(YIUI.BPMKeys.WORKITEM_INFO, info);
                    } 
                    emptyForm.setSysExpVals(YIUI.BPMKeys.LOAD_WORKITEM_INFO, false);

					emptyForm.setOptQueue(new YIUI.OptQueue(new YIUI.LoadOpt(emptyForm)));
					builder.builder(emptyForm);
				});
			});

			return true;
		}
	};

	return Return;
 })();