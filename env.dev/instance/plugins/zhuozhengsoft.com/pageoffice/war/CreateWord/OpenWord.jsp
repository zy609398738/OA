<%@ page language="java"
	import="java.util.*,com.zhuozhengsoft.pageoffice.*,com.zhuozhengsoft.pageoffice.wordwriter.*"
	pageEncoding="gb2312"%>
<%@ taglib uri="http://java.pageoffice.cn" prefix="po"%>
<%
//******************************׿��PageOffice�����ʹ��*******************************
	PageOfficeCtrl poCtrl1 = new PageOfficeCtrl(request);
	poCtrl1.setServerPage(request.getContextPath()+"/poserver.zz"); //���б���
	//���ز˵���
	poCtrl1.setMenubar(false);
	poCtrl1.addCustomToolButton("����","Save()",1);
	//���ñ���ҳ��
	poCtrl1.setSaveFilePage("SaveFile.jsp");
	//��Word�ļ�
	poCtrl1.webOpen("doc/"+request.getParameter("filename"), OpenModeType.docNormalEdit, "����");
	poCtrl1.setTagId("PageOfficeCtrl1"); //���б���	
%>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
<head>
    <title></title>
    <link href="../images/csstg.css" rel="stylesheet" type="text/css" />

    <script type="text/javascript">
        function Save() {
            document.getElementById("PageOfficeCtrl1").WebSave();
            //alert('����ɹ���');
        }
    </script>

</head>
<body>
    <form id="form2">
    <div id="header">
        <div style="float: left; margin-left: 20px;">
            <img src="../images/logo.jpg" height="30" /></div>
        <ul>
            <li><a href="#">׿����վ</a></li>
            <li><a href="#">�ͻ��ʰ�</a></li>
            <li><a href="#">���߰���</a></li>
            <li><a href="#">��ϵ����</a></li>
        </ul>
    </div>
    <div id="content">
        <div id="textcontent" style="width: 1000px; height: 800px;">
            <div class="flow4">
                <a href="word-lists.jsp">
                    <img alt="����" src="../images/return.gif" border="0" />�ļ��б�</a>&nbsp;&nbsp;<strong>�ĵ����⣺</strong> <span style="color: Red;">
                        <%=new String(request.getParameter("subject").getBytes("ISO-8859-1"),"gb2312") %></span> <span style="width: 100px;">
                        </span>
            </div>
			<!-- ****************************PageOffice ����ͻ��˱��************************************* -->
		   <script type="text/javascript">
		   		function Save(){
		   			document.getElementById("PageOfficeCtrl1").WebSave();
		   		}
		   </script>
		   <!-- ****************************PageOffice ����ͻ��˱�̽���************************************* -->
		   <po:PageOfficeCtrl id="PageOfficeCtrl1" />
        </div>
    </div>
    <div id="footer">
        <hr width="1000" />
        <div>
            Copyright (c) 2012 ����׿��־Զ������޹�˾</div>
    </div>
    </form>
</body>
</html>
