<%@ page language="java" import="java.util.*,java.text.SimpleDateFormat" pageEncoding="gb2312"%>
<%@ page
	import="com.zhuozhengsoft.pageoffice.*,com.zhuozhengsoft.pageoffice.excelwriter.*"%>
<%@ taglib uri="http://java.pageoffice.cn" prefix="po"%>
<%
	PageOfficeCtrl poCtrl = new PageOfficeCtrl(request);
	poCtrl.addCustomToolButton("�����ļ�", "importData()", 5);
	poCtrl.addCustomToolButton("�ύ����", "submitData()", 1);
	Workbook wb = new Workbook();
        Sheet sheet = wb.openSheet("Sheet1");
	poCtrl.setWriter(wb);

	poCtrl.setServerPage(request.getContextPath()+"/poserver.zz");
	poCtrl.setSaveDataPage("SaveData.jsp");
	poCtrl.setTagId("PageOfficeCtrl1");
%>


<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
  <head>

    <title>����Excel�ļ����ύ����</title>
	<meta http-equiv="pragma" content="no-cache">
	<meta http-equiv="cache-control" content="no-cache">
	<meta http-equiv="expires" content="0">    
	<meta http-equiv="keywords" content="keyword1,keyword2,keyword3">
	<meta http-equiv="description" content="This is my page">
	<!--
	<link rel="stylesheet" type="text/css" href="styles.css">
	-->
  </head>
  		<script type="text/javascript">
                   function importData() {
                   
                      document.getElementById("PageOfficeCtrl1").ExcelImportDialog();
                }

                  function submitData() {
                       document.getElementById("PageOfficeCtrl1").WebSave();

               }
              </script>
 <body>

                 <div style="color:Red">�뵼�롰/Samples/ImportExcelData���µ�ImportExcel.xls�ĵ��鿴��ʾЧ����</div>
		<div style="width: auto; height: 600px;">
			<po:PageOfficeCtrl id="PageOfficeCtrl1"></po:PageOfficeCtrl>
		</div>

	</body>
</html>
