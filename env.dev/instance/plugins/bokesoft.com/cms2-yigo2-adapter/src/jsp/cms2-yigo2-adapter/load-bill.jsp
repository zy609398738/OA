<%@page contentType="text/html;charset=UTF-8" language="java" %>
<%
	String CTX_ROOT = request.getContextPath();
%>
<!doctype html>
<html>
	<head>
		<meta http-equiv="Content-Type" content="text/html;charset=UTF-8">
		<title>工作台</title>
		<script type="text/javascript"  src="<%=CTX_ROOT%>/common/jquery/jquery-1.10.2.js"></script>
		<script type="text/javascript"  src="<%=CTX_ROOT%>/common/jquery/jstz-1.0.4.min.js"></script>
		
		<script type="text/javascript"  src="<%=CTX_ROOT%>/yesui/ui/yes-ui.js"></script>
		<script type="text/javascript"  src="<%=CTX_ROOT%>/common/data/yiuiconsts.js"></script>
		<script type="text/javascript"  src="<%=CTX_ROOT%>/common/ext/jsext.js"></script>
        <script type="text/javascript"  src="<%=CTX_ROOT%>/common/exception/ViewException.js"></script>
        <script type="text/javascript"  src="<%=CTX_ROOT%>/common/exception/BPMException.js"></script>
		<script type="text/javascript"  src="<%=CTX_ROOT%>/yesui/base/jQueryExt.js"></script>
		<script type="text/javascript"  src="<%=CTX_ROOT%>/yesui/base/prototypeExt.js"></script>
		<script type="text/javascript"  src="<%=CTX_ROOT%>/yesui/svr/svrmgr.js"></script>
		<script type="text/javascript"  src="<%=CTX_ROOT%>/common/expr/parser.js"></script>
		<script type="text/javascript"  src="<%=CTX_ROOT%>/common/expr/valimpl.js"></script>
        <script type="text/javascript"  src="<%=CTX_ROOT%>/common/expr/exprutil.js"></script>
        <script type="text/javascript"  src="<%=CTX_ROOT%>/common/expr/funimplmap.js"></script>
		<script type="text/javascript"  src="<%=CTX_ROOT%>/common/util/datautil.js"></script>
        <script type="text/javascript"  src="<%=CTX_ROOT%>/common/util/numericutil.js"></script>
        <script type="text/javascript"  src="<%=CTX_ROOT%>/common/util/typeconvertor.js"></script>
        <script type="text/javascript"  src="<%=CTX_ROOT%>/common/util/subdetailutil.js"></script>
		<script type="text/javascript"  src="<%=CTX_ROOT%>/common/data/datatype.js"></script>
		
		<script type="text/javascript"  src="<%=CTX_ROOT%>/yesui/svr/purehandler.js"></script>
		<script type="text/javascript"  src="<%=CTX_ROOT%>/yesui/svr/handler/basehandler.js"></script>
		<script type="text/javascript"  src="<%=CTX_ROOT%>/yesui/svr/handler/attachmenthandler.js"></script>
		<script type="text/javascript"  src="<%=CTX_ROOT%>/yesui/svr/handler/buttonhandler.js"></script>
		<script type="text/javascript"  src="<%=CTX_ROOT%>/yesui/svr/handler/comboboxhandler.js"></script>
		<script type="text/javascript"  src="<%=CTX_ROOT%>/yesui/svr/handler/checkboxhandler.js"></script>
        <script type="text/javascript"  src="<%=CTX_ROOT%>/yesui/svr/handler/celldicthandler.js"></script>
		<script type="text/javascript"  src="<%=CTX_ROOT%>/yesui/svr/handler/dicthandler.js"></script>
		<script type="text/javascript"  src="<%=CTX_ROOT%>/yesui/svr/handler/datepickerhandler.js"></script>
		<script type="text/javascript"  src="<%=CTX_ROOT%>/yesui/svr/handler/dropdownbuttonhandler.js"></script>
		<script type="text/javascript"  src="<%=CTX_ROOT%>/yesui/svr/handler/gridhandler.js"></script>
		<script type="text/javascript"  src="<%=CTX_ROOT%>/yesui/svr/handler/hyperlinkhandler.js"></script>
		<script type="text/javascript"  src="<%=CTX_ROOT%>/yesui/svr/handler/imagehandler.js"></script>
		<script type="text/javascript"  src="<%=CTX_ROOT%>/yesui/svr/handler/listviewhandler.js"></script>
		<script type="text/javascript"  src="<%=CTX_ROOT%>/yesui/svr/handler/numbereditorhandler.js"></script>
		<script type="text/javascript"  src="<%=CTX_ROOT%>/yesui/svr/handler/passwordeditorhandler.js"></script>
		<script type="text/javascript"  src="<%=CTX_ROOT%>/yesui/svr/handler/radiobuttonhandler.js"></script>
		<script type="text/javascript"  src="<%=CTX_ROOT%>/yesui/svr/handler/splitbuttonhandler.js"></script>
		<script type="text/javascript"  src="<%=CTX_ROOT%>/yesui/svr/handler/searchboxhandler.js"></script>
		<script type="text/javascript"  src="<%=CTX_ROOT%>/yesui/svr/handler/textareahandler.js"></script>
		<script type="text/javascript"  src="<%=CTX_ROOT%>/yesui/svr/handler/texteditorhandler.js"></script>
		<script type="text/javascript"  src="<%=CTX_ROOT%>/yesui/svr/handler/toolbarhandler.js"></script>
		<script type="text/javascript"  src="<%=CTX_ROOT%>/yesui/svr/handler/treehandler.js"></script>
		<script type="text/javascript"  src="<%=CTX_ROOT%>/yesui/svr/handler/dialoghandler.js"></script>
		<script type="text/javascript"  src="<%=CTX_ROOT%>/yesui/svr/handler/dictviewhandler.js"></script>
		<script type="text/javascript"  src="<%=CTX_ROOT%>/yesui/svr/handler/filechooserhandler.js"></script>
		<script type="text/javascript"  src="<%=CTX_ROOT%>/yesui/svr/handler/mapdrawhandler.js"></script>
		
		<script type="text/javascript"  src="<%=CTX_ROOT%>/yesui/svr/behavior/basebehavior.js"></script>
		<script type="text/javascript"  src="<%=CTX_ROOT%>/yesui/svr/behavior/buttonbehavior.js"></script>
		<script type="text/javascript"  src="<%=CTX_ROOT%>/yesui/svr/behavior/checkboxbehavior.js"></script>
		<script type="text/javascript"  src="<%=CTX_ROOT%>/yesui/svr/behavior/comboboxbehavior.js"></script>
		<script type="text/javascript"  src="<%=CTX_ROOT%>/yesui/svr/behavior/datepickerbehavior.js"></script>
		<script type="text/javascript"  src="<%=CTX_ROOT%>/yesui/svr/behavior/dictbehavior.js"></script>
		<script type="text/javascript"  src="<%=CTX_ROOT%>/yesui/svr/behavior/gridbehavior.js"></script>
		<script type="text/javascript"  src="<%=CTX_ROOT%>/yesui/svr/behavior/hyperlinkbehavior.js"></script>
		<script type="text/javascript"  src="<%=CTX_ROOT%>/yesui/svr/behavior/imagebehavior.js"></script>
		<script type="text/javascript"  src="<%=CTX_ROOT%>/yesui/svr/behavior/listviewbehavior.js"></script>
		<script type="text/javascript"  src="<%=CTX_ROOT%>/yesui/svr/behavior/numbereditorbehavior.js"></script>
		<script type="text/javascript"  src="<%=CTX_ROOT%>/yesui/svr/behavior/radiobuttonbehavior.js"></script>
		<script type="text/javascript"  src="<%=CTX_ROOT%>/yesui/svr/behavior/splitbuttonbehavior.js"></script>
		<script type="text/javascript"  src="<%=CTX_ROOT%>/yesui/svr/behavior/searchboxbehavior.js"></script>
		<script type="text/javascript"  src="<%=CTX_ROOT%>/yesui/svr/behavior/textareabehavior.js"></script>
		<script type="text/javascript"  src="<%=CTX_ROOT%>/yesui/svr/behavior/texteditorbehavior.js"></script>
		<script type="text/javascript"  src="<%=CTX_ROOT%>/yesui/svr/behavior/utcdatepickerbehavior.js"></script>
		
		<script type="text/javascript"  src="<%=CTX_ROOT%>/yesui/svr/format/dateformat.js"></script>
		<script type="text/javascript"  src="<%=CTX_ROOT%>/yesui/svr/format/decimalformat.js"></script>
		<script type="text/javascript"  src="<%=CTX_ROOT%>/yesui/svr/format/textformat.js"></script>
		<script type="text/javascript"  src="<%=CTX_ROOT%>/yesui/svr/formutils.js"></script>
		
		<script type="text/javascript"  src="<%=CTX_ROOT%>/yesui/svr/service/dictserviceproxy.js"></script>
		<script type="text/javascript"  src="<%=CTX_ROOT%>/yesui/svr/request.js"></script>
		<script type="text/javascript"  src="<%=CTX_ROOT%>/yesui/svr/Base64Utils.js"></script>
		<script type="text/javascript"  src="<%=CTX_ROOT%>/yesui/svr/uiutils.js"></script>
		<script type="text/javascript"  src="<%=CTX_ROOT%>/yesui/ui/filtermap.js"></script>
		<script type="text/javascript"  src="<%=CTX_ROOT%>/yesui/ui/opt.js"></script>
		<script type="text/javascript"  src="<%=CTX_ROOT%>/yesui/ui/showdata.js"></script>
		<script type="text/javascript"  src="<%=CTX_ROOT%>/yesui/ui/fun/basefun.js"></script>
        <script type="text/javascript"  src="<%=CTX_ROOT%>/yesui/ui/objectloop.js"></script>
		<script type="text/javascript"  src="<%=CTX_ROOT%>/yesui/ui/vparser.js"></script>
        <script type="text/javascript"  src="<%=CTX_ROOT%>/yesui/ui/statusproxy.js"></script>
		<script type="text/javascript"  src="<%=CTX_ROOT%>/yesui/ui/uiprocess.js"></script>
		<script type="text/javascript"  src="<%=CTX_ROOT%>/yesui/ui/paras.js"></script>
		<script type="text/javascript"  src="<%=CTX_ROOT%>/yesui/ui/ppobject.js"></script>
		<script type="text/javascript"  src="<%=CTX_ROOT%>/yesui/ui/form.js"></script>
        <script type="text/javascript"  src="<%=CTX_ROOT%>/yesui/ui/focuspolicy.js"></script>
	    <script type="text/javascript"  src="<%=CTX_ROOT%>/yesui/ui/formadapt.js"></script>
		<script type="text/javascript"  src="<%=CTX_ROOT%>/yesui/ui/formbuilder.js"></script>
		<script type="text/javascript"  src="<%=CTX_ROOT%>/yesui/ui/formstack.js"></script>
		<script type="text/javascript"  src="<%=CTX_ROOT%>/yesui/ui/formRender.js"></script>
		
		<script type="text/javascript"  src="<%=CTX_ROOT%>/yesui/ui/yescomponent/yesbutton.js"></script>
		<script type="text/javascript"  src="<%=CTX_ROOT%>/yesui/ui/yescomponent/yeshyperlink.js"></script>
		<script type="text/javascript"  src="<%=CTX_ROOT%>/yesui/ui/yescomponent/yesimage.js"></script>
		<script type="text/javascript"  src="<%=CTX_ROOT%>/yesui/ui/yescomponent/yestexteditor.js"></script>
		<script type="text/javascript"  src="<%=CTX_ROOT%>/yesui/ui/yescomponent/yeslabel.js"></script>
		<script type="text/javascript"  src="<%=CTX_ROOT%>/yesui/ui/yescomponent/yesnumbereditor.js"></script>
		<script type="text/javascript"  src="<%=CTX_ROOT%>/yesui/ui/yescomponent/yescheckbox.js"></script>
		<script type="text/javascript"  src="<%=CTX_ROOT%>/yesui/ui/yescomponent/yesdict.js"></script>
		<script type="text/javascript"  src="<%=CTX_ROOT%>/yesui/ui/yescomponent/yesdatepicker.js"></script>
		<script type="text/javascript"  src="<%=CTX_ROOT%>/yesui/ui/yescomponent/yescombobox.js"></script>
		<script type="text/javascript"  src="<%=CTX_ROOT%>/yesui/ui/yescomponent/yesdialog.js"></script>
		<script type="text/javascript"  src="<%=CTX_ROOT%>/yesui/ui/component/componentmgr.js"></script>
		<script type="text/javascript"  src="<%=CTX_ROOT%>/yesui/ui/component/component.js"></script>
		<script type="text/javascript"  src="<%=CTX_ROOT%>/yesui/ui/component/conditionparas.js"></script>
		<script type="text/javascript"  src="<%=CTX_ROOT%>/yesui/ui/component/control/control.js"></script>
		<script type="text/javascript"  src="<%=CTX_ROOT%>/yesui/ui/component/control/toolbar.js"></script>
		<script type="text/javascript"  src="<%=CTX_ROOT%>/yesui/ui/component/control/treemenubar.js"></script>
		<script type="text/javascript"  src="<%=CTX_ROOT%>/yesui/ui/component/control/databinding.js"></script>
		<script type="text/javascript"  src="<%=CTX_ROOT%>/yesui/ui/component/control/button.js"></script>
		<script type="text/javascript"  src="<%=CTX_ROOT%>/yesui/ui/component/control/richeditor.js"></script>
		<script type="text/javascript"  src="<%=CTX_ROOT%>/yesui/ui/component/control/buttongroup.js"></script>
		<script type="text/javascript"  src="<%=CTX_ROOT%>/yesui/ui/component/control/dropdownbutton.js"></script>
		<script type="text/javascript"  src="<%=CTX_ROOT%>/yesui/ui/component/control/splitbutton.js"></script>
		<script type="text/javascript"  src="<%=CTX_ROOT%>/yesui/ui/component/control/calendar.js"></script>
		<script type="text/javascript"  src="<%=CTX_ROOT%>/yesui/ui/component/control/checkbox.js"></script>
		<script type="text/javascript"  src="<%=CTX_ROOT%>/yesui/ui/component/control/combobox.js"></script>
		<script type="text/javascript"  src="<%=CTX_ROOT%>/yesui/ui/component/control/datepicker.js"></script>
		<script type="text/javascript"  src="<%=CTX_ROOT%>/yesui/ui/component/control/dict.js"></script>
		<script type="text/javascript"  src="<%=CTX_ROOT%>/yesui/ui/component/control/itemdata.js"></script>
		<script type="text/javascript"  src="<%=CTX_ROOT%>/yesui/ui/component/control/dicttree.js"></script>
		<script type="text/javascript"  src="<%=CTX_ROOT%>/yesui/ui/component/control/dictview.js"></script>
		<script type="text/javascript"  src="<%=CTX_ROOT%>/yesui/ui/component/control/dictquerypanel.js"></script>
		<script type="text/javascript"  src="<%=CTX_ROOT%>/yesui/ui/component/control/hyperlink.js"></script>
		<script type="text/javascript"  src="<%=CTX_ROOT%>/yesui/ui/component/control/imagelist.js"></script>
		<script type="text/javascript"  src="<%=CTX_ROOT%>/yesui/ui/component/control/label.js"></script>
		<script type="text/javascript"  src="<%=CTX_ROOT%>/yesui/ui/component/control/listview.js"></script>
		<script type="text/javascript"  src="<%=CTX_ROOT%>/yesui/ui/component/control/numbereditor.js"></script>
		<script type="text/javascript"  src="<%=CTX_ROOT%>/yesui/ui/component/control/image.js"></script>
		<script type="text/javascript"  src="<%=CTX_ROOT%>/yesui/ui/component/control/radiobutton.js"></script>
		<script type="text/javascript"  src="<%=CTX_ROOT%>/yesui/ui/component/control/texteditor.js"></script>
		<script type="text/javascript"  src="<%=CTX_ROOT%>/yesui/ui/component/control/textarea.js"></script>
		<script type="text/javascript"  src="<%=CTX_ROOT%>/yesui/ui/component/control/textbutton.js"></script>
		<script type="text/javascript"  src="<%=CTX_ROOT%>/yesui/ui/component/control/statusbar.js"></script>
		<script type="text/javascript"  src="<%=CTX_ROOT%>/yesui/ui/component/control/treeview.js"></script>
		<script type="text/javascript"  src="<%=CTX_ROOT%>/yesui/ui/component/control/passwordeditor.js"></script>
		<script type="text/javascript"  src="<%=CTX_ROOT%>/yesui/ui/component/control/tree.js"></script>
		<script type="text/javascript"  src="<%=CTX_ROOT%>/yesui/ui/component/control/attachment.js"></script>
		<script type="text/javascript"  src="<%=CTX_ROOT%>/yesui/ui/component/control/separator.js"></script>
		<script type="text/javascript"  src="<%=CTX_ROOT%>/yesui/ui/component/control/chart.js"></script>
        <script type="text/javascript"  src="<%=CTX_ROOT%>/yesui/ui/component/control/bpmgraph.js"></script>
		<script type="text/javascript"  src="<%=CTX_ROOT%>/yesui/ui/component/control/custom.js"></script>
		<script type="text/javascript"  src="<%=CTX_ROOT%>/yesui/ui/component/control/userinfopane.js"></script>
		<script type="text/javascript"  src="<%=CTX_ROOT%>/yesui/ui/component/control/rightsset.js"></script>
		<script type="text/javascript"  src="<%=CTX_ROOT%>/yesui/ui/component/control/dialog.js"></script>
		<script type="text/javascript"  src="<%=CTX_ROOT%>/yesui/ui/component/control/filechooser.js"></script>
		<script type="text/javascript"  src="<%=CTX_ROOT%>/yesui/ui/component/control/mapdraw.js"></script>
		<script type="text/javascript"  src="<%=CTX_ROOT%>/yesui/ui/component/control/utcdatepicker.js"></script>
		<script type="text/javascript"  src="<%=CTX_ROOT%>/yesui/ui/component/control/searchbox.js"></script>
		<script type="text/javascript"  src="<%=CTX_ROOT%>/yesui/ui/component/grid/gridsumutil.js"></script>
		<script type="text/javascript"  src="<%=CTX_ROOT%>/yesui/ui/component/grid/grid.js"></script>
		<script type="text/javascript"  src="<%=CTX_ROOT%>/yesui/ui/component/grid/editor/celleditor.js"></script>
		<script type="text/javascript"  src="<%=CTX_ROOT%>/yesui/ui/component/grid/editor/celltexteditor.js"></script>
		<script type="text/javascript"  src="<%=CTX_ROOT%>/yesui/ui/component/grid/editor/cellnumbereditor.js"></script>
		<script type="text/javascript"  src="<%=CTX_ROOT%>/yesui/ui/component/grid/editor/celldatepicker.js"></script>
		<script type="text/javascript"  src="<%=CTX_ROOT%>/yesui/ui/component/grid/editor/cellcombobox.js"></script>
		<script type="text/javascript"  src="<%=CTX_ROOT%>/yesui/ui/component/grid/editor/celldict.js"></script>
		<script type="text/javascript"  src="<%=CTX_ROOT%>/yesui/ui/component/grid/editor/cellimage.js"></script>
		<script type="text/javascript"  src="<%=CTX_ROOT%>/yesui/ui/component/grid/editor/celltextbutton.js"></script>
		<script type="text/javascript"  src="<%=CTX_ROOT%>/yesui/ui/component/layout/autolayout.js"></script>
		<script type="text/javascript"  src="<%=CTX_ROOT%>/yesui/ui/component/layout/borderlayout.js"></script>
		<script type="text/javascript"  src="<%=CTX_ROOT%>/yesui/ui/component/layout/columnlayout.js"></script>
		<script type="text/javascript"  src="<%=CTX_ROOT%>/yesui/ui/component/layout/fluidcolumnlayout.js"></script>
		<script type="text/javascript"  src="<%=CTX_ROOT%>/yesui/ui/component/layout/gridlayout.js"></script>
		<script type="text/javascript"  src="<%=CTX_ROOT%>/yesui/ui/component/layout/tablayout.js"></script>
		<script type="text/javascript"  src="<%=CTX_ROOT%>/yesui/ui/component/layout/tab.js"></script>
		<script type="text/javascript"  src="<%=CTX_ROOT%>/yesui/ui/component/layout/splitlayout.js"></script>
		<script type="text/javascript"  src="<%=CTX_ROOT%>/yesui/ui/component/layout/flexflowlayout.js"></script>
		<script type="text/javascript"  src="<%=CTX_ROOT%>/yesui/ui/component/layout/flowlayout.js"></script>
		<script type="text/javascript"  src="<%=CTX_ROOT%>/yesui/ui/component/layout/tablelayout.js"></script>
		<script type="text/javascript"  src="<%=CTX_ROOT%>/yesui/ui/component/layout/fluidtablelayout.js"></script>
		<script type="text/javascript"  src="<%=CTX_ROOT%>/yesui/ui/component/panel/panel.js"></script>
		<script type="text/javascript"  src="<%=CTX_ROOT%>/yesui/ui/component/panel/borderlayoutpanel.js"></script>
		<script type="text/javascript"  src="<%=CTX_ROOT%>/yesui/ui/component/panel/columnlayoutpanel.js"></script>
		<script type="text/javascript"  src="<%=CTX_ROOT%>/yesui/ui/component/panel/flowlayoutpanel.js"></script>
		<script type="text/javascript"  src="<%=CTX_ROOT%>/yesui/ui/component/panel/flexflowlayoutpanel.js"></script>
		<script type="text/javascript"  src="<%=CTX_ROOT%>/yesui/ui/component/panel/fluidcolumnlayoutpanel.js"></script>
		<script type="text/javascript"  src="<%=CTX_ROOT%>/yesui/ui/component/panel/fluidtablelayoutpanel.js"></script>
		<script type="text/javascript"  src="<%=CTX_ROOT%>/yesui/ui/component/panel/gridlayoutpanel.js"></script>
		<script type="text/javascript"  src="<%=CTX_ROOT%>/yesui/ui/component/panel/splitpanel.js"></script>
		<script type="text/javascript"  src="<%=CTX_ROOT%>/yesui/ui/component/panel/tabpanel.js"></script>
		<script type="text/javascript"  src="<%=CTX_ROOT%>/yesui/ui/component/panel/tabpanelex.js"></script>
		<script type="text/javascript"  src="<%=CTX_ROOT%>/yesui/ui/component/panel/treepanel.js"></script>
		<script type="text/javascript"  src="<%=CTX_ROOT%>/yesui/ui/component/panel/tabcontainer.js"></script>
		<script type="text/javascript"  src="<%=CTX_ROOT%>/yesui/ui/component/panel/tabexcontainer.js"></script>
		<script type="text/javascript"  src="<%=CTX_ROOT%>/yesui/ui/component/panel/stackcontainer.js"></script>
		
		<script type="text/javascript"  src="<%=CTX_ROOT%>/yesui/ui/maincontainer.js"></script>
		<script type="text/javascript"  src="<%=CTX_ROOT%>/yesui/ui/maintree.js"></script>
		
        <script type="text/javascript"  src="<%=CTX_ROOT%>/yesui/ui/plugin/js/raphael-src.js"></script>
		<script type="text/javascript"  src="<%=CTX_ROOT%>/yesui/ui/plugin/js/jquery.cookie.js"></script>
		
		<script type="text/javascript"  src="<%=CTX_ROOT%>/yesui/ui/plugin/js/datepicker/datetimemask/dateTimeMask.js"></script>
		<script type="text/javascript"  src="<%=CTX_ROOT%>/yesui/ui/plugin/js/jquery.json-2.3.min.js"></script>
		
		<script type="text/javascript"  src="<%=CTX_ROOT%>/yesui/ui/plugin/js/ygrid/ygrid.locale-cn.js"></script>
		<script type="text/javascript"  src="<%=CTX_ROOT%>/yesui/ui/plugin/js/ygrid/jquery.yGrid.src.js"></script>
        <script type="text/javascript"  src="<%=CTX_ROOT%>/yesui/ui/plugin/js/decimal/decimal.js"></script>
		<script type="text/javascript"  src="<%=CTX_ROOT%>/yesui/ui/plugin/js/picture/ajaxfileupload.js"></script>
		<script type="text/javascript"  src="<%=CTX_ROOT%>/yesui/ui/plugin/js/ui-extend/jquery.placeholder.js"></script>
		<script type="text/javascript"  src="<%=CTX_ROOT%>/yesui/ui/plugin/js/ui-extend/jquery.ui.treeTable.js"></script>
		
		<script type="text/javascript"  src="<%=CTX_ROOT%>/yesui/ui/plugin/js/flotr/lib/bean-min.js"></script>
		<script type="text/javascript"  src="<%=CTX_ROOT%>/yesui/ui/plugin/js/flotr/lib/underscore-min.js"></script>
		<script type="text/javascript"  src="<%=CTX_ROOT%>/yesui/ui/plugin/js/flotr/js/Flotr.js"></script>
		<script type="text/javascript"  src="<%=CTX_ROOT%>/yesui/ui/plugin/js/flotr/js/DefaultOptions.js"></script>
		<script type="text/javascript"  src="<%=CTX_ROOT%>/yesui/ui/plugin/js/flotr/js/Color.js"></script>
		<script type="text/javascript"  src="<%=CTX_ROOT%>/yesui/ui/plugin/js/flotr/js/Date.js"></script>
		<script type="text/javascript"  src="<%=CTX_ROOT%>/yesui/ui/plugin/js/flotr/js/DOM.js"></script>
		<script type="text/javascript"  src="<%=CTX_ROOT%>/yesui/ui/plugin/js/flotr/js/EventAdapter.js"></script>
		<script type="text/javascript"  src="<%=CTX_ROOT%>/yesui/ui/plugin/js/flotr/js/Text.js"></script>
		<script type="text/javascript"  src="<%=CTX_ROOT%>/yesui/ui/plugin/js/flotr/js/Graph.js"></script>
		<script type="text/javascript"  src="<%=CTX_ROOT%>/yesui/ui/plugin/js/flotr/js/Axis.js"></script>
		<script type="text/javascript"  src="<%=CTX_ROOT%>/yesui/ui/plugin/js/flotr/js/Series.js"></script>
		<script type="text/javascript"  src="<%=CTX_ROOT%>/yesui/ui/plugin/js/flotr/js/Series.js"></script>
		<script type="text/javascript"  src="<%=CTX_ROOT%>/yesui/ui/plugin/js/flotr/js/types/lines.js"></script>
		<script type="text/javascript"  src="<%=CTX_ROOT%>/yesui/ui/plugin/js/flotr/js/types/bars.js"></script>
		<script type="text/javascript"  src="<%=CTX_ROOT%>/yesui/ui/plugin/js/flotr/js/types/points.js"></script>
		<script type="text/javascript"  src="<%=CTX_ROOT%>/yesui/ui/plugin/js/flotr/js/types/pie.js"></script>
		<script type="text/javascript"  src="<%=CTX_ROOT%>/yesui/ui/plugin/js/flotr/js/types/candles.js"></script>
		<script type="text/javascript"  src="<%=CTX_ROOT%>/yesui/ui/plugin/js/flotr/js/types/markers.js"></script>
		<script type="text/javascript"  src="<%=CTX_ROOT%>/yesui/ui/plugin/js/flotr/js/types/radar.js"></script>
		<script type="text/javascript"  src="<%=CTX_ROOT%>/yesui/ui/plugin/js/flotr/js/types/bubbles.js"></script>
		<script type="text/javascript"  src="<%=CTX_ROOT%>/yesui/ui/plugin/js/flotr/js/types/gantt.js"></script>
		<script type="text/javascript"  src="<%=CTX_ROOT%>/yesui/ui/plugin/js/flotr/js/types/timeline.js"></script>
		<script type="text/javascript"  src="<%=CTX_ROOT%>/yesui/ui/plugin/js/flotr/js/plugins/download.js"></script>
		<script type="text/javascript"  src="<%=CTX_ROOT%>/yesui/ui/plugin/js/flotr/js/plugins/selection.js"></script>
		<script type="text/javascript"  src="<%=CTX_ROOT%>/yesui/ui/plugin/js/flotr/js/plugins/spreadsheet.js"></script>
		<script type="text/javascript"  src="<%=CTX_ROOT%>/yesui/ui/plugin/js/flotr/js/plugins/grid.js"></script>
		<script type="text/javascript"  src="<%=CTX_ROOT%>/yesui/ui/plugin/js/flotr/js/plugins/hit.js"></script>
		<script type="text/javascript"  src="<%=CTX_ROOT%>/yesui/ui/plugin/js/flotr/js/plugins/crosshair.js"></script>
		<script type="text/javascript"  src="<%=CTX_ROOT%>/yesui/ui/plugin/js/flotr/js/plugins/labels.js"></script>
		<script type="text/javascript"  src="<%=CTX_ROOT%>/yesui/ui/plugin/js/flotr/js/plugins/legend.js"></script>
		<script type="text/javascript"  src="<%=CTX_ROOT%>/yesui/ui/plugin/js/flotr/js/plugins/titles.js"></script>
		
		<!-- 
		<script type="text/javascript"  src="<%=CTX_ROOT%>/yesui/ui/plugin/js/datepicker/js/eye.js"></script>
		<script type="text/javascript"  src="<%=CTX_ROOT%>/yesui/ui/plugin/js/datepicker/js/utils.js"></script> -->
		
		<script type="text/javascript"  src="<%=CTX_ROOT%>/yesui/ui/plugin/js/map/baidumap.js"></script>
		<script type="text/javascript"  src="<%=CTX_ROOT%>/yesui/ui/plugin/js/map/gaodemap.js"></script>
		<script type="text/javascript"  src="<%=CTX_ROOT%>/yesui/ui/plugin/js/map/maputils.js"></script>
		
		<script type="text/javascript"  src="<%=CTX_ROOT%>/yesui/ui/plugin/js/datepicker/js/datepicker.js"></script>
		<script type="text/javascript"  src="<%=CTX_ROOT%>/yesui/ui/plugin/js/smartspin/smartspinner.js"></script>
		<script type="text/javascript"  src="<%=CTX_ROOT%>/yesui/ui/plugin/js/modaldialog/js/modaldialog.js"></script>
		<script type="text/javascript"  src="<%=CTX_ROOT%>/yesui/ui/plugin/js/paginationjs/pagination.js"></script>
	 	<script type="text/javascript"  src="<%=CTX_ROOT%>/yesui/ui/plugin/js/wangEditor/wangEditor-1.4.0.js"></script>
		<script type="text/javascript"  src="<%=CTX_ROOT%>/yesui/ui/plugin/js/picture/jquery_photoCut.js"></script>
	    <script type="text/javascript"  src="<%=CTX_ROOT%>/yesui/ui/plugin/js/treetable/jquery.treetable.js"></script>
		
	    
	    <script type="text/javascript"  src="<%=CTX_ROOT%>/yesui/ui/plugin/js/throttle-debounce/jquery.ba-throttle-debounce.min.js"></script>
	    
	    <script type="text/javascript"  src="<%=CTX_ROOT%>/yesui/ui/plugin/js/rsa/jsbn.js"></script>
		<script type="text/javascript"  src="<%=CTX_ROOT%>/yesui/ui/plugin/js/rsa/prng4.js"></script>
		<script type="text/javascript"  src="<%=CTX_ROOT%>/yesui/ui/plugin/js/rsa/rng.js"></script>
		<script type="text/javascript"  src="<%=CTX_ROOT%>/yesui/ui/plugin/js/rsa/rsa.js"></script>
		<script type="text/javascript"  src="<%=CTX_ROOT%>/yesui/ui/plugin/js/rsa/BASE_64.js"></script>
		
	    <script type="text/javascript"  src="<%=CTX_ROOT%>/yesui/ui/plugin/js/pako/pako.js"></script>
	    
	    <link rel="stylesheet" href="<%=CTX_ROOT%>/yesui/ui/plugin/css/fullcalendar/fullcalendar.css">
		<!-- <link rel="stylesheet" href="<%=CTX_ROOT%>/yesui/ui/plugin/css/default/jquery.treeTable.css"> -->
		<link rel="stylesheet" href="<%=CTX_ROOT%>/yesui/ui/plugin/css/bootstrap/bootstrap.css">
		<link rel="stylesheet" href="<%=CTX_ROOT%>/yesui/ui/plugin/css/datepicker/css/datepicker.css"/>
		<link rel="stylesheet" href="<%=CTX_ROOT%>/yesui/ui/plugin/css/smartspin/smartspinner.css"/>
		<link rel="stylesheet" href="<%=CTX_ROOT%>/yesui/ui/plugin/css/modaldialog/css/jquery.modaldialog.css"/>
		<link rel="stylesheet" href="<%=CTX_ROOT%>/yesui/ui/plugin/css/paginationjs/pagination.css"/>
		<link rel="stylesheet" href="<%=CTX_ROOT%>/yesui/ui/plugin/css/wangEditor/wangEditor-1.4.0.css"/>
        <link rel="stylesheet" href="<%=CTX_ROOT%>/yesui/ui/plugin/css/treetable/stylesheets/jquery.treetable.theme.default.css"/>
		
		<link rel="stylesheet" href="<%=CTX_ROOT%>/yesui/ui/res/css/blue/corecolor.css">
		<link rel="stylesheet" href="<%=CTX_ROOT%>/yesui/ui/res/css/blue/jquery-ui.css">
		<link rel="stylesheet" href="<%=CTX_ROOT%>/yesui/ui/res/css/blue/core.css">
		<link rel="stylesheet" href="<%=CTX_ROOT%>/yesui/ui/res/css/blue/ui.ygrid.css">
		<link rel="stylesheet" href="<%=CTX_ROOT%>/yesui/ui/res/css/blue/photoCut.css">
	    
		<script type="text/javascript">		
			$(function () {
				var getQueryString = function(name){
					var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
					var r = window.location.search.substr(1).match(reg);
					if(r!=null)return  unescape(r[2]); return "";
				};

				var options  = {
					formKey: getQueryString("formKey"),//表单的key
					oid: getQueryString("oid"), //数据对象标识，可缺省
					formula: "" //form加载完后执行的表达式，可缺省
				};
				var fr = new YIUI.FormRender(options);
				fr.render("billDiv");  //容器id
			});
		</script>
		
	</head>
	<body>
		<div id="billDiv" style="height:100%; width:100%; padding:10px;"></div>
	</body>
</html>
