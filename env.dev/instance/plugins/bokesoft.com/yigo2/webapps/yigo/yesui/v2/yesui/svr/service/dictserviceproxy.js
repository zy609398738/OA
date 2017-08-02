YIUI.DictService = (function () {
	var Return = {
		/**
		 * 获取所有父节点ID
		 */
		getAllParentID : function(itemKey, itemDatas, callback){
			var result = true;
			var data = {};
			data.itemKey = itemKey;
			data.itemDatas = $.toJSON(itemDatas);
			data.service = "DictService";
			data.cmd = "GetParentPath";
			var success = function(msg) {
				if ($.isFunction(callback)){
					callback(msg);
				}else{
					result = msg;
				}
			};

			Svr.Request.getSyncData(Svr.SvrMgr.ServletURL, data, success);
			return result;
		},
        /**
         * 获取所有字典项
         */
        getAllItems: function (itemKey, filter, stateMask, callback) {
            var result = true;
            var data = {};
            data.service = "DictService";
            data.cmd = "GetAllItems";
            data.itemKey = itemKey;
            if (filter != null) {
                data.filter = $.toJSON(filter);
            }
            data.stateMask = stateMask;
            var success = function (msg) {
                if ($.isFunction(callback)) {
                    callback(msg);
                } else {
                    result = msg;
                }
            };
            Svr.Request.getSyncData(Svr.SvrMgr.ServletURL, data, success);
            return result;
        },
		/**
		 * 根据父节点获取子节点
		 */
		getDictChildren: function(itemKey, itemData, filter, stateMask){
			var result = true;
			var params = {};
			params.itemKey = itemKey;
			params.itemData = $.toJSON(itemData);
			if(filter != null){
				params.filter = $.toJSON(filter);
			}
			params.service = "WebDictService";
			params.cmd = "GetDictChildren";
			params.stateMask = stateMask;
			
			return Svr.Request.getData(params);
		},
		
		/**
		 * 精确查找 GetDictOID调用 暂时保留 此同步方法
		 */
		locate: function(itemKey, field, value, filter, root, statMask, callback){
			var result = true;
			var data = {};
			data.itemKey = itemKey;
			if(field != null){
				data.field = field;
			}
			data.value = value;
			if(filter != null){
				data.filter = $.toJSON(filter);
			}
			data.root = $.toJSON(root);
			data.statMask = statMask;
			
			data.service = "DictService";
			data.cmd = "Locate";
			
			var success = function(msg) {
				if ($.isFunction(callback)){
					callback(msg);
				}else{
					result = msg;
				}
			};

			Svr.Request.getSyncData(Svr.SvrMgr.ServletURL, data, success);
			return result;
		},

				/**
		 * 精确查找 GetDictOID调用 暂时保留 此同步方法
		 */
		lookup: function(itemKey, field, value, filter, root, statMask, callback){
			var result = true;
			var data = {};
			data.itemKey = itemKey;
			if(field != null){
				data.field = field;
			}
			data.value = value;
			if(filter != null){
				data.filter = $.toJSON(filter);
			}
			data.root = $.toJSON(root);
			data.statMask = statMask;
			
			data.service = "DictService";
			data.cmd = "Locate";
			
			var success = function(msg) {
				if ($.isFunction(callback)){
					callback(msg);
				}else{
					result = msg;
				}
			};

			Svr.Request.getSyncData(Svr.SvrMgr.ServletURL, data, success);
			return result;
		},

		/**
		 * 精确查找
		 */
		locate2: function(itemKey, field, value, filter, root, statMask){
			var result = true;
			var params = {};
			params.itemKey = itemKey;
			if(field != null){
				params.field = field;
			}
			params.value = value;
			if(filter != null){
				params.filter = $.toJSON(filter);
			}
			params.root = $.toJSON(root);
			params.statMask = statMask;
			
			params.service = "DictService";
			params.cmd = "Locate";

			return Svr.Request.getData(params);
		},
		
		/**
		 * 获取一个字典缓存
		 */
		getItem: function(itemKey, oid, statMask, callback) {
			var data = {};
			data.itemKey = itemKey;
			data.oid = oid;
			data.statMask = statMask;
			data.cmd = "GetItem";
			data.service = "WebDictService";
			
			return Svr.Request.getData(data).then(function(data) {
				var item = null;
				if(data) {
					item = YIUI.DataUtil.fromJSONItem(data);
				}
				return item;
			});
			
		},
		
		/**
		 * 模糊查询　用于dictQueryPane 与　链式字典的dictView
		 
		getQueryData: function(itemKey, startRow, maxRows, pageIndicatorCount, fuzzyValue, stateMask, filter, root, callback){
			var result = true;
			var data = {};
			data.itemKey = itemKey;
			data.startRow = startRow;
			data.maxRows = maxRows;
			data.pageIndicatorCount = pageIndicatorCount;
			data.value = fuzzyValue;
			data.stateMask = stateMask;
			
			if(filter != null){
				data.filter = $.toJSON(filter);
			}
			if(root != null){
				data.root = $.toJSON(root);
			}
			data.service = "WebDictService";
			data.cmd = "GetQueryData";
			
			var success = function(msg) {
				if ($.isFunction(callback)){
					callback(msg);
				}else{
					result = msg;
				}
			};

			Svr.Request.getSyncData(Svr.SvrMgr.ServletURL, data, success);
			return result;
		},*/
		getQueryData: function(itemKey, startRow, maxRows, pageIndicatorCount, fuzzyValue, stateMask, filter, root){
			var result = true;
			var params = {};
			params.itemKey = itemKey;
			params.startRow = startRow;
			params.maxRows = maxRows;
			params.pageIndicatorCount = pageIndicatorCount;
			params.value = fuzzyValue;
			params.stateMask = stateMask;
			
			if(filter != null){
				params.filter = $.toJSON(filter);
			}
			if(root != null){
				params.root = $.toJSON(root);
			}
			params.service = "WebDictService";
			params.cmd = "GetQueryData";

			return Svr.Request.getData(params);
		},
		
		getQueryCols: function(itemKey) {
			var params = {};
			params.itemKey = itemKey;
			params.service = "WebMetaService";
			params.cmd = "GetQueryColumns";
			return Svr.Request.getSyncData(Svr.SvrMgr.ServletURL, params);
		},
		
		getDisplayCols: function(itemKey) {
			var params = {};
			params.itemKey = itemKey;
			params.service = "WebMetaService";
			params.cmd = "GetDisplayColumns";
			return Svr.Request.getSyncData(Svr.SvrMgr.ServletURL, params);
		},
		
		/**
		 * 直接输入文本时智能提示相关数据
		 */
		getSuggestData: function(itemKey, suggestValue, stateMask, filter, root, callback){
			var result = true;
			var data = {};
			data.itemKey = itemKey;
			data.value = suggestValue;
			data.stateMask = stateMask;
			if(filter != null){
				data.filter = $.toJSON(filter);
			}
			if(root != null){
				data.root = $.toJSON(root);
			}
			data.service = "WebDictService";
			data.cmd = "GetSuggestData";
			
//			var success = function(msg) {
//				if ($.isFunction(callback)){
//					callback(msg);
//				}else{
//					result = msg;
//				}
//			};
//			Svr.Request.getSyncData(Svr.SvrMgr.ServletURL, data, success);
			return Svr.Request.getData(data);;
		},
		
		/**
		 * 获取当前节点的父节点ID
		 
		getParentID: function(itemKey, itemData, callback){
			var result = true;
			var data = {};
			data.itemKey = itemKey;
			data.itemData = $.toJSON(itemData);
			data.cmd = "GetParentID";
			data.service = "WebDictService";
			
			var success = function(msg) {
				if ($.isFunction(callback)){
					callback(msg);
				}else{
					result = msg;
				}
			};

			Svr.Request.getSyncData(Svr.SvrMgr.ServletURL, data, success);
			return result;
			
		},*/
		
		/**
		 * 修改字典使用状态
		 */
		enableDict: function(itemKey, oid, enable, allChildren, callback){
			var result = true;
			var data = {};
			data.itemKey = itemKey;
			data.oid = oid;
			if(typeof(enable) == undefined || enable == null){
				enable = 1;
			} 
			data.enable = enable.toString();
			data.allChildren = allChildren
			data.cmd = "EnableDict";
			data.service = "WebDictService";
			
			var success = function(msg) {
				if ($.isFunction(callback)){
					callback(msg);
				}else{
					result = msg;
				}
			};

			Svr.Request.getSyncData(Svr.SvrMgr.ServletURL, data, success);
			return result;
		},
		
		/**
		 * 根据字典itemKey id取caption
		 */
		getCaption: function(itemKey, oid){

			var params = {};
            params.itemKey = itemKey;
            
            if($.isArray(oid)) {
                oid = $.toJSON(oid);
            }
            params.oids = oid;
            params.cmd = "getCaption";
            params.service = "WebDictService";


            return Svr.Request.getData(params);

			// var result = true;
			// var data = {};
			// data.itemKey = itemKey;
			
			// if($.isArray(oid)) {
			// 	oid = $.toJSON(oid);
			// }
			// data.oids = oid;

			// data.cmd = "getCaption";
			// data.service = "WebDictService";
			
			// var success = function(msg) {
			// 	if ($.isFunction(callback)){
			// 		callback(msg);
			// 	}else{
			// 		result = msg;
			// 	}
			// };

			// Svr.Request.getSyncData(Svr.SvrMgr.ServletURL, data, success);
			// return result;
		},
		
		getDictValue: function(itemKey, oid, fieldKey, callback){
            if(oid == undefined || oid == null) return null;
			var result = true;
			var data = {};
			data.itemKey = itemKey;
			data.oid = oid.toString();
			data.fieldKey = fieldKey;
			
			data.cmd = "GetDictValue";
			data.service = "WebDictService";
			
			var success = function(msg) {
				if ($.isFunction(callback)){
					callback(msg);
				}else{
					result = msg;
				}
			};

			Svr.Request.getSyncData(Svr.SvrMgr.ServletURL, data, success);
			return result;
		},
        
        /*
         *根据节点获取父节点路径
         */
        getTreePath: function(itemKey, child) {
        	var params = {
			    			service: "DictService",
			    			cmd: "GetParentPath",
			    			itemKey: itemKey,
        				 };
        	params[$.isArray(child)?'itemDatas':'itemData'] = $.toJSON(child) 
 			
            return Svr.Request.getData(params);
        },
        
        getParentPath: function(itemKey, child) {
        	var paras = {
    			service: "DictService",
    			cmd: "GetParentPath",
    			itemKey: itemKey,
    			itemData: $.toJSON(child)
        	};
            return Svr.Request.getData(paras);;
        }
		
	    
	}
	return Return;
})();