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
				 java.util.List"%>
<%@ page language="java" contentType="text/html; charset=UTF-8"%>

<html>
	<head>
	<link  href="css/login.css" type="text/css" rel="stylesheet" />


		<title>DEE - LOGIN</title>
	</head>
	<body id="body-login">
	<form method="post" action="manageService.jsp" id="form" name="form">
	<div id="login">
	   <div id="user">用户名：</div>
	   <div><input type="text" name="user" id="uesr-input" class="input" /></div>
	   <div id="password">密　码：</div>
	   <div><input type="password" name="pass" id="password-input" class="input" /></div>
	   <div id="button-bg" ><img src="images/button_bg.png"></div>
	   <div id="bottom">上海博科资讯股份有限公司2009-2012，版权所有</div>
	   <!-- div ><a href="manageService.jsp" id="button-w">登录</a></div-->
	   <div ><a href="#" id="button-w" onclick="javascript:document.getElementById('form').submit();">登录</a></div>
	</div>
	</form>

     


</body>
</html>
