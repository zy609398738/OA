<%@ page language="java"
	import="java.util.*,java.text.*,com.zhuozhengsoft.pageoffice.*,com.zhuozhengsoft.pageoffice.wordreader.*"
	pageEncoding="gb2312"%>
<%@ taglib uri="http://java.pageoffice.cn" prefix="po"%>
<%
	WordDocument doc = new WordDocument(request, response);
	//��ȡ�ύ����ֵ
	String dataUserName = doc.openDataRegion("PO_userName").getValue();
	String dataDeptName = doc.openDataRegion("PO_deptName").getValue();
	String companyName= doc.getFormField("txtCompany");
	
        /**��ȡ���Ĺ�˾����,Ա������,�������Ƶ����ݿ��Ա��浽���ݿ�,����������ӿ�����Ա�Լ������ݿ�,��������mysql���ݿ⡣
            *Class.forName("com.mysql.jdbc.Driver");
	    *Connection conn = (Connection) DriverManager.getConnection("jdbc:mysql://localhost/myDataBase", "root", "111111");
            *String sql="update user set userName='"+dataUserName+"',deptName='"+dataDeptName+"',companyName='"+companyName+"' where userId=1";		
	    *PreparedStatement ps = conn.prepareStatement(sql);
	    *int rs = ps.executeUpdate(upsql);
            * if (rs>0) {
            *    out.println("���³ɹ�");
	    *     }
            *     else{
            *   out.println("����ʧ��");
            *    }
	    *
	    *rs.close();
	    *conn.close();
        */
	  doc.close();
%>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
	<head>
		<title></title>
	</head>
	<body>
	</body>
</html>