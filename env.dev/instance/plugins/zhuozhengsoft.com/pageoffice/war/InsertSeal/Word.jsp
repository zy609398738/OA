<%@ page language="java"
	import="java.util.*,com.zhuozhengsoft.pageoffice.*,com.zhuozhengsoft.pageoffice.wordwriter.*"
	pageEncoding="gb2312"%>
<%@ taglib uri="http://java.pageoffice.cn" prefix="po"%>
<%
//******************************׿��PageOffice�����ʹ��*******************************
	PageOfficeCtrl poCtrl1 = new PageOfficeCtrl(request);
	poCtrl1.setServerPage(request.getContextPath()+"/poserver.zz"); //���б���
	//���ز˵���
	poCtrl1.setMenubar(false);
	//����Զ��尴ť
	poCtrl1.addCustomToolButton("�Ӹ�ӡ��", "InsertSeal()", 2);
    poCtrl1.addCustomToolButton("ǩ��", "AddHandSign()", 3);
    poCtrl1.addCustomToolButton("��֤ӡ��", "VerifySeal()", 5);
    poCtrl1.addCustomToolButton("�޸�����", "ChangePsw()", 0);
	poCtrl1.webOpen("doc/template.doc", OpenModeType.docNormalEdit, "����");
	poCtrl1.setTagId("PageOfficeCtrl1"); //���б���	
%>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
  <head>
    <title>����ӡ��</title>
    
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
  <div style="font-size: 12px; line-height: 20px; border-bottom: dotted 1px #ccc; border-top: dotted 1px #ccc;
        padding: 5px;">
        <span style="color: red;">����˵����</span>�㡰����ӡ�¡���ť���ɣ�����ӡ��ʱ���û���Ϊ����־������Ĭ��Ϊ��111111��<br />
        �ؼ����룺���Ҽ���ѡ�񡰲鿴Դ�ļ�������js����<span style="background-color: Yellow;">InsertSeal()</span>
        <p>��� <a href="../adminseal.do">����ӡ�¼��׹���ƽ̨</a> ��ӡ�ɾ��ӡ�¡�����Ա:admin ����:111111</p>
    </div>
    <br />
   <div style=" width:auto; height:700px;">
   <!-- *********************************PageOffice�����ʹ��************************************ -->
   <script type="text/javascript">
            function InsertSeal() {
                try {
                    document.getElementById("PageOfficeCtrl1").ZoomSeal.AddSeal();
                }
                catch (e) { }
            }
            function AddHandSign() {
                document.getElementById("PageOfficeCtrl1").ZoomSeal.AddHandSign();
            }
            function VerifySeal() {
                document.getElementById("PageOfficeCtrl1").ZoomSeal.VerifySeal();
            }
            function ChangePsw() {
                document.getElementById("PageOfficeCtrl1").ZoomSeal.ShowSettingsBox();
            }
    </script>
        <po:PageOfficeCtrl id="PageOfficeCtrl1">
        </po:PageOfficeCtrl>
     <!-- *********************************PageOffice�����ʹ��************************************ -->
    </div>
  </body>
</html>
