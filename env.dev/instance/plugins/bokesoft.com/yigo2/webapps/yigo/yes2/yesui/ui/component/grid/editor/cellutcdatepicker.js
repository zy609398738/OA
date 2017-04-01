/**
 * 表格单元格日期编辑器
 * @type {*}
 */
YIUI.CellEditor.CellUTCDatePicker = YIUI.extend(YIUI.CellEditor, {
    isOnlyDate: false,

    formatStr: "yyyy-MM-dd HH:mm:ss",

    init: function (opt) {

        var meta = opt.editOptions;
        this.isOnlyDate = $.isUndefined(meta.onlyDate) ? this.isOnlyDate : meta.onlyDate;
        this.formatStr && this.setFormatStr();

        // this.yesCom = new YIUI.Yes_DatePicker(opt);
        // this.yesCom.el.addClass("ui-dp");
        // opt.formatStr && this.yesCom.setFormatStr(opt.formatStr);
        // opt.isNoTimeZone && this.yesCom.setIsNoTimeZone(opt.isNoTimeZone);
        // opt.isOnlyDate && this.yesCom.setOnlyDate(opt.isOnlyDate);
        // opt.regional && this.yesCom.setRegional(opt.regional);
        // opt.calendars && this.yesCom.setCalendars(opt.calendars);
    },
    onRender: function (parent) {
        this.base(parent);
        var _this = this;

        this.yesCom = new YIUI.Yes_DatePicker({
            formatStr: _this.formatStr,
            isOnlyDate: _this.isOnlyDate,
            commitValue: function(value) {
                _this.saveCell(value, true, true);
            },

            doFocusOut: function(){
                return _this.doFocusOut();
            }
        });
        this.yesCom.getEl().addClass("ui-dp");

        this.yesCom.setWidth(parent.width());
        this.yesCom.setHeight(parent.height());
    },

    setFormatStr: function () {
        if (this.isOnlyDate) {
            this.formatStr = this.formatStr.split(" ")[0];
        }
    },

    setValue: function (value) {
        this.base(value);
        //this.yesCom.setValue(value);
    },
    
    getValue: function () {
        return this.yesCom.getValue();
    },

    getDropBtn: function () {
        return this.yesCom.getBtn();
    },

    getDropView: function () {
        return this.yesCom.getDropView();
    },

    getInput: function () {
        return this.yesCom.getInput();
    },

    finishInput: function () {

    },

    beforeDestroy: function () {
        this.yesCom.getDropView().remove();
    },

    setText: function (text) {
        this.yesCom.getInput().val(text);
    },

    getText: function () {
        return this.yesCom.getInput().val();
    },

    install: function () {

    }
});