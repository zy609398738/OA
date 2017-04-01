YIUI.TextFormat = (function () {
	var TextCase = {
        CASETYPE_NONE: 0,
        CASETYPE_LOWER: 1,
        CASETYPE_UPPER: 2
    };
    var Return = {
		//字符串   最大长度maxLength、不允许输入值InvalidChars、大小写Case、去除首尾空格Trim
		format: function(value, settings) {
			var def = {
			    /**
			     * Number。
			     * 允许输入的最大长度。
			     */
			    maxLength: Number.MAX_VALUE,

			    /**
			     * Number。
			     * 输入字符大小写。
			     */
			    textCase: YIUI.TEXTEDITOR_CASE.NONE,

			    /**
			     * String。
			     * 不允许输入的字符集合。
			     */
			    invalidChars: null,

			    /**
			     * Boolean。
			     * 是否去除首尾多余空格。
			     */
			    trim: true

			};
			settings = $.extend(def, settings);
    		var trim = settings.trim;
            var textCase = settings.textCase;
            var maxLength = settings.maxLength;
            var invalidChars = settings.invalidChars;
            var strV = "";
            if (value !== undefined && value !== null) {
                strV = value.toString();
                switch (textCase) {
	                case TextCase.CASETYPE_LOWER:
	                    strV = strV.toLowerCase();
	                    break;
	                case TextCase.CASETYPE_UPPER:
	                    strV = strV.toUpperCase();
	                    break;
	            }
                if (invalidChars !== undefined && invalidChars !== null && invalidChars !== "") {
                    var tStr = "";
                    for (var i = 0; i < strV.length; i++) {
                        if (invalidChars.indexOf(strV.charAt(i)) >= 0) continue;
                        tStr += strV.charAt(i);
                    }
                    strV = tStr;
                }
                if (maxLength >= 0 && maxLength < strV.length) {
                    strV = strV.substring(0, maxLength);
                }
                if (trim) {
                    strV = $.trim(strV);
                }
            }
            return strV;
    	}
    };
    return Return;
})();