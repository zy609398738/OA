<%@ page language="java"
	import="java.util.*,java.sql.*,com.zhuozhengsoft.pageoffice.*"
	pageEncoding="gb2312"%>
<%
	FileSaver fs = new FileSaver(request, response);
	fs.saveToFile(request.getSession().getServletContext().getRealPath("SendParameters/doc") + "/" + fs.getFileName());
	int id = 0;
	String userName = "";
	int age = 0;
	String sex = "";

	//��ȡͨ��Url���ݹ�����ֵ
	if (request.getParameter("id") != null
			&& request.getParameter("id").trim().length() > 0)
		id = Integer.parseInt(request.getParameter("id").trim());

	//��ȡͨ����ҳ��ǩ�ؼ����ݹ����Ĳ���ֵ��ע��fs.getFormField("������")�����еĲ�������ֵ��ǩ�ġ�name�����Զ�����Id

	//��ȡͨ���ı���<input type="text" />��ǩ���ݹ�����ֵ
	if (fs.getFormField("userName") != null
			&& fs.getFormField("userName").trim().length() > 0) {
		userName = fs.getFormField("userName");
	}

	//��ȡͨ�������򴫵ݹ�����ֵ
	if (fs.getFormField("age") != null
			&& fs.getFormField("age").trim().length() > 0) {
		age = Integer.parseInt(fs.getFormField("age"));
	}

	//��ȡͨ��<select>��ǩ���ݹ�����ֵ
	if (fs.getFormField("selSex") != null
			&& fs.getFormField("selSex").trim().length() > 0) {
		sex = fs.getFormField("selSex");
	}
	Class.forName("org.sqlite.JDBC");//���������������
	String strUrl = "jdbc:sqlite:"
				+ this.getServletContext().getRealPath("demodata/") + "\\SendParameters.db";
	Connection conn = DriverManager.getConnection(strUrl);
	Statement stmt = conn.createStatement();
	String strsql = "Update Users set UserName = '" + userName
			+ "', age = " + age + ",sex = '" + sex + "' where id = "
			+ id;
	stmt.executeUpdate(strsql);
	conn.close();
	fs.showPage(300, 200);
	fs.close();
%>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
	<head>

		<title>My JSP 'SaveFile.jsp' starting page</title>

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
<div>
    ���ݵĲ���Ϊ��<br />
    id:<%=id %><br />
    userName:<%=userName%><br />
    age:<%=age%><br />
    sex:<%=sex%><br />
    </div>
	</body>
</html>
