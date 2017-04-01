(function ($) {
	if(!Array.prototype.indexOf) {
		Array.prototype.indexOf = function(obj) {
			for (var i = 0; i < this.length; i++) {
				if(this[i] == obj) return i;
			}
			return -1;
		}
	}
	if(!String.prototype.trim) {
		String.prototype.trim = function() {
			return this.replace(/^\s+|\s+$/g, "");
		}
	}
	if(!String.prototype.isEmpty) {
		String.prototype.isEmpty = function() {
			return this.length == 0;
		}
	}
	if(!String.prototype.equalsIgnoreCase) {
		String.prototype.equalsIgnoreCase = function(str) {
			var equals = false;
			if(str == null) {
				equals = this == str;
			} else {
				str = str.toString();
				equals = this.toLowerCase() == str.toLowerCase();
			}
			return equals;
		}
	}
    if(!window.console) {
    	console = {};
    	console.log = function() {
    		return;
    	}
    }

	Date.prototype.Format = function(format) {
		var o = {         
		    "M+" : this.getMonth()+1, //月份         
		    "d+" : this.getDate(), //日         
		    "h+" : this.getHours()%12 == 0 ? 12 : this.getHours()%12, //小时         
		    "H+" : this.getHours(), //小时         
		    "m+" : this.getMinutes(), //分         
		    "s+" : this.getSeconds(), //秒         
		    "q+" : Math.floor((this.getMonth()+3)/3), //季度         
		    "S" : this.getMilliseconds() //毫秒         
	    };             
	    if(/(y+)/.test(format)){         
	        format = format.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));         
	    }         
	    for(var k in o){         
	        if(new RegExp("("+ k +")").test(format)){         
	            format = format.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));         
	        }         
	    }  
	    return format;      
	};
})(jQuery);