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
	//����Զ��尴ť
	poCtrl1.addCustomToolButton("������ǩ","addBookMark",5);
	poCtrl1.addCustomToolButton("ɾ����ǩ","delBookMark",5);

	poCtrl1.webOpen("doc/template.doc", OpenModeType.docNormalEdit, "����");
	poCtrl1.setTagId("PageOfficeCtrl1"); //���б���	

%>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
  <head>
    <title>��word��ǰ��괦������ǩ</title>

</head>
<body>
    <form id="form1">
    <div style=" font-size:small; color:Red;">
        <label>�ؼ����룺���Ҽ���ѡ�񡰲鿴Դ�ļ�������js������</label>
        <label>function  addBookMark() �� function delBookMark()</label>
        <br/>
    <label>������ǩʱ����������Ҫ�������ǩ���ƺ��ı���ɾ����ǩʱ������������Ӧ����ǩ���ƣ�</label><br />
        <label>��ǩ���ƣ�</label><input id="txtBkName" type="text" value="test" />
        &nbsp;&nbsp;<label>��ǩ�ı���</label><input id="txtBkText" type="text" value="[����]" />
    </div>
    <input id="Button1" type="button" onclick="addBookMark();" value="������ǩ" />
    <input id="Button2" type="button" onclick="delBookMark()" value="ɾ����ǩ" />
    <div style=" width:auto; height:700px;">
        <po:PageOfficeCtrl id ="PageOfficeCtrl1" >
        </po:PageOfficeCtrl>
    </div>
    </form>
   <script type="text/javascript">
        //        var range;
        //    function  addBookMark()
        //    {
        //        var obj = document.getElementById("PageOfficeCtrl1").Document;
        //        var bkName = document.getElementById("txtBkName").value;
        //        var bkText = document.getElementById("txtBkText").value;
        //        range = obj.Application.Selection.Range;
        //        range.Text = bkText;
        //        obj.Bookmarks.Add(bkName,  range);
        //        obj.Bookmarks(bkName).Select();
        //    }
        //    function delBookMark()
        //    {
        //        var bkName = document.getElementById("txtBkName").value;
        //        var obj = document.getElementById("PageOfficeCtrl1").Document;
        //        range = obj.Application.Selection.Range;
        //        if(obj.Bookmarks.Exists(bkName)){
        //            obj.Bookmarks(bkName).Select();
        //            obj.Application.Selection.Range.Text = "";
        //        }
        //
        //    }

        var bkName = document.getElementById("txtBkName").value;
        var bkText = document.getElementById("txtBkText").value;


        function addBookMark() {
	    bkName = document.getElementById("txtBkName").value;
            bkText = document.getElementById("txtBkText").value;

            var mac = "Function myfunc()" + " \r\n"
                    + "Dim r As Range " + " \r\n"
                    + "Set r = Application.Selection.Range " + " \r\n"
                    + "r.Text = \"" + bkText + "\"" + " \r\n"
                    + "Application.ActiveDocument.Bookmarks.Add Name:=\"" + bkName + "\", Range:=r " + " \r\n"
                    + "Application.ActiveDocument.Bookmarks(\"" + bkName + "\").Select " + " \r\n"
                    + "End Function " + " \r\n";
            document.getElementById("PageOfficeCtrl1").RunMacro("myfunc", mac);
        }
        function delBookMark() {
            var mac = "Function myfunc()" + " \r\n"
                    + "If  Application.ActiveDocument.Bookmarks.Exists(\"" + bkName + "\") Then " + " \r\n"
                    + "    Application.ActiveDocument.Bookmarks(\"" + bkName + "\").Select " + " \r\n"
                    + "    Application.Selection.Range.Text = \"\" " + " \r\n"
                    + "End If " + " \r\n"
                    + "End Function " + " \r\n";
            document.getElementById("PageOfficeCtrl1").RunMacro("myfunc", mac);
        }
    </script>
</body>
</html>