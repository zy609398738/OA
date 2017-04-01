<%@page language="java" import="java.util.*"%> 
<%@page import="com.bokesoft.dee.web.util.JspFileDownload"%> 
<%
	request.setCharacterEncoding("UTF-8");
	String url = request.getParameter("url");
	java.io.File file=new java.io.File(url);
	String filename=file.getName();
	JspFileDownload jfd = new JspFileDownload();
	jfd.setResponse(response);
	jfd.setDownType(0);
	jfd.setDisFileName(filename);
	jfd.setDownFileName(url);
    out.print(jfd.process());
	

 %>
