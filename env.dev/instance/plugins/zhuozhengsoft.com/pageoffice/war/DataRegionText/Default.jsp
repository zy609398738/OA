<%@ page language="java" import="java.util.*,java.awt.*"
	pageEncoding="gb2312"%>
<%@page
	import="com.zhuozhengsoft.pageoffice.*,com.zhuozhengsoft.pageoffice.wordwriter.*"%>
<%@ taglib uri="http://java.pageoffice.cn" prefix="po"%>
<%
	WordDocument doc = new WordDocument();
	DataRegion d1 = doc.openDataRegion("d1");
	d1.getFont().setColor(Color.BLUE);//�������������ı�������ɫ
	d1.getFont().setName("���Ĳ���");//�������������ı�������ʽ
	d1.getFont().setSize(16);//�������������ı������С
	d1.getParagraphFormat().setAlignment(
			WdParagraphAlignment.wdAlignParagraphCenter);//�������������ı����뷽ʽ

	DataRegion d2 = doc.openDataRegion("d2");
	d2.getFont().setColor(Color.orange);//�������������ı�������ɫ
	d2.getFont().setName("����");//�������������ı�������ʽ
	d2.getFont().setSize(14);//�������������ı������С
	d2.getParagraphFormat().setAlignment(
			WdParagraphAlignment.wdAlignParagraphLeft);//�������������ı����뷽ʽ

	DataRegion d3 = doc.openDataRegion("d3");
	d3.getFont().setColor(Color.magenta);//�������������ı�������ɫ
	d3.getFont().setName("�����п�");//�������������ı�������ʽ
	d3.getFont().setSize(12);//�������������ı������С
	d3.getParagraphFormat().setAlignment(
			WdParagraphAlignment.wdAlignParagraphRight);//�������������ı����뷽ʽ

	PageOfficeCtrl poCtrl = new PageOfficeCtrl(request);
	poCtrl.setWriter(doc);

	//���÷�����ҳ��
	poCtrl.setServerPage(request.getContextPath()+"/poserver.zz"); //���б���
	
	//�����ĵ��򿪷�ʽ
	poCtrl.webOpen("doc/test.doc", OpenModeType.docNormalEdit, "����");
	poCtrl.setTagId("PageOfficeCtrl1");
%>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
	<head>
		<meta http-equiv="Content-Type" content="text/html; charset=gb2312" />
		<title></title>
		<link href="images/csstg.css" rel="stylesheet" type="text/css" />
	</head>
	<body>

		<div id="content">
			��ʾ�����ʹ�ó���������������ı�����ʽ��<a href="Default2.jsp" target="_blank">������Ӳ鿴ԭ�ļ�</a><br /><br />
			<div id="textcontent" style="width: 1000px; height: 800px;">

				<!--**************   ׿�� PageOffice��� ************************-->
				<po:PageOfficeCtrl id="PageOfficeCtrl1">
				</po:PageOfficeCtrl>
			</div>
		</div>

	</body>
</html>
