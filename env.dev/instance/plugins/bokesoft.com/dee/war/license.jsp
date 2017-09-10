<%@ page language="java" pageEncoding="utf-8"%>
<%@page import="com.bokesoft.dee.lic.parse.LicInfoSingleton"%>
<%
	String path = request.getContextPath();
	String basePath = request.getScheme() + "://"
			+ request.getServerName() + ":" + request.getServerPort()
			+ path + "/";
%>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
<head>
<base href="<%=basePath%>">
<title>license</title>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<script type="text/javascript" src="js/jquery-1.8.3.min.js"></script>
<script type="text/javascript">
	$(document).ready(
			function() {
					$.getJSON("licenseController.do?actionType=findSystemInfo",
							function(data) {
								//alert(data.licInfo);]
								var licType=data.curlicStatus.split(",");
								var projectName="<%=LicInfoSingleton.getInstance().getProjectName()%>";
								//alert(projectName);
								document.getElementById("lic").innerHTML=data.licInfo;
								document.getElementById("licType").innerHTML=licType[0]+",项目名称 : "+projectName;
					});	
					$("#btn").click(function(){
						$.ajax({
							type:"post",
							url:"interfaceInfoFindController.do?actionType=reloadLic",
							success:function(){
								window.location.reload();
							}
						});
					});
	});
</script>
</head>
<body style="margin:0;">
		<div style="width: 100%; height: 48px; margin: 0px; left: 0px; top: 0px;"><div style="background:url(images/head_bg.jpg) repeat-x; height:42px;" ><img style="float:left" src="images/head_pic_01.jpg"><img style="float:right;" src="images/head_pic_02.jpg"></div></div>
		<div style="margin:10px 0 0 30px;">
		<div style="float:left;width:720px;height:70px;">
			<label style="float:left;margin-right:5px;width:120px">证书源信息：</label>
			<div style="float:left;width:595px;height:70px;"><textarea id="lic" rows="4" cols="20" style="width:595px;height:70px;" readonly></textarea></div>
		</div>
		<div style="float:left;width:720px;"><br></div>
		<div style="float:left;width:720px;height:27px;">
			<label style="float:left;margin-right:5px;width:120px">当前证书转态：</label>
			<div style="float:left;width:595px;height:27px;"><textarea id="licType" rows="4" cols="20" style="width:595px;height:27px;" readonly></textarea></div>
		</div>
		<div style="float:left;width:720px;"><br><button id="btn" type="button" style="float:right;" >重新加载证书</button></div>
		</div>
</body>
</html>