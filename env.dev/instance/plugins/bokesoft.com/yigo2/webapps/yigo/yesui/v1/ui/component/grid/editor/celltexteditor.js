/**
 * 表格单元格文本框编辑器
 * @type {*}
 */
YIUI.CellEditor.CellTextEditor = YIUI.extend(YIUI.CellEditor, {
    behavior: YIUI.TextEditorBehavior,
    init: function (opt) {
        var self = this;
        opt.valueChange = function (val) {
            self.setValueWithEvent(val, true, true);
        };
        this.yesCom = new YIUI.Yes_TextEditor(opt);
        this.yesCom.el.addClass("ui-txted");
    },

    onRender: function (parent) {
        this.base(parent);
        this.yesCom.setEmbedText(this.yesCom.embedText);
        this.yesCom.setWidth(parent.width());
        this.yesCom.setHeight(parent.height());
        this.yesCom.setClearable(false);
    },
    getInput: function () {
        return this.yesCom.getInput();
    },
    setValueWithEvent: function (value, commit, fireEvent) {
        var options = {
            oldVal: this.value,
            newVal: value,
            trim: this.yesCom.trim,
            textCase: this.yesCom.textCase,
            maxLength: this.yesCom.maxLength,
            invalidChars: this.yesCom.invalidChars
        };
        var _this = this.yesCom;
        var callback = function (value) {
            _this.value = value;
            _this.caption = value;
            $("input", _this.el).val(value);
        };
        return this.behavior.checkAndSet(options, callback);
    },
    setValue: function (value) {
        this.setValueWithEvent(value, true, true);
        this.base(this.yesCom.value);
    },
    getValue: function () {
        return this.yesCom.value;
    },
    getText: function () {
        return this.yesCom.value;
    },
    finishInput: function () {
        return this.yesCom.finishInput();
    },
    install: function () {
        this.base();
        var self = this;
        this.getInput().blur(function (e) {
            self.yesCom.saveCell();
        });
    }
});