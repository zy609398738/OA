<%@ page language="java"
	import="java.util.*, java.sql.*, java.text.NumberFormat, java.util.Locale,java.lang.*,
	java.text.SimpleDateFormat,java.util.Date"
	pageEncoding="gb2312"%>
<%
    Class.forName("org.sqlite.JDBC");
	String strUrl = "jdbc:sqlite:"
				+ this.getServletContext().getRealPath("demodata/") + "\\WordSalaryBill.db";
	Connection conn = DriverManager.getConnection(strUrl);
	Statement stmt = conn.createStatement();
	ResultSet rs = stmt.executeQuery("select * from Salary  order by ID");
	boolean flg = false;//��ʶ�Ƿ�������
	StringBuilder strHtmls = new StringBuilder();
	//SimpleDateFormat  formatDate = new SimpleDateFormat("yyyy-MM-dd");
	//DateFormat format = new SimpleDateFormat("yyyy-MM-dd"); 
	//NumberFormat formater = NumberFormat.getCurrencyInstance(Locale.CHINA);
	while (rs.next()) {
		flg = true;
		String pID = rs.getString("ID");
		strHtmls.append("<tr  style='height:40px; text-indent:10px; padding:0; border-right:1px solid #a2c5d9; border-bottom:1px solid #a2c5d9; color:#666;'>");
		strHtmls.append("<td style=' text-align:center;'><input id='check" + pID + "'  type='checkbox' /></td>");
        strHtmls.append("<td style=' text-align:left;'>" + pID + "</td>");
        strHtmls.append("<td style=' text-align:left;'>" + rs.getString("UserName").toString() + "</td>");
        strHtmls.append("<td style=' text-align:left;'>" + rs.getString("DeptName").toString() + "</td>");
		
         strHtmls.append("<td style=' text-align:left;'>" + rs.getString("SalTotal").toString()+ "</td>");
		strHtmls.append("<td style=' text-align:left;'>" + rs.getString("SalDeduct").toString() + "</td>");
		strHtmls.append("<td style=' text-align:left;'>" +rs.getString("SalCount").toString()+ "</td>");
		strHtmls.append("<td style=' text-align:center;'>" + rs.getString("DataTime") + "</td>");
		strHtmls.append("<td style=' text-align:center;'><a href='View.jsp?ID=" + pID + "' target='_blank'>�鿴</a>&nbsp;&nbsp;&nbsp;&nbsp;<a href='Openfile.jsp?ID=" + pID + "' target='_blank'>�༭</a></td>");
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
		<title>��̬���ɹ�����</title>

		<script type="text/javascript">
        function getID() {
            var ids = "";
            for (var i = 1; i < 11; i++) {
                if (document.getElementById("check" + i.toString()).checked) {
                    ids += i.toString() + ",";
                }
            }
            
            if (ids == "")
                alert("����ѡ��Ҫ���ɹ������ļ�¼");
            else
                location.href = "Compose.jsp?ids=" + ids.substr(0, ids.length - 1);
        }

    </script>
	</head>
	<body>
		<div style="text-align: center;">
			<p style="color: Red; font-size: 14px;">
				1.���Ե�������������еġ��༭�����༭����Ա���Ĺ�����&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
				<br />
				2.���Ե�������������еġ��鿴�����鿴����Ա���Ĺ�����&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
				<br />
				3.��ѡ��������ʼ�¼���㡰���ɹ���������ť�����ɹ�����&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
			</p>
			<table
				style="width: 60%; font-size: 12px; text-align: center; border: solid 1px #a2c5d9;">
                       <%=strHtmls %>
			</table>
			<br />
			<input type="button" value="���ɹ�����" onclick="getID()" />
		</div>
	</body>
</html>
