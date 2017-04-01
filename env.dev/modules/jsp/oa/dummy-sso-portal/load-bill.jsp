<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%><!DOCTYPE HTML>
<%
//准备显示单据的各种参数
String billId = request.getParameter("billId");
String billKey = request.getParameter("billKey");

request.setAttribute("title", "测试单据");
request.setAttribute("command", "openbill:"+billKey+","+billId);
request.setAttribute("entry-exp", "MsgBox({测试单据 } & Value(No) & { 已加载})");
%>
<html>
    <head>
	    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
	    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
	    <title><%=request.getAttribute("title")%></title>
	    <meta name="viewport" content="width=device-width, initial-scale=1"/>
	    <style>
		#titlebar {
		    width: 100%;
		    border: medium none;
		    background-color: darkblue;
		    color: #FFF;
		    height: 36px;
		    line-height: 2em;
		    font-size: 18px;
		    text-indent: 1em;
		    font-family: 微软雅黑,Helvetica,sans-serif;
		}
		.bill-box {
			padding: 12px;
		}
	    </style>
	</head>
	<body>
	<!--%@include file="./sso-lib.jsp"%-->
	<%@include file="/web2-ext/HX-DefaultWebView.jsp"%>
	</body>
</html>