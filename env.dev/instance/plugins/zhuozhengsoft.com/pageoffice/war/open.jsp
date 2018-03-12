<%@ page language="java" 
	import="com.zhuozhengsoft.pageoffice.*,java.util.*,java.io.*,javax.servlet.*,javax.servlet.http.*,java.net.*" 
	pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.pageoffice.cn" prefix="po" %>
<%
String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+"/";
String rootUrl =basePath+"pageoffice/"+request.getParameter("url");
String filePath = request.getParameter("filePath");
filePath = URLEncoder.encode(filePath,"UTF-8");
String fileName = request.getParameter("fileName");
fileName = URLEncoder.encode(fileName,"UTF-8");
String qrString=request.getParameter("qrString");
String dataPath = request.getParameter("dataPath");
String operatorID = request.getParameter("operatorID");
%>

<html>
  <head>
  <meta http-equiv="pragma" content="no-cache">
	<meta http-equiv="cache-control" content="no-cache">
	<meta http-equiv="expires" content="0">    
	<meta http-equiv="keywords" content="keyword1,keyword2,keyword3">
	<meta http-equiv="description" content="This is my page">
	<script type="text/javascript" src="jquery.min.js"></script>
    <script type="text/javascript" src="pageoffice.js" id="po_js_main"></script>
	
  </head>
  
  <body onload="open()">
  <script language="javascript" type="text/javascript">
		function isIE(){
			if(!!window.ActiveXObject || "ActiveXObject" in window)
				return true;
			else
		return false;
		}
		function open(){
			if(!isIE()){
				POBrowser.openWindowModeless('<%=rootUrl%>?filePath=<%=filePath%>&fileName=<%=fileName%>&qrString=<%=qrString%>&dataPath=<%=dataPath%>&operatorID=<%=operatorID%>');
				//setTimeout(function(){
					//var form = parent.YIUI.FormStack.getForm(parent.formID - 1);
					//form.close();	
					//}, 500);
				}
			else{
				window.location="<%=rootUrl%>?filePath=<%=filePath%>&fileName=<%=fileName%>&qrString=<%=qrString%>&dataPath=<%=dataPath%>&operatorID=<%=operatorID%>";
			}
		}
		
  </script>
    
  </body>
</html>