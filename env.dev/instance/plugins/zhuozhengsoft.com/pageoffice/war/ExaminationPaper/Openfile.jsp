<%@ page language="java"
	import="java.util.*,java.sql.*,javax.servlet.*,javax.servlet.http.*,java.io.*"
	pageEncoding="gb2312"%>
<%
	String err = "";
	if (request.getParameter("id") != null
			&& request.getParameter("id").trim().length() > 0) {
		String id = request.getParameter("id");
		Class.forName("org.sqlite.JDBC");
			String strUrl = "jdbc:sqlite:"
				+ this.getServletContext().getRealPath("demodata/") + "\\ExaminationPaper.db";
		Connection conn = DriverManager.getConnection(strUrl);
		Statement stmt = conn.createStatement();
		String strSql = "select * from stream where id =" + id;
		ResultSet rs = stmt.executeQuery(strSql);
		if (rs.next()) {
			//******��ȡ�����ļ�������ļ��� ��ʼ*******************************
			byte[] imageBytes = rs.getBytes("Word");
			int fileSize = imageBytes.length;

			response.reset();
			response.setContentType("application/msword"); // application/x-excel, application/ms-powerpoint, application/pdf
			response.setHeader("Content-Disposition", "attachment; filename=down.doc"); //fileNӦ���Ǳ�����(utf-8)
			response.setContentLength(fileSize);

			OutputStream outputStream = response.getOutputStream();
			outputStream.write(imageBytes);

			outputStream.flush();
			outputStream.close();
			outputStream = null;
			//******��ȡ�����ļ�������ļ��� ����*******************************	
		} else {
			err = "δ����ļ�����Ϣ";
		}
		rs.close();
		conn.close();
	} else {
		err = "δ����ļ���ID";
		//out.print(err);
	}
	if (err.length() > 0)
		err = "<script>alert(" + err + ");</script>";
%>
