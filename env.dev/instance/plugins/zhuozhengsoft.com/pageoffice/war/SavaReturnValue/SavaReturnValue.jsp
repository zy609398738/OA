<%@ page language="java"
	import="java.util.*,com.zhuozhengsoft.pageoffice.*,com.zhuozhengsoft.pageoffice.wordwriter.*"
	pageEncoding="gb2312"%>
<%@ taglib uri="http://java.pageoffice.cn" prefix="po"%>
<%
//******************************׿��PageOffice�����ʹ��*******************************
	//����PageOffice���������
	PageOfficeCtrl poCtrl1 = new PageOfficeCtrl(request);
	poCtrl1.setServerPage(request.getContextPath()+"/poserver.zz"); //���б���
	//����PageOfficeCtrl�ؼ��ı���������
	poCtrl1.setCaption("Word�ĵ�������ȡ����ֵ");
	//���ز˵���
	poCtrl1.setMenubar(false);
	//����Զ��尴ť
	poCtrl1.addCustomToolButton("����","Save()",1);
	poCtrl1.setSaveFilePage("SaveFile.jsp");
	//���ļ�
	poCtrl1.webOpen("doc/test.doc", OpenModeType.docNormalEdit, "����");
	poCtrl1.setTagId("PageOfficeCtrl1"); //���б���	
%>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
  <head>
       <title>Word�ĵ�������ȡ����ֵ</title>
    <script type="text/javascript">
        function Save() {
            document.getElementById("PageOfficeCtrl1").WebSave();
            //document.getElementById("PageOfficeCtrl1").CustomSaveResult��ȡ���Ǳ���ҳ��ķ���ֵ
            document.getElementById("PageOfficeCtrl1").Alert("����ɹ�������ֵΪ��" + document.getElementById("PageOfficeCtrl1").CustomSaveResult);
        }
 
    </script>
</head>
<body>
    <form id="form1">
    <div style=" font-size:small; color:Red;">
        <label>�����룺���Ҽ���ѡ�񡰲鿴Դ�ļ�������js������Save()</label>
        <br />document.getElementById("PageOfficeCtrl1").WebSave()//ִ�б������"
        <br/>document.getElementById("PageOfficeCtrl1").CustomSaveResult//��ȡ����ֵ����ҳ��SaveFile.jsp����fs.setCustomSaveResult("ok");����ķ���ֵ
        <br />
    </div>
    <div style=" width:auto; height:700px;">
        <po:PageOfficeCtrl id="PageOfficeCtrl1">
        </po:PageOfficeCtrl>
    </div>
    </form>
</body>
</html>
