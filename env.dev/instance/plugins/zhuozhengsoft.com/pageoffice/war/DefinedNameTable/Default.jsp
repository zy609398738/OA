<%@ page language="java" import="java.util.*" pageEncoding="gb2312"%>
<%
String path = request.getContextPath();
String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
%>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
  <head>
   
    <title>�Զ���Excelģ��</title>
    
	<meta http-equiv="pragma" content="no-cache">
	<meta http-equiv="cache-control" content="no-cache">
	<meta http-equiv="expires" content="0">    
	<meta http-equiv="keywords" content="keyword1,keyword2,keyword3">
	<meta http-equiv="description" content="This is my page">
	<!--
	<link rel="stylesheet" type="text/css" href="styles.css">
	-->

  </head>
  
  <body style="text-align:center;">
	<div style="text-align:left;margin-top:30px;">
  	    <span>1����ʾ��Excelģ���ж��������Ƶ�һ������ֵ������ʱ�ɻ�ȡ�������ڸ���Ԫ������ݣ�</span><br/><br/>
    	<a href="ExcelFill.jsp">openTableByDefinedName�����ļ�ʹ��</a>
  	</div>
    <div style="text-align:left; margin-top:30px;">
    	<span>2����ʾ����ڲ��޸Ĵ��������£�������ݵ��û��Զ����������ͬ��Excelģ�壬��ʾ����ͬ��Ч����</span><br/><br/>
    	<a href="ExcelFill2.jsp?temp=temp1.xls">�Զ���Excelģ��һ��ʾЧ��</a><br/><br/>
    	<a href="ExcelFill2.jsp?temp=temp2.xls">�Զ���Excelģ�����ʾЧ��</a>
    </div>
    <div style="text-align:left; margin-top:30px;">
    	<span>3����ʾopenTable��openTableByDefinedName����������ݵ���ͬExcelģ�壬�ڶ�̬�������ݰ�ʵ�����������Զ���չ������£����ɵ��ļ���ʾ����ͬ��Ч����</span><br/><br/>
    	<a href="ExcelFill6.jsp">��ģ�壨test4.xls��</a><br/><br/>
    	<a href="ExcelFill4.jsp">��openTable������ݵ�ģ�壨test4.xls�����Ч���������ֱ���ص�������</a><br/><br/>
    	<a href="ExcelFill5.jsp">��openTableByDefinedName������ݵ�ģ�壨test4.xls�����Ч��������񻥲�Ӱ��</a>
    </div>
  </body>
</html>
