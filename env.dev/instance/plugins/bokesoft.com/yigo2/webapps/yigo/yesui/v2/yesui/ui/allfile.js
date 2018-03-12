(function () {

	var root = "yesui/v2/";
	

	var getCookie = function(key){
		var arr,reg = new RegExp("(^| )"+key+"=([^;]*)(;|$)");
		if(arr = document.cookie.match(reg)){
			return unescape(arr[2]);
		}
		return null;
	}

	var myStyle = getCookie("myStyle");
	if(!myStyle){
		myStyle = 'blue';
	}
	var local = getCookie("locale");
	if(!local){
		local = 'zh-CN';
	}
	
	//IE 下兼容console
	if(/msie/.test(navigator.userAgent.toLowerCase()) || /rv:([\d.]+)\) like gecko/.test(navigator.userAgent.toLowerCase())){
		document.write("<script type='text/javascript' src='"+root+"yesui/ui/plugin/js/fauxconsole/fauxconsole.js'></script>");
	}

	var file = "<link rel='stylesheet' href='"+root+"yesui/ui/plugin/css/fullcalendar/fullcalendar.css'>" + 
				"<link rel='stylesheet' href='"+root+"yesui/ui/plugin/css/fullcalendar/fullcalendar.css'>" +
				"<link rel='stylesheet' href='"+root+"yesui/ui/plugin/css/bootstrap/bootstrap.css'>" +
				"<link rel='stylesheet' href='"+root+"yesui/ui/plugin/css/datepicker/css/datepicker.css'/>" +
				"<link rel='stylesheet' href='"+root+"yesui/ui/plugin/css/smartspin/smartspinner.css'/>" +
				"<link rel='stylesheet' href='"+root+"yesui/ui/plugin/css/modaldialog/css/jquery.modaldialog.css'/>" +
				"<link rel='stylesheet' href='"+root+"yesui/ui/plugin/css/paginationjs/pagination.css'/>" +
				"<link rel='stylesheet' href='"+root+"yesui/ui/plugin/css/wangEditor/wangEditor-1.4.0.css'/>" +
				"<link rel='stylesheet' href='"+root+"yesui/ui/plugin/css/treetable/stylesheets/jquery.treetable.theme.default.css' />" +
				"<link rel='stylesheet' href='"+root+"yesui/ui/plugin/css/scrollbar/scrollbar.css' />" +
				
				"<link rel='stylesheet' href='"+root+"yesui/ui/res/css/"+myStyle+"/main.css'>" +
				"<link rel='stylesheet' href='"+root+"yesui/ui/res/css/"+myStyle+"/core.css'>" +
				"<link rel='stylesheet' href='"+root+"yesui/ui/res/css/"+myStyle+"/grid.css'>" +
				
//				"<script type='text/javascript' src='"+root+"common/jquery/jquery-3.1.1.js'></script>" +
				"<script type='text/javascript' src='"+root+"common/jquery/jquery-1.10.2.js'></script>" +
				"<script type='text/javascript' src='"+root+"common/jquery/jstz-1.0.4.min.js'></script>" +
				"<script type='text/javascript' src='"+root+"common/ext/jsext.js'></script>" +

				"<script type='text/javascript' src='"+root+"yesui/ui/yes-ui.js'></script>" +
				"<script type='text/javascript' src='"+root+"common/data/yiuiconsts.js' defer='defer'></script>" +
				"<script type='text/javascript' src='"+root+"common/data/itemdata.js' defer='defer'></script>" + 

				"<script type='text/javascript' src='"+root+"yesui/ui/language/i18n.js' defer='defer'></script>" +
				"<script type='text/javascript' src='"+root+"yesui/ui/language/"+local+"/i18N.js' defer='defer'></script>" +
				"<script type='text/javascript' src='"+root+"yesui/ui/language/"+local+"/plug-in.js' defer='defer'></script>" +
				
			
				"<script type='text/javascript' src='"+root+"common/cache/lru/lrucache.js' defer='defer'></script>" +
				//"<script type='text/javascript' src='"+root+"common/cache/dict/dictlrucache.js' defer='defer'></script>" +
				"<script type='text/javascript' src='"+root+"common/cache/indexeddb/indexeddbproxy.js' defer='defer'></script>" +
				//"<script type='text/javascript' src='"+root+"common/cache/dict/dictindexeddb.js' defer='defer'></script>" +
				"<script type='text/javascript' src='"+root+"yesui/base/datacache.js' defer='defer'></script>" +
				"<script type='text/javascript' src='"+root+"yesui/svr/service/dictcacheproxy.js' defer='defer'></script>" +
				"<script type='text/javascript' src='"+root+"yesui/svr/service/docserviceproxy.js' defer='defer'></script>" +
				"<script type='text/javascript' src='"+root+"yesui/svr/service/metaserviceproxy.js' defer='defer'></script>" +
				"<script type='text/javascript' src='"+root+"yesui/svr/service/remoteserviceproxy.js' defer='defer'></script>" +
				"<script type='text/javascript' src='"+root+"yesui/svr/service/rightsserviceproxy.js' defer='defer'></script>" +
				"<script type='text/javascript' src='"+root+"yesui/svr/service/bpmserviceproxy.js' defer='defer'></script>" +

				"<script type='text/javascript' src='"+root+"common/data/datatype.js' defer='defer'></script>" +
				"<script type='text/javascript' src='"+root+"common/exception/ViewException.js' defer='defer'></script>" +
				"<script type='text/javascript' src='"+root+"common/exception/BPMException.js' defer='defer'></script>" +
				"<script type='text/javascript' src='"+root+"yesui/base/jQueryExt.js' defer='defer'></script>" +
				"<script type='text/javascript' src='"+root+"yesui/base/prototypeExt.js' defer='defer'></script>" +
				"<script type='text/javascript' src='"+root+"yesui/svr/request.js'></script>" + 
				"<script type='text/javascript' src='"+root+"yesui/svr/svrmgr.js'></script>" +
				"<script type='text/javascript' src='"+root+"common/expr/parser.js' defer='defer'></script>" +
				"<script type='text/javascript' src='"+root+"common/expr/valimpl.js' defer='defer'></script>" +
				"<script type='text/javascript' src='"+root+"common/expr/exprutil.js' defer='defer'></script>" +
				"<script type='text/javascript' src='"+root+"common/expr/funimplmap.js' defer='defer'></script>" +
				"<script type='text/javascript' src='"+root+"common/util/datautil.js' defer='defer'></script>" +
				"<script type='text/javascript' src='"+root+"common/util/numericutil.js' defer='defer'></script>" +
				"<script type='text/javascript' src='"+root+"common/util/typeconvertor.js' defer='defer'></script>" +

				"<script type='text/javascript' src='"+root+"common/util/gridlookuputil.js' defer='defer'></script>" +

				"<script type='text/javascript' src='"+root+"common/util/subdetailutil.js' defer='defer'></script>" +
				"<script type='text/javascript' src='"+root+"common/util/yesjsonutil.js' defer='defer'></script>" +
				"<script type='text/javascript' src='"+root+"common/util/totalrowcountutil.js' defer='defer'></script>" +


				"<script type='text/javascript' src='"+root+"yesui/svr/purehandler.js' defer='defer'></script>" +
				"<script type='text/javascript' src='"+root+"yesui/svr/handler/basehandler.js' defer='defer'></script>" +
				"<script type='text/javascript' src='"+root+"yesui/svr/handler/attachmenthandler.js' defer='defer'></script>" +
				"<script type='text/javascript' src='"+root+"yesui/svr/handler/buttonhandler.js' defer='defer'></script>" +
        		"<script type='text/javascript' src='"+root+"yesui/svr/handler/textbuttonhandler.js' defer='defer'></script>" +
				"<script type='text/javascript' src='"+root+"yesui/svr/handler/comboboxhandler.js' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"yesui/svr/handler/checkboxhandler.js' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"yesui/svr/handler/dicthandler.js' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"yesui/svr/handler/datepickerhandler.js' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"yesui/svr/handler/dropdownbuttonhandler.js' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"yesui/svr/handler/gridhandler.js' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"yesui/svr/handler/hyperlinkhandler.js' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"yesui/svr/handler/imagehandler.js' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"yesui/svr/handler/listviewhandler.js' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"yesui/svr/handler/numbereditorhandler.js' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"yesui/svr/handler/passwordeditorhandler.js' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"yesui/svr/handler/radiobuttonhandler.js' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"yesui/svr/handler/splitbuttonhandler.js' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"yesui/svr/handler/searchboxhandler.js' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"yesui/svr/handler/textareahandler.js' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"yesui/svr/handler/texteditorhandler.js' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"yesui/svr/handler/toolbarhandler.js' defer='defer'></script>" + 
				//"<script type='text/javascript' src='"+root+"yesui/svr/handler/treehandler.js' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"yesui/svr/handler/dialoghandler.js' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"yesui/svr/handler/dictviewhandler.js' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"yesui/svr/handler/filechooserhandler.js' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"yesui/svr/handler/mapdrawhandler.js' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"yesui/svr/handler/richeditorhandler.js' defer='defer'></script>" +
				"<script type='text/javascript' src='"+root+"yesui/svr/handler/stepeditorhandler.js' defer='defer'></script>" +
				
				"<script type='text/javascript' src='"+root+"yesui/svr/behavior/basebehavior.js' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"yesui/svr/behavior/buttonbehavior.js' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"yesui/svr/behavior/checkboxbehavior.js' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"yesui/svr/behavior/comboboxbehavior.js' defer='defer'></script>" +
				"<script type='text/javascript' src='"+root+"yesui/svr/behavior/checklistboxbehavior.js' defer='defer'></script>" +
				"<script type='text/javascript' src='"+root+"yesui/svr/behavior/datepickerbehavior.js' defer='defer'></script>" +
				"<script type='text/javascript' src='"+root+"yesui/svr/behavior/dictbehavior.js' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"yesui/svr/behavior/gridbehavior.js' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"yesui/svr/behavior/hyperlinkbehavior.js' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"yesui/svr/behavior/imagebehavior.js' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"yesui/svr/behavior/listviewbehavior.js' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"yesui/svr/behavior/numbereditorbehavior.js' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"yesui/svr/behavior/radiobuttonbehavior.js' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"yesui/svr/behavior/splitbuttonbehavior.js' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"yesui/svr/behavior/searchboxbehavior.js' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"yesui/svr/behavior/textareabehavior.js' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"yesui/svr/behavior/texteditorbehavior.js' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"yesui/svr/behavior/utcdatepickerbehavior.js' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"yesui/svr/behavior/richeditorbehavior.js' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"yesui/svr/behavior/stepeditorbehavior.js' defer='defer'></script>" +
				
				"<script type='text/javascript' src='"+root+"yesui/svr/format/dateformat.js' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"yesui/svr/format/utcdateformat.js' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"yesui/svr/format/decimalformat.js' defer='defer'></script>" +
				"<script type='text/javascript' src='"+root+"yesui/svr/format/numberformat.js' defer='defer'></script>" +
        		"<script type='text/javascript' src='"+root+"yesui/svr/format/textformat.js' defer='defer'></script>" +
				
				"<script type='text/javascript' src='"+root+"yesui/svr/service/dictserviceproxy.js' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"yesui/svr/Base64Utils.js' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"yesui/svr/uiutils.js' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"yesui/svr/batchutils.js' defer='defer'></script>" + 
			    

			   	"<script type='text/javascript' src='"+root+"yesui/ui/util/viewutil.js' defer='defer'></script>" +
				"<script type='text/javascript' src='"+root+"yesui/ui/util/fileutil.js' defer='defer'></script>" +
				"<script type='text/javascript' src='"+root+"yesui/ui/util/rightsutil.js' defer='defer'></script>" +
				"<script type='text/javascript' src='"+root+"yesui/ui/util/loadingutil.js' defer='defer'></script>" +

				"<script type='text/javascript' src='"+root+"yesui/ui/filtermap.js' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"yesui/ui/opt.js' defer='defer'></script>" +
                "<script type='text/javascript' src='"+root+"yesui/ui/showdata.js' defer='defer'></script>" +
				"<script type='text/javascript' src='"+root+"yesui/ui/fun/basefun.js' defer='defer'></script>" + 
		        "<script type='text/javascript' src='"+root+"yesui/ui/objectloop.js' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"yesui/ui/vparser.js' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"yesui/ui/workiteminfo.js' defer='defer'></script>" + 
		        "<script type='text/javascript' src='"+root+"yesui/ui/statusproxy.js' defer='defer'></script>" +
				"<script type='text/javascript' src='"+root+"yesui/ui/abstractuiprocess.js' defer='defer'></script>" +

				"<script type='text/javascript' src='"+root+"yesui/ui/process/uienableprocess.js' defer='defer'></script>" +
				"<script type='text/javascript' src='"+root+"yesui/ui/process/uicalcprocess.js' defer='defer'></script>" +
				"<script type='text/javascript' src='"+root+"yesui/ui/process/uicheckruleprocess.js' defer='defer'></script>" +
				"<script type='text/javascript' src='"+root+"yesui/ui/process/uivisibleprocess.js' defer='defer'></script>" +
				"<script type='text/javascript' src='"+root+"yesui/ui/process/uidependencyprocess.js' defer='defer'></script>" +
				"<script type='text/javascript' src='"+root+"yesui/ui/process/uiparaprocess.js' defer='defer'></script>" +
				
				
				
				"<script type='text/javascript' src='"+root+"yesui/ui/bpm/inplacetoolbar.js' defer='defer'></script>" +
				"<script type='text/javascript' src='"+root+"yesui/ui/bpm/bpminplacetoolbar.js' defer='defer'></script>" +
				"<script type='text/javascript' src='"+root+"yesui/ui/bpm/loadworkiteminplacetoolbar.js' defer='defer'></script>" +
				"<script type='text/javascript' src='"+root+"yesui/ui/bpm/batchoperationinplacetoolbar.js' defer='defer'></script>" +
				

				"<script type='text/javascript' src='"+root+"yesui/ui/headinfos.js' defer='defer'></script>" +

				"<script type='text/javascript' src='"+root+"yesui/ui/uiprocess.js' defer='defer'></script>" +
                "<script type='text/javascript' src='"+root+"yesui/ui/process/viewdatamonitor.js' defer='defer'></script>" +
				"<script type='text/javascript' src='"+root+"yesui/ui/paras.js' defer='defer'></script>" +
				"<script type='text/javascript' src='"+root+"yesui/ui/ppobject.js' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"yesui/ui/formstack.js' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"yesui/ui/form.js' defer='defer'></script>" + 
		        "<script type='text/javascript' src='"+root+"yesui/ui/focuspolicy.js' defer='defer'></script>" + 
			    "<script type='text/javascript' src='"+root+"yesui/ui/formadapt.js' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"yesui/ui/formbuilder.js' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"yesui/ui/appdef.js' defer='defer'></script>" + 
				
				"<script type='text/javascript' src='"+root+"yesui/ui/printpreview.js' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"yesui/ui/positionutil.js' defer='defer'></script>" +
				
				"<script type='text/javascript' src='"+root+"yesui/ui/builder/yiuibuilder.js' defer='defer'></script>" + 

				//工具类 供他人直接渲染单据
				"<script type='text/javascript' src='"+root+"yesui/svr/formutils.js' defer='defer'></script>" + 
				//"<script type='text/javascript' src='"+root+"yesui/ui/formRender.js' defer='defer'></script>" + 

                //组件
				"<script type='text/javascript' src='"+root+"yesui/ui/yescomponent/yesbutton.js' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"yesui/ui/yescomponent/yeshyperlink.js' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"yesui/ui/yescomponent/yesimage.js' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"yesui/ui/yescomponent/yestexteditor.js' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"yesui/ui/yescomponent/yeslabel.js' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"yesui/ui/yescomponent/yesnumbereditor.js' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"yesui/ui/yescomponent/yescheckbox.js' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"yesui/ui/yescomponent/yesdict.js' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"yesui/ui/yescomponent/yesdatepicker.js' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"yesui/ui/yescomponent/yescombobox.js' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"yesui/ui/yescomponent/yesdialog.js' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"yesui/ui/yescomponent/yesstepeditor.js' defer='defer'></script>" +
				"<script type='text/javascript' src='"+root+"yesui/ui/component/componentmgr.js' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"yesui/ui/component/component.js' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"yesui/ui/component/conditionparas.js' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"yesui/ui/component/control/control.js' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"yesui/ui/component/control/toolbar.js' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"yesui/ui/component/control/treemenubar.js' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"yesui/ui/component/control/databinding.js' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"yesui/ui/component/control/button.js' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"yesui/ui/component/control/richeditor.js' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"yesui/ui/component/control/buttongroup.js' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"yesui/ui/component/control/dropdownbutton.js' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"yesui/ui/component/control/splitbutton.js' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"yesui/ui/component/control/calendar.js' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"yesui/ui/component/control/checkbox.js' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"yesui/ui/component/control/combobox.js' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"yesui/ui/component/control/datepicker.js' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"yesui/ui/component/control/dict.js' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"yesui/ui/component/control/dicttree.js' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"yesui/ui/component/control/dictview.js' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"yesui/ui/component/control/dictquerypanel.js' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"yesui/ui/component/control/hyperlink.js' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"yesui/ui/component/control/imagelist.js' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"yesui/ui/component/control/label.js' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"yesui/ui/component/control/listview.js' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"yesui/ui/component/control/numbereditor.js' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"yesui/ui/component/control/image.js' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"yesui/ui/component/control/radiobutton.js' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"yesui/ui/component/control/texteditor.js' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"yesui/ui/component/control/textarea.js' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"yesui/ui/component/control/textbutton.js' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"yesui/ui/component/control/statusbar.js' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"yesui/ui/component/control/treeview.js' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"yesui/ui/component/control/passwordeditor.js' defer='defer'></script>" + 
				//"<script type='text/javascript' src='"+root+"yesui/ui/component/control/tree.js' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"yesui/ui/component/control/attachment.js' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"yesui/ui/component/control/separator.js' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"yesui/ui/component/control/chart.js' defer='defer'></script>" + 
		        "<script type='text/javascript' src='"+root+"yesui/ui/component/control/bpmgraph.js' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"yesui/ui/component/control/custom.js' defer='defer'></script>" + 
                "<script type='text/javascript' src='"+root+"yesui/ui/component/control/flatcanvas.js' defer='defer'></script>" +
				"<script type='text/javascript' src='"+root+"yesui/ui/component/control/userinfopane.js' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"yesui/ui/component/control/rightsset.js' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"yesui/ui/component/control/dialog.js' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"yesui/ui/component/control/filechooser.js' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"yesui/ui/component/control/mapdraw.js' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"yesui/ui/component/control/utcdatepicker.js' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"yesui/ui/component/control/searchbox.js' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"yesui/ui/component/control/webbrowser.js' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"yesui/ui/component/control/stepeditor.js' defer='defer'></script>" +
                "<script type='text/javascript' src='"+root+"yesui/ui/component/control/gantt.js' defer='defer'></script>" +
                "<script type='text/javascript' src='"+root+"yesui/ui/component/grid/gridsumutil.js' defer='defer'></script>" +
                "<script type='text/javascript' src='"+root+"yesui/ui/component/grid/grid.js' defer='defer'></script>" +
                "<script type='text/javascript' src='"+root+"yesui/ui/component/grid/griddef.js' defer='defer'></script>" +
                "<script type='text/javascript' src='"+root+"yesui/ui/component/grid/rowexpand.js' defer='defer'></script>" +
                "<script type='text/javascript' src='"+root+"yesui/ui/component/grid/columnexpand.js' defer='defer'></script>" +
        		"<script type='text/javascript' src='"+root+"yesui/ui/component/grid/showgriddata.js' defer='defer'></script>" +
                "<script type='text/javascript' src='"+root+"yesui/ui/component/grid/gridutil.js' defer='defer'></script>" +
                "<script type='text/javascript' src='"+root+"yesui/ui/component/grid/rowgroup.js' defer='defer'></script>" +
				"<script type='text/javascript' src='"+root+"yesui/ui/component/grid/editor/celleditor.js' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"yesui/ui/component/grid/editor/celltexteditor.js' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"yesui/ui/component/grid/editor/cellnumbereditor.js' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"yesui/ui/component/grid/editor/celldatepicker.js' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"yesui/ui/component/grid/editor/cellutcdatepicker.js' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"yesui/ui/component/grid/editor/cellcombobox.js' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"yesui/ui/component/grid/editor/celldict.js' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"yesui/ui/component/grid/editor/celldynamicdict.js' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"yesui/ui/component/grid/editor/cellimage.js' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"yesui/ui/component/grid/editor/celltextbutton.js' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"yesui/ui/component/layout/autolayout.js' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"yesui/ui/component/layout/borderlayout.js' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"yesui/ui/component/layout/columnlayout.js' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"yesui/ui/component/layout/fluidcolumnlayout.js' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"yesui/ui/component/layout/gridlayout.js' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"yesui/ui/component/layout/tablayout.js' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"yesui/ui/component/layout/tab.js' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"yesui/ui/component/layout/splitlayout.js' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"yesui/ui/component/layout/flexflowlayout.js' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"yesui/ui/component/layout/flowlayout.js' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"yesui/ui/component/layout/tablelayout.js' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"yesui/ui/component/layout/fluidtablelayout.js' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"yesui/ui/component/layout/wizardlayout.js' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"yesui/ui/component/panel/panel.js' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"yesui/ui/component/panel/borderlayoutpanel.js' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"yesui/ui/component/panel/columnlayoutpanel.js' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"yesui/ui/component/panel/flowlayoutpanel.js' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"yesui/ui/component/panel/flexflowlayoutpanel.js' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"yesui/ui/component/panel/fluidcolumnlayoutpanel.js' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"yesui/ui/component/panel/fluidtablelayoutpanel.js' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"yesui/ui/component/panel/gridlayoutpanel.js' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"yesui/ui/component/panel/splitpanel.js' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"yesui/ui/component/panel/tabpanel.js' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"yesui/ui/component/panel/tabpanelex.js' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"yesui/ui/component/panel/treepanel.js' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"yesui/ui/component/panel/tabcontainer.js' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"yesui/ui/component/panel/tabexcontainer.js' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"yesui/ui/component/panel/stackcontainer.js' defer='defer'></script>" + 
				"<script type='text/javascript' src='"+root+"yesui/ui/component/panel/wizardpanel.js' defer='defer'></script>" +

        		"<script type='text/javascript' src='"+root+"yesui/ui/custom.js' defer='defer'></script>" +
        		"<script type='text/javascript' src='"+root+"yesui/ui/maincontainer.js'></script>" +
				"<script type='text/javascript' src='"+root+"yesui/ui/maintree.js'></script>" + 
				
                "<script type='text/javascript' src='"+root+"yesui/ui/plugin/js/print/jquery.printarea.js' defer='defer'></script>" +
				"<script type='text/javascript' src='"+root+"yesui/ui/plugin/js/raphael-src.js' defer='defer'></script>" +
				"<script type='text/javascript' src='"+root+"yesui/ui/plugin/js/jquery.cookie.js' defer='defer'></script>" +
				"<script type='text/javascript' src='"+root+"yesui/ui/plugin/js/datepicker/datetimemask/dateTimeMask.js' defer='defer'></script>" +
				"<script type='text/javascript' src='"+root+"yesui/ui/plugin/js/jquery.json-2.3.min.js' defer='defer'></script>" +
				"<script type='text/javascript' src='"+root+"yesui/ui/plugin/js/ygrid/ygrid.locale-cn.js' defer='defer'></script>" +
				"<script type='text/javascript' src='"+root+"yesui/ui/plugin/js/ygrid/jquery.yGrid.src.js' defer='defer'></script>" +
				//"<script type='text/javascript' src='"+root+"yesui/ui/plugin/js/decimal/decimal.js' defer='defer'></script>" +
				"<script type='text/javascript' src='"+root+"yesui/ui/plugin/js/decimal/bignumber.js' defer='defer'></script>" +
				"<script type='text/javascript' src='"+root+"yesui/ui/plugin/js/picture/ajaxfileupload.js' defer='defer'></script>" +
				"<script type='text/javascript' src='"+root+"yesui/ui/plugin/js/ui-extend/jquery.placeholder.js' defer='defer'></script>" +
				"<script type='text/javascript' src='"+root+"yesui/ui/plugin/js/ui-extend/jquery.ui.treeTable.js' defer='defer'></script>" +
				"<script type='text/javascript' src='"+root+"yesui/ui/plugin/js/flotr/lib/bean-min.js' defer='defer'></script>" +
				"<script type='text/javascript' src='"+root+"yesui/ui/plugin/js/flotr/lib/underscore-min.js' defer='defer'></script>" +
				"<script type='text/javascript' src='"+root+"yesui/ui/plugin/js/flotr/js/Flotr.js' defer='defer'></script>" +
				"<script type='text/javascript' src='"+root+"yesui/ui/plugin/js/flotr/js/DefaultOptions.js' defer='defer'></script>" +
				"<script type='text/javascript' src='"+root+"yesui/ui/plugin/js/flotr/js/Color.js' defer='defer'></script>" +
				"<script type='text/javascript' src='"+root+"yesui/ui/plugin/js/flotr/js/Date.js' defer='defer'></script>" +
				"<script type='text/javascript' src='"+root+"yesui/ui/plugin/js/flotr/js/DOM.js' defer='defer'></script>" +
				"<script type='text/javascript' src='"+root+"yesui/ui/plugin/js/flotr/js/EventAdapter.js' defer='defer'></script>" +
				"<script type='text/javascript' src='"+root+"yesui/ui/plugin/js/flotr/js/Text.js' defer='defer'></script>" +
				"<script type='text/javascript' src='"+root+"yesui/ui/plugin/js/flotr/js/Graph.js' defer='defer'></script>" +
				"<script type='text/javascript' src='"+root+"yesui/ui/plugin/js/flotr/js/Axis.js' defer='defer'></script>" +
				"<script type='text/javascript' src='"+root+"yesui/ui/plugin/js/flotr/js/Series.js' defer='defer'></script>" +
				"<script type='text/javascript' src='"+root+"yesui/ui/plugin/js/flotr/js/Series.js' defer='defer'></script>" +
				"<script type='text/javascript' src='"+root+"yesui/ui/plugin/js/flotr/js/types/lines.js' defer='defer'></script>" +
				"<script type='text/javascript' src='"+root+"yesui/ui/plugin/js/flotr/js/types/bars.js' defer='defer'></script>" +
				"<script type='text/javascript' src='"+root+"yesui/ui/plugin/js/flotr/js/types/points.js' defer='defer'></script>" +
				"<script type='text/javascript' src='"+root+"yesui/ui/plugin/js/flotr/js/types/pie.js' defer='defer'></script>" +
				"<script type='text/javascript' src='"+root+"yesui/ui/plugin/js/flotr/js/types/candles.js' defer='defer'></script>" +
				"<script type='text/javascript' src='"+root+"yesui/ui/plugin/js/flotr/js/types/markers.js' defer='defer'></script>" +
				"<script type='text/javascript' src='"+root+"yesui/ui/plugin/js/flotr/js/types/radar.js' defer='defer'></script>" +
				"<script type='text/javascript' src='"+root+"yesui/ui/plugin/js/flotr/js/types/bubbles.js' defer='defer'></script>" +
				"<script type='text/javascript' src='"+root+"yesui/ui/plugin/js/flotr/js/types/gantt.js' defer='defer'></script>" +
				"<script type='text/javascript' src='"+root+"yesui/ui/plugin/js/flotr/js/types/timeline.js' defer='defer'></script>" +
				"<script type='text/javascript' src='"+root+"yesui/ui/plugin/js/flotr/js/plugins/download.js' defer='defer'></script>" +
				"<script type='text/javascript' src='"+root+"yesui/ui/plugin/js/flotr/js/plugins/selection.js' defer='defer'></script>" +
				"<script type='text/javascript' src='"+root+"yesui/ui/plugin/js/flotr/js/plugins/spreadsheet.js' defer='defer'></script>" +
				"<script type='text/javascript' src='"+root+"yesui/ui/plugin/js/flotr/js/plugins/grid.js' defer='defer'></script>" +
				"<script type='text/javascript' src='"+root+"yesui/ui/plugin/js/flotr/js/plugins/hit.js' defer='defer'></script>" +
				"<script type='text/javascript' src='"+root+"yesui/ui/plugin/js/flotr/js/plugins/crosshair.js' defer='defer'></script>" +
				"<script type='text/javascript' src='"+root+"yesui/ui/plugin/js/flotr/js/plugins/labels.js' defer='defer'></script>" +
				"<script type='text/javascript' src='"+root+"yesui/ui/plugin/js/flotr/js/plugins/legend.js' defer='defer'></script>" +
				"<script type='text/javascript' src='"+root+"yesui/ui/plugin/js/flotr/js/plugins/titles.js' defer='defer'></script>" +
				"<script type='text/javascript' src='"+root+"yesui/ui/plugin/js/datepicker/js/datepicker.js' defer='defer'></script>" +
				"<script type='text/javascript' src='"+root+"yesui/ui/plugin/js/smartspin/smartspinner.js' defer='defer'></script>" +
				"<script type='text/javascript' src='"+root+"yesui/ui/plugin/js/modaldialog/js/resize.js' defer='defer'></script>" +
				"<script type='text/javascript' src='"+root+"yesui/ui/plugin/js/modaldialog/js/modaldialog.js' defer='defer'></script>" +
				"<script type='text/javascript' src='"+root+"yesui/ui/plugin/js/paginationjs/pagination.js' defer='defer'></script>" +
				"<script type='text/javascript' src='"+root+"yesui/ui/plugin/js/wangEditor/wangEditor-1.4.0.js' defer='defer'></script>" +
				"<script type='text/javascript' src='"+root+"yesui/ui/plugin/js/picture/jquery_photoCut.js' defer='defer'></script>" +
				"<script type='text/javascript' src='"+root+"yesui/ui/plugin/js/treetable/jquery.treetable.js' defer='defer'></script>" +
				"<script type='text/javascript' src='"+root+"yesui/ui/plugin/js/pdf/pdfobject.js' defer='defer'></script>" +
				"<script type='text/javascript' src='"+root+"yesui/ui/plugin/js/throttle-debounce/jquery.ba-throttle-debounce.min.js' defer='defer'></script>" +
				"<script type='text/javascript' src='"+root+"yesui/ui/plugin/js/scrollbar/jquery_scrollbar.js' defer='defer'></script>" +
				"<script type='text/javascript' src='"+root+"yesui/ui/plugin/js/rsa/jsbn.js' defer='defer'></script>" +
				"<script type='text/javascript' src='"+root+"yesui/ui/plugin/js/rsa/prng4.js' defer='defer'></script>" +
				"<script type='text/javascript' src='"+root+"yesui/ui/plugin/js/rsa/rng.js' defer='defer'></script>" +
				"<script type='text/javascript' src='"+root+"yesui/ui/plugin/js/rsa/rsa.js' defer='defer'></script>" +
				"<script type='text/javascript' src='"+root+"yesui/ui/plugin/js/rsa/BASE_64.js' defer='defer'></script>" +
                "<script type='text/javascript' src='"+root+"yesui/ui/plugin/js/gantt/gantt.js' defer='defer'></script>" +
				"<script type='text/javascript' src='"+root+"yesui/ui/plugin/js/pako/pako.js' defer='defer'></script>" + 
                "<script type='text/javascript' src='"+root+"yesui/ui/plugin/js/flatcanvas/snap.svg.js' defer='defer'></script>" +
                "<script type='text/javascript' src='"+root+"yesui/ui/plugin/js/flatcanvas/flatcanvas.plugin.js' defer='defer'></script>" +
				"<script type='text/javascript' src='project/extend.js' defer='defer'></script>";

	document.write(file);
}());
