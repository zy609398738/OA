var YIUI = YIUI || {};
YIUI.DictCacheProxy = (function () {

    // var DictIndexedDB2 = function(){

    //     var dictDB = null;
    //     var TABLE_NAME = 'DictCache';

    //     function _dictIndexedDB(){
    //         var upgrade = function (evt) {

    //             if(evt.currentTarget.result.objectStoreNames.contains(TABLE_NAME)){
    //                 evt.currentTarget.result.deleteObjectStore(TABLE_NAME);
    //             }

    //             var store = evt.currentTarget.result.createObjectStore(
    //                 TABLE_NAME,{keyPath: 'key'});

    //             store.createIndex('index_keypath', 'key', { unique: true });

    //             console.debug("initDb.onupgradeneeded");
    //         };

    //         dictDB = new IndexedDBProxy();
    //         dictDB.open(upgrade, 2).then(function(d){
    //             dictDB.clear(TABLE_NAME);
    //         });

    //     };

    //     _dictIndexedDB.prototype.getItem = function(itemKey, oid){
    //         var key = itemKey + "_"+oid;

    //         return dictDB.get(TABLE_NAME, key).then(function(data){
    //                     if(data){
    //                         // console.log('cache...............');
    //                         return data.value;
    //                     }else{
    //                         // console.log('cache...............not find'+oid);
    //                         return null;
    //                     }
    //                 });
    //     };

    //     _dictIndexedDB.prototype.addItem = function(itemKey, oid, item){
    //         var key = itemKey + "_"+oid;
            
    //         var o = {};
    //         o.key = key;
    //         o.value = item;

    //         dictDB.put(TABLE_NAME, o);
    //     };

    //     return _dictIndexedDB;
    // }();

    // var DictLRUCache = function(){

    //     var cache = new LRUCache(200);

    //     function _dictLRUCache(){
    //     };

    //     _dictLRUCache.prototype.getItem = function(itemKey, oid){
    //         return $.Deferred(function(def){
    //                     var key = itemKey + "_"+oid;
    //                     def.resolve(cache.get(key));
    //                 }).promise();
    //     };

    //     _dictLRUCache.prototype.addItem = function(itemKey, oid, item){
    //         var key = itemKey + "_"+oid;
            
    //         cache.set(key, item);
    //         console.log('lrucache add item ......'+itemKey + "  "+oid);    
    //     };

    //     return _dictLRUCache;
    // }();


    // var cache = null;

    // if("indexedDB" in window){
    //     console.log('support index db');
    //     cache = new DictIndexedDB2();
    // }else{
    //     console.log('not support index db');
    //     cache = new DictLRUCache();
    // }

    var cache = new YIUI.DictCache();
    var reqMap = {};

    var Return = {
        getItem: function(itemKey, oid) {

            if(itemKey == null || itemKey.isEmpty()){
                console.error('error itemKey and oid:['+itemKey + "   "+oid+"]");
                return $.Deferred(function(def){
                            def.resolve(null);
                        });
            }
            
            oid = parseInt(oid);

            var key = itemKey + "_" + oid;

            if(!reqMap[key]){
                reqMap[key] = cache.get(key)
                                .then(function(data){
                                        if(data){
                                            return data;
                                        }else{
                                            //不存在；
                                            return YIUI.DictService.getItem(itemKey, oid).then(function(item){
                                 
                                                if(item){
                                                    cache.put(key, item);
                                                }else{
                                                    console.log('dict service not find ......'+itemKey + "  "+oid);    
                                                }

                                                return item;
                                            }); 
                                        }
                                },function(error){
                                    console.log('error ......'+error);
                                }).always(function(){
                                    setTimeout(function(){
                                        delete reqMap[key];
                                    },100);
                                });
            }

            return reqMap[key];  
        },

        getCaption: function(itemKey, oid) {
            if(itemKey == null || itemKey.isEmpty()){
                console.error('error itemKey and oid:['+itemKey + "   "+oid+"]");
                return $.Deferred(function(def){
                            def.resolve('');
                        });
            }
            
            return this.getItem(itemKey, oid)
                        .then(function(item){
                            if(item == null){
                                return '';
                            }
                            return item.caption;
                        });
        }


	};
	return Return;
})();
