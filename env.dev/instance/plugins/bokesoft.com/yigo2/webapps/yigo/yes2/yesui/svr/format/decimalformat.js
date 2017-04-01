YIUI.DecimalFormat = (function() {
	var Return = {
		checkEmpty: function(iv, settings, signOnEmpty) {
	        if (iv === '' || iv === settings.aNeg) {
	            // if(settings.vEmpty==='zero'){
	            // return iv +'0';
	            // }
	            // if(settings.vEmpty === 'sign' || signOnEmpty){
	            // return iv + settings.aSign;
	            //      }
	            return iv;
	        }
	        return null;
	
	    },

	    /*var settings = {
	     //组分割符
	     aSep : ',',
	     //组大小
	     dGroup : '3',
	     //小数点符号
	     aDec : '.',
	     //前缀或后缀符号
	     aSign : '',
	     //p是前缀 s是后缀
	     pSign : '',
	     //小数位数
	     mDec : '2'
	     };*/
		format: function(iv, settings){
			var def = {
				//组分割符
			    aSep : ',',
			    //组大小
			    dGroup : '3',
			    //小数点符号
			    aDec : '.',
			    //前缀或后缀符号
			    aSign : '',
			    //p是前缀 s是后缀
			    pSign : '',
			    //小数位数
			    mDec : '2'
			};
			settings = $.extend(def, settings);
			iv = YIUI.TypeConvertor.toString(iv);
	        var empty = this.checkEmpty(iv, settings, true);
	
	        if (empty !== null) {
	            return empty;
	        }
	
	        var digitalGroup = '';
	        if (settings.dGroup === 2) {
	            digitalGroup = /(\d)((\d)(\d{2}?)+)$/;
	        } else if (settings.dGroup === 4) {
	            digitalGroup = /(\d)((\d{4}?)+)$/;
	        } else {
	            digitalGroup = /(\d)((\d{3}?)+)$/;
	        }
	
	        var ivSplit = iv.split(settings.aDec);
	
	        var s = ivSplit[0];
	
	        if (settings.aSep) {
	            while (digitalGroup.test(s)) {
	                s = s.replace(digitalGroup, '$1' + settings.aSep + '$2');
	            }
	        }
	
	        if (settings.mDec !== 0) {
	        	var dec = "000000000";
	        	//若iv为整数，需要显示为小数格式
	        	if(ivSplit.length == 1) {
	        		ivSplit[1] = "000000000";
	        	}
	            if (ivSplit[1].length > settings.mDec) {
	                ivSplit[1] = ivSplit[1].substring(0, settings.mDec);
	            } else {
	            	ivSplit[1] = ivSplit[1] + dec.substring(ivSplit[1].length, settings.mDec);
	            }
	
	            iv = s + settings.aDec + ivSplit[1];
	        } else {
	            iv = s;
	        }
	
	        if (settings.aSign) {
	            iv = settings.pSign === 'p' ? settings.aSign + iv : iv
	                + settings.aSign;
	        }
	
	        return iv;
	    }
    };
    return Return;
})();
