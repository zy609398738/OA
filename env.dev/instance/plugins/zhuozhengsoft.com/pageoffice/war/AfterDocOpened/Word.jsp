<%@ page language="java"
	import="java.util.*,com.zhuozhengsoft.pageoffice.*"
	pageEncoding="gb2312"%>
<%@ taglib uri="http://java.pageoffice.cn" prefix="po"%>
<%
PageOfficeCtrl poCtrl=new PageOfficeCtrl(request);
poCtrl.setServerPage(request.getContextPath()+"/poserver.zz");

// �����ļ��򿪺�ִ�е�js function
poCtrl.setJsFunction_AfterDocumentOpened( "AfterDocumentOpened()");

//��Word�ĵ�
poCtrl.webOpen("doc/test.doc",OpenModeType.docNormalEdit,"������");
poCtrl.setTagId("PageOfficeCtrl1");//���б���
%>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
  <head>
   <title>�ļ��򿪺󴥷����¼�</title>
</head>
<body>
    <script type="text/javascript">
        function AfterDocumentOpened() {
            // ���ļ���ʱ�򣬸�word�е�ǰ���λ�ø�ֵһ���ı�ֵ
            document.getElementById("PageOfficeCtrl1").Document.Application.Selection.Range.Text = "�ļ�����";
        }
    </script>
    <form id="form1" >
    Word�е�"<span style=" color:Red;"> �ļ�����</span>" �����ĵ��򿪵��¼����ó�����ӽ�ȥ�ġ�<br /><br />
    
    <div style=" width:auto; height:700px;">
        <po:PageOfficeCtrl id="PageOfficeCtrl1">
        </po:PageOfficeCtrl>
    </div>
    </form>
</body>
</html>
