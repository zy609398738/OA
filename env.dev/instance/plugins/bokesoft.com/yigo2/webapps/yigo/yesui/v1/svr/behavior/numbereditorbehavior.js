YIUI.NumberEditorBehavior = (function () {
    var Return = {
		checkAndSet: function (options, callback) {
			var oldVal = options.oldVal;
        	var newVal = options.newVal;
        	var decScale = options.decScale;
        	var roundingMode = options.roundingMode || YIUI.NUMBEREDITOR_ROUNDINGMODE.HALF_UP;
            
            var d = null, v = 0, caption='';
    		if (newVal != null) {
    			d = YIUI.TypeConvertor.toDecimal(newVal);
    			v = d.toFormat(decScale, roundingMode);

                var settings = {
                    aSep: options.useSep ? options.sep : '',
                    //四舍五入方式
                    mRound: roundingMode,
                    //组大小
                    dGroup: options.groupingSize,
                    //小数点符号
                    aDec: options.decSep,
                    //小数位数
                    mDec: decScale
                };

                caption = YIUI.DecimalFormat.format(v, settings);
                newVal = new Decimal(v);
    		}else{
                newVal = new Decimal(0);
            }

            oldVal = YIUI.TypeConvertor.toDecimal(oldVal);

            var isChange = !oldVal.eq(newVal);

            if(isChange && $.isFunction(callback)) {
            	callback(newVal,caption);
            }
            
            return isChange;
        }
    };
    Return = $.extend({}, YIUI.BaseBehavior, Return);
    return Return;
})();
