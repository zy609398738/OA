<%@ page language="java"
	import="java.util.*,com.zhuozhengsoft.pageoffice.wordwriter.*,com.zhuozhengsoft.pageoffice.*"
	pageEncoding="gb2312"%>
<%@ taglib uri="http://java.pageoffice.cn" prefix="po"%>
<%
int pNum = 1;
String operateStr="";
        operateStr += "function Create(){\n";
        // document.getElementById('PageOfficeCtrl1').Document.Application ΢��office VBA����ĸ�Application����
        operateStr += "var obj = document.getElementById('PageOfficeCtrl1').Document.Application;\n";
        operateStr += "obj.Selection.EndKey(6);\n"; // ��λ��굽�ĵ�ĩβ

        for (int i = 10; i > 0; i--)
        {
            String a = "on";
            String c = request.getParameter("check" + i);

            if (a.equals(c))
            {
                operateStr += "obj.Selection.TypeParagraph();"; //��������
                operateStr += "obj.Selection.Range.Text = '" + pNum + ".';\n"; // �����������
                // ����������������ƶ����λ��
                operateStr += "obj.Selection.EndKey(5,1);\n";
                operateStr += "obj.Selection.MoveRight(1,1);\n";
                // ����ָ�����⵽�ĵ���
                operateStr += "document.getElementById('PageOfficeCtrl1').InsertDocumentFromURL('Openfile.jsp?id=" + i + "');\n";
                pNum++;
            }
        }
        operateStr += "\n}\n";

      //******************************׿��PageOffice�����ʹ��*******************************
	PageOfficeCtrl poCtrl1 = new PageOfficeCtrl(request);
	poCtrl1.setServerPage(request.getContextPath()+"/poserver.zz"); //���б���
	//���ز˵���
	poCtrl1.setMenubar(false);
	poCtrl1.setCustomToolbar(false);
	poCtrl1.setCaption("�����Ծ�");
	poCtrl1.setJsFunction_AfterDocumentOpened("Create()");
	//��Word�ļ�
	poCtrl1.webOpen("doc/test.doc", OpenModeType.docNormalEdit, "����");
	poCtrl1.setTagId("PageOfficeCtrl1"); //���б���	


%>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
	<head>

		<title>��Word�ĵ��ж�̬���� �Ծ�</title>

		<meta http-equiv="pragma" content="no-cache">
		<meta http-equiv="cache-control" content="no-cache">
		<meta http-equiv="expires" content="0">
		<meta http-equiv="keywords" content="keyword1,keyword2,keyword3">
		<meta http-equiv="description" content="This is my page">
		<!--
	<link rel="stylesheet" type="text/css" href="styles.css">
	-->

	</head>
	<script type="text/javascript">
         <%=operateStr %>
    </script>
	<body>
		<div style="width: auto; height: 700px;">
			<po:PageOfficeCtrl id="PageOfficeCtrl1"></po:PageOfficeCtrl>
		</div>
	</body>
</html>
