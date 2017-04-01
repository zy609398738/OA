var IndexedDBProxy = (function(){
	var db = null;
	var DB, tx;
	var dbName;
	function _indexedDBProxy(name){
		dbName = name || "YigoIndexedDB";
	};

	_indexedDBProxy.prototype.open = function(upgrade, version){
		return $.Deferred(function (def) {
	                var request = indexedDB.open(dbName, version);
	                if(upgrade){
	                    request.onupgradeneeded = upgrade;
	                }
	                
	                request.onsuccess = function () {
	                    def.resolve(request.result);
	                };

	                request.onerror = def.reject;
	            }).then(function(d){
	            	db = d;
	            	console.log('indexdb open...');
	            });
	};


	var _get = function(db, table, key, tx){
		return $.Deferred(function (def) {
	                tx = tx || db.transaction(table, 'readwrite');
	                var store = tx.objectStore(table);
	                var request = store.get(key);
	                request.onsuccess = function (e) {
	                    def.resolve(request.result);
	                };
	                request.onerror = def.reject;
		           
	            });
	};

	var _getByIndex = function(db, table, indexName, key, tx){
		return $.Deferred(function (def) {
	                tx = tx || db.transaction(table, 'readwrite');
	                var store = tx.objectStore(table);

	                var index = store.index(indexName);

	                var request = index.get(IDBKeyRange.only(key));

	                request.onsuccess = function (e) {
	                    def.resolve(request.result);
	                };
	                request.onerror = def.reject;
		           
	            });
	};

	var _put = function(db, table, value, tx){
		return $.Deferred(function (def) {
	                tx = tx || db.transaction(table, 'readwrite');
	                var store = tx.objectStore(table);

	                var request = store.add(value);
	                request.onsuccess = function () {
	                	console.log("put a item...");
	                    def.resolve(request.result);
	                };
	                request.onerror = def.reject;
	            });
	};

	var _clear = function(db, table, tx){
		return $.Deferred(function (def) {
	                tx = tx || db.transaction(table, 'readwrite');
	                var store = tx.objectStore(table);

	                var request = store.clear();
	                request.onsuccess = function () {
	                	console.log("clear ..."+dbName);
	                    def.resolve(request.result);
	                };
	                request.onerror = def.reject;
	            });
	};

	_indexedDBProxy.prototype.get = function(table, key){
		return _get(db, table, key);
	};

	_indexedDBProxy.prototype.getByIndex = function(table, indexName, key){
		return _getByIndex(db, table, indexName, key);
	};

	_indexedDBProxy.prototype.exists = function(table){
		return db.objectStoreNames.contains(table);
	};

	_indexedDBProxy.prototype.put = function(table, value){
		return _put(db, table, value);
	};

	_indexedDBProxy.prototype.clear = function(table){
		return _clear(db, table);
	};


	return _indexedDBProxy;
})();