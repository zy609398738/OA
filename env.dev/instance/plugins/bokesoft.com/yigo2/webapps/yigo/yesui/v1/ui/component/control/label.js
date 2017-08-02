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
    
    setValue: function (value, commit, fireEvent) {
    	var changed = this.base(value, commit, fireEvent);
        this.yesLabel.setValue(this.value);
    	return changed;
    },
    /** 
     * 完成label的渲染。
     */
    onRender: function (ct) {
    	this.base(ct);
    	var $this = this;
    	$this.value = $this.value || $this.caption;
    	this.yesLabel = new YIUI.Yes_Label({
    		el: $this.el,
    		icon: $this.getMetaObj().icon,
    		caption: $this.value
    	});
    	if(this.buddy) {
    		this.el.addClass("ui-innerlbl");
    	} else {
    		this.el.addClass("ui-lbl");
    	}
    }
});
YIUI.reg('label', YIUI.Control.Label);