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
	poCtrl1.addCustomToolButton("��λ��굽ָ����ǩ","locateBookMark",5);

	poCtrl1.webOpen("doc/template.doc", OpenModeType.docNormalEdit, "����");
	poCtrl1.setTagId("PageOfficeCtrl1"); //���б���	

%>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
  <head>
    <title>��ʾ����λ��굽ָ����ǩ</title>

    <script type="text/javascript">
//        function locateBookMark() {
//            //��ȡ��ǩ����
//            var bkName = document.getElementById("txtBkName").value;
//            //����궨λ����ǩ���ڵ�λ��
//            document.getElementById("PageOfficeCtrl1").Document.Bookmarks(bkName).Select();
//        }
        function locateBookMark() {
            //��ȡ��ǩ����
            var bkName = document.getElementById("txtBkName").value;
            //����궨λ����ǩ���ڵ�λ��
            var mac = "Function myfunc()" + " \r\n"
                    + "  ActiveDocument.Bookmarks(\""+ bkName +"\").Select " + " \r\n"
                    + "End Function " + " \r\n";
            document.getElementById("PageOfficeCtrl1").RunMacro("myfunc", mac);
        }
    </script>

</head>
<body>
    <div style=" font-size:small; color:Red;">
        <label>�ؼ����룺���Ҽ���ѡ�񡰲鿴Դ�ļ�������js������</label>
        <label>function  locateBookMark()</label>
        <br/>
    <label>����궨λ����ǩǰ���������ı���������Ҫ��λ������ǩ���ƣ��ɵ��Office�������ϵġ����롱������ǩ�������鿴��ǰWord�ĵ������е���ǩ���ƣ���</label><br />
        <label>��ǩ���ƣ�</label><input id="txtBkName" type="text" value="PO_seal" />
    </div>
    <br />
    <form id="form1">
    <div style="width:auto; height:700px;">
        <!--**************   PageOffice �ͻ��˴��뿪ʼ    ************************-->
        <po:PageOfficeCtrl id ="PageOfficeCtrl1">
        </po:PageOfficeCtrl>
        <!--**************   PageOffice �ͻ��˴������    ************************-->
    </div>
    </form>
</body>
</html>
