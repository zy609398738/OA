<%@page contentType="text/html;charset=UTF-8" language="java" %>
<!doctype html>
	<html>
        <head>
        <meta http-equiv="Content-Type" content="text/html;charset=UTF-8;IE=8">
        <title>工作台</title>
        <!--css引用-->
        <link rel="stylesheet" href="yesui/ui/plugin/css/fullcalendar/fullcalendar.css">
        <link rel="stylesheet" href="yesui/ui/plugin/css/default/jquery.treeTable.css"> 
        <link rel="stylesheet" href="yesui/ui/plugin/css/bootstrap/bootstrap.css">
        <link rel="stylesheet" href="yesui/ui/plugin/css/datepicker/css/datepicker.css"/>
        <link rel="stylesheet" href="yesui/ui/plugin/css/smartspin/smartspinner.css"/>
		<link rel="stylesheet" href="yesui/ui/plugin/css/modaldialog/css/jquery.modaldialog.css" />
		<link rel="stylesheet" href="yesui/ui/plugin/css/paginationjs/pagination.css" />
        <link rel="stylesheet" href="yesui/ui/plugin/css/wangEditor/wangEditor-1.4.0.css" />
        <link rel="stylesheet" href="yesui/ui/plugin/css/treetable/stylesheets/jquery.treetable.theme.default.css" />

   		<link rel="stylesheet" href="yesui/ui/res/css/blue/main.css">
        <link rel="stylesheet" href="yesui/ui/res/css/blue/corecolor.css">
        <link rel="stylesheet" href="yesui/ui/res/css/blue/jquery-ui.css">
        <link rel="stylesheet" href="yesui/ui/res/css/blue/core.css">
        <link rel="stylesheet" href="yesui/ui/res/css/blue/ui.ygrid.css">
        <link rel="stylesheet" href="yesui/ui/res/css/blue/photoCut.css">
        

	    <script type="text/javascript" src="common/jquery/jquery-1.10.2.js"></script>
	    <script type="text/javascript" src="common/jquery/jstz-1.0.4.min.js"></script>
	    
        <script type="text/javascript" src="yesui/ui/yes-ui.js"></script>
        <script type="text/javascript" src="common/data/yiuiconsts.js"></script>
        <script type="text/javascript" src="common/ext/jsext.js"></script>
	    <script type="text/javascript" src="yesui/base/jQueryExt.js"></script>
        <script type="text/javascript" src="yesui/base/prototypeExt.js"></script>
	    <script type="text/javascript" src="yesui/svr/svrmgr.js"></script>
	    <script type="text/javascript" src="common/expr/parser.js"></script>
        <script type="text/javascript" src="common/expr/exprutil.js"></script>
        <script type="text/javascript" src="common/util/numericutil.js"></script>
		<script type="text/javascript" src="common/util/datautil.js"></script>
        <script type="text/javascript" src="common/util/subdetailutil.js"></script>
		<script type="text/javascript" src="common/data/datatype.js"></script>

        <script type="text/javascript" src="yesui/svr/service/dictserviceproxy.js"></script>
	    <script type="text/javascript" src="yesui/svr/request.js"></script>
	    <script type="text/javascript" src="yesui/svr/uiutils.js"></script>
        <script type="text/javascript" src="yesui/ui/filtermap.js"></script>
	    <script type="text/javascript" src="yesui/ui/fun/basefun.js"></script>
        <script type="text/javascript" src="yesui/ui/objectloop.js"></script>
	    <script type="text/javascript" src="yesui/ui/vparser.js"></script>
        <script type="text/javascript" src="yesui/ui/statusproxy.js"></script>
	    <script type="text/javascript" src="yesui/ui/uiprocess.js"></script>
	    <script type="text/javascript" src="yesui/ui/opt.js"></script>
	    <script type="text/javascript" src="yesui/ui/showdata.js"></script>
	    <script type="text/javascript" src="yesui/ui/form.js"></script>
        <script type="text/javascript" src="yesui/ui/focuspolicy.js"></script>
	    <script type="text/javascript" src="yesui/ui/formadapt.js"></script>
	    <script type="text/javascript" src="yesui/ui/formbuilder.js"></script>
	    <script type="text/javascript" src="yesui/ui/formstack.js"></script>

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
        <script type="text/javascript" src="yesui/ui/yescomponent/yesnumbereditor.js"></script>
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
        <script type="text/javascript" src="yesui/ui/component/control/bpmgraph.js"></script>
	    <script type="text/javascript" src="yesui/ui/component/control/dropdownbutton.js"></script>
	    <script type="text/javascript" src="yesui/ui/component/control/splitbutton.js"></script>
	    <script type="text/javascript" src="yesui/ui/component/control/calendar.js"></script>
	    <script type="text/javascript" src="yesui/ui/component/control/checkbox.js"></script>
	    <script type="text/javascript" src="yesui/ui/component/control/combobox.js"></script>
	    <script type="text/javascript" src="yesui/ui/component/control/datepicker.js"></script>
	    <script type="text/javascript" src="yesui/ui/component/control/dict.js"></script>
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
	    <script type="text/javascript" src="yesui/ui/component/control/custom.js"></script>
	    <script type="text/javascript" src="yesui/ui/component/control/userinfopane.js"></script>
	    <script type="text/javascript" src="yesui/ui/component/control/rightsset.js"></script>
	    <script type="text/javascript" src="yesui/ui/component/control/dialog.js"></script>
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
	    <script type="text/javascript" src="yesui/ui/component/panel/gridlayoutpanel.js"></script>
	    <script type="text/javascript" src="yesui/ui/component/panel/splitpanel.js"></script>
	    <script type="text/javascript" src="yesui/ui/component/panel/tabpanel.js"></script>
	    <script type="text/javascript" src="yesui/ui/component/panel/tabpanelex.js"></script>
	    <script type="text/javascript" src="yesui/ui/component/panel/treepanel.js"></script>
	    <script type="text/javascript" src="yesui/ui/component/panel/tabcontainer.js"></script>
	    <script type="text/javascript" src="yesui/ui/component/panel/tabexcontainer.js"></script>
	    <script type="text/javascript" src="yesui/ui/component/panel/stackcontainer.js"></script>
	    <script type="text/javascript" src="yesui/ui/component/panel/fluidtablelayoutpanel.js"></script>
	    
        <script type="text/javascript" src="yesui/ui/maincontainer.js"></script>
        <script type="text/javascript" src="yesui/ui/maintree.js"></script>

        <script type="text/javascript" src="yesui/ui/plugin/js/raphael-src.js"></script>
    	<script type="text/javascript" src="yesui/ui/plugin/js/datepicker/datetimemask/dateTimeMask.js"></script>
	    <script type="text/javascript" src="yesui/ui/plugin/js/jquery.cookie.js"></script>
	    <script type="text/javascript" src="yesui/ui/plugin/js/jquery.json-2.3.min.js"></script>
        <script type="text/javascript" src="yesui/ui/plugin/js/ygrid/ygrid.locale-cn.js"></script>
        <script type="text/javascript" src="yesui/ui/plugin/js/ygrid/jquery.yGrid.src.js"></script>
	    <%--<script type="text/javascript" src="yesui/ui/plugin/js/jqgrid/grid.locale-cn.js"></script>--%>
	    <%--<script type="text/javascript" src="yesui/ui/plugin/js/jqgrid/jquery.jqGrid.simplify.src.js"></script>--%>
        <%--<script type="text/javascript" src="yesui/ui/plugin/js/jqgrid/jquery.jqGrid.src.js"></script>--%>
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
	   	<script type="text/javascript" src="yesui/ui/plugin/js/datepicker/js/datepicker.js"></script>
    	<script type="text/javascript" src="yesui/ui/plugin/js/datepicker/js/eye.js"></script>
    	<script type="text/javascript" src="yesui/ui/plugin/js/datepicker/js/utils.js"></script>
    	<script type="text/javascript" src="yesui/ui/plugin/js/smartspin/smartspinner.js"></script>
		<script type="text/javascript" src="yesui/ui/plugin/js/modaldialog/js/modaldialog.js"> </script>
		<script type="text/javascript" src="yesui/ui/plugin/js/paginationjs/pagination.js"> </script>
        <script type="text/javascript" src="yesui/ui/plugin/js/wangEditor/wangEditor-1.4.0.js"></script>
	    <script type="text/javascript" src="yesui/ui/plugin/js/picture/jquery_photoCut.js"></script>
	    <script type="text/javascript" src="yesui/ui/plugin/js/treetable/jquery.treetable.js"></script>
	    
	    <script type="text/javascript" src="yesui/ui/plugin/js/throttle-debounce/jquery.ba-throttle-debounce.min.js"></script>

		<script type="text/javascript">

		window.onerror = function(msg) {
			var dialog = $("<div></div>").attr("id", "error_dialog");
            dialog.modalDialog(msg, {title: "错误", showClose: true, type: "error", height: 200, width: 400});
		};
		
		$(function () {
		    $(".login_username").html($.cookie("username"));
		
		    //自适应高度，宽度
		    $(".mainRight").width($(document.body).width() - $(".mainLeft").width() - $(".mainMiddle").width());
		    $(".mainLeft,.mainMiddle,.mainRight,.main").height($(document.body).height() - $('.nav').height());
		    $("#listBox").height($(document.body).height() - $('.nav').height() - $('.searchBox').height());
		    $(window).resize(function () {
		        $(".mainLeft,.mainMiddle,.mainRight,.main").height($(document.body).height() - $('.nav').height());
		        $(".mainRight").width($(document.body).width() - $('.mainLeft').width() - $(".mainMiddle").width());
		        $("#listBox").height($(document.body).height() - $('.nav').height() - $('.searchBox').height());
		        YIUIContainer.container.doLayout($(".mainRight").width(), $(".mainRight").height());
		    })
		    //侧边栏隐藏
		
		    $("#logoBtn").click(function () {
		        if ($('.mainLeft').is(':hidden')) {
		            $('.mainLeft').width(218).show();
		            $(".mainRight").width($(document.body).width() - 218);
		            $('.mainMiddle').css({left: 218});
		            $(".navLeft").show();
		            $('.searchBox').width(202);
		            $('.matchItems').width($('.searchBox').width());
		            $(this).removeClass('logoBtn1').addClass('logoBtn')
		        } else {
		            $('.mainLeft').hide();
		            $(".mainRight").width($(document.body).width());
		            $('.mainMiddle').css({left: 0});
		            $(".navLeft").hide();
		        }
		        YIUIContainer.container.doLayout($(".mainRight").width(), $(".mainRight").height());
		
		    })
		
		    //设置按钮弹出框
		    /*
		     $('.setBtn').click(function(){
		     $(".setBox").slideDown()
		     })
		     $('.setBtn').mouseleave(function(){
		     $(".setBox").slideUp()
		     })
		     */
		    $('.userBox span').click(function () {
		        $(".userImgbox").slideDown()
		    })
		    $('.userBox').mouseleave(function () {
		        $(".userImgbox").slideUp()
		    })
		
		    var YIUIContainer = {};
		    YIUIContainer.panel = function (type) {
		        if (type == "tab") {
		            return new YIUI.TabContainer();
		        }
		    };
		
		    YIUIContainer.container = new YIUIContainer.panel("tab");
		    YIUIContainer.container.el = $("#form");
		    YIUIContainer.container.render();
		
		    YIUIContainer.build = function (form) {
		        if (YIUIContainer.container) {
		            YIUIContainer.container.add(form.getRootPanel());
		            YIUIContainer.container.doRenderChildren();
		        	form.setContainer(YIUIContainer);
		        }
		    };
		
		    YIUIContainer.removeForm = function (form) {
		        if (YIUIContainer.container) {
		            YIUIContainer.container.removeForm(form);
		        }
		    };
		    
			var rootEntry = Svr.SvrMgr.loadTreeMenu({async: false});
			var options = new YIUI.MainTree(rootEntry, $("#listBox"), YIUIContainer);
			
		    $('.searchtext').placeholder("请输入关键词...");
		
		    $(".searchBox .searchtext").focusin(function () {
		        $('.searchtext').val("");
		    })
		    $(".searchBox .searchtext").keyup(function () {
		        var searchValue = $('.searchtext').val();
		        if (searchValue) {
		            var matchItems = $.map(options._data, function (value, i) {
		                return value.name.indexOf(searchValue) > -1 ? value : null;
		            })
		            $(".matchItems ul").children().remove();
		            for (var i = 0, len = matchItems.length; i < len; i++) {
		                var _li = $("<li></li>");
		                var parentID = matchItems[i].parentID,
		                        parentNode, pName = "";
		                if (parentID) {
		                    parentNode = options.getTreeNode(parentID);
		                    pName = "(" + parentNode.name + ")";
			                $("<a></a>").addClass("item").text(matchItems[i].name + pName).data("id",
			                        matchItems[i].id).appendTo(_li);
			                _li.appendTo($(".matchItems ul"));
		                }
		            }
		
		            $(".matchItems").addClass("open");
		        }
		    })
		
		    $(".matchItems").delegate('.item', 'click', function () {
		        var id = $(this).data("id");
		        var node = options.getTreeNode(id);
		        selected(node);
		        $("#" + id).dblclick();
		        $(".matchItems").removeClass("open");
		    })
		
		    function selected(node) {
		        if (node.parentID) {
		            var parent = options.getTreeNode(node.parentID);
		            if (!$("#" + parent.id).hasClass("open")) {
		                $("#" + parent.id).click();
		                if (parent.parentID) {
		                    selected(parent);
		                }
		            }
		        } else {
		        	$("#"+node.id).click();
		        }
		    }
		
		    $(document).on("mousedown", function (e) {
		        var target = $(e.target);
		        if ((target.closest($(".matchItems")).length == 0)
		                && (target.closest($(".searchBox .search")).length == 0)
		                && (target.closest($(".searchBox .searchtext")).length == 0)) {
		            $(".matchItems").removeClass("open");
		        }
		
		    });
		
		    $(document).keydown(function (event) {
		        var keyCode = event.charCode || event.keyCode || 0;
		        if (keyCode == 20) {
		            document.isCapeLook = !document.isCapeLook;
		        }  else if (keyCode == 8) {
                    var el = (event.srcElement || event.target),
                            isNotEditEle = (el.type != "text" && el.type != "textarea" && el.type !== "password"),
                            isOnlyRead = (el.readOnly == true);
                    if (isNotEditEle || isOnlyRead) {
                        if (event.returnValue) {
                            event.keyCode = 0;
                            event.returnValue = false;
                        }
                        if (event.preventDefault) {
                            event.preventDefault();
                        }
                        return false;
                    }
                }
		    });
		    //移动条
		    var bool = false;
		
		    $('.mainMiddle').mousedown(function (event) {
		        bool = true;
		
		    })
		    $('body').mouseup(function () {
		        bool = false;
		
		    });
		
		    $('.main').mousemove(function (event) {
		        if (bool == true) {
		            var x = event.pageX;
		            if (x <= 200) {
		                x = 200;
		            }
		            if (($(document.body).width() - x) < 200) {
		                x = $(document.body).width() - 200;
		            }
		            $('.mainLeft').width(x).show();
		            $('.mainMiddle').css({left: x});
		            $('.mainLeft').width(x);
		            $('.mainRight').width($(document.body).width() - x - $(".mainMiddle").width());
		            $('.searchBox').width(x - 16);
		            $('.searchtext').width($('.searchBox').width() - 50);
		            $('.matchItems').width($('.searchtext').width());
		
		            YIUIContainer.container.doLayout($(".mainRight").width(), $(".mainRight").height());
		
		        }
		    })
				
		});
		
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
		    var formKey = "ChangePassWord";
        	var success = function(jsonObj) {
              	if(!jsonObj) return true;
                for (var i = 0; i < jsonObj.length; i++) {
                	var changObj = jsonObj[i];
                    var dealCmd = changObj["cmd"];
                    var resultObj = changObj["value"];
                    resultObj.target = 2;
                    if (dealCmd == "add") {
                        YIUI.UIUtil.modalForm(null, resultObj);
                      }
                  }
        	}    	
		    var options = {
	    		formKey: "ChangePassWord",
	    		service: "DealWithTreeEvent",
	    		success: success
		    }
		    display = getSvrJson(options);
            if(display) {
            	var li = $("#tab_"+formKey+"_"+nodeKey);
        		li.click();
            }
		}
		
		function about() {
			var params = {service: "GetSystemInfo"};
		    var result = Svr.Request.getSyncData(Svr.SvrMgr.ServletURL, params);
	        
			var dialogDiv = $("<div class='modifyPwd' id='modifyPwd'></div>");
		    var version = new YIUI.Control.Label({
		        x: 0,
		        y: 1,
		        caption: "版本： "
		    });
		
		    var versionTxt = new YIUI.Control.Label({
		        x: 1,
		        y: 1,
		        caption: result.Ver
		    });
		    
		    var create = new YIUI.Control.Label({
		        x: 0,
		        y: 2,
		        caption: "创建号： "
		    });
		
		    var createTxt = new YIUI.Control.Label({
		        x: 1,
		        y: 2,
		        caption: result.BuildID
		    });
		    
		    var company = new YIUI.Control.Label({
		        x: 0,
		        y: 3,
		        colspan: 2,
		        topMargin: 0,
		        caption: "上海博科资讯股份有限公司"
		    });
		
		    var OK = new YIUI.Control.Button({
		        x: 0,
		        y: 0,
		        listeners: null,
		        value: '确定'
		    });
		    var cancel = new YIUI.Control.Button({
		        x: 1,
		        y: 0,
		        listeners: null,
		        value: '取消'
		    });

		    var gp = new YIUI.Panel.GridLayoutPanel({
		        x: 0,
		        y: 4,
		        colspan: 2,
	    		columnGap : 15,
	    		widths : ["50%", "50%"],
	    		minWidths : ["-1", "-1"],
	    		heights : [25],
	    		items : [OK, cancel]
		    });
		    
		    var gridpanel = new YIUI.Panel.GridLayoutPanel({
		    	rowGap : 5,
	    		columnGap : 15,
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
		
		window.history.forward(-1);
		</script>
	</head>
	<body>
		<div class="nav">
			<div class="navLeft"></div>
			<div class="logoBtn" id="logoBtn"></div>
			<div class="navRight">
            	<!--
				<ul>
					<li class="mailBtn"><a href="#"><span title="邮件"></span></a></li>
					<li class="talkBtn"><a href="#"><span title="会议"></span></a></li>
					<li class="setBtn">
						<a href="#"><span title="设置"></span></a>
						<div class="setBox">
							<div class="setTop"></div>
							<div class="setMain"></div>
						</div>
					</li>
				</ul>
                -->
				<div class="userBox">
					<div class="userImg"><span class="userIcon"></span></div>
					<span class="login_username">朱文文</span>
					<div class="userImgbox">
						<a href="#" onclick="logout()"><div>注销</div></a>
						<a href="#" onclick="exit()"><div>退出</div></a>
						<a href="#" onclick="modifyPwd()"><div>修改密码</div></a>
						<a href="#" onclick="about()"><div>关于Yigo</div></a>

					</div>
				</div>
			</div>
		</div>

		<!-- 主体 -->
		<div class="main">
			<div class="mainLeft">
				<div class="searchBox">
					<button class="search"></button>
					<input type="text" class="searchtext">
				</div>
				<div class="matchItems">
					<ul></ul>
				</div>
				<div id="listBox" style="height: 500px;"></div>
			</div>
			<div class="mainMiddle"></div>
			<div id="form" class="mainRight"></div>
		</div>

		<div class="loading mask" style="display: none;"></div>
		<div class="loading image" style="position: absolute; display: none;">
			<img alt='loading' src='yesui/ui/res/images/loading.gif'>
		</div>
	</body>
</html>
