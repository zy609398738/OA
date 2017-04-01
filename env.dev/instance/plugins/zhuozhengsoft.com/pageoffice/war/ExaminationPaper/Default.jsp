<%@ page language="java" import="java.util.*,java.sql.*"
	pageEncoding="gb2312"%>
<%
	Class.forName("org.sqlite.JDBC");
			String strUrl = "jdbc:sqlite:"
				+ this.getServletContext().getRealPath("demodata/") + "\\ExaminationPaper.db";
	Connection conn = DriverManager.getConnection(strUrl);
	Statement stmt = conn.createStatement();
	ResultSet rs = stmt.executeQuery("Select * from stream");
	boolean flg = false;//标识是否有数据
	StringBuilder strHtmls = new StringBuilder();
	while (rs.next()) {
		flg = true;
		String pID = rs.getString("ID");
		strHtmls.append("<tr  style='background-color:white;'>");
		strHtmls.append("<td><input name='check" + pID + "'  type='checkbox' /></td>");
		strHtmls.append("<td>选择题-" + pID + "</td>");
		strHtmls.append("<td><a href='Edit.jsp?id=" + pID + "'>编辑</a></td>");
		strHtmls.append("</tr>");
	}

	if (!flg) {
		strHtmls.append("<tr>\r\n");
		strHtmls.append("<td width='100%' height='100' align='center'>对不起，暂时没有可以操作的数据。\r\n");
		strHtmls.append("</td></tr>\r\n");
	}
%>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
	<head>
		<title>无标题页</title>
	</head>
	<body style="text-align: center">
	<script type="text/javascript">
		// JS方式生成试卷
		function button1Click(){
			document.getElementById("form1").action = "Compose.jsp";
			document.getElementById("form1").submit();
		}
		// 后台编程生成试卷
		function button2Click(){
			document.getElementById("form1").action = "Compose2.jsp";
			document.getElementById("form1").submit();
		}
	</script>
		<div style="color: Red">
			1.可以点“操作”栏中的“编辑”来编辑各个试题&nbsp;&nbsp;&nbsp;&nbsp;
		</div>
		<div style="color: Red">
			2.可以选择多个试题，点“生成试卷”按钮，生成试卷
		</div>
		<form id="form1" name="form1" method="post" action="Compose.jsp">
			<table style="background-color: #999; width: 600px;">
				<%=strHtmls %>
			</table>
			<br />
			<input type="button" onclick="button1Click();" id="Button1" value="JS方式生成试卷" /><span>（所有版本）</span>
			<input type="button" onclick="button2Click();" id="Button2" value="后台编程生成试卷" /><span style="color:Red;">（专业版、企业版）</span>
		</form>
	</body>
</html>
