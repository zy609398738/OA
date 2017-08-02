/**
 * 标签控件，主要用于显示文本。
 */
YIUI.Control.Label = YIUI.extend(YIUI.Control, {
    
	autoEl: "<div></div>",
	
    /**
     * String。 
     * 图标
     */
    icon : null,
    
    init: function (options) {
        this.base(options);
        var meta = this.getMetaObj();
        this.icon = meta.icon || this.icon;
        this.value = this.caption;
    },

    onSetWidth: function(width) {
    	this.yesLabel.setWidth(width);
    },
    
    onSetHeight: function(height) {
    	this.yesLabel.setHeight(height);
    },
    
    setFormatStyle: function(cssStyle) {
    	this.yesLabel.setCssStyle(cssStyle);
	},
	
	setIcon: function(icon) {
		this.yesLabel.setIcon(icon);
	},

    needClean: function() {
    	return false;
    },

    setTip: function (tip) {
        var tip = this.value;
        this.base(tip);
    },

    checkEnd: function(value) {
    	this.value = value;
        this.yesLabel.setValue(value);
    },

    /** 
     * 完成label的渲染。
     */
    onRender: function (ct) {
    	this.base(ct);
    	var $this = this;
    	this.yesLabel = new YIUI.Yes_Label({
    		el: $this.el,
    		icon: $this.icon,
    		caption: YIUI.TypeConvertor.toString($this.value),
    		format: $this.format
    	});
    	if(this.buddy) {
    		this.el.addClass("ui-innerlbl");
    	} else {
    		this.el.addClass("ui-lbl");
    	}
    }
});
YIUI.reg('label', YIUI.Control.Label);