<%@ page language="java"
	import="java.util.*,com.zhuozhengsoft.pageoffice.*"
	pageEncoding="gb2312"%>
<%@ taglib uri="http://java.pageoffice.cn" prefix="po"%>
<%
PageOfficeCtrl poCtrl=new PageOfficeCtrl(request);
poCtrl.setServerPage(request.getContextPath()+"/poserver.zz");

// �����ļ�����֮ǰִ�е��¼�
poCtrl.setJsFunction_BeforeDocumentSaved("BeforeDocumentSaved()");
// �����ļ�����֮��ִ�е��¼�
poCtrl.setJsFunction_AfterDocumentSaved("AfterDocumentSaved()");

poCtrl.setSaveFilePage("SaveFile.jsp");
poCtrl.webOpen("doc/test.doc",OpenModeType.docNormalEdit,"������");
poCtrl.setTagId("PageOfficeCtrl1");//���б���
%>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
  <head>
   <title>�ĵ�����ǰ�ͱ����ִ�е��¼�</title>
</head>
<body>
    <script type="text/javascript">
        function BeforeDocumentSaved() {
            document.getElementById("PageOfficeCtrl1").Alert("BeforeDocumentSaved�¼����ļ���Ҫ��ʼ������.");
            return true;
        }
        function AfterDocumentSaved(IsSaved) {
            if (IsSaved) {
                document.getElementById("PageOfficeCtrl1").Alert("AfterDocumentSaved�¼����ļ�����ɹ���.");
            }
        }
    </script>
    <form id="form1" >
    	��ʾ: �ĵ�����ǰ�ͱ����ִ�е��¼���<br /><br />
    
    <div style=" width:auto; height:700px;">
        <po:PageOfficeCtrl id="PageOfficeCtrl1">
        </po:PageOfficeCtrl>
    </div>
    </form>
</body>
</html>
