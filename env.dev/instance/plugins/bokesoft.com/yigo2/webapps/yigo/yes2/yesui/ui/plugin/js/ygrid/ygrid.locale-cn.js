//语言包
(function ($) {
    $.ygrid = $.ygrid || {};
    $.extend($.ygrid, {
        defaults: {
            record: "{0} - {1}",
            totalrecord: "共 {0} 条",
            seqColText: "序号",  //序号字段名称
            emptyrecords: "无数据显示",
            recordtext: "{0} - {1}\u3000共 {2} 条", // 共字前是全角空格
            pgtext: " 跳转至：{0}页"
        },
        del: {
            caption: "删除",
            msg: "删除所选记录？",
            bSubmit: "删除",
            bCancel: "取消"
        },
        nav: {
            addtext: "",  //新增按钮名称
            addtitle: "添加新记录",
            deltext: "", //删除按钮名称
            deltitle: "删除所选记录",
            uprowtext: "",  //上移按钮名称
            uprowtitle: "上移数据行",
            downrowtext: "", //删除按钮名称
            downrowtitle: "下移数据行"
        },
        formatter: {
            integer: {thousandsSeparator: ",", defaultValue: '0'},
            number: {decimalSeparator: ".", thousandsSeparator: ",", decimalPlaces: 2, defaultValue: '0.00'},
            currency: {decimalSeparator: ".", thousandsSeparator: ",", decimalPlaces: 2, prefix: "", suffix: "", defaultValue: '0.00'}
        },
        error: {
            isNotTable: "表格初始化错误，初始化所用HtmlElement不是Table类型",
            isErrorMode: "表格所在页面的渲染模式(documentMode)低于5",
            model: "colNames 和 colModel 长度不等！",
            isSortError: "行分组情况下不允许进行排序",
            compDictNotDataBinding: "多选复合字典{0}不允许有数据绑定字段"
        },
        alert: {
            title: "提示",
            confirm: "确认"
        },
        cell_imgOpt: {
            open:"打开",
            show:"查看",
            clear:"清除"
        }
    });
})(jQuery);