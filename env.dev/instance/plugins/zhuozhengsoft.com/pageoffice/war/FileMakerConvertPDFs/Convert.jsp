<%@ page language="java"
	import="java.util.*,com.zhuozhengsoft.pageoffice.FileMakerCtrl,com.zhuozhengsoft.pageoffice.*,com.zhuozhengsoft.pageoffice.wordwriter.*"
	pageEncoding="gb2312"%>
<%@ taglib uri="http://java.pageoffice.cn" prefix="po" %>
<%
     
String  filePath=request.getSession().getServletContext().getRealPath("FileMakerConvertPDFs/doc/");
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

FileMakerCtrl fmCtrl = new FileMakerCtrl(request);
fmCtrl.setServerPage(request.getContextPath()+"/poserver.zz");
fmCtrl.setJsFunction_OnProgressComplete("OnProgressComplete()");
fmCtrl.setSaveFilePage("SaveFile.jsp");
fmCtrl.fillDocumentAsPDF(filePath, DocumentOpenType.Word, "a.pdf");
fmCtrl.setTagId("FileMakerCtrl1"); //���б���
	  
          
  
   


%>



<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
	<head>

		<title>My JSP 'FileMaker.jsp' starting page</title>

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
	   <div>
			<!--**************   ׿�� PageOffice �ͻ��˴��뿪ʼ    ************************-->

	      <script language="javascript" type="text/javascript">
	         function OnProgressComplete() {
		            window.parent.convert(); //���ø�ҳ���js����
	        }

         </script>
			<!--**************   ׿�� PageOffice �ͻ��˴������    ************************-->
			        <po:FileMakerCtrl id="FileMakerCtrl1"/>

	</div>

	</body>
</html>