<%@ page language="java"
	import="java.util.*,com.zhuozhengsoft.pageoffice.*"
	pageEncoding="gb2312"%>
<%@ taglib uri="http://java.pageoffice.cn" prefix="po"%>
<%
String userName = "somebody";

String userId = request.getParameter("userid").toString();
if (userId.equals("1"))
{
    userName = "����";
}
else
{
    userName = "����";
}

PageOfficeCtrl poCtrl=new PageOfficeCtrl(request);
poCtrl.setServerPage(request.getContextPath()+"/poserver.zz");
poCtrl.addCustomToolButton("����","Save",1);
poCtrl.setSaveFilePage("SaveFile.jsp");
//���ò�������ʱ��
poCtrl.setTimeSlice(20);
poCtrl.webOpen("doc/test.doc",OpenModeType.docRevisionOnly,userName);
poCtrl.setTagId("PageOfficeCtrl1");//���б���
%>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
  <head>
   <title>��򵥵Ĵ򿪱���Word�ļ�</title>
</head>
<body>
    <script type="text/javascript">
        function Save() {
            document.getElementById("PageOfficeCtrl1").WebSave();
        }
    </script>
    <form id="form1" >
    ��ǰ�û��� <%=userName %>��
    <div style=" width:auto; height:700px;">
        <po:PageOfficeCtrl id="PageOfficeCtrl1">
        </po:PageOfficeCtrl>
    </div>
    </form>
</body>
</html>
