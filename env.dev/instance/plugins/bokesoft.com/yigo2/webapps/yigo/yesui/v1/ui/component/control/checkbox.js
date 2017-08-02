/**
 * 复选框控件。
 */
YIUI.Control.CheckBox = YIUI.extend(YIUI.Control, {

    autoEl: "<div></div>",

    handler: YIUI.CheckBoxHandler,

    behavior: YIUI.CheckBoxBehavior,

    /**
     * 是否默认选中
     */
    checked: false,

    text: "",

    setText: function (text) {
        this.text = text;
        this.checkbox.setText(text);
    },

    getText: function () {
        return  this.text;
    },
    
    getShowText: function() {
    	return this.getText();
    },

    onSetHeight: function (height) {
        this.base(height);
        this.checkbox.setHeight(height);
    },

    onSetWidth: function (width) {
        this.base(width);
        this.checkbox.setWidth(width);
    },

    setEnable: function (enable) {
        this.enable = enable;
        this.checkbox.setEnable(enable);
    },

    setFormatStyle: function (cssStyle) {
        this.cssStyle = cssStyle;
        this.checkbox.getLabel().css(cssStyle);
        $("input", this.el).css(cssStyle);
    },

    checkEnd: function(value) {
    	this.value = value;
        this.checkbox.setChecked(YIUI.TypeConvertor.toBoolean(this.value));
    },
    
    isNull: function() {
    	return !YIUI.TypeConvertor.toBoolean(this.value);
    },

    onRender: function (ct) {
        this.base(ct);
        var $this = this;
        this.checkbox = new YIUI.Yes_CheckBox({
            el: $this.el
        });
        this.el.addClass("ui-chk");
        this.checkbox.setChecked(this.getMetaObj().checked);
        var txt = this.text.replace(/ /g, "&nbsp;");
        this.checkbox.setText(txt);
    },

    initDefaultValue: function (options) {
        this.base(options);
        this.el.outerWidth(this.el.width());
        if (options.clickContent) {
            this.clickContent = options.clickContent;
        }
        var $this = this;
        this.checkbox = new YIUI.Yes_CheckBox({
            el: $this.el,
            isPortal: true
        });
        this.install();
    },

    focus: function () {
        this.checkbox && this.checkbox.getCheckBox().focus();
    },

    install: function () {
        this.base();
        var self = this;
        this.checkbox.getCheckBox().change(function (e) {
            var value = this.checked;
            self.setValue(value, true, true);
        });
        this.checkbox.getCheckBox().keydown(function (event) {
            var keyCode = event.keyCode || event.charCode;
            if (keyCode === 13 || keyCode === 108) {   //Enter
                self.checkbox.getCheckBox().click();
                event.preventDefault();
            } else if (keyCode === 9) {  //tab
                self.focusManager.requestNextFocus(self);
                event.preventDefault();
            }
        });
    }
});
YIUI.reg('checkbox', YIUI.Control.CheckBox);
