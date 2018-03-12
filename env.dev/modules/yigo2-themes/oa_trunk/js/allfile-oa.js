(function () {

	var root = "yigo2-theme/";
	

	var getCookie = function(key){
		var arr,reg = new RegExp("(^| )"+key+"=([^;]*)(;|$)");
		if(arr = document.cookie.match(reg)){
			return unescape(arr[2]);
		}
		return null;
	}

	var myStyle = getCookie("myStyle");
	if(!myStyle){
		myStyle = 'blue';
	}
	var local = getCookie("locale");
	if(!local){
		local = 'zh-CN';
	}

	var file = "<link rel='stylesheet' type='text/css' href='"+root+"css/main.css'>" + 
				"<script type='text/javascript' src='"+root+"js/language/"+local+"/i18N.js' defer='defer'></script>" +
				"<script type='text/javascript' src='"+root+"js/oa.js'></script>";

	document.write(file);
}());
