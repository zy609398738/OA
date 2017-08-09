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

    init: function (options) {
        this.base(options);
        var meta = this.getMetaObj();
        this.icon = meta.icon || this.icon;
        this.clickContent = $.isUndefined(meta.onClick) ? "" : meta.onClick.trim();
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

    focus:function () {
        this.el.attr("tabindex",0).focus();
    },

    setValue: function (value, commit, fireEvent) {
        var changed = this.base(value, commit, fireEvent);
        this.button && this.button.getTextButton().html(value.toString());
        return changed;
    },
    
    getShowText: function() {
    	return this.value;
    },

    getFormatEl: function() {
    	return this.button.getTextButton();
    },

    setFormatStyle: function (cssStyle) {
        this.cssStyle = cssStyle;
        this.button && this.button.getTextButton().css(cssStyle);
        this.foreColor && this.button.getTextButton().css("color", this.foreColor);
    },

    onSetWidth: function (width) {
        this.button.setWidth(width);
        if (this.format) {
        	var hAlign = this.format.hAlign;
        	var $el = this.button.getEl();
        	switch(hAlign) {
        		case 0:
        			$("button", $el).css({textAlign: "left"});
        			break;
        		case 1:
        			$("button", $el).css({textAlign: "center"});
        			break;
        		case 2:
        			$("button", $el).css({textAlign: "right"});
        			break;
        			
        	}
        }
        
        
    },

    onSetHeight: function (height) {
        this.button.setHeight(height);
        if (this.format){
        	var vAlign = this.format.vAlign;
        	var $el = this.button.getEl();
        	var textheight = this.button.getTextButton().height();
        	var btnheight = $("button", $el).height();
        	if ($(".icon", $el).length > 0){
        		$(".icon", $el).width(textheight).height(textheight);
        	}
        	switch(vAlign){
            case 0:
                $("span", $el).css({
                    marginBottom: btnheight - textheight + "px"
                });
                break;
            case 2:
                $("span", $el).css({
                    marginTop: btnheight - textheight + "px"
                });
                break;
        	}
        	
        }
        
    },

    /**
     * 完成button的渲染。
     */
    onRender: function (ct) {
        this.base(ct);
        var $this = this;
        this.button = new YIUI.Yes_Button({
            el: $this.el,
            caption: this.value || this.caption,
            IEFile:$.browser.isIE && this.key && this.key.toLowerCase().indexOf('upload') != -1
        });
        this.el.addClass("ui-btn");
        this.icon && this.setIcon(this.icon);
    },

    /**
     * 给DOM添加事件监听。
     */
    install: function () {
        var self = this;

        var fireEvent = function (e) {
            if( !self.enable ) {
                return false;
            }
            if($(e.target).hasClass("upload")) {
                window.up_target = $(e.target);
            }
            self.focus();
            self.handler.doOnClick(self.ofFormID, self.clickContent, self.key);
        };

        self.el.click($.debounce(100, function (e) {
            fireEvent(e);
        }));

        self.el.keydown(function (event) {
            var keyCode = event.keyCode || event.charCode;
            if( keyCode == 13 || keyCode == 108 ) {
                fireEvent(event);
            }
            if ( keyCode === 9 ) {
                self.focusManager.requestNextFocus(self);
                event.preventDefault();
            }
        });
    }
});
YIUI.reg('button', YIUI.Control.Button);