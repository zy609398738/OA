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
	poCtrl1.addCustomToolButton("��ȡwordѡ�е�����","getSelectionText",5);

	poCtrl1.webOpen("doc/test.doc", OpenModeType.docNormalEdit, "����");
	poCtrl1.setTagId("PageOfficeCtrl1"); //���б���	

%>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
  <head>
    <title>��ʾ��js��ȡwordѡ�е�����</title>

    <script type="text/javascript">
    function  getSelectionText()
    {
        if (document.getElementById("PageOfficeCtrl1").Document.Application.Selection.Range.Text != "") {
            document.getElementById("PageOfficeCtrl1").Alert(document.getElementById("PageOfficeCtrl1").Document.Application.Selection.Range.Text);
	    }
	    else{
	        document.getElementById("PageOfficeCtrl1").Alert("��û��ѡ���κ��ı���");
	    }     
    }
    </script>

</head>
<body>
    <div style="font-size: 12px; line-height: 20px; border-bottom: dotted 1px #ccc; border-top: dotted 1px #ccc;
        padding: 5px;">
        <span style="color: red;">����˵����</span>ѡ��word�ļ��е�һ�����֣�Ȼ��㡰��ȡѡ�����֡���ť��<br />
        �ؼ����룺���Ҽ���ѡ�񡰲鿴Դ�ļ�������js����<span style="background-color: Yellow;">getSelectionText()</span></div>
    
    <input id="Button1" type="button" onclick="getSelectionText();" value="js��ȡwordѡ�е�����" /><br />
    <form id="form1">
    <div style=" width:auto; height:700px;">
        <!--**************   PageOffice �ͻ��˴��뿪ʼ    ************************-->
        <po:PageOfficeCtrl id="PageOfficeCtrl1">
        </po:PageOfficeCtrl>
        <!--**************   PageOffice �ͻ��˴������    ************************-->
    </div>
    </form>
</body>
</html>

