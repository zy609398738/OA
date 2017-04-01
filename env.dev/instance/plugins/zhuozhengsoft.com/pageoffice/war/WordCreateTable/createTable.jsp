<%@ page language="java" import="java.util.*" pageEncoding="gb2312"%>
<%@ page
	import="com.zhuozhengsoft.pageoffice.*,com.zhuozhengsoft.pageoffice.wordwriter.*"%>
<%@ taglib uri="http://java.pageoffice.cn" prefix="po"%>
<%
	PageOfficeCtrl poCtrl = new PageOfficeCtrl(request);
	poCtrl.setCustomToolbar(false);//�����û��Զ��幤����
	WordDocument doc = new WordDocument();
	//��word��ָ����"PO_table1"�����������ڶ�̬����һ��3��5�еı��
	Table table1 = doc.openDataRegion("PO_table1").createTable(3,5,WdAutoFitBehavior.wdAutoFitWindow);
	//�ϲ�(1,1)��(3,1)�ĵ�Ԫ�񲢸�ֵ
        table1.openCellRC(1,1).mergeTo(3,1);
        table1.openCellRC(1,1).setValue("�ϲ���ĵ�Ԫ��");
	//�����table1��ʣ��ĵ�Ԫ��ֵ
	for(int i=1;i<4;i++){
	    table1.openCellRC(i, 2).setValue("AA" + String.valueOf(i));
            table1.openCellRC(i, 3).setValue("BB" + String.valueOf(i));
            table1.openCellRC(i, 4).setValue("CC" + String.valueOf(i));
	    table1.openCellRC(i, 5).setValue("DD" + String.valueOf(i));
	}
	
	//��"PO_table1"���涯̬����һ���µ���������"PO_table2",���ڴ����µ�һ��5��5�еı��table2
	DataRegion drTable2= doc.createDataRegion("PO_table2", DataRegionInsertType.After, "PO_table1");
	Table table2=drTable2.createTable(5,5,WdAutoFitBehavior.wdAutoFitWindow);
	//���±��table2��ֵ
	for(int i=1;i<6;i++){
	    table2.openCellRC(i, 1).setValue("AA" + String.valueOf(i));
	    table2.openCellRC(i, 2).setValue("BB" + String.valueOf(i));
            table2.openCellRC(i, 3).setValue("CC" + String.valueOf(i));
            table2.openCellRC(i, 4).setValue("DD" + String.valueOf(i));
	    table2.openCellRC(i, 5).setValue("EE" + String.valueOf(i));
	}
	
	poCtrl.setWriter(doc);//���б���
	poCtrl.setServerPage(request.getContextPath()+"/poserver.zz");
	poCtrl.webOpen("doc/createTable.doc", OpenModeType.docNormalEdit,"������");
	poCtrl.setTagId("PageOfficeCtrl1");
%>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
	<head>

		<title>Word�ж�̬�������</title>
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
		<div style="width: auto; height: 800px;">
			<po:PageOfficeCtrl id="PageOfficeCtrl1"></po:PageOfficeCtrl>
		</div>
	</body>
</html>
