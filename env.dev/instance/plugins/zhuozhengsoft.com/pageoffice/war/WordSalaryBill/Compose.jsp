<%@ page language="java"
	import="java.util.*,com.zhuozhengsoft.pageoffice.wordwriter.*,com.zhuozhengsoft.pageoffice.*,java.sql.*,java.text.NumberFormat,java.util.Locale,java.text.SimpleDateFormat,java.util.Date"
	pageEncoding="gb2312"%>
<%@ taglib uri="http://java.pageoffice.cn" prefix="po"%>
<%
	if (request.getParameter("ids").equals(null)
			|| request.getParameter("ids").equals("")) {
		return;
	}
	String idlist = request.getParameter("ids").trim();

	//�����ݿ��ж�ȡ����
	String strSql = "select * from Salary where ID in(" + idlist
			+ ") order by ID";

	 Class.forName("org.sqlite.JDBC");
	String strUrl = "jdbc:sqlite:"
				+ this.getServletContext().getRealPath("demodata/") + "\\WordSalaryBill.db";
	Connection conn = DriverManager.getConnection(strUrl);
	Statement stmt = conn.createStatement();
	ResultSet rs = stmt.executeQuery(strSql);

	SimpleDateFormat formatDate = new SimpleDateFormat("yyyy-MM-dd");
	NumberFormat formater = NumberFormat
			.getCurrencyInstance(Locale.CHINA);

	WordDocument doc = new WordDocument();
	DataRegion data = null;
	Table table = null;
	int i = 0;
	while (rs.next()) {
		data = doc.createDataRegion("reg" + i,
				DataRegionInsertType.Before, "[End]");
		data.setValue("[word]doc/template.doc[/word]");

		table = data.openTable(1);
		table.openCellRC(2, 1).setValue(rs.getString("ID"));

		//����Ԫ��ֵ
		table.openCellRC(2, 2).setValue(rs.getString("UserName"));
		table.openCellRC(2, 3).setValue(rs.getString("DeptName"));

		String saltotal = rs.getString("SalTotal");
		if (saltotal != null && saltotal != "") {
			table.openCellRC(2, 4).setValue(saltotal);
			//out.print(rs.getString("SalTotal"));
		} else {
			table.openCellRC(2, 4).setValue("��0.00");
		}

		String saldeduct = rs.getString("SalDeduct");
		if (saldeduct != null && saldeduct != "") {
			table.openCellRC(2, 5).setValue(saldeduct);
		} else {
			table.openCellRC(2, 5).setValue("��0.00");
		}
		String salcount = rs.getString("SalCount");
		if (salcount != null && salcount != "") {
			table.openCellRC(2, 6).setValue(salcount);
		} else {
			table.openCellRC(2, 6).setValue("��0.00");
		}
		String datatime = rs.getString("DataTime");
		if (datatime != null && datatime != "") {
			table.openCellRC(2, 7).setValue(datatime);
		} else {
			table.openCellRC(2, 7).setValue("");
		}
		i++;
	}

	conn.close();

	// ����PageOffice�������ҳ��
	PageOfficeCtrl pCtrl = new PageOfficeCtrl(request);
	pCtrl.setWriter(doc);
	pCtrl.setServerPage(request.getContextPath()+"/poserver.zz");
	pCtrl.setCaption("���ɹ�����");
	pCtrl.setCustomToolbar(false);
	pCtrl.webOpen("doc/test.doc", OpenModeType.docNormalEdit, "somebody");
	pCtrl.setTagId("PageOfficeCtrl1");
%>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
	<head>
		<title>���ɹ�����</title>

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
		<div style="width: 1000px; height: 800px;">
			<po:PageOfficeCtrl id="PageOfficeCtrl1"></po:PageOfficeCtrl>
		</div>
	</body>
</html>
