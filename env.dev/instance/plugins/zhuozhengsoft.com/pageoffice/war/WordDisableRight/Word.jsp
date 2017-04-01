<%@ page language="java" 
	import="com.zhuozhengsoft.pageoffice.*,com.zhuozhengsoft.pageoffice.wordwriter.*,java.util.*,java.io.*,javax.servlet.*,javax.servlet.http.*" 
	pageEncoding="gb2312"%>
<%@ taglib uri="http://java.pageoffice.cn" prefix="po" %>
<%

	PageOfficeCtrl poCtrl1 = new PageOfficeCtrl(request);
	poCtrl1.setServerPage(request.getContextPath()+"/poserver.zz"); //此行必须
	poCtrl1.setSaveFilePage("SaveFile.jsp");//如要保存文件，此行必须
	poCtrl1.addCustomToolButton("保存", "Save()", 1);//添加自定义工具栏按钮

        WordDocument wordDoc = new WordDocument();
        wordDoc.setDisableWindowRightClick(true);//禁止word鼠标右键
        //wordDoc.setDisableWindowDoubleClick(true);//禁止word鼠标双击
	poCtrl1.setWriter(wordDoc);

	//打开文件
	poCtrl1.webOpen("doc/test.doc", OpenModeType.docNormalEdit, "张三");
	poCtrl1.setTagId("PageOfficeCtrl1"); //此行必须	 
%>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
  <head>
    
    <title>禁止Word文档中鼠标右键</title>
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
    	
    	
        <script type="text/javascript">
	    function Save() {
		document.getElementById("PageOfficeCtrl1").WebSave();
	    }
	</script>
    <div style="color:Red">打开Word文档后，鼠标右键，发现右键失效。</div>
    <po:PageOfficeCtrl id="PageOfficeCtrl1" />
  </body>
</html>
