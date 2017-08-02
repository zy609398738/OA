/**
 * 此文件中仅包含对jQuery的扩展
 */
(function () {

	var root = "yesui/v1/";
	
	var file = "<link rel='stylesheet' href='"+root+"ui/plugin/css/fullcalendar/fullcalendar.css'>" + 
				"<link rel='stylesheet' href='"+root+"ui/plugin/css/fullcalendar/fullcalendar.css'>" +
				"<link rel='stylesheet' href='"+root+"ui/plugin/css/bootstrap/bootstrap.css'>" +
				"<link rel='stylesheet' href='"+root+"ui/plugin/css/datepicker/css/datepicker.css'/>" +
				"<link rel='stylesheet' href='"+root+"ui/plugin/css/smartspin/smartspinner.css'/>" +
				"<link rel='stylesheet' href='"+root+"ui/plugin/css/modaldialog/css/jquery.modaldialog.css'/>" +
				"<link rel='stylesheet' href='"+root+"ui/plugin/css/paginationjs/pagination.css'/>" +
				"<link rel='stylesheet' href='"+root+"ui/plugin/css/wangEditor/wangEditor-1.4.0.css'/>" +
				"<link rel='stylesheet' href='"+root+"ui/plugin/css/treetable/stylesheets/jquery.treetable.theme.default.css' />" +
				"<link rel='stylesheet' href='"+root+"ui/plugin/css/scrollbar/scrollbar.css' />" +
				
				"<link rel='stylesheet' href='"+root+"ui/res/css/blue/main.css'>" +
				"<link rel='stylesheet' href='"+root+"ui/res/css/blue/corecolor.css'>" +
				"<link rel='stylesheet' href='"+root+"ui/res/css/blue/jquery-ui.css'>" +
				"<link rel='stylesheet' href='"+root+"ui/res/css/blue/core.css'>" +
				"<link rel='stylesheet' href='"+root+"ui/res/css/blue/ui.ygrid.css'>" +
				"<link rel='stylesheet' href='"+root+"ui/res/css/blue/photoCut.css'>" +
				
				"<script type='text/javascript' src='common/jquery/jquery-1.10.2.js'></script>" +
				"<script type='text/javascript' src='common/jquery/jstz-1.0.4.min.js'></script>" +
				"<script type='text/javascript' src='common/ext/jsext.js'></script>" +
				
				"<script type='text/javascript' src='"+root+"ui/yes-ui.js'></script>" +
				"<script type='text/javascript' src='common/data/yiuiconsts.js' defer='defer'></script>" +
				"<script type='text/javascript' src='common/exception/ViewException.js' defer='defer'></script>" +
				"<script type='text/javascript' src='common/exception/BPMException.js' defer='defer'></script>" +
				"<script type='text/javascript' src='"+root+"/base/jQueryExt.js' defer='defer'></script>" +
				"<script type='text/javascript' src='"+root+"/base/prototypeExt.js' defer='defer'></script>" +
				"<script type='text/javascript' src='"+root+"/svr/svrmgr.js'></script>" +
				"<script type='text/javascript' src='common/expr/parser.js' defer='defer'></script>" +
				"<script type='text/javascript' src='common/expr/valimpl.js' defer='defer'></script>" +
				"<script type='text/javascript' src='common/expr/exprutil.js' defer='defer'></script>" +
				"<script type='text/javascript' src='common/expr/funimplmap.js' defer='defer'></script>" +
				"<script type='text/javascript' src='common/util/datautil.js' defer='defer'></script>" +
				"<script type='text/javascript' src='common/util/numericutil.js' defer='defer'></script>" +
				"<script type='text/javascript' src='common/util/typeconvertor.js' defer='defer'></script>" +
				"<script type='text/javascript' src='common/util/subdetailutil.js' defer='defer'></script>" +
				"<script type='text/javascript' src='common/util/yesjsonutil.js' defer='defer'></script>" +
				"<script type='text/javascript' src='common/util/totalrowcountutil.js' defer='defer'></script>" +
				"<script type='text/javascript' src='common/data/datatype.js' defer='defer'></script>" +
				"<script type='text/javascript' src='"+root+"/svr/purehandler.js' defer='defer'></script>" +
				"<script type='text/javascript' src='"+root+"/svr/handler/basehandler.js' defer='defer'></script>" +
				"<script type='text/javascript' src='"+root+"/svr/handler/attachmenthandler.js' defer='defer'></script>" +
				"<script type='text/javascript' src='"+root+"/svr/handler/buttonhandler.js' defer='defer'></script>" +
				"<script type='text/javascript' src='"+root+"/svr/handler/comboboxhandler.js' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"/svr/handler/checkboxhandler.js' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"/svr/handler/dicthandler.js' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"/svr/handler/datepickerhandler.js' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"/svr/handler/dropdownbuttonhandler.js' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"/svr/handler/gridhandler.js' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"/svr/handler/hyperlinkhandler.js' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"/svr/handler/imagehandler.js' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"/svr/handler/listviewhandler.js' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"/svr/handler/numbereditorhandler.js' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"/svr/handler/passwordeditorhandler.js' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"/svr/handler/radiobuttonhandler.js' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"/svr/handler/splitbuttonhandler.js' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"/svr/handler/searchboxhandler.js' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"/svr/handler/textareahandler.js' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"/svr/handler/texteditorhandler.js' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"/svr/handler/toolbarhandler.js' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"/svr/handler/treehandler.js' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"/svr/handler/dialoghandler.js' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"/svr/handler/dictviewhandler.js' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"/svr/handler/filechooserhandler.js' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"/svr/handler/mapdrawhandler.js' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"/svr/handler/richeditorhandler.js' defer='defer'></script>" +
				"<script type='text/javascript' src='"+root+"/svr/handler/stepeditorhandler.js' defer='defer'></script>" +
				
				"<script type='text/javascript' src='"+root+"/svr/behavior/basebehavior.js' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"/svr/behavior/buttonbehavior.js' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"/svr/behavior/checkboxbehavior.js' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"/svr/behavior/comboboxbehavior.js' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"/svr/behavior/datepickerbehavior.js' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"/svr/behavior/dictbehavior.js' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"/svr/behavior/gridbehavior.js' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"/svr/behavior/hyperlinkbehavior.js' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"/svr/behavior/imagebehavior.js' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"/svr/behavior/listviewbehavior.js' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"/svr/behavior/numbereditorbehavior.js' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"/svr/behavior/radiobuttonbehavior.js' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"/svr/behavior/splitbuttonbehavior.js' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"/svr/behavior/searchboxbehavior.js' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"/svr/behavior/textareabehavior.js' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"/svr/behavior/texteditorbehavior.js' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"/svr/behavior/utcdatepickerbehavior.js' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"/svr/behavior/richeditorbehavior.js' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"/svr/behavior/stepeditorbehavior.js' defer='defer'></script>" +
				
				"<script type='text/javascript' src='"+root+"/svr/format/dateformat.js' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"/svr/format/utcdateformat.js' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"/svr/format/decimalformat.js' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"/svr/format/textformat.js' defer='defer'></script>" + 
				
				"<script type='text/javascript' src='"+root+"/svr/service/dictserviceproxy.js' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"/svr/request.js'></script>" + 
				"<script type='text/javascript' src='"+root+"/svr/Base64Utils.js' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"/svr/uiutils.js' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"/svr/batchutils.js' defer='defer'></script>" + 
			    "<script type='text/javascript' src='"+root+"/svr/formutils.js' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"ui/filtermap.js' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"ui/opt.js' defer='defer'></script>" +
                "<script type='text/javascript' src='"+root+"ui/showdata.js' defer='defer'></script>" +
				"<script type='text/javascript' src='"+root+"ui/fun/basefun.js' defer='defer'></script>" + 
		        "<script type='text/javascript' src='"+root+"ui/objectloop.js' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"ui/vparser.js' defer='defer'></script>" + 
		        "<script type='text/javascript' src='"+root+"ui/statusproxy.js' defer='defer'></script>" +
				"<script type='text/javascript' src='"+root+"ui/abstractuiprocess.js' defer='defer'></script>" +
				"<script type='text/javascript' src='"+root+"ui/uiprocess.js' defer='defer'></script>" +
                "<script type='text/javascript' src='"+root+"ui/process/viewdatamonitor.js' defer='defer'></script>" +
				"<script type='text/javascript' src='"+root+"ui/paras.js' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"ui/ppobject.js' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"ui/form.js' defer='defer'></script>" + 
		        "<script type='text/javascript' src='"+root+"ui/focuspolicy.js' defer='defer'></script>" + 
			    "<script type='text/javascript' src='"+root+"ui/formadapt.js' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"ui/formbuilder.js' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"ui/formstack.js' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"ui/formRender.js' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"ui/printpreview.js' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"ui/filechooser.js' defer='defer'></script>" + 
				
				"<script type='text/javascript' src='"+root+"ui/yescomponent/yesbutton.js' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"ui/yescomponent/yeshyperlink.js' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"ui/yescomponent/yesimage.js' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"ui/yescomponent/yestexteditor.js' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"ui/yescomponent/yeslabel.js' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"ui/yescomponent/yesnumbereditor.js' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"ui/yescomponent/yescheckbox.js' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"ui/yescomponent/yesdict.js' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"ui/yescomponent/yesdatepicker.js' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"ui/yescomponent/yescombobox.js' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"ui/yescomponent/yesdialog.js' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"ui/yescomponent/yesstepeditor.js' defer='defer'></script>" +
				"<script type='text/javascript' src='"+root+"ui/component/componentmgr.js' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"ui/component/component.js' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"ui/component/conditionparas.js' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"ui/component/control/control.js' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"ui/component/control/toolbar.js' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"ui/component/control/treemenubar.js' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"ui/component/control/databinding.js' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"ui/component/control/button.js' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"ui/component/control/richeditor.js' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"ui/component/control/buttongroup.js' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"ui/component/control/dropdownbutton.js' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"ui/component/control/splitbutton.js' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"ui/component/control/calendar.js' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"ui/component/control/checkbox.js' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"ui/component/control/combobox.js' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"ui/component/control/datepicker.js' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"ui/component/control/dict.js' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"ui/component/control/itemdata.js' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"ui/component/control/dicttree.js' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"ui/component/control/dictview.js' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"ui/component/control/dictquerypanel.js' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"ui/component/control/hyperlink.js' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"ui/component/control/imagelist.js' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"ui/component/control/label.js' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"ui/component/control/listview.js' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"ui/component/control/numbereditor.js' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"ui/component/control/image.js' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"ui/component/control/radiobutton.js' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"ui/component/control/texteditor.js' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"ui/component/control/textarea.js' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"ui/component/control/textbutton.js' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"ui/component/control/statusbar.js' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"ui/component/control/treeview.js' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"ui/component/control/passwordeditor.js' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"ui/component/control/tree.js' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"ui/component/control/attachment.js' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"ui/component/control/separator.js' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"ui/component/control/chart.js' defer='defer'></script>" + 
		        "<script type='text/javascript' src='"+root+"ui/component/control/bpmgraph.js' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"ui/component/control/custom.js' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"ui/component/control/userinfopane.js' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"ui/component/control/rightsset.js' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"ui/component/control/dialog.js' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"ui/component/control/filechooser.js' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"ui/component/control/mapdraw.js' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"ui/component/control/utcdatepicker.js' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"ui/component/control/searchbox.js' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"ui/component/control/webbrowser.js' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"ui/component/control/stepeditor.js' defer='defer'></script>" +
            	"<script type='text/javascript' src='"+root+"ui/component/gantt/datesrv.js' defer='defer'></script>" +
                "<script type='text/javascript' src='"+root+"ui/component/gantt/ganttutil.js' defer='defer'></script>" +
    			"<script type='text/javascript' src='"+root+"ui/component/gantt/gantt.js' defer='defer'></script>" +
                "<script type='text/javascript' src='"+root+"ui/component/grid/griddef.js' defer='defer'></script>" +
                "<script type='text/javascript' src='"+root+"ui/component/grid/rowexpand.js' defer='defer'></script>" +
                "<script type='text/javascript' src='"+root+"ui/component/grid/columnexpand.js' defer='defer'></script>" +
                "<script type='text/javascript' src='"+root+"ui/component/grid/gridutil.js' defer='defer'></script>" +
                "<script type='text/javascript' src='"+root+"ui/component/grid/rowgroup.js' defer='defer'></script>" +
                "<script type='text/javascript' src='"+root+"ui/component/grid/gridsumutil.js' defer='defer'></script>" +
                "<script type='text/javascript' src='"+root+"ui/component/grid/grid.js' defer='defer'></script>" +
				"<script type='text/javascript' src='"+root+"ui/component/grid/editor/celleditor.js' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"ui/component/grid/editor/celltexteditor.js' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"ui/component/grid/editor/cellnumbereditor.js' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"ui/component/grid/editor/celldatepicker.js' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"ui/component/grid/editor/cellcombobox.js' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"ui/component/grid/editor/celldict.js' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"ui/component/grid/editor/cellimage.js' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"ui/component/grid/editor/celltextbutton.js' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"ui/component/layout/autolayout.js' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"ui/component/layout/borderlayout.js' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"ui/component/layout/columnlayout.js' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"ui/component/layout/fluidcolumnlayout.js' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"ui/component/layout/gridlayout.js' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"ui/component/layout/tablayout.js' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"ui/component/layout/tab.js' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"ui/component/layout/splitlayout.js' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"ui/component/layout/flexflowlayout.js' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"ui/component/layout/flowlayout.js' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"ui/component/layout/tablelayout.js' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"ui/component/layout/fluidtablelayout.js' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"ui/component/layout/wizardlayout.js' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"ui/component/panel/panel.js' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"ui/component/panel/borderlayoutpanel.js' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"ui/component/panel/columnlayoutpanel.js' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"ui/component/panel/flowlayoutpanel.js' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"ui/component/panel/flexflowlayoutpanel.js' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"ui/component/panel/fluidcolumnlayoutpanel.js' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"ui/component/panel/fluidtablelayoutpanel.js' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"ui/component/panel/gridlayoutpanel.js' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"ui/component/panel/splitpanel.js' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"ui/component/panel/tabpanel.js' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"ui/component/panel/tabpanelex.js' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"ui/component/panel/treepanel.js' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"ui/component/panel/tabcontainer.js' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"ui/component/panel/tabexcontainer.js' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"ui/component/panel/stackcontainer.js' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"ui/component/panel/wizardpanel.js' defer='defer'></script>" + 
				
				
				"<script type='text/javascript' src='"+root+"ui/maincontainer.js'></script>" + 
				"<script type='text/javascript' src='"+root+"ui/maintree.js'></script>" + 
				
				"<script type='text/javascript' src='"+root+"ui/plugin/js/raphael-src.js' defer='defer'></script>" +
				"<script type='text/javascript' src='"+root+"ui/plugin/js/jquery.cookie.js' defer='defer'></script>" +
				"<script type='text/javascript' src='"+root+"ui/plugin/js/datepicker/datetimemask/dateTimeMask.js' defer='defer'></script>" +
				"<script type='text/javascript' src='"+root+"ui/plugin/js/jquery.json-2.3.min.js' defer='defer'></script>" +
				"<script type='text/javascript' src='"+root+"ui/plugin/js/ygrid/ygrid.locale-cn.js' defer='defer'></script>" +
				"<script type='text/javascript' src='"+root+"ui/plugin/js/ygrid/jquery.yGrid.src.js' defer='defer'></script>" +
				"<script type='text/javascript' src='"+root+"ui/plugin/js/decimal/decimal.js' defer='defer'></script>" +
				"<script type='text/javascript' src='"+root+"ui/plugin/js/picture/ajaxfileupload.js' defer='defer'></script>" +
				"<script type='text/javascript' src='"+root+"ui/plugin/js/ui-extend/jquery.placeholder.js' defer='defer'></script>" +
				"<script type='text/javascript' src='"+root+"ui/plugin/js/ui-extend/jquery.ui.treeTable.js' defer='defer'></script>" +
				"<script type='text/javascript' src='"+root+"ui/plugin/js/flotr/lib/bean-min.js' defer='defer'></script>" +
				"<script type='text/javascript' src='"+root+"ui/plugin/js/flotr/lib/underscore-min.js' defer='defer'></script>" +
				"<script type='text/javascript' src='"+root+"ui/plugin/js/flotr/js/Flotr.js' defer='defer'></script>" +
				"<script type='text/javascript' src='"+root+"ui/plugin/js/flotr/js/DefaultOptions.js' defer='defer'></script>" +
				"<script type='text/javascript' src='"+root+"ui/plugin/js/flotr/js/Color.js' defer='defer'></script>" +
				"<script type='text/javascript' src='"+root+"ui/plugin/js/flotr/js/Date.js' defer='defer'></script>" +
				"<script type='text/javascript' src='"+root+"ui/plugin/js/flotr/js/DOM.js' defer='defer'></script>" +
				"<script type='text/javascript' src='"+root+"ui/plugin/js/flotr/js/EventAdapter.js' defer='defer'></script>" +
				"<script type='text/javascript' src='"+root+"ui/plugin/js/flotr/js/Text.js' defer='defer'></script>" +
				"<script type='text/javascript' src='"+root+"ui/plugin/js/flotr/js/Graph.js' defer='defer'></script>" +
				"<script type='text/javascript' src='"+root+"ui/plugin/js/flotr/js/Axis.js' defer='defer'></script>" +
				"<script type='text/javascript' src='"+root+"ui/plugin/js/flotr/js/Series.js' defer='defer'></script>" +
				"<script type='text/javascript' src='"+root+"ui/plugin/js/flotr/js/Series.js' defer='defer'></script>" +
				"<script type='text/javascript' src='"+root+"ui/plugin/js/flotr/js/types/lines.js' defer='defer'></script>" +
				"<script type='text/javascript' src='"+root+"ui/plugin/js/flotr/js/types/bars.js' defer='defer'></script>" +
				"<script type='text/javascript' src='"+root+"ui/plugin/js/flotr/js/types/points.js' defer='defer'></script>" +
				"<script type='text/javascript' src='"+root+"ui/plugin/js/flotr/js/types/pie.js' defer='defer'></script>" +
				"<script type='text/javascript' src='"+root+"ui/plugin/js/flotr/js/types/candles.js' defer='defer'></script>" +
				"<script type='text/javascript' src='"+root+"ui/plugin/js/flotr/js/types/markers.js' defer='defer'></script>" +
				"<script type='text/javascript' src='"+root+"ui/plugin/js/flotr/js/types/radar.js' defer='defer'></script>" +
				"<script type='text/javascript' src='"+root+"ui/plugin/js/flotr/js/types/bubbles.js' defer='defer'></script>" +
				"<script type='text/javascript' src='"+root+"ui/plugin/js/flotr/js/types/gantt.js' defer='defer'></script>" +
				"<script type='text/javascript' src='"+root+"ui/plugin/js/flotr/js/types/timeline.js' defer='defer'></script>" +
				"<script type='text/javascript' src='"+root+"ui/plugin/js/flotr/js/plugins/download.js' defer='defer'></script>" +
				"<script type='text/javascript' src='"+root+"ui/plugin/js/flotr/js/plugins/selection.js' defer='defer'></script>" +
				"<script type='text/javascript' src='"+root+"ui/plugin/js/flotr/js/plugins/spreadsheet.js' defer='defer'></script>" +
				"<script type='text/javascript' src='"+root+"ui/plugin/js/flotr/js/plugins/grid.js' defer='defer'></script>" +
				"<script type='text/javascript' src='"+root+"ui/plugin/js/flotr/js/plugins/hit.js' defer='defer'></script>" +
				"<script type='text/javascript' src='"+root+"ui/plugin/js/flotr/js/plugins/crosshair.js' defer='defer'></script>" +
				"<script type='text/javascript' src='"+root+"ui/plugin/js/flotr/js/plugins/labels.js' defer='defer'></script>" +
				"<script type='text/javascript' src='"+root+"ui/plugin/js/flotr/js/plugins/legend.js' defer='defer'></script>" +
				"<script type='text/javascript' src='"+root+"ui/plugin/js/flotr/js/plugins/titles.js' defer='defer'></script>" +
				"<script type='text/javascript' src='"+root+"ui/plugin/js/datepicker/js/datepicker.js' defer='defer'></script>" +
				"<script type='text/javascript' src='"+root+"ui/plugin/js/smartspin/smartspinner.js' defer='defer'></script>" +
				"<script type='text/javascript' src='"+root+"ui/plugin/js/modaldialog/js/resize.js' defer='defer'></script>" +
				"<script type='text/javascript' src='"+root+"ui/plugin/js/modaldialog/js/modaldialog.js' defer='defer'></script>" +
				"<script type='text/javascript' src='"+root+"ui/plugin/js/paginationjs/pagination.js' defer='defer'></script>" +
				"<script type='text/javascript' src='"+root+"ui/plugin/js/wangEditor/wangEditor-1.4.0.js' defer='defer'></script>" +
				"<script type='text/javascript' src='"+root+"ui/plugin/js/picture/jquery_photoCut.js' defer='defer'></script>" +
				"<script type='text/javascript' src='"+root+"ui/plugin/js/treetable/jquery.treetable.js' defer='defer'></script>" +
				"<script type='text/javascript' src='"+root+"ui/plugin/js/pdf/pdfobject.js' defer='defer'></script>" +
				"<script type='text/javascript' src='"+root+"ui/plugin/js/throttle-debounce/jquery.ba-throttle-debounce.min.js' defer='defer'></script>" +
				"<script type='text/javascript' src='"+root+"ui/plugin/js/scrollbar/jquery_scrollbar.js' defer='defer'></script>" +
				"<script type='text/javascript' src='"+root+"ui/plugin/js/rsa/jsbn.js' defer='defer'></script>" +
				"<script type='text/javascript' src='"+root+"ui/plugin/js/rsa/prng4.js' defer='defer'></script>" +
				"<script type='text/javascript' src='"+root+"ui/plugin/js/rsa/rng.js' defer='defer'></script>" +
				"<script type='text/javascript' src='"+root+"ui/plugin/js/rsa/rsa.js' defer='defer'></script>" +
				"<script type='text/javascript' src='"+root+"ui/plugin/js/rsa/BASE_64.js' defer='defer'></script>" +
                "<script type='text/javascript' src='"+root+"ui/plugin/js/gantt/gantt.js' defer='defer'></script>" +
				"<script type='text/javascript' src='"+root+"ui/plugin/js/pako/pako.js' defer='defer'></script>";
	document.write(file);
}());
