<%@ page language="java"
	import="java.util.*,com.zhuozhengsoft.pageoffice.*"
	pageEncoding="gb2312"%>
<%@ taglib uri="http://java.pageoffice.cn" prefix="po"%>
<%
PageOfficeCtrl poCtrl=new PageOfficeCtrl(request);
poCtrl.setServerPage(request.getContextPath()+"/poserver.zz");

// ���һ���Զ��幤�����ϵİ�ť��AddCustomToolButton�Ĳ���˵���������������
poCtrl.addCustomToolButton("���԰�ť","myTest",0);

poCtrl.webOpen("doc/test.doc",OpenModeType.docNormalEdit,"������");
poCtrl.setTagId("PageOfficeCtrl1");//���б���
%>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
  <head>
   <title>���Զ��幤������Ӱ�ť</title>
</head>
<body>
    <script type="text/javascript">
        function myTest() {
            document.getElementById("PageOfficeCtrl1").Alert("���Գɹ���");
        }
    </script>
    <form id="form1" >
    ����Զ��幤�����еġ����԰�ť���鿴Ч����<br />
    <img src="img/addbutton.jpg" />
    <div style=" width:auto; height:700px;">
        <po:PageOfficeCtrl id="PageOfficeCtrl1">
        </po:PageOfficeCtrl>
    </div>
    </form>
</body>
</html>

