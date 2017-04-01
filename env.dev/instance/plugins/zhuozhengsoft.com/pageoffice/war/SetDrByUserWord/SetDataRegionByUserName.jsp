<%@ page language="java" import="java.util.*" pageEncoding="gb2312"%>
<%@page
	import="com.zhuozhengsoft.pageoffice.*,com.zhuozhengsoft.pageoffice.wordwriter.*"%>
<%@ taglib uri="http://java.pageoffice.cn" prefix="po"%>
<%
	String userName = request.getParameter("userName");
	//***************************׿��PageOffice�����ʹ��********************************
	WordDocument doc = new WordDocument();
	//����������
	DataRegion dTitle = doc.openDataRegion("PO_title");
	//����������ֵ
	dTitle.setValue("ĳ��˾�ڶ����Ȳ�������");
	//������������ɱ༭��
	dTitle.setEditing(false);//�������򲻿ɱ༭

	DataRegion dA1 = doc.openDataRegion("PO_A_pro1");
	DataRegion dA2 = doc.openDataRegion("PO_A_pro2");
	DataRegion dB1 = doc.openDataRegion("PO_B_pro1");
	DataRegion dB2 = doc.openDataRegion("PO_B_pro2");

	//���ݵ�¼�û���������������ɱ༭��
	//A���ž����¼��
	if (userName.equals("zhangsan")) {
		userName = "A���ž���";
		dA1.setEditing(true);
		dA2.setEditing(true);
		dB1.setEditing(false);
		dB2.setEditing(false);
	}
	//B���ž����¼��
	else {
		userName = "B���ž���";
		dB1.setEditing(true);
		dB2.setEditing(true);
		dA1.setEditing(false);
		dA2.setEditing(false);
	}

	PageOfficeCtrl poCtrl = new PageOfficeCtrl(request);
	poCtrl.setWriter(doc);

	//����Զ��尴ť
	poCtrl.addCustomToolButton("����", "Save", 1);
	poCtrl.addCustomToolButton("ȫ��/��ԭ", "IsFullScreen", 4);
	//���÷�����ҳ��
	poCtrl.setServerPage(request.getContextPath()+"/poserver.zz"); //���б���

	//���ñ���ҳ
	poCtrl.setSaveFilePage("SaveFile.jsp");
	
	poCtrl.setMenubar(false);
	//�����ĵ��򿪷�ʽ
	poCtrl.webOpen("doc/test.doc", OpenModeType.docSubmitForm, userName);
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
					<span style="color: Red;"><%=userName%></span>
				</div>

				<script type="text/javascript">
	//����ҳ��
	function Save() {
		document.getElementById("PageOfficeCtrl1").WebSave();
	}

	//ȫ��/��ԭ
	function IsFullScreen() {
		document.getElementById("PageOfficeCtrl1").FullScreen = !document
				.getElementById("PageOfficeCtrl1").FullScreen;
	}
</script>

				<!--**************   ׿�� PageOffice��� ************************-->
				<po:PageOfficeCtrl id="PageOfficeCtrl1">
				</po:PageOfficeCtrl>
			</div>
		</div>

	</body>
</html>

