<%@ page language="java"
	import="java.util.*,com.zhuozhengsoft.pageoffice.*,com.zhuozhengsoft.pageoffice.wordwriter.*"
	pageEncoding="gb2312"%>
<%@ taglib uri="http://java.pageoffice.cn" prefix="po"%>
<%
//******************************׿��PageOffice�����ʹ��*******************************
	//����PageOffice���������
	PageOfficeCtrl poCtrl1 = new PageOfficeCtrl(request);
	poCtrl1.setServerPage(request.getContextPath()+"/poserver.zz"); //���б���
	
	//���ز˵���
	poCtrl1.setMenubar(false);
	//�����Զ��幤����
	poCtrl1.setCustomToolbar(false);
	
	//���ļ�
	poCtrl1.webOpen("doc/test.doc", OpenModeType.docNormalEdit, "����");
	poCtrl1.setTagId("PageOfficeCtrl1"); //���б���	
	
%>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
  <head>
    <title>ִ�к�����</title>

    <script language="javascript" type="text/javascript">
// <!CDATA[

        function Button1_onclick() {
            document.getElementById("PageOfficeCtrl1").RunMacro("myfunc", document.getElementById("textarea1").value);
        }

// ]]>
    </script>
</head>
<body>
    <form id="form1">
    <div style="font-size: 12px; line-height: 20px; border-bottom: dotted 1px #ccc; border-top: dotted 1px #ccc;
        padding: 5px;">
        ע�⣺<span style="background-color: Yellow;">ִ�С�ִ�к�myfunc����ť֮ǰ�������ú�MS Word�Ĺ���ִ�к���������á�
        <br />���ò������£���һ��Word�ĵ���������ļ�������ѡ������������ġ����������������á����������á�����ѡ�ϡ����ζ�VBA���̶���ģ�͵ķ��ʣ�V����</span>
    </div>
    <textarea id="textarea1" name="textarea1" style=" height:87px; width:486px;" rows="" cols="" >
    sub myfunc() 
msgbox "123" 
end sub
    </textarea>
    <input id="Button1" type="button" value="ִ�к�myfunc" onclick="return Button1_onclick()" />
    <div style=" height:800px;">
        <po:PageOfficeCtrl id="PageOfficeCtrl1">
        </po:PageOfficeCtrl>
    </div>
    </form>
</body>
</html>

