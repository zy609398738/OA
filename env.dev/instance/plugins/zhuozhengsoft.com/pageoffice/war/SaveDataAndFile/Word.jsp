<%@ page language="java"
	import="java.util.*,com.zhuozhengsoft.pageoffice.*,com.zhuozhengsoft.pageoffice.wordwriter.*,java.awt.*"
	pageEncoding="gb2312"%>
<%@ taglib uri="http://java.pageoffice.cn" prefix="po"%>
<%
	PageOfficeCtrl poCtrl = new PageOfficeCtrl(request);
	//���÷�����ҳ��
	poCtrl.setServerPage(request.getContextPath()+"/poserver.zz");
	WordDocument wordDoc = new WordDocument();
	//����������openDataRegion�����Ĳ�������Word�ĵ��е���ǩ����
	DataRegion dataRegion1 = wordDoc.openDataRegion("PO_userName");
	//����DataRegion�Ŀɱ༭��
	dataRegion1.setEditing(true);
	DataRegion dataRegion2 = wordDoc.openDataRegion("PO_deptName");
        dataRegion2.setEditing(true);
	poCtrl.setWriter(wordDoc);

	//����Զ��尴ť
	poCtrl.addCustomToolButton("����", "Save", 1);
	//���ñ������ݵ�ҳ��
	poCtrl.setSaveDataPage("SaveData.jsp");
       //���ñ����ĵ���ҳ��
	poCtrl.setSaveFilePage("SaveFile.jsp");
	//��Word�ĵ�,����Ҫͬʱ�������ݺͱ����ĵ�ʱ,OpenModeType������docSubmitFormģʽ��
	poCtrl.webOpen("doc/test.doc", OpenModeType.docSubmitForm, "������");
	poCtrl.setTagId("PageOfficeCtrl1");//���б���
%>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
	<head>
		<title>�����ĵ���ָ��λ�õ����ݵ�ͬʱҲ������ĵ�</title>
		<script type="text/javascript">
	        function Save() {
		    document.getElementById("PageOfficeCtrl1").WebSave();
	        }
</script>
	</head>
	<body>
		<form id="form1">
			<div>
				<span style="color: Red; font-size: 14px;">�����빫˾���ơ����䡢���ŵ���Ϣ�󣬵����������ϵı��水ť</span>
				<br />
				<span style="color: Red; font-size: 14px;">�����빫˾���ƣ�</span>
				<input id="txtName" name="txtCompany" type="text" />
				<br />
			</div>
			<div style="width: auto; height: 700px;">
				<po:PageOfficeCtrl id="PageOfficeCtrl1">
				</po:PageOfficeCtrl>
			</div>
		</form>
	</body>
</html>
