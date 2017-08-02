/**
 * 单选按鈕，一组单选按钮中，只能有个一个按钮时处于选中状态。
 * name形式: ofFormID + '_' + groupKey。
 */
YIUI.Control.RadioButton = YIUI.extend(YIUI.Control, {
	/**
	 * String。
	 * 此控件由radio和label组成，因此自动创建为div。
	 */
    autoEl: '<div class="ui-rdo">',

    handler: YIUI.RadioButtonHandler,
    
    behavior: YIUI.RadioButtonBehavior,
    
    /** 
     * Boolean。
     * 是否默认选中。
     */
    checked : false,
    
    /** 
     * String。
     * 分组名称 ,名称相同，则在一个分组内。
     */
    groupKey : '',
    
    /**
     * String。
     * 单个RadioButton设置的值。
     * 区别于value。
     */
    metaValue: '',
    
    listeners: {
    	change: function() {
    		//head
    		var comp = this;
    		if(!this.getMetaObj().isGroupHead) {
    			var form = YIUI.FormStack.getForm(this.ofFormID);
    			comp = form.getComponent(this.groupHeadKey);
    		}
    		var newValue = comp.getValue();
            if (typeof newValue == "object" && newValue != null) {
                newValue = $.toJSON(newValue);
            }
            this.handler.doValueChanged(comp, newValue, true, true);
    	}
    },
    
    checkEnd: function(value) {
		this.value = value;
		if($.isDefined(value) && value){
    		var radios = $("[name="+this.ofFormID+ "_" + this.getMetaObj().groupKey+"]");
    		for (var i = 0, len = radios.length; i < len; i++) {
    			var radio = radios.eq(i);
				if(radio.val() == value) {
					radio.prop("checked", true);
			 		$(this._groKey).data(this._groKey, value);
				} 
			}
    	}
	},
	
    getValue: function() {
    	var value = $(this._groKey).data(this._groKey);
    	return value;
    },
    
    setText: function(text) {
    	$("label", this.el).html(text);
    },
    
    getText: function() {
    	return $("label", this.el).html();
    },

    setEnable: function(enable) {
    	this.enable = enable;
    	var el = $("input", this.el),
		outerEl = this.el;
    	if(this.enable) {
			el.removeAttr('disabled');
			outerEl.removeClass("ui-readonly");
		} else {
			el.attr('disabled', 'disabled');
			outerEl.addClass("ui-readonly");
		}
    },
    
    onSetHeight: function (height) {
        this.base(height);
        $("label", this.el).css({height: height + "px", lineHeight: height + "px" });
        var $input = $("input", this.el);
        $input.css("margin-top", (height - $input.height()) / 2);
    },

    onSetWidth: function(width) {
    	this.base(width);
        $("label", this.el).css("width", width - $("input", this.el).outerWidth());
    },

    setFormatStyle: function(cssStyle) {
    	$("label", this.el).css(cssStyle);
    	$("input", this.el).css(cssStyle);
	},
	
    onRender: function (ct) {
    	this.base(ct);
        var radio = $('<input id="radio_' + this.id + '" type="radio" value="' + this.getMetaObj().metaValue +
            '" name="' + this.ofFormID+ '_' + this.getMetaObj().groupKey + '">').appendTo(this.el);
        radio.prop('checked', (this.checked || false));
        this._groKey = "ui_" + this.getMetaObj().groupKey+ '_' + this.ofFormID;

        var txt = this.text.replace(/ /g, "&nbsp;");
        $('<label id=label_"' + this.id + ' for="radio_' + this.id + '">' + txt + '</label>').appendTo(this.el);
        if(this.getMetaObj().isGroupHead) {
        	var group = this._groKey;
        	$("<"+group+"/>").appendTo(this.el);
        }
        $(this._groKey).data(this._groKey, this.value);
    },
    focus: function () {
        $("input", this.el).focus();
        $("label", this.el).addClass('checked');
    },
    install : function() {
    	this.base();
    	var self = this;
        this.el.children('label').click(function(e){
            self.changeStyle();
            var oldVal = $(self._groKey).data(self._groKey);
            $(self._groKey).data(self._groKey, this.value);
            if(oldVal != this.value) {
                self.fireEvent('change', e);
            }
        });
        $("input", this.el).keydown(function (event) {
            var keyCode = event.keyCode || event.charCode;
            if (keyCode === 13 || keyCode === 108 || keyCode === 9) {   //Enter
                self.focusManager.requestNextFocus(self);
                event.preventDefault();
            }
        });
    },
    changeStyle : function(){
        var _name = this.ofFormID+ '_' + this.getMetaObj().groupKey;
        $("input[name=" + _name + "] + label").removeClass('select');
        $("label", this.el).addClass('select');
    }

});
YIUI.reg('radiobutton', YIUI.Control.RadioButton);