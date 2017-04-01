var DictLRUCache = (function(){

	var cache = new LRUCache(200);

	function _dictLRUCache(){
		// cache.set(1,1);
		// cache.set(2,2);
		// cache.set(3,3);
		// cache.set(4,4);
		// cache.set(5,5);
		// cache.set(6,6);
		// cache.set(7,7);
		// cache.set(2,2);
		// cache.set(2,2);
		// cache.set(2,2);
		// cache.set(2,2);
		// cache.set(2,2);
		// cache.set(2,2);
		// cache.set(3,3);

		// cache.forEach(function(val, key){
		// 	console.log(val)
		// });
	};

	_dictLRUCache.prototype.getItem = function(itemKey, oid){
		return $.Deferred(function(def){
					var key = itemKey + "_"+oid;
					def.resolve(cache.get(key));
				}).promise();
	};

	_dictLRUCache.prototype.addItem = function(itemKey, oid, item){
		var key = itemKey + "_"+oid;
		
		cache.set(key, item);
		console.log('lrucache add item ......'+itemKey + "  "+oid);    
	};

	return _dictLRUCache;
})();