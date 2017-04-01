<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%
	String path = request.getContextPath();
	String basePath = request.getScheme() + "://"
			+ request.getServerName() + ":" + request.getServerPort()
			+ path + "/";
%>
<%
	if (session.getAttribute("username") == null) {%>
<Script language="javascript">
alert('请先登录');
window.open('AuthorizationLogin.jsp', '_self');
</Script>
<% 				
	}
%>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
	<head>
		<base href="<%=basePath%>">

		<title>欢迎登录</title>
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
		<script type="text/javascript" src="js/authorization/authorizationIndex.js">
</script>
		<script type="text/javascript" src="js/authorization/authorizationUserInfo.js">
</script>
		<script type="text/javascript" src="js/authorization/authorizationRegistrationApp.js">
</script>
		<script type="text/javascript" src="js/authorization/authorizationApp.js">
</script>
		<script type="text/javascript" src="js/authorization/authorizationRegistrationAppSearch.js">
</script>
		<script type="text/javascript" src="js/authorization/authorizationAppSearch.js">
</script>
		<script type="text/javascript" src="js/authorization/util.js">
</script>
		<script type="text/javascript" src="js/authorization/left.js">
</script>
		<script type="text/javascript" src="js/authorization/center.js">
</script>
		<script type="text/javascript" src="js/authorization/Model.js">
</script>

	</head>

	<body>
	</body>
</html>
