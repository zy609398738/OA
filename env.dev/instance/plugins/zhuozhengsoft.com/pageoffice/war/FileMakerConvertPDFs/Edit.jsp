<%@ page language="java" 
	import="com.zhuozhengsoft.pageoffice.*,java.util.*,java.io.*,javax.servlet.*,javax.servlet.http.*" 
	pageEncoding="gb2312"%>
<%@ taglib uri="http://java.pageoffice.cn" prefix="po" %>
<%
String path = request.getContextPath();
String filePath ="";
String id=request.getParameter("id").trim();
if("1".equals(id)){
	filePath = request.getSession().getServletContext().getRealPath("FileMakerConvertPDFs/doc/PageOffice��Ʒ���.doc");
}
if("2".equals(id)){
 filePath = request.getSession().getServletContext().getRealPath("FileMakerConvertPDFs/doc/Pageoffice�ͻ��˰�װ����.doc");
}
if("3".equals(id)){
 filePath = request.getSession().getServletContext().getRealPath("FileMakerConvertPDFs/doc/PageOffice��Ӧ������.doc");
}
if("4".equals(id)){
 filePath = request.getSession().getServletContext().getRealPath("FileMakerConvertPDFs/doc/PageOffice��Ʒ�Կͻ��˻���Ҫ��.doc");
}



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
