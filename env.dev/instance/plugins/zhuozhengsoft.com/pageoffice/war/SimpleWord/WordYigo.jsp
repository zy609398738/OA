<%@ page language="java" 
	import="com.zhuozhengsoft.pageoffice.*,java.util.*,java.io.*,javax.servlet.*,javax.servlet.http.*,java.net.*" 
	pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.pageoffice.cn" prefix="po" %>
<%
String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+"/";

String fixPath="yigo/a/cms2-yigo2-adapter/cms/view-yigo-file/";
String filePath =request.getParameter("filePath");
File file=new File(filePath);
String name=file.getName();
String path=filePath.substring(0, filePath.lastIndexOf(name));
filePath=basePath+fixPath+path+URLEncoder.encode(name,"UTF-8");

String fileName =request.getParameter("fileName");
//out.print(filePath);// 查看filePath 的值

//******************************卓正PageOffice组件的使用*******************************
	PageOfficeCtrl poCtrl1 = new PageOfficeCtrl(request);
	poCtrl1.setServerPage(request.getContextPath()+"/poserver.zz"); //此行必须
//poCtrl1.setSaveFilePage("SaveFile.jsp");//如要保存文件，此行必须
//poCtrl1.addCustomToolButton("保存", "Save()", 1);//添加自定义工具栏按钮
	//隐藏Office工具条
	poCtrl1.setOfficeToolbars(false);
	//隐藏自定义工具栏
	poCtrl1.setCustomToolbar(false);
	//设置页面的显示标题
	poCtrl1.setCaption(fileName);
	//打开文件
	poCtrl1.setTagId("PageOfficeCtrl1");
//打开Word文档
poCtrl1.webOpen(filePath,OpenModeType.docNormalEdit,"张佚名");
%>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
  <head>
    <title>My JSP 'index.jsp' starting page</title>
	<meta http-equiv="pragma" content="no-cache">
	<meta http-equiv="cache-control" content="no-cache">
	<meta http-equiv="expires" content="0">    
	<meta http-equiv="keywords" content="keyword1,keyword2,keyword3">
	<meta http-equiv="description" content="This is my page">
	<script type="text/javascript" src="../jquery.min.js"></script>
    <script type="text/javascript" src="../pageoffice.js" id="po_js_main"></script>
	<!--
	<link rel="stylesheet" type="text/css" href="styles.css">
	-->
  </head>
  
  <body>
     <%=poCtrl1.getHtmlCode("PageOfficeCtrl1")%>
  </body>
</html>