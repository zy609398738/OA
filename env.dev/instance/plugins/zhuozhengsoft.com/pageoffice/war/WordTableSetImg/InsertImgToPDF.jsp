<%@ page language="java" import="java.util.*,java.net.*,java.io.*"
	contentType="text/html; charset=UTF-8"%>
<%@ page
	import="com.zhuozhengsoft.pageoffice.*,com.zhuozhengsoft.pageoffice.wordwriter.*,com.itextpdf.*,com.itextpdf.text.*,com.itextpdf.text.pdf.*"%>
<%@ taglib uri="http://java.pageoffice.cn" prefix="po"%>
<%
	PDFCtrl poCtrl = new PDFCtrl(request);
	poCtrl.setServerPage(request.getContextPath()+"/poserver.zz"); 
	String realPath = request.getSession().getServletContext().getRealPath("");
	String fixPath = "instance/plugins/zhuozhengsoft.com/pageoffice/war";
	realPath = realPath.substring(0, realPath.length() - fixPath.length());
	String fileName=request.getParameter("filePath");
	String filePath = fileName;
	filePath = realPath + "modules/yigo2/Data/" + filePath;
	//filePath = filePath.replaceAll("/", "\\\\");

	String pdfPate = filePath;
	pdfPate=pdfPate.substring(0,pdfPate.lastIndexOf("."));
	pdfPate=pdfPate+"_AddImage.pdf";
	
	String imageName=request.getParameter("imagePath");
	String savePath=request.getParameter("savePath");
	if(imageName!=null && imageName.length()>0){	
		PdfReader reader = new PdfReader(filePath);
		PdfStamper stamp = new PdfStamper(reader, new FileOutputStream(pdfPate));
		imageName = realPath + "modules/yigo2/Data/" + imageName;
		Image img = Image.getInstance(imageName);
		int n = reader.getNumberOfPages();
		Document document = new Document(reader.getPageSize(n)); 
		float width = document.getPageSize().getWidth(); 
		width = width - img.getWidth(); 
		img.setAbsolutePosition(width,50);
		img.scaleAbsolute(170, 170);
		PdfContentByte under = stamp.getOverContent(n);
		under.addImage(img);
		stamp.close();
		reader.close();
		filePath=pdfPate;
	}
	
	if(savePath!=null && savePath.length()>0){
		filePath = savePath;
		filePath = realPath + "modules/yigo2/Data/" + filePath;
		filePath = filePath.replaceAll("/", "\\\\");
		File file = new File(filePath);
		File file2 = new File(pdfPate);  //新文件
		if(file.exists() && file2.exists()){
			file.delete();
			file2.renameTo(file);
		}
	}

	poCtrl.addCustomToolButton("加盖签章", "addSeal", 5);
	poCtrl.addCustomToolButton("保存", "Save", 1);
	poCtrl.addCustomToolButton("隐藏/显示书签", "SetBookmarks", 0);
	poCtrl.addCustomToolButton("实际大小", "SetPageReal", 16);
	poCtrl.addCustomToolButton("适合页面", "SetPageFit", 17);
	poCtrl.addCustomToolButton("适合宽度", "SetPageWidth", 18);
	poCtrl.addCustomToolButton("首页", "FirstPage()", 8);
	poCtrl.addCustomToolButton("末页", "LastPage", 11);
	poCtrl.setServerPage(request.getContextPath() + "/poserver.zz");
	String urlEncode = URLEncoder.encode(fileName, "UTF-8");
	poCtrl.webOpen(filePath);
	poCtrl.setTagId("PDFCtrl1");
		
%>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
<head>
<base href="<%=filePath%>">

<title>在线打开PDF文件</title>
<meta http-equiv="pragma" content="no-cache">
<meta http-equiv="cache-control" content="no-cache">
<meta http-equiv="expires" content="0">
<meta http-equiv="keywords" content="keyword1,keyword2,keyword3">
<meta http-equiv="description" content="This is my page">
<!--
	<link rel="stylesheet" type="text/css" href="styles.css">
	-->
<script language="javascript" type="text/javascript">
	function addSeal(){
		var formID=getUrlParam('formID');
		var path=parent.YIUI.FormStack.getForm(formID).getComponent("Preview").value;
		if(path!=null){
			window.location.href=window.location.protocol+"//"+window.location.host+"/pageoffice/WordTableSetImg/InsertImgToPDF.jsp?filePath="+<%="\""+fileName+"\""%>+"&imagePath="+path;
		}
		
		
	}
	function SetBookmarks() {
		document.getElementById("PDFCtrl1").BookmarksVisible = !document
				.getElementById("PDFCtrl1").BookmarksVisible;
	}
	function SetPageReal() {
		document.getElementById("PDFCtrl1").SetPageFit(1);
	}
	function SetPageFit() {
		document.getElementById("PDFCtrl1").SetPageFit(2);
	}
	function FirstPage() {
		document.getElementById("PDFCtrl1").GoToFirstPage();
	}
	function SetPageWidth() {
		document.getElementById("PDFCtrl1").SetPageFit(3);
	}
	function LastPage() {
		document.getElementById("PDFCtrl1").GoToLastPage();
	}
	function Save() {
		window.location.href=window.location.protocol+"//"+window.location.host+"/pageoffice/WordTableSetImg/InsertImgToPDF.jsp?filePath="+<%="\""+fileName+"\""%>+"&savePath="+<%="\""+fileName+"\""%>;
	}
	//获取url中的参数
	function getUrlParam(name) {
		var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
		var r = window.location.search.substr(1).match(reg);  //匹配目标参数
		if (r != null) return unescape(r[2]); return null; //返回参数值
}
</script>
</head>

<body>
	<div style="width: auto; height: auto;">
		<po:PDFCtrl id="PDFCtrl1" />
	</div>
</body>
</html>
