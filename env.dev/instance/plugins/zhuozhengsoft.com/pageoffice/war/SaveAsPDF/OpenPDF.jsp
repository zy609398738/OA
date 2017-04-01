<%@ page language="java" import="java.util.*" pageEncoding="gb2312"%>
<%@page import="com.zhuozhengsoft.pageoffice.PDFCtrl"%>
<%@page import="com.zhuozhengsoft.pageoffice.ThemeType"%>
<%@ taglib uri="http://java.pageoffice.cn" prefix="po"%>
<%
	// ����˵����������Home��End��PageUp��PageDown�������ƶ���ҳ�����ּ���+��-�����Ŵ���С�����ּ���/��*������תҳ�档

	PDFCtrl pdfCtrl = new PDFCtrl(request);//����PDFCtrl�ؼ�����
	pdfCtrl.setServerPage(request.getContextPath()+"/poserver.zz"); //���÷�����ҳ��
	pdfCtrl.setTheme(ThemeType.CustomStyle);//����������ʽ

	//����Զ��尴ť
	pdfCtrl.addCustomToolButton("��ӡ", "Print()", 6);
	pdfCtrl.addCustomToolButton("-", "", 0);
	pdfCtrl.addCustomToolButton("ʵ�ʴ�С", "SetPageReal()", 16);
	pdfCtrl.addCustomToolButton("�ʺ�ҳ��", "SetPageFit()", 17);
	pdfCtrl.addCustomToolButton("�ʺϿ��", "SetPageWidth()", 18);
	pdfCtrl.addCustomToolButton("-", "", 0);
	pdfCtrl.addCustomToolButton("��ҳ", "FirstPage()", 8);
	pdfCtrl.addCustomToolButton("��һҳ", "PreviousPage()", 9);
	pdfCtrl.addCustomToolButton("��һҳ", "NextPage()", 10);
	pdfCtrl.addCustomToolButton("βҳ", "LastPage()", 11);
	pdfCtrl.addCustomToolButton("-", "", 0);
	pdfCtrl.addCustomToolButton("��ת", "RotateLeft()", 12);
	pdfCtrl.addCustomToolButton("��ת", "RotateRight()", 13);
	pdfCtrl.addCustomToolButton("-", "", 0);
	pdfCtrl.addCustomToolButton("�Ŵ�", "ZoomIn()", 14);
	pdfCtrl.addCustomToolButton("��С", "ZoomOut()", 15);
	pdfCtrl.addCustomToolButton("-", "", 0);
	pdfCtrl.addCustomToolButton("ȫ��", "SwitchFullScreen()", 4);
	//���ý�ֹ����
	pdfCtrl.setAllowCopy(false);

	String fileName = request.getParameter("fileName");//�����ļ�����
	pdfCtrl.webOpen("doc/" + fileName);//���ļ�
	pdfCtrl.setTagId("PDFCtrl1");//���б���
%>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
	<head>
		<title>��PDF�ļ�</title>
		<!--**************   ׿�� PageOffice �ͻ��˴��뿪ʼ    ************************-->
		<script language="javascript" type="text/javascript">
	function Print() {
		//alert(document.getElementById("PDFCtrl1").Caption);//��ʾ����
		document.getElementById("PDFCtrl1").ShowDialog(4);
	}
	function SwitchFullScreen() {
		document.getElementById("PDFCtrl1").FullScreen = !document
				.getElementById("PDFCtrl1").FullScreen;
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
	</head>
	<body>
		<form id="form1">
			<div style="width: auto; height: 700px;">
				<po:PDFCtrl id="PDFCtrl1">
				</po:PDFCtrl>
			</div>
		</form>
	</body>
</html>

