<%@ page language="java" 
import="java.util.*,com.zhuozhengsoft.pageoffice.*"
 pageEncoding="gb2312"%>

<%
String url=request.getSession().getServletContext().getRealPath("FileMakerSingle/doc/"+"/");
%>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
<head>
    <title></title>

    <script type="text/javascript">
        window.myFunc = function() {
            document.getElementById("aDiv").style.display = "";
            //alert('ת����ϣ�');
        };

        //ת�����
        function ConvertFiles() {
            //ҳ����ˢ��
            document.getElementById("iframe1").src = "FileMakerSingle.jsp";
        }
    </script>

</head>
<body>
    <form id="form1">
    <div style="text-align: center;">
        <br />
        <span style="color: Red; font-size: 12px;">��ʾ����������䵽ģ����������ʽ��word�ļ����������İ�ť����ת��</span><br />
        <input id="Button1" type="button" value="ת��Word�ļ�" onclick="ConvertFiles()" />
        <div id="aDiv" style="display: none; color: Red; font-size: 12px;">
            <span>ת����ɣ���������ĵ�ַ�д��ļ���Ϊ��maker.doc����Word�ļ����鿴ת����Ч����<%=url %></span>
        </div>
    </div>
    <div style="width: 1px; height: 1px; overflow: hidden;">
        <iframe id="iframe1" name="iframe1" src=""></iframe>
    </div>
    </form>
</body>
</html>