Ext.namespace('MAP.ui.form');
MAP.ui.form.HtmlPage = Ext.extend(Ext.Panel, {
	constructor : function(config) {
		config = config || {};
		config.html = '<iframe id = "iframe_'+config.id+'" src="'+ config.value +'" scrolling="yes" frameborder="no" border="0" width="100%" height="100%" allowTransparency="true"></iframe>';
		MAP.ui.form.Panel.superclass.constructor.call(this, config);
	},
	setValue : function(_val) {
		if (this.value != _val) {
			Ext.getDom('iframe_'+this.id).src = _val;
            this.value = _val;
		}
	}
});
Ext.reg('map_htmlpage', MAP.ui.form.HtmlPage);
