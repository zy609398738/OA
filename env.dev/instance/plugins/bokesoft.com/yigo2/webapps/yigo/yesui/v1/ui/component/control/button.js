/**
 * 按钮控件。
 */
YIUI.Control.Button = YIUI.extend(YIUI.Control, {
    /**
     * String。
     * render控件时，为控件自动创建的DOM标签。
     */
    autoEl: '<div><button></button></div>',

    handler: YIUI.ButtonHandler,
    
    behavior: YIUI.ButtonBehavior,

    /** 图标 */
    icon: null,
    
    /** 按钮操作类型 */
    type: YIUI.Button_Type.DEFAULT,
    
    setType: function(type) {
    	this.type = type;
    	this.button.setType(type);
    },

    setIcon: function (icon) {
        this.icon = icon;
        this.button.setIcon(icon);
    },

    needClean: function () {
        return false;
    },

    setTip: function (tip) {
        var tip = this.value;
        this.base(tip);
    },

    setValue: function (value, commit, fireEvent) {
        var changed = this.base(value, commit, fireEvent);
        this.button.getTextButton().html(value.toString());
        return changed;
    },
    
    getShowText: function() {
    	return this.value;
    },

    setEnable: function (enable) {
        this.enable = enable;
        this.button.setEnable(enable);
    },

    setFormatStyle: function (cssStyle) {
        this.cssStyle = cssStyle;
        this.button.getTextButton().css(cssStyle);
    },

    onSetWidth: function (width) {
        this.button.setWidth(width);
    },

    onSetHeight: function (height) {
        this.button.setHeight(height);
    },

    /**
     * 完成button的渲染。
     */
    onRender: function (ct) {
        this.base(ct);
        var $this = this;
        this.button = new YIUI.Yes_Button({
            el: $this.el,
            type: $this.getMetaObj().type
        });
        this.el.addClass("ui-btn");
        this.button.getTextButton().html(this.value);
        this.getMetaObj().icon && this.setIcon(this.getMetaObj().icon);
    },

    initDefaultValue: function (options) {
        this.base(options);
        this.el.outerWidth(this.el.width());
        if (options.clickContent) {
            this.clickContent = options.clickContent;
        }
        var $this = this;
        this.button = new YIUI.Yes_Button({
            el: $this.el,
            isPortal: true
        });
        this.install();
    },
    
    /**
     * 给DOM添加事件监听。
     */
    install: function () {
        var self = this;
        self.el.click(function (e) {
    		window.up_target = null;
        	if(!self.enable) {
        		e.stopPropagation();
        		return false;
        	} else if($(e.target).hasClass("upload")) {
        		window.up_target = $(e.target);
        	}
            self.handler.doOnClick(self);
        });

        self.el.keydown(function (event) {
            var keyCode = event.keyCode || event.charCode;
            if (keyCode === 9) {   //Tab
                self.focusManager.requestNextFocus(self);
                event.preventDefault();
            }
        });
    }
});
YIUI.reg('button', YIUI.Control.Button);