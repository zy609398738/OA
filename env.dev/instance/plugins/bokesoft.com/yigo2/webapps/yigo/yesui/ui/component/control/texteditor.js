/**
 * 文本编辑框，主要是提供文本字符类型数据输入
 * 1、可以自定义文本输入最大字符长度（默认为255），一个中文也只算一个字符，例如：12abc好12,这个为8个字符长度
 * 2、可以自定义文本显示为全大写或全小写,默认为无限制，大小写都可输入
 * 3、可以自定义不可输入字符。例如：定义不可输入字符串为：“a2v:,A”,则字符串中的字母数字符号都不可输入，键盘按键按下后都没有反应。
 * 另外，特别需要注意的是一些转义字符，例如单引号（'），双引号（"），这些转义字符定义时需要加斜杠。
 * 例如，定义为：“A?:,\'\"”，则单引号和双引号都不可输入。
 * 注意：不可输入字符区分中英文字符，比如“\"”这是英文的双引号，“\””这时中文的双引号。
 * 4、文本框失去焦点时会判断文本框是否为空值，是，则灰色显示提示文本。获取焦点时会清空提示文本，并恢复字体颜色。
 */

YIUI.Control.TextEditor = YIUI.extend(YIUI.Control, {

    autoEl: "<span></span>",

    handler: YIUI.TextEditorHandler,
    
    behavior: YIUI.TextEditorBehavior,

    /**
     * Number。
     * 允许输入的最大长度。
     */
    maxLength: Number.MAX_VALUE,

    /**
     * Number。
     * 输入字符大小写。
     */
    textCase: YIUI.TEXTEDITOR_CASE.DEFAULT,

    /**
     * String。
     * 不允许输入的字符集合。
     */
    invalidChars: null,

    /**
     * String。
     * 当输入框为空时，显示的输入提示。
     */
    promptText: null,

    /**
     * Boolean。
     * 是否去除首尾多余空格。
     */
    trim: true,

    /**
     * Boolean。
     * 光标进入默认全选。
     */
    selectOnFocus: true,

    /**
     * 掩码，为固定长度字符串。
     * 规定：
     *  9 : 任意数字，[0-9]
     *  a : 任意英文字母，[A-Za-z]
     *  * : 任意数字、英文字母，[A-Za-z0-9]
     *  _ : 控件里显示的占位符
     * 当掩码中需要包含9、a、*、\时，使用转义\9、\a、\*、\\。
     */
    mask: null,

    /**
     * String。
     * 右侧图标url。
     */
    icon: null,

    /**
     * String。
     * 左侧内嵌文本。
     */
    embedText: null,

    /**
     * 左侧图标
     */
    preIcon: null,

    /**
     * 保持焦点
     */
    holdFocus: false,

    getCheckOpts: function(options) {
    	var opts = this.base(options);
        var options = {
	        trim: this.getMetaObj().trim,
	        textCase: this.getMetaObj().textCase,
	        maxLength: this.getMetaObj().maxLength,
	        invalidChars: this.getMetaObj().invalidChars
    	};
    	opts = $.extend(opts, options);
    	return opts;
    },

    checkEnd: function(value) {
		this.value = value;
        this.yesText.setValue(value);
		this.caption = value;
        $("input", this.yesText.el).val(value);
	},

    getShowText: function() {
    	return this.value;
    },

    getValue: function () {
        return this.yesText.getValue();
    },

    /**
     * 设置控件是否可编辑。
     * @param enable：Boolean。
     */
    setEnable: function (enable) {
        this.enable = enable;
        this.yesText.setEnable(enable);
    },

    setBackColor: function (backColor) {
        this.yesText.setBackColor(backColor);
    },

    setForeColor: function (foreColor) {
        this.yesText.setForeColor(foreColor);
    },

    setFormatStyle: function (cssStyle) {
        this.yesText.setFormatStyle(cssStyle);
    },

    onSetHeight: function (height) {
        this.yesText.setHeight(height);
    },

    onSetWidth: function (width) {
        this.yesText.setWidth(width);
    },

    /**
     * input外层wrap了一层span。
     */
    getOuterEl: function () {
        return this.el;
    },

    /**
     * 处理差异
     * @param {} diffJson
     */
    diff: function (diffJson) {
        this.base(diffJson);
    },

    setTip: function (tip) {
        var tip = this.value;
        this.base(tip);
    },
    
    /**
     * 控件渲染到界面，不包含items的渲染。
     */
    onRender: function (parent) {
        this.base(parent);
        var $this = this;
        var metaObj = this.getMetaObj();
        this.yesText = new YIUI.Yes_TextEditor({
            el: $this.el,
            value: $this.value,
            required: metaObj.required,
            textCase: metaObj.textCase,
            inputType: $this.inputType,
	        trim: metaObj.trim,
            maxLength: metaObj.maxLength,
            promptText: metaObj.promptText,
            selectOnFocus: metaObj.selectOnFocus,
            invalidChars: metaObj.invalidChars,
            embedText: metaObj.embedText,
            icon: metaObj.icon,
            preIcon: metaObj.preIcon,
            valueChange: function (newValue) {
                $this.setValue(newValue, true, true);
            }
        });
        this.el.addClass("ui-txted");
        metaObj.holdFocus && this.setHoldFocus(metaObj.holdFocus);
    },
    
    setHoldFocus: function(holdFocus) {
    	this.holdFocus = holdFocus;
    },

    afterRender: function () {
        this.base();
    },

    initDefaultValue: function (options) {
        this.base(options);
        this._input = $("input", options.el);
        $.extend(this, options);
        this.invalidChars = options.invalidChars.toString();
        var $this = this;
        this.yesText = new YIUI.Yes_TextEditor({
            el: $this.el,
            isPortal: true,
            value: $this.value,
            required: $this.required,
            textCase: $this.textCase,
            inputType: $this.inputType,
            maxLength: $this.maxLength,
            promptText: $this.promptText,
            selectOnFocus: $this.selectOnFocus,
            invalidChars: $this.invalidChars,
            embedText: $this.embedText,
            icon: $this.icon,
            preIcon: $this.preIcon,
            valueChange: function (newValue) {
                $this.setValue(newValue, true, true);
            }
        });
//        if (options.maxLength) {
//            this.yesText.setMaxLength(options.maxLength);
//        }
//        if (options.preIcon) {
//            this.preIcon = options.preIcon;
//            this.yesText.setPreIcon(options.preIcon);
//        }
//        if (options.embedText) {
//            this.yesText.setEmbedText(options.embedText);
//        }
//        //设置输入框输入时遇到不可输入字符时，不允许其输入
//        if (options.invalidChars) {
//            this.yesText.setInvalidChars(options.invalidChars);
//        }
//        if (options.promptText) {
//            this.yesText.setPromptText(options.promptText);
//            this._input.placeholder(this.promptText);
//        }
//        if (!options.trim) {
//            this.trim = options.trim;
//        }
//        if (!options.selectOnFocus) {
//            this.selectOnFocus = options.selectOnFocus;
//        }
//        if (options.error) {
//            this.setError(options.error);
//        }
//        if (options.columnKey) {
//            this.columnKey = options.columnKey;
//        }
//        if (options.tableKey) {
//            this.tableKey = options.tableKey;
//        }
        var height = this.el.height();
        $(".input-embed", this.el).css('height', height + 'px');
        $(".input-embed", this.el).css('line-height', height + 'px');
        if ($.browser.isIE) {
            this._input.css('line-height', (height - 2) + 'px');
        }
        $(".input-preIcon", this.el).css('top', (this.el.height() - 16) / 2 + 'px');
        $(".input-preIcon", this.el).css('left', '10px');

        this._input.attr("value") && this.setValue(eval(this._input.attr("value"))) && this.fireEvent('change', null);
    },

    focus: function () {
        this.yesText && this.yesText.getInput().focus();
    },

    install: function () {
        this.base();
        var self = this;
        this.yesText.getInput().keydown(function (event) {
            var keyCode = event.keyCode || event.charCode;
            if (keyCode === 13 || keyCode === 108) {   //Enter
            	self.handler.doEnterPress && self.handler.doEnterPress(self);
                if (self.holdFocus) {
                    self.yesText.getInput().focus();
                } else {
                    self.focusManager.requestNextFocus(self);
                    event.preventDefault();
                }
            } else if (keyCode === 9) {  //tab
                self.focusManager.requestNextFocus(self);
                event.preventDefault();
            }
        });
    }

});
YIUI.reg('texteditor', YIUI.Control.TextEditor);

// 掩码控件也以文字输入框实现
YIUI.reg('maskeditor', YIUI.Control.TextEditor);