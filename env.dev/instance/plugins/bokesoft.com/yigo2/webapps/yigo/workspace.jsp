<%@page contentType="text/html;charset=UTF-8" language="java" %>
<!DOCTYPE html>
<html>
	<head>
	    <meta http-equiv="Content-Type" content="application/json;charset=UTF-8">
	    <title>工作台</title>
	    <!--css引用--><!-- 
	    <link rel="stylesheet" href="yesui/plugins/jquery/css/jquery-ui-1.10.4.custom.min.css">  -->
	    <link rel="stylesheet" href="yesui/plugins/jquery/css/jquery-ui.css"> 
	    <link rel="stylesheet" href="yesui/plugins/jquery/css/ui.jqgrid.css">
	    <link rel="stylesheet" href="yesui/plugins/jquery/fullcalendar/fullcalendar.css">
	    <link rel="stylesheet" href="yesui/plugins/jquery/css/jquery.ui.dict.css">
	    <link rel="stylesheet" href="yesui/plugins/jquery/css/jquery.ui.listview.css">
	    <link rel="stylesheet" href="yesui/plugins/jquery/css/jquery.ui.maskinput.css">
	    <link rel="stylesheet" href="yesui/plugins/jquery/css/jquery.ui.menubar.css">
	    <link rel="stylesheet" href="yesui/plugins/jquery/css/jquery.ui.toolbar.css">
	    <link rel="stylesheet" href="yesui/plugins/jquery/css/jquery.ui.treeview.css">
		<link rel="stylesheet" href="yesui/plugins/jquery/css/default/jquery.treeTable.css">
	    <link rel="stylesheet" href="yesui/resources/css/core.css">
	    <link rel="stylesheet" href="yesui/resources/css/treemenubar.css">
	    <link rel="stylesheet" href="yesui/plugins/jquery/bootstrap/css/bootstrap.css"> 
   		<link rel="stylesheet" href="yesui/plugins/jquery/datepicker/css/layout.css" />
   		<link rel="stylesheet" href="yesui/plugins/jquery/datepicker/css/datepicker.css"/>
   		<link rel="stylesheet" href="yesui/plugins/jquery/smartspin/smartspinner.css"/>
	
	    <script type="text/javascript" src="yesui/plugins/jquery/jquery-1.10.2.js"></script>
	    <script type="text/javascript" src="yesui/plugins/jquery/jquery.json-2.3.min.js"></script>
	    <script type="text/javascript" src="yesui/plugins/jquery/jquery.cookie.js"></script>
	    <script type="text/javascript" src="yesui/source/yes-ui.js"></script><!-- 
	    fullcalendar只有在特定页面下才需要，可以使用动态加载js
	    <script type="text/javascript" src="yesui/ui/jquery/fullcalendar/fullcalendar.js"></script> -->
	    <script type="text/javascript" src="yesui/plugins/jquery/jqgrid/grid.locale-cn.js"></script>
	    <script type="text/javascript" src="yesui/plugins/jquery/jqgrid/jquery.jqGrid.src.js"></script>
        <script type="text/javascript" src="yesui/plugins/jquery/ajaxfileupload.js"></script>
	    <!-- 
	    <script type="text/javascript" src="yesui/plugins/jquery/jquery-ui-i18n.js"></script> --><!-- 
	    <script type="text/javascript" src="yesui/plugins/jquery/jquery-ui-1.10.4.custom.js"></script> --><!-- 
	    <script type="text/javascript" src="yesui/plugins/jquery/ui-extend/jquery.ui.dict.js"></script>
	    <script type="text/javascript" src="yesui/plugins/jquery/ui-extend/jquery.ui.listview.js"></script>
	    <script type="text/javascript" src="yesui/plugins/jquery/ui-extend/jquery.ui.maskinput.js"></script>
	    <script type="text/javascript" src="yesui/plugins/jquery/ui-extend/jquery.ui.texteditor.js"></script>
	    <script type="text/javascript" src="yesui/plugins/jquery/ui-extend/jquery.ui.treeview.js"></script>
	    <script type="text/javascript" src="yesui/plugins/jquery/ui-extend/jquery.ui.treemenubar.js"></script> -->
	     <!-- 
	    <script type="text/javascript" src="yesui/plugins/jquery/jquery-ui.js"></script> -->
	    <script type="text/javascript" src="yesui/plugins/jquery/ui-extend/jquery.ui.treeTable.js"></script> <!-- 
	    <script type="text/javascript" src="yesui/plugins/jquery/ui-extend/jquery.ui.menubar.js"></script>
	    <script type="text/javascript" src="yesui/plugins/jquery/ui-extend/jquery.ui.toolbar.js"></script>
	    <script type="text/javascript" src="yesui/plugins/jquery/ui-extend/jquery.ui.treeTable.js"></script> 
	    <script type="text/javascript" src="yesui/plugins/jquery/ui-extend/jquery-ui-timepicker-addon.js"></script> -->
	    <script type="text/javascript" src="yesui/plugins/jquery/ui-extend/jquery.clearable.js"></script>
	    <script type="text/javascript" src="yesui/plugins/jquery/ui-extend/jquery.placeholder.js"></script>

	    <script type="text/javascript" src="yesui/source/common/jQueryExt.js"></script>
	    <script type="text/javascript" src="yesui/source/common/jQueryUtils.js"></script>
	    <script type="text/javascript" src="yesui/source/common/formstack.js"></script>
	    <script type="text/javascript" src="yesui/source/parser/parser.js"></script>
	    <script type="text/javascript" src="yesui/source/service/servicemanager.js"></script><!-- 
	    <script type="text/javascript" src="yesui/struct/document.js"></script>
	    <script type="text/javascript" src="yesui/struct/datatable/datatable.js"></script>
	    <script type="text/javascript" src="yesui/struct/datatable/metadata.js"></script>
	    <script type="text/javascript" src="yesui/struct/datatable/columninfo.js"></script>
	    <script type="text/javascript" src="yesui/struct/datatable/rowstate.js"></script>
	    <script type="text/javascript" src="yesui/struct/datatable/row.js"></script> -->
	    <script type="text/javascript" src="yesui/source/ui/form.js"></script>
	    <script type="text/javascript" src="yesui/source/ui/component/componentmgr.js"></script>
	    <script type="text/javascript" src="yesui/source/ui/component/component.js"></script>
	    <script type="text/javascript" src="yesui/source/ui/component/menu.js"></script>
	    <script type="text/javascript" src="yesui/source/ui/component/toolbar.js"></script>
	    <script type="text/javascript" src="yesui/source/ui/component/treemenubar.js"></script>
	    <script type="text/javascript" src="yesui/source/ui/component/yiuiconsts.js"></script>
	    <script type="text/javascript" src="yesui/source/ui/component/control/control.js"></script>
	    <script type="text/javascript" src="yesui/source/ui/component/control/databinding.js"></script>
	    <script type="text/javascript" src="yesui/source/ui/component/control/button.js"></script>
	    <script type="text/javascript" src="yesui/source/ui/component/control/buttongroup.js"></script>
	    <script type="text/javascript" src="yesui/source/ui/component/control/dropdownbutton.js"></script>
	    <script type="text/javascript" src="yesui/source/ui/component/control/splitbutton.js"></script>
	    <script type="text/javascript" src="yesui/source/ui/component/control/calendar.js"></script>
	    <script type="text/javascript" src="yesui/source/ui/component/control/checkbox.js"></script>
	    <script type="text/javascript" src="yesui/source/ui/component/control/combobox.js"></script>
	    <script type="text/javascript" src="yesui/source/ui/component/control/databinding.js"></script>
	    <script type="text/javascript" src="yesui/source/ui/component/control/datepicker.js"></script>
	    <script type="text/javascript" src="yesui/source/ui/component/control/dict.js"></script>
	    <script type="text/javascript" src="yesui/source/ui/component/control/dicttree.js"></script>
	    <script type="text/javascript" src="yesui/source/ui/component/control/grid.js"></script>
	    <script type="text/javascript" src="yesui/source/ui/component/control/chart.js"></script>
	    <script type="text/javascript" src="yesui/source/ui/component/control/hyperlink.js"></script>
	    <script type="text/javascript" src="yesui/source/ui/component/control/imagelist.js"></script>
	    <script type="text/javascript" src="yesui/source/ui/component/control/label.js"></script>
	    <script type="text/javascript" src="yesui/source/ui/component/control/listview.js"></script>
	    <script type="text/javascript" src="yesui/source/ui/component/control/numbereditor.js"></script>
	    <script type="text/javascript" src="yesui/source/ui/component/control/image.js"></script>
	    <script type="text/javascript" src="yesui/source/ui/component/control/radiobutton.js"></script>
	    <script type="text/javascript" src="yesui/source/ui/component/control/texteditor.js"></script>
	    <script type="text/javascript" src="yesui/source/ui/component/control/textbutton.js"></script>
	    <script type="text/javascript" src="yesui/source/ui/component/control/statusbar.js"></script>
	    <script type="text/javascript" src="yesui/source/ui/component/control/treeview.js"></script>
	    <script type="text/javascript" src="yesui/source/ui/component/control/passwordeditor.js"></script>
	    <script type="text/javascript" src="yesui/source/ui/component/control/userinfopane.js"></script>
	    <script type="text/javascript" src="yesui/source/ui/component/layout/autolayout.js"></script>
	    <script type="text/javascript" src="yesui/source/ui/component/layout/borderlayout.js"></script>
	    <script type="text/javascript" src="yesui/source/ui/component/layout/columnlayout.js"></script>
	    <script type="text/javascript" src="yesui/source/ui/component/layout/fluidcolumnlayout.js"></script>
	    <script type="text/javascript" src="yesui/source/ui/component/layout/gridlayout.js"></script>
	    <script type="text/javascript" src="yesui/source/ui/component/layout/tabslayout.js"></script>
	    <script type="text/javascript" src="yesui/source/ui/component/layout/splitlayout.js"></script>
	    <script type="text/javascript" src="yesui/source/ui/component/layout/flexflowlayout.js"></script>
	    <script type="text/javascript" src="yesui/source/ui/component/layout/tablelayout.js"></script>
	    <script type="text/javascript" src="yesui/source/ui/component/layout/fluidtablelayout.js"></script>
	    <script type="text/javascript" src="yesui/source/ui/component/panel/panel.js"></script>
	    <script type="text/javascript" src="yesui/source/ui/component/panel/borderlayoutpanel.js"></script>
	    <script type="text/javascript" src="yesui/source/ui/component/panel/columnlayoutpanel.js"></script>
	    <script type="text/javascript" src="yesui/source/ui/component/panel/flowlayoutpanel.js"></script>
	    <script type="text/javascript" src="yesui/source/ui/component/panel/flexflowlayoutpanel.js"></script>
	    <script type="text/javascript" src="yesui/source/ui/component/panel/fluidcolumnlayoutpanel.js"></script>
	    <script type="text/javascript" src="yesui/source/ui/component/panel/gridlayoutpanel.js"></script>
	    <script type="text/javascript" src="yesui/source/ui/component/panel/splitpanel.js"></script>
	    <script type="text/javascript" src="yesui/source/ui/component/panel/tabpanel.js"></script>
	    <script type="text/javascript" src="yesui/source/ui/component/panel/tabpanelex.js"></script>
	    <script type="text/javascript" src="yesui/source/ui/component/panel/treepanel.js"></script>
	    <script type="text/javascript" src="yesui/source/ui/component/panel/tabcontainer.js"></script>
	    <script type="text/javascript" src="yesui/source/ui/component/panel/tabexcontainer.js"></script>
	    <script type="text/javascript" src="yesui/source/ui/component/panel/stackcontainer.js"></script>
	    <script type="text/javascript" src="yesui/source/ui/component/panel/tree.js"></script>
	    <script type="text/javascript" src="yesui/source/ui/component/panel/fluidtablelayoutpanel.js"></script>
	    <script type="text/javascript" src="yesui/source/ui/component/treemenubar.js"></script>
		<script type="text/javascript" src="yesui/source/ui/component/control/controlEvent.js"></script>
		
	    <script type="text/javascript" src="yesui/plugins/jquery/bootstrap/js/dropdown.js"></script>

		
        <script type="text/javascript" src="eventTest.js"></script>
        
		<script type="text/javascript" src="yesui/plugins/jquery/flotr/lib/bean-min.js"></script>
		<script type="text/javascript" src="yesui/plugins/jquery/flotr/lib/underscore-min.js"></script>

		<script type="text/javascript" src="yesui/plugins/jquery/flotr/js/Flotr.js"></script>
		<script type="text/javascript" src="yesui/plugins/jquery/flotr/js/DefaultOptions.js"></script>
		<script type="text/javascript" src="yesui/plugins/jquery/flotr/js/Color.js"></script>
		<script type="text/javascript" src="yesui/plugins/jquery/flotr/js/Date.js"></script>
		<script type="text/javascript" src="yesui/plugins/jquery/flotr/js/DOM.js"></script>
		<script type="text/javascript" src="yesui/plugins/jquery/flotr/js/EventAdapter.js"></script>
		<script type="text/javascript" src="yesui/plugins/jquery/flotr/js/Text.js"></script>
		<script type="text/javascript" src="yesui/plugins/jquery/flotr/js/Graph.js"></script>
		<script type="text/javascript" src="yesui/plugins/jquery/flotr/js/Axis.js"></script>
		<script type="text/javascript" src="yesui/plugins/jquery/flotr/js/Series.js"></script>
		<script type="text/javascript" src="yesui/plugins/jquery/flotr/js/Series.js"></script>
		<script type="text/javascript" src="yesui/plugins/jquery/flotr/js/types/lines.js"></script>
		<script type="text/javascript" src="yesui/plugins/jquery/flotr/js/types/bars.js"></script>
		<script type="text/javascript" src="yesui/plugins/jquery/flotr/js/types/points.js"></script>
		<script type="text/javascript" src="yesui/plugins/jquery/flotr/js/types/pie.js"></script>
		<script type="text/javascript" src="yesui/plugins/jquery/flotr/js/types/candles.js"></script>
		<script type="text/javascript" src="yesui/plugins/jquery/flotr/js/types/markers.js"></script>
		<script type="text/javascript" src="yesui/plugins/jquery/flotr/js/types/radar.js"></script>
		<script type="text/javascript" src="yesui/plugins/jquery/flotr/js/types/bubbles.js"></script>
		<script type="text/javascript" src="yesui/plugins/jquery/flotr/js/types/gantt.js"></script>
		<script type="text/javascript" src="yesui/plugins/jquery/flotr/js/types/timeline.js"></script>
		<script type="text/javascript" src="yesui/plugins/jquery/flotr/js/plugins/download.js"></script>
		<script type="text/javascript" src="yesui/plugins/jquery/flotr/js/plugins/selection.js"></script>
		<script type="text/javascript" src="yesui/plugins/jquery/flotr/js/plugins/spreadsheet.js"></script>
		<script type="text/javascript" src="yesui/plugins/jquery/flotr/js/plugins/grid.js"></script>
		<script type="text/javascript" src="yesui/plugins/jquery/flotr/js/plugins/hit.js"></script>
		<script type="text/javascript" src="yesui/plugins/jquery/flotr/js/plugins/crosshair.js"></script>
		<script type="text/javascript" src="yesui/plugins/jquery/flotr/js/plugins/labels.js"></script>
		<script type="text/javascript" src="yesui/plugins/jquery/flotr/js/plugins/legend.js"></script>
		<script type="text/javascript" src="yesui/plugins/jquery/flotr/js/plugins/titles.js"></script>
		
	   	<script type="text/javascript" src="yesui/plugins/jquery/datepicker/js/datepicker.js"></script>
    	<script type="text/javascript" src="yesui/plugins/jquery/datepicker/js/eye.js"></script>
    	<script type="text/javascript" src="yesui/plugins/jquery/datepicker/js/utils.js"></script>
    	<script type="text/javascript" src="yesui/plugins/jquery/smartspin/smartspinner.js"></script>
    	
    	
		<link type="text/css" rel="stylesheet" href="yesui/plugins/jquery/modaldialog/css/jquery.modaldialog.css" />
		<script type="text/javascript" language="JavaScript" src="yesui/plugins/jquery/modaldialog/js/modaldialog.js"> </script>
		
	    <!-- 
        <script type="text/javascript" src="yesui/YESUI-all-debug.js"></script>
         -->
	    
	    
	    <script type="text/javascript">
	        $(function () {
				//根据jsType类型引入不同包下得controlEvent.js文件
				//jsImport(getJsType());
				
				var location_pathname = document.location.pathname;
				while (location_pathname.indexOf('/') == 0)
					location_pathname = location_pathname.substr(1);
				var baseurl = unescape(location_pathname.substr(0));
				var service = baseurl.substring(0, baseurl.indexOf('/'));
	        	ServiceManager.ServletURL=[window.location.protocol,'//',window.location.host,'/',service,'/','servlet'].join('');
	        	initWidth(); 
		        ServiceManager.loadHomePage("#form");
	        });
	        function initWidth() {
	            var bodyWidth = (document.compatMode == 'BackCompat') ?
	                    document.body.clientWidth : document.documentElement.clientWidth;
	            var bodyHeight = (document.compatMode == 'BackCompat') ?
	                    document.body.clientHeight : document.documentElement.clientHeight;
	            $('#form').css('width', bodyWidth);
	            $('#form').css('height', bodyHeight);
	        }
	       function resizeViewport() {
	        	initWidth();
	        	
	        	var panel = FormStack.formList[0].getRootPanel();
	        	panel.setWidth($('#form').width());
	        	panel.setHeight($('#form').height());
	        	  
	        	panel.doLayout(panel.getWidth(), panel.getHeight());
	        }
			$(window).on('resize', resizeViewport); 
	    </script>
	</head>
	<body>
		<div id="form"></div>
	</body>
</html>