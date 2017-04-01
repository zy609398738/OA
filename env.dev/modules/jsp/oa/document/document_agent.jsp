<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib uri="/WEB-INF/map-html.tld" prefix="yigo" %>
<%@ include file="includes/check_login.jsp"%>
<%@ include file="includes/jsp_utilities.jsp" %>
<%
    if (redirectOnNonAjaxRequest(request, response)) {
        return;
    }
%>
<yigo:context>
    <div id="ws_content" style="min-height:500px"></div>
    <yigo:out exp="VelocityBill(WebForm3,ws_content,subsys_SCM_WF_Delegate,,,)"/>
</yigo:context>