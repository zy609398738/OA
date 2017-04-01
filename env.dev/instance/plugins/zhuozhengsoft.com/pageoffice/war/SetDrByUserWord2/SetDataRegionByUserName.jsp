<%@ page language="java" import="java.util.*" pageEncoding="gb2312"%>
<%@page
	import="com.zhuozhengsoft.pageoffice.*,com.zhuozhengsoft.pageoffice.wordwriter.*"%>
<%@ taglib uri="http://java.pageoffice.cn" prefix="po"%>
<%
	String userName = request.getParameter("userName");
	//***************************׿��PageOffice�����ʹ��********************************
	WordDocument doc = new WordDocument();
	//����������
	DataRegion d1 = doc.openDataRegion("PO_com1");
	DataRegion d2 = doc.openDataRegion("PO_com2");

	//����������ֵ
	d1.setValue("[word]doc/content1.doc[/word]");
	d2.setValue("[word]doc/content2.doc[/word]");

	//��Ҫ�������������ݴ����ļ��У�������������ԡ�setSubmitAsFile��ֵΪtrue
	d1.setSubmitAsFile(true);
	d2.setSubmitAsFile(true);

	//���ݵ�¼�û���������������ɱ༭��
	//�׿ͻ���zhangsan��¼��
	if (userName.equals("zhangsan")) {
		d1.setEditing(true);
		d2.setEditing(false);
	}
	//�ҿͻ���lisi��¼��
	else {
		d2.setEditing(true);
		d1.setEditing(false);
	}

	PageOfficeCtrl poCtrl = new PageOfficeCtrl(request);
	poCtrl.setWriter(doc);

	//����Զ��尴ť
	poCtrl.addCustomToolButton("����", "Save", 1);
	poCtrl.addCustomToolButton("ȫ��/��ԭ", "IsFullScreen", 4);
	//���÷�����ҳ��
	poCtrl.setServerPage(request.getContextPath()+"/poserver.zz"); //���б���
	//���ñ���ҳ
	poCtrl.setSaveDataPage("SaveData.jsp?userName=" + userName);
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

