<%@ page language="java"
	import="java.util.*,java.sql.*,javax.servlet.*,javax.servlet.http.*,com.zhuozhengsoft.pageoffice.wordwriter.*,com.zhuozhengsoft.pageoffice.*"
	pageEncoding="gb2312"%>
<%@ taglib uri="http://java.pageoffice.cn" prefix="po"%>
<%
	Class.forName("org.sqlite.JDBC");
			String strUrl = "jdbc:sqlite:"
				+ this.getServletContext().getRealPath("demodata/") + "\\ExaminationPaper.db";
	Connection conn = DriverManager.getConnection(strUrl);
	Statement stmt = conn.createStatement();
	String strSql = "select * from stream";
	ResultSet rs = stmt.executeQuery(strSql);

	String temp = "PO_begin1";//�洢������������
	int num = 1;//������
	WordDocument doc = new WordDocument();
	while (rs.next()) {
		String i = rs.getString("ID");
		String chk = request.getParameter("check" + i);
		if(chk!=null && chk.equalsIgnoreCase("on")){			
			if(i.equalsIgnoreCase("1")){
				DataRegion dataNum = doc.openDataRegion("PO_begin1");
				dataNum.setValue("1.\t");
				DataRegion dataRegion = doc.createDataRegion("PO_begin"+(i+1),DataRegionInsertType.After,"PO_begin1");
				dataRegion.setValue("[word]Openfile.jsp?id=" + i + "[/word]");
			}
			else{
				DataRegion dataNum = doc.createDataRegion("PO_"+num,DataRegionInsertType.After,temp);
				dataNum.setValue(num+".\t");
				DataRegion dataRegion = doc.createDataRegion("PO_begin"+(i+1),DataRegionInsertType.After,"PO_"+num);
				dataRegion.setValue("[word]Openfile.jsp?id=" + i + "[/word]");
			}
			temp = "PO_begin"+(i+1);
			num ++;
		}
	}
	rs.close();
	stmt.close();
	conn.close();

    //******************************׿��PageOffice�����ʹ��*******************************
	PageOfficeCtrl poCtrl1 = new PageOfficeCtrl(request);
	poCtrl1.setServerPage(request.getContextPath()+"/poserver.zz"); //���б���
	//���ز˵���
	poCtrl1.setMenubar(false);
	poCtrl1.setCustomToolbar(false);
	poCtrl1.setCaption("�����Ծ�");
	poCtrl1.setWriter(doc);
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
	<body>
		<div style="width: auto; height: 700px;">
			<po:PageOfficeCtrl id="PageOfficeCtrl1"></po:PageOfficeCtrl>
		</div>
	</body>
</html>
