<%@ page language="java"
	import="java.util.*,com.zhuozhengsoft.pageoffice.*"
	pageEncoding="gb2312"%>
<%@ taglib uri="http://java.pageoffice.cn" prefix="po"%>
<%
PageOfficeCtrl poCtrl=new PageOfficeCtrl(request);
//���÷�����ҳ��
poCtrl.setServerPage(request.getContextPath()+"/poserver.zz");
poCtrl.addCustomToolButton("�����ҳ��", "InsertPageBreak()", 1);
//��Word�ĵ�
poCtrl.webOpen("doc/test.doc",OpenModeType.docNormalEdit,"������");
poCtrl.setTagId("PageOfficeCtrl1");//���б���
%>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
  <head>
   <title>��word�ĵ��й�괦�����ҳ��</title>
</head>
<body>
    <script type="text/javascript">
        function InsertPageBreak() {
          document.getElementById("PageOfficeCtrl1").RunMacro("AddPage", "sub AddPage() \r\n Application.Selection.InsertBreak(7) \r\n End Sub");
        }    
       
    </script> 
     <div style="font-size: 12px; line-height: 20px; border-bottom: dotted 1px #ccc; border-top: dotted 1px #ccc;
        padding: 5px;">
        <span style="color: red;">����˵����</span>�ֶ���λ��굽��ǰ�ĵ���Ҫ�����ҳ����λ�ã�Ȼ��㡰�����ҳ�����İ�ť��<br />
        �ؼ����룺���Ҽ���ѡ�񡰲鿴Դ�ļ�������js����<span style="background-color: Yellow;">InsertPageBreak()</span>
    </div>
    <div style=" width:auto; height:700px;">
        <po:PageOfficeCtrl id="PageOfficeCtrl1">
        </po:PageOfficeCtrl>
    </div>
</body>
</html>
