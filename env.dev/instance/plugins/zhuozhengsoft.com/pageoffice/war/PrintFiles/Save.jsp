<%@ page language="java"
	import="java.util.*,com.zhuozhengsoft.pageoffice.*"
	pageEncoding="gb2312"%>
<%@ taglib uri="http://java.pageoffice.cn" prefix="po"%>
<%
	FileSaver fs = new FileSaver(request, response);
	String id = request.getParameter("id");
	String err = "";
	if (id != null && id.length() > 0) {
		String fileName = "\\maker" + id + fs.getFileExtName();
		fs.saveToFile(request.getSession().getServletContext()
				.getRealPath("PrintFiles/doc")
				+ fileName);
	} else {
		err = "<script>alert('δ����ļ�����');</script>";
	}
	fs.close();
%>
