<%@ page language="java" import="java.util.*,java.awt.*"
	pageEncoding="gb2312"%>
<%@page
	import="com.zhuozhengsoft.pageoffice.*,com.zhuozhengsoft.pageoffice.wordwriter.*"%>
<%@ taglib uri="http://java.pageoffice.cn" prefix="po"%>
<%
	WordDocument doc = new WordDocument();
	DataRegion dataReg = doc.openDataRegion("PO_table");
	Table table = dataReg.openTable(1);
	//�ϲ�table�еĵ�Ԫ��
	table.openCellRC(1, 1).mergeTo(1, 4);
	//���ϲ���ĵ�Ԫ��ֵ
	table.openCellRC(1, 1).setValue("���������");
	//���õ�Ԫ���ı���ʽ
	table.openCellRC(1, 1).getFont().setColor(Color.red);
	table.openCellRC(1, 1).getFont().setSize(24);
	table.openCellRC(1, 1).getFont().setName("����");
	table.openCellRC(1, 1).getParagraphFormat().setAlignment(
			WdParagraphAlignment.wdAlignParagraphCenter);

	PageOfficeCtrl poCtrl = new PageOfficeCtrl(request);
	poCtrl.setWriter(doc);

	//���÷�����ҳ��
	poCtrl.setServerPage(request.getContextPath()+"/poserver.zz");//���б���
	poCtrl.setCustomToolbar(false);
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
			<div id="textcontent" style="width: 1000px; height: 800px;">

				<!--**************   ׿�� PageOffice��� ************************-->
				<po:PageOfficeCtrl id="PageOfficeCtrl1">
				</po:PageOfficeCtrl>
			</div>
		</div>

	</body>
</html>