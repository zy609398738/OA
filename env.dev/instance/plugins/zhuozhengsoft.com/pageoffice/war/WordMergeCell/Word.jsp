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
	poCtrl1.setCustomToolbar(false);
	
	poCtrl1.webOpen("doc/template.doc", OpenModeType.docNormalEdit, "����");
	poCtrl1.setTagId("PageOfficeCtrl1"); //���б���	

%>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
  <head>
    <title>js �ϲ�Word�еĵ�Ԫ��</title>

    <script type="text/javascript">
//        // ���Һϲ�һ����Ԫ��
//        function mergeCellRight() {
//            var docObj = document.getElementById("PageOfficeCtrl1").Document;
//            docObj.Tables(1).Cell(1, 1).Select();   // ѡ��Ԫ��1��1��
//            docObj.Application.Selection.MoveRight(1, 1, 1); // ����ѡ��һ����Ԫ��
//            docObj.Application.Selection.Cells.Merge(); // �ϲ�
//        }
//        
//        // ���ºϲ�һ����Ԫ��
//        function mergeCellDown() {
//            var docObj = document.getElementById("PageOfficeCtrl1").Document;
//            docObj.Tables(1).Cell(2, 2).Select();   // ѡ��Ԫ��2��2��
//            docObj.Application.Selection.MoveDown(5, 1, 1); // �����ƶ�1����Ԫ��
//            docObj.Application.Selection.Cells.Merge(); // �ϲ�
//        }

        // ���Һϲ�һ����Ԫ��
        function mergeCellRight() {
            var mac = "Function myfunc()" + " \r\n"
                    + "ActiveDocument.Tables(1).Cell(1, 1).Select " + " \r\n" // ѡ��Ԫ��1��1��
                    + "Application.Selection.MoveRight 1, 1, 1 " + " \r\n"    // ����ѡ��һ����Ԫ��
                    + "Application.Selection.Cells.Merge " + " \r\n"          // �ϲ�
                    + "End Function " + " \r\n";
            document.getElementById("PageOfficeCtrl1").RunMacro("myfunc", mac);
        }

        // ���ºϲ�һ����Ԫ��
        function mergeCellDown() {
            var mac = "Function myfunc()" + " \r\n"
                    + "ActiveDocument.Tables(1).Cell(2, 2).Select " + " \r\n"// ѡ��Ԫ��2��2��
                    + "Application.Selection.MoveDown 5, 1, 1 " + " \r\n"    // �����ƶ�1����Ԫ��
                    + "Application.Selection.Cells.Merge " + " \r\n"         // �ϲ�
                    + "End Function " + " \r\n";
            document.getElementById("PageOfficeCtrl1").RunMacro("myfunc", mac);
        }
    </script>

</head>
<body>
    <form id="form1">
    <div style="font-size:12px; line-height:20px; border-bottom:dotted 1px #ccc;border-top:dotted 1px #ccc; padding:5px;">
    �ؼ����룺���Ҽ���ѡ�񡰲鿴Դ�ļ�������js����<span style="background-color:Yellow;">mergeCellRight()��mergeCellDown()</span>
    </div>
    <div style=" font-size:small">
        <input id="Button1" type="button" value="���Һϲ�һ����Ԫ��" onclick="mergeCellRight()"/>&nbsp;&nbsp;
        <input id="Button2" type="button" value="���ºϲ�һ����Ԫ��" onclick="mergeCellDown()" /><br />
    </div>
    <div style="width: 1200px; height: 700px;">
        <po:PageOfficeCtrl id ="PageOfficeCtrl1">
        </po:PageOfficeCtrl>
    </div>
    </form>
</body>
</html>
