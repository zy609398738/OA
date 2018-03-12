YIUI.TextEditorBehavior = (function () {
    var Return = {
		checkAndSet: function (options, callback) {
			var oldVal = options.oldVal;
        	var newVal = options.newVal;
            if (oldVal === newVal) {
                return false;
            }
            
            var settings = {
                trim: options.trim || false,
                textCase: $.isDefined(options.caseType) ? options.caseType : YIUI.TEXTEDITOR_CASE.NONE,
                maxLength: options.maxLength || 255,
                invalidChars: options.invalidChars || ""
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
