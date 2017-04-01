<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib uri="/WEB-INF/map-html.tld" prefix="yigo" %>
<%@ include file="includes/check_login.jsp" %>
<%@ include file="includes/jsp_utilities.jsp" %>
<%
    if (redirectOnNonAjaxRequest(request, response)) {
        return;
    }
%>
<yigo:context>
    <div id="ws_content" data-backward="<yigo:out exp="WebGetPara(type)" />">
    <div class="letter_bg">
        <div id="bill_content" style="min-height:500px"></div>
        <div id="upload"></div>
    </div>
    <yigo:out exp="VelocityBill(WebForm3,bill_content,{subsys_SCM_}&WebGetPara(type)&{View},{ExtraValueSet(EntryFlag,1)+RunUIOpt(New)},,)"/>
    </div>
</yigo:context>
