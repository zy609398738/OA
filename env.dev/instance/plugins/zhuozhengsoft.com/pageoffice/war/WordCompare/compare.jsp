<%@ page language="java" import="java.util.*" pageEncoding="gb2312"%>
<%@ page import="com.zhuozhengsoft.pageoffice.*, com.zhuozhengsoft.pageoffice.wordwriter.*,java.awt.*,java.net.*"%>
<%@ taglib uri="http://java.pageoffice.cn" prefix="po" %>
<%

PageOfficeCtrl poCtrl1 = new PageOfficeCtrl(request);
poCtrl1.setServerPage(request.getContextPath()+"/poserver.zz");

// Create custom toolbar
poCtrl1.addCustomToolButton("����", "SaveDocument()", 1);
poCtrl1.addCustomToolButton("��ʾA�ĵ�", "ShowFile1View()", 0);
poCtrl1.addCustomToolButton("��ʾB�ĵ�", "ShowFile2View()", 0);
poCtrl1.addCustomToolButton("��ʾ�ȽϽ��", "ShowCompareView()", 0);

//poCtrl1.wordCompare("doc/aaa1.doc", "doc/aaa2.doc", OpenModeType.docReadOnly, "����");
poCtrl1.wordCompare("doc/aaa1.doc", "doc/aaa2.doc", OpenModeType.docAdmin, "����");
poCtrl1.setTagId("PageOfficeCtrl1"); //���б���

%>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
  <head>
    <title>Word�ĵ��Ƚ�</title>
    
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
  <script language="javascript" type="text/javascript">
	    function SaveDocument() {
	        document.getElementById("PageOfficeCtrl1").WebSave();
	    }
	    function ShowFile1View() {
	        document.getElementById("PageOfficeCtrl1").Document.ActiveWindow.View.ShowRevisionsAndComments = false;
	        document.getElementById("PageOfficeCtrl1").Document.ActiveWindow.View.RevisionsView = 1;
	    }
	    function ShowFile2View() {
	        document.getElementById("PageOfficeCtrl1").Document.ActiveWindow.View.ShowRevisionsAndComments = false;
	        document.getElementById("PageOfficeCtrl1").Document.ActiveWindow.View.RevisionsView = 0;
	    }
	    function ShowCompareView() {
	        document.getElementById("PageOfficeCtrl1").Document.ActiveWindow.View.ShowRevisionsAndComments = true;
	        document.getElementById("PageOfficeCtrl1").Document.ActiveWindow.View.RevisionsView = 0;
	    }
	    function SetFullScreen() {
	        document.getElementById("PageOfficeCtrl1").FullScreen = !document.getElementById("PageOfficeCtrl1").FullScreen;
	    }
	</script>
    <div style="width:1000px; height:800px;">
      <po:PageOfficeCtrl id="PageOfficeCtrl1" />
  	</div>
  </body>
</html>
