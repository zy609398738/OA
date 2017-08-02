YIUI.TextEditorHandler = (function () {
    var TextCase = {
        CASETYPE_NONE: 0,
        CASETYPE_LOWER: 1,
        CASETYPE_UPPER: 2
    };
    var Return = {
        doEnterPress: function (control) {
            var formID = control.ofFormID,
                form = YIUI.FormStack.getForm(formID),
                keyEnter = control.keyEnter;
            var cxt = {form: form};
            if (keyEnter) {
                form.eval(keyEnter, cxt, null);
            }
        }
    };
    Return = $.extend({}, YIUI.Handler, Return);
    return Return;
})();