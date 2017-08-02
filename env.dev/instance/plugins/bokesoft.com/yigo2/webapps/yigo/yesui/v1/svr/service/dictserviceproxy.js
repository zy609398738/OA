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
                data.filter = filter;
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
		getDictChildren: function(itemKey, itemData, filter, stateMask, callback){
			var result = true;
			var data = {};
			data.itemKey = itemKey;
			data.itemData = $.toJSON(itemData);
			if(filter!=null){
				data.filter = $.toJSON(filter);
			}
			data.service = "WebDictService";
			data.cmd = "GetDictChildren";
			data.stateMask = stateMask;
			
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
		 * 获取一个字典缓存
		 */
		getItem: function(itemKey, oid, statMask, callback) {
			var data = {};
			data.itemKey = itemKey;
			data.oid = oid;
			data.statMask = statMask;
			data.cmd = "GetItem";
			data.service = "WebDictService";
			
			var result = true;
			var success = function(msg) {
				var item = null;
				if(msg){
					item = YIUI.DataUtil.fromJSONItem(msg);
				}
				if ($.isFunction(callback)){
					callback(item);
				}else{
					result = item;
				}
			};

			Svr.Request.getSyncData(Svr.SvrMgr.ServletURL, data, success);
			return result;
			
			
		},
		
		/**
		 * 模糊查询　用于dictQueryPane 与　链式字典的dictView
		 */
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
		},
		
		/**
		 * 直接输入文本时智能提示相关数据
		 */
		getSuggestData: function(itemKey, suggestValue, statMask, filter, root, callback){
			var result = true;
			var data = {};
			data.itemKey = itemKey;
			data.value = suggestValue;
			data.statMask = statMask;
			if(filter != null){
				data.filter = $.toJSON(filter);
			}
			if(root != null){
				data.root = $.toJSON(root);
			}
			data.service = "WebDictService";
			data.cmd = "GetSuggestData";
			
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
		 * 获取当前节点的父节点ID
		 */
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
			
		},
		
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
		getCaption: function(itemKey, oid, callback){
			var result = true;
			var data = {};
			data.itemKey = itemKey;
			
			if($.isArray(oid)) {
				oid = $.toJSON(oid);
			}
			data.oids = oid;

			data.cmd = "getCaption";
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
        
        getTreePath: function(itemKey, child) {
        	var paras = {
    			service: "DictService",
    			cmd: "GetParentPath",
    			itemKey: itemKey,
    			itemData: $.toJSON(child)
        	};
            var result = Svr.Request.getSyncData(Svr.SvrMgr.ServletURL, paras);
            return result;
        },
        
        getParentPath: function(itemKey, child) {
        	var paras = {
    			service: "DictService",
    			cmd: "GetParentPath",
    			itemKey: itemKey,
    			itemData: $.toJSON(child)
        	};
            var result = Svr.Request.getSyncData(Svr.SvrMgr.ServletURL, paras);
            return result;
        }
		
	    
	}
	return Return;
})();