<%@ page language="java" 
	import="com.zhuozhengsoft.pageoffice.*,java.util.*,java.io.*,javax.servlet.*,javax.servlet.http.*" 
	pageEncoding="gb2312"%>
<%@ taglib uri="http://java.pageoffice.cn" prefix="po" %>
<%
String path = request.getContextPath();
String filePath ="";
String id=request.getParameter("id").trim();
if("1".equals(id)){
	filePath = request.getSession().getServletContext().getRealPath("FileMakerConvertPDFs/doc/PageOffice产品简介.doc");
}
if("2".equals(id)){
 filePath = request.getSession().getServletContext().getRealPath("FileMakerConvertPDFs/doc/Pageoffice客户端安装步骤.doc");
}
if("3".equals(id)){
 filePath = request.getSession().getServletContext().getRealPath("FileMakerConvertPDFs/doc/PageOffice的应用领域.doc");
}
if("4".equals(id)){
 filePath = request.getSession().getServletContext().getRealPath("FileMakerConvertPDFs/doc/PageOffice产品对客户端环境要求.doc");
}



//******************************卓正PageOffice组件的使用*******************************
	PageOfficeCtrl poCtrl1 = new PageOfficeCtrl(request);
	poCtrl1.setServerPage(request.getContextPath()+"/poserver.zz"); //此行必须
	poCtrl1.setSaveFilePage("SaveFile.jsp");//如要保存文件，此行必须
	poCtrl1.addCustomToolButton("保存", "Save()", 1);//添加自定义工具栏按钮
	//打开文件
	poCtrl1.webOpen(filePath, OpenModeType.docNormalEdit, "张三");
	poCtrl1.setTagId("PageOfficeCtrl1"); //此行必须	 
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
	<!--
	<link rel="stylesheet" type="text/css" href="styles.css">
	-->
  </head>
  
  <body>

    <script type="text/javascript">
	function Save() {
	     document.getElementById("PageOfficeCtrl1").WebSave();
	}
    </script>
    <po:PageOfficeCtrl id="PageOfficeCtrl1" />
  </body>
</html>
