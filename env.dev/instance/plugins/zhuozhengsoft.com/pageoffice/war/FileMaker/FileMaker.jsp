<%@ page language="java"
	import="java.util.*,com.zhuozhengsoft.pageoffice.FileMakerCtrl, com.zhuozhengsoft.pageoffice.*, com.zhuozhengsoft.pageoffice.wordwriter.*"
	pageEncoding="gb2312"%>
<%@ taglib uri="http://java.pageoffice.cn" prefix="po"%>
<%
	FileMakerCtrl fmCtrl = new FileMakerCtrl(request);
	fmCtrl.setServerPage(request.getContextPath()+"/poserver.zz");
	String id = request.getParameter("id");
	
	if (id != null && id.length() > 0) {
		WordDocument doc = new WordDocument();
		//�����һ��¼�
		doc.setDisableWindowRightClick(true);
		//����������ֵ������������䵽ģ������Ӧ��λ��
		doc.openDataRegion("PO_company").setValue("����׿��־Զ������޹�˾  " + id);
		fmCtrl.setSaveFilePage("SaveMaker.jsp?id=" + id);
		fmCtrl.setWriter(doc);
		fmCtrl.setJsFunction_OnProgressComplete("OnProgressComplete()");
		fmCtrl.setFileTitle("newfilename.doc");
		fmCtrl.fillDocument("doc/template.doc", DocumentOpenType.Word);
	}
	fmCtrl.setTagId("FileMakerCtrl1"); //���б���
	//fmCtrl.setTagId("FileMakerCtrl1"); //���б���
%>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
	<head>

		<title>My JSP 'FileMaker.jsp' starting page</title>

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
		<div>
			<!--**************   ׿�� PageOffice �ͻ��˴��뿪ʼ    ************************-->

			<script language="javascript" type="text/javascript">
				function OnProgressComplete() {
					window.parent.myFunc(); //���ø�ҳ���js����
				}
			</script>
			<!--**************   ׿�� PageOffice �ͻ��˴������    ************************-->
			<po:FileMakerCtrl id="FileMakerCtrl1"/>
			
		</div>

	</body>
</html>
