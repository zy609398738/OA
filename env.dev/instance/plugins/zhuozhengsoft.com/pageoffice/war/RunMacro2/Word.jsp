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
    <title>ִ���з���ֵ�ĺ�����</title>

    <script language="javascript" type="text/javascript">

        function Button1_onclick() {
            var value=document.getElementById("PageOfficeCtrl1").RunMacro("myFunc1", document.getElementById("textarea1").value);
           document.getElementById("PageOfficeCtrl1").Alert("myFunc1��ķ���ֵ�ǣ�"+value);
        }
	
	function RunMacro2(){
  		var value=document.getElementById("PageOfficeCtrl1").RunMacro("myFunc2", 'Function myFunc2() \r\n myFunc2 = "123" \r\n End Function');
 		document.getElementById("PageOfficeCtrl1").Alert(value);
  	}


    </script>
</head>
<body>
    <form id="form1">
    <div style="font-size: 12px; line-height: 20px; border-bottom: dotted 1px #ccc; border-top: dotted 1px #ccc;
        padding: 5px;">
        ע�⣺<span style="background-color: Yellow;">ִ�С�ִ�к�myFunc����ť֮ǰ�������ú�MS Word�Ĺ���ִ�к���������á�
        <br />���ò������£���һ��Word�ĵ���������ļ�������ѡ������������ġ����������������á����������á�����ѡ�ϡ����ζ�VBA���̶���ģ�͵ķ��ʣ�V����</span>
    </div>
    <textarea id="textarea1" name="textarea1" style=" height:87px; width:486px;" rows="" cols="" >
   Function myFunc1() 
   myFunc1 = "123"
   End Function
    </textarea>
    <input id="Button1" type="button" value="ִ�к�myFunc1" onclick="return Button1_onclick()" />
    <input id="Button2" type="button" value="ִ�к�myFunc2" onclick="RunMacro2()" />
    <div style=" height:800px;">
        <po:PageOfficeCtrl id="PageOfficeCtrl1">
        </po:PageOfficeCtrl>
    </div>
    </form>
</body>
</html>

