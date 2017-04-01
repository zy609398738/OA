<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib uri="/WEB-INF/map-html.tld" prefix="yigo" %>
<yigo:context>
<div class="span3 aside_left" id="aside_left">
<h2 class="ele-title"><span>电子审批</span></h2>
<a id="createEle"><span>创建新流程</span></a>
    <div class="block">
        <dl id="main-menu" class="txt_left menu">
            <dt><span class="gw">审批列表</span></dt>
            <dd class="todoBtns">
				<div class="row">
					<a class="ws-load" href="workflow_forme.jsp?workflowtype=1&wftype=1">
						<span>待办事项</span>
						<em class="num counter to-do"></em>
					</a>
				</div>
				<div class="row">
					<a class="ws-load" href="workflow_forread.jsp?readtype=0&wftype=1">
						<span>待阅事项</span>
						<em class="num counter to-read"></em>
					</a>
				</div>
				<div class="row">
					<a class="ws-load" href="workflow_forme.jsp?workflowtype=2&wftype=1">
						<span>驳回流程</span>
						<em class="num counter reject"></em>
					</a>
				</div>
            </dd>
			<dt><span class="yc">已处理</span></dt>
            <dd>
                <div class="row">
					<p><a class="ws-load" href="workflow_forme.jsp?workflowtype=3&wftype=1"><span>已办事宜</span></a></p>
                    <p><a class="ws-load" href="workflow_forread.jsp?readtype=1&wftype=1"><span>已阅事宜</span></a></p>
                    <p><a class="ws-load" href="workflow_forme.jsp?workflowtype=4&wftype=1"><span>结束流程</span></a></p>
					<p><a class="ws-load" href="workflow_forme.jsp?workflowtype=7&wftype=1"><span>归档流程</span></a></p>
                </div>
            </dd>
			<dt><span class="gr">个人列表</span></dt>
            <dd>
                <div class="row">
					<p><a class="ws-load" href="workflow_forme.jsp?workflowtype=5&wftype=1"><span>我发起流程</span></a></p>
					<p><a class="ws-load" href="workflow_forme.jsp?workflowtype=6&wftype=1"><span>草稿箱</span></a></p>
					<p><a class="ws-load" href="workflow_query.jsp?wftype=1"><span>流程查询</span></a></p>
				</div>
			</dd>
            <dt><span class="hy">环境设置</span></dt>
            <dd>
                <div class="row">
                    <p><a class="ws-load" href="workflow_agent.jsp"><span>代理设置</span></a></p>
                    <p><a class="ws-load" href="workflow_commonviews.jsp"><span>常用意见</span></a></p>
                </div>
            </dd>
        </dl>
    </div>
	<div class="aside_left_bottom_img"></div>
</div>
</yigo:context>