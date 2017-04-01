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
	<link rel="stylesheet" href="../../../js/jquery/jQuery-File-Upload-master/css/jquery.fileupload.css" />
	<link rel="stylesheet" href="../../../js/jquery/jquery.hoverscroll/jquery.hoverscroll.css" />
	<link rel="stylesheet" href="../../../js/jquery/vex-master/css/vex.css" />
	<link rel="stylesheet" href="../../../js/jquery/vex-master/css/vex-theme-os.css" />
    <link rel="stylesheet"  media="screen" href="../../../js/jquery/jquery-jqgrid/css/ui.jqgrid.css" />
    <link rel="stylesheet" href="../../../js/intro.js-0.8.0/introjs.css" />	
	
	<!--<link rel="stylesheet" href="../../../web2/css/bootstrap/css/bootstrap.min.css" />-->
    <link rel="stylesheet"  href="../../../web2/css/YIGO.css" />
	<link rel="stylesheet" href="../../../web2/css/YIGO.icon.css" />
    <link rel="stylesheet"  href="../../../web2/css/patchUI.css" />
 <link rel="stylesheet"  href="../../../web2/css/portal.css" />
    <link rel="stylesheet" href="fancybox/jquery.fancybox.min.css">
    <link rel="stylesheet" href="fancybox/helpers/jquery.fancybox-buttons.min.css">
    <link rel="stylesheet" href="fancybox/helpers/jquery.fancybox-thumbs.min.css">
    <link rel="stylesheet" href="css/reset.css">
    <link rel="stylesheet" href="css/public.css">
    <link rel="Stylesheet" href="css/oa.css" />
    <link rel="stylesheet" href="css/doc_temp.css" />
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
		
        <div class="span9 sub_right mt_10" id="workspace" style="width:900px">
			<a class="index-ajax-load" target="#doc-todo-list" href="workflow_forme.jsp?workflowtype=1&wftype=1&WORKITEMID=<%=request.getParameter("WORKITEMID")%>&BILLKEY=<%=request.getParameter("BILLKEY")%>&BILLID=<%=request.getParameter("BILLID")%>&TYPE=<%=request.getParameter("TYPE")%>"></a>
		
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



<!-- yigo lib start-->
<script src="../../../web2/YIGO-all-debug.js" ></script>
<script src="../../../js/jquery/jquery-ui-1.10.3.custom/js/jquery-1.9.1.js" ></script>
<script src="../../../js/jquery/jquery-ui-1.10.3.custom/js/jquery-ui-1.10.3.custom.js" ></script>

<script src="../../../js/ckeditor_4.4.3_pack/ckeditor.js" ></script>
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
<script src="../../../web2/optIntro.js" ></script>
<script src="script/require.js" data-main="script/main"></script>
<script>
$(document).ready(function(){
	YIGO.regDefaultConfig('map_grid',{plugins:['thSortplugin']});
	YIGO.regDefaultConfig('map_grid',{plugins:['thSortplugin','gridgraphplugin']});
	YIGO.regDefaultConfig('map_echart',{plugins:['chart_pie','chart_bar','chart_line','chart_radar','chart_gauge']});
	var application = null;
	YIGO.ui.DefaultApplication = new YIGO.ui.Application({
		billFormPlugins:['focusbillplugin'/*,'layoutdesignerplugin'*/],
        container:new YIGO.ui.SingleContextContainer({
              container:$Yg('workspace')
        }),
        isBillProcessByThisApp:function(data){
                if(this.singletonContext.include(data.context))
                        return true;
                return false;
        }
	});
});
</script>

<!---- yigo lib end-->

<!-- workflow start-->
<script type="text/javascript" src="js/jquery.form.min.js"></script>
<script type="text/javascript" src="fancybox/jquery.fancybox.pack.js"></script>
<script type="text/javascript" src="js/moment.min.js"></script>
<script type="text/javascript" src="js/jsx.js?boke003"></script>
<script type="text/javascript" src="js/jquery-plugins.js?boke002"></script>
<script type="text/javascript" src="js/go-top.js"></script>
<script type="text/javascript" src="js/oa.js?boke003"></script>
<script type="text/javascript" src="js/counter.js?boke002"></script>
<script type="text/javascript" src="js/bill-action.js?boke003"></script>
<!-- workflow end-->
<!--yigo lib ext-->
<script type="text/javascript" charset="utf-8" src="../../../js/ueditor/ueditor.all.min.js"></script>
<script type="text/javascript" charset="utf-8" src="../../../js/ueditor/ueditor.config.js"></script>

<script>
$(function(){
	//formResize();
	<% 
		String para = request.getParameter("Para");
	if ("_create".equals(para))
	{%>
		$('#createEle').click();
	<%}%>
})
function formResize(){
	 var bodyHeight = $(window).height(),
		  eleIframe = bodyHeight-20;
	 //$("#aside_left,#workspace").height(eleIframe+"px");
}
$(window).resize(function() {
	//formResize();
});
</script>

</body>
</html>