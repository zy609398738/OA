<%@ page language="java"
	import="java.util.*,java.lang.*,com.zhuozhengsoft.pageoffice.*"
	pageEncoding="gb2312"%>
<%@page import="com.zhuozhengsoft.pageoffice.excelwriter.*"%>
<%@page import="java.awt.Color"%>
<%@page import="java.text.*"%>
<%@ taglib uri="http://java.pageoffice.cn" prefix="po"%>
<%
	//����PageOfficeCtrl�ؼ��ķ���ҳ��
	PageOfficeCtrl poCtrl1 = new PageOfficeCtrl(request);
	poCtrl1.setServerPage(request.getContextPath()+"/poserver.zz"); //���б���
	poCtrl1.setCaption("ʹ��OpenTable��Excel��ֵ");
	//����Workbook����
	Workbook workBook = new Workbook();
	//����Sheet����"Sheet1"�Ǵ򿪵�Excel��������
	Sheet sheet = workBook.openSheet("Sheet1");
	//����Table����
	Table table = sheet.openTable("B4:F13");
    for(int i=0; i < 50; i++)
    { 
        table.getDataFields().get(0).setValue("��Ʒ " + i);
        table.getDataFields().get(1).setValue("100");
        table.getDataFields().get(2).setValue(String.valueOf(100+i));
        table.nextRow();
    }
    table.close();
    	
	poCtrl1.setWriter(workBook);
	
	//���ز˵���
	poCtrl1.setMenubar(false);
	//���ع�����
	poCtrl1.setCustomToolbar(false);
	//��Word�ļ�
	poCtrl1.webOpen("doc/test.xls", OpenModeType.xlsNormalEdit, "����");
	poCtrl1.setTagId("PageOfficeCtrl1"); //���б���
%>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
	<head>
		<title></title>

		<meta http-equiv="pragma" content="no-cache">
		<meta http-equiv="cache-control" content="no-cache">
		<meta http-equiv="expires" content="0">
		<meta http-equiv="keywords" content="keyword1,keyword2,keyword3">
		<meta http-equiv="description" content="This is my page">
		<!--
	<link rel="stylesheet" type="text/css" href="styles.css">
	-->

	</head>

	<body>
		�˱���е�������ʹ�ú�̨��������ȥ�ģ���鿴Table.jsp�Ĵ��룬ʹ�õ�OpenTable�ķ���������ʵ����������������ѭ��ʹ��ԭģ��Table����B4:F13����Ԫ����ʽ��
		<div style="width: 1000px; height: 700px;">
			<po:PageOfficeCtrl id="PageOfficeCtrl1"></po:PageOfficeCtrl>
		</div>
	</body>
</html>
