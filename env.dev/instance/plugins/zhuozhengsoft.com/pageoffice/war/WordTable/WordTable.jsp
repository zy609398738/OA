<%@ page language="java" import="java.util.*" pageEncoding="gb2312"%>
<%@ page
	import="com.zhuozhengsoft.pageoffice.*,com.zhuozhengsoft.pageoffice.wordwriter.*"%>
<%@ taglib uri="http://java.pageoffice.cn" prefix="po"%>
<%
	PageOfficeCtrl poCtrl = new PageOfficeCtrl(request);
	WordDocument doc = new WordDocument();
	Table table1 = doc.openDataRegion("PO_T001").openTable(1);
 
    table1.openCellRC(1,1).setValue("PageOffice���");
	int dataRowCount = 5;//��Ҫ�������ݵ�����
	int oldRowCount = 3;//�����ԭ�е�����
	// ������
    for (int j = 0; j < dataRowCount - oldRowCount; j++)
    {
        table1.insertRowAfter(table1.openCellRC(2, 5));  //�ڵ�2�е����һ����Ԫ���²�������
    }
	// �������
    int i = 1;
    while (i <= dataRowCount)
    {   
        table1.openCellRC(i, 2).setValue("AA" + String.valueOf(i));
        table1.openCellRC(i, 3).setValue("BB" + String.valueOf(i));
        table1.openCellRC(i, 4).setValue("CC" + String.valueOf(i));
        table1.openCellRC(i, 5).setValue("DD" + String.valueOf(i));
        i++;
    }
	poCtrl.setWriter(doc);
	poCtrl.setServerPage(request.getContextPath()+"/poserver.zz");
	poCtrl.webOpen("doc/test_table.doc", OpenModeType.docNormalEdit,
			"������");
	poCtrl.setTagId("PageOfficeCtrl1");
%>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
	<head>

		<title>Word�е�Table���������</title>
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
		<div style="width: auto; height: 600px;">
			<po:PageOfficeCtrl id="PageOfficeCtrl1"></po:PageOfficeCtrl>
		</div>
	</body>
</html>
