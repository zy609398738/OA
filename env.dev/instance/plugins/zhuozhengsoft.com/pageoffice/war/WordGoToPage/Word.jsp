<%@ page language="java"
	import="java.util.*,com.zhuozhengsoft.pageoffice.*"
	pageEncoding="gb2312"%>
<%@ taglib uri="http://java.pageoffice.cn" prefix="po"%>
<%
PageOfficeCtrl poCtrl=new PageOfficeCtrl(request);
//���÷�����ҳ��
poCtrl.setServerPage(request.getContextPath()+"/poserver.zz");
//����Զ��尴ť
poCtrl.addCustomToolButton("����","Save",1);
//���ñ���ҳ��
//poCtrl.setSaveFilePage("SaveFile.jsp");
//��Word�ĵ�
poCtrl.webOpen("doc/test.doc",OpenModeType.docNormalEdit,"������");
poCtrl.setTagId("PageOfficeCtrl1");//���б���
%>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml" >
<head id="Head1" runat="server">
    <title>��ʾ��jsʵ��word��ҳ����ת</title>
    <style>
        html,body{height:100%; }
        .main{height:100%; }
    </style>
</head>
<body>
    <script type="text/javascript">

        function gotoPage(num) {
            var sMac = "function myfunc()" + "\r\n"
                     + "  If " + num + " > Application.Selection.Information(4) Then " + "\r\n"
                     + "     Msgbox \"�����ĵ���Χ�����Ĺ�\" & Application.Selection.Information(4) & \"ҳ\"" + "\r\n"
                     + "  End If " + "\r\n"
                     + "  Selection.GoTo What:=wdGoToPage, Which:=wdGoToAbsolute, Name:= " + num + "\r\n"
                     + "End function";
            return document.getElementById("PageOfficeCtrl1").RunMacro("myfunc", sMac);
        }


        function Button1_onclick() {
            var num = document.getElementById("pageNum").value;
            if ("" == Trim(num)) {
                document.getElementById("PageOfficeCtrl1").Alert("������ҳ��");
                return;
            }
            if (isNaN(num)){
                document.getElementById("PageOfficeCtrl1").Alert("ֻ����������");
                return;
            }
            gotoPage(num);
        }
    </script>
    <script type="text/javascript">
        function LTrim(str) {
            var i;
            for (i = 0; i < str.length; i++) {
                if (str.charAt(i) != " " && str.charAt(i) != " ") break;
            }
            str = str.substring(i, str.length);
            return str;
        }
        function RTrim(str) {
            var i;
            for (i = str.length - 1; i >= 0; i--) {
                if (str.charAt(i) != " " && str.charAt(i) != " ") break;
            }
            str = str.substring(0, i + 1);
            return str;
        }
        function Trim(str) {
            return LTrim(RTrim(str));
        }
    </script>
    <div style="font-size:12px; line-height:20px; border-bottom:dotted 1px #ccc;border-top:dotted 1px #ccc; padding:5px;">
     <span style="color:red;">����˵����</span>������ҳ������ת��ť��ҳ�룺
     <input id="pageNum" type="text" value="3" />
        <input id="Button1" type="button" value="��ת" onclick="return Button1_onclick()" />
     <br />
   
    �ؼ����룺���Ҽ���ѡ�񡰲鿴Դ�ļ�������js����<span style="background-color:Yellow;">gotoPage(num)</span></div><br />
    <form id="form1"  style="height:100%;">
    <div class="main">
    <!--**************   PageOffice �ͻ��˴��뿪ʼ    ************************-->
        <div style=" width:auto; height:700px;">
        <po:PageOfficeCtrl id="PageOfficeCtrl1">
        </po:PageOfficeCtrl>
    	</div>
    <!--**************   PageOffice �ͻ��˴������    ************************-->
    </div>
    </form>
</body>
</html>

