/**
 * 表格单元格日期编辑器
 * @type {*}
 */
YIUI.CellEditor.CellDatePicker = YIUI.extend(YIUI.CellEditor, {
    init: function (opt) {
        this.yesCom = new YIUI.Yes_DatePicker(opt);
        this.yesCom.el.addClass("ui-dp");
        opt.formatStr && this.yesCom.setFormatStr(opt.formatStr);
        opt.isNoTimeZone && this.yesCom.setIsNoTimeZone(opt.isNoTimeZone);
        opt.isOnlyDate && this.yesCom.setOnlyDate(opt.isOnlyDate);
        opt.regional && this.yesCom.setRegional(opt.regional);
        opt.calendars && this.yesCom.setCalendars(opt.calendars);
    },
    onRender: function (parent) {
        this.base(parent);
        this.yesCom.setWidth(parent.width());
        this.yesCom.setHeight(parent.height());
    },
    setValue: function (value) {
        this.base(value);
        this.yesCom.setValue(value);
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
    getText: function () {
        return this.yesCom.getInput().val();
    },
    install: function () {

    }
});