YIUI.TextEditorBehavior = (function () {
    var Return = {
		checkAndSet: function (options, callback) {
			var oldVal = options.oldVal;
        	var newVal = options.newVal;
            if (oldVal === newVal) {
                return false;
            }
            var trim = options.trim;
            var textCase = options.textCase;
            var maxLength = options.maxLength;
            var invalidChars = options.invalidChars;
            
            var settings = {
                trim: options.trim,
                textCase: options.textCase,
                maxLength: options.maxLength,
                invalidChars: options.invalidChars
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
