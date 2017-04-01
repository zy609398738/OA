<%@ page language="java" import="java.util.*, java.awt.*" pageEncoding="gb2312"%>
<%@page
	import="com.zhuozhengsoft.pageoffice.*,com.zhuozhengsoft.pageoffice.excelwriter.*"%>
<%@ taglib uri="http://java.pageoffice.cn" prefix="po"%>
<%
	PageOfficeCtrl poCtrl = new PageOfficeCtrl(request);
	Workbook wb = new Workbook();
	Sheet sheet = wb.openSheet("Sheet1");

	Cell cC3 = sheet.openCell("C3");
	//���õ�Ԫ�񱳾���ʽ
	cC3.setBackColor( Color.LIGHT_GRAY);
	cC3.setValue( "һ��");
	cC3.setForeColor(Color.white);
	cC3.setHorizontalAlignment(XlHAlign.xlHAlignCenter);

	Cell cD3 = sheet.openCell("D3");
	//���õ�Ԫ�񱳾���ʽ
	cD3.setBackColor( Color.lightGray);
	cD3.setValue( "����");
	cD3.setForeColor(Color.white);
	cD3.setHorizontalAlignment( XlHAlign.xlHAlignCenter);

	Cell cE3 = sheet.openCell("E3");
	//���õ�Ԫ�񱳾���ʽ
	cE3.setBackColor( Color.lightGray);
	cE3.setValue( "����");
	cE3.setForeColor(Color.white);
	cE3.setHorizontalAlignment( XlHAlign.xlHAlignCenter);

	Cell cB4 = sheet.openCell("B4");
	//���õ�Ԫ�񱳾���ʽ
	cB4.setBackColor( new Color(10,254,254));
	cB4.setValue( "ס��");
	cB4.setForeColor( new Color(10,150,150));
	cB4.setHorizontalAlignment( XlHAlign.xlHAlignCenter);

	Cell cB5 = sheet.openCell("B5");
	//���õ�Ԫ�񱳾���ʽ
	cB5.setBackColor( new Color(10,150,150));
	cB5.setValue( "����");
	cB5.setForeColor( new Color(10,100,250));
	cB5.setHorizontalAlignment( XlHAlign.xlHAlignCenter);

	Cell cB6 = sheet.openCell("B6");
	//���õ�Ԫ�񱳾���ʽ
	cB6.setBackColor(new Color(200,200,100) );
	cB6.setValue( "����");
	cB6.setForeColor( new Color(10,150,150));
	cB6.setHorizontalAlignment( XlHAlign.xlHAlignCenter);

	Cell cB7 = sheet.openCell("B7");
	//���õ�Ԫ�񱳾���ʽ
	cB7.setBackColor( new Color(80,50,80));
	cB7.setValue( "ͨѶ");
	cB7.setForeColor( new Color(10,150,150));
	cB7.setHorizontalAlignment( XlHAlign.xlHAlignCenter);

	//���Ʊ����
	Table titleTable = sheet.openTable("B3:E10");
	titleTable.getBorder().setWeight(XlBorderWeight.xlThick);
	titleTable.getBorder().setLineColor(new Color(0, 128, 128));
	titleTable.getBorder().setBorderType(XlBorderType.xlAllEdges);

	sheet.openTable("B1:E2").merge();//�ϲ���Ԫ��
	sheet.openTable("B1:E2").setRowHeight( 30);//�����и�
	Cell B1 = sheet.openCell("B1");
	//���õ�Ԫ���ı���ʽ
	B1.setHorizontalAlignment(XlHAlign.xlHAlignCenter);
	B1.setVerticalAlignment(XlVAlign.xlVAlignCenter);
	B1.setForeColor( new Color(0,128,128));
	B1.setValue( "���֧Ԥ��");
	B1.getFont().setBold(true);
	B1.getFont().setSize(25);
	
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
