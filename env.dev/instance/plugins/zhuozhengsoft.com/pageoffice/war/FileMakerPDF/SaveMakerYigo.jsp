<%@ page language="java" 
	import="com.zhuozhengsoft.pageoffice.*,java.util.*,java.io.*,javax.servlet.*,javax.servlet.http.*" 
	pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.pageoffice.cn" prefix="po" %>
<%
	String pdfPath =request.getParameter("pdfPath");
	String pdfName =request.getParameter("pdfName");
	FileSaver fs = new FileSaver(request, response);
	fs.saveToFile(pdfPath+ pdfName);
	fs.close();
%>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
	<head>


		<title>My JSP 'SaveMaker.jsp' starting page</title>

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
