<%@ page language="java"
	import="java.util.*,com.zhuozhengsoft.pageoffice.*"
	pageEncoding="gb2312"%>
<%@ taglib uri="http://java.pageoffice.cn" prefix="po"%>
<%
PageOfficeCtrl poCtrl=new PageOfficeCtrl(request);
//���÷�����ҳ��
poCtrl.setServerPage(request.getContextPath()+"/poserver.zz");

poCtrl.setCustomToolbar(false);
poCtrl.setOfficeToolbars(false);
poCtrl.setAllowCopy(false);

poCtrl.setJsFunction_AfterDocumentOpened("AfterDocumentOpened");
//��Word�ĵ�
poCtrl.webOpen("doc/test.doc",OpenModeType.docReadOnly,"������");
poCtrl.setTagId("PageOfficeCtrl1");//���б���
%>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
  <head>
   <title>��򵥵Ĵ򿪱���Word�ļ�</title>
</head>
<body>
    <script type="text/javascript">
        function AfterDocumentOpened() {
            document.getElementById("PageOfficeCtrl1").SetEnableFileCommand(3, false); // ��ֹ����
            document.getElementById("PageOfficeCtrl1").SetEnableFileCommand(4, false); // ��ֹ���
            document.getElementById("PageOfficeCtrl1").SetEnableFileCommand(5, false); //��ֹ��ӡ
            document.getElementById("PageOfficeCtrl1").SetEnableFileCommand(6, false); // ��ֹҳ������
        }
    </script>
    <form id="form1" >
    <p>������ļ����˵������Կ��������桱�������Ϊ������ҳ�����á�������ӡ���˵����Ѿ���ҡ�����˵������ң�Ctrl+SҲ�����á�</p>
    <div style=" width:auto; height:700px;">
        <po:PageOfficeCtrl id="PageOfficeCtrl1">
        </po:PageOfficeCtrl>
    </div>
    </form>
</body>
</html>
