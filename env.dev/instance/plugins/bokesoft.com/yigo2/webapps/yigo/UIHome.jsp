<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
	<head>
		<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
		<title>UIHome</title>
		<!--css引用-->
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
        <link rel="stylesheet" href="yesui/resource/css/core.css">
        <link rel="stylesheet" href="yesui/resource/css/treemenubar.css">
        <link rel="stylesheet" href="yesui/plugins/jquery/bootstrap/css/bootstrap.css">
        <link rel="stylesheet" href="yesui/plugins/jquery/datepicker/css/layout.css" />
        <link rel="stylesheet" href="yesui/plugins/jquery/datepicker/css/datepicker.css"/>
        <link rel="stylesheet" href="yesui/plugins/jquery/smartspin/smartspinner.css"/>
		<link rel="stylesheet" href="yesui/plugins/jquery/modaldialog/css/jquery.modaldialog.css" />
		<link rel="stylesheet" href="yesui/plugins/jquery/paginationjs/pagination.css" />

	    <script type="text/javascript" src="yesui/plugins/jquery/jquery-1.10.2.js"></script>
	    <script type="text/javascript" src="yesui/plugins/jquery/jquery.json-2.3.min.js"></script>
	    <script type="text/javascript" src="yesui/plugins/jquery/jquery.cookie.js"></script>
	    <script type="text/javascript" src="yesui/yes-ui.js"></script>
	    <script type="text/javascript" src="yesui/plugins/jquery/jqgrid/grid.locale-cn.js"></script>
	    <script type="text/javascript" src="yesui/plugins/jquery/jqgrid/jquery.jqGrid.src.js"></script>
	     
	    <script type="text/javascript" src="yesui/plugins/jquery/ui-extend/jquery.placeholder.js"></script>
	    
	    <script type="text/javascript" src="yesui/common/jQueryExt.js"></script>
	    <script type="text/javascript" src="yesui/service/servicemanager.js"></script>
	    <script type="text/javascript" src="yesui/service/Request.js"></script>
	    <script type="text/javascript" src="yesui/ui/form.js"></script>
	    <script type="text/javascript" src="yesui/ui/formstack.js"></script>
	    <script type="text/javascript" src="yesui/ui/component/componentmgr.js"></script>
	    <script type="text/javascript" src="yesui/ui/component/component.js"></script>
	    <script type="text/javascript" src="yesui/ui/component/menu.js"></script>
	    <script type="text/javascript" src="yesui/ui/component/toolbar.js"></script>
	    <script type="text/javascript" src="yesui/ui/component/treemenubar.js"></script>
	    <script type="text/javascript" src="yesui/ui/component/yiuiconsts.js"></script>
	    <script type="text/javascript" src="yesui/ui/component/control/control.js"></script>
	    <script type="text/javascript" src="yesui/ui/component/control/databinding.js"></script>
	    <script type="text/javascript" src="yesui/ui/component/control/button.js"></script>
	    <script type="text/javascript" src="yesui/ui/component/control/buttongroup.js"></script>
	    <script type="text/javascript" src="yesui/ui/component/control/dropdownbutton.js"></script>
	    <script type="text/javascript" src="yesui/ui/component/control/splitbutton.js"></script>
	    <script type="text/javascript" src="yesui/ui/component/control/calendar.js"></script>
	    <script type="text/javascript" src="yesui/ui/component/control/checkbox.js"></script>
	    <script type="text/javascript" src="yesui/ui/component/control/combobox.js"></script>
	    <script type="text/javascript" src="yesui/ui/component/control/databinding.js"></script>
	    <script type="text/javascript" src="yesui/ui/component/control/datepicker.js"></script>
	    <script type="text/javascript" src="yesui/ui/component/control/dict.js"></script>
	    <script type="text/javascript" src="yesui/ui/component/control/dicttree.js"></script>
	    <script type="text/javascript" src="yesui/ui/component/grid/grid.js"></script>
	    <script type="text/javascript" src="yesui/ui/component/control/chart.js"></script>
	    <script type="text/javascript" src="yesui/ui/component/control/hyperlink.js"></script>
	    <script type="text/javascript" src="yesui/ui/component/control/imagelist.js"></script>
	    <script type="text/javascript" src="yesui/ui/component/control/label.js"></script>
	    <script type="text/javascript" src="yesui/ui/component/control/listview.js"></script>
	    <script type="text/javascript" src="yesui/ui/component/control/numbereditor.js"></script>
	    <script type="text/javascript" src="yesui/ui/component/control/image.js"></script>
	    <script type="text/javascript" src="yesui/ui/component/control/radiobutton.js"></script>
	    <script type="text/javascript" src="yesui/ui/component/control/texteditor.js"></script>
	    <script type="text/javascript" src="yesui/ui/component/control/textbutton.js"></script>
	    <script type="text/javascript" src="yesui/ui/component/control/statusbar.js"></script>
	    <script type="text/javascript" src="yesui/ui/component/control/treeview.js"></script>
	    <script type="text/javascript" src="yesui/ui/component/control/passwordeditor.js"></script>
	    <script type="text/javascript" src="yesui/ui/component/control/userinfopane.js"></script>
	    <script type="text/javascript" src="yesui/ui/component/control/tree.js"></script>
	    <script type="text/javascript" src="yesui/ui/component/layout/autolayout.js"></script>
	    <script type="text/javascript" src="yesui/ui/component/layout/borderlayout.js"></script>
	    <script type="text/javascript" src="yesui/ui/component/layout/columnlayout.js"></script>
	    <script type="text/javascript" src="yesui/ui/component/layout/fluidcolumnlayout.js"></script>
	    <script type="text/javascript" src="yesui/ui/component/layout/gridlayout.js"></script>
	    <script type="text/javascript" src="yesui/ui/component/layout/tabslayout.js"></script>
	    <script type="text/javascript" src="yesui/ui/component/layout/splitlayout.js"></script>
	    <script type="text/javascript" src="yesui/ui/component/layout/flexflowlayout.js"></script>
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
	    <script type="text/javascript" src="yesui/ui/component/treemenubar.js"></script>

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
    	
		<script type="text/javascript" src="yesui/plugins/jquery/modaldialog/js/modaldialog.js"> </script>
		<script type="text/javascript" src="yesui/plugins/jquery/paginationjs/pagination.js"> </script>
		
		
		<script type="text/javascript">
			$(document).ready(function() {
				//根据jsType类型引入不同包下得controlEvent.js文件
				
				var el = $(this);
				var menuOneLi = $(".menu-one > li");
				var menuTwo = $(".menu-two");
				$(".menu-one > li > .header").each(function(i){
					$(this).click(function() {
						if($(menuTwo[i]).css("display") == "block"){
							$(menuTwo[i]).slideUp(300);
							$(menuOneLi[i]).removeClass("menu-show");
						}else{
							for(var j=0; j<menuTwo.length; j++){
								$(menuTwo[j]).slideUp(300);
								$(menuOneLi[j]).removeClass("menu-show");
							}
							$(menuTwo[i]).slideDown(300);
							$(menuOneLi[i]).addClass("menu-show");
							
							var menuTwoLi = $(".menu-show > .menu-two > li")
							$(".menu-show > .menu-two > li ").each(function(i){
								$(this).click(function(){
									for(var j=0; j<menuTwoLi.length; j++){
										$(menuTwoLi[j]).removeClass("item-active");
									}
									$(menuTwoLi[i]).addClass("item-active");
									//0: 可编辑， 1: 不可编辑
									if($(this).text() == "按钮") {
										ServiceManager.LoadPage("UIButton", "按钮", "0", "content");
									} else if($(this).text() == "表单") {
										ServiceManager.LoadPage("UITextEditor", "表单", "0", "content");
									} else if($(this).text() == "选项卡") {
										ServiceManager.LoadPage("UITabPanel", "TabPanel", "0", "content");
									} else if($(this).text() == "面板") {
										ServiceManager.LoadPage("UISplitPanel", "SplitPanel", "0", "content");
									} else if($(this).text() == "日历") {
										ServiceManager.LoadPage("UIDatePicker", "DatePicker", "0", "content");
									} else if($(this).text() == "字体") {
										ServiceManager.LoadPage("UILabel", "Label", "0", "content");
									} else {
										ServiceManager.LoadPage("UI", "界面", "0", "content");
									}
								});
							});
						}
					});
				});
			});
		</script>
	</head>
	<body>
		<div id="UIHome">
			<div id="left" class="left">
				<img class="orange-img" alt="橘色" src="PlatformResource/ui/Orange/menu_opt_pane_backimage.png">
				<img class="menu-opt" src="PlatformResource/ui/menu_opt.png">
				<img class="logo" src="PlatformResource/ui/logo.png">
				<ul class="menu-one">
					<li>
						<div class="header">
							<img alt="个人主页" src="PlatformResource/ui/Orange/personal.png">
							<span class="txt">个人主页</span>
							<span class="arrow"></span>
						</div>
						<ul class="menu-two"></ul>
					</li>
					<li>
						<div class="header">
							<img alt="布局" src="PlatformResource/ui/Orange/layout.png">
							<span class="txt">布局</span>
							<span class="arrow"></span>
						</div>
						<ul class="menu-two"></ul>
					</li>
					<li>
						<div class="header">
							<img alt="基础UI" src="PlatformResource/ui/Orange/basisui.png">
							<span class="txt">常用控件</span>
							<span class="arrow"></span>
						</div>
						<ul class="menu-two">
							<li><a>按钮</a></li>
							<li><a>树视图</a></li>
							<li><a>导航菜单</a></li>
							<li><a>数据表格</a></li>
							<li><a>表单</a></li>
							<li><a>选项卡</a></li>
							<li><a>字典</a></li>
							<li><a>日历</a></li>
							<li><a>面板</a></li>
							<li><a>字体</a></li>
							<li><a>图标集</a></li>
							<li><a>小部件</a></li>
							<li><a>信息</a></li>
						</ul>
					</li>
					<li>
						<div class="header">
							<img alt="高级组件" src="PlatformResource/ui/Orange/advance.png">
							<span class="txt">高级组件</span>
							<span class="arrow"></span>
						</div>
						<ul class="menu-two"></ul>
					</li>
					<li>
						<div class="header">
							<img alt="功能页面" src="PlatformResource/ui/Orange/function.png">
							<span class="txt">功能页面</span>
							<span class="arrow"></span>
						</div>
						<ul class="menu-two"></ul>
					</li>
					<li>
						<div class="header">
							<img alt="界面设置" src="PlatformResource/ui/Orange/setting.png">
							<span class="txt">色彩主题</span>
							<span class="arrow"></span>
						</div>
						<ul class="menu-two"></ul>
					</li>
				</ul>
			</div>
			<div id="workspace" class="workspace">
				<div id="workspace-opt" class="workspace-opt">
					<hr style="margin:0px; height: 10px; background-color: #ff751d; border:0px;">
					<div class="left-label" align="center">
						<label class="label-number" style="display: block;">10</label>
						<label class="label-font">控件分类</label>
					</div>
					<table class="line-vertical"></table>
					<div class="buttons">
						<div id="ui_setting" class="btn-group ui-setting">
							<a class="btn dropdown-toggle" data-toggle="dropdown" href="javascript:void(0);">
								界面设置
								<span class="setting"></span>
							</a>
						</div>
						<div id="ui_setting_dropdown" class="dropdown-menu">
							<label>色彩主题</label>
							<hr/>
							<div class="color_div">
								<div></div>
								<div></div>
								<div></div>
								<div></div>
								<div></div>
							</div>
							<hr/>
							<label>图片主题</label>
							<hr/>
							<div class="image_div">
								<img src="PlatformResource/ui/Orange/menu_opt_pane_backimage.png">
								<img src="PlatformResource/ui/Orange/menu_opt_pane_backimage.png">
								<img src="PlatformResource/ui/Orange/menu_opt_pane_backimage.png">
								<img src="PlatformResource/ui/Orange/menu_opt_pane_backimage.png">
								<button>
									<img src="PlatformResource/ui/ui_expand.png">
								</button>
							</div>
							<hr/>
							<label>更换标志</label>
							<hr/>
							<div class="change_flag">
								<button></button>
								<button><!-- 
									<img src="PlatformResource/ui/ui_expand.png"> -->
								</button>
								<label>注: 150*150px内, 透明背景PNG</label>
							</div>
							<hr/>
							<label>头部线条</label>
							<hr/>
							<div class="head_line">
								<button>123</button>
								<button>#AAD75B</button>
							</div>
							<hr/>
							<label>背景图案</label>
							<hr/>
							<div class="back_image">
								<img src="PlatformResource/ui/Orange/menu_opt_pane_backimage.png">
								<img src="PlatformResource/ui/Orange/menu_opt_pane_backimage.png">
								<img src="PlatformResource/ui/Orange/menu_opt_pane_backimage.png">
								<img src="PlatformResource/ui/Orange/menu_opt_pane_backimage.png">
								<img src="PlatformResource/ui/Orange/menu_opt_pane_backimage.png">
								<img src="PlatformResource/ui/Orange/menu_opt_pane_backimage.png">
								<img src="PlatformResource/ui/Orange/menu_opt_pane_backimage.png">
								<img src="PlatformResource/ui/Orange/menu_opt_pane_backimage.png">
								<img src="PlatformResource/ui/Orange/menu_opt_pane_backimage.png">
								<img src="PlatformResource/ui/Orange/menu_opt_pane_backimage.png">
							</div>
							<hr/>
							<label class="return_default">返回默认</label>
						</div>
						
						<div id="ui_switch" class="btn-group ui-switch">
							<a class="btn dropdown-toggle" data-toggle="dropdown" href="javascript:void(0);">
								切换至
								<span></span>
							</a>
						</div>
						<div id="ui_switch_dropdown" class="dropdown-menu">
							<ul>
								<li><a>item1</a></li>
								<li><a>item2</a></li>
								<li class="divider"></li>
								<li><a>item3</a></li>
							</ul>
						</div>
						<div id="ui_refresh" class="btn-group ui-refresh">
							<a class="btn dropdown-toggle" data-toggle="dropdown" href="javascript:void(0);">
								刷新
								<span></span>
							</a>
						</div>
						<div id="ui_refresh_dropdown" class="dropdown-menu">
							<ul>
								<li><a>item1</a></li>
								<li><a>item2</a></li>
								<li class="divider"></li>
								<li><a>item3</a></li>
							</ul>
						</div>
						<div id="ui_expand" class="btn-group ui-expand">
							<a class="btn dropdown-toggle" data-toggle="dropdown" href="javascript:void(0);">
								<span ></span>
							</a>
						</div>
						<div id="ui_expand_dropdown" class="dropdown-menu">
							<ul>
								<li><a>item1</a></li>
								<li><a>item2</a></li>
								<li class="divider"></li>
								<li><a>item3</a></li>
							</ul>
						</div>
					</div>
					<div class="personal">
						<table class="line-vertical"></table>
						<img class="personal-img" alt="用户图片" src="PlatformResource/ui/ui_user_picture.png" >
						<div class="personal_name">
							<label>朱文文</label>
							<img alt="下拉" src="PlatformResource/ui/ui_user_down.png" >
						</div>
						
					</div>
				</div>
				<div id="content"></div>
			</div>
		</div>
	</body>
</html>