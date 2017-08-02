/**
 * 数值编辑框，主要用于输入数值类型的数据
 * 1、自定义数值精度和小数位数，例如定义数值精度为5，小数位数为2，则数值框只可以输入符号位（+-），
 * 5位数字，一个小数点，两个小数位。
 * 2、数值分组显示，如果要使用分组分隔符，则通过设置组大小以及分隔符，就可进行分割显示。
 * 例如组大小为3，分隔符为逗号，则是通常用到的千分位分割的方式，如：1,000,000.00。
 * 当然，这个组大小及分隔符可以自定义，例如组大小为4，分隔符为单引号（’），则显示如：1'0000'0000.00
 * 3、自定义小数位分隔符，例如可以定义小数位分隔符为逗号“，”,则通常10.11就会输入为10,11，而且输入框只认指定的符号
 * 4、文本框失去焦点时会判断文本框是否为空值，是，则灰色显示提示文本。获取焦点时会清空提示文本，并恢复字体颜色。
 */
(function ($) {

    YIUI.Control.NumberEditor = YIUI.extend(YIUI.Control, {

        handler: YIUI.NumberEditorHandler,
        
        behavior: YIUI.NumberEditorBehavior,

        decPrecision: 16,

        decScale: 2,

        showZero: false,

        init: function (options) {
            this.base(options);
            this.value = new Decimal(0);// 默认值为0,不是""

            var meta = this.getMetaObj();

            this.settings = this.handler.getSettings(meta);
            this.showZero = $.isDefined(meta.showZero) ? meta.showZero : this.showZero;
        },

        isNull: function() {
        	var value = this.value.toString();
        	if( value ) {
        		return parseFloat(value) == 0 ? true : false;
        	}
            return true;
        },

        checkEnd: function(value) {
    		this.value = value;

    		//this.yesNumEd.setValue(value);
            

            // this.caption = YIUI.DecimalFormat.format(v, settings);
    		var caption = this.getShowCaption(value);
            this.yesNumEd.setInputValue(caption);
            //$("input", this.el).val(caption);
            
            this.text = caption;
    	},
    	
    	getShowCaption: function(value) {
            var caption = YIUI.DecimalFormat.format(value || 0, this.settings) ;
            if (this.showZero) {
            	caption = caption == "" ? 0 : caption;
            } else {
            	caption = caption == 0 ? "" : caption;
            }
            return caption;
    	},

        getFormatEl: function() {
        	return this.yesNumEd.getInput();
        },
    	
        setBackColor: function (backColor) {
            this.yesNumEd && this.yesNumEd.setBackColor(backColor);
        },

        setForeColor: function (foreColor) {
            this.yesNumEd && this.yesNumEd.setForeColor(foreColor);
        },

        setFormatStyle: function (cssStyle) {
            this.yesNumEd && this.yesNumEd.setFormatStyle(cssStyle);
        },

        onSetHeight: function (height) {
            this.yesNumEd.setHeight(height);
        },

        onSetWidth: function (width) {
            this.yesNumEd.setWidth(width);
        },

        /** 设置输入提示 */
        setPromptText: function (promptText) {
            this.yesNumEd.setPromptText(promptText);
        },
        
        setText: function (text) {
            this.setValue(text);
        },

        getText: function() {
        	var text = this.base();
        	return text.toString();
        },

        getShowText: function() {
        	return $("input", this.el).val();
        },
        
        setTip: function (tip) {
            var tip = this.text;
            this.base(tip);
        },
        
        //控件处理本身的渲染形成一个完整的控件Dom对象，添加到传入的父亲Dom对象，返回该控件Dom对象的ID
        onRender: function (parent) {
            this.base(parent);
            this.el.addClass("ui-numed");
            var $this = this;
            var metaObj = this.getMetaObj();
            this.yesNumEd = new YIUI.Yes_NumberEditor({
                el: $this.el,
                settings: $this.settings,
                required: $this.required,
                showZero: $this.showZero,
                selectOnFocus: $this.selectOnFocus,
                commitValue: function (newValue) {
                    var changed = $this.setValue(newValue, true, true);
                    if(!changed) {
                    	newValue = newValue == "" ? 0 : newValue;
                    	var caption = $this.getShowCaption(newValue);
                    	$this.yesNumEd.setInputValue(caption);
                    }
                }
            });
            metaObj.promptText && this.setPromptText(metaObj.promptText);
            this.showZero && this.setShowZero(this.showZero);
            this.checkEnd($this.value);
        },
        
        setShowZero: function(showZero) {
        	this.showZero = showZero;
        },
        
        isShowZero: function() {
        	return this.showZero;
        },

        focus: function () {
            this.yesNumEd && this.yesNumEd.getInput().focus();
        },
        
        install:function(){
            var self = this;
            this.yesNumEd.getInput().keydown(function (event) {
                var keyCode = event.keyCode || event.charCode;
                if (keyCode === 13 || keyCode === 108 || keyCode === 9) {   //Enter
                    self.focusManager.requestNextFocus(self);
                    event.preventDefault();
                }
            });
        }

    });

    YIUI.reg('numbereditor', YIUI.Control.NumberEditor);
}(jQuery));