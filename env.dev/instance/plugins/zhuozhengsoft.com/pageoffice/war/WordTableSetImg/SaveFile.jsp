<%@ page language="java" import="java.util.*,java.net.*,com.zhuozhengsoft.pageoffice.*" pageEncoding="UTF-8"%>
<%
String realPath = request.getSession().getServletContext().getRealPath("");
String fixPath = "instance/plugins/zhuozhengsoft.com/pageoffice/war";
realPath = realPath.substring(0, realPath.length() - fixPath.length());
String fileName=request.getParameter("filePath");
String dataPath = request.getParameter("dataPath");
String filePath = fileName;
dataPath = dataPath.replaceAll("\\\\","/");
	if(dataPath == null || dataPath == ""){
		filePath=realPath+"modules/yigo2/Data/"+filePath;
	}else{
		filePath=dataPath+filePath;
	}
filePath = filePath.replaceAll("/", "\\\\");
FileSaver fs=new FileSaver(request,response);
fs.saveToFile(filePath);
fs.close();
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
