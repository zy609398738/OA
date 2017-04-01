<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib uri="/WEB-INF/map-html.tld" prefix="yigo" %>
<%@ include file="includes/check_login.jsp" %>
<%@ include file="includes/jsp_utilities.jsp" %>
<%
    if (redirectOnNonAjaxRequest(request, response)) {
        return;
    }
%>
	<!--<div class="right-banner ele-right-banner mt_10">
		<div class="left"></div>
		<div class="right"></div>
	</div>-->
<yigo:context>

    <div id="ws_content" data-backward='<yigo:out exp="WebGetPara(TYPE)"/>'>
    	<div class="letter_bg">
            <div id="bill_content" style="min-height:450px"></div>			
        </div>
    </div>
    <yigo:out exp="VelocityBill(WebForm3,bill_content,{subsys_SCM_WF_ForRead},{ExtraValueSet(EntryFlag,1)},,)"/>
</yigo:context>