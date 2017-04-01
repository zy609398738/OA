<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib uri="/WEB-INF/map-html.tld" prefix="yigo" %>
<yigo:context>
<html>
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />     
</head>
<body>
	<yigo:out exp="if(WebGetPara(full)=1,{},{<a id='fullScreen' style='cursor:hand;float:right;font-size: 12px;color: blue;'>全屏显示正文</a>})" />
    <div class="office_show_box">
	<yigo:out exp="oasys.OA_SYS_Approval.WebFileShow4Office(oasys.OA_SYS_Approval.WebgetOfficeFilePath(WebGetPara({billID})&{__office},WebGetPara({billID})&{.htm}))"/>
    <hr>
    <!-- TODO 需要添加样式（下载正文） -->
    <p><a href="#" class="content"><font size="3" color="blue">点击下载文件原件 </font></a></p>
    </div>
	</body>
</html>
</yigo:context>
<script type="text/javascript" src="js/jquery-1.8.2.min.js"></script>
<script type="text/javascript">
	var MAP_C_SERVICE = (function() {
	    var matches = /^\/*(\w+)\//g.exec(decodeURI(location.pathname));
	    return (matches && matches.length >= 2) ? matches[1] : null;
	})();
	var MAP_C_SERVER_URL = location.protocol + '//' + location.host + '/' + MAP_C_SERVICE;
	var billID = '<%=request.getParameter("billID")%>';
	void function(_){
        _(function(){
        	_('#fullScreen').click(function(/*jQuery.Event*/evt){
    			window.open(window.location.href + '&full=1');
    		});
			// 文件正文下载
        	_('.content').click(function(){	
				var _url = MAP_C_SERVER_URL + '/rfc.do?&__out=1&__exp=oasys.OA_SYS_Approval.WebDownload(oasys.OA_SYS_Approval.WebgetOfficeFilePath({'+billID+'__office},{'+billID+'.doc}),{'+encodeURIComponent('新文档')+'.doc},{})'
				window.open(_url);
			});
        });
    }(window.jQuery);
</script>