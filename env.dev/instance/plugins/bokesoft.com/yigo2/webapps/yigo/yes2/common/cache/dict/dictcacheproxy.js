var YIUI = YIUI || {};
YIUI.DictCacheProxy = (function () {
    
    var cache = null;

    if("indexedDB" in window){
        console.log('support index db');
        cache = new DictIndexedDB2();
    }else{
        console.log('not support index db');
        cache = new DictLRUCache();
    }


    var reqMap = {};

    var Return = {
		toString: function (v) {
            return v != null ? v.toString() : "";
        },

        getCaption: function(itemKey, oid) {
            // cache.getItem(itemKey, oid);

            if(itemKey == null || itemKey.isEmpty()){
                console.error('error itemKey and oid'+itemKey + "   "+oid);
                return $.Deferred(function(def){
                            def.resolve('');
                        });
            }
            
            oid = parseInt(oid);

            var key = itemKey + "_" + oid;

            if(!reqMap[key]){
                reqMap[key] = cache.getItem(itemKey, oid)
                                .then(function(data){
                                        if(data){
                                            //存在
                                            var item = data;
                                            return item.caption;
                                        }else{
                                            //不存在；
                                            return YIUI.DictService.getItem(itemKey, oid).then(function(item){
                                                var caption = '';
                                                if(item){
                                                    caption = item.caption;
                                                    cache.addItem(itemKey, oid, item);
                                                }else{
                                                    console.log('dict service not find ......'+itemKey + "  "+oid);    
                                                }

                                                return caption;
                                            }); 
                                        }
                              
                                },function(error){
                                        console.log('error ......'+error);
                                }).always(function(){
                                       delete reqMap[key];
                                });
            }

            return reqMap[key];
        }


	};
	return Return;
})();