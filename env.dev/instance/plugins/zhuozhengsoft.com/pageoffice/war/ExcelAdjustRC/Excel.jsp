<%@ page language="java"
	import="java.util.*,com.zhuozhengsoft.pageoffice.*,com.zhuozhengsoft.pageoffice.excelwriter.*"
	pageEncoding="gb2312"%>
<%@ taglib uri="http://java.pageoffice.cn" prefix="po"%>
<%

   PageOfficeCtrl poCtrl=new PageOfficeCtrl(request);
   //设置服务器页面
  poCtrl.setServerPage(request.getContextPath()+"/poserver.zz");
  Workbook wb=new Workbook ();
  Sheet sheet1=wb.openSheet("Sheet1");
  //设置当工作表只读时，是否允许用户手动调整行列。
  sheet1.setAllowAdjustRC(true);
  poCtrl.setWriter(wb);//此行必须
  //添加自定义按钮
  poCtrl.addCustomToolButton("保存","Save()",1);
  poCtrl.setSaveFilePage("SaveFile.jsp");
  //打开Word文档
  poCtrl.webOpen("doc/test.xls",OpenModeType.xlsReadOnly,"张佚名");
  poCtrl.setTagId("PageOfficeCtrl1");//此行必需
%>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
  <head>
    <title>Excel只读模式下调整行高和列宽</title>
</head>
<body>
    <script type="text/javascript">
        function Save() {
            document.getElementById("PageOfficeCtrl1").WebSave();
        }
    </script>
    <form id="form1">
   <div>
      设置当工作表只读时，允许用户手动调整行列。</br>
      <div style="color:Red;">sheet1.setAllowAdjustRC(true);</div>
    </div>
    <div style=" width:100%; height:700px;">
        <po:PageOfficeCtrl id="PageOfficeCtrl1">
        </po:PageOfficeCtrl>
    </div>
    </form>
</body>
</html>
