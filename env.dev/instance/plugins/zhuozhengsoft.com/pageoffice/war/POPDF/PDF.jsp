<%@ page language="java" import="java.util.*" pageEncoding="gb2312"%>
<%@ page import="com.zhuozhengsoft.pageoffice.*, com.zhuozhengsoft.pageoffice.wordwriter.*,java.awt.*"%>
<%@ taglib uri="http://java.pageoffice.cn" prefix="po" %>
<%

PDFCtrl poCtrl1 = new PDFCtrl(request);
poCtrl1.setServerPage(request.getContextPath()+"/poserver.zz"); //���б���

// Create custom toolbar
poCtrl1.addCustomToolButton("��ӡ", "Print()", 6);
poCtrl1.addCustomToolButton("����/��ʾ��ǩ", "SetBookmarks()", 0);
poCtrl1.addCustomToolButton("-", "", 0);
poCtrl1.addCustomToolButton("ʵ�ʴ�С", "SetPageReal()", 16);
poCtrl1.addCustomToolButton("�ʺ�ҳ��", "SetPageFit()", 17);
poCtrl1.addCustomToolButton("�ʺϿ��", "SetPageWidth()", 18);
poCtrl1.addCustomToolButton("-", "", 0);
poCtrl1.addCustomToolButton("��ҳ", "FirstPage()", 8);
poCtrl1.addCustomToolButton("��һҳ", "PreviousPage()", 9);
poCtrl1.addCustomToolButton("��һҳ", "NextPage()", 10);
poCtrl1.addCustomToolButton("βҳ", "LastPage()", 11);
poCtrl1.addCustomToolButton("-", "", 0);

poCtrl1.webOpen("doc/test.pdf");
poCtrl1.setTagId("PDFCtrl1"); //���б���
%>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
  <head>
    <title>���ߴ�PDF�ļ�</title>
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
  <!--**************   ׿�� PageOffice �ͻ��˴��뿪ʼ    ************************-->
	<script language="javascript" type="text/javascript">
	    function AfterDocumentOpened() {
	        //alert(document.getElementById("PDFCtrl1").Caption);
	    }
	    function SetBookmarks() {
	        document.getElementById("PDFCtrl1").BookmarksVisible = !document.getElementById("PDFCtrl1").BookmarksVisible;
	    }
	    
	    function Print() {
	        document.getElementById("PDFCtrl1").ShowDialog(4);
	    }
	    function SwitchFullScreen() {
	        document.getElementById("PDFCtrl1").FullScreen = !document.getElementById("PDFCtrl1").FullScreen;
	    }
	    function SetPageReal() {
	        document.getElementById("PDFCtrl1").SetPageFit(1);
	    }
	    function SetPageFit() {
	        document.getElementById("PDFCtrl1").SetPageFit(2);
	    }
	    function SetPageWidth() {
	        document.getElementById("PDFCtrl1").SetPageFit(3);
	    }
	    function ZoomIn() {
	        document.getElementById("PDFCtrl1").ZoomIn();
	    }
	    function ZoomOut() {
	        document.getElementById("PDFCtrl1").ZoomOut();
	    }
	    function FirstPage() {
	        document.getElementById("PDFCtrl1").GoToFirstPage();
	    }
	    function PreviousPage() {
	        document.getElementById("PDFCtrl1").GoToPreviousPage();
	    }
	    function NextPage() {
	        document.getElementById("PDFCtrl1").GoToNextPage();
	    }
	    function LastPage() {
	        document.getElementById("PDFCtrl1").GoToLastPage();
	    }
	    function RotateRight() {
	        document.getElementById("PDFCtrl1").RotateRight();
	    }
	    function RotateLeft() {
	        document.getElementById("PDFCtrl1").RotateLeft();
	    }
	</script>
    <!--**************   ׿�� PageOffice �ͻ��˴������    ************************-->
  <div style="width:auto; height:600px;">
      <po:PDFCtrl id="PDFCtrl1" />
  </div>
  </body>
</html>