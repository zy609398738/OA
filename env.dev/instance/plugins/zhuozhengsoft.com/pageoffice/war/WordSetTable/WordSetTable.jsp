<%@ page language="java"
	import="java.util.*,com.zhuozhengsoft.pageoffice.*,com.zhuozhengsoft.pageoffice.wordwriter.*"
	pageEncoding="gb2312"%>
<%@ taglib uri="http://java.pageoffice.cn" prefix="po"%>
<%
	//******************************׿��PageOffice�����ʹ��*******************************
	PageOfficeCtrl poCtrl1 = new PageOfficeCtrl(request);
	poCtrl1.setServerPage(request.getContextPath()+"/poserver.zz"); //���б���
	
	WordDocument doc = new WordDocument();
	//����������
	DataRegion dataRegion = doc.openDataRegion("PO_regTable");
	//��table��openTable(index)�����е�index����Word�ĵ���tableλ�õ���������1��ʼ
	Table table = dataRegion.openTable(1);
	
	//��table�еĵ�Ԫ��ֵ�� openCellRC(int,int)�еĲ����ֱ����ڼ��С��ڼ��У���1��ʼ
	table.openCellRC(3, 1).setValue("A��˾");
	table.openCellRC(3, 2).setValue("������");
	table.openCellRC(3, 3).setValue("����");
	
	//����һ�У�insertRowAfter�����еĲ����������ĸ���Ԫ���������һ������
	table.insertRowAfter(table.openCellRC(3, 3));
	
	table.openCellRC(4, 1).setValue("B��˾");
	table.openCellRC(4, 2).setValue("���۲�");
	table.openCellRC(4, 3).setValue("����");
	
	poCtrl1.setWriter(doc);
	//���ز˵���
	poCtrl1.setMenubar(false);
	//�����Զ��幤����
	poCtrl1.setCustomToolbar(false);
	//���ļ�
	poCtrl1.webOpen("doc/test.doc", OpenModeType.docNormalEdit, "����");
	poCtrl1.setTagId("PageOfficeCtrl1"); //���б���
%>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
  <head>
    <title>�򵥵ĸ�Word�ĵ��е�Table��ֵ</title>
    
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
    <div style=" width:auto; height:700px;">
        <po:PageOfficeCtrl id ="PageOfficeCtrl1">
        </po:PageOfficeCtrl>
    </div>
  </body>
</html>
