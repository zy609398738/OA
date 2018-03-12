﻿<%@ page language="java"
	import="java.util.*,com.zhuozhengsoft.pageoffice.*,com.zhuozhengsoft.pageoffice.wordwriter.*"
	pageEncoding="utf-8"%>
<%
	//******************************卓正PageOffice组件的使用*******************************
	PageOfficeCtrl poCtrl1 = new PageOfficeCtrl(request);
	poCtrl1.setServerPage(request.getContextPath() + "/poserver.zz"); //此行必须
	//添加自定义按钮
	poCtrl1.addCustomToolButton("保存", "Save", 1);
	poCtrl1.addCustomToolButton("加盖印章", "InsertSeal()", 2);
	poCtrl1.addCustomToolButton("修改密码", "ChangePsw()", 0);
	//设置保存页面
	poCtrl1.setSaveFilePage("SaveFile.jsp");
	poCtrl1.webOpen("word3.doc", OpenModeType.docNormalEdit,"张三");
%>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>

	<head>
		<title>3 加盖印章</title>
		<meta http-equiv="pragma" content="no-cache">
		<meta http-equiv="cache-control" content="no-cache">
		<meta http-equiv="expires" content="0">
		<meta http-equiv="keywords" content="keyword1,keyword2,keyword3">
		<meta http-equiv="description" content="This is my page">
	</head>

	<body>
			<script type="text/javascript">
				function Save() {
					document.getElementById("PageOfficeCtrl1").WebSave();
				}

				function InsertSeal() {
					try {
						document.getElementById("PageOfficeCtrl1").ZoomSeal.AddSeal("李志");
					} catch(e) {}
				}

				function ChangePsw() {
					document.getElementById("PageOfficeCtrl1").ZoomSeal.ShowSettingsBox();
				}
			</script>
		   <div style="width: auto; height: 700px;">
			    <%=poCtrl1.getHtmlCode("PageOfficeCtrl1")%>
		    </div>
	</body>

</html>