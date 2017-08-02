<%@ page
    language="java"
    import="java.util.*,java.io.*"
    pageEncoding="UTF-8"
%><%
    String ctxPath = request.getContextPath();
%><!DOCTYPE html>
<html>
	<head>
		<title>UrlRewriteFilter 测试/演示</title>
	</head>
	<body>
		<b>规则1测试: redirect</b>
		<a href="<%=ctxPath%>/cat/Persian">波斯猫</a>
		| <a href="<%=ctxPath%>/W/cat/Wildcat">野猫</a>
		<hr/>
		<b>规则2测试: forward</b>
		<a href="<%=ctxPath%>/dog/Siberian+husky">西伯利亚雪橇犬(哈士奇)</a>
		| <a href="<%=ctxPath%>/dog/Border+Collie">边境牧羊犬</a>
		<hr/>
		<h2>测试结果</h2>
	    <b>Cat</b>: <code><%=request.getParameter("cat")%></code>, 
	    <b>Dog</b>: <code><%=request.getParameter("dog")%></code>
	    <hr/>
		<a href="<%=ctxPath%>/rewrite-status" target="_rewrite-status">/rewrite-status 状态监控信息</a>
	</body>
</html>