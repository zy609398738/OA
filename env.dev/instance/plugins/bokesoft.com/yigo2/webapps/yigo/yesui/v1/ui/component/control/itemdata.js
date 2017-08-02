(function () {
    YIUI.ItemData = function (options) {
    	this.oid = options.oid || 0;
    	this.itemKey = options.itemKey || "";
    	this.caption = options.caption || "";
    };
    Lang.impl(YIUI.ItemData, {
		getOID: function(){
			return this.oid;
		},
		getItemKey: function(){
			return this.itemKey;
		},
		getCaption: function() {
			return this.caption;
		},
		equals: function(o){
			if(o == null){
				return false;
			}
			return this.toString() == o.toString();
		},
		toString: function(){
			return this.itemKey + "_" + this.oid;
		},
		toJSON: function() {
			var jsonObj = {
				oid: this.oid,
				itemKey: this.itemKey,
				caption: this.caption
			};
			return jsonObj;
		},
		fromJSON: function(jsonObj) {
			if(jsonObj.oid) {
				this.oid = jsonObj.oid;
			}
			if(jsonObj.itemKey) {
				this.itemKey = jsonObj.itemKey;
			}
			if(jsonObj.caption) {
				this.caption = jsonObj.caption;
			}
		}
    });
})();