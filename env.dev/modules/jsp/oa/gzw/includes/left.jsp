<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib uri="/WEB-INF/map-html.tld" prefix="yigo" %>
<yigo:context>
<div class="span3 aside_left" id="aside_left">
    <div class="block">
        <div class="ele-left-top">
                <h2><span>公文管理</span></h2>
				 <dd class="gw">
                <div class="row">
                    <a id="issue_document" class="create_file_btn">收发文件类型</a>
                    <div id="issue_document_types" style="display: none;">
                        <div class="create-file-box">
                            <h5 class="fancybox-caption">请选择收发文类型：</h5>
                            <ul>
                            <!--<li class="ng"><a href="add_document.jsp?type=subsys_SCM_OA_draft" class="ws-load">拟稿</a></li>-->
                            <li class="zfw"><a href="add_document.jsp?type=subsys_SCM_OA_PostingBill" class="ws-load">收文单</a></li>
                            <li class="sw"><a href="add_document.jsp?type=subsys_SCM_OA_IncomingBill" class="ws-load">发文单</a></li>
                            </ul>
                        </div>
                    </div>
                </div>          
            </dd>
        </div>
    </div>
    <div class="block">
        <dl id="main-menu" class="txt_left menu">
            <dt><span class="gw">审批列表</span></dt>
            <dd class="todoBtns">
				<div class="row">
					<a href="documents_todo.jsp">
						<span>待办事项</span>
						<em class="num counter to-do">-</em>
					</a>
				</div>
				<div class="row">
					<a href="documents_from_me.jsp">
						<span>在途事项</span>
						<em class="num counter to-read">-</em>
					</a>
				</div>
				<div class="row">
					<a href="documents_reject.jsp">
						<span>催办事项</span>
						<!--<em class="num counter reject">-</em>-->
					</a>
				</div>
            </dd>
		<!--	<dt><span class="gw">已处理</span></dt>  -->
           <!-- <dd>
                <div class="row">
					<p><a href="documents_done.jsp"><span>已办事宜</span></a></p>
                    <p><a href="documents_hasRead.jsp"><span>已阅事项</span></a></p>
                    <p><a href="documents_finished.jsp"><span>已办结文</span></a></p>
                </div>
            </dd>
			-->
			<dt><span class="gr">个人列表</span></dt>
            <dd>
                <div class="row">
					<!--<p><a href="documents_from_me.jsp"><span>我发起流程</span></a></p>-->
					<!--<p><a href="documents_draft.jsp"><span>草稿箱</span></a></p>-->
					<!--<p><a href="WFlist.jsp"><span>公文查询</span></a></p>-->
					<p><a href="WFlist.jsp"><span>收文查询</span></a></p>
					<p><a href="FW_list.jsp"><span>发文查询</span></a></p>
					<!--<p><a href="documents_myfavorites.jsp"><span>我的收藏</span></a></p>-->
					<!--<p><a href="documents_discard.jsp"><span>废纸篓</span></a></p>-->
				</div>
			</dd>
          <!--<dt><span class="jb">简报中心</span></dt> -->
         <!--   <dd>
                <div class="row">
                    <p><a href="add_document.jsp?type=subsys_SCM_OA_briefReports"><span>创建简报</span></a></p>
                    <p><a href="brief_report_view.jsp"><span>简报中心</span></a></p>
                </div>
            </dd>
		  -->	
        </dl>
    </div>
	<div class="aside_left_bottom_img"></div>
</div>
</yigo:context>