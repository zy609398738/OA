<%@ page language="java"
	import="java.util.*,com.zhuozhengsoft.pageoffice.*"
	pageEncoding="gb2312"%>
<%@page import="com.zhuozhengsoft.pageoffice.excelwriter.*"%>
<%@page import="java.awt.Color"%>
<%@page import="java.text.*"%>
<%@ taglib uri="http://java.pageoffice.cn" prefix="po"%>
<%
	//����PageOfficeCtrl�ؼ��ķ���ҳ��
	PageOfficeCtrl poCtrl1 = new PageOfficeCtrl(request);
	poCtrl1.setServerPage(request.getContextPath()+"/poserver.zz"); //���б���
	poCtrl1.setCaption("�򵥵ĸ�Excel��ֵ");
	
	//���ز˵���
	poCtrl1.setMenubar(false);
	
	//poCtrl1.setSaveDataPage("SaveData.jsp");
	//poCtrl1.addCustomToolButton("����", "Save()", 1);
	//��Word�ļ�
	poCtrl1.webOpen("doc/test4.xls", OpenModeType.xlsNormalEdit, "����");
	poCtrl1.setTagId("PageOfficeCtrl1"); //���б���
%>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
	<head>
		<title>��Excel�ĵ��ж������Ƶ�����ֵ</title>

		<meta http-equiv="pragma" content="no-cache">
		<meta http-equiv="cache-control" content="no-cache">
		<meta http-equiv="expires" content="0">
		<meta http-equiv="keywords" content="keyword1,keyword2,keyword3">
		<meta http-equiv="description" content="This is my page">
		<!--
	<link rel="stylesheet" type="text/css" href="styles.css">
	-->
	<script type="text/javascript">
        function Save() {
            document.getElementById("PageOfficeCtrl1").WebSave();
        }
    </script>
	</head>

	<body>
		<a href="Default.jsp">������ҳ</a><br/>
		δ��̬�������ʱ����ʾ��Ч��
		<div style="width: 1000px; height: 900px;">
			<po:PageOfficeCtrl id="PageOfficeCtrl1"></po:PageOfficeCtrl>
		</div>
	</body>
</html>