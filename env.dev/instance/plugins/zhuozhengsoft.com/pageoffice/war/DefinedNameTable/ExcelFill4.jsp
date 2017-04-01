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
	
	//����Workbook����
	Workbook workBook = new Workbook();
	//����Sheet����"Sheet1"�Ǵ򿪵�Excel��������
	Sheet sheet = workBook.openSheet("Sheet1");
	
	//����Table����
	Table table = sheet.openTable("B4:F11");
	
	int rowCount = 12;//���轫Ҫ�Զ�������ݵ�ʵ�ʼ�¼����Ϊ12 
	for(int i = 1; i <= rowCount; i++){
		//�������еĵ�Ԫ��ֵ
	    table.getDataFields().get(0).setValue( i + "��");
	    table.getDataFields().get(1).setValue("100");
	    table.getDataFields().get(2).setValue("120");
	    table.getDataFields().get(3).setValue("500");
	    table.getDataFields().get(4).setValue("120%");
	    table.nextRow();//ѭ����һ�У����б���
	}

    //�ر�table����
    table.close();
    
	//����Table����
	Table table2 = sheet.openTable("B13:F16");
	int rowCount2 = 4;//���轫Ҫ�Զ�������ݵ�ʵ�ʼ�¼����Ϊ12 
	for(int i = 1; i <= rowCount2; i++){
		//�������еĵ�Ԫ��ֵ
	    table2.getDataFields().get(0).setValue( i + "����");
	    table2.getDataFields().get(1).setValue("300");
	    table2.getDataFields().get(2).setValue("300");
	    table2.getDataFields().get(3).setValue("300");
	    table2.getDataFields().get(4).setValue("100%");
	    table2.nextRow();
	}

    //�ر�table����
    table2.close();
	
	poCtrl1.setWriter(workBook);
	
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
		openTable������ݺ���ʾ��Ч��
		<div style="width: 1000px; height: 900px;">
			<po:PageOfficeCtrl id="PageOfficeCtrl1"></po:PageOfficeCtrl>
		</div>
	</body>
</html>
