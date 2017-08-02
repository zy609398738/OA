YIUI.DatePickerBehavior = (function () {
    var Return = {
		checkAndSet: function (options, callback) {
			var oldVal = options.oldVal;
        	var newVal = options.newVal;
            if(oldVal instanceof Date && $.isNumeric(newVal)){
                oldVal = oldVal.getTime();
            }
            if (oldVal == newVal) {
                return false;
            }
            
            var date;
            if (!(newVal == undefined || newVal == null || newVal.length == 0)) {
                if(newVal instanceof Date) {
                	date = newVal;
                } else {
                	if($.isNumeric(newVal)) {
                		newVal = parseFloat(newVal);
                	} else {
                		newVal = newVal.replace(/-/g, "/");
                	}
                	date = new Date(newVal);
                }
            }
            if($.isFunction(callback)) {
            	callback(date);
            }
            return true;
        }
    };
    Return = $.extend({}, YIUI.BaseBehavior, Return);
    return Return;
})();
