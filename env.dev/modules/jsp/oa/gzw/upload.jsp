<%@ page language="java" import="java.util.*" pageEncoding="UTF-8" contentType="text/html; charset=UTF-8"%>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
	<head>
		<title>文件上传</title>
		<style>
			.uploatfy-block{margin:0px auto;border:1px solid #91B0D7;}		
		</style>
		<script>
			var PATH = '<%=request.getContextPath()%>';
			var REFID = '<%=request.getParameter("refID")%>';
			var ROOTPATH = '<%=request.getParameter("rootPath")%>';
			var RELATIVEPATH = '<%=request.getParameter("relativePath")%>';
			var ISEDIT = '<%=request.getParameter("isEdit")%>';
			uploadObj.initUpload('.uploatfy-block', PATH, ROOTPATH, RELATIVEPATH, REFID, ISEDIT);
		</script>
	</head>
	<body>
		<div class="uploatfy-block">
		</div>
	</body>
</html>
