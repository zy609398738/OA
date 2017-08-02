<%@ page language="java" import="java.util.*,java.net.*,java.io.*"
	contentType="text/html; charset=UTF-8"%>
<%@ page
	import="com.zhuozhengsoft.pageoffice.*,com.zhuozhengsoft.pageoffice.wordwriter.*,com.itextpdf.*,com.itextpdf.text.*,com.itextpdf.text.pdf.*,java.awt.Color,java.awt.image.BufferedImage,
	javax.imageio.ImageIO,com.google.zxing.*,com.google.zxing.common.BitMatrix,com.google.zxing.qrcode.QRCodeWriter"%>
<%@ taglib uri="http://java.pageoffice.cn" prefix="po"%>
<%
	PDFCtrl poCtrl = new PDFCtrl(request);
	poCtrl.setServerPage(request.getContextPath()+"/poserver.zz"); 
	String realPath = request.getSession().getServletContext().getRealPath("");
	String fixPath = "instance/plugins/zhuozhengsoft.com/pageoffice/war";
	realPath = realPath.substring(0, realPath.length() - fixPath.length());
	String filePath=request.getParameter("filePath");
	String pdfFilePath=filePath;
	String fileName =request.getParameter("fileName");
	filePath = realPath + "modules/yigo2/Data/" + filePath;
	filePath = filePath.replaceAll("/", "\\\\");
	String pdfPath=filePath.substring(0,filePath.length()-fileName.length());
	String pdfName = fileName.substring(0, fileName.lastIndexOf(".")) + ".pdf";
	String pdfRealPath=pdfPath+pdfName;
	String qrString=request.getParameter("qrString");

	
	String pdfPate = filePath;
	pdfPate=pdfPate.substring(0,pdfPate.lastIndexOf("."));
	pdfPate=pdfPate+"_AddImage.pdf";
	
	File file = new File(pdfPate);
	if(!file.exists()){
	Map<EncodeHintType, Object> hints = new HashMap<EncodeHintType, Object>();
	hints.put(EncodeHintType.MARGIN, 0);
	BitMatrix bitMatrix = new QRCodeWriter().encode(qrString, BarcodeFormat.QR_CODE, 256, 256, hints);
	int width = bitMatrix.getWidth();
	int height = bitMatrix.getHeight();
	BufferedImage image = new BufferedImage(width, height, BufferedImage.TYPE_INT_ARGB);
		for (int x = 0; x < width; x++) {
			for (int y = 0; y < height; y++) {
				image.setRGB(x, y, bitMatrix.get(x, y) == true ? Color.BLACK.getRGB() : Color.WHITE.getRGB());
			}
		}
		
	String QRPath=pdfFilePath.substring(0, pdfFilePath.lastIndexOf("/"));
	ImageIO.write(image, "png", new File("../../modules/yigo2/Data/"+QRPath+"/QRCode.png"));
	
	String imageName=pdfPath+"/QRCode.png";
	if(imageName!=null && imageName.length()>0){	
		PdfReader reader = new PdfReader(pdfRealPath);
		PdfStamper stamp = new PdfStamper(reader, new FileOutputStream(pdfPate));
		Image img = Image.getInstance(imageName);
		int n = reader.getNumberOfPages();
		Document document = new Document(reader.getPageSize(n)); 
		float docWidth = document.getPageSize().getWidth(); 
		docWidth = docWidth - img.getWidth()+150; 
		img.setAbsolutePosition(docWidth,50);
		img.scaleAbsolute(50, 50);
		PdfContentByte under = stamp.getOverContent(n);
		under.addImage(img);
		stamp.close();
		reader.close();
		pdfRealPath=pdfPate;
	}
	
	poCtrl.addCustomToolButton("隐藏/显示书签", "SetBookmarks", 0);
	poCtrl.addCustomToolButton("实际大小", "SetPageReal", 16);
	poCtrl.addCustomToolButton("适合页面", "SetPageFit", 17);
	poCtrl.addCustomToolButton("适合宽度", "SetPageWidth", 18);
	poCtrl.addCustomToolButton("首页", "FirstPage()", 8);
	poCtrl.addCustomToolButton("末页", "LastPage", 11);
	poCtrl.setServerPage(request.getContextPath() + "/poserver.zz");
	String urlEncode = URLEncoder.encode(fileName, "UTF-8");
	poCtrl.webOpen(pdfRealPath);
	poCtrl.setTagId("PDFCtrl1");
	}else{
	poCtrl.addCustomToolButton("隐藏/显示书签", "SetBookmarks", 0);
	poCtrl.addCustomToolButton("实际大小", "SetPageReal", 16);
	poCtrl.addCustomToolButton("适合页面", "SetPageFit", 17);
	poCtrl.addCustomToolButton("适合宽度", "SetPageWidth", 18);
	poCtrl.addCustomToolButton("首页", "FirstPage()", 8);
	poCtrl.addCustomToolButton("末页", "LastPage", 11);
	poCtrl.setServerPage(request.getContextPath() + "/poserver.zz");
	String urlEncode = URLEncoder.encode(fileName, "UTF-8");
	poCtrl.webOpen(pdfPate);
	poCtrl.setTagId("PDFCtrl1");}
	
%>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
<head>
<base href="<%=pdfPath+pdfName%>">

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
