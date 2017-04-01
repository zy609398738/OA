<%@ page language="java"
	import="java.util.*,com.zhuozhengsoft.pageoffice.*"
	pageEncoding="gb2312"%>
<%@ taglib uri="http://java.pageoffice.cn" prefix="po"%>
<%
PageOfficeCtrl poCtrl=new PageOfficeCtrl(request);
//设置服务器页面
poCtrl.setServerPage(request.getContextPath()+"/poserver.zz");
//添加自定义按钮
poCtrl.addCustomToolButton("另存MHT","saveAsMHT",1);
//设置保存页面
poCtrl.setSaveFilePage("SaveFile.jsp");
//打开Word文档
poCtrl.webOpen("doc/test.doc",OpenModeType.docNormalEdit,"张佚名");
poCtrl.setTagId("PageOfficeCtrl1");//此行必需
%>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
  <head>
   <title>Word文件另存为MHT</title>
</head>
<body>
    <script type="text/javascript">
        function saveAsMHT() {
            document.getElementById("PageOfficeCtrl1").WebSaveAsMHT();
            document.getElementById("PageOfficeCtrl1").Alert("MHT格式的文件已经保存到服务器上。");
            window.open("doc/test.mht" + "?r=" + Math.random());
        }
    </script>
    <form id="form1" >
    <div style=" width:1000px; height:800px;">
        <po:PageOfficeCtrl id="PageOfficeCtrl1">
        </po:PageOfficeCtrl>
    </div>
    </form>
</body>
</html>
