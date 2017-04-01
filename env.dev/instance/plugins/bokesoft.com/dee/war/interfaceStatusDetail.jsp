<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<jsp:directive.page import="java.io.InputStream" />
<jsp:directive.page import="java.util.Properties" />
<jsp:directive.page import="java.io.FileInputStream" />
<%@page import="com.bokesoft.dee.web.account.LoginManager"%>
<%@page import="com.bokesoft.dee.web.account.Account"%>
<%@page import="com.bokesoft.dee.mule.util.json.JSONUtil"%>
<%@page import="com.bokesoft.dee.lic.parse.LicInfoSingleton"%>
<%
	String path = request.getContextPath();
	String basePath = request.getScheme() + "://"
			+ request.getServerName() + ":" + request.getServerPort()
			+ path + "/";
%>
<%
	if (session.getAttribute("userInfo") == null) {
		String userName = request.getParameter("user");
		String password = request.getParameter("pass");
		LoginManager lm = new LoginManager();
		session.setAttribute("msg", null);
		session.setAttribute("name", null);
		session.setAttribute("permission", null);
		session.setAttribute("isAdmin", false);
		Account account = null;
		try {
			account = lm.login(userName, password, String
					.valueOf(request.getLocalPort()), path);
			if (account != null) {
				session.setAttribute("userInfo", account);
				session.setAttribute("name", account.getName());
				session.setAttribute("permission", JSONUtil.toJson(
						account.getPermission()).replace("\"", "\\\""));
				session.setAttribute("name", account.getName());
				session.setAttribute("isAdmin", account.isAdmin());
			} else if (userName == null || "".equals(userName)) {
				session.setAttribute("msg", "请先登录");
			} else {
				session.setAttribute("msg", "用户名密码错误");
			}
		} catch (Exception e) {
			session.setAttribute("msg", e.getMessage());
		}
	}
%>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
	<head>
		<base href="<%=basePath%>">
		<title>BokeDee数据交换引擎日志查询</title>
		<meta http-equiv="pragma" content="no-cache">
		<meta http-equiv="cache-control" content="no-cache">
		<meta http-equiv="expires" content="0">
		<meta http-equiv="description" content="This is my page">
		<link href="images/pagetitle.jpg" rel="icon" type="image/x-icon" />
		<link rel="stylesheet" type="text/css"
			href="ExtJS4/resources/css/ext-ie.css" />
		<link rel="stylesheet" type="text/css"
			href="ExtJS4/shared/example.css" />
		<link rel="stylesheet" type="text/css" href="css/index.css" />
		<script type="text/javascript">
var _bkErrMsg = "<%=session.getAttribute("msg")%>";
var username = "<%=session.getAttribute("name")%>";
var permission = "<%=session.getAttribute("permission")%>";
var isAdmin= <%=session.getAttribute("isAdmin")%>;
var projectName= "<%=LicInfoSingleton.getInstance().getProjectName()%>";
if('null' != _bkErrMsg){
	alert(_bkErrMsg);
	location.href = 'loginDesign.jsp';
}
if(isAdmin == false && permission == '{}'){
	alert('该用户没有任何权限，如有疑问请联系管理员!');
	location.href = 'loginDesign.jsp';
}
</script>
		<script type="text/javascript" src="ExtJS4/ext-all-debug.js">
</script>
		<script type="text/javascript" src="js/ext/interfacestatusdetail.js">
</script>
		<script type="text/javascript" src="js/ext/interfacestatusdetail2.js">
</script>
		<script type="text/javascript"
			src="js/ext/interfacestatusdetailIndex.js">
</script>
	</head>
	<body oncontextmenu="return false">
	</body>
</html>