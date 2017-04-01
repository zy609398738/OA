<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%
	String path = request.getContextPath();
	String basePath = request.getScheme() + "://"
			+ request.getServerName() + ":" + request.getServerPort()
			+ path + "/";
%>
<%
	if (session.getAttribute("username") != null) {%>
<Script language="javascript">
alert('您已经登录');
window.open('AuthorizationIndex.jsp', '_self');
</Script>
<% 				
	}
%>	
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
	<head>
		<base href="<%=basePath%>">

		<title>登录</title>
		<link rel="stylesheet" type="text/css"
			href="ExtJS4/resources/css/ext-all.css" />

		<meta http-equiv="pragma" content="no-cache">
		<meta http-equiv="cache-control" content="no-cache">
		<meta http-equiv="expires" content="0">
		<meta http-equiv="keywords" content="keyword1,keyword2,keyword3">
		<link href="images/pagetitle.jpg" rel="icon" type="image/x-icon" />
		<!--
	<link rel="stylesheet" type="text/css" href="styles.css">
	-->
		
		<script type="text/javascript" src="ExtJS4/ext-all-debug.js">
</script>
		<script type="text/javascript" src="ExtJS4/ext-all.js">
</script>
		<script type="text/javascript" src="js/authorization/authorizationLogin.js">
</script>
	</head>

	<body>
	</body>
</html>
