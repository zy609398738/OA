YIUI.NumberEditorBehavior = (function () {
    var Return = {
		checkAndSet: function (options, callback) {
			var oldVal = options.oldVal;
        	var newVal = options.newVal;
        	var decScale = $.isDefined(options.scale) ? options.scale : 2;
        	var roundingMode = $.isDefined(options.roundingMode) ? options.roundingMode : YIUI.NUMBEREDITOR_ROUNDINGMODE.HALF_UP;
            
            var d = null, v = 0;
    		if (newVal != null) {
    			d = YIUI.TypeConvertor.toDecimal(newVal);
    			newVal = d.round(decScale, roundingMode);
    		}else{
                newVal = new Decimal(0);
            }

            oldVal = YIUI.TypeConvertor.toDecimal(oldVal);

            var isChange = !oldVal.eq(newVal);

            if(isChange && $.isFunction(callback)) {
            	callback(newVal);
            }
            
            return isChange;
        }
    };
    Return = $.extend({}, YIUI.BaseBehavior, Return);
    return Return;
})();
