YIUI.DropdownButtonHandler = (function () {
    var Return = {
        /**
         * 控件的点击事件(单击)
         */
        doOnClick: function (control, btnKey) {
        	var formID = control.ofFormID,
		        form = YIUI.FormStack.getForm(formID),
		        clickContent;
        	var items = control.dropdownItems;
		    for (var i = 0, len = items.length; i < len; i++) {
				if(items[i].key == btnKey) {
					clickContent = items[i].formula;
					break;
				}
			}
		    var cxt = {form: form};
		    if (clickContent) {
		        form.eval(clickContent, cxt, null);
		    }
        }
    };
    Return = $.extend({}, YIUI.Handler, Return);
    return Return;
})();
