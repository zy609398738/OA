<%@ page language="java"
	import="java.util.*,com.zhuozhengsoft.pageoffice.*"
	pageEncoding="gb2312"%>
<%@ taglib uri="http://java.pageoffice.cn" prefix="po"%>
<%
String text=(String)session.getAttribute("text");

PageOfficeCtrl poCtrl=new PageOfficeCtrl(request);
//���÷�����ҳ��
poCtrl.setServerPage(request.getContextPath()+"/poserver.zz");
//����Զ��尴ť
poCtrl.addCustomToolButton("���沢�ر�","Save",1);

//���ñ���ҳ��
poCtrl.setSaveFilePage("SaveFile.jsp");
//��Word�ĵ�
poCtrl.webOpen("doc/test.doc",OpenModeType.docNormalEdit,"������");
poCtrl.setTagId("PageOfficeCtrl1");//���б���
%>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
  <head>
   <title>��ҳ�洫�ݲ�������ҳ��</title>
       <script type="text/javascript"
			src="js/jquery-1.6.min.js"></script>
</head>
<body>

    <script type="text/javascript">
        function Save() {
            document.getElementById("PageOfficeCtrl1").WebSave();
			//�ر�PageOfficeLink�����Ĵ���
			  window.external.close();
        }
  

    </script>
              ��ȡindex.jsp�е�һ���ı����е�ֵ��</br>
			  ���룺String text=(String)session.getAttribute("text");</br>
			  �����<%=text %></br></br>
    <form id="form1" >
    <div style=" width:auto; height:700px;">
        <po:PageOfficeCtrl id="PageOfficeCtrl1">
        </po:PageOfficeCtrl>
    </div>
    </form>
</body>
</html>
