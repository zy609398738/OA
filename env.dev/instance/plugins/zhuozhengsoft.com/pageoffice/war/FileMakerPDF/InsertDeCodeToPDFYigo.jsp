<%@ page language="java" import="java.util.*,java.net.*,java.io.*"
	contentType="text/html; charset=UTF-8"%>
<%@ page
	import="com.zhuozhengsoft.pageoffice.*,com.zhuozhengsoft.pageoffice.wordwriter.*,com.itextpdf.*,com.itextpdf.text.*,com.itextpdf.text.pdf.*,java.awt.Color,java.awt.image.BufferedImage,
	javax.imageio.ImageIO,com.google.zxing.*,com.google.zxing.common.BitMatrix,com.google.zxing.oned.Code39Writer"%>
<%@ taglib uri="http://java.pageoffice.cn" prefix="po"%>
<%
	String realPath = request.getSession().getServletContext().getRealPath("");
	String fixPath = "instance/plugins/zhuozhengsoft.com/pageoffice/war";
	realPath = realPath.substring(0, realPath.length() - fixPath.length());
	String filePath = request.getParameter("filePath");
	String dataPath = request.getParameter("dataPath");
	filePath = filePath.replaceAll("\\\\", "/");
	File file = new File(filePath);
	String name = file.getName();
	String path = filePath.substring(0, filePath.lastIndexOf(name));
	String nameFix = name.substring(0, name.lastIndexOf("."));
	String pdfName = nameFix + ".pdf";
	String pdfPath = "";
	if (dataPath == null || dataPath == "") {
		pdfPath = realPath + "modules/yigo2/Data/" + path;
	} else {
		pdfPath = dataPath + path;
	}

	String pdfRealPath = pdfPath + pdfName;
	String qrString = request.getParameter("qrString");
	String imagePdfPath = nameFix + "_AddImage.pdf";
	String pdfPate = pdfPath + imagePdfPath;
	File pdfFile = new File(pdfPate);
	if (!pdfFile.exists()) {
		Map<EncodeHintType, Object> hints = new HashMap<EncodeHintType, Object>();
		hints.put(EncodeHintType.MARGIN, 0);
		BitMatrix bitMatrix = new MultiFormatWriter().encode(qrString, BarcodeFormat.CODE_39, 105, 50, hints);
		int width = bitMatrix.getWidth();
		int height = bitMatrix.getHeight();
		BufferedImage image = new BufferedImage(width, height, BufferedImage.TYPE_INT_ARGB);
		for (int x = 0; x < width; x++) {
			for (int y = 0; y < height; y++) {
				image.setRGB(x, y, bitMatrix.get(x, y) == true ? Color.BLACK.getRGB() : Color.WHITE.getRGB());
			}
		}
		String QRPath = pdfPath + "DeCode.png";
		ImageIO.write(image, "png", new File(QRPath));
		if (QRPath != null && QRPath.length() > 0) {
			PdfReader reader = new PdfReader(pdfRealPath);
			PdfStamper stamp = new PdfStamper(reader, new FileOutputStream(pdfPate));
			Image img = Image.getInstance(QRPath);
			int n = reader.getNumberOfPages();
			for (int i = 1; i <= n; i++) {
				Document document = new Document(reader.getPageSize(n));
				float docWidth = document.getPageSize().getWidth();
				docWidth = docWidth - img.getWidth() - 50;
				img.setAbsolutePosition(docWidth, 30);
				img.scaleAbsolute(img.getWidth(), img.getHeight());
				PdfContentByte under = stamp.getOverContent(i);
				under.addImage(img);
			}
			stamp.close();
			reader.close();
		}
	}
	PDFCtrl poCtrl = new PDFCtrl(request);
	poCtrl.setServerPage(request.getContextPath() + "/poserver.zz");
	poCtrl.addCustomToolButton("隐藏/显示书签", "SetBookmarks", 0);
	poCtrl.addCustomToolButton("实际大小", "SetPageReal", 16);
	poCtrl.addCustomToolButton("适合页面", "SetPageFit", 17);
	poCtrl.addCustomToolButton("适合宽度", "SetPageWidth", 18);
	poCtrl.addCustomToolButton("首页", "FirstPage()", 8);
	poCtrl.addCustomToolButton("末页", "LastPage", 11);
	String basePath = request.getScheme() + "://" + request.getServerName() + ":" + request.getServerPort()
			+ "/";
	fixPath = "yigo/a/cms2-yigo2-adapter/cms/view-yigo-file/";
	String urlEncode = URLEncoder.encode(imagePdfPath, "UTF-8");
	pdfPate = basePath + fixPath + path + urlEncode;
	poCtrl.webOpen(pdfPate);
	poCtrl.setTagId("PDFCtrl1");
%>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
<head>
<base href="<%=pdfPath + pdfName%>">

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
		var r = window.location.search.substr(1).match(reg); //匹配目标参数
		if (r != null)
			return unescape(r[2]);
		return null; //返回参数值
	}
</script>
</head>

<body>
	<div style="width: auto; height: auto;">
		<po:PDFCtrl id="PDFCtrl1" />
	</div>
</body>
</html>
