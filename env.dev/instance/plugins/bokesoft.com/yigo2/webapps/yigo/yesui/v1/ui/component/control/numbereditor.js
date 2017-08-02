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
        
        showZero: false,

        init: function (options) {
            this.base(options);

            var maxNumber = '';

            for (var i = 0; i < this.getMetaObj().decPrecision - this.getMetaObj().decScale; i++) {
                maxNumber += '9';
            }

            if (this.getMetaObj().decScale > 0) {
                maxNumber += '.';
                for (var i = 0; i < this.getMetaObj().decScale; i++) {
                    maxNumber += '9';
                }

            }

            this.settings = {
                aNum: '0123456789',
                //组分割符
                aSep: this.getMetaObj().sep,
                //组大小
                dGroup: this.getMetaObj().groupingSize,
                //小数点符号
                aDec: this.getMetaObj().decSep,
                //前缀或后缀符号
                aSign: '',
                //p是前缀 s是后缀
                pSign: 's',
                //最大值
                vMax: maxNumber,
                //最小值
                vMin: '-' + maxNumber,
                //小数位数
                mDec: this.getMetaObj().decScale,
                //四舍五入方式
                mRound: this.getMetaObj().roundingMode,

                altDec: null
            }

        },

        isNull: function() {
        	var value = this.value.toString();
        	if(value) {
        		value = parseFloat(value);
        		return value == 0 ? true : false;
        	} else {
        		return true;
        	}
        },

        /**
         * 返回值的时候
         */
        getValue: function () {
            return this.yesNumEd.getValue();
        },

        getCheckOpts: function(options) {
        	var opts = this.base(options);
        	var options = {
    			decScale: this.getMetaObj().decScale,
    			roundingMode: this.roundingMode
        	};
        	opts = $.extend(opts, options);
        	return opts;
        },

        checkEnd: function(value) {
    		this.value = value;
    		this.caption = value;
    		this.yesNumEd.setValue(value);
    	},
    	
        /**
         * 设置控件是否可编辑。
         * @param enable：Boolean。
         */
        setEnable: function (enable) {
            this.enable = enable;
            this.yesNumEd.setEnable(enable);
        },

        setBackColor: function (backColor) {
            this.yesNumEd.setBackColor(backColor);
        },

        setForeColor: function (foreColor) {
            this.yesNumEd.setForeColor(foreColor);
        },

        setFormatStyle: function (cssStyle) {
            this.yesNumEd.setFormatStyle(cssStyle);
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
                value: $this.value,
                settings: $this.settings,
                required: $this.required,
                showZero: metaObj.showZero,
                selectOnFocus: metaObj.selectOnFocus,
                valueChange: function (newValue) {
                    $this.setValue(newValue, true, true);
                }
            });
            this.setValue(this.value, false, false);
            metaObj.promptText && this.setPromptText(metaObj.promptText);
            metaObj.showZero && this.setShowZero(metaObj.showZero);
        },
        
        setShowZero: function(showZero) {
        	this.showZero = showZero;
        },
        
        isShowZero: function() {
        	return this.showZero;
        },

        initDefaultValue: function (options) {
            this.base(options);
            this._input = $("input", options.el);
            if (!options.selectOnFocus) {
                this.selectOnFocus = options.selectOnFocus;
            }
            if (options.error) {
                this.setError(options.error);
            }
            if (options.decPrecision != undefined && options.decPrecision != 16) {
                this.decPrecision = options.decPrecision;
            }
            if (options.decScale != undefined && options.decScale != 2) {
                this.decScale = options.decScale;
            }
            if (options.groupingSize != undefined && options.groupingSize != 3) {
                this.groupingSize = options.groupingSize;
            }
            if (!options.useSep) {
                this.useSep = options.useSep;
            }
            if (options.sep) {
                this.sep = options.sep;
            }
            if (options.decSep) {
                this.decSep = options.decSep;
            }
            if (options.roundingMode != undefined && options.roundingMode != 0) {
                this.roundingMode = options.roundingMode;
            }
            if (options.columnKey) {
                this.columnKey = options.columnKey;
            }
            if (options.tableKey) {
                this.tableKey = options.tableKey;
            }

            var maxNumber = '';
            for (var i = 0; i < this.decPrecision - this.decScale; i++) {
                maxNumber += '9';
            }
            if (this.decScale > 0) {
                maxNumber += '.';
                for (var i = 0; i < this.decScale; i++) {
                    maxNumber += '9';
                }
            }
            this.settings = {
                aNum: '0123456789',
                //组分割符
                aSep: this.useSep ? this.sep : '',
                //组大小
                dGroup: this.groupingSize,
                //小数点符号
                aDec: this.decSep,
                //前缀或后缀符号
                aSign: '',
                //p是前缀 s是后缀
                pSign: 's',
                //最大值
                vMax: maxNumber,
                //最小值
                vMin: '-' + maxNumber,
                //小数位数
                mDec: this.decScale,
                //四舍五入方式
                mRound: this.roundingMode
            };

            $.extend(this, options);
            var $this = this;
            this.yesNumEd = new YIUI.Yes_NumberEditor({
                el: $this.el,
                isPortal: true,
                settings: $this.settings,
                required: $this.required,
                selectOnFocus: this.selectOnFocus,
                valueChange: function (newValue) {
                    $this.setValue(newValue, true, true);
                }
            });

            this.install();
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