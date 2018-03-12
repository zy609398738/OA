<%@ page language="java" 
	import="com.zhuozhengsoft.pageoffice.*,java.util.*,java.io.*,javax.servlet.*,javax.servlet.http.*,java.net.*" 
	pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.pageoffice.cn" prefix="po" %>

<%
String filePath =request.getParameter("filePath");
String dataPath =request.getParameter("dataPath");
filePath = filePath.replaceAll("\\\\","/");
File file=new File(filePath);
String name=file.getName();
String path=filePath.substring(0, filePath.lastIndexOf(name));
filePath=path+URLEncoder.encode(name,"UTF-8");

String qrString=request.getParameter("qrString");
qrString=URLEncoder.encode(qrString,"UTF-8");
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
			window.location.href="InsertDeCode2PDF.jsp?filePath=<%=filePath%>&qrString=<%=qrString %>&dataPath=<%=dataPath %>";
        };
        function ConvertFiles() {
            document.getElementById("iframe1").src = "FileMakerPDFYigo.jsp?filePath=<%=filePath%>&dataPath=<%=dataPath %>";
        }
		ConvertFiles();
    </script>
</body>
</html>