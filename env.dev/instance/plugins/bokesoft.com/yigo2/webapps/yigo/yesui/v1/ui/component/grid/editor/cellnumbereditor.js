/**
 * 表格单元格数值框编辑器
 * @type {*}
 */
YIUI.CellEditor.CellNumberEditor = YIUI.extend(YIUI.CellEditor, {
    init: function (opt) {
        var maxNumber = '';
        for (var i = 0; i < opt.decPrecision - opt.decScale; i++) {
            maxNumber += '9';
        }
        if (opt.decScale > 0) {
            maxNumber += '.';
            for (var i = 0; i < opt.decScale; i++) {
                maxNumber += '9';
            }
        }
        this.settings = {
            aNum: '0123456789',
            //组分割符
            aSep: opt.useSep ? opt.sep : '',
            //组大小
            dGroup: opt.groupingSize,
            //小数点符号
            aDec: opt.decSep,
            //前缀或后缀符号
            aSign: '',
            //p是前缀 s是后缀
            pSign: 's',
            //最大值
            vMax: maxNumber,
            //最小值
            vMin: '-' + maxNumber,
            //小数位数
            mDec: opt.decScale,
            //精度
            mPre: opt.decPrecision,
            //四舍五入方式
            mRound: opt.roundingMode,
            altDec: null
        };
        opt.settings = this.settings;
        this.yesCom = new YIUI.Yes_NumberEditor(opt);
        this.yesCom.el.addClass("ui-numed");
    },

    onRender: function (parent) {
        this.base(parent);
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
    getText: function () {
        return  this.yesCom.getInput().val();
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