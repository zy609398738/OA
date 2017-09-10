<%@ page
	import="com.bokesoft.dee.mule.config.ConfigResources,
				 org.mule.config.ConfigResource,
				 org.mule.api.MuleContext,
				 org.mule.context.DefaultMuleContextFactory,
				 org.mule.config.spring.SpringXmlConfigurationBuilder,
				 com.bokesoft.dee.mule.config.MuleContextManage,
				 java.util.Map,
				 java.util.Iterator,
				 java.net.URLEncoder,
				 java.net.URLDecoder,
				 java.util.Collection,
				 org.mule.model.seda.SedaService,
				 java.util.List,
				 com.bokesoft.dee.web.util.VersionUtils"%>
<%@ page language="java" contentType="text/html; charset=UTF-8"%>
<Script language="javascript">
function GetRequest() {
   var url = location.search; //获取url中"?"符后的字串
   var theRequest = new Object();
   if (url.indexOf("?") != -1) {
      var str = url.substr(1);
      strs = str.split("&");
      for(var i = 0; i < strs.length; i ++) {
         theRequest[strs[i].split("=")[0]]=unescape(strs[i].split("=")[1]);
      }
   }
   return theRequest;
}
var params = GetRequest();
var action = params['action'];
if ('reloadLic' == action) {
	window.location = 'interfaceInfoFindController.do?actionType=reloadLic';
}
</Script>
<html>
	<head>
	<link  href="css/login.css" type="text/css" rel="stylesheet" />
		<title>DEE - LOGIN</title>
	</head>
	<body id="body-login">
	<form method="post" action="index.jsp" id="form" name="form">
	<div id="login">
	   <div id="user">用户名：</div>
	   <div><input type="text" name="user" id="uesr-input" class="input" /></div>
	   <div id="password">密　码：</div>
	   <div><input type="password" name="pass" id="password-input" class="input" /></div>
	   <div id="button-bg" ><img src="images/button_bg.png"></div>
	   <div id="bottom">上海博科资讯股份有限公司2009-2012，版权所有</div>
	   <div id="version"> 版本：<%=VersionUtils.getVersion()%></div>
	   <!-- div ><a href="manageService.jsp" id="button-w">登录</a></div-->
	   <input type="hidden" name="forwardurl" value="<%=request.getParameter("forwardurl")%>" />
	   <div ><a href="#" id="button-w" onclick="javascript:document.getElementById('form').submit();">登录</a></div>
	   <a href="license.jsp" target="_blank" style="position: absolute; margin-top:295px; margin-left:460px;color:#666565;font-size:9">证书信息</a>
	</div>
	
	</form>

     


</body>
</html>
