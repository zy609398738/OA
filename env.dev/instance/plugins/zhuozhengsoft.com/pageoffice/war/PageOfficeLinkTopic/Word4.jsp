<%@ page language="java"
	import="java.util.*,com.zhuozhengsoft.pageoffice.*"
	pageEncoding="gb2312"%>
<%@ taglib uri="http://java.pageoffice.cn" prefix="po"%>
<%
//�����ĵ���FileIsOpened��ֵ��Ϊtrue
session.setAttribute("FileIsOpened",true);

PageOfficeCtrl poCtrl=new PageOfficeCtrl(request);
//���÷�����ҳ��
poCtrl.setServerPage(request.getContextPath()+"/poserver.zz");
//����Զ��尴ť
poCtrl.addCustomToolButton("���沢�ر�","Save",1);

//���ñ���ҳ��
poCtrl.setSaveFilePage("SaveFile.jsp");
//��Word�ĵ�
poCtrl.setJsFunction_BeforeDocumentSaved("BeforeDocumentSaved()");
poCtrl.webOpen("doc/test.doc",OpenModeType.docNormalEdit,"������");
poCtrl.setTagId("PageOfficeCtrl1");//���б���
%>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
  <head>
   <title>PageOfficeLink���ĵ���ҳ�淵�ز�������ҳ��</title>
       <script type="text/javascript"
			src="js/jquery-1.6.min.js"></script>
</head>
<body>
     ����"���沢�ر�"��ť���۲�index.jspҳ��ĵڶ����ı����е�ֵ�ı仯��
    <script type="text/javascript">
        function Save() {
            document.getElementById("PageOfficeCtrl1").WebSave();
			//�ر�PageOfficeLink�����Ĵ���
			  window.external.close();
        }
  
	   function BeforeDocumentSaved() {
               $.ajax({  
                    type : "POST",  //�ύ��ʽ  
                    url : "Result.jsp?page=open&r=" +Math.random(),//·��  
                    dataType: "text", 
                    success : function(data) {//�������ݸ��ݽ��������Ӧ�Ĵ���  
                    } 
                    
              }); 
            return  true;
     }
    </script>

    <form id="form1" >
    <div style=" width:auto; height:700px;">
        <po:PageOfficeCtrl id="PageOfficeCtrl1">
        </po:PageOfficeCtrl>
    </div>
    </form>
</body>
</html>
