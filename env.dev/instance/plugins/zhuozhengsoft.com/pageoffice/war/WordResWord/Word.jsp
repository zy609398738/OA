<%@ page language="java"
	import="java.util.*,com.zhuozhengsoft.pageoffice.*,com.zhuozhengsoft.pageoffice.wordwriter.*"
	pageEncoding="gb2312"%>
<%@ taglib uri="http://java.pageoffice.cn" prefix="po"%>
<%
	//******************************׿��PageOffice�����ʹ��*******************************
	PageOfficeCtrl poCtrl1 = new PageOfficeCtrl(request);
	poCtrl1.setServerPage(request.getContextPath()+"/poserver.zz"); //���б���

	WordDocument worddoc = new WordDocument();
	//����Ҫ����word�ļ���λ���ֶ�������ǩ,��ǩ�����ԡ�PO_��Ϊǰ׺
	//��DataRegion��ֵ,ֵ����ʽΪ��"[word]word�ļ�·��[/word]��[excel]excel�ļ�·��[/excel]��[image]ͼƬ·��[/image]"
	DataRegion data1 = worddoc.openDataRegion("PO_p1");
	data1.setValue("[word]doc/1.doc[/word]");
	DataRegion data2 = worddoc.openDataRegion("PO_p2");
	data2.setValue("[word]doc/2.doc[/word]");
	DataRegion data3 = worddoc.openDataRegion("PO_p3");
	data3.setValue("[word]doc/3.doc[/word]");

	poCtrl1.setWriter(worddoc);
	poCtrl1.setCaption("��ʾ����̨��̲���Word�ļ�����������");

	//���ز˵���
	poCtrl1.setMenubar(false);
	//�����Զ��幤����
	poCtrl1.setCustomToolbar(false);

	poCtrl1.webOpen("doc/test.doc", OpenModeType.docNormalEdit, "����");
	poCtrl1.setTagId("PageOfficeCtrl1"); //���б���
%>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
	<head>
		<title>��̨��̲���Word�ļ�����������</title>
	</head>
	<body>
		<div style="font-size: 12px; line-height: 20px; border-bottom: dotted 1px #ccc; border-top: dotted 1px #ccc;
        padding: 5px;">
        �ؼ����룺<span style="background-color: Yellow;"> <br />DataRegion dataRegion
            = worddoc.openDataRegion("PO_��ͷ����ǩ����");
            <br />
            dataRegion.setValue("[word]doc/1.doc[/word]");</span><br />
    </div>
		<br />
		<form id="form1">
			<div style="width: auto; height: 700px;">
				<!--**************   PageOffice �ͻ��˴��뿪ʼ    ************************-->
				<po:PageOfficeCtrl id="PageOfficeCtrl1">
				</po:PageOfficeCtrl>
				<!--**************   PageOffice �ͻ��˴������    ************************-->
			</div>
		</form>
	</body>
</html>