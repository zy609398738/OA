/**
 * 此文件中仅包含对jQuery的扩展
 */
(function () {

	var root = "yesui/v2/";

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
	
	var local = getCookie("language");
	if(!local){
		local = 'zh';
	}

	//IE 下兼容console
	if(/msie/.test(navigator.userAgent.toLowerCase()) || /rv:([\d.]+)\) like gecko/.test(navigator.userAgent.toLowerCase())){
		document.write("<script type='text/javascript' src='"+root+"yesui/ui/plugin/js/fauxconsole/fauxconsole.js'></script>");
	}

	var file = "<link rel='stylesheet' href='"+root+"yesui/ui/plugin/css/modaldialog/css/jquery.modaldialog.css'/>" +
				"<link rel='stylesheet' href='"+root+"yesui/ui/plugin/css/scrollbar/scrollbar.css' />" +
				
				"<link rel='stylesheet' href='"+root+"yesui/ui/res/css/"+myStyle+"/login.css' />" +
				
				"<script type='text/javascript' src='"+root+"common/jquery/jquery-1.10.2.js'></script>" +
				"<script type='text/javascript' src='"+root+"common/jquery/jstz-1.0.4.min.js'></script>" +
				"<script type='text/javascript' src='"+root+"common/ext/jsext.js'></script>" +

				"<script type='text/javascript' src='"+root+"yesui/ui/yes-ui.js'></script>" +
				"<script type='text/javascript' src='"+root+"common/data/yiuiconsts.js' defer='defer'></script>" +
				"<script type='text/javascript' src='"+root+"common/data/itemdata.js' defer='defer'></script>" + 

				"<script type='text/javascript' src='"+root+"yesui/ui/language/i18n.js' defer='defer'></script>" +
				"<script type='text/javascript' src='"+root+"yesui/ui/language/"+local+"/i18N.js' defer='defer'></script>" +
				"<script type='text/javascript' src='"+root+"yesui/ui/language/"+local+"/plug-in.js' defer='defer'></script>" +
				
				"<script type='text/javascript' src='"+root+"common/exception/ViewException.js' defer='defer'></script>" +
				"<script type='text/javascript' src='"+root+"yesui/base/jQueryExt.js' defer='defer'></script>" +
				"<script type='text/javascript' src='"+root+"yesui/base/prototypeExt.js' defer='defer'></script>" +
				"<script type='text/javascript' src='"+root+"yesui/svr/request.js'></script>" + 
				"<script type='text/javascript' src='"+root+"yesui/svr/svrmgr.js'></script>" +
				"<script type='text/javascript' src='"+root+"yesui/svr/format/dateformat.js' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"yesui/svr/Base64Utils.js' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"yesui/ui/plugin/js/ui-extend/jquery.placeholder.js' defer='defer'></script>" +
				"<script type='text/javascript' src='"+root+"yesui/ui/plugin/js/jquery.cookie.js' defer='defer'></script>" +
				"<script type='text/javascript' src='"+root+"yesui/ui/plugin/js/jquery.json-2.3.min.js' defer='defer'></script>" +
				"<script type='text/javascript' src='"+root+"yesui/ui/plugin/js/modaldialog/js/resize.js' defer='defer'></script>" +
				"<script type='text/javascript' src='"+root+"yesui/ui/plugin/js/modaldialog/js/modaldialog.js' defer='defer'></script>" +
				"<script type='text/javascript' src='"+root+"yesui/ui/plugin/js/scrollbar/jquery_scrollbar.js' defer='defer'></script>" +
				"<script type='text/javascript' src='"+root+"yesui/ui/plugin/js/rsa/jsbn.js' defer='defer'></script>" +
				"<script type='text/javascript' src='"+root+"yesui/ui/plugin/js/rsa/prng4.js' defer='defer'></script>" +
				"<script type='text/javascript' src='"+root+"yesui/ui/plugin/js/rsa/rng.js' defer='defer'></script>" +
				"<script type='text/javascript' src='"+root+"yesui/ui/plugin/js/rsa/rsa.js' defer='defer'></script>" +
				"<script type='text/javascript' src='"+root+"yesui/ui/plugin/js/rsa/BASE_64.js' defer='defer'></script>"
				
	document.write(file);
}());
