<%@ page language="java" import="java.util.*" pageEncoding="gb2312"%>
<%@ page import="com.zhuozhengsoft.pageoffice.*,com.zhuozhengsoft.pageoffice.wordreader.*,java.awt.*,javax.servlet.*,javax.servlet.http.*,java.sql.*,java.text.SimpleDateFormat,java.util.Date"%>
<%@ taglib uri="http://java.pageoffice.cn" prefix="po"%>
<%
	Class.forName("sun.jdbc.odbc.JdbcOdbcDriver");//���������������
	String strUrl = "jdbc:odbc:driver={Microsoft Access Driver (*.mdb)};DBQ=" + this.getServletContext().getRealPath("ImportWordData/demodata/") + "\\demo.mdb";
	Connection conn = DriverManager.getConnection(strUrl);
	Statement stmt = conn.createStatement();
	
	String ErrorMsg = "";
	String BaseUrl = "";
	//-----------  PageOffice �������˱�̿�ʼ  -------------------//
	WordDocument doc = new WordDocument(request, response);
	String sName = doc.openDataRegion("PO_name").getValue();
	String sDept = doc.openDataRegion("PO_dept").getValue();
	String sCause = doc.openDataRegion("PO_cause").getValue();
	String sNum = doc.openDataRegion("PO_num").getValue();
	String sDate = doc.openDataRegion("PO_date").getValue();

	if (sName.equals("")) {
		ErrorMsg = ErrorMsg + "<li>������</li>";
	}
	if (sDept.equals("")) {
		ErrorMsg = ErrorMsg + "<li>��������</li>";
	}
	if (sCause.equals("")) {
		ErrorMsg = ErrorMsg + "<li>���ԭ��</li>";
	}
	if (sDate.equals("")) {
		ErrorMsg = ErrorMsg + "<li>����</li>";
	}
	try {
		if (sNum != "") {
			if (Integer.parseInt(sNum) < 0) {
				ErrorMsg = ErrorMsg + "<li>������������Ǹ���</li>";
			}
		} else {
			ErrorMsg = ErrorMsg + "<li>�������</li>";
		}
	} catch (Exception Ex) {
		ErrorMsg = ErrorMsg	+ "<li><font color=red>ע�⣺</font>�����������������</li>";
	}

	if (ErrorMsg == "") {
		String strsql =  "insert into leaveRecord(Name,Dept,Cause,Num,SubmitTime) values('"
                + sName + "','" + sDept + "','" + sCause + "'," + sNum + ",'"+sDate+"')";
		stmt.execute(strsql);
		//doc.setCustomSaveResult("ok");//������
		out.println("�ύ������Ϊ��<br/>");
		out.println("������"+sName+"<br/>");
		out.println("���ţ�"+sDept+"<br/>");
		out.println("ԭ��"+sCause+"<br/>");
		out.println("������"+sNum+"<br/>");
		out.println("���ڣ�"+sDate+"<br/>");
		doc.showPage(578, 380);
	} else {
	ErrorMsg = "<div style='color:#FF0000;'>���޸�������Ϣ��</div> "
				+ ErrorMsg;
		doc.showPage(578, 380);
	}
	doc.close();
	stmt.close();
	conn.close();
	//-----------  PageOffice �������˱�̽���  -------------------//
%>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<HTML>
	<HEAD>
		<title>SaveData</title>
		<meta content="Microsoft Visual Studio .NET 7.1" name="GENERATOR">
		<meta content="C#" name="CODE_LANGUAGE">
		<meta content="JavaScript" name="vs_defaultClientScript">
		<meta content="http://schemas.microsoft.com/intellisense/ie5" name="vs_targetSchema">

	</HEAD>
	<body>
	<div class="errTopArea" style="TEXT-ALIGN:left">[��ʾ���⣺����һ��������Ա���Զ���ĶԻ���]</div>
		<div class="errMainArea" id="error163">
			<div class="errTxtArea" style="HEIGHT:150px; TEXT-ALIGN:left">
				<b class="txt_title">
					<ul>
					<%=ErrorMsg%>
					</ul>					
				</b>				
			</div>

		</div>
	</body>
</HTML>

