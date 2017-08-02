/**
 * 日期控件，主要是用于显示日期及时间
 */
YIUI.Control.UTCDatePicker = YIUI.extend(YIUI.Control, {
    /**
     * String。
     * 此控件由自动渲染为div。
     */
    autoEl: '<div></div>',

    handler: YIUI.DatePickerHandler,
    behavior: YIUI.UTCDatePickerBehavior,

    _hasShow: false,

    _firstClick: true,

    isOnlyDate: false,

    formatStr: "yyyy-MM-dd HH:mm:ss",

    init: function (options) {
        this.base(options);
        var meta = this.getMetaObj();
        this.isOnlyDate = meta.onlyDate || this.isOnlyDate;
    },

    setTip: function (tip) {
        var tip = this.text;
        this.base(tip);
    },
    
    setFormatStr: function () {
        if (this.isOnlyDate) {
            this.formatStr = this.formatStr.split(" ")[0];
        }
    },

    setEditable: function (editable) {
        this.editable = editable;
        this.datePicker.setEditable(editable);
    },

    getFormatEl: function() {
    	return this.datePicker.getInput();
    },

    /**
     * 设置背景色
     */
    setBackColor: function (backColor) {
        this.backColor = backColor;
        this.datePicker.getInput().css({
            'background-image': 'none',
            'background-color': backColor
        })
    },
    
    /**
     * 设置前景色
     */
    setForeColor: function (foreColor) {
        this.foreColor = foreColor;
        this.datePicker.getInput().css('color', foreColor);
    },

    setFormatStyle: function (cssStyle) {
        this.cssStyle = cssStyle;
        this.datePicker.getInput().css(cssStyle);
    },

    setText: function (text) {
        if (text && text.length > 0) {
            text = text.replace(/-/g, "/");
            var date = new Date(text);
            this.text = date.Format(this.formatStr);
            this.datePicker.setText(this.text);
        } else {
            this.text = text;
            this.datePicker.setText(this.text);
        }
    },

    getText: function () {
        var text = this.text || "";
        return text;
    },

    changeToVal: function (text) {
        if (this.getText() != "") {
            text = text.replace(/(\W+)/g, "");
          return text;
        } else {
            return null;
        }
    },

    checkEnd: function(value) {
    	this.value = value;
		if(!value || this.value == 0) return;
    	var check = false;
    	if($.isNumeric(value)) {
    		check = true;
    	}
		var text = YIUI.UTCDateFormat.formatCaption(value, this.isOnlyDate, check);
		this.setText(text);
    },
    
    onRender: function (ct) {
        this.base(ct);
        var $this = this;
        $this.formatStr && this.setFormatStr();
        this.datePicker = new YIUI.Yes_DatePicker({
            el: $this.el,
            formatStr: $this.formatStr,
            isOnlyDate: $this.isOnlyDate,
            commitValue: function(value) {
        		$this.setValue(value, true, true);
            }
        });
        this.el.addClass("ui-dp ui-utc");

        if (this.value && this.value != 0) {
        	var text = YIUI.UTCDateFormat.formatCaption(this.value, this.isOnlyDate, true);
            this.setText(text);
        }
    },

    afterRender: function () {
        this.base();
        if (this.mask) {
//			this._dateInput.DateTimeMask({masktype: "1",isnow: true});
        }
    },
    onSetWidth: function (width) {
        this.datePicker.setWidth(width);
    },

    onSetHeight: function (height) {
        this.datePicker.setHeight(height);
    },

    beforeDestroy: function () {
    	this.datePicker && this.datePicker.getDropView().remove();
    },

    focus: function () {
        this.datePicker && this.datePicker.getInput().focus();
    },

    install: function () {
        this.base();
        var self = this;
        this.datePicker.getInput().keydown(function (event) {
            var keyCode = event.keyCode || event.charCode;
            if (keyCode === 9 || keyCode === 13 || keyCode === 108) {  //tab
                self.focusManager.requestNextFocus(self);
                event.preventDefault();
            }
        });
    }
})
;
YIUI.reg('utcdatepicker', YIUI.Control.UTCDatePicker);