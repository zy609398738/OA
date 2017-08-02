<%@ page language="java" 
	import="com.zhuozhengsoft.pageoffice.*,java.util.*,java.net.*,java.io.*,javax.servlet.*,javax.servlet.http.*,com.zhuozhengsoft.pageoffice.wordwriter.*" 
	pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.pageoffice.cn" prefix="po" %>
<%
String realPath = request.getSession().getServletContext().getRealPath("");
String fixPath="instance/plugins/zhuozhengsoft.com/pageoffice/war";
realPath=realPath.substring(0,realPath.length()-fixPath.length());
String filePath =request.getParameter("pdfFilePath");
String pdfFilePath=filePath;
filePath=realPath+"modules/yigo2/Data/"+filePath;
filePath = filePath.replaceAll("/", "\\\\"); 
String fileName =request.getParameter("fileName");
String pdfPath=filePath.substring(0,filePath.length()-fileName.length());
String pdfName =request.getParameter("pdfName");
	
	FileMakerCtrl fmCtrl = new FileMakerCtrl(request);
	fmCtrl.setServerPage(request.getContextPath()+"/poserver.zz");
	WordDocument doc = new WordDocument();
	//禁用右击事件
	doc.setDisableWindowRightClick(true);
	//给数据区域赋值，即把数据填充到模板中相应的位置
	doc.openDataRegion("PO_company").setValue("北京卓正志远软件有限公司  ");
	String urlEncode = URLEncoder.encode(pdfName, "UTF-8");
	File file = new File(pdfPath+pdfName);
	if(!file.exists()){
		fmCtrl.setSaveFilePage("SaveMakerYigo.jsp?pdfPath="+pdfPath+"&pdfName="+urlEncode);
	}
	fmCtrl.setWriter(doc);
	fmCtrl.setJsFunction_OnProgressComplete("OnProgressComplete()");
	fmCtrl.fillDocumentAsPDF(filePath, DocumentOpenType.Word, pdfName);
	fmCtrl.setTagId("FileMakerCtrl1"); //此行必须

	//fmCtrl.setTagId("FileMakerCtrl1"); //此行必须
%>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
	<head>

		<title>My JSP 'FileMaker.jsp' starting page</title>

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
		<div>
			<!--**************   卓正 PageOffice 客户端代码开始    ************************-->

			<script language="javascript" type="text/javascript">
	function OnProgressComplete() {
		window.parent.myFunc(); //调用父页面的js函数
	}
</script>
			<!--**************   卓正 PageOffice 客户端代码结束    ************************-->
			<po:FileMakerCtrl id="FileMakerCtrl1"/>

		</div>

	</body>
</html>
