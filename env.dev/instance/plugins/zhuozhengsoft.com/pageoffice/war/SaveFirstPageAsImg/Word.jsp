<%@ page language="java" import="java.util.*" pageEncoding="gb2312"%>
<%@ page import="com.zhuozhengsoft.pageoffice.*,com.zhuozhengsoft.pageoffice.wordwriter.*"%>
<%@ taglib uri="http://java.pageoffice.cn" prefix="po"%>
<%
        
	// ����PageOffice�������ҳ��
	PageOfficeCtrl poCtrl1 = new PageOfficeCtrl(request);
	poCtrl1.setServerPage(request.getContextPath()+"/poserver.zz"); //���б���
	poCtrl1.addCustomToolButton("����", "Save()", 1);
    poCtrl1.addCustomToolButton("������ҳΪͼƬ", "SaveFirstAsImg()", 1);
	poCtrl1.setSaveFilePage("SaveFile.jsp");
	// ���ĵ�
	poCtrl1.webOpen("doc/test.doc" , OpenModeType.docNormalEdit,"������");
    poCtrl1.setTagId("PageOfficeCtrl1");
	
%>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
	<head>
		<title>����Word��ҳΪͼƬ</title>
	</head>
	<body>
	<script type="text/javascript">
        function Save() {
            document.getElementById("PageOfficeCtrl1").WebSave();
            if (document.getElementById("PageOfficeCtrl1").CustomSaveResult == "ok") {
               document.getElementById("PageOfficeCtrl1").Alert("�ĵ�����ɹ�!");
            }
        }
        function SaveFirstAsImg() {
            document.getElementById("PageOfficeCtrl1").WebSaveAsImage();
            if (document.getElementById("PageOfficeCtrl1").CustomSaveResult == "ok") {
               document.getElementById("PageOfficeCtrl1").Alert("ͼƬ����ɹ�!");
			   document.getElementById("img1").src = "images/test.jpg";
			   document.getElementById("img1").style.width = "200px";
			   document.getElementById("img1").style.height = "290px";
            }
        }
    </script>
	<div><img id="img1" /></div>
	<div style="width:auto; height:700px;">
		<po:PageOfficeCtrl id="PageOfficeCtrl1" />
	</div>
	</body>
</html>
