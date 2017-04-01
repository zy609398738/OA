YIUI.Panel.FlexFlowLayoutPanel = YIUI.extend(YIUI.Panel, {
	layout : 'FlexFlowLayout',
	
	initDefaultValue: function(options) {
    	this.base(options);
    	
    	var items = this.items,
    		item,
    		panelHeight = this.el.outerHeight() - this.getPlaceholderSize();
    	for (var i = 0, len = items.length; i < len; i++) {
    		item = items[i].el;
    		if($.isPercentage(item.attr("height"))){
				item.height($.getReal(item.attr("height"), panelHeight));
			}
		}
	},
	
	getPlaceholderSize : function() {
		var placeholderSize = 0,
			items = this.items,
			item;
		for(var i= 0,len=items.length;i<len;i++) {
			item = items[i].el;
			if(!$.isPercentage(item.attr("height"))){
				placeholderSize += item.height();
			}
		}
		return placeholderSize;
	}
});
YIUI.reg("flexflowlayoutpanel",YIUI.Panel.FlexFlowLayoutPanel);