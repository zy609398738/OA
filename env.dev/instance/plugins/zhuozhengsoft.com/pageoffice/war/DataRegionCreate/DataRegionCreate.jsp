<%@ page language="java"
	import="java.util.*,com.zhuozhengsoft.pageoffice.*,com.zhuozhengsoft.pageoffice.wordwriter.*"
	pageEncoding="gb2312"%>
<%@ taglib uri="http://java.pageoffice.cn" prefix="po"%>
<%
	PageOfficeCtrl poCtrl1 = new PageOfficeCtrl(request);
	poCtrl1.setServerPage(request.getContextPath()+"/poserver.zz"); //���б���
	WordDocument doc=new WordDocument();
	//������������createDataRegion �����е����������ֱ�����½��������������ơ�������������Ҫ�����λ�á���
	//�����½�����������������������������ơ�������ǰWord�ĵ�����������������ǩ�����������ĵ����ͷ����ʱ����ô����������Ϊ��[home]��
	//�������ĵ��Ľ�β�������������������������Ϊ��[end]��
	DataRegion dataRegion1 =  doc.createDataRegion("reg1",DataRegionInsertType.After,"[home]");
	//���ô�������������Ŀɱ༭��
	dataRegion1.setEditing(true);
	//����������ֵ
	dataRegion1.setValue("��һ����������\r\n");
	
	DataRegion dataRegion2 = doc.createDataRegion("reg2",DataRegionInsertType.After,"reg1");
	dataRegion2.setEditing(true);
	dataRegion2.setValue("�ڶ�����������");
	
	poCtrl1.setWriter(doc);
	//���ز˵���
	poCtrl1.setMenubar(false);
		//���ع�����
	poCtrl1.setCustomToolbar(false);
	//��Word�ļ�
	poCtrl1.webOpen("doc/test.doc", OpenModeType.docNormalEdit,"����");
	poCtrl1.setTagId("PageOfficeCtrl1"); //���б���
%>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
	<head>
		<title>�½���������</title>

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
		<div style="width: auto; height: 700px;">
			<po:PageOfficeCtrl id="PageOfficeCtrl1"></po:PageOfficeCtrl>
		</div>
	</body>
</html>
