<%@ page language="java" 
	import="java.util.*,com.zhuozhengsoft.pageoffice.*,java.sql.*,java.io.*,javax.servlet.*,javax.servlet.http.*" 
	pageEncoding="gb2312"%>
<%@ taglib uri="http://java.pageoffice.cn" prefix="po" %>
<%
    String fileName = "zhengshi.doc"; //��ʽ���ĵ��ļ�
	
	//*****************************׿��PageOffice�����ʹ��****************************
	PageOfficeCtrl poCtrl1 = new PageOfficeCtrl(request);
	poCtrl1.setServerPage(request.getContextPath()+"/poserver.zz"); //���б���
	
	poCtrl1.setCaption(fileName);			
	poCtrl1.addCustomToolButton("��浽����", "ShowDialog1()", 5);
    poCtrl1.addCustomToolButton("ҳ������", "ShowDialog2()", 0);
    poCtrl1.addCustomToolButton("��ӡ", "ShowDialog3()", 6);
    poCtrl1.addCustomToolButton("ȫ��/��ԭ", "IsFullScreen()", 4);
			
	poCtrl1.setMenubar(false);
	poCtrl1.setOfficeToolbars(false);
	
	//poCtrl1.setSaveFilePage("savefile.jsp");
	poCtrl1.webOpen("doc/"+fileName, OpenModeType.docAdmin, "����");
	poCtrl1.setTagId("PageOfficeCtrl1"); //���б���							  
%>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=gb2312" />
    <title></title>
    <link href="images/csstg.css" rel="stylesheet" type="text/css" />
    <script type="text/javascript">

    </script>
</head>
<body> 
    <form id="form2">
    <div id="header">
        <div style="float: left; margin-left: 20px;">
            <img src="images/logo.jpg" height="30" /></div>
        <ul>
            <li><a target="_blank" href="http://www.zhuozhengsoft.com">׿����վ</a></li>
            <li><a target="_blank" href="http://www.zhuozhengsoft.com/poask/index.asp">�ͻ��ʰ�</a></li>
            <li><a href="#">���߰���</a></li>
            <li><a target="_blank" href="http://www.zhuozhengsoft.com/contact-us.html">��ϵ����</a></li>
        </ul>
    </div>
    <div id="content">
        <div id="textcontent" style="width: 1000px; height: 800px;">
            <div class="flow4">
                <a href="index.jsp">
                    <img alt="����" src="images/return.gif" border="0" />�ļ��б�</a> <span style="width: 100px;">
                    </span><strong>�ĵ����⣺</strong> <span style="color: Red;">�����ļ�</span>
          
            </div>
            <!--**************   ׿�� PageOffice��� ************************-->
    <script language="javascript">
    	
        function ShowDialog1() {
            document.getElementById("PageOfficeCtrl1").ShowDialog(2);
        }
        function ShowDialog2() {
            document.getElementById("PageOfficeCtrl1").ShowDialog(5);
        }
        function ShowDialog3() {
            document.getElementById("PageOfficeCtrl1").ShowDialog(4);
        }
    
    	//ȫ��/��ԭ
        function IsFullScreen() {
            document.getElementById("PageOfficeCtrl1").FullScreen = !document.getElementById("PageOfficeCtrl1").FullScreen;
        }
    </script>
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
