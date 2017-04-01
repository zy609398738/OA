/**
 * 日期控件，主要是用于显示日期及时间
 */
YIUI.Control.DatePicker = YIUI.extend(YIUI.Control, {
    /**
     * String。
     * 此控件由自动渲染为div。
     */
    autoEl: '<div></div>',

    handler: YIUI.DatePickerHandler,
    
    behavior: YIUI.DatePickerBehavior,

    isOnlyDate: false,

    formatStr: "yyyy-MM-dd HH:mm:ss",

    isNoTimeZone: false,

    regional: "zh-CN",//默认为中文显示

    mask: null,

    calendars: 1,

    setTip: function (tip) {
        var tip = this.text;
        this.base(tip);
    },
    
    setFormatStr: function () {
        if (this.getMetaObj().isOnlyDate) {
            this.formatStr = this.formatStr.split(" ")[0];
        }
    },

    setEditable: function (editable) {
        this.editable = editable;
        this.datePicker.setEditable(editable);
    },

    setEnable: function (enable) {
        this.enable = enable;
        this.datePicker.setEnable(enable);
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
            this.datePicker.getInput().val(this.text);
        } else {
            this.text = text;
            this.datePicker.getInput().val(this.text);
        }
    },

    getText: function () {
        var text = this.text || "";
        if (text != "" && this.getMetaObj().isOnlyDate) {
            text += " 00:00:00";
        }
        return text;
    },

    getShowText: function() {
    	return this.getText();
    },

    changeToVal: function () {
        var text = this.getText();
        if (this.getText() != "") {
            text = text.replace(/-/g, "/");
//            return (new Date(text)).getTime();
            return new Date(text);
        } else {
            return null;
        }
    },

    onRender: function (ct) {
        this.base(ct);
        var $this = this;
        $this.formatStr && this.setFormatStr();
        this.datePicker = new YIUI.Yes_DatePicker({
            id: $this.id,
            el: $this.el,
            formatStr: $this.formatStr,
            isOnlyDate: $this.getMetaObj().isOnlyDate,
            isNoTimeZone: $this.getMetaObj().isNoTimeZone,
            regional: $this.getMetaObj().regional,
            calendars: $this.calendars
        });
        this.el.addClass("ui-dp");

        if (this.text) {
            this.setText(this.text);
        }
        if (this.value) {
            var value = new Date(parseInt(this.value));
            this.setValue(value, false, false);
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

    initDefaultValue: function (options) {
        this.base(options);
        this.formatStr = options.formatstr;
        this.isOnlyDate = options.isonlydate;
        this.isNoTimeZone = options.isnotimezone;
        this.calendars = 1;
        if (this.isOnlyDate) {
            this.formatStr = this.formatStr.split(" ")[0];
        }
        var $this = this;
        this.setFormatStr();
        this.datePicker = new YIUI.Yes_DatePicker({
            id: $this.id,
            el: $this.el,
            isPortal: true,
            formatStr: $this.formatStr,
            isOnlyDate: $this.isOnlyDate,
            isNoTimeZone: $this.isNoTimeZone,
            regional: $this.regional,
            calendars: $this.calendars
        });
        this.datePicker.setIsNoTimeZone(this.isNoTimeZone);
        this.datePicker.setOnlyDate(this.isOnlyDate);
        this.datePicker.setRegional(this.regional);
        this.datePicker.setCalendars(this.calendars);
        this.datePicker.initDatePicker(this.id);
        var _dateInput = this.datePicker.getInput(),
            _dateImg = this.datePicker.getBtn();
        _dateImg.css({
            left: this._dateInput.outerWidth() - 26 + "px",
            top: (this._dateInput.outerHeight() - 16) / 2 + "px",
            height: "16px", width: "16px"});
        if ($.browser.isIE) {
            _dateInput.css('line-height', (this.el.outerHeight() - 3) + 'px');
        }
        if (this.value) {
            if (this.isOnlyDate) {
                this.value = this.value.substring(0, this.value.indexOf(" "));
            }
            this.setValue(this.value);
        }
        if (this.text) {
            this.setText(this.text);
        }
    },

    beforeDestroy: function () {
        this.datePicker.getDropView().remove();
    },

    focus: function () {
        this.datePicker && this.datePicker.getInput().focus();
    },
    
    checkEnd: function(value) {
    	this.value = value;
		this.caption = value;
		var text = "";
        if(this.value) {
        	text = this.value.Format(this.formatStr);
        }
        this.setText(text);
    },
    
    install: function () {
        this.base();
        var self = this;
        this.datePicker.getInput().on('blur', function (event) {
                var curText = event.target.value;
                if (curText != self.text) {
                    self.text = curText;
                    self.setValue(self.changeToVal(), true, true);
                }
            });
        this.datePicker.getDropView().blur(function (event) {
            var curText = self.datePicker.getInput().val();
            if (curText != self.text) {
                self.text = curText;
                self.setValue(self.changeToVal(), true, true);
            }
        });
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
YIUI.reg('datepicker', YIUI.Control.DatePicker);