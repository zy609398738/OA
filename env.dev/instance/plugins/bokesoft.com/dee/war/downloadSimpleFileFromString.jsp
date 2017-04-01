<%@ page contentType="text/html;charset=UTF-8" pageEncoding="utf-8"%>
<%@page language="java" import="java.util.*"%> 
<%@page import="com.bokesoft.dee.web.util.JspFileDownload"%> 
<%
	request.setCharacterEncoding("UTF-8");
	String data = request.getSession().getAttribute("xmlData").toString();
	request.getSession().removeAttribute("xmlData");
	String filename = request.getParameter("filename");
	JspFileDownload jfd = new JspFileDownload();
	jfd.setResponse(response);
	jfd.setDownType(0);
	jfd.setDisFileName(filename);
    out.print(jfd.processFromString(data));
 %>
