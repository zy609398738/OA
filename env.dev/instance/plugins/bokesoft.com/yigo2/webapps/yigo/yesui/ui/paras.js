(function () {
    YIUI.Paras = function (json) {
    	var Return = {
	    	map: {},
	    	mapType: {},
			put: function(key, value) {
				this.map[key] = value;
			},
			get: function(key) {
				return this.map[key];
			},
			getMap: function() {
				return this.map;
			},
			init: function() {
				if($.isEmptyObject(json)) return;
				var items = json.items;
				for (var i = 0, len = items.length; i < len; i++) {
					var item = items[i];
					this.put(item.key, item.value);
					this.mapType[item.key] = item.type;
				}
			},
			toJSON: function() {
				var json = {};
				if (!$.isEmptyObject(this.map)) {
					var items = [];
					for(var m in this.map) {
						var v = this.map[m];
						var type = this.mapType[m];
						if(!type || type == -1) {
							if($.isNumeric(v)) {
								//TODO 判断类型是int还是long
								//int
//								type = YIUI.JavaDataType.USER_INT;
								//long
								type = YIUI.JavaDataType.USER_LONG;
							} else if(v instanceof Decimal) {
								type = YIUI.JavaDataType.USER_NUMERIC;
								v = v.toString();
							} else if(typeof v == "boolean") {
								type = YIUI.JavaDataType.USER_BOOLEAN;
							} else if(v instanceof Date) {
								type = YIUI.JavaDataType.USER_DATETIME;
								v = v.getTime();
							} else if(typeof v == "string") {
								type = YIUI.JavaDataType.USER_STRING;
							}
						}
						var item = {
							key: m,
							value: v || null,
							type: type
						}
						items.push(item);
					}
					json.items = items;
				}
				return $.toJSON(json);
			}
    	};
    	Return.init();
        return Return;
    }
})();