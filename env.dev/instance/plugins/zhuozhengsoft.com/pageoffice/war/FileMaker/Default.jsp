<%@ page language="java" 
import="java.util.*,com.zhuozhengsoft.pageoffice.*"
 pageEncoding="gb2312"%>

<%
String url=request.getSession().getServletContext().getRealPath("FileMaker/doc/"+"/");
%>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
<head>
    <title></title>

    <script type="text/javascript">
        count = 0;
        window.myFunc = function() {
            count++;
            if (count < 10) {
                //��ҳ��ˢ�£�����һ
                //document.frames["iframe1"].window.location.href = document.frames["iframe1"].window.location.href;
                //��ҳ��ˢ�£����������ɴ��Σ�
                document.getElementById("iframe1").src = "FileMaker.jsp?id=" + count;

                //���ý�����
                document.getElementById("ProgressBarSide").style.visibility = "visible";
                document.getElementById("ProgressBar").style.width = count + "0%";
                //                document.body.insertBefore(document.getElementById("ProgressBarSide"), document.body.childNode[0];
            } else {
                //���ؽ�����div
                document.getElementById("ProgressBarSide").style.visibility = "hidden";
                count = 0;
                //���ý�����
                document.getElementById("ProgressBar").style.width = "0%";
                document.getElementById("aDiv").style.display = "";
                //alert('����ת����ϣ�');
            }
        };

        //����ת�����
        function ConvertFiles() {
            //��һ������ҳ����ˢ��
            document.getElementById("iframe1").src = "FileMaker.jsp?id=" + count;
        }
    </script>

</head>
<body>
    <form id="form1">
    <div id="ProgressBarSide" style="color: Silver; width: 200px; visibility: hidden;
        position: absolute;  left: 40%; top: 50%; margin-top: -32px">
        <span style="color: gray; font-size: 12px; text-align: center;">����ת�����Ժ�...</span><br />
        <div id="ProgressBar" style="background-color: Green; height: 16px; width: 0%; border-width: 1px;
            border-style: Solid;">
        </div>
    </div>
    <div style="text-align: center;">
        <br />
        <span style="color: Red; font-size: 12px;">��ʾ����������䵽ģ������������10����ʽ��word�ļ����������İ�ť����ת��</span><br />
        <input id="Button1" type="button" value="����ת��Word�ļ�" onclick="ConvertFiles()" />
        <div id="aDiv" style="display: none; color: Red; font-size: 12px;">
            <span>ת����ɣ���������ĵ�ַ�д��ļ���Ϊ��maker0.doc������maker9.doc����Word�ļ����鿴ת����Ч����<%=url %></span>
        </div>
    </div>
    <div style="width: 1px; height: 1px; overflow: hidden;">
        <iframe id="iframe1" name="iframe1" src="" ></iframe>
    </div>
    </form>
</body>
</html>
