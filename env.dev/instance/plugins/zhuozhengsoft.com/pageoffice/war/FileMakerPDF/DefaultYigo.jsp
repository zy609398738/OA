<%@ page language="java" 
	import="com.zhuozhengsoft.pageoffice.*,java.util.*,java.io.*,javax.servlet.*,javax.servlet.http.*" 
	pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.pageoffice.cn" prefix="po" %>

<%
String realPath = request.getSession().getServletContext().getRealPath("");
String fixPath="instance/plugins/zhuozhengsoft.com/pageoffice/war";
realPath=realPath.substring(0,realPath.length()-fixPath.length());
String filePath =request.getParameter("filePath");
String pdfFilePath=filePath;
filePath=realPath+"modules/yigo2/Data/"+filePath;
filePath = filePath.replaceAll("/", "\\\\"); 
String fileName =request.getParameter("fileName");
String pdfPath=filePath.substring(0,filePath.length()-fileName.length());
String pdfRealPath=pdfFilePath.substring(0,pdfFilePath.length()-fileName.length());
String pdfName = fileName.substring(0, fileName.lastIndexOf(".")) + ".pdf";
String qrString=request.getParameter("QRString");
%>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
<head>
    <title></title>

</head>
<body>
    <form id="form1">
    <div style="width: 1px; height: 1px; overflow: hidden;">
        <iframe id="iframe1" name="iframe1" src=""></iframe>
    </div>
    </form>
    <script type="text/javascript">
        window.myFunc = function() {
            //document.getElementById("aDiv").style.display = "";
            //alert('转换完毕！');
			window.location.href="InsertQRCodeToPDFYigo.jsp?filePath=<%=pdfFilePath%>&pdfName=<%=pdfName%>&fileName=<%=fileName %>&qrString=<%=qrString %>";
        };
        function ConvertFiles() {
            document.getElementById("iframe1").src = "FileMakerPDFYigo.jsp?pdfFilePath=<%=pdfFilePath %>&pdfName=<%=pdfName %>&fileName=<%=fileName %>";
        }
		ConvertFiles();
    </script>
</body>
</html>