YIUI.ComboBoxHandler = (function () {
    var Return = {
        //获取下拉框的值
        getComboboxItems: function (combobox, cxt) {

            if (!combobox.needRebuild && typeof(combobox.needRebuild) != "undefined") {
                return;
            }
            var items = [];
            var sourceType = combobox.sourceType,
                formID = combobox.ofFormID;
            switch (sourceType) {
                case YIUI.COMBOBOX_SOURCETYPE.ITEMS:
                case YIUI.COMBOBOX_SOURCETYPE.STATUS:
                case YIUI.COMBOBOX_SOURCETYPE.PARAGROUP:
                    combobox.needRebuild = false;
                    break;
                case YIUI.COMBOBOX_SOURCETYPE.FORMULA:
                    var form = YIUI.FormStack.getForm(formID);
                    if (cxt == undefined) {
                        cxt = {form: form};
                    }
                    if (combobox.formula) {
                        var rs = form.eval($.trim(combobox.formula), cxt, null);
                        if ($.isString(rs)) {
                            var item_Arr = rs.split(";");
                            for (var i = 0, len = item_Arr.length; i < len; i++) {
                                var item_obj = item_Arr[i].split(",");
                                var i1 = item_obj[0];
                                var i2 = "";
                                if (item_obj.length > 1) {
                                    i2 = item_obj[1];
                                } else {
                                    i2 = i1;
                                }
                                var item = {
                                    value: i1,
                                    caption: i2
                                };
                                items.push(item);
                            }
                        } else if (rs instanceof DataDef.DataTable) {
                            rs.beforeFirst();
                            if (rs.cols.length == 1) {// 如果查询的是一列,那么认为是查询了value,caption从全局中匹配
                                var globalItems = combobox.globalItems;
                                var pItems = form.eval($.trim(globalItems), cxt, null);
                                while (rs.next()) {
                                    var value = YIUI.TypeConvertor.toString(rs.get(0));
                                    var caption = "";
                                    if (pItems && pItems.length > 0) {
                                        for (var i = 0, len = pItems.length; i < len; i++) {
                                            var pItem = pItems[i];
                                            if (pItem.value == value) {
                                                caption = pItem.caption;
                                                break;
                                            }
                                        }
                                    }
                                    caption = caption == "" ? value : caption;
                                    var item = {
                                        value: value,
                                        caption: caption
                                    };
                                    items.push(item);
                                }
                            } else if (rs.cols.length > 1) {
                                while (rs.next()) {
                                    var value = YIUI.TypeConvertor.toString(rs.get(0));
                                    var caption = YIUI.TypeConvertor.toString(rs.get(1));
                                    var item = {
                                        value: value,
                                        caption: caption
                                    };
                                    items.push(item);
                                }
                            }
                        } else if (rs != null) {
                            items = items.concat(rs);
                        }
                    }
                    combobox.setItems(items);
                    break;
                case YIUI.COMBOBOX_SOURCETYPE.QUERY:
                    var form = YIUI.FormStack.getForm(formID);
                    var data = {}, type;
                    var queryParas = combobox.queryParas;

                    data.formID = formID;
                    data.key = combobox.key;
                    data.formKey = form.getFormKey();
                    data.fieldKey = combobox.key;
                    data.typeDefKey = combobox.typeDefKey;
                    data.service = "PureUIService";
                    data.cmd = "getQueryItems";

                    var sourceType, value, paras = [];
                    for (var i = 0, len = queryParas.length; i < len; i++) {
                        sourceType = queryParas[i].sourceType;
                        value = queryParas[i].value;
                        switch (sourceType) {
                            case YIUI.COMBOBOX_PARAMETERSOURCETYPE.CONST:
                                //paras += content;
                                paras.push(value);
                                break;
                            case YIUI.COMBOBOX_PARAMETERSOURCETYPE.FORMULA:
                            case YIUI.COMBOBOX_PARAMETERSOURCETYPE.FIELD:
                                if (cxt == undefined) {
                                    cxt = {form: form};
                                }
                                paras.push(form.eval(value, cxt, null));
                                break;
                        }
                    }
                    data.paras = $.toJSON(paras);

                    var success = function (result) {
                        if (result) {
                            var items = [];
                            items = items.concat(result);
                            combobox.setItems(items);
                            combobox.checkItem(combobox.getValue());
                            combobox.needRebuild = false;
                        }
                    }

                    Svr.Request.getSyncData(Svr.SvrMgr.ServletURL, data, success);

                    break;
            }
        },
        doSuggest: function (combobox, value) {
            if ($.isEmptyObject(value)) {
                combobox.yesCombobox.$suggestView.empty().hide();
                return;
            }
            var sourceType = combobox.sourceType,
                formID = combobox.ofFormID,
                items, viewItems = [];
            var form = YIUI.FormStack.getForm(formID);
            switch (sourceType) {
                case YIUI.COMBOBOX_SOURCETYPE.FORMULA:
                    var cxt = {form: form};
                    if (combobox.formula) {
                        items = form.eval($.trim(combobox.formula), cxt, null);
                    }
                    for (var i = 0, len = items.length; i < len; i++) {
                        if (items[i].caption.indexOf(value) > 0) viewItems.push(items[i]);
                        if (viewItems.length == 5) break;
                    }
                    break;
                default:
                    items = combobox.items;
                    for (var i = 0, len = items.length; i < len; i++) {
                    	if (items[i].caption != null) {
                    		if (items[i].caption.indexOf(value) >= 0) viewItems.push(items[i]);
                    	}
                        
                        if (viewItems.length == 5) break;
                    }
                    break;
            }
            if (viewItems.length == 0) {
                combobox.yesCombobox.$suggestView.empty().hide();
                return;
            }
            var list = $('<ul/>'), _li;
            var view = combobox.yesCombobox.$suggestView.html(list);
            for (var i = 0, len = viewItems.length; i < len; i++) {
                _li = $('<li itemValue="' + viewItems[i].value + '">' + viewItems[i].caption + '</li>');
                list.append(_li);
            }
            var cityObj = $("input", combobox.el);
            var cityOffset = cityObj.offset();
            view.css({
                width: cityObj.outerWidth(),
                top: cityOffset.top + cityObj.outerHeight(),
                left: cityOffset.left
            })
            view.show();
            combobox.hasText = true;
        }
    };

    Return = $.extend({}, YIUI.Handler, Return);
    return Return;
})();