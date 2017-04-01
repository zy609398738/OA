<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib uri="/WEB-INF/map-html.tld" prefix="yigo"%>
<%@ page import="java.util.*"%>
	
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
	<meta http-equiv="X-UA-Compatible" content="IE=EmulateIE8" />
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
	<title>博科综合管理</title>
	<!-- MAP css -->
    <link rel="stylesheet"  href="../../../js/jquery/jquery-ui-1.10.3.custom/css/flick/jquery-ui-1.10.3.custom.css" />
	<link rel="stylesheet" href="../../../js/jquery/jQuery-File-Upload-master/css/jquery.fileupload.css" />
	<link rel="stylesheet" href="../../../js/jquery/jquery.hoverscroll/jquery.hoverscroll.css" />
	<link rel="stylesheet" href="../../../js/jquery/vex-master/css/vex.css" />
    <link rel="stylesheet" href="../../../js/jquery/vex-master/css/vex-theme-os.css" />
	
	<link rel="stylesheet" href="../../../js/primeui-1.1/themes/casablanca/theme.css" />
	
    <link rel="stylesheet"  media="screen" href="../../../js/jquery/jquery-jqgrid/css/ui.jqgrid.css" />
	<!--
	<link rel="stylesheet" href="../../../web2/css/bootstrap/css/bootstrap.min.css" />
	-->
	<link rel="stylesheet" href="../../../js/intro.js-0.8.0/introjs.css" />
	
    <link rel="stylesheet"  href="../../../web2/css/YIGO.css" />
    <link rel="stylesheet"  href="../../../web2/css/patchUI.css" />
	<link rel="stylesheet" href="../../../web2/css/portal.css" />
	<link rel="stylesheet" href="../../../web2/css/search.css" />
<!--
    <link rel="stylesheet" href="fancybox/jquery.fancybox.min.css">
    <link rel="stylesheet" href="fancybox/helpers/jquery.fancybox-buttons.min.css">
    <link rel="stylesheet" href="fancybox/helpers/jquery.fancybox-thumbs.min.css">
	<!--
    <link rel="stylesheet" type="text/css" href="../../../web/css/MAP-all.css?boke001" />
    <link rel="stylesheet" type="text/css" href="../../../web/css/MAP.ui.MAP.css?boke001" />
	-->

    <link rel="Stylesheet" href="../workflow/css/oa.css?boke001" />



	
    <script src="../../../js/jquery/jquery-ui-1.10.3.custom/js/jquery-1.9.1.js"  type="text/javascript"></script>
	<script type="text/javascript" src="js/jquery.form.min.js"></script>
	<!--<script type="text/javascript" src="fancybox/jquery.fancybox.pack.js"></script>-->
	<script type="text/javascript" src="js/moment.min.js"></script>
	<script type="text/javascript" src="js/jsx.js?boke003"></script>
	<script type="text/javascript" src="js/jquery-plugins.js?boke002"></script>
	<script type="text/javascript" src="js/go-top.js"></script>
<!--
	<script type="text/javascript" src="js/oa.js?boke003"></script>
	<script type="text/javascript" src="js/counter.js?boke002"></script>
	-->
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
	<script src="../../../js/jquery/jQuery-File-Upload-master/js/jquery.fileupload-validate.js" ></script>
	<script src="../../../js/jquery/jQuery-File-Upload-master/js/jquery.iframe-transport.js" ></script>
	<script src="../../../js/jquery/jquery-ui-1.10.3.custom/development-bundle/ui/minified/i18n/jquery.ui.datepicker-zh-CN.min.js" ></script>
	<script src="../../../js/jquery/timepicker/jquery-ui-timepicker.js"></script>
	<script src="../../../js/jquery/jquery.hoverscroll/jquery.hoverscroll.js" ></script>
	<script src="../../../js/jquery/migrate/migrate.js" ></script>
	<script src="../../../js/jquery/splitter/splitter.js" ></script>
	<script src="../../../js/jquery/vex-master/js/vex.combined.min.js" ></script>
	<!-- adapter -->
	<script src="../../../web2/adapter/jqueryui/YIGO.ui.portal.ComponentImpl.js" ></script>
	<script src="../../../web2/adapter/jqueryui/YIGO.ui.ControlUI.js" ></script>
	<script src="../../../web2/adapter/jqueryui/YIGO.ui.ControlVM.js" ></script>
	<!--script frontPage.js" ></script-->
	<!--
	<script src="../../../web2/search.js" ></script>-->
    <script src="../../../web2/optIntro.js" ></script>
	<!--footer-->
	<!--yigo lib ext-->
	<script type="text/javascript" src="../public/yigo-ext.js"></script>	
	<style type="text/css">
		#ws_content{
			height:450px;
		}
		#ws_content .y_billform_content{
			
		}
		iframe{
			border:0;
			background:#fff;
		}
	</style>
	<!-- MAP lib -->
	
	<script type="text/javascript">
		function preview(){
			var topic = $('HC_topic'+MAP_BillContext.billView.viewID).value;
			var newscontent = $('HC_newscontent'+MAP_BillContext.billView.viewID).value;
			var billdate = $('HC_billdate'+MAP_BillContext.billView.viewID).value;
			var employeeid = $('HC_employeeid'+MAP_BillContext.billView.viewID).value;
			
			var keys=['title','content','maker','makedate'];  
			var values=[topic,newscontent,employeeid,billdate];  
			openWindowWithPost("/Yigo/newspreview.page",'新闻预览',keys,values);  
		}
		
		function openWindowWithPost(url,name,keys,values)  
		{  
			var oForm = document.createElement("form");  
			oForm.id="newsdraft";  
			oForm.method="get";  
			oForm.action=url;  
			oForm.target="newsdraft";  
			if (keys && values && (keys.length == values.length))  
			{  
				for (var i=0; i < keys.length; i++)  
				{  
					var oInput = document.createElement("input");  
					oInput.type="hidden";  
					oInput.name=keys[i]; 
					oInput.value=values[i];  
					oForm.appendChild(oInput);  
				}  
			}  
			oForm.onSubmit=function(){openSpecfiyWindown(name)};  
			document.body.appendChild(oForm);  
			oForm.submit();  
		}  
		
		function openSpecfiyWindown(name)
		{    
			window.open('about:blank',name,'height=1024, width=1280, top=0, left=0, toolbar=no, menubar=no, scrollbars=yes, resizable=yes,location=no, status=no');   
		} 
		
		window.goBackSpecial = function(dest){
			parent.location.replace('../newslist.page');
		};		
	</script>
</head>
<script>
  var windowHeight=document.all ? document.getElementsByTagName("html")[0].offsetHeight : window.innerHeight;
  window.midAreaOuterHeight = windowHeight + 18;
  $(".y_layout_table").css("border","0px");
 </script>
<body>
	<div id="workspace1">
	<%
	String nav = request.getParameter("nav");
	if(nav!=null){
	%>
	<div style="margin:10px;"><%=nav%></div>	
	<%
	}
	%>
	<yigo:context>
		<div id="ws_content"></div>
		<yigo:out exp="VelocityBill(WebForm3,ws_content,{subsys_SCM_}&WebGetPara(billKey),WebGetPara(op),,)"/>
	</yigo:context>
	</div>
</body>
<script>
	setInterval("reSizeContent()",200);
	function reSizeContent(){
		$("#ws_content").css("height",(window.midAreaOuterHeight-20)+'px');
		$(".y_billform_content",$("#ws_content")).css("height",(window.midAreaOuterHeight-20)+'px');
	}
 </script>



</html>



