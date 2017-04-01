<%@ page language="java"
	import="java.util.*,com.zhuozhengsoft.pageoffice.*"
	pageEncoding="gb2312"%>
<%@ taglib uri="http://java.pageoffice.cn" prefix="po"%>
<%
PageOfficeCtrl poCtrl=new PageOfficeCtrl(request);
//设置服务器页面
poCtrl.setServerPage(request.getContextPath()+"/poserver.zz");
poCtrl.addCustomToolButton("插入分页符", "InsertPageBreak()", 1);
//打开Word文档
poCtrl.webOpen("doc/test.doc",OpenModeType.docNormalEdit,"张佚名");
poCtrl.setTagId("PageOfficeCtrl1");//此行必需
%>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
  <head>
   <title>在word文档中光标处插入分页符</title>
</head>
<body>
    <script type="text/javascript">
        function InsertPageBreak() {
          document.getElementById("PageOfficeCtrl1").RunMacro("AddPage", "sub AddPage() \r\n Application.Selection.InsertBreak(7) \r\n End Sub");
        }    
       
    </script> 
     <div style="font-size: 12px; line-height: 20px; border-bottom: dotted 1px #ccc; border-top: dotted 1px #ccc;
        padding: 5px;">
        <span style="color: red;">操作说明：</span>手动定位光标到当前文档中要插入分页符的位置，然后点“插入分页符”的按钮。<br />
        关键代码：点右键，选择“查看源文件”，看js函数<span style="background-color: Yellow;">InsertPageBreak()</span>
    </div>
    <div style=" width:auto; height:700px;">
        <po:PageOfficeCtrl id="PageOfficeCtrl1">
        </po:PageOfficeCtrl>
    </div>
</body>
</html>
