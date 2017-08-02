/**
 * 表格单元格下拉框编辑器
 * @type {*}
 */
YIUI.CellEditor.CellComboBox = YIUI.extend(YIUI.CellEditor, {

    init: function (opt) {
        opt = $.extend(true, opt, {
            multiSelect: opt.type !== "combobox",
            getItems: function () {
                YIUI.ComboBoxHandler.getComboboxItems(this, opt.cxt);
            },
            getValue: function () {
                return this.getSelValue();
            }
        });
        this.yesCom = new YIUI.Yes_Combobox(opt);
        this.yesCom.setEditable(opt.editable);
        this.yesCom.getEl().addClass("ui-cmb");
        opt.items && this.yesCom.setItems(opt.items);
    },
    onRender: function (parent) {
        this.base(parent);
        this.yesCom.setWidth(parent.width());
        this.yesCom.setHeight(parent.height());
    },
    setValue: function (value) {
        this.base(value);
        this.yesCom.setSelValue(value);
    },

    getValue: function () {
    	var value = this.yesCom.getSelValue();
    	if (this.integerValue) {
    		value = YIUI.TypeConvertor.toInt(value);
    	}
    	return value;
    },

    getText: function () {
        return this.yesCom.getText();
    },

    setText: function (text) {
        this.yesCom.setText(text);
    },

    getInput: function () {
        return this.yesCom._textBtn;
    },
    getDropBtn: function () {
        return this.yesCom._dropBtn;
    },
    beforeDestroy: function () {
        this.yesCom._dropView.remove();
    }
});