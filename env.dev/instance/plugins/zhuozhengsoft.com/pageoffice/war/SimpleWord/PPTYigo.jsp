<%@ page language="java" 
	import="com.zhuozhengsoft.pageoffice.*,java.util.*,java.io.*,javax.servlet.*,javax.servlet.http.*" 
	pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.pageoffice.cn" prefix="po" %>
<%
String path = request.getContextPath();
String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";

String realPath = request.getSession().getServletContext().getRealPath("");
String fixPath="instance/plugins/zhuozhengsoft.com/pageoffice/war";
realPath=realPath.substring(0,realPath.length()-fixPath.length());
String filePath =request.getParameter("filePath");
filePath=realPath+"modules/yigo2/Data/"+filePath;
filePath = filePath.replaceAll("/", "\\\\"); 
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
	poCtrl1.webOpen(filePath, OpenModeType.pptReadOnly, "张三");
	poCtrl1.setTagId("PageOfficeCtrl1"); //此行必须	 
%>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
  <head>
    <base href="<%=basePath%>">
    
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