var DictIndexedDB = (function(){

	var indexedDB = null;
	var TABLE_NAME = 'DictCache';

	function _dictIndexedDB(){
		var upgrade = function (evt) {

			if(evt.currentTarget.result.objectStoreNames.contains(TABLE_NAME)){
				evt.currentTarget.result.deleteObjectStore(TABLE_NAME);
			}

			var store = evt.currentTarget.result.createObjectStore(
				TABLE_NAME,{keyPath: ['itemKey','oid']});

			store.createIndex('index_key', ['itemKey','oid'], { unique: true });

			console.debug("initDb.onupgradeneeded");
		};

		indexedDB = new IndexedDBProxy("YigoDictDB");
		indexedDB.open(upgrade, 4).then(function(){
			indexedDB.clear(TABLE_NAME);
		});

	};

	_dictIndexedDB.prototype.getItem = function(itemKey, oid){
		var key = itemKey + "_"+oid;
		
		console.log('getItem:'+key);

		var v = [];
		v.push(itemKey);
		v.push(oid);
		return indexedDB.getByIndex(TABLE_NAME, 'index_key', v);
		// return indexedDB.get(TABLE_NAME, key);

		// return indexedDB.get(itemKey, oid);
	};

	_dictIndexedDB.prototype.addItem = function(item){
		var key = item.itemKey + "_"+item.oid;
		
		console.log('addItem:'+key);

		return indexedDB.put(TABLE_NAME, item);

		// return indexedDB.get(itemKey, oid);
	};

	return _dictIndexedDB;
})();

var DictIndexedDB2 = (function(){

	var indexedDB = null;
	var TABLE_NAME = 'DictCache';

	function _dictIndexedDB(){
		var upgrade = function (evt) {

			if(evt.currentTarget.result.objectStoreNames.contains(TABLE_NAME)){
				evt.currentTarget.result.deleteObjectStore(TABLE_NAME);
			}

			var store = evt.currentTarget.result.createObjectStore(
				TABLE_NAME,{keyPath: 'key'});

			store.createIndex('index_keypath', 'key', { unique: true });

			console.debug("initDb.onupgradeneeded");
		};

		indexedDB = new IndexedDBProxy("YigoDictDB2");
		indexedDB.open(upgrade, 1).then(function(){
			indexedDB.clear(TABLE_NAME);
		});

	};

	_dictIndexedDB.prototype.getItem = function(itemKey, oid){
		var key = itemKey + "_"+oid;

		return indexedDB.get(TABLE_NAME, key).then(function(data){
					if(data){
						// console.log('cache...............');
						return data.value;
					}else{
						// console.log('cache...............not find'+oid);
						return null;
					}
				});

		// var v = [];
		// v.push(itemKey);
		// v.push(oid);
		// return indexedDB.getByIndex(TABLE_NAME, 'index_key', v);

	};

	_dictIndexedDB.prototype.addItem = function(itemKey, oid, item){
		var key = itemKey + "_"+oid;
		
		var o = {};
		o.key = key;
		o.value = item;

		indexedDB.put(TABLE_NAME, o);
	};

	return _dictIndexedDB;
})();