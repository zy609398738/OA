<%@ page language="java" import="java.util.*" pageEncoding="gb2312"%>
<%@ page
	import="com.zhuozhengsoft.pageoffice.*,com.zhuozhengsoft.pageoffice.wordwriter.*"%>
<%@ taglib uri="http://java.pageoffice.cn" prefix="po"%>
<%
        String FilePath=request.getContextPath()+"/WordDeleteRow/doc";
	PageOfficeCtrl poCtrl = new PageOfficeCtrl(request);
	WordDocument doc = new WordDocument();
	Table table1 = doc.openDataRegion("PO_table").openTable(1);
        Cell  cell=table1.openCellRC(2,1);
         //ɾ������Ϊ(2,1)�ĵ�Ԫ��������
        table1.removeRowAt(cell);
        poCtrl.setCustomToolbar(false);
	poCtrl.setWriter(doc);
	poCtrl.setServerPage(request.getContextPath()+"/poserver.zz");
	poCtrl.webOpen("doc/test_table.doc", OpenModeType.docNormalEdit,
			"������");
	poCtrl.setTagId("PageOfficeCtrl1");
%>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
	<head>

		<title>ɾ��Word��table��ָ����Ԫ��������</title>
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
       <div style="color:Red">ɾ����table������Ϊ(2,1)�ĵ�Ԫ�������У����ڷ�����<%=FilePath%>·���²鿴ԭģ���ĵ���</div>
		<div style="width: auto; height: 600px;">
			<po:PageOfficeCtrl id="PageOfficeCtrl1"></po:PageOfficeCtrl>
		</div>
	</body>
</html>
