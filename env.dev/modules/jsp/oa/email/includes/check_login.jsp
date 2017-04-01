<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib uri="/WEB-INF/map-html.tld" prefix="yigo" %>
<%@ page import="com.bokesoft.myerp.common.*"%>
<%@ page import="com.bokesoft.myerp.mid.web.util.WebContext"%>
<%@ page import="com.bokesoft.myerp.mid.BillMidLib.MBillContext"%>
<%
	boolean login = false;
	try {
		MBillContext context = new MBillContext(request, response);
		login = WebContext.checkLogin(context, true);
	} catch(Throwable e){
		DebugUtil.error(e);
	}
	if (!login) {
		response.sendRedirect("../login.page");
		return;
	}
%>