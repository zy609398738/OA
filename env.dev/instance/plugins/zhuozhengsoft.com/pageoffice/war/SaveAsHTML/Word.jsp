<%@ page language="java"
	import="java.util.*,com.zhuozhengsoft.pageoffice.*"
	pageEncoding="gb2312"%>
<%@ taglib uri="http://java.pageoffice.cn" prefix="po"%>
<%
PageOfficeCtrl poCtrl=new PageOfficeCtrl(request);
//���÷�����ҳ��
poCtrl.setServerPage(request.getContextPath()+"/poserver.zz");
//����Զ��尴ť
poCtrl.addCustomToolButton("���HTML","saveAsHTML",1);
//���ñ���ҳ��
poCtrl.setSaveFilePage("SaveFile.jsp");
//��Word�ĵ�
poCtrl.webOpen("doc/test.doc",OpenModeType.docNormalEdit,"������");
poCtrl.setTagId("PageOfficeCtrl1");//���б���
%>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
  <head>
   <title>Word�ļ����ΪHTML</title>
</head>
<body>
    <script type="text/javascript">
        function saveAsHTML() {
            document.getElementById("PageOfficeCtrl1").WebSaveAsHTML();
            document.getElementById("PageOfficeCtrl1").Alert("HTML��ʽ���ļ��Ѿ����浽�������ϡ�");
            window.open("doc/test.htm" + "?r=" + Math.random());
        }
    </script>
    <form id="form1" >
    <div style=" width:1000px; height:800px;">
        <po:PageOfficeCtrl id="PageOfficeCtrl1">
        </po:PageOfficeCtrl>
    </div>
    </form>
</body>
</html>
