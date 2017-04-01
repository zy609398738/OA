<%@ page language="java"
	import="java.util.*,com.zhuozhengsoft.pageoffice.*,com.zhuozhengsoft.pageoffice.excelwriter.*"
	pageEncoding="gb2312"%>
<%@ taglib uri="http://java.pageoffice.cn" prefix="po"%>
<%
	PageOfficeCtrl poCtrl = new PageOfficeCtrl(request);
	//���÷�����ҳ��
	poCtrl.setServerPage(request.getContextPath()+"/poserver.zz");

	//����Workbook����
	Workbook workBook = new Workbook();
	//����Sheet����"Sheet1"�Ǵ򿪵�Excel��������
	Sheet sheet = workBook.openSheet("Sheet1");

	//����table��������table��������÷�Χ
	Table table = sheet.openTable("B4:F13");
	//����table������ύ���ƣ��Ա㱣��ҳ���ȡ�ύ������
	table.setSubmitName("Info");

	poCtrl.setWriter(workBook);
	//����Զ��尴ť
	poCtrl.addCustomToolButton("����", "Save", 1);
	//���ñ���ҳ��
	poCtrl.setSaveDataPage("SaveData.jsp");
	//��Word�ĵ�
	poCtrl.webOpen("doc/test.xls", OpenModeType.xlsSubmitForm, "������");
	poCtrl.setTagId("PageOfficeCtrl1");//���б���
%>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
	<head>
		<title>��򵥵��ύExcel�е�����</title>
		<script type="text/javascript">
	function Save() {
		document.getElementById("PageOfficeCtrl1").WebSave();
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
