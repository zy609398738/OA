<%@ page language="java" import="java.util.*" pageEncoding="gb2312"%>
<%
String path = request.getContextPath();
String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
%>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml">
<head id="Head1" runat="server">
    <title></title>
</head>
<body style="margin:0; padding:0;border-style:none; font-size:12px;overflow:hidden">
    <script language="javascript" type="text/javascript">
        function CheckValue(theForm) {
            window.external.DialogResult = theForm.WordList.value; //����ShowHtmlModalDialog�ķ���ֵ
            window.opener = null; 
            window.open('', '_self');
            window.close();
            return;
        }
	</script>
    <form id="form1" runat="server">
    <div  style=" margin:0; padding:0; height:25px; background-color:lightGreen; line-height:25px; border: solid 1px blue; text-align:right; padding:0 10px;">
        <a href="#" onclick="window.opener=null;window.open('','_self');window.close();" style=" font-size:18px; text-decoration:none;">��</a>
    </div>
    <div  id="rect1" style=" margin:0; padding:0; height:200px; border: solid 1px blue;">
        <br />
        �����Լ��������ҳ������ӣ������񵯳���divһ����
        <br /><br />

        <select name="WordList" style='width:240 px;'>
            <option value='������'>������</option>
            <option value='����'>����</option>
            <option value='�г�һ��'>�г�һ��</option>
            <option value='�г�����'>�г�����</option>
            <option value='�г�����'>�г�����</option>
            <option value='�г��Ĳ�'>�г��Ĳ�</option>
        </select>
        <button type="button" onclick="CheckValue(form1);">ȷ��</button>
        <button type="button" onclick="window.opener=null;window.open('','_self');window.close();">ȡ��</button>
    </div>
    </form>
    <script language="javascript" type="text/javascript">
        document.getElementById("rect1").style.height = document.body.clientHeight - 30;
	</script>
</body>
</html>
