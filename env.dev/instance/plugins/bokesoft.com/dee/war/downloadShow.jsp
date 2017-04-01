<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%
String path = request.getContextPath();
String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
%>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
  <head>
    <base href="<%=basePath%>">
    
    <title>资源下载</title>
    
	<meta http-equiv="pragma" content="no-cache">
	<meta http-equiv="cache-control" content="no-cache">
	<meta http-equiv="expires" content="0">    
	<meta http-equiv="keywords" content="keyword1,keyword2,keyword3">
	<meta http-equiv="description" content="This is my page">
	 
	<link rel="stylesheet" type="text/css" href="ExtJS4/resources/css/ext-all.css"/>
	<script type="text/javascript" src="ExtJS4/bootstrap.js"></script>
	<script type="text/javascript" src="ExtJS4/locale/ext-lang-zh_CN.js"></script>
	<script type="text/javascript" src="js/ext/downloadFiles.js"></script>
	
  </head>
  
  <body style="margin: 10px">
  	<input type="hidden" value="<%=session.getAttribute("Masterfiledirectory").toString()%>" name="master"/>
  	<div id="ceshi"></div>
  </body>
</html>
