<%@ page language="java"
	import="java.util.*,com.zhuozhengsoft.pageoffice.*"
	pageEncoding="gb2312"%>
<%@ taglib uri="http://java.pageoffice.cn" prefix="po"%>
<%
//��ȡindex.jspҳ�洫�ݹ���������ֵ
String userName=(String)session.getAttribute("userName");
//��ȡindex.jsp�ã����ݹ�����id��ֵ
String  id=request.getParameter("id");

PageOfficeCtrl poCtrl=new PageOfficeCtrl(request);
//���÷�����ҳ��
poCtrl.setServerPage(request.getContextPath()+"/poserver.zz");
//����Զ��尴ť
poCtrl.addCustomToolButton("����","Save",1);
//���ñ���ҳ��
poCtrl.setSaveFilePage("SaveFile.jsp");
//��Word�ĵ�
//poCtrl.setJsFunction_AfterDocumentOpened("AfterDocumentOpened()"); 
poCtrl.webOpen("doc/test.doc",OpenModeType.docNormalEdit,"������");
poCtrl.setTagId("PageOfficeCtrl1");//���б���
%>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
  <head>
   <title>��ȡindex.jspҳ�洫�ݹ����Ĳ���</title>
</head>
<body>
    <script type="text/javascript">
        function Save() {
            document.getElementById("PageOfficeCtrl1").WebSave();
        }		  
    </script>
   
	     
		      (1)��ȡindex.jsp��session���ݹ�����userName��ֵ��</br>
			    &nbsp;&nbsp;&nbsp;���룺String userName=(String)session.getAttribute("userName");</br>
			    &nbsp;&nbsp;&nbsp;�����UserName=<%=userName %></br></br>
		 
		
		     (2)��ȡindex.jsp�ã����ݹ�����id��ֵ��</br>
			   &nbsp;&nbsp;&nbsp;���룺String  id=request.getParameter("id");</br>
			   &nbsp;&nbsp;&nbsp;�����id=<%=id %></br>
		 
	 

 
    <form id="form1" >
    <div style=" width:auto; height:700px;">
        <po:PageOfficeCtrl id="PageOfficeCtrl1">
        </po:PageOfficeCtrl>
    </div>
    </form>
</body>
</html>
