<%@ page language="java" import="java.util.*" pageEncoding="gb2312"%>
<%@page import="com.zhuozhengsoft.pageoffice.*"%>
<%@ taglib uri="http://java.pageoffice.cn" prefix="po"%>
<%
		String userName=request.getParameter("userName");

        if ( userName.equals("zhangsan") ) userName = "����";
        if (userName.equals("lisi")) userName = "����";
        if (userName.equals("wangwu")) userName = "����";
 		//***************************׿��PageOffice�����ʹ��********************************
		PageOfficeCtrl poCtrl = new PageOfficeCtrl(request);
        poCtrl.addCustomToolButton("����", "Save", 1);
        poCtrl.addCustomToolButton("�쵼Ȧ��", "StartHandDraw", 3);
        poCtrl.addCustomToolButton("ȫ��/��ԭ", "IsFullScreen", 4);
        poCtrl.setJsFunction_AfterDocumentOpened("ShowByUserName");
        poCtrl.setServerPage(request.getContextPath()+"/poserver.zz"); //���б���
        poCtrl.setSaveFilePage("SaveFile.jsp");
        poCtrl.webOpen("doc/test.doc",OpenModeType.docNormalEdit, userName);
        poCtrl.setTagId("PageOfficeCtrl1");
%>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
	<head>
		<meta http-equiv="Content-Type" content="text/html; charset=gb2312" />
		<title></title>
		<link href="images/csstg.css" rel="stylesheet" type="text/css" />
	</head>
	<body>

		<div id="content">
			<div id="textcontent" style="width: 1000px; height: 800px;">
				<div class="flow4">
					<a href="Default.jsp"> ���ص�¼ҳ</a>
					<span style=""> </span><strong>��ǰ�û���</strong>
					<span style="color: Red;"><%=userName %></span>
				</div>

				<script type="text/javascript">
	                //����ҳ��
	                function Save() {
	                    document.getElementById("PageOfficeCtrl1").WebSave();
	                }
	
	                //�쵼Ȧ��ǩ��
	                function StartHandDraw() {
	                    document.getElementById("PageOfficeCtrl1").HandDraw.Start();
	                }
	                
	                /*
	                //�ֲ���ʾ��д��ע
	                function ShowHandDrawDispBar() {
	                    document.getElementById("PageOfficeCtrl1").HandDraw.ShowLayerBar(); ;
	                }*/
	
	                //ȫ��/��ԭ
	                function IsFullScreen() {
	                    document.getElementById("PageOfficeCtrl1").FullScreen = !document.getElementById("PageOfficeCtrl1").FullScreen;
	                }
	
	                //��ʾ/�����û�����д��ע
	                function ShowByUserName() {
	                    var userName = "<%=userName %>"; //�Ӻ�̨��ȡ��¼�û���
	                    document.getElementById("PageOfficeCtrl1").HandDraw.ShowByUserName(null, false); // �������е���д
	                    document.getElementById("PageOfficeCtrl1").HandDraw.ShowByUserName(userName); // ��ʾTom����д���ڶ�������Ϊtrueʱ��ʡ��
	                }
	
	            </script>

				<!--**************   ׿�� PageOffice��� ************************-->
				<po:PageOfficeCtrl id="PageOfficeCtrl1"></po:PageOfficeCtrl>
			</div>
		</div>

	</body>
</html>