<%@ page language="java" import="java.util.*,java.net.*" pageEncoding="UTF-8"%>
<%@ page
	import="com.zhuozhengsoft.pageoffice.*,com.zhuozhengsoft.pageoffice.wordwriter.*"%>
<%@ taglib uri="http://java.pageoffice.cn" prefix="po"%>
<%
	PageOfficeCtrl poCtrl = new PageOfficeCtrl(request);
	String realPath = request.getSession().getServletContext().getRealPath("");
	String fixPath = "instance/plugins/zhuozhengsoft.com/pageoffice/war";
	realPath = realPath.substring(0, realPath.length() - fixPath.length());
	String fileName=request.getParameter("filePath");
	String dataPath =request.getParameter("datapath");
	String filePath = fileName;
	if (dataPath == null || dataPath == "") {
		filePath = realPath + "modules/yigo2/Data/" + filePath;
	} else {
		filePath = dataPath + filePath;
	}
	filePath = filePath.replaceAll("/", "\\\\");
	poCtrl.addCustomToolButton("加盖签章", "addSeal", 5);
	poCtrl.setOfficeToolbars(false);
	poCtrl.setServerPage(request.getContextPath() + "/poserver.zz");
	String urlEncode = URLEncoder.encode(fileName, "UTF-8");
	poCtrl.setSaveFilePage("SaveFile.jsp?filePath="+urlEncode+"&dataPath="+dataPath);
    poCtrl.addCustomToolButton("保存", "Save", 1);
	poCtrl.webOpen(filePath, OpenModeType.docNormalEdit, "张三");
	poCtrl.setTagId("PageOfficeCtrl1");
%>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
<head>
<base href="<%=filePath%>">

<title>Word中的Table的数据填充</title>
<meta http-equiv="pragma" content="no-cache">
<meta http-equiv="cache-control" content="no-cache">
<meta http-equiv="expires" content="0">
<meta http-equiv="keywords" content="keyword1,keyword2,keyword3">
<meta http-equiv="description" content="This is my page">
<!--
	<link rel="stylesheet" type="text/css" href="styles.css">
	-->
<script type="text/javascript">
	function addSeal() {
		var path=parent.$(".signature_QuerySeal").val();
		if(path!=null){
		var imagePath=window.location.protocol+"//"+window.location.host+"/yigo/a/cms2-yigo2-adapter/cms/view-yigo-file/"+path;
		
		document.getElementById("PageOfficeCtrl1").InsertWebImage( imagePath, true, 4 );
	}
	}
	function Save() {
                document.getElementById("PageOfficeCtrl1").WebSave();
            }
</script>
</head>

<body>
	<div style="width: auto; height:auto;">
		<po:PageOfficeCtrl id="PageOfficeCtrl1"></po:PageOfficeCtrl>
	</div>
</body>
</html>
