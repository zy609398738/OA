<%@ page language="java"
	import="java.util.*,com.zhuozhengsoft.pageoffice.*, com.zhuozhengsoft.pageoffice.wordwriter.*"
	pageEncoding="gb2312"%>
<%@ taglib uri="http://java.pageoffice.cn" prefix="po"%>
<%
WordDocument doc = new WordDocument();
DataRegion mydr1 = doc.createDataRegion("PO_first", DataRegionInsertType.After, "[end]");
mydr1.selectEnd();
doc.insertPageBreak();//�����ҳ��
DataRegion mydr2 = doc.createDataRegion("PO_second", DataRegionInsertType.After, "[end]");
mydr2.setValue("[word]doc/test2.doc[/word]");

PageOfficeCtrl poCtrl=new PageOfficeCtrl(request);
//���÷�����ҳ��
poCtrl.setServerPage(request.getContextPath()+"/poserver.zz");
poCtrl.addCustomToolButton("����", "Save()", 1);
poCtrl.setWriter(doc);
//���ñ���ҳ��
poCtrl.setSaveFilePage("SaveFile.jsp");
//��Word�ĵ�
poCtrl.webOpen("doc/test1.doc",OpenModeType.docNormalEdit,"������");
poCtrl.setTagId("PageOfficeCtrl1");//���б���
%>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
  <head>
   <title>��word�ĵ��й�괦�����ҳ��</title>
</head>
<body>
    <script type="text/javascript">
        function Save() {
          document.getElementById("PageOfficeCtrl1").WebSave();
          if(document.getElementById("PageOfficeCtrl1").CustomSaveResult=="ok"){
             alert("����ɹ�������/Samples/InsertPageBreak2/docĿ¼�²鿴�ϲ�������ĵ�\"test3.doc\"��");
             }
        }    
       
    </script> 
    <div style=" width:auto; height:700px;">
        <po:PageOfficeCtrl id="PageOfficeCtrl1">
        </po:PageOfficeCtrl>
    </div>
</body>
</html>
