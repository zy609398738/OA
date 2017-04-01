<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib uri="/WEB-INF/map-html.tld" prefix="yigo" %>
<div class="span3 aside-left">
	 <div class="block">
        <div class="mail-left-top">
                <h2><span>邮件中心</span></h2>
				<div class="img"></div>
        </div>
	 </div>
	 <div class="block Ctrl-mail mt_10">
		 <div class="content clearfix">
			 <a href="email_inbox.jsp" class="ws-load mail-check">收信</a>
			 <a href="email_write.jsp" class="ws-load mail-write">写信</a>
		 </div>
	 </div>
	 <div class="block tree-menu">
		 <div class="content">
			 <div class="item collapsed">
				 <h6></h6>
				 <div class="sub-menu">
					<ul>
						 <li class="hover"><a href="email_inbox.jsp" class="ws-load received_mail">收件箱</a></li>
						 <li><a href="email_outbox.jsp" class="ws-load sended_mail">已发送</a></li>
						 <li><a href="email_drafts.jsp" class="ws-load draft_mail">草稿箱</a></li>
						 <li><a href="email_deleted.jsp" class="ws-load deleted_mail">已删除</a></li>
					</ul>
					<p><a href="email_set.jsp" class="ws-load add_mail">添加代收邮件</a></p>
				 </div>
			 </div>					 
		 </div>
	 </div>
</div>