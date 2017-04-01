<%@ page language="java"
	import="java.util.*, com.zhuozhengsoft.pageoffice.*"
	pageEncoding="gb2312"%>
<%@ taglib uri="http://java.pageoffice.cn" prefix="po"%>
<%
PageOfficeCtrl pocCtrl=new PageOfficeCtrl(request);
//设置服务器页面
pocCtrl.setServerPage(request.getContextPath()+"/poserver.zz");
//添加自定义按钮
pocCtrl.addCustomToolButton("保存", "Save()", 1);
pocCtrl.addCustomToolButton("另存为PDF文件", "SaveAsPDF()", 1);
//设置保存页面
pocCtrl.setSaveFilePage("SaveFile.jsp");
String fileName = "template.doc";
String pdfName = fileName.substring(0, fileName.length() - 4) + ".pdf";
//打开文件
pocCtrl.webOpen("doc/" + fileName, OpenModeType.docNormalEdit, "张佚名");
pocCtrl.setTagId("PageOfficeCtrl1");
%>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
	<head>
		<title>Word文件转换成PDF格式</title>
		<script type="text/javascript">
        //保存
        function Save() {
            document.getElementById("PageOfficeCtrl1").WebSave();
        }

        //另存为PDF文件
        function SaveAsPDF() {
            document.getElementById("PageOfficeCtrl1").WebSaveAsPDF();
            window.open("OpenPDF.jsp?fileName=<%=pdfName %>");
        }
    </script>
	</head>
	<body>
		<form id="form1">
			<div style="width: auto; height: 700px;">
				<po:PageOfficeCtrl id="PageOfficeCtrl1">
				</po:PageOfficeCtrl>
			</div>
		</form>
	</body>
</html>

