<%@ page language="java"
	import="java.util.*,com.zhuozhengsoft.pageoffice.*,com.zhuozhengsoft.pageoffice.wordwriter.*,java.awt.*"
	pageEncoding="gb2312"%>
<%@ taglib uri="http://java.pageoffice.cn" prefix="po"%>
<%
	PageOfficeCtrl poCtrl = new PageOfficeCtrl(request);
	//设置服务器页面
	poCtrl.setServerPage(request.getContextPath()+"/poserver.zz");
	WordDocument wordDoc = new WordDocument();
	//打开数据区域，openDataRegion方法的参数代表Word文档中的书签名称
	DataRegion dataRegion1 = wordDoc.openDataRegion("PO_userName");
	//设置DataRegion的可编辑性
	dataRegion1.setEditing(true);
	DataRegion dataRegion2 = wordDoc.openDataRegion("PO_deptName");
        dataRegion2.setEditing(true);
	poCtrl.setWriter(wordDoc);

	//添加自定义按钮
	poCtrl.addCustomToolButton("保存", "Save", 1);
	//设置保存数据的页面
	poCtrl.setSaveDataPage("SaveData.jsp");
       //设置保存文档的页面
	poCtrl.setSaveFilePage("SaveFile.jsp");
	//打开Word文档,当需要同时保存数据和保存文档时,OpenModeType必须是docSubmitForm模式。
	poCtrl.webOpen("doc/test.doc", OpenModeType.docSubmitForm, "张佚名");
	poCtrl.setTagId("PageOfficeCtrl1");//此行必需
%>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
	<head>
		<title>保存文档中指定位置的数据的同时也保存该文档</title>
		<script type="text/javascript">
	        function Save() {
		    document.getElementById("PageOfficeCtrl1").WebSave();
	        }
</script>
	</head>
	<body>
		<form id="form1">
			<div>
				<span style="color: Red; font-size: 14px;">请输入公司名称、年龄、部门等信息后，单击工具栏上的保存按钮</span>
				<br />
				<span style="color: Red; font-size: 14px;">请输入公司名称：</span>
				<input id="txtName" name="txtCompany" type="text" />
				<br />
			</div>
			<div style="width: auto; height: 700px;">
				<po:PageOfficeCtrl id="PageOfficeCtrl1">
				</po:PageOfficeCtrl>
			</div>
		</form>
	</body>
</html>
