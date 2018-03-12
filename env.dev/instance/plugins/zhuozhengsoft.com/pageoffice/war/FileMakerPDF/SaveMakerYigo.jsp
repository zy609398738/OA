<%@ page language="java" 
	import="com.zhuozhengsoft.pageoffice.*,java.util.*,java.io.*,javax.servlet.*,javax.servlet.http.*"
	pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.pageoffice.cn" prefix="po" %>
<%
	String realPath = request.getSession().getServletContext().getRealPath("");
	String fixPath = "instance/plugins/zhuozhengsoft.com/pageoffice/war";
	realPath = realPath.substring(0, realPath.length() - fixPath.length());
	String filePath=request.getParameter("filePath");
	filePath = filePath.replaceAll("\\\\","/");
	File file=new File(filePath);
	String name=file.getName(); 
	String path=filePath.substring(0, filePath.lastIndexOf(name));
	String dataPath = request.getParameter("dataPath");
	dataPath = dataPath.replaceAll("\\\\","/");
	if(dataPath == null || dataPath == ""){
		filePath=realPath+"modules/yigo2/Data/"+path+name;
	}else{
		filePath=dataPath+path+name;
	}
	FileSaver fs = new FileSaver(request, response);
	fs.saveToFile(filePath);
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
