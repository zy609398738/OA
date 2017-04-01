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
         //删除坐标为(2,1)的单元格所在行
        table1.removeRowAt(cell);
        poCtrl.setCustomToolbar(false);
	poCtrl.setWriter(doc);
	poCtrl.setServerPage(request.getContextPath()+"/poserver.zz");
	poCtrl.webOpen("doc/test_table.doc", OpenModeType.docNormalEdit,
			"张佚名");
	poCtrl.setTagId("PageOfficeCtrl1");
%>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
	<head>

		<title>删除Word中table中指定单元格所在行</title>
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
       <div style="color:Red">删除了table中坐标为(2,1)的单元格所在行，请在服务器<%=FilePath%>路径下查看原模板文档。</div>
		<div style="width: auto; height: 600px;">
			<po:PageOfficeCtrl id="PageOfficeCtrl1"></po:PageOfficeCtrl>
		</div>
	</body>
</html>
