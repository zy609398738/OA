<%@ page language="java" 
	import="com.zhuozhengsoft.pageoffice.*,java.util.*,java.net.*,java.io.*,javax.servlet.*,javax.servlet.http.*,com.zhuozhengsoft.pageoffice.wordwriter.*" 
	pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.pageoffice.cn" prefix="po" %>
<%
	String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+"/";
	
	String fixPath="yigo/a/cms2-yigo2-adapter/cms/view-yigo-file/";
	String filePath =request.getParameter("filePath");
	String dataPath =request.getParameter("dataPath");
	filePath = filePath.replaceAll("\\\\","/");
	File file=new File(filePath);
	String name=file.getName();
	String path=filePath.substring(0, filePath.lastIndexOf(name));
	String pdfName =name.substring(0,name.lastIndexOf("."))+".pdf";
	filePath=basePath+fixPath+path+URLEncoder.encode(name,"UTF-8");
	String pdfPath=path+URLEncoder.encode(pdfName,"UTF-8");

	FileMakerCtrl fmCtrl = new FileMakerCtrl(request);
	fmCtrl.setServerPage(request.getContextPath()+"/poserver.zz");
	WordDocument doc = new WordDocument();
	//禁用右击事件
	doc.setDisableWindowRightClick(true);
	
	String realPath = request.getSession().getServletContext().getRealPath("");
	fixPath = "instance/plugins/zhuozhengsoft.com/pageoffice/war";
	realPath = realPath.substring(0, realPath.length() - fixPath.length());	
	String pdfRealPath="";
	if(dataPath == null || dataPath == ""){
		pdfRealPath=realPath+"modules/yigo2/Data/"+path;
	}else{
		pdfRealPath=dataPath+path;
	}
	pdfRealPath = pdfRealPath + pdfName;

	File pdfFile = new File(pdfRealPath);
	if (!pdfFile.exists()) {
		fmCtrl.setSaveFilePage("SaveMakerYigo.jsp?filePath=" + pdfPath + "&dataPath=" + dataPath);
	}
	fmCtrl.setWriter(doc);
	fmCtrl.setJsFunction_OnProgressComplete("OnProgressComplete()");
	fmCtrl.fillDocumentAsPDF(filePath, DocumentOpenType.Word, pdfPath);
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
