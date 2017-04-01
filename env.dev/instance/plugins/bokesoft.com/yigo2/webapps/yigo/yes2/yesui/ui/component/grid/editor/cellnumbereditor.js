/**
 * 表格单元格数值框编辑器
 * @type {*}
 */
YIUI.CellEditor.CellNumberEditor = YIUI.extend(YIUI.CellEditor, {
        
    decPrecision: 16,
    
    decScale: 2,

    showZero: false,

    roundingMode: YIUI.NUMBEREDITOR_ROUNDINGMODE.HALF_UP,

    init: function (opt) {

        var meta = opt.editOptions;

        this.settings = YIUI.NumberEditorHandler.getSettings(meta);

    },

    onRender: function (parent) {


        this.base(parent);

        var self = this;

        this.yesCom = new YIUI.Yes_NumberEditor({
            //el: $this.el,
            value: self.value,
            settings: self.settings,
            required: self.required,
            showZero: self.showZero,
            //selectOnFocus: $this.selectOnFocus,
            commitValue: function (newValue) {
                //$this.setValue(newValue, true, true);
                self.saveCell(newValue);
            },
            doFocusOut: function(){
                return self.doFocusOut();
            }
        });

        // opt.settings = this.settings;
        //this.yesCom = new YIUI.Yes_NumberEditor(opt);
        this.yesCom.el.addClass("ui-numed");

        this.yesCom.setWidth(parent.width());
        this.yesCom.setHeight(parent.height());
        this.yesCom.getInput().css({width: "100%", height: "100%", padding: "0 2px 0 2px", margin: 0});


    },
    getInput: function () {
        return this.yesCom.getInput();
    },
    setValue: function (value) {
        this.base(value);
        this.yesCom.setValue(value);
    },
    getValue: function () {
        return this.yesCom.getValue();
    },
    setText: function(text){
        this.yesCom.setInputValue(text);
    },
    getText: function () {
        return  this.yesCom.getInput().val();
    },
    finishInput: function () {
        return this.yesCom.finishInput();
    },
    install: function () {
        this.base();
        var self = this;
        // this.getInput().blur(function (e) {
        //   //  self.yesCom.saveCell();
        // });
    }
});