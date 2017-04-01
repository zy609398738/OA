<%@ page language="java" 
	import="com.zhuozhengsoft.pageoffice.*,com.zhuozhengsoft.pageoffice.wordwriter.*,java.util.*,java.io.*,javax.servlet.*,javax.servlet.http.*" 
	pageEncoding="gb2312"%>
<%@ taglib uri="http://java.pageoffice.cn" prefix="po" %>
<%

	PageOfficeCtrl poCtrl1 = new PageOfficeCtrl(request);
	poCtrl1.setServerPage(request.getContextPath()+"/poserver.zz"); //���б���
	poCtrl1.setSaveFilePage("SaveFile.jsp");//��Ҫ�����ļ������б���
	poCtrl1.addCustomToolButton("����", "Save()", 1);//����Զ��幤������ť

        WordDocument wordDoc = new WordDocument();
        wordDoc.setDisableWindowRightClick(true);//��ֹword����Ҽ�
        //wordDoc.setDisableWindowDoubleClick(true);//��ֹword���˫��
	poCtrl1.setWriter(wordDoc);

	//���ļ�
	poCtrl1.webOpen("doc/test.doc", OpenModeType.docNormalEdit, "����");
	poCtrl1.setTagId("PageOfficeCtrl1"); //���б���	 
%>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
  <head>
    
    <title>��ֹWord�ĵ�������Ҽ�</title>
	<meta http-equiv="pragma" content="no-cache">
	<meta http-equiv="cache-control" content="no-cache">
	<meta http-equiv="expires" content="0">    
	<meta http-equiv="keywords" content="keyword1,keyword2,keyword3">
	<meta http-equiv="description" content="This is my page">
	<!--
	<link rel="stylesheet" type="text/css" href="styles.css">
	-->
  </head>
  
  <body>
    	
    	
        <script type="text/javascript">
	    function Save() {
		document.getElementById("PageOfficeCtrl1").WebSave();
	    }
	</script>
    <div style="color:Red">��Word�ĵ�������Ҽ��������Ҽ�ʧЧ��</div>
    <po:PageOfficeCtrl id="PageOfficeCtrl1" />
  </body>
</html>
