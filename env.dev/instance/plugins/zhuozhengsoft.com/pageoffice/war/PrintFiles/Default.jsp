<%@ page language="java" 
import="java.util.*,com.zhuozhengsoft.pageoffice.*"
 pageEncoding="gb2312"%>

<%
String url=request.getSession().getServletContext().getRealPath("PrintFiles/doc/"+"/");
%>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
<head>
    <title></title>

    <script type="text/javascript">
        count = 1;
        window.myFunc = function() {
            
            if (count < 5) {
                //���ý�����
                document.getElementById("ProgressBarSide").style.visibility = "visible";
                document.getElementById("ProgressBar").style.width = (count) * 25 - 1 + "%";

                //�����ĵ���ӡҳ�棨�ɴ��Σ�
                document.getElementById("iframe1").src = "Print.jsp?id=" + count;
                count++;
            } else {
                //���ؽ�����div
                document.getElementById("ProgressBarSide").style.visibility = "hidden";
                count = 1;
                //���ý�����
                document.getElementById("ProgressBar").style.width = "0%";
                document.getElementById("aDiv").style.display = "";
                //alert('����ת����ϣ�');
            }
        };

        //����ת�����
        function ConvertFiles() {
            myFunc();
        }
    </script>

</head>
<body>
    <form id="form1">
    <div id="ProgressBarSide" style="color: Silver; width: 200px; visibility: hidden;
        position: absolute;  left: 40%; top: 50%; margin-top: -32px">
        <span style="color: gray; font-size: 12px; text-align: center;">�������ɲ���ӡ���Ժ�...</span><br />
	<div style=" border:solid 1px green;">
        	<div id="ProgressBar" style="background-color: Green; height: 16px; width: 0%; border-width: 1px;border-style: Solid;">
        	</div>
	</div>
    </div>
    <div style="text-align: center;">
        <br />
        <span style="color: Red; font-size: 12px;">��ʾ����������䵽ģ������������4����ʽ��word�ļ�����ӡ�������������İ�ť�鿴Ч��</span><br />
        <input id="Button1" type="button" value="�������ɺʹ�ӡWord�ļ�" onclick="ConvertFiles()" />
        <div id="aDiv" style="display: none; color: Red; font-size: 12px;">
            <span>ִ����ϣ���������ĵ�ַ�д��ļ���Ϊ��maker1.doc������maker4.doc����Word�ļ����鿴���ɵ������ļ���<%=url %></span>
        </div>
    </div>
    <div style="width: 1px; height: 1px; overflow: hidden;">
        <iframe id="iframe1" name="iframe1" src="" ></iframe>
    </div>
    </form>
</body>
</html>
