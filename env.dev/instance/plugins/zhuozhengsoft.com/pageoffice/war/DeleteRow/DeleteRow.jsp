<%@ page language="java"
	import="java.util.*,com.zhuozhengsoft.pageoffice.*,com.zhuozhengsoft.pageoffice.wordwriter.*"
	pageEncoding="gb2312"%>
<%@ taglib uri="http://java.pageoffice.cn" prefix="po"%>
<%
	//******************************׿��PageOffice�����ʹ��*******************************
	PageOfficeCtrl poCtrl1 = new PageOfficeCtrl(request);
	poCtrl1.setServerPage(request.getContextPath()+"/poserver.zz"); //���б���
	//���ز˵���
	poCtrl1.setMenubar(false);
	poCtrl1.addCustomToolButton("ɾ����","DeleteRow()",1);
	
	poCtrl1.webOpen("doc/deleteWord.doc", OpenModeType.docNormalEdit, "����");
	poCtrl1.setTagId("PageOfficeCtrl1"); //���б���	
%>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
	<head>

		<title>ɾ�����������</title>

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
		<!-- ***************************PageOffice����ͻ���Js����******************************** -->
	<script type="text/javascript">
    //ɾ��word����й��������
//        function DeleteRow() {
//            var appObj = document.getElementById("PageOfficeCtrl1").Document.Application;

//            appObj.Selection.HomeKey(10);
//            appObj.Selection.EndKey(10, true);
//            appObj.Selection.Cells.Delete(2);
//            appObj.Selection.TypeBackspace();
        //        }
        //ɾ��word����й�������У�����������¾���ʹ��
        function DeleteRow() {
            var mac = "Function myfunc()" + " \r\n"
                    + "Application.Selection.HomeKey Unit:=wdLine " + " \r\n"
                    + "Application.Selection.EndKey Unit:=wdLine, Extend:=true " + " \r\n"
                    + "Application.Selection.Cells.Delete ShiftCells:=wdDeleteCellsEntireRow " + " \r\n" 
                    + "Application.Selection.TypeBackspace " + " \r\n" 
                    + "End Function " + " \r\n";
            document.getElementById("PageOfficeCtrl1").RunMacro("myfunc", mac);
        } 
	</script>
		<div style="width:auto; height:700px; ">
		<po:PageOfficeCtrl id="PageOfficeCtrl1"></po:PageOfficeCtrl>
		</div>
		
	</body>
</html>
