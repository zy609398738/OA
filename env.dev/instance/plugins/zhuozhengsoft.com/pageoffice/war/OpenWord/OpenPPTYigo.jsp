<%@ page language="java"
	import="java.util.*,java.io.*,com.zhuozhengsoft.pageoffice.*,com.zhuozhengsoft.pageoffice.wordwriter.*"
	pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.pageoffice.cn" prefix="po"%>
<%
String path = request.getContextPath(); 
String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+"/"; 
String filePath = request.getParameter("filePath");//用request得到 
File file = new File(filePath);
String fileName=file.getName();//获得文件名
//******************************卓正PageOffice组件的使用*******************************
	//设置PageOffice服务器组件
	PageOfficeCtrl poCtrl1 = new PageOfficeCtrl(request);
	poCtrl1.setServerPage(request.getContextPath()+"/poserver.zz"); //此行必须
	
	//隐藏Office工具条
	poCtrl1.setOfficeToolbars(false);
	//隐藏自定义工具栏
	poCtrl1.setCustomToolbar(false);
	//设置页面的显示标题
	poCtrl1.setCaption(fileName);
	//打开文件
	poCtrl1.webOpen(basePath+"yigo/a/cms2-yigo2-adapter/cms/view-yigo-file/"+filePath, OpenModeType.pptReadOnly, "张三");
	poCtrl1.setTagId("PageOfficeCtrl1"); //此行必须	
%>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
  <head>   
    <title>最简单的以只读模式打开PPT文件</title>
    
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
    <div style=" width:auto; height:auto;">
    <po:PageOfficeCtrl id="PageOfficeCtrl1"></po:PageOfficeCtrl>
    </div>
  </body>
</html>
