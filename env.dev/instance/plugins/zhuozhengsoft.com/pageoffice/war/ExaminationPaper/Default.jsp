<%@ page language="java" import="java.util.*,java.sql.*"
	pageEncoding="gb2312"%>
<%
	Class.forName("org.sqlite.JDBC");
			String strUrl = "jdbc:sqlite:"
				+ this.getServletContext().getRealPath("demodata/") + "\\ExaminationPaper.db";
	Connection conn = DriverManager.getConnection(strUrl);
	Statement stmt = conn.createStatement();
	ResultSet rs = stmt.executeQuery("Select * from stream");
	boolean flg = false;//��ʶ�Ƿ�������
	StringBuilder strHtmls = new StringBuilder();
	while (rs.next()) {
		flg = true;
		String pID = rs.getString("ID");
		strHtmls.append("<tr  style='background-color:white;'>");
		strHtmls.append("<td><input name='check" + pID + "'  type='checkbox' /></td>");
		strHtmls.append("<td>ѡ����-" + pID + "</td>");
		strHtmls.append("<td><a href='Edit.jsp?id=" + pID + "'>�༭</a></td>");
		strHtmls.append("</tr>");
	}

	if (!flg) {
		strHtmls.append("<tr>\r\n");
		strHtmls.append("<td width='100%' height='100' align='center'>�Բ�����ʱû�п��Բ��������ݡ�\r\n");
		strHtmls.append("</td></tr>\r\n");
	}
%>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
	<head>
		<title>�ޱ���ҳ</title>
	</head>
	<body style="text-align: center">
	<script type="text/javascript">
		// JS��ʽ�����Ծ�
		function button1Click(){
			document.getElementById("form1").action = "Compose.jsp";
			document.getElementById("form1").submit();
		}
		// ��̨��������Ծ�
		function button2Click(){
			document.getElementById("form1").action = "Compose2.jsp";
			document.getElementById("form1").submit();
		}
	</script>
		<div style="color: Red">
			1.���Ե㡰���������еġ��༭�����༭��������&nbsp;&nbsp;&nbsp;&nbsp;
		</div>
		<div style="color: Red">
			2.����ѡ�������⣬�㡰�����Ծ���ť�������Ծ�
		</div>
		<form id="form1" name="form1" method="post" action="Compose.jsp">
			<table style="background-color: #999; width: 600px;">
				<%=strHtmls %>
			</table>
			<br />
			<input type="button" onclick="button1Click();" id="Button1" value="JS��ʽ�����Ծ�" /><span>�����а汾��</span>
			<input type="button" onclick="button2Click();" id="Button2" value="��̨��������Ծ�" /><span style="color:Red;">��רҵ�桢��ҵ�棩</span>
		</form>
	</body>
</html>
