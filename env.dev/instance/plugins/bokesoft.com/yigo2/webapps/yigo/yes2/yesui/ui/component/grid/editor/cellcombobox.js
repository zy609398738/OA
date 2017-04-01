/**
 * 表格单元格下拉框编辑器
 * @type {*}
 * TODO 下拉框与字典不同， 如果下拉内容为表达式， 会初始化的时候计算， 表格的根据依赖对内容做缓存。
 * 初始化计算下拉内容如时间较长， 点下拉的时候可能会未算完， 这个地方需要做优化处理。
 */
YIUI.CellEditor.CellComboBox = YIUI.extend(YIUI.CellEditor, {

    editable: true ,

    multiSelect: false,

    integerValue: false,

    def: null,

    init: function (opt) {
        // opt = $.extend(true, opt, {
        //     multiSelect: opt.type !== "combobox",
        //     getItems: function () {
        //         YIUI.ComboBoxHandler.getComboboxItems(this, opt.cxt);
        //     },
        //     getValue: function () {
        //         return this.getSelValue();
        //     }
        // });
        // this.yesCom = new YIUI.Yes_Combobox(opt);
        // this.yesCom.setEditable(opt.editable);
        // this.yesCom.getEl().addClass("ui-cmb");
        // opt.items && this.yesCom.setItems(opt.items);

        var meta = opt.editOptions;

        this.multiSelect = (meta.cellType == YIUI.CONTROLTYPE.CHECKLISTBOX);
        this.editable = meta.editable || this.editable;
        this.integerValue = meta.integerValue || this.integerValue;
        this.meta = meta;

    },
    onRender: function (parent) {
        this.base(parent);


        var self = this;
             
        var getComboboxItems = function(){
            if(self.def == null){
                var form = YIUI.FormStack.getForm(self.ofFormID);
                self.def = YIUI.ComboBoxHandler.getComboboxItems(form, self.meta)
                    .then(function(items){
                        self.setItems(items);
                        self.def = null;
                    });
            }
            return self.def;
        }


        this.yesCom = new YIUI.Yes_Combobox({
            multiSelect: this.multiSelect,
            intergerValue: this.integerValue,

            checkItems : function(){
                return getComboboxItems();
            },

            doSuggest: function(value) {
                var def = $.Deferred();
                var _this = this;
                
                this.checkItems().done(function() {
                    var items = _this.items, viewItems = [];
                    for (var i = 0, len = items.length; i < len; i++) {
                        if (items[i].caption != null) {
                            if (items[i].caption.indexOf(value) >= 0) viewItems.push(items[i]);
                        }
                          if (viewItems.length == 5) break;
                      }
                    def.resolve(viewItems);
                });
                return def.promise();
            },
            
            commitValue : function (value){
                self.saveCell(value);
            },

            doFocusOut: function(){
                return self.doFocusOut();
            }
        });

        this.yesCom.getEl().addClass("ui-cmb");

        this.yesCom.setWidth(parent.width());
        this.yesCom.setHeight(parent.height());
    },


    setItems: function(items) {
        //this.items = items;
        this.yesCom.setItems(items);
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
        this.yesCom.destroy();
    }
});