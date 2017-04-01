<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%
	request.setCharacterEncoding("UTF-8");
	String url=request.getParameter("url");
	session.setAttribute("key",url);
%>
