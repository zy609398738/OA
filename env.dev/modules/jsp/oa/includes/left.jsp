<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib uri="/WEB-INF/map-html.tld" prefix="yigo" %>
<yigo:context>
<div class="span3 aside_left" id="aside_left">
    <div class="block">
        <div class="ele-left-top">
                <h2><span>电子审批</span></h2>
				<a id="createEle">新建流程</a>
        </div>
    </div>
    <div class="block">
        <dl id="main-menu" class="txt_left menu">
            <dt><span class="gw">审批列表</span></dt>
            <dd class="todoBtns">
				<div class="row">
					<a class="ws-load" href="workflow_forme.jsp?workflowtype=1">
						<span>待办事项</span>
						<em class="num counter to-do"><yigo:out exp="{11}"/></em>
					</a>
				</div>
				<div class="row">
					<a class="ws-load" href="workflow_forme.jsp?workflowtype=2">
						<span>驳回流程</span>
						<em class="num counter reject"><yigo:out exp="{22}"/></em>
					</a>
				</div>
            </dd>
			<dt><span class="gw">已处理</span></dt>
            <dd>
                <div class="row">
					<p><a class="ws-load" href="workflow_forme.jsp?workflowtype=3"><span>已办事宜</span></a></p>
                    <p><a class="ws-load" href="workflow_forme.jsp?workflowtype=4"><span>结束流程</span></a></p>
                </div>
            </dd>
			<dt><span class="gr">个人列表</span></dt>
            <dd>
                <div class="row">
					<p><a class="ws-load" href="workflow_forme.jsp?workflowtype=5"><span>我发起流程</span></a></p>
					<p><a class="ws-load" href="workflow_forme.jsp?workflowtype=6"><span>草稿箱</span></a></p>
					<p><a class="ws-load" href="workflow_query.jsp"><span>流程查询</span></a></p>
				</div>
			</dd>
            <dt><span class="gr">环境设置</span></dt>
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