YIUI.BaseBehavior = (function () {
    var Return = {
        checkAndSet: function (options, callback) {
        	var oldVal = options.oldVal;
        	var newVal = options.newVal;
        	if(newVal instanceof Decimal) {
        		newVal = newVal.toString();
        	}
            if (oldVal === newVal) {
                return false;
            }
            if($.isFunction(callback)) {
            	callback(newVal);
            }
            return true;
        }
    };
    return Return;
})();
