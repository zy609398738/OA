<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib uri="/WEB-INF/map-html.tld" prefix="yigo" %>
<%@ include file="includes/check_login.jsp" %>
<yigo:context>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
	<!--子页右侧的内容在这里 start-->
	<div class="row">
	    <div class="span12">
	        <div class="mbx_fil clearfix mt_10">
	            <div class="breadcrumb"><a href="email_index.jsp">邮件</a>&gt;<span>已发送</span></div>
	        </div>
	        <div class="cont_box" id="ws_content" style="min-height:450px">
               <yigo:out exp="VelocityBill(WebForm3,ws_content,{subsys_SCM_OA_Email_OutboxView},{},,)"/>
	        </div>
	     </div>
	 </div>
	<!--子页右侧的内容在这里 end-->
 </yigo:context>