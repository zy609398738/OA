<%@ page language="java" import="java.util.*,java.awt.*"
	pageEncoding="gb2312"%>
<%@page
	import="com.zhuozhengsoft.pageoffice.*,com.zhuozhengsoft.pageoffice.excelwriter.*"%>
<%@ taglib uri="http://java.pageoffice.cn" prefix="po"%>
<%
	PageOfficeCtrl poCtrl = new PageOfficeCtrl(request);
	Workbook wb = new Workbook();
	Sheet sheet = wb.openSheet("Sheet1");
	// ���ñ���
	Table backGroundTable = sheet.openTable("A1:P200");
	//���ñ��߿���ʽ
	backGroundTable.getBorder().setLineColor(Color.white);

	// ���õ�Ԫ��߿���ʽ
	Border C4Border = sheet.openTable("C4:C4").getBorder();
	C4Border.setWeight(XlBorderWeight.xlThick);
	C4Border.setLineColor(Color.yellow);
	C4Border.setBorderType(XlBorderType.xlAllEdges);

	// ���õ�Ԫ��߿���ʽ
	Border B6Border = sheet.openTable("B6:B6").getBorder();
	B6Border.setWeight(XlBorderWeight.xlHairline);
	B6Border.setLineColor(Color.magenta);
	B6Border.setLineStyle(XlBorderLineStyle.xlSlantDashDot);
	B6Border.setBorderType(XlBorderType.xlAllEdges);

	//���ñ��߿���ʽ
	Table titleTable = sheet.openTable("B4:F5");
	titleTable.getBorder().setWeight(XlBorderWeight.xlThick);
	titleTable.getBorder().setLineColor(new Color(0, 128, 128));
	titleTable.getBorder().setBorderType(XlBorderType.xlAllEdges);

	//���ñ��߿���ʽ
	Table bodyTable2 = sheet.openTable("B6:F15");
	bodyTable2.getBorder().setWeight(XlBorderWeight.xlThick);
	bodyTable2.getBorder().setLineColor(new Color(0, 128, 128));
	bodyTable2.getBorder().setBorderType(XlBorderType.xlAllEdges);

	poCtrl.setWriter(wb);

	//���÷�����ҳ��
	poCtrl.setServerPage(request.getContextPath()+"/poserver.zz"); //���б���

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
