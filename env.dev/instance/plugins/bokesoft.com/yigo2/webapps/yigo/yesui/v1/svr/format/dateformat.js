YIUI.DateFormat = (function () {
    var Return = {
    	//日期 formatStr、onlyDate
    	format: function(date, settings) {
			var def = {
			    formatStr: "yyyy-MM-dd HH:mm:ss",
			    isOnlyDate : false
			};
			settings = $.extend(def, settings);
    		var formatStr = settings.formatStr;
    		var onlyDate = settings.isOnlyDate;
    		if(onlyDate) {
    			formatStr = formatStr.split(" ")[0];
    		}
    		var text = "";
    		if(date) {
    			text = date.Format(formatStr);
    		}
    		return text;
    	}
    };
    return Return;
})();