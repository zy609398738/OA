<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ include file="includes/check_login.jsp" %>
<%@ include file="includes/jsp_utilities.jsp" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html>
<head>
	<title>电子审批</title>
	<meta http-equiv="X-UA-Compatible" content="IE=EmulateIE8" />
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <!-- jquery css -->
    <link rel="stylesheet"  href="../../../js/jquery/jquery-ui-1.10.3.custom/css/flick/jquery-ui-1.10.3.custom.css" />
    <link rel="stylesheet"  media="screen" href="../../../js/jquery/jquery-jqgrid/css/ui.jqgrid.css" />
    <link rel="stylesheet"  href="../../../web2/css/YIGO.css" />
    <link rel="stylesheet"  href="../../../web2/css/patchUI.css" />

    <link rel="stylesheet" href="fancybox/jquery.fancybox.min.css">
    <link rel="stylesheet" href="fancybox/helpers/jquery.fancybox-buttons.min.css">
    <link rel="stylesheet" href="fancybox/helpers/jquery.fancybox-thumbs.min.css">
    <link rel="stylesheet" type="text/css" href="../../../web/css/MAP-all.css?boke001" />
    <link rel="stylesheet" type="text/css" href="../../../web/css/MAP.ui.MAP.css?boke001" />
    <link rel="stylesheet" href="../workflow/css/reset.css?boke001">
    <link rel="stylesheet" href="../workflow/css/public.css?boke001">
    <link rel="Stylesheet" href="../workflow/css/oa.css?boke001" />
    <link rel="stylesheet" href="../workflow/css/doc_temp.css" />
    <script src="../../../js/jquery/jquery-ui-1.10.3.custom/js/jquery-1.9.1.js"  type="text/javascript"></script>
	<script src="../../../js/jquery/jquery-ui-1.10.3.custom/js/jquery.ui.datepicker-zh-CN.min.js"  type="text/javascript"></script>
	<script type="text/javascript">
	 function YigoInit(){
		//YIGO.Options.WindowAppendToDocument=true
		//YIGO.ui.DefaultSettings.setSettingValue('WindowAppendToDocument',true);
		YIGO.ui.DefaultSettings.setSettingValue('GridAutoWidthFit',true);
	 }
	</script>
</head>
<body onload="YigoInit()">
<input id="application-ctx" type="hidden" value="<%=request.getContextPath()%>" />
<!--mid-->
<div class="row">
    <div class="container clearfix mid" id="mid">
        <!--aside-left start-->
        <%@ include file="includes/left.jsp" %>
        <!--aside-left end-->
        <!--工作区sub_right start-->
        <div class="span9 sub_right" id="workspace">
			<a class="index-ajax-load" target="#doc-todo-list" href="document_forme.jsp?workflowtype=1&wftype=2&WORKITEMID=<%=request.getParameter("WORKITEMID")%>&BILLKEY=<%=request.getParameter("BILLKEY")%>&BILLID=<%=request.getParameter("BILLID")%>&TYPE=<%=request.getParameter("TYPE")%>"></a>
            <div id="doc-todo-list" class="doc-list dbsx"></div>
		</div>
<!--工作区sub_right end-->
</div>
</div>
<!--mid-->
<div id="loading-mask" style="display: none;">
    <div class="loading-gif">
        <div class="loading-indicator">
            <img src="images/loading.gif" alt="" />
            <span>正在加载...</span>
        </div>
    </div>
</div>

<div id="loading" style="z-index:20001;position:absolute; display:none;">
    <div class="loading-indicator">
        <img src="images/loading.gif" alt="loading..."/>
        <span id="loading-tip">正在加载中...</span>
    </div>
</div>



<script type="text/javascript" src="js/jquery.form.min.js"></script>
<script type="text/javascript" src="fancybox/jquery.fancybox.pack.js"></script>
<script type="text/javascript" src="js/moment.min.js"></script>
<script type="text/javascript" src="js/jsx.js?boke003"></script>
<script type="text/javascript" src="js/jquery-plugins.js?boke002"></script>
<script type="text/javascript" src="../workflow/js/go-top.js"></script>
<script type="text/javascript" src="../workflow/js/oa.js?boke003"></script>
<script type="text/javascript" src="js/counter.js?boke002"></script>
<script type="text/javascript" src="js/bill-action.js?boke003"></script>

<!-- yigo lib -->
<script src="../../../web2/YIGO-all-debug.js" ></script>
<!-- CKEditor -->
<script src="../../../js/ckeditor_4.0.1_pack/ckeditor.js" ></script>
<!-- jquery-ui lib -->
<script src="../../../js/jquery/jquery-ui-1.10.3.custom/js/jquery-ui-1.10.3.custom.js" ></script>
<!-- jqGrid lib -->
<script src="../../../js/jquery/jquery-jqgrid/js/i18n/grid.locale-en.js" ></script>
<script src="../../../js/jquery/jquery-jqgrid/js/jquery.jqGrid.src.js" ></script>
<!-- The Templates plugin is included to render the upload/download listings -->
<script src="../../../js/jquery/jQuery-File-Upload-master/js/tmpl.min.js"></script>
<script src="../../../js/jquery/jQuery-File-Upload-master/js/jquery.fileupload.js" ></script>
<script src="../../../js/jquery/jQuery-File-Upload-master/js/jquery.fileupload-process.js" ></script>
<script src="../../../js/jquery/jQuery-File-Upload-master/js/jquery.fileupload-ui.js" ></script>
<script src="../../../js/jquery/jQuery-File-Upload-master/js/jquery.fileupload-jquery-ui.js" ></script>
<script src="../../../js/jquery/timepicker/jquery-ui-timepicker.js"></script>
<!-- adapter -->
<script src="../../../web2/adapter/jqueryui/YIGO.ui.ControlUI.js" ></script>
<!--footer-->
<!--yigo lib ext-->
<script type="text/javascript" src="../public/yigo-ext.js"></script>
<script>
$(function(){
	//formResize();
})
function formResize(){
	 var bodyHeight = $(window).height(),
		  eleIframe = bodyHeight-20;
	 //$("#aside_left").height(eleIframe+20+"px");
}
$(window).resize(function() {
	//formResize();
});
</script>
</body>
</html>