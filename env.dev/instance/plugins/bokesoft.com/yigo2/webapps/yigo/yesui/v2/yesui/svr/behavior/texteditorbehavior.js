YIUI.TextEditorBehavior = (function () {
    var Return = {
		checkAndSet: function (options, callback) {
			var oldVal = options.oldVal;
        	var newVal = options.newVal;
            if (oldVal === newVal) {
                return false;
            }
            var trim = options.trim || false;
            var textCase = $.isDefined(options.caseType) ? options.caseType : YIUI.TEXTEDITOR_CASE.NONE;
            var maxLength = options.maxLength || 255;
            var invalidChars = options.invalidChars || "";
            
            var settings = {
                trim: trim,
                textCase: textCase,
                maxLength: maxLength,
                invalidChars: invalidChars
            };
            var strV = YIUI.TextFormat.format(newVal, settings);
            
            var isChange = (oldVal !== strV);
            
            if($.isFunction(callback)) {
            	callback(strV);
            }
            return true;
        }
    };
    Return = $.extend({}, YIUI.BaseBehavior, Return);
    return Return;
})();
