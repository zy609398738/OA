<%@ page language="java"
	import="java.util.*,com.zhuozhengsoft.pageoffice.*,com.zhuozhengsoft.pageoffice.excelreader.*"
	pageEncoding="gb2312"%>
<%
	Workbook wb = new Workbook(request, response);
	Sheet sheet = wb.openSheet("Sheet1");
	Table tableA = sheet.openTable("tableA");
	Table tableB = sheet.openTable("tableB");

	//����ύ������
	out.print("�ύ������Ϊ��<br/><br/>");
	out.print("&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;�ƻ������"
					+ "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;ʵ�������<br/>");
	out.print("A���ţ�");
	while (!tableA.getEOF()) {
		if (!tableA.getDataFields().getIsEmpty()) {
			for (int i = 0; i < tableA.getDataFields().size(); i++) {
				out.print("&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"
				+ tableA.getDataFields().get(i).getValue());
			}
		}
		out.print("<br/>");
		tableA.nextRow();
	}

	out.print("B���ţ�");
	while (!tableB.getEOF()) {
		if (!tableB.getDataFields().getIsEmpty()) {
			for (int i = 0; i < tableB.getDataFields().size(); i++) {
				out.print("&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"
				+ tableB.getDataFields().get(i).getValue());
			}
		}
		out.print("<br/>");
		tableB.nextRow();
	}

	//��ͻ�����ʾ�ύ������
	wb.showPage(300, 300);
	wb.close();
%>


<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
	<head>

		<title>My JSP 'SaveFile.jsp' starting page</title>

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
	</body>
</html>
