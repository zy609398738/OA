<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib uri="/WEB-INF/map-html.tld" prefix="yigo" %>
<%@ include file="includes/check_login.jsp" %>
<yigo:context>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html>
<head>
	<title>重庆市公安局——办公自动化系统</title>
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <link rel="stylesheet" href="fancybox/jquery.fancybox.min.css">
    <link rel="stylesheet" href="fancybox/helpers/jquery.fancybox-buttons.min.css">
    <link rel="stylesheet" href="fancybox/helpers/jquery.fancybox-thumbs.min.css">
    <link rel="stylesheet" type="text/css" href="../web/css/MAP-all.css?boke001" />
    <link rel="stylesheet" type="text/css" href="../web/css/MAP.ui.MAP.css?boke001" />
    <link rel="stylesheet" href="css/reset.css?boke001">
    <link rel="stylesheet" href="css/public.css?boke001">
    <link rel="Stylesheet" href="css/oa.css?boke001" />
    <link rel="stylesheet" type="text/css" href="css/search.css" />
</head>
<body ><!-- onunload="logout.applyOnce()()" onbeforeunload="logout.applyOnce()()" -->
<!--header-->
<%@ include file="includes/top.jsp" %>
<!--header-->
<!--mid-->
<div class="row mt_10">
    <div class="container clearfix mid" id="mid">
        <!--aside-left start-->
        <%@ include file="includes/left.jsp" %>
        <!--aside-left end-->
        <!--工作区sub_right start-->
        <div class="span9 sub_right" id="workspace">
        <yigo:if exp="len(WebGetPara({_preload}))=0">
			<div class="index_right">
				<!--首页右边栏 start-->
				<div id="sub_aside_right" class="aside_right">
					<div class="block">
						<div class="content">
							<div class="timer">
								<div id="calendar"></div>
							</div>
							<div class="tast txt_left">
								<div id="meetinglist"><jsp:include page="getCalendars.jsp" /></div>
                                <div class="news_more"><a href="calendar.jsp" target="_blank">查看日程>></a></div>
								<%--<div class="txt_right"><a href="calendar.jsp" target="_blank">更多</a></div>--%>
							</div>
						</div>
					</div>
					<div class="block fast_links">
                        <ul id="friend-link">
                            <yigo:exp exp="WebNewObject(friendlyLink)+WebSetFilter({status<>-1})+LoadObject()" />
                            <yigo:iterator dblocation="1">
                                <li>
                                    <a href="<yigo:out exp="RowValue(URL)" />">
                                        <img src="../rfc.do?__out=1&__exp=WebShowPicture%28{<yigo:out exp="webGetPicPath()&{$}&WebEncode(RowValue(IMGPATH))" />}%29"
                                             alt="<yigo:out exp="RowValue(NAME)" />" />
                                    </a>
                                </li>
                            </yigo:iterator>
                        </ul>
					</div>
				</div>
				<!--首页右边栏 end-->
				<!--首页center start-->
				<div id="mid_center">
					<!--查询 start-->
                    <%@ include file="includes/search_block.jsp" %>
					<!--查询 end-->

					<!--选项卡列表 start-->
					<div class="block mt_5">
						<div class="content tab_box">
							<div class="lib_tab">
								<div class="tab_head">
									<ul>
										<li class="hover" data-tab-panel="#con_one_1"><span class="pen">待办</span>
											<span class="num counter to-do">-</span>
										</li>
										<li data-tab-panel="#con_one_2"><span class="pen">待阅</span>
											<span class="num counter to-read">-</span>
										</li>
									</ul>
									<div class="checks fl_right">
                                        <form class="con_one_1" style="display:block;" id="form-todo-x-filter-index" method="post" action="documents_todo_query_list.jsp?page=0&showCount=6">
                                            <label><input class="imply-submit" type="checkbox" name="msgtype" value="1" checked="checked" />发文</label>
                                            <label><input class="imply-submit" type="checkbox" name="msgtype" value="2" checked="checked" />收文</label>
                                        </form>
                                        <form class="con_one_2" style="display:none;" id="form-toread-x-filter-index" method="post" action="documents_toread_query_list.jsp?page=0&showCount=6">
                                            <label><input class="imply-submit" type="checkbox" name="msgtype" value="1" checked="checked" />发文</label>
                                            <label><input class="imply-submit" type="checkbox" name="msgtype" value="2" checked="checked" />收文</label>
                                        </form>
									</div>
								</div>
								<div class="tab_content">
									<div id="con_one_1" class="tab_item" style="display: block;">
										<div id="doc-todo-list"></div>
									</div>
									<div id="con_one_2" class="tab_item" style="display: none;">
										<div id="doc-toread_list"></div>
									</div>
								</div>
							</div>
						</div>
					</div>
					<!--选项卡列表 end-->
					<!--最新列表 start-->
					<div class="row news mt_15">
						<div class="span6 fl_left">
                            <div class="file">
                                <div class="top"></div>
                                <div class="mid">
                                    <div class="news_title">已发文</div>
                                    <ul>
                                        <yigo:exp exp="WebNewObject(isoutgoing)+LoadObject({},0,0,0,5)"/>
                                          <yigo:iterator dblocation="2">
                                              <li>
                                                  <label>
                                                      <a class="ws-load" href="documents_detail.jsp?billKey=<yigo:out exp="{}&RowValue(METAKEY)"/>&BILLID=<yigo:out exp="{}&RowValue(BILLID)"/>&rt=isoutgoing">
                                                        <yigo:out exp="{}&RowValue(TITLE)" />
                                                      </a>
                                                  </label>
                                                  <span><yigo:out exp="{}&RowValue(APPDATE)" /></span>
                                              </li>
                                          </yigo:iterator>
                                    </ul>
                                    <div class="news_more"><a class="ws-load" href="documents_outgoing.jsp">更多&gt;&gt;</a></div>
                                </div>
                                <div class="bottom"></div>
                            </div>
						</div>
						<div class="span6 fl_right">
                            <div class="new">
                                <div class="top"></div>
                                <div class="mid">
                                    <div class="news_title">已办文</div>
                                    <ul>
                                        <yigo:exp exp="WebNewObject(isdonemsg)+LoadObject({},0,0,0,5)"/>
                                          <yigo:iterator dblocation="2">
                                              <li>
                                                  <label>
                                                      <a class="ws-load" href="documents_detail.jsp?billKey=<yigo:out exp="{}&RowValue(METAKEY)"/>&BILLID=<yigo:out exp="RowValue(BILLID)"/>&rt=isdonemsg">
                                                        <yigo:out exp="{}&RowValue(TITLE)" />
                                                      </a>
                                                  </label>
                                                  <span><yigo:out exp="{}&RowValue(APPDATE)" /></span>
                                              </li>
                                          </yigo:iterator>
                                    </ul>
                                     <div class="news_more"><a class="ws-load" href="documents_donelist.jsp">更多&gt;&gt;</a></div>
                                </div>
                                <div class="bottom"></div>
                            </div>
						</div>
					</div>
					<!--最新列表 end-->
				</div>
				<!--首页center end-->
			</div>
        </yigo:if>
		</div>
        <!--工作区sub_right end-->
	</div>
</div>
<!--mid-->
<!--footer-->
<%@include file="includes/bottom.jsp" %>

<div style="display: none;">
    <div id="loading-mask" class="loading-gif">
        <div class="loading-indicator">
            <img src="images/loading.gif" alt="" />
            <span>正在加载...</span>
        </div>
    </div>
</div>

<div id="loading-mask2" style="width:100%;height:100%;position:absolute;z-index:20000;left:0;top:0;display:none;"></div>
<div id="loading" style="z-index:20001;position:absolute; display:none;">
    <div class="loading-indicator">
        <img src="images/loading.gif" alt="loading..."/>
        <span id="loading-tip">正在加载中...</span>
    </div>
</div>


<script type="text/javascript" src="../web/MAP-all.js"></script>
<script type="text/javascript" src="js/MAP.ui.form.HtmlPage.js"></script>
<script type="text/javascript" src="js/portal_exp.js"></script>
<script type="text/javascript" src="../js/ext/source/locale/ext-lang-GB2312_.js"></script>
<script type="text/javascript" src="js/jquery-1.8.2.min.js"></script>
<script type="text/javascript" src="js/jquery.form.min.js"></script>
<script type="text/javascript" src="fancybox/jquery.fancybox.pack.js"></script>
<script type="text/javascript" src="js/moment.min.js"></script>
<script type="text/javascript" src="js/jsx.js?boke003"></script>
<script type="text/javascript" src="js/jquery-plugins.js?boke002"></script>
<script type="text/javascript" src="js/yigo.grid.GroupingView.js?boke001"></script>
<script type="text/javascript" src="js/oa.js?boke003"></script>
<script type="text/javascript" src="js/counter.js?boke002"></script>
<script type="text/javascript" src="js/bill-action.js?boke003"></script>
<script type="text/javascript" src="includes/search_block.js"></script>
<!--footer-->
</body>
</html>
</yigo:context>