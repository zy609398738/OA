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
	Table table = sheet.openTable("B4:D8");
	//����table������ύ���ƣ��Ա㱣��ҳ���ȡ�ύ������
	table.setSubmitName("Info");

	// ������Ӧ��Ԫ�����¼���js function
    poCtrl.setJsFunction_OnExcelCellClick("OnCellClick()");
    
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
		<title>��ӦExcel��Ԫ�����¼�</title>
		<script type="text/javascript">
			function Save() {
				document.getElementById("PageOfficeCtrl1").WebSave();
			}
			
			function OnCellClick(Celladdress, value, left, bottom) {
		            var i = 0;
		            while (i<5) {//����һ�е�5����Ԫ�񶼵���ѡ��Ի���
		                if (Celladdress == "$B$" + (4 + i)) {
		                    var strRet = document.getElementById("PageOfficeCtrl1").ShowHtmlModalDialog("select.jsp", "", "left=" + left + "px;top=" + bottom + "px;width=320px;height=230px;frame=no;");
		                    if (strRet != "") {
		                        return (strRet);
		                    }
		                    else {
		                        if ((value == undefined) || (value == ""))
		                            return " ";
		                        else
		                            return value;
		                    }
		                }
		                i++;
		            }
		        }
		</script>
	</head>
	<body>
		<form id="form1">
			��ʾ�����Excel��Ԫ�񵯳��Զ���Ի����Ч�����뿴ʵ���������еġ��������ơ�ֻ��ѡ���Ч����<br /><br />
			<div style="width: auto; height: 700px;">
				<po:PageOfficeCtrl id="PageOfficeCtrl1">
				</po:PageOfficeCtrl>
			</div>
		</form>
	</body>
</html>
