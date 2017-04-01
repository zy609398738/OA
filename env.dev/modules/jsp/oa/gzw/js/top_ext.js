var MAP_C_SERVICE = (function() {
    var matches = /^\/*(\w+)\//g.exec(decodeURI(location.pathname));
    return (matches && matches.length >= 2) ? matches[1] : null;
})();

var MAP_C_SERVER_URL = location.protocol + '//' + location.host + '/' + MAP_C_SERVICE;

Ext.get('logout').on('click', function(/*jQuery.Event*/evt){
    if (window.confirm("确定退出?")) {
    	var URL_LOGOUT = MAP_C_SERVER_URL + '/rfc.do?__webCall=1&__out=1&__exp=WebLogout()';
    	Ext.Ajax.request({
    		url : URL_LOGOUT,
    		method : 'POST',
    		success : function (res) {
	            if ('true' == res.responseText) {
	                location.href = "login.jsp";
	            }
	        }
    	});
    }

    return evt.preventDefault() && false;
});