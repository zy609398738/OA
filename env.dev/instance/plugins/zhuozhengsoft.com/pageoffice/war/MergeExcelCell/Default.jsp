<%@ page language="java" import="java.util.*,java.awt.*"
	pageEncoding="gb2312"%>
<%@page
	import="com.zhuozhengsoft.pageoffice.*,com.zhuozhengsoft.pageoffice.excelwriter.*"%>
<%@ taglib uri="http://java.pageoffice.cn" prefix="po"%>
<%
	PageOfficeCtrl poCtrl = new PageOfficeCtrl(request);
	Workbook wb = new Workbook();
	Sheet sheet = wb.openSheet("Sheet1");
	//�ϲ���Ԫ��
	sheet.openTable("B2:F2").merge();
	Cell cB2 = sheet.openCell("B2");
	cB2.setValue("����ĳ��˾��Ʒ�������");
	//����ˮƽ���뷽ʽ
	cB2.setHorizontalAlignment(XlHAlign.xlHAlignCenter);
	cB2.setForeColor(Color.red);
	cB2.getFont().setSize(16);

	sheet.openTable("B4:B6").merge();
	Cell cB4 = sheet.openCell("B4");
	cB4.setValue("A��Ʒ");
	//����ˮƽ���뷽ʽ
	cB4.setHorizontalAlignment(XlHAlign.xlHAlignCenter);
	//���ô�ֱ���뷽ʽ
	cB4.setVerticalAlignment(XlVAlign.xlVAlignCenter);

	sheet.openTable("B7:B9").merge();
	Cell cB7 = sheet.openCell("B7");
	cB7.setValue("B��Ʒ");
	cB7.setHorizontalAlignment(XlHAlign.xlHAlignCenter);
	cB7.setVerticalAlignment(XlVAlign.xlVAlignCenter);

	poCtrl.setWriter(wb);

	//���÷�����ҳ��
	poCtrl.setServerPage(request.getContextPath()+"/poserver.zz");//���б���
	poCtrl.setCustomToolbar(false);
	
	//�����ĵ��򿪷�ʽ
	poCtrl.webOpen("doc/test.xls", OpenModeType.xlsNormalEdit, "����");
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
