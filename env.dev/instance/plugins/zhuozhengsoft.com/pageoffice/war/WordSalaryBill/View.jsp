<%@ page language="java"
	import="java.util.*,com.zhuozhengsoft.pageoffice.wordwriter.*,com.zhuozhengsoft.pageoffice.*,java.sql.*,java.text.NumberFormat,java.util.Locale,java.text.SimpleDateFormat,java.util.Date"
	pageEncoding="gb2312"%>
<%@ taglib uri="http://java.pageoffice.cn" prefix="po"%>
<%
	String err = "";
	String id = request.getParameter("ID").trim();
	PageOfficeCtrl poCtrl = new PageOfficeCtrl(request);
	//����WordDocment����
	WordDocument doc = new WordDocument();
	if (id != null && id.length() > 0) {
		String strSql = "select * from Salary where id =" + id
				+ " order by ID";
		 Class.forName("org.sqlite.JDBC");
	    String strUrl = "jdbc:sqlite:"
				+ this.getServletContext().getRealPath("demodata/") + "\\WordSalaryBill.db";
		Connection conn = DriverManager.getConnection(strUrl);
		Statement stmt = conn.createStatement();
		ResultSet rs = stmt.executeQuery(strSql);

		//����������
		DataRegion datareg = doc.openDataRegion("PO_table");

		SimpleDateFormat formatDate = new SimpleDateFormat("yyyy-MM-dd");
		NumberFormat formater = NumberFormat
				.getCurrencyInstance(Locale.CHINA);
		if (rs.next()) {
			//����������ֵ
			doc.openDataRegion("PO_ID").setValue(id);
			doc.openDataRegion("PO_UserName").setValue(
					rs.getString("UserName"));
			doc.openDataRegion("PO_DeptName").setValue(
					rs.getString("DeptName"));

			String saltotal = rs.getString("SalTotal");
			if (saltotal != null && saltotal != "") {
				doc.openDataRegion("SalTotal").setValue(saltotal);
			} else {
				doc.openDataRegion("SalTotal").setValue("��0.00");
			}

			String saldeduct = rs.getString("SalDeduct");
			if (saldeduct != null && saldeduct != "") {
				doc.openDataRegion("SalDeduct").setValue(saldeduct);
			} else {
				doc.openDataRegion("SalDeduct").setValue("��0.00");
			}
			String salcount = rs.getString("SalCount");
			if (salcount != null && salcount != "") {
				doc.openDataRegion("SalCount").setValue(salcount);
			} else {
				doc.openDataRegion("SalCount").setValue("��0.00");
			}
			String datatime = rs.getString("DataTime");
			if (datatime != null && datatime != "") {
				doc.openDataRegion("DataTime").setValue(datatime);
			} else {
				doc.openDataRegion("DataTime").setValue("");
			}

		} else {
			err = "<script>alert('δ��ø�Ա���Ĺ�����Ϣ��');location.href='index.jsp'</script>";
		}
		rs.close();
		conn.close();
	} else {
		err = "<script>alert('δ��øù�����Ϣ��ID��');location.href='index.jsp'</script>";
	}

	poCtrl.setWriter(doc);
	poCtrl.setServerPage(request.getContextPath()+"/poserver.zz");
	poCtrl.webOpen("doc/template.doc", OpenModeType.docSubmitForm,
			"someBody");
	poCtrl.setTagId("PageOfficeCtrl1");
%>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
	<head>
		<title>�鿴������Ϣ</title>

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
			<%=err%>
			<po:PageOfficeCtrl id="PageOfficeCtrl1"></po:PageOfficeCtrl>
		</div>
	</body>
</html>
