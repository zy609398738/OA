<%@ page language="java" import="java.util.*" pageEncoding="gb2312"%>
<%@page import="com.zhuozhengsoft.pageoffice.*, com.zhuozhengsoft.pageoffice.excelwriter.*"%>
<%@ taglib uri="http://java.pageoffice.cn" prefix="po"%>
<%
		String userName=request.getParameter("userName");
 		//***************************׿��PageOffice�����ʹ��********************************
 		PageOfficeCtrl poCtrl = new PageOfficeCtrl(request);
 		
        Workbook wb = new Workbook();
        Sheet sheet = wb.openSheet("Sheet1");
        Table tableA = sheet.openTable("C4:D6");
        Table tableB = sheet.openTable("C7:D9");

        tableA.setSubmitName("tableA");
        tableB.setSubmitName("tableB");
		
		
        //���ݵ�¼�û���������������ɱ༭��
        String strInfo = "";
        
        //A���ž����¼��
        if (userName.equals("zhangsan"))
        {
        	strInfo = "A���ž�������ֻ�ܱ༭A���ŵĲ�Ʒ����";
            tableA.setReadOnly(false);
            tableB.setReadOnly(true);
        }
        //B���ž����¼��
        else
        {
        	strInfo = "B���ž�������ֻ�ܱ༭B���ŵĲ�Ʒ����";
            tableA.setReadOnly(true);
            tableB.setReadOnly(false);
        }

        poCtrl.setWriter(wb);

		poCtrl.setServerPage(request.getContextPath()+"/poserver.zz"); //���б���
        poCtrl.addCustomToolButton("����", "Save", 1);
        poCtrl.setSaveFilePage("SaveFile.jsp");
        poCtrl.webOpen("doc/test.xls",OpenModeType.xlsSubmitForm, userName);
        poCtrl.setTagId("PageOfficeCtrl1");
%>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
	<head>
		<meta http-equiv="Content-Type" content="text/html; charset=gb2312" />
		<title></title>
		<link href="images/csstg.css" rel="stylesheet" type="text/css" />
	</head>
	<body>


		<div id="content">
			<div id="textcontent" style="width: 1000px; height: 800px;">
				<div class="flow4">
					<a href="Default.jsp"> ���ص�¼ҳ</a>
					<strong>��ǰ�û���</strong>
					<span style="color: Red;"><%=strInfo %></span>
				</div>

				<script type="text/javascript">
	                //����ҳ��
	                function Save() {
	                    document.getElementById("PageOfficeCtrl1").WebSave();
	                }
	
	            </script>

				<!--**************   ׿�� PageOffice��� ************************-->
				<po:PageOfficeCtrl id="PageOfficeCtrl1"></po:PageOfficeCtrl>
			</div>
		</div>


	</body>
</html>