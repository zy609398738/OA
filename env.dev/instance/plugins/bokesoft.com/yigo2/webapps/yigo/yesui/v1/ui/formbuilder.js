YIUI.FormBuilder = (function () {
    var Return = {
		
		build: function(jsonObj, target, pFormID, opt, filterMap) {
			var formJson = jsonObj.form,
            form = new YIUI.Form(formJson),
            document = jsonObj.document, doc,
            dictCaption = jsonObj.dictCaption;

            form.dealTabOrder();
	        if (document) {
	            doc = YIUI.DataUtil.fromJSONDoc(document);
                form.setDocument(doc);
	        }

            if(dictCaption){
                form.dictCaption = dictCaption;
            }

	        form.target = target || form.target;
            form.pFormID = pFormID || form.parentID;
            if(target == YIUI.FormTarget.MODAL || form.target == YIUI.FormTarget.MODAL) {
        		var popHeight = formJson.popHeight || "60%";
                var popWidth = formJson.popWidth || "40%";
                var dialogID = form.formID;
                var dialogDiv = $("<div id=" + dialogID + "></div>");
                
                var settings = {
            		title: form.formCaption, 
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
                form.getRoot().render(dialogDiv.dialogContent());
        	}
            return form;
		},
		
		diff: function(form, jsonObj) {
			var formJson = jsonObj.form,
            document = jsonObj.document, doc;
	        if (document) {
	            doc = YIUI.DataUtil.fromJSONDoc(document);
                form.setDocument(doc);
	        }
	        form.diff(formJson);
//	        var rootpanel = form.getRoot();
//	        rootpanel.doLayout(rootpanel.el[0].clientWidth, rootpanel.el[0].clientHeight);
            return form;
		}
    };

    return Return;
})();