<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib uri="/WEB-INF/map-html.tld" prefix="yigo" %>
<%
    String uri = request.getRequestURI();
    request.setAttribute("x-jsPath", uri.substring(0,
            uri.indexOf("/", request.getContextPath().length() + 1) )
            + "/js");
%>
<yigo:context>
<div class="system-tip fancybox-caption" id="login_error">
    <span class="tip info">系统提示：
    <marquee Behaviour="Scroll" scrollamount="2" direction="left" >
    欢迎登录YiCo平台，今天是<i id="date"></i>
    </marquee></span>
    <span class="error" data-error-type="-1">请输入完整的登录信息</span>
    <span class="error" data-error-type="-2">用户名或密码错误或已从它处登录系统</span>
</div>
<form id="login-form" action="do_login.jsp" method="post">
    <p><label>用户代码<input type="text" name="usercode" tabindex="0" /></label></p>
    <p><label>登录密码<input type="password" name="password" value="" tabindex="1" /></label></p>
    <p class="btns fontyh fff">
        <input id="pki-login2" type="button" onclick="javascript:window.location.href='https://'+window.location.hostname+':8443/Yigo/cqoa/login4pki.jsp'" class="Certificate_login" value="PKI数字证书登录" />
        <input type="submit" class="normal_login" value="登录" tabindex="10" disabled="disabled" />
    </p>
</form>
<script type="text/javascript" src="<yigo:out var="x-jsPath" />/login-form.js"></script>
</yigo:context>