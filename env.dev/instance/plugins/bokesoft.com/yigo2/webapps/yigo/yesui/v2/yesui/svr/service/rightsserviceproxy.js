YIUI.RightsService = (function () {
	var cache = new YIUI.RightsCache();
    var reqMap = {};

	var Return = {
		/**
		 * 表单字段，操作权限
		 */
	    loadFormRights: function(formKey,OID,workitemID) {

	       	if(!reqMap[formKey]){
                reqMap[formKey] = cache.get(formKey)
	                                .then(function(rightsData){
	                                        if(rightsData){
	                                            return rightsData;
	                                        }else{
										        var params = {
										    		service: "SessionRights",
										    		cmd: "LoadFormRights",
										    		formKey: formKey,
                                                    OID: OID,
                                                    workitemID:workitemID,
										        };

	                                            return Svr.Request.getData(params).then(function(rightsData){
	                                            	if( rightsData.needCache ) {
                                                        cache.put(formKey, rightsData);
													}
	                                                return rightsData;
	                                            }); 
	                                        }
	                                },function(error){
	                                    console.log('error ......'+error);
	                                }).always(function(){
	                                    setTimeout(function(){
	                                        delete reqMap[formKey];
	                                    },100);
	                                });
            }

            return reqMap[formKey];  

	    }
	}
	return Return;
})();