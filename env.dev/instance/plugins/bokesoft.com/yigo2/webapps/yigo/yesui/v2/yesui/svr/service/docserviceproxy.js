YIUI.DocService = (function () {
	var cache = new YIUI.DocCache();
    var reqMap = {};

	var Return = {
		/**
		 * 创建一个doc，头表新增一行。
		 */
	    newDocument: function(formKey) {
	    	if(!reqMap[formKey]){
                reqMap[formKey] = cache.get(formKey)
	                                .then(function(doc){
	                                        if(doc){
	                                            return doc;
	                                        }else{
	                                        	var params = {
										    		cmd: "NewDocument",
										    		service: "DealWithDocument",
										            formKey: formKey
										        };

	                                            return Svr.Request.getData(params, null, true).then(function(data){
	                                                cache.put(formKey, data);
	                                                return data;
	                                            }); 
	                                        }
	                                },function(error){
	                                    console.log('error ......'+error);
	                                }).then(function(doc){
	                                	return YIUI.DataUtil.fromJSONDoc(doc);
	                                }).always(function(){
	                                    setTimeout(function(){
	                                        delete reqMap[formKey];
	                                    },100);
	                                });
            }

            return reqMap[formKey];  
	    },

	    // see remoteService.loadbyform
	    loadFormData: function(form, oid, filterMap, condParas) {
	    	if(!form){
	    		throw new Error(YIUI.I18N.docserviceproxy.notNull);
	    	}

	    	form.refreshParas();
        	var parameters = form.getParas();
    		var params = {
        		cmd: "",
        		service: "LoadFormData",
        		oid: oid,
                formKey: form.getFormKey()
            };

    		if(parameters){
    			params.parameters = parameters.toJSON();
    		}
    		if(filterMap){
    			params.filterMap = $.toJSON(filterMap);
    		}
    		if(condParas){
    			params.condition = $.toJSON(condParas);
    		}

    		var templateKey = form.getTemplateKey();
    		if(templateKey){
    			params.templateKey = templateKey;
    		}

            return Svr.Request.getData(params);
        },

        // see remoteService.deletebyform
       	deleteFormData: function(formKey, oid) {
	        var params = {
	    		cmd: "DeleteFormData",
	    		service: "DeleteData",
	            formKey: formKey,
	            oid: oid
	        };
	        //return Svr.Request.getData(params);
	        return Svr.Request.getSyncData(Svr.SvrMgr.ServletURL, params);
	    },

	    saveFormData: function(form) {
	    	form.refreshParas();
        	var parameters = form.getParas();

	        var formDoc = form.getDocument();
	        var docJson = YIUI.DataUtil.toJSONDoc(formDoc);

	        var params = {
	    		cmd: "",
	    		service: "SaveFormData",
	            formKey: formKey,
	          	document: $.toJSON(docJson)
	        };

	        if(parameters){
    			params.parameters = parameters.toJSON();
    		}

	        //return Svr.Request.getData(params);
	        return Svr.Request.getSyncData(Svr.SvrMgr.ServletURL, params);
	    }
	}
	return Return;
})(); 