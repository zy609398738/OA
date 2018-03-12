﻿<%@ page language="java"
	import="java.util.*,com.zhuozhengsoft.pageoffice.*,com.zhuozhengsoft.pageoffice.wordwriter.*"
	pageEncoding="utf-8"%>
<%
	//******************************卓正PageOffice组件的使用*******************************
	PageOfficeCtrl poCtrl1 = new PageOfficeCtrl(request);
	poCtrl1.setServerPage(request.getContextPath() + "/poserver.zz"); //此行必须
	//添加自定义按钮
	poCtrl1.addCustomToolButton("保存", "Save", 1);
	poCtrl1.addCustomToolButton("需要用户名密码签字", "AddHandSign1()", 3);
	poCtrl1.addCustomToolButton("无需用户名密码签字", "AddHandSign2()", 3);
	//设置保存页面
	poCtrl1.setSaveFilePage("SaveFile.jsp");
	poCtrl1.webOpen("test.doc", OpenModeType.docNormalEdit,"张三");
%>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
	<head>
		<title>10 插入签字</title>
		<meta http-equiv="pragma" content="no-cache">
		<meta http-equiv="cache-control" content="no-cache">
		<meta http-equiv="expires" content="0">
		<meta http-equiv="keywords" content="keyword1,keyword2,keyword3">
		<meta http-equiv="description" content="This is my page">
	</head>

	<body>
		<div style="font-size: 12px; line-height: 20px; border-bottom: dotted 1px #ccc; border-top: dotted 1px #ccc; padding: 5px;">
			<span style="color: red;">操作说明：</span>点“签字”按钮即可，插入签字时的用户名为：李志，密码默认为：111111。
			<br /> 关键代码：点右键，选择“查看源文件”，看js函数
			<span style="background-color: Yellow;">AddHandSign1()</span>和
			<span style="background-color: Yellow;">AddHandSign2()</span>

		</div>
		<br />
		<script type="text/javascript">
			function Save() {
				document.getElementById("PageOfficeCtrl1").WebSave();
			}

			function AddHandSign1() {
				try {
						document.getElementById("PageOfficeCtrl1").ZoomSeal.LocateSealPosition("Seal1");
						document.getElementById("PageOfficeCtrl1").ZoomSeal.AddHandSign("","","Seal1");
					} catch(e) {};
			}
			function AddHandSign2() {
				try {
						document.getElementById("PageOfficeCtrl1").ZoomSeal.LocateSealPosition("Seal1");
						document.getElementById("PageOfficeCtrl1").ZoomSeal.AddHandSign("李志","","Seal1");
					} catch(e) {};
			}
		</script>
		<div style="width: auto; height: 700px;">
			<%=poCtrl1.getHtmlCode("PageOfficeCtrl1")%>
		</div>
	</body>
</html>