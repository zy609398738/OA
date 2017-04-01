<%@ page language="java" 
	import="java.util.*,com.zhuozhengsoft.pageoffice.*,com.zhuozhengsoft.pageoffice.wordwriter.*" 
	pageEncoding="gb2312"%>
<%@ taglib uri="http://java.pageoffice.cn" prefix="po" %>
<%
		WordDocument doc = new WordDocument();
        doc.getTemplate().defineDataTag("{ �׷� }");
		doc.getTemplate().defineDataTag("{ �ҷ� }");
		doc.getTemplate().defineDataTag("{ ������ }");
		doc.getTemplate().defineDataTag("�� ��ͬ���� ��");
		doc.getTemplate().defineDataTag("�� ��ͬ��� ��");

		PageOfficeCtrl poCtrl = new PageOfficeCtrl(request);
        poCtrl.addCustomToolButton("����", "Save()", 1);
        poCtrl.addCustomToolButton("�������ݱ�ǩ", "ShowDefineDataTags()", 20);

        poCtrl.setServerPage(request.getContextPath()+"/poserver.zz");
        poCtrl.setSaveFilePage("SaveFile.jsp");

        poCtrl.setTheme(ThemeType.Office2007);
        poCtrl.setBorderStyle(BorderStyleType.BorderThin);
        poCtrl.setWriter(doc);
        poCtrl.webOpen("doc/test.doc", OpenModeType.docNormalEdit, "zhangsan");
        poCtrl.setTagId("PageOfficeCtrl1");
 %>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
    <title></title>
	<script type="text/javascript">
        //��ȡ��̨�����Tag �ַ���
        function getTagNames() {
            var tagNames = document.getElementById("PageOfficeCtrl1").DefineTagNames;
            return tagNames;
        }
        
        //��λTag
        function locateTag(tagName) {
            
            var appSlt = document.getElementById("PageOfficeCtrl1").Document.Application.Selection;
            var bFind = false;
            //appSlt.HomeKey(6);
            appSlt.Find.ClearFormatting();
            appSlt.Find.Replacement.ClearFormatting();

            bFind = appSlt.Find.Execute(tagName);
            if (!bFind) {
                document.getElementById("PageOfficeCtrl1").Alert("���������ĵ�ĩβ��");
                appSlt.HomeKey(6);
            }
            window.focus();

        }

        //���Tag
        function addTag(tagName) {
            try {
                var tmpRange = document.getElementById("PageOfficeCtrl1").Document.Application.Selection.Range;
                tmpRange.Text = tagName;
                tmpRange.Select();
                return "true";
            } catch (e) {
                return "false";
            }
        }
        
        //ɾ��Tag
        function delTag(tagName) {
            var tmpRange = document.getElementById("PageOfficeCtrl1").Document.Application.Selection.Range;
            
            if (tagName == tmpRange.Text) {
                tmpRange.Text = "";
                return "true";
            }
            else
                return "false";

        }
   
    </script>
    
    <script type="text/javascript">
        function Save() {
            document.getElementById("PageOfficeCtrl1").WebSave();
        }
        function ShowDefineDataTags() {
            document.getElementById("PageOfficeCtrl1").ShowHtmlModelessDialog("DataTagDlg.htm", "parameter=xx", "left=300px;top=390px;width=430px;height=410px;frame:no;");

        }

    </script>
   

</head>
<body>
    <form action="">
    <div style="width: auto; height: 600px;">
        <po:PageOfficeCtrl id="PageOfficeCtrl1" >
        </po:PageOfficeCtrl>
    </div>
    </form>
</body>
</html>