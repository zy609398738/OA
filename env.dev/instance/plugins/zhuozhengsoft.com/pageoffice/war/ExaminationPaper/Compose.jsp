<%@ page language="java"
	import="java.util.*,com.zhuozhengsoft.pageoffice.wordwriter.*,com.zhuozhengsoft.pageoffice.*"
	pageEncoding="gb2312"%>
<%@ taglib uri="http://java.pageoffice.cn" prefix="po"%>
<%
int pNum = 1;
String operateStr="";
        operateStr += "function Create(){\n";
        // document.getElementById('PageOfficeCtrl1').Document.Application 微软office VBA对象的根Application对象
        operateStr += "var obj = document.getElementById('PageOfficeCtrl1').Document.Application;\n";
        operateStr += "obj.Selection.EndKey(6);\n"; // 定位光标到文档末尾

        for (int i = 10; i > 0; i--)
        {
            String a = "on";
            String c = request.getParameter("check" + i);

            if (a.equals(c))
            {
                operateStr += "obj.Selection.TypeParagraph();"; //用来换行
                operateStr += "obj.Selection.Range.Text = '" + pNum + ".';\n"; // 用来生成题号
                // 下面两句代码用来移动光标位置
                operateStr += "obj.Selection.EndKey(5,1);\n";
                operateStr += "obj.Selection.MoveRight(1,1);\n";
                // 插入指定的题到文档中
                operateStr += "document.getElementById('PageOfficeCtrl1').InsertDocumentFromURL('Openfile.jsp?id=" + i + "');\n";
                pNum++;
            }
        }
        operateStr += "\n}\n";

      //******************************卓正PageOffice组件的使用*******************************
	PageOfficeCtrl poCtrl1 = new PageOfficeCtrl(request);
	poCtrl1.setServerPage(request.getContextPath()+"/poserver.zz"); //此行必须
	//隐藏菜单栏
	poCtrl1.setMenubar(false);
	poCtrl1.setCustomToolbar(false);
	poCtrl1.setCaption("生成试卷");
	poCtrl1.setJsFunction_AfterDocumentOpened("Create()");
	//打开Word文件
	poCtrl1.webOpen("doc/test.doc", OpenModeType.docNormalEdit, "张三");
	poCtrl1.setTagId("PageOfficeCtrl1"); //此行必须	


%>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
	<head>

		<title>在Word文档中动态生成 试卷</title>

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
