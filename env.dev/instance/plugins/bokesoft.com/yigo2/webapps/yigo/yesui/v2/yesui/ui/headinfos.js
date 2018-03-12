YIUI.HeadInfos = (function () {
	var Return = {
			size : 0,
			table : {},
			
			put: function(key, value) {
				var added = false;
				if ( !this.containsKey(key) ) {
					++this.size;
					added = true;
				}
				this.table[key] = value;
				return added;
			},
			get: function(key) {
				return this.containsKey(key) ? this.table[key] : null;
			},
			remove: function(key) {
				if (this.containsKey(key)) {
					var value = this.table[key];
					if (delete this.table[key]) {
						--this.size;
						return value;
					}					
				}				
				return null;
			},
			containsKey: function(key) {
				return key in this.table;
			},
			keys: function() {
				var keys = new Array();
				for ( var prop in this.table ) {
					keys.push(prop);
				}
				return keys;
			},
			empty: function() {
				return this.size == 0;
			},
			clear: function() {
				this.table = new Object();
			},
			toJSON: function() {
				return $.toJSON(this.table);
			}
	};
	return Return;
})();