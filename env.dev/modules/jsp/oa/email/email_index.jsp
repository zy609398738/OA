<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib uri="/WEB-INF/map-html.tld" prefix="yigo" %>
<%@ include file="includes/check_login.jsp" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html>
<head>
	<title>邮件管理</title>
	<meta http-equiv="X-UA-Compatible" content="IE=EmulateIE8" />
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
   <!-- jquery css -->
    <link rel="stylesheet"  href="../../../js/jquery/jquery-ui-1.10.3.custom/css/flick/jquery-ui-1.10.3.custom.css" />
	<link rel="stylesheet" href="../../../js/jquery/jQuery-File-Upload-master/css/jquery.fileupload.css" />
	<link rel="stylesheet" href="../../../js/jquery/jquery.hoverscroll/jquery.hoverscroll.css" />
	<link rel="stylesheet" href="../../../js/jquery/vex-master/css/vex.css" />
	<link rel="stylesheet" href="../../../js/jquery/vex-master/css/vex-theme-os.css" />
    <link rel="stylesheet"  media="screen" href="../../../js/jquery/jquery-jqgrid/css/ui.jqgrid.css" />
    <link rel="stylesheet" href="../../../js/intro.js-0.8.0/introjs.css" />	
    <link rel="stylesheet" type="text/css" href="../../../web/css/MAP.ui.MAP.css?boke001" />
    <link rel="stylesheet"  href="../../../web2/css/YIGO.css" />
	<link rel="stylesheet" href="../../../web2/css/YIGO.icon.css" />
    <link rel="stylesheet"  href="../../../web2/css/patchUI.css" />
	
	<link rel="stylesheet" href="css/email.css" />
	<!-- yigo lib start-->
	<script src="../../../web2/YIGO-all.js" ></script>
	<script src="../../../js/ckeditor_4.4.3_pack/ckeditor.js" ></script>
	<script src="../../../js/jquery/jquery-ui-1.10.3.custom/js/jquery-1.9.1.js" ></script>
	<script src="../../../js/jquery/jquery-ui-1.10.3.custom/js/jquery-ui-1.10.3.custom.js" ></script>
	<script src="../../../web2/jqGrid/js/i18n/grid.locale-en.js" ></script>
	<script src="../../../web2/jqGrid/js/jquery.jqGrid.src.js" ></script>
	<script src="../../../js/jquery/jQuery-File-Upload-master/js/tmpl.min.js"></script>
	<script src="../../../js/jquery/jQuery-File-Upload-master/js/jquery.fileupload.js" ></script>
	<script src="../../../js/jquery/jQuery-File-Upload-master/js/jquery.fileupload-process.js" ></script>
	<script src="../../../js/jquery/jQuery-File-Upload-master/js/jquery.fileupload-ui.js" ></script>
	<script src="../../../js/jquery/jQuery-File-Upload-master/js/jquery.fileupload-jquery-ui.js" ></script>
	<script src="../../../js/jquery/jQuery-File-Upload-master/js/jquery.fileupload-validate.js" ></script>
	<script src="../../../js/jquery/jQuery-File-Upload-master/js/jquery.iframe-transport.js" ></script>
	<script src="../../../js/jquery/jquery-ui-1.10.3.custom/js/jquery.ui.datepicker-zh-CN.min.js" ></script>
	<script src="../../../js/jquery/timepicker/jquery-ui-timepicker.js" ></script>
	<script src="../../../js/jquery/jquery.hoverscroll/jquery.hoverscroll.js" ></script>
	<script src="../../../js/jquery/migrate/migrate.js" ></script>
	<script src="../../../js/jquery/splitter/splitter.js" ></script>
	<script src="../../../js/jquery/vex-master/js/vex.js" ></script>
	<script src="../../../js/jquery/vex-master/js/vex.dialog.js" ></script>
	<script src="../../../js/jquery/autosize/jquery.autosize.min.js" ></script>
	<script src="../../../web2/adapter/jqueryui/YIGO.ui.ControlUI.js" ></script>
	<script src="../../../web2/adapter/jqueryui/YIGO.ui.ControlVM.js" ></script>
	<script src="../../../web2/adapter/jqueryui/YIGO.ui.portal.ComponentImpl.js" ></script>
	<!--yigo lib ext-->
	<script type="text/javascript" src="js/jquery-plugins.js"></script>
	<script type="text/javascript" src="js/jsx.js"></script>
	<script type="text/javascript" src="js/email.js"></script>
</head>
<body onload="" class="mail">
  <!--主体-->
    <div class="container" id="mid">
         <div class="row clearfix">
			<!--aside-left start-->
			 <%@ include file="includes/left.jsp" %>
			 <!--aside-left end-->
             <div class="span9 main" id="workspace">
                 <!--子页右侧的内容在这里 start-->
                     <div class="row">
						<div class="right-banner ele-right-banner mt_10">
							<div class="left"></div>
							<div class="right"></div>
						</div>
                         <div class="span12">
                             <div class="mbx_fil clearfix mt_10">
                                 <div class="breadcrumb"><a href="#">邮件</a>&gt;<span>首页</span></div>
                             </div>
                             <div class="cont_box">
                                 <h3>选项</h3>
                                 <div class="line2 mb_20">&nbsp;</div>
                                 <div class="cont_box_ls">
                                     <dl class="inform_list">
                                         <dt>个人信息</dt>
                                         <dd><a href="#">密码设置</a><div class="describe">设置安全强度高、便于记忆的密码</div></dd>
                                         <dd><a href="#">个人注册信息</a><div class="describe">查看个人注册信息</div></dd>
                                         <dd><a href="#">换肤</a><div class="describe">选择一款您喜欢的界面风格</div></dd>
                                     </dl>
                                     <dl class="inform_list">
                                         <dt>高级功能</dt>
                                         <dd><a href="#">名片签名</a><div class="describe">商务信息无限传递！</div></dd>
                                         <dd><a href="#">天气预报</a><div class="describe">定制全国天气信息，掌握天气变化</div></dd>
                                         <dd><a href="#">企业通</a><div class="describe">企业Web IM与您的同事随时沟通交流</div></dd>
                                     </dl>
                                 </div>
                                 <div class="line2">&nbsp;</div>
                             </div>
                          </div>
                      </div>
                 <!--子页右侧的内容在这里 end-->
             </div>
         </div>
     </div>
 <!--mid-->
 <div id="loading" style="z-index:20001;position:absolute; display:none;">
    <div class="loading-indicator">
        <img src="images/loading.gif" alt="loading..."/>
        <span id="loading-tip">正在加载中...</span>
    </div>
</div>
<div id="loadingmask" style="display: none;">
    <div class="loading-gif">
        <div class="loading-indicator">
            <img src="images/loading.gif" alt="" />
            <span>正在加载...</span>
        </div>
    </div>
</div>
</body>
</html>