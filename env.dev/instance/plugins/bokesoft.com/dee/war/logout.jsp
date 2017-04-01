<%@ page language="java" pageEncoding="UTF-8"%>
<% 
	session.removeAttribute("userInfo"); 
	response.sendRedirect("loginDesign.jsp");

%>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
	<head>
	</head>
</html>