<%@ page language="java"
	import="java.util.*,com.zhuozhengsoft.pageoffice.*"
	pageEncoding="gb2312"%>
<%@page import="com.zhuozhengsoft.pageoffice.excelwriter.*"%>
<%@page import="java.awt.Color"%>
<%@page import="java.text.*"%>
<%@ taglib uri="http://java.pageoffice.cn" prefix="po"%>
<%

	String tempFileName = request.getParameter("temp");

	//设置PageOfficeCtrl控件的服务页面
	PageOfficeCtrl poCtrl1 = new PageOfficeCtrl(request);
	poCtrl1.setServerPage(request.getContextPath()+"/poserver.zz"); //此行必须
	poCtrl1.setCaption("简单的给Excel赋值");
	
	//定义Workbook对象
	Workbook workBook = new Workbook();
	//定义Sheet对象，"Sheet1"是打开的Excel表单的名称
	Sheet sheet = workBook.openSheet("Sheet1");
	
	//定义Table对象，参数“report”就是Excel模板中定义的单元格区域的名称
	Table table = sheet.openTableByDefinedName("report", 10, 5, true);
	//给区域中的单元格赋值
    table.getDataFields().get(0).setValue("轮胎");
    table.getDataFields().get(1).setValue("100");
    table.getDataFields().get(2).setValue("120");
    table.getDataFields().get(3).setValue("500");
    table.getDataFields().get(4).setValue("120%");
    //循环下一行
    table.nextRow();
    //关闭table对象
    table.close();
    
    //定义单元格对象，参数“year”就是Excel模板中定义的单元格的名称
    Cell cellYear = sheet.openCellByDefinedName("year");
    // 给单元格赋值
    Calendar c=new GregorianCalendar();
	int year=c.get(Calendar.YEAR);//获取年份 
    cellYear.setValue(year + "年");
    
    Cell cellName = sheet.openCellByDefinedName("name");
    cellName.setValue("张三");
	
	poCtrl1.setWriter(workBook);
	
	//隐藏菜单栏
	poCtrl1.setMenubar(false);
	
	//poCtrl1.setSaveDataPage("SaveData.jsp");
	//poCtrl1.addCustomToolButton("保存", "Save()", 1);
	//打开Word文件
	poCtrl1.webOpen("doc/" + tempFileName, OpenModeType.xlsNormalEdit, "张三");
	poCtrl1.setTagId("PageOfficeCtrl1"); //此行必须
%>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
	<head>
		<title>给Excel文档中定义名称的区域赋值</title>

		<meta http-equiv="pragma" content="no-cache">
		<meta http-equiv="cache-control" content="no-cache">
		<meta http-equiv="expires" content="0">
		<meta http-equiv="keywords" content="keyword1,keyword2,keyword3">
		<meta http-equiv="description" content="This is my page">
		<!--
	<link rel="stylesheet" type="text/css" href="styles.css">
	-->
	<script type="text/javascript">
        function Save() {
            document.getElementById("PageOfficeCtrl1").WebSave();
        }
    </script>
	</head>

	<body>
		<a href="Default.jsp">返回首页</a><br/>
		模板一填充数据后显示的效果
		<div style="width: 1000px; height: 900px;">
			<po:PageOfficeCtrl id="PageOfficeCtrl1"></po:PageOfficeCtrl>
		</div>
	</body>
</html>
