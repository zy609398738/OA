<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
	<head>

		<script type="text/javascript" src="common/jquery/jquery-1.10.2.js"></script>
		<script type="text/javascript" src="common/jquery/jstz-1.0.4.min.js"></script>
		
		<script type="text/javascript" src="yesui/ui/yes-ui.js"></script>
		<script type="text/javascript" src="common/data/yiuiconsts.js"></script>
		<script type="text/javascript" src="common/ext/jsext.js"></script>
        <script type="text/javascript" src="common/exception/ViewException.js"></script>
        <script type="text/javascript" src="common/exception/BPMException.js"></script>
		<script type="text/javascript" src="yesui/base/jQueryExt.js"></script>
		<script type="text/javascript" src="yesui/base/prototypeExt.js"></script>
		<script type="text/javascript" src="yesui/svr/svrmgr.js"></script>
		<script type="text/javascript" src="common/expr/parser.js"></script>
		<script type="text/javascript" src="common/expr/valimpl.js"></script>
        <script type="text/javascript" src="common/expr/exprutil.js"></script>
        <script type="text/javascript" src="common/expr/funimplmap.js"></script>
		<script type="text/javascript" src="common/util/datautil.js"></script>
        <script type="text/javascript" src="common/util/numericutil.js"></script>
        <script type="text/javascript" src="common/util/typeconvertor.js"></script>
        <script type="text/javascript" src="common/util/subdetailutil.js"></script>
		<script type="text/javascript" src="common/data/datatype.js"></script>
		
		<script type="text/javascript" src="yesui/svr/purehandler.js"></script>
		<script type="text/javascript" src="yesui/svr/handler/basehandler.js"></script>
		<script type="text/javascript" src="yesui/svr/handler/attachmenthandler.js"></script>
		<script type="text/javascript" src="yesui/svr/handler/buttonhandler.js"></script>
		<script type="text/javascript" src="yesui/svr/handler/comboboxhandler.js"></script>
		<script type="text/javascript" src="yesui/svr/handler/checkboxhandler.js"></script>
        <script type="text/javascript" src="yesui/svr/handler/celldicthandler.js"></script>
		<script type="text/javascript" src="yesui/svr/handler/dicthandler.js"></script>
		<script type="text/javascript" src="yesui/svr/handler/datepickerhandler.js"></script>
		<script type="text/javascript" src="yesui/svr/handler/dropdownbuttonhandler.js"></script>
		<script type="text/javascript" src="yesui/svr/handler/gridhandler.js"></script>
		<script type="text/javascript" src="yesui/svr/handler/hyperlinkhandler.js"></script>
		<script type="text/javascript" src="yesui/svr/handler/imagehandler.js"></script>
		<script type="text/javascript" src="yesui/svr/handler/listviewhandler.js"></script>
		<script type="text/javascript" src="yesui/svr/handler/numbereditorhandler.js"></script>
		<script type="text/javascript" src="yesui/svr/handler/passwordeditorhandler.js"></script>
		<script type="text/javascript" src="yesui/svr/handler/radiobuttonhandler.js"></script>
		<script type="text/javascript" src="yesui/svr/handler/splitbuttonhandler.js"></script>
		<script type="text/javascript" src="yesui/svr/handler/searchboxhandler.js"></script>
		<script type="text/javascript" src="yesui/svr/handler/textareahandler.js"></script>
		<script type="text/javascript" src="yesui/svr/handler/texteditorhandler.js"></script>
		<script type="text/javascript" src="yesui/svr/handler/toolbarhandler.js"></script>
		<script type="text/javascript" src="yesui/svr/handler/treehandler.js"></script>
		<script type="text/javascript" src="yesui/svr/handler/dialoghandler.js"></script>
		<script type="text/javascript" src="yesui/svr/handler/dictviewhandler.js"></script>
		<script type="text/javascript" src="yesui/svr/handler/filechooserhandler.js"></script>
		<script type="text/javascript" src="yesui/svr/handler/mapdrawhandler.js"></script>
		
		<script type="text/javascript" src="yesui/svr/behavior/basebehavior.js"></script>
		<script type="text/javascript" src="yesui/svr/behavior/buttonbehavior.js"></script>
		<script type="text/javascript" src="yesui/svr/behavior/checkboxbehavior.js"></script>
		<script type="text/javascript" src="yesui/svr/behavior/comboboxbehavior.js"></script>
		<script type="text/javascript" src="yesui/svr/behavior/datepickerbehavior.js"></script>
		<script type="text/javascript" src="yesui/svr/behavior/dictbehavior.js"></script>
		<script type="text/javascript" src="yesui/svr/behavior/gridbehavior.js"></script>
		<script type="text/javascript" src="yesui/svr/behavior/hyperlinkbehavior.js"></script>
		<script type="text/javascript" src="yesui/svr/behavior/imagebehavior.js"></script>
		<script type="text/javascript" src="yesui/svr/behavior/listviewbehavior.js"></script>
		<script type="text/javascript" src="yesui/svr/behavior/numbereditorbehavior.js"></script>
		<script type="text/javascript" src="yesui/svr/behavior/radiobuttonbehavior.js"></script>
		<script type="text/javascript" src="yesui/svr/behavior/splitbuttonbehavior.js"></script>
		<script type="text/javascript" src="yesui/svr/behavior/searchboxbehavior.js"></script>
		<script type="text/javascript" src="yesui/svr/behavior/textareabehavior.js"></script>
		<script type="text/javascript" src="yesui/svr/behavior/texteditorbehavior.js"></script>
		<script type="text/javascript" src="yesui/svr/behavior/utcdatepickerbehavior.js"></script>
		
		<script type="text/javascript" src="yesui/svr/format/dateformat.js"></script>
		<script type="text/javascript" src="yesui/svr/format/decimalformat.js"></script>
		<script type="text/javascript" src="yesui/svr/format/textformat.js"></script>
		
		<script type="text/javascript" src="yesui/svr/service/dictserviceproxy.js"></script>
		<script type="text/javascript" src="yesui/svr/request.js"></script>
		<script type="text/javascript" src="yesui/svr/Base64Utils.js"></script>
		<script type="text/javascript" src="yesui/svr/uiutils.js"></script>
		<script type="text/javascript" src="yesui/ui/filtermap.js"></script>
		<script type="text/javascript" src="yesui/ui/opt.js"></script>
		<script type="text/javascript" src="yesui/ui/showdata.js"></script>
		<script type="text/javascript" src="yesui/ui/fun/basefun.js"></script>
        <script type="text/javascript" src="yesui/ui/objectloop.js"></script>
		<script type="text/javascript" src="yesui/ui/vparser.js"></script>
        <script type="text/javascript" src="yesui/ui/statusproxy.js"></script>
		<script type="text/javascript" src="yesui/ui/uiprocess.js"></script>
		<script type="text/javascript" src="yesui/ui/paras.js"></script>
		<script type="text/javascript" src="yesui/ui/ppobject.js"></script>
		<script type="text/javascript" src="yesui/ui/form.js"></script>
        <script type="text/javascript" src="yesui/ui/focuspolicy.js"></script>
	    <script type="text/javascript" src="yesui/ui/formadapt.js"></script>
		<script type="text/javascript" src="yesui/ui/formbuilder.js"></script>
		<script type="text/javascript" src="yesui/ui/formstack.js"></script>
		<script type="text/javascript" src="yesui/ui/formRender.js"></script>
		
		<script type="text/javascript" src="yesui/ui/yescomponent/yesbutton.js"></script>
		<script type="text/javascript" src="yesui/ui/yescomponent/yeshyperlink.js"></script>
		<script type="text/javascript" src="yesui/ui/yescomponent/yesimage.js"></script>
		<script type="text/javascript" src="yesui/ui/yescomponent/yestexteditor.js"></script>
		<script type="text/javascript" src="yesui/ui/yescomponent/yeslabel.js"></script>
		<script type="text/javascript" src="yesui/ui/yescomponent/yesnumbereditor.js"></script>
		<script type="text/javascript" src="yesui/ui/yescomponent/yescheckbox.js"></script>
		<script type="text/javascript" src="yesui/ui/yescomponent/yesdict.js"></script>
		<script type="text/javascript" src="yesui/ui/yescomponent/yesdatepicker.js"></script>
		<script type="text/javascript" src="yesui/ui/yescomponent/yescombobox.js"></script>
		<script type="text/javascript" src="yesui/ui/yescomponent/yesdialog.js"></script>
		<script type="text/javascript" src="yesui/ui/component/componentmgr.js"></script>
		<script type="text/javascript" src="yesui/ui/component/component.js"></script>
		<script type="text/javascript" src="yesui/ui/component/conditionparas.js"></script>
		<script type="text/javascript" src="yesui/ui/component/control/control.js"></script>
		<script type="text/javascript" src="yesui/ui/component/control/toolbar.js"></script>
		<script type="text/javascript" src="yesui/ui/component/control/treemenubar.js"></script>
		<script type="text/javascript" src="yesui/ui/component/control/databinding.js"></script>
		<script type="text/javascript" src="yesui/ui/component/control/button.js"></script>
		<script type="text/javascript" src="yesui/ui/component/control/richeditor.js"></script>
		<script type="text/javascript" src="yesui/ui/component/control/buttongroup.js"></script>
		<script type="text/javascript" src="yesui/ui/component/control/dropdownbutton.js"></script>
		<script type="text/javascript" src="yesui/ui/component/control/splitbutton.js"></script>
		<script type="text/javascript" src="yesui/ui/component/control/calendar.js"></script>
		<script type="text/javascript" src="yesui/ui/component/control/checkbox.js"></script>
		<script type="text/javascript" src="yesui/ui/component/control/combobox.js"></script>
		<script type="text/javascript" src="yesui/ui/component/control/datepicker.js"></script>
		<script type="text/javascript" src="yesui/ui/component/control/dict.js"></script>
		<script type="text/javascript" src="yesui/ui/component/control/itemdata.js"></script>
		<script type="text/javascript" src="yesui/ui/component/control/dicttree.js"></script>
		<script type="text/javascript" src="yesui/ui/component/control/dictview.js"></script>
		<script type="text/javascript" src="yesui/ui/component/control/dictquerypanel.js"></script>
		<script type="text/javascript" src="yesui/ui/component/control/hyperlink.js"></script>
		<script type="text/javascript" src="yesui/ui/component/control/imagelist.js"></script>
		<script type="text/javascript" src="yesui/ui/component/control/label.js"></script>
		<script type="text/javascript" src="yesui/ui/component/control/listview.js"></script>
		<script type="text/javascript" src="yesui/ui/component/control/numbereditor.js"></script>
		<script type="text/javascript" src="yesui/ui/component/control/image.js"></script>
		<script type="text/javascript" src="yesui/ui/component/control/radiobutton.js"></script>
		<script type="text/javascript" src="yesui/ui/component/control/texteditor.js"></script>
		<script type="text/javascript" src="yesui/ui/component/control/textarea.js"></script>
		<script type="text/javascript" src="yesui/ui/component/control/textbutton.js"></script>
		<script type="text/javascript" src="yesui/ui/component/control/statusbar.js"></script>
		<script type="text/javascript" src="yesui/ui/component/control/treeview.js"></script>
		<script type="text/javascript" src="yesui/ui/component/control/passwordeditor.js"></script>
		<script type="text/javascript" src="yesui/ui/component/control/tree.js"></script>
		<script type="text/javascript" src="yesui/ui/component/control/attachment.js"></script>
		<script type="text/javascript" src="yesui/ui/component/control/separator.js"></script>
		<script type="text/javascript" src="yesui/ui/component/control/chart.js"></script>
        <script type="text/javascript" src="yesui/ui/component/control/bpmgraph.js"></script>
		<script type="text/javascript" src="yesui/ui/component/control/custom.js"></script>
		<script type="text/javascript" src="yesui/ui/component/control/userinfopane.js"></script>
		<script type="text/javascript" src="yesui/ui/component/control/rightsset.js"></script>
		<script type="text/javascript" src="yesui/ui/component/control/dialog.js"></script>
		<script type="text/javascript" src="yesui/ui/component/control/filechooser.js"></script>
		<script type="text/javascript" src="yesui/ui/component/control/mapdraw.js"></script>
		<script type="text/javascript" src="yesui/ui/component/control/utcdatepicker.js"></script>
		<script type="text/javascript" src="yesui/ui/component/control/searchbox.js"></script>
		<script type="text/javascript" src="yesui/ui/component/grid/gridsumutil.js"></script>
		<script type="text/javascript" src="yesui/ui/component/grid/grid.js"></script>
		<script type="text/javascript" src="yesui/ui/component/grid/editor/celleditor.js"></script>
		<script type="text/javascript" src="yesui/ui/component/grid/editor/celltexteditor.js"></script>
		<script type="text/javascript" src="yesui/ui/component/grid/editor/cellnumbereditor.js"></script>
		<script type="text/javascript" src="yesui/ui/component/grid/editor/celldatepicker.js"></script>
		<script type="text/javascript" src="yesui/ui/component/grid/editor/cellcombobox.js"></script>
		<script type="text/javascript" src="yesui/ui/component/grid/editor/celldict.js"></script>
		<script type="text/javascript" src="yesui/ui/component/grid/editor/cellimage.js"></script>
		<script type="text/javascript" src="yesui/ui/component/grid/editor/celltextbutton.js"></script>
		<script type="text/javascript" src="yesui/ui/component/layout/autolayout.js"></script>
		<script type="text/javascript" src="yesui/ui/component/layout/borderlayout.js"></script>
		<script type="text/javascript" src="yesui/ui/component/layout/columnlayout.js"></script>
		<script type="text/javascript" src="yesui/ui/component/layout/fluidcolumnlayout.js"></script>
		<script type="text/javascript" src="yesui/ui/component/layout/gridlayout.js"></script>
		<script type="text/javascript" src="yesui/ui/component/layout/tablayout.js"></script>
		<script type="text/javascript" src="yesui/ui/component/layout/tab.js"></script>
		<script type="text/javascript" src="yesui/ui/component/layout/splitlayout.js"></script>
		<script type="text/javascript" src="yesui/ui/component/layout/flexflowlayout.js"></script>
		<script type="text/javascript" src="yesui/ui/component/layout/flowlayout.js"></script>
		<script type="text/javascript" src="yesui/ui/component/layout/tablelayout.js"></script>
		<script type="text/javascript" src="yesui/ui/component/layout/fluidtablelayout.js"></script>
		<script type="text/javascript" src="yesui/ui/component/panel/panel.js"></script>
		<script type="text/javascript" src="yesui/ui/component/panel/borderlayoutpanel.js"></script>
		<script type="text/javascript" src="yesui/ui/component/panel/columnlayoutpanel.js"></script>
		<script type="text/javascript" src="yesui/ui/component/panel/flowlayoutpanel.js"></script>
		<script type="text/javascript" src="yesui/ui/component/panel/flexflowlayoutpanel.js"></script>
		<script type="text/javascript" src="yesui/ui/component/panel/fluidcolumnlayoutpanel.js"></script>
		<script type="text/javascript" src="yesui/ui/component/panel/fluidtablelayoutpanel.js"></script>
		<script type="text/javascript" src="yesui/ui/component/panel/gridlayoutpanel.js"></script>
		<script type="text/javascript" src="yesui/ui/component/panel/splitpanel.js"></script>
		<script type="text/javascript" src="yesui/ui/component/panel/tabpanel.js"></script>
		<script type="text/javascript" src="yesui/ui/component/panel/tabpanelex.js"></script>
		<script type="text/javascript" src="yesui/ui/component/panel/treepanel.js"></script>
		<script type="text/javascript" src="yesui/ui/component/panel/tabcontainer.js"></script>
		<script type="text/javascript" src="yesui/ui/component/panel/tabexcontainer.js"></script>
		<script type="text/javascript" src="yesui/ui/component/panel/stackcontainer.js"></script>
		
		<script type="text/javascript" src="yesui/ui/maincontainer.js"></script>
		<script type="text/javascript" src="yesui/ui/maintree.js"></script>
		
        <script type="text/javascript" src="yesui/ui/plugin/js/raphael-src.js"></script>
		<script type="text/javascript" src="yesui/ui/plugin/js/jquery.cookie.js"></script>
		
		<script type="text/javascript" src="yesui/ui/plugin/js/datepicker/datetimemask/dateTimeMask.js"></script>
		<script type="text/javascript" src="yesui/ui/plugin/js/jquery.json-2.3.min.js"></script>
		
		<script type="text/javascript" src="yesui/ui/plugin/js/ygrid/ygrid.locale-cn.js"></script>
		<script type="text/javascript" src="yesui/ui/plugin/js/ygrid/jquery.yGrid.src.js"></script>
        <script type="text/javascript" src="yesui/ui/plugin/js/decimal/decimal.js"></script>
		<script type="text/javascript" src="yesui/ui/plugin/js/picture/ajaxfileupload.js"></script>
		<script type="text/javascript" src="yesui/ui/plugin/js/ui-extend/jquery.placeholder.js"></script>
		<script type="text/javascript" src="yesui/ui/plugin/js/ui-extend/jquery.ui.treeTable.js"></script>
		
		<script type="text/javascript" src="yesui/ui/plugin/js/flotr/lib/bean-min.js"></script>
		<script type="text/javascript" src="yesui/ui/plugin/js/flotr/lib/underscore-min.js"></script>
		<script type="text/javascript" src="yesui/ui/plugin/js/flotr/js/Flotr.js"></script>
		<script type="text/javascript" src="yesui/ui/plugin/js/flotr/js/DefaultOptions.js"></script>
		<script type="text/javascript" src="yesui/ui/plugin/js/flotr/js/Color.js"></script>
		<script type="text/javascript" src="yesui/ui/plugin/js/flotr/js/Date.js"></script>
		<script type="text/javascript" src="yesui/ui/plugin/js/flotr/js/DOM.js"></script>
		<script type="text/javascript" src="yesui/ui/plugin/js/flotr/js/EventAdapter.js"></script>
		<script type="text/javascript" src="yesui/ui/plugin/js/flotr/js/Text.js"></script>
		<script type="text/javascript" src="yesui/ui/plugin/js/flotr/js/Graph.js"></script>
		<script type="text/javascript" src="yesui/ui/plugin/js/flotr/js/Axis.js"></script>
		<script type="text/javascript" src="yesui/ui/plugin/js/flotr/js/Series.js"></script>
		<script type="text/javascript" src="yesui/ui/plugin/js/flotr/js/Series.js"></script>
		<script type="text/javascript" src="yesui/ui/plugin/js/flotr/js/types/lines.js"></script>
		<script type="text/javascript" src="yesui/ui/plugin/js/flotr/js/types/bars.js"></script>
		<script type="text/javascript" src="yesui/ui/plugin/js/flotr/js/types/points.js"></script>
		<script type="text/javascript" src="yesui/ui/plugin/js/flotr/js/types/pie.js"></script>
		<script type="text/javascript" src="yesui/ui/plugin/js/flotr/js/types/candles.js"></script>
		<script type="text/javascript" src="yesui/ui/plugin/js/flotr/js/types/markers.js"></script>
		<script type="text/javascript" src="yesui/ui/plugin/js/flotr/js/types/radar.js"></script>
		<script type="text/javascript" src="yesui/ui/plugin/js/flotr/js/types/bubbles.js"></script>
		<script type="text/javascript" src="yesui/ui/plugin/js/flotr/js/types/gantt.js"></script>
		<script type="text/javascript" src="yesui/ui/plugin/js/flotr/js/types/timeline.js"></script>
		<script type="text/javascript" src="yesui/ui/plugin/js/flotr/js/plugins/download.js"></script>
		<script type="text/javascript" src="yesui/ui/plugin/js/flotr/js/plugins/selection.js"></script>
		<script type="text/javascript" src="yesui/ui/plugin/js/flotr/js/plugins/spreadsheet.js"></script>
		<script type="text/javascript" src="yesui/ui/plugin/js/flotr/js/plugins/grid.js"></script>
		<script type="text/javascript" src="yesui/ui/plugin/js/flotr/js/plugins/hit.js"></script>
		<script type="text/javascript" src="yesui/ui/plugin/js/flotr/js/plugins/crosshair.js"></script>
		<script type="text/javascript" src="yesui/ui/plugin/js/flotr/js/plugins/labels.js"></script>
		<script type="text/javascript" src="yesui/ui/plugin/js/flotr/js/plugins/legend.js"></script>
		<script type="text/javascript" src="yesui/ui/plugin/js/flotr/js/plugins/titles.js"></script>
		
		<!-- 
		<script type="text/javascript" src="yesui/ui/plugin/js/datepicker/js/eye.js"></script>
		<script type="text/javascript" src="yesui/ui/plugin/js/datepicker/js/utils.js"></script> -->
		
		<script type="text/javascript" src="yesui/ui/plugin/js/map/baidumap.js"></script>
		<script type="text/javascript" src="yesui/ui/plugin/js/map/gaodemap.js"></script>
		<script type="text/javascript" src="yesui/ui/plugin/js/map/maputils.js"></script>
		
		<script type="text/javascript" src="yesui/ui/plugin/js/datepicker/js/datepicker.js"></script>
		<script type="text/javascript" src="yesui/ui/plugin/js/smartspin/smartspinner.js"></script>
		<script type="text/javascript" src="yesui/ui/plugin/js/modaldialog/js/modaldialog.js"></script>
		<script type="text/javascript" src="yesui/ui/plugin/js/paginationjs/pagination.js"></script>
	 	<script type="text/javascript" src="yesui/ui/plugin/js/wangEditor/wangEditor-1.4.0.js"></script>
		<script type="text/javascript" src="yesui/ui/plugin/js/picture/jquery_photoCut.js"></script>
	    <script type="text/javascript" src="yesui/ui/plugin/js/treetable/jquery.treetable.js"></script>
	    <script type="text/javascript" src="yesui/ui/plugin/js/date.js"></script>
	    
	    <script type="text/javascript" src="yesui/ui/plugin/js/throttle-debounce/jquery.ba-throttle-debounce.min.js"></script>
	    
	    <script type="text/javascript" src="yesui/ui/plugin/js/rsa/jsbn.js"></script>
		<script type="text/javascript" src="yesui/ui/plugin/js/rsa/prng4.js"></script>
		<script type="text/javascript" src="yesui/ui/plugin/js/rsa/rng.js"></script>
		<script type="text/javascript" src="yesui/ui/plugin/js/rsa/rsa.js"></script>
		<script type="text/javascript" src="yesui/ui/plugin/js/rsa/BASE_64.js"></script>
		
	    <script type="text/javascript" src="yesui/ui/plugin/js/pako/pako.js"></script>
	    <link rel="stylesheet" href="yesui/ui/res/css/blue/newheadlist.css">
	    
	    <link rel="stylesheet" href="yesui/ui/plugin/css/fullcalendar/fullcalendar.css"><!-- 
		<link rel="stylesheet" href="yesui/ui/plugin/css/default/jquery.treeTable.css"> -->
		<link rel="stylesheet" href="yesui/ui/plugin/css/bootstrap/bootstrap.css">
		<link rel="stylesheet" href="yesui/ui/plugin/css/datepicker/css/datepicker.css"/>
		<link rel="stylesheet" href="yesui/ui/plugin/css/smartspin/smartspinner.css"/>
		<link rel="stylesheet" href="yesui/ui/plugin/css/modaldialog/css/jquery.modaldialog.css"/>
		<link rel="stylesheet" href="yesui/ui/plugin/css/paginationjs/pagination.css"/>
		<link rel="stylesheet" href="yesui/ui/plugin/css/wangEditor/wangEditor-1.4.0.css"/>
        <link rel="stylesheet" href="yesui/ui/plugin/css/treetable/stylesheets/jquery.treetable.theme.default.css" />
		
		<link rel="stylesheet" href="yesui/ui/res/css/blue/corecolor.css">
		<link rel="stylesheet" href="yesui/ui/res/css/blue/jquery-ui.css">
		<link rel="stylesheet" href="yesui/ui/res/css/blue/core.css">
		<link rel="stylesheet" href="yesui/ui/res/css/blue/ui.ygrid.css">
		<link rel="stylesheet" href="yesui/ui/res/css/blue/photoCut.css">

	    <script type="text/javascript">
			window.onerror = function(msg) {
				var dialog = $("<div></div>").attr("id", "error_dialog");
	            dialog.modalDialog(msg, {title: "错误", showClose: true, type: "error", height: 200, width: 400});
			};
			
		    $(function(){
		    	$('.pid').html('欢迎您, '+$.cookie("username"));
		   	  	var YIUIContainer = {};
			    YIUIContainer.panel = function (type) {
			        if (type == "tab") {
			            return new YIUI.TabContainer();
			        }
			    };
			
			    YIUIContainer.container = new YIUIContainer.panel("tab");
			    YIUIContainer.container.el = $("#form");
			    YIUIContainer.container.render();
			    YIUIContainer.el = YIUIContainer.container.el;
			
			    YIUIContainer.build = function (form) {
			        if (YIUIContainer.container) {
			            YIUIContainer.container.add(form.getRootPanel());
			            YIUIContainer.container.doRenderChildren();
			        	form.setContainer(YIUIContainer);
			        	$('.mainpage').hide();
						$(".home").removeClass("sel");
			        }
			    };
			
			    YIUIContainer.removeForm = function (form) {
			        if (YIUIContainer.container) {
			            YIUIContainer.container.removeForm(form);
			        }
			    };
			    
			    YIUI.MainContainer = YIUIContainer;

		    	var rootEntry = Svr.SvrMgr.loadTreeMenu({async: false});
			    var buildMenu = function() {
			    	var headmeanul=$('<ul class="headmeanul"></ul>');
			    	var hidemeanul=$('<ul class="hidemeanul"></ul>');
			    	var spanfirstpage=$('<span class="head-firstpage"><a>首页</a></span>');
			    	spanfirstpage.appendTo(headmeanul);
			    	var index=0;
			    	var headmenuindex = 0;
			    	for(key in rootEntry.children){
			    		var item=(rootEntry.children)[key].name;
			    		var item1=(rootEntry.children)[key].key;
			    		var itempath=(rootEntry.children)[key].path;
			    		index++;
			    		if(index*100+200 < $(window).width()){
			    			headmenuindex=index;
			    		var _li=$('<li class='+key+' path='+itempath+' ><a id='+item1+key+'>'+item+'</a></li>').appendTo(headmeanul);
			    		}
			    		
			    		if(index*100+200 >= $(window).width()){
			    			var _hidemean=$('<li class='+key+' path='+itempath+'><a>'+item+'</a></li>').appendTo(hidemeanul);
			    		}
			    	}
			    	var lastheadulli=$('<span class="lastheadulli"><a>更多</a></span>');
			    	lastheadulli.appendTo(headmeanul);
			    	headmeanul.appendTo($('.head-menu'));
			    	var _hidediv=$('<div class="hidediv"></div>');
			    	
			    	hidemeanul.appendTo(_hidediv);
			    	if(/* $(".head-menu").width() > 600 ||  */index*100+200 < $(window).width()){
			    		$('.lastheadulli').hide();
			    	} else {
			    		$('.lastheadulli').show();
			    	}
			    	$('.lastheadulli').hover(function(){
			    		var r = $(document.body).width() - $(this).offset().left - $(this).width();
			    		_hidediv.css("right", r + "px");
			    		_hidediv.show();
			    	})
			    	
			    	_hidediv.hover(function(){
			    		$(this).show();
			    	}, function(){
			    		if($('.menu-lst').is(":hidden")) {
				    		$(this).hide();
			    		}
			    	})
			    	_hidediv.appendTo($('.main'));
			        //头list点击事件
		    	 	$('.head-menu li').hover(function(){
		   		 		showList($(this), true);
						$(".hidediv").hide();
			 	    }, function(){
			 	    	if($('.menu-lst ul li').length == 0) return;
			 	    	if($('.menu-lst').hasClass('hover')){
			 	    		$('.menu-lst').show();
			 	    	}else{
			 	    		$('.menu-lst').hide();
			 	    		$('.listshowul').remove();
			 	    	}
			 	    })
			 	    //隐藏div点击事件
		       		$('.hidediv li').hover(function(){
			    		showList($(this));
			 	    })
					$('.menu-lst').hover(function(){
			 	 	    	//$(this).show();
		 	 	    },function(){
		 	 	    	$(this).removeClass('hover');
		 	 	    	$(this).hide();
		 	 	    	$('.listshowul').remove();
		 	 	    })
					
					$('.head-title').hover(function(){
						$('.menu-lst').hide();
						$('.listshowul').remove();
			 			$('.menu-lst').removeClass('hover');
			 			$('.hidediv').css('display','none');
			 		})
					$('.head-firstpage,.lastheadulli').hover(function(){
						$('.menu-lst').hide();
				 		$('.listshowul').remove();
				 		$('.menu-lst').removeClass('hover');
			 			  
			 		})
			 		$('.hidemeanul li').click(function(){
			 			$('.hidediv').css('display','none');
			 		})
			    };
			    buildMenu();
	    	 	$(window).resize(function () {
					var h = $(document.body).height() - $('.main-head').height();
					$(".mainRight").css("height", h);
					if(!$(".home").hasClass("sel")) {
				        YIUIContainer.container.doLayout($(".mainRight").width(), $(".mainRight").height());
					} else {
						homeLayout();
						if($(".todo-list tr.data").length == 0) return;
						YIUI.ToDoList.doLayout($(".todo").width(), $(".todo").height());
					}
					if($(".head-menu").width() > 600){
			    		$('.lastheadulli').hide();
			    	} else {
			    		$('.lastheadulli').show();
			    	}
					
					$(".headmeanul").remove();
					$(".hidediv").remove();
					buildMenu();
			    })
			    var showList = function($this, isHead) {
	    	 		if($('.menu-lst').children('ul').length != 0){
		    			$('.listshowul').remove();
		    		}
		    		var _ullist=$('<ul class="listshowul"></ul>');
		    		var _listleftdiv, left, top;
		    		if(isHead) {
		    			_listleftdiv = $('<div class="changepostion"></div>');
		    			left = $this.position().left;
		    		}
		    		_ullist.appendTo($('.menu-lst'));
		    		var indexkey= $this.attr('class');
		    		var arrlist=new Array();
		    		for(key in (rootEntry.children)[indexkey].children){
			    		var childchildrenlist = ((rootEntry.children)[indexkey].children)[key].name;
			    		var childchildrenlist1 = ((rootEntry.children)[indexkey].children)[key].key;
			    		var childchildrenlistpath = ((rootEntry.children)[indexkey].children)[key].path;
		    			var chsingle = ((rootEntry.children)[indexkey].children)[key].single;
		    			var chformkey = ((rootEntry.children)[indexkey].children)[key].formKey;
		    			var chparas= ((rootEntry.children)[indexkey].children)[key].parameters;
			    		var _childli = $('<li class=2-'+key+' path='+childchildrenlistpath+' single='+chsingle+' formkey='+chformkey+' paras='+chparas+' ><a id='+childchildrenlist1+key+'>'+childchildrenlist+'</a></li>').appendTo($('.listshowul'));
			    		
			    		var lastul = $('<ul></ul>');
			    		var _hr = $('<center><hr align="center"/><center>');
			    		for(lastkey in ((rootEntry.children)[indexkey].children)[key].children){
			    			var lastitem= (((rootEntry.children)[indexkey].children)[key].children)[lastkey].name;
			    			var lastitem1 = (((rootEntry.children)[indexkey].children)[key].children)[lastkey].key;
			    			var lastitempath = (((rootEntry.children)[indexkey].children)[key].children)[lastkey].path;
			    			var single = (((rootEntry.children)[indexkey].children)[key].children)[lastkey].single;
			    			var formkey =(((rootEntry.children)[indexkey].children)[key].children)[lastkey].formKey;
			    			var paras = (((rootEntry.children)[indexkey].children)[key].children)[lastkey].parameters;
			    			var lastulli = $('<li cssinfo="info" path='+lastitempath+' single='+single+' formkey='+formkey+' paras='+paras+' ><a id='+lastitem1+lastkey+'>'+lastitem+'</a></li>').appendTo(lastul);
			    			lastul.appendTo($('.2-'+key));
			    			_hr.appendTo($('.2-'+key));
			    		}
			    		_listleftdiv && lastul.wrap(_listleftdiv);
			    	}
		    		
		    		if(!$('.menu-lst').hasClass('hover')){
		    			$('.menu-lst').addClass('hover');
		    		}
		    		
		    		if(isHead) {
		    			$('.menu-lst').css('right','auto');
		    			$('.menu-lst').css('left',left+'px');
		    			top = $this.position().top + $this.height();
		    			$('.menu-lst').css('top','none');
		    		} else {
			    		var leftdiv= $('.hidediv').outerWidth() + parseInt($('.hidediv').css("right"));
			    		$('.menu-lst').css({
			    			'left': 'auto',
			    			'right': leftdiv+"px",
			    			'top': $this.offset().top + "px"
			    		});
		    		}
		    		$('.menu-lst').show();
		    		var arrlistshowulchildren = $(".listshowul li");
		    		for(var t = 0;t < arrlistshowulchildren.length;t++ ){
		    			if($(arrlistshowulchildren[t]).attr('cssinfo') != 'info' && !$(arrlistshowulchildren[t]).is(':has(ul)')){
		    				$(arrlistshowulchildren[t]).attr('cssinfo','info');
		    				$('<center><hr align="center"/><center>').insertAfter($(arrlistshowulchildren[t]));
		    			}
	                    if($(arrlistshowulchildren[t]).attr('cssinfo') != 'info' && $(arrlistshowulchildren[t]).is(':has(ul)')){
	                    	var $a = $(arrlistshowulchildren[t]).children('a').eq(0);
	                    	$a.attr('class','block');
	                    	if(isHead) {
	                    		$(arrlistshowulchildren[t]).children('.changepostion').css("margin-left", $a.outerWidth()); 
	                    	} else {
	                    		$(arrlistshowulchildren[t]).children('ul').css("margin-left", $a.outerWidth()); 
	                    	}
		    			}
	                    if($(arrlistshowulchildren[t]).attr('cssinfo') == 'info'){
							$(arrlistshowulchildren[t]).click(function(){
	                       	 	if($('.ui-tabs-body').children('div').eq(0).attr('class') == 'mainpage'){
	         						$('.mainpage').hide();
	         						$('.home').removeClass("sel");
	         					}
	                       	   	$('.hidediv').hide();
		    					var opts={};
		    					opts.name = $(this).children('a').html();
		    					opts.id = $(this).children('a').attr('id');
		    					opts.path = $(this).attr('path');
		    					opts.single = $(this).attr('single');
		    					opts.formKey = $(this).attr('formkey');
		    					opts.parameters = $(this).attr('paras');
		    					$('.menu-lst').hide();
		    					YIUI.EventHandler.doTreeClick(opts, YIUIContainer);
	    				
	    					});
	                    }
		    		}
		    		if($('.menu-lst ul li').length == 0) {
		    			$('.menu-lst').hide();
		    		}
	    	 	}
	    	 	$('.exit').click(function(){
	 		    	exit();
	 		    });
	 		    $('.chanage').hover(function(){
	 		    	$('.changelist').css('display','block');
	 		    	$('.changelist').css('left',$('.chanage').position().left);
	 		    }, function(){
	 		    	$('.changelist').css('display','none');
	 		    });
				$('.changelist').hover(function(){
					$(this).show();
				}, function(){
					$(this).hide();
				});
				$('.changelist li').click(function(){
	   				var mothd=$(this).attr('class');
	  				if (mothd=='modifyPwd') {
						modifyPwd();
	  				}else if(mothd=='about'){
		  				about();
	  				}else if(mothd=='logout'){
		 				logout();
	  				}
	 			})
				function logout() {
				    Svr.SvrMgr.doLogout();
				    $.cookie("clientID", null);
				}
				function exit() {
				    Svr.SvrMgr.doLogout();
				    $.cookie("clientID", null);
				    window.location.replace("about:blank");
				}
		 				
				function modifyPwd() {
			        var paras = {formKey: "ChangePassWord", cmd: "PureShowForm", async: false};
			        var jsonObj = Svr.SvrMgr.dealWithPureForm(paras);
			        YIUI.FormBuilder.build(jsonObj, YIUI.FormTarget.MODAL);
				}
				function about() {
					var params = {service: "GetSystemInfo"};
				    var result = Svr.Request.getSyncData(Svr.SvrMgr.ServletURL, params);
			        
					var dialogDiv = $("<div class='modifyPwd' id='modifyPwd'></div>");
				    var version = new YIUI.Control.Label({
				    	metaObj: {
					        x: 0,
					        y: 1
				    	},
				        caption: "版本： "
				    });
				
				    var versionTxt = new YIUI.Control.Label({
						metaObj: {
					        x: 1,
				       		y: 1
				    	},
				        caption: result.Ver
				    });
				    
				    var create = new YIUI.Control.Label({
						metaObj: {
					        x: 0,
				       		y: 2
				    	},
				        caption: "创建号： "
				    });
				
				    var createTxt = new YIUI.Control.Label({
						metaObj: {
					        x: 1,
				        	y: 2
				    	},
				        caption: result.BuildID
				    });
				    
				    var company = new YIUI.Control.Label({
						metaObj: {
				        	x: 0,
				        	y: 3,
				        	colspan: 2
				    	},
				        topMargin: 0,
				        caption: "上海博科资讯股份有限公司"
				    });
				
				    var OK = new YIUI.Control.Button({
						metaObj: {
					        x: 0,
				       		y: 0
				    	},
				        listeners: null,
				        value: '确定'
				    });
				    var cancel = new YIUI.Control.Button({
						metaObj: {
					        x: 1,
				        	y: 0
				    	},
				        listeners: null,
				        value: '取消'
				    });
		
				    var gp = new YIUI.Panel.GridLayoutPanel({
						metaObj: {
					        x: 0,
				        	y: 4,
				        	colspan: 2,
			    			columnGap : 15
				    	},
			    		widths : ["50%", "50%"],
			    		minWidths : ["-1", "-1"],
			    		heights : [25],
			    		items : [OK, cancel]
				    });
				    
				    var gridpanel = new YIUI.Panel.GridLayoutPanel({
						metaObj: {
				    		rowGap : 5,
			    			columnGap : 15
				    	},
			    		width: 240,
			    		widths : ["30%", "70%"],
			    		minWidths : ["-1", "-1"],
			    		heights : [5, 25, 25, 25, 25],
			    		items : [version, versionTxt, create, createTxt, company, gp]
				    });
				    dialogDiv.modalDialog(null, {title: "关于Yigo", showClose: false, width: "260px", height: "160px"});
				    gridpanel.el = dialogDiv.dialogContent();
				    gridpanel.render();
				    dialogDiv.addClass("abtCo");
				    OK.el.unbind();
				    cancel.el.unbind();
				    OK.el.click(function() {
				    	dialogDiv.close();
				    });
				    cancel.el.click(function() {
				    	dialogDiv.close();
				    });
				}
				homePage();
				
				var lifirstpage = $('<span class="home sel">首页</span>');
			    lifirstpage.insertBefore($('.ui-tabs-header ul'));
		 				
				$('.ui-tabs-header ul',YIUI.MainContainer.el).click(function(e){
					var target = $(e.target);
					if(target.closest("li").length > 0) {
						 if(target.hasClass('ui-icon-close')) {
							window.setTimeout(function () {
								if($('.ui-tabs-header ul li',YIUI.MainContainer.el).length == 0) {
									$('.mainpage').show();
									$(".home").addClass("sel");
									$(".horz-menu .ui-tabs-header").addClass("empty");
								} else {
									$(".horz-menu .ui-tabs-header").removeClass("empty");
								}
					        }, 0);
						} else {
							$(".home").removeClass("sel");
							$('.mainpage',YIUI.MainContainer.el).hide();
						}
					}
				})
					
	 		    $('.head-firstpage').click(function(){
	 		    	$('.horz-menu .home').click();
	 		    })
				$('.horz-menu .home').click(function(){
					YIUI.MainContainer.container.clearSelect();
					init();
				})
				$(".todo-list .head").delegate(".refresh", "click", function(e) {
					showToDoList("ToDoList",$('.todo'));
				});

				var h = $(document.body).height() - $('.main-head').height();
				$(".mainRight").css("height", h);
				homeLayout();
		    });
		    function homeLayout() {
				$('.mainpage').css('width', $(".mainRight").width());
				$('.mainpage').css('height', $(".mainRight").height() - $(".head-menu.ui-tabs-header").height() - $(".mainRight .ui-tabs-header").outerHeight());
				$(".todo").height($(".todo-list").height() - $(".out-list .title").outerHeight());
				$(".purchase").height($(".ui-purchase").height() - $(".ui-purchase .title").outerHeight());
				$(".culture").height($(".ui-culture").height() - $(".ui-culture .title").outerHeight());
				$(".template").height($(".ui-template").height() - $(".ui-template .title").outerHeight());
				$(".work").height($(".ui-work").height() - $(".ui-work .title").outerHeight());
				$(".business").height($(".ui-business").height() - $(".ui-business .title").outerHeight());
				$(".law").height($(".ui-law").height() - $(".ui-law .title").outerHeight());
				$(".monitor").height($(".ui-monitor").height() - $(".ui-monitor .title").outerHeight());
				$(".system").height($(".ui-system").height() - $(".ui-system .title").outerHeight());
		    }
		   	function init() {
				$('.mainpage').show();
				$(".home").addClass("sel");
				showToDoList("ToDoList",$('.todo'));
				$(".mainpage .module ul").empty();
				var datetable = getAllData();
				creatUl(datetable);
		   	}
		   	function homePage() {
				var mainpage=$('<div class="mainpage"></div>');
				mainpage.css('width',$(window).width()-21);
				mainpage.css('height',$(window).height()-62);
				
				var p_left=$('<div class=left></div>');
				
				var p_mid=$('<div class=mid></div>');
				
				var p_right=$('<div class=right></div>');
				
				var $out_list = $('<div class="out-list"></div>').appendTo(p_left);
				var list = $('<div class="todo-list"></div>').appendTo($out_list);
				$('<div class="title">代办提醒<span><a href=# class="refresh">刷新</a><span></div>').appendTo(list);
				$('<div class="todo"></div>').appendTo(list);
				

				var $out_p = $('<div class="out-purchase"></div>').appendTo(p_left);
				var $purchase = $('<div class="ui-purchase module"></div>').appendTo($out_p);
				$('<div class="title">采购发布 <span><a href=#>more</span></a></div>').appendTo($purchase);
				$('<div class="purchase"></div>').appendTo($purchase);

				var $out_c = $('<div class="out-culture"></div>').appendTo(p_left);
				var $culture = $('<div class="ui-culture module"></div>').appendTo($out_c);
				$('<div class="title">采购文化<span><a href=#>more</a></span></div>').appendTo($culture);
				$('<div class=culture></div>').appendTo($culture);

				var $out_t = $('<div class="out-template"></div>').appendTo(p_left);
				var $template = $('<div class="ui-template module"></div>').appendTo($out_t);
				$('<div class="title">模板范本<span><a href=#>more</a></span></div>').appendTo($template);
				$('<div class=template></div>').appendTo($template);
				//中间
				var $out_w = $('<div class="out-work"></div>').appendTo(p_mid);
				var $work = $('<div class="ui-work module"></div>').appendTo($out_w);
				$('<div class="title">工作动态<span><a href=#>more</a></span></div>').appendTo($work);
				var $work_img = $('<div class=work></div>').appendTo($work);
				$('<div class="img"><img/></div>').appendTo($work_img);

				var $out_b = $('<div class="out-business"></div>').appendTo(p_mid);
				var $business = $('<div class="ui-business module"></div>').appendTo($out_b);
				$('<div class="title">情况通报<span><a href=#>more</a></span></div>').appendTo($business);
				$('<div class=business></div>').appendTo($business);

				var $out_l = $('<div class="out-law"></div>').appendTo(p_mid);
				var $law = $('<div class="ui-law module"></div>').appendTo($out_l);
				$('<div class="title">法律法规<span><a href=#>more</a></span></div>').appendTo($law);
				$('<div class=law></div>').appendTo($law);
				//右边
				var $out_m = $('<div class="out-monitor"></div>').appendTo(p_right);
				var $monitor = $('<div class="ui-monitor module"></div>').appendTo($out_m);
				$('<div class="title">业务监控<span><a href=#>more</a></span></div>').appendTo($monitor);
				$m_cont = $('<div class="monitor"></div>').appendTo($monitor);
				var $m_left= $('<div class=left></div>').appendTo($m_cont);
				$('<div class="project">项目跟踪</div>').appendTo($m_left);
				$('<div class="order">订单跟踪</div>').appendTo($m_left);
				$('<div class="stock">安全库存</div>').appendTo($m_left);
				
				var $m_right= $('<div class="right"></div>').appendTo($m_cont);
				$('<div class="track">在途跟踪</div>').appendTo($m_right);
				$('<div class="search">库存查询</div>').appendTo($m_right);
				$('<div class="sign">今日签收</div>').appendTo($m_right);
				

				var $out_s = $('<div class="out-system"></div>').appendTo(p_right);
				var $system = $('<div class="ui-system module"></div>').appendTo($out_s);
				$('<div class="title">文件制度<span><a href=#>more</a></span></div>').appendTo($system);
				$('<div class=system></div>').appendTo($system);
				p_left.appendTo(mainpage);
				p_mid.appendTo(mainpage);
				p_right.appendTo(mainpage);
				
				mainpage.appendTo($('.ui-tabs-body'));
				$('.mainpage').addClass('aria-show');

				init();
		   	}
		    function showToDoList(item,container){
				var opts = {formKey: item};
				var callback = function(form) {
					if($(".todo-list tr.data").length == 0) {
						$(".todo-list .todo").empty();
						$(".todo-list .todo").addClass("empty");
					} else {
						$(".todo-list .todo").removeClass("empty");
						form.setContainer(YIUI.MainContainer);
						YIUI.ToDoList.doLayout($(".todo").width(), $(".todo").height());
					}
				};
				var fr = new YIUI.FormRender(opts, callback);
				fr.render(container);
				YIUI.ToDoList = fr;
			}
		    function creatUl(dataTable){
		    	if(!dataTable || dataTable.size == 0) return;
		    	for(var i=0;i<dataTable.size();i++){
		    		dataTable.setPos(i);
		    		var type = dataTable.getByKey("Type");
		    		var $div, hasTime = true;
		    		switch(type) {
			    		case "WorkDynamics":
			    			$div = $(".mainpage .work");
			    			break;
			    		case "PublishmentOfPurchase":
			    			$div = $(".mainpage .purchase");
			    			break;
			    		case "BusinessBulletin":
			    			$div = $(".mainpage .business");
			    			
			    			break;
			    		case "CultureOfPurchase":
			    			$div = $(".mainpage .culture");
			    			hasTime = false;
			    			break;
			    		case "Template":
			    			$div = $(".mainpage .template");
			    			hasTime = false;
			    			break;
			    		case "Law":
			    			$div = $(".mainpage .law");
			    			break;
			    		case "CultureSystem":
			    			$div = $(".mainpage .system");
			    			hasTime = false;
			    			break;
		    		}
			    	var $ul=$("ul", $div);
			    	if($ul.length == 0) {
			    		$ul = $('<ul></ul>').appendTo($div);
			    	}
	    			var datafor = YIUI.DateFormat.format(new Date(parseInt((dataTable.getByKey("CreateTime")))));
	    			var li=$('<li type="square"><a>'+dataTable.getByKey("Title")+'</a></li>');
	    			if(hasTime) {
	    				$('<span>'+datafor+'</span>').appendTo(li);
	    			}
	    			li.appendTo($ul);
		    	}
		    }
		    function getAllData(){
		    	var paras = [];
				var serviceName = "CreateDataTable";
				var data = {
		            service: "PureMid",
		            cmd: "pureInvokeService",
		            extSvrName: serviceName,
		            paras: $.toJSON(paras)
		        };
		        var result = Svr.Request.getSyncData(Svr.SvrMgr.ServletURL, data);
		        return YIUI.DataUtil.fromJSONDataTable(result);
		    }
			 
		</script>
	     
		<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">		
		<title>工作台新</title>
	</head>
	<body>
		<div class='out'>
			<div class='main-head'>
				<div class='head-title'><a class='plogo'></a>
					<div class='pesonidinfo'>
						<span class='pid'></span><span class='exit'>退出</span><span class='chanage'>设置</span>
						<div class='dateinfo'></div>
					</div>
				</div>
				<div class='head-menu'>
				</div>
			</div>
			<div class="main">
			    <div id="form" class="mainRight horz-menu"></div>
			</div>
		</div>
		
		<div id='childrenlst' class='hover'></div>
		<div class='changelist'>
			<ul>
				<li class='logout'>注销</li>
				<li class='modifyPwd'>修改密码</li>
				<li class='about'>关于YIgo</li>
			
			</ul>
		</div>
		
		<div class="loading mask" style="display: none;"></div>
		<div class="loading image" style="position: absolute; display: none;">
			<img alt='loading' src='yesui/ui/res/images/loading.gif'>
		</div>
		    
	</body>
</html>