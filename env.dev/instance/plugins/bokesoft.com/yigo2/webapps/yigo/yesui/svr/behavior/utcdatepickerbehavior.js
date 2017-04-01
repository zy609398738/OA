YIUI.UTCDatePickerBehavior = (function () {
    var Return = {
		checkAndSet: function (options, callback) {
			var oldVal = options.oldVal;
        	var newVal = options.newVal;
            if (oldVal == newVal) {
                return false;
            }
            var text = YIUI.UTCDateFormat.format(newVal);
            if($.isFunction(callback)) {
            	callback(text);
            }
            return true;
        }
    };
    Return = $.extend({}, YIUI.BaseBehavior, Return);
    return Return;
})();
