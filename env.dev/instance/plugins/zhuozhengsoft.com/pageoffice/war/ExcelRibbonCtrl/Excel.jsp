<%@ page language="java"
	import="java.util.*,com.zhuozhengsoft.pageoffice.*,com.zhuozhengsoft.pageoffice.excelwriter.*;"
	pageEncoding="gb2312"%>
<%@ taglib uri="http://java.pageoffice.cn" prefix="po"%>
<%
PageOfficeCtrl poCtrl=new PageOfficeCtrl(request);
//���÷�����ҳ��
poCtrl.setServerPage(request.getContextPath()+"/poserver.zz");
//����Զ��尴ť
poCtrl.addCustomToolButton("����","Save",1);
poCtrl.getRibbonBar().setTabVisible("TabHome", true);//��ʼ
poCtrl.getRibbonBar().setTabVisible("TabFormulas", false);//��ʽ
poCtrl.getRibbonBar().setTabVisible("TabInsert", false);//����
poCtrl.getRibbonBar().setTabVisible("TabData", false);//����
poCtrl.getRibbonBar().setTabVisible("TabReview", false);//����
poCtrl.getRibbonBar().setTabVisible("TabView", false);//��ͼ
poCtrl.getRibbonBar().setTabVisible("TabPageLayoutExcel", false);//ҳ�沼��

poCtrl.getRibbonBar().setSharedVisible("FileSave", false);//office�Դ��ı��水ť

poCtrl.getRibbonBar().setGroupVisible("GroupClipboard", false);//���������

//���ñ���ҳ��
//poCtrl.setSaveFilePage("SaveFile.jsp");
//��Word�ĵ�
poCtrl.webOpen("doc/test.xls",OpenModeType.xlsNormalEdit,"������");
poCtrl.setTagId("PageOfficeCtrl1");//���б���
%>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
  <head>
    <title>��򵥵Ĵ򿪱���Exce�ļ�</title>
</head>
<body>
    <script type="text/javascript">
        function Save() {
            document.getElementById("PageOfficeCtrl1").WebSave();
        }
    </script>
    <form id="form1">
    <div style=" width:100%; height:700px;">
	<div style="font-size:14px; line-height:20px; ">
	poCtrl.getRibbonBar().setTabVisible("TabHome",false);ʵ������Ribbon���еġ���ʼ���������.��"TabHome"Ϊ��������������,falseΪ���أ�trueΪ��ʾ��
	<br/>
	poCtrl.getRibbonBar().setSharedVisible("FileSave", false);ʵ������Ribbon���ٹ������еġ����桱��ť.��"FileSave"Ϊ��ť������,falseΪ���أ�trueΪ��ʾ��
	<br/>
	poCtrl.getRibbonBar().setGroupVisible("GroupClipboard", false);ʵ�����ء���ʼ����������еġ����а塱���.��"GroupClipboard"Ϊ����������,falseΪ���أ�trueΪ��ʾ��
	<br/>
	<span style="color:red">ע�⣺�˿����ǻ�ͬ��Ӱ�쵽�����ļ���ʱRibbon���еĸ������߰�ť����ʾ״̬�����ر����߱༭����ʱ������Ribbon��״̬�ָ�������</span>
	<br/><br/>
	</div>
        <po:PageOfficeCtrl id="PageOfficeCtrl1">
        </po:PageOfficeCtrl>
    </div>
    </form>
</body>
</html>
