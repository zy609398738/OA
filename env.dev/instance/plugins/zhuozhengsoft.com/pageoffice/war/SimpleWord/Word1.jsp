<%@ page language="java" 
	import="com.zhuozhengsoft.pageoffice.*,java.util.*,java.io.*,javax.servlet.*,javax.servlet.http.*" 
	pageEncoding="gb2312"%>
<%@ taglib uri="http://java.pageoffice.cn" prefix="po" %>
<%
String path = request.getContextPath();
String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";

String filePath = request.getSession().getServletContext().getRealPath("SimpleWord/doc/test.doc");
//out.print(filePath);// �鿴filePath ��ֵ

//******************************׿��PageOffice�����ʹ��*******************************
	PageOfficeCtrl poCtrl1 = new PageOfficeCtrl(request);
	poCtrl1.setServerPage(request.getContextPath()+"/poserver.zz"); //���б���
	poCtrl1.setSaveFilePage("SaveFile.jsp");//��Ҫ�����ļ������б���
	poCtrl1.addCustomToolButton("����", "Save()", 1);//����Զ��幤������ť
	//���ļ�
	poCtrl1.webOpen(filePath, OpenModeType.docNormalEdit, "����");
	poCtrl1.setTagId("PageOfficeCtrl1"); //���б���	 
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
    	�򿪷�������ָ������·���µ��ļ�<br/>
    	
    <script type="text/javascript">
			function Save() {
				document.getElementById("PageOfficeCtrl1").WebSave();
			}
	</script>
    <po:PageOfficeCtrl id="PageOfficeCtrl1" />
  </body>
</html>
