<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<jsp:directive.page import="java.io.InputStream" />
<jsp:directive.page import="java.util.Properties" />
<jsp:directive.page import="java.io.FileInputStream" />
<%@page import="com.bokesoft.dee.web.account.LoginManager"%>
<%@page import="com.bokesoft.dee.web.account.Account"%>
<%@page import="com.bokesoft.dee.mule.util.json.JSONUtil"%>
<%@page import="com.bokesoft.dee.lic.parse.LicInfoSingleton"%>
<%@page import="java.text.SimpleDateFormat"%>
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
		<title>BokeDee数据交换引擎</title>
		<meta http-equiv="pragma" content="no-cache">
		<meta http-equiv="cache-control" content="no-cache">
		<meta http-equiv="expires" content="0">
		<meta http-equiv="description" content="This is my page">
		<link href="images/pagetitle.jpg" rel="icon" type="image/x-icon" />
		<link rel="stylesheet" type="text/css"
			href="ExtJS4/resources/css/ext-all.css" />
		<link rel="stylesheet" type="text/css"
			href="css/msgSlide.css" />
		<link rel="stylesheet" type="text/css" href="css/index.css" />
		<script type="text/javascript">
var _bkErrMsg = "<%=session.getAttribute("msg")%>";
var username = "<%=session.getAttribute("name")%>";
var permission = "<%=session.getAttribute("permission")%>";
var isAdmin= <%=session.getAttribute("isAdmin")%>;
var projectName= "<%=LicInfoSingleton.getInstance().getProjectName()%>";
var licType="<%=LicInfoSingleton.getInstance().getLicType()%>";
var forwardurl="<%=request.getParameter("forwardurl")%>";
var param="<%=session.getAttribute("param")%>";

if('null' != _bkErrMsg){
	if('null' != forwardurl && '' != forwardurl && null != forwardurl){
		location.href = forwardurl;
	} else {
		alert(_bkErrMsg);
		location.href = 'loginDesign.jsp';
	}
}

if('null' != forwardurl && '' != forwardurl && null != forwardurl){
	if('null' != param && '' != param && null != param)
		forwardurl = forwardurl + "?" + param;
	location.href = forwardurl;
}

if(isAdmin == false && permission == '{}'){
	alert('该用户没有任何权限，如有疑问请联系管理员!');
	location.href = 'loginDesign.jsp';
}
if ("testuse"==licType.toLowerCase() ) {
	<%
	SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
	long endDateTime = LicInfoSingleton.getInstance().getEndDate().getTime();
	long newDateTime = new Date().getTime();
	long remainingDays = (endDateTime - newDateTime)/1000/60/60/24;
	String	endDate=sdf.format(endDateTime);
	session.setAttribute("endDate",endDate);
	session.setAttribute("remainingDays", remainingDays);
	%>;
	remainingDays = "<%=session.getAttribute("remainingDays")%>";
	
	licType = "证书类型：<font style='color:#FF9900'>试用</font> &nbsp;&nbsp;有效期：<font style='color:#FF9900'>"+"<%=session.getAttribute("endDate")%></font>";
 } else {
	licType ="";
}
</script>
		<script type="text/javascript" src="ExtJS4/ext-all-debug.js">
</script>
		<script type="text/javascript" src="js/ext/message.js">
</script>
		<script type="text/javascript" src="js/ext/Model.js">
</script>
		<script type="text/javascript" src="js/ext/DeleteData.js">
</script>
		<script type="text/javascript" src="js/ext/Combox.js">
</script>
		<script type="text/javascript" src="js/ext/util.js">
</script>
		<script type="text/javascript" src="js/ext/GGPZWindow.js">
</script>
		<script type="text/javascript" src="js/ext/MPWindow.js">
</script>
		<script type="text/javascript" src="js/ext/PropertyWindow.js">
</script>
		<script type="text/javascript" src="js/ext/PermissionWindow.js">
</script>
		<script type="text/javascript" src="js/ext/center_commonConfig.js">
</script>
		<script type="text/javascript" src="js/ext/center_interfaceConfig.js">
</script>
		<script type="text/javascript" src="js/ext/center_interfceManage.js">
</script>
		<script type="text/javascript" src="js/ext/center_logManage.js">
</script>
		<script type="text/javascript" src="js/ext/center_permissionConfig.js">
</script>
		<script type="text/javascript" src="js/ext/center_exchangecenter.js">
</script>
		<script type="text/javascript" src="js/ext/center_otherConfig.js">
</script>
		<script type="text/javascript" src="js/ext/center.js">
</script>
		<script type="text/javascript" src="js/ext/left.js">
</script>
		<script type="text/javascript" src="js/ext/right.js">
</script>
		<script type="text/javascript" src="js/ext/bottom.js">
</script>
		<script type="text/javascript" src="js/ext/index.js">
</script>
		<script type="text/javascript" src="js/ext/jsbeautifier.js">
</script>
		<script type="text/javascript" src="js/ext/ExchangeWindow.js">
</script>
		<script type="text/javascript" src="js/ext/cell-editing.js">
</script>
		<script type="text/javascript" src="js/ext/TimingTaskWindow.js">
</script>
		<script type="text/javascript" src="js/ext/dateTimePicker.js">
</script>
		<script type="text/javascript" src="js/ext/dateTimeField.js">
</script>
		<script type="text/javascript" src="js/ext/center_dataTemplate.js">
</script>
		<script type="text/javascript" src="js/ext/center_interfaceSimpleConfig.js">
</script>
		<script type="text/javascript" src="js/ext/RowExpander.js">
</script>
		<script type="text/javascript" src="js/ext/SimpleConfig_tableToYigoWin.js">
</script>
		<script type="text/javascript" src="js/ext/SimpleConfig_xmlToYigoWin.js">
</script>
		<script type="text/javascript" src="js/ext/SimpleConfig_xmlToYigo2Win.js">
</script>
		<script type="text/javascript" src="js/ext/SimpleConfig_excelToYigoWin.js">
</script>
		<script type="text/javascript" src="js/ext/SimpleConfig_yigoToExcelWin.js">
</script>
		<script type="text/javascript" src="js/ext/SimpleConfig_sqlToExcelWin.js">
</script>
		<script type="text/javascript" src="js/ext/SimpleConfig_yigoToXmlWin.js">
</script>
		<script type="text/javascript" src="js/ext/SimpleConfig_yigoToTableWin.js">
</script>
		<style type="text/css">
.x-panel-header {
	background-image: url("images/03.jpg") !important
}

.x-accordion-hd {
	background-image: url("images/02.jpg") !important
}

.x-grid-row-alt .x-grid-cell,.x-grid-row-alt .x-grid-rowwrap-div {
	background-color: #ededed;
	border-color: #ededed
}

.x-grid-row-selected .x-grid-cell {
	background-color: #fffdd0 !important;
	border-color: #fffdd0 !important;
}

.gonggongpeizhi {
	background-image: url(images/folder_go.png)
}

.jiekoupeizhi {
	background-image: url(images/folder_wrench.png)
}

.jiekouguanli {
	background-image: url(images/jiekouguanli.png)
}

.rizhiguanli {
	background-image: url(images/rizhiguanli.png)
}

.quanxianguanli {
	background-image: url(images/permission.png)
}

.qitaxinxi {
	background-image: url(images/information.png)
}
.jiaohuanzhongxin {
	background-image: url(images/exchange.png)
}
.shujumoban {
	background-image: url(images/datatemplate.png)
}
.x-form-field {
	font-family: Verdana
}
 .enable-false-background-row .x-grid-cell{
    background-color:#A7C8E7 !important;
}
.enable-service-background-row .x-grid-cell{
    color:#FFAA33 !important;
     font-style:italic;
}
</style>
	</head>
	<body oncontextmenu="return false">
	</body>
</html>