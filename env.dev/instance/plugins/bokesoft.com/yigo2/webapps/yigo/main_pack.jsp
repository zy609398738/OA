<%@page contentType="text/html;charset=UTF-8" language="java" %>
<!doctype html>
<html>
	<head>
		<meta http-equiv="Content-Type" content="text/html;charset=UTF-8">
		<title>工作台</title>
		<!--css引用-->
		
		<link rel="stylesheet" href="yesui/ui/plugin/css/fullcalendar/fullcalendar.min.css">
		<link rel="stylesheet" href="yesui/ui/plugin/css/bootstrap/bootstrap.min.css">
		<link rel="stylesheet" href="yesui/ui/plugin/css/datepicker/css/datepicker.min.css"/>
		<link rel="stylesheet" href="yesui/ui/plugin/css/smartspin/smartspinner.min.css"/>
		<link rel="stylesheet" href="yesui/ui/plugin/css/modaldialog/css/jquery.modaldialog.min.css"/>
		<link rel="stylesheet" href="yesui/ui/plugin/css/paginationjs/pagination.min.css"/>
		<link rel="stylesheet" href="yesui/ui/plugin/css/wangEditor/wangEditor-1.4.0.min.css"/>
        <link rel="stylesheet" href="yesui/ui/plugin/css/treetable/stylesheets/jquery.treetable.theme.default.min.css" />
		
        <link rel="stylesheet" href="yesui/ui/res/css/blue/YIUI-all.css">
		
		
		<script type="text/javascript" src="common/jquery/jquery-1.10.2.js"></script>
		<script type="text/javascript" src="common/jquery/jstz-1.0.4.min.js"></script>
	    <script type="text/javascript" src="yesui/ui/YIUI-all.js"></script>
		
        <script type="text/javascript" src="yesui/ui/plugin/js/raphael-src.min.js"></script>
		<script type="text/javascript" src="yesui/ui/plugin/js/datepicker/datetimemask/dateTimeMask.js"></script>
		<script type="text/javascript" src="yesui/ui/plugin/js/jquery.cookie.min.js"></script>
		<script type="text/javascript" src="yesui/ui/plugin/js/jquery.json-2.3.min.js"></script>
		
        <script type="text/javascript" src="yesui/ui/plugin/js/decimal/decimal.min.js"></script>
		<script type="text/javascript" src="yesui/ui/plugin/js/picture/ajaxfileupload.min.js"></script>
		<script type="text/javascript" src="yesui/ui/plugin/js/ui-extend/jquery.placeholder.min.js"></script>
		<script type="text/javascript" src="yesui/ui/plugin/js/ui-extend/jquery.ui.treeTable.min.js"></script>
		
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
		
		 
		<script type="text/javascript" src="yesui/ui/plugin/js/datepicker/js/datepicker.min.js"></script>
		<script type="text/javascript" src="yesui/ui/plugin/js/smartspin/smartspinner.min.js"></script>
		<script type="text/javascript" src="yesui/ui/plugin/js/modaldialog/js/modaldialog.min.js"></script>
		<script type="text/javascript" src="yesui/ui/plugin/js/paginationjs/pagination.min.js"></script>
	 	<script type="text/javascript" src="yesui/ui/plugin/js/wangEditor/wangEditor-1.4.0.min.js"></script>
		<script type="text/javascript" src="yesui/ui/plugin/js/picture/jquery_photoCut.min.js"></script>
		
		
	    <script type="text/javascript" src="yesui/ui/plugin/js/treetable/jquery.treetable.min.js"></script>
	    
	    <script type="text/javascript" src="yesui/ui/plugin/js/throttle-debounce/jquery.ba-throttle-debounce.min.js"></script>
	    
	    <script type="text/javascript" src="yesui/ui/plugin/js/rsa/jsbn.min.js"></script>
		<script type="text/javascript" src="yesui/ui/plugin/js/rsa/prng4.min.js"></script>
		<script type="text/javascript" src="yesui/ui/plugin/js/rsa/rng.min.js"></script>
		<script type="text/javascript" src="yesui/ui/plugin/js/rsa/rsa.min.js"></script>
		<script type="text/javascript" src="yesui/ui/plugin/js/rsa/BASE_64.min.js"></script>
		
	    <script type="text/javascript" src="yesui/ui/plugin/js/pako/pako.min.js"></script>
	    
		<script type="text/javascript">

			window.onerror = function(msg) {
				var dialog = $("<div></div>").attr("id", "error_dialog");
	            dialog.modalDialog(msg, {title: "错误", showClose: true, type: "error", height: 200, width: 400});
			};
			
			window.onbeforeunload = function() {
				/* var warning = "确认退出........";
				return warning;
				 */
				
				var n = window.event.screenX - window.screenLeft;
				var b = n > document.documentElement.scrollWidth - 20;
				if(b && window.event.clientY < 0 || window.event.sltKey) {
					alert("关闭，非刷新");
					window.event.returnValue = "关闭了。。。";
				} else {
					//遍历
			        YIUI.Print.delAll();
				}
			};
			/* 
			window.onunload = function() {
				var warning = "确认退出？？？？";
				alert(warning);
			}; */
			
			$(function () {
			    $(".login_username").html($.cookie("username"));
			
			    //自适应高度，宽度
			    $(".mainRight").width($(document.body).width() - $(".mainLeft").width() - $(".mainMiddle").width());
			    $(".mainLeft,.mainMiddle,.mainRight,.main").height($(document.body).height() - $('.nav').height());
			    $("#listBox").height($(document.body).height() - $('.nav').height() - $('.searchBox').height());
			    $(window).resize(function () {
			        $(".mainLeft,.mainMiddle,.mainRight,.main").height($(document.body).height() - $('.nav').height());
			        $(".mainRight").width($(document.body).width() - $('.mainLeft').width() - $(".mainMiddle").width() - place_w);
			        $("#listBox").height($(document.body).height() - $('.nav').height() - $('.searchBox').height());
			        YIUIContainer.container.doLayout($(".mainRight").width(), $(".mainRight").height());
			    })
			    //侧边栏隐藏
			
			    $("#logoBtn").click(function () {
			        if ($('.mainLeft').is(':hidden')) {
			            $('.mainLeft').width(240).show();
			            $(".mainRight").width($(document.body).width() - $('.mainLeft').width() - $(".mainMiddle").width() - place_w);
			            $('.mainMiddle').css({left: 240});
			            $(".navLeft").show();
			            //$('.searchBox').width(202);
			            $('.matchItems').width($('.searchBox').width());
			            $(this).removeClass('logoBtn1').addClass('logoBtn')
			        } else {
			            $('.mainLeft').hide();
			            $(".mainRight").width($(document.body).width() - place_w);
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
			    
			    $("#form").css("padding", "10px");
			    var place_w = 20;
			    YIUIContainer.container.el = $("#form");
			    YIUIContainer.container.render();

			    YIUIContainer.el = YIUIContainer.container.el;
			
			    YIUIContainer.build = function (form) {
			        if (YIUIContainer.container) {
			            YIUIContainer.container.add(form.getRootPanel());
			            YIUIContainer.container.doRenderChildren();
			            
			            /* 
			            form.getRootPanel().container = YIUIContainer.container;
			            form.getRootPanel().render(YIUIContainer.container); */
			        	form.setContainer(YIUIContainer);
			        }
			    };
			
			    YIUIContainer.removeForm = function (form) {
			        if (YIUIContainer.container) {
			            YIUIContainer.container.removeForm(form);
			        }
			    };
			    
			    YIUI.MainContainer = YIUIContainer;
			    
				var rootEntry = Svr.SvrMgr.loadTreeMenu({async: false});
				var options = new YIUI.MainTree(rootEntry, $("#listBox"), YIUIContainer);
				
			    //$('.searchtext').placeholder("请输入关键词...");
			
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
						if(matchItems.length > 0) {
				            $(".matchItems").addClass("open");
						} else {
							$(".matchItems").removeClass("open");
						}
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
	                } else if (keyCode == 8) {
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
			            if (x <= 240) {
			                x = 240;
			            }
			            if (($(document.body).width() - x) < 240) {
			                x = $(document.body).width() - 240;
			            }
			            $('.mainLeft').width(x).show();
			            $('.mainMiddle').css({left: x});
			            $('.mainLeft').width(x);
			            var $s_btn = $('.mainLeft .searchBox .search');
			            var $s_txt = $('.mainLeft .searchBox .searchtext');
			            $s_txt.width(x - $s_btn.width() - 35);
			            $('.mainRight').width($(document.body).width() - x - $(".mainMiddle").width() - place_w);
			            $('.matchItems').width($('.searchtext').width());
			
			            YIUIContainer.container.doLayout($(".mainRight").width(), $(".mainRight").height());
			
			        }
			    })
			});
					
			function openEntry(node) {
				YIUI.EventHandler.doTreeClick(node, YIUI.MainContainer);
			}
			
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
			
			window.history.forward(-1);
		</script>
		
	</head>
	<body>
		<div class="nav">
			<div class="blend"></div>
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
		                <a href="#" onclick="logout()">
		                    <div>注销</div>
		                </a>
		                <a href="#" onclick="exit()">
		                    <div>退出</div>
		                </a>
		                <a href="#" onclick="modifyPwd()">
		                    <div>修改密码</div>
		                </a>
						<a href="#" onclick="about()"><div>关于Yigo</div></a>
		
		            </div>
		        </div>
		    </div>
		</div>
		
		<!-- 主体 -->
		<div class="main">
		    <div class="mainLeft">
		        <div class="searchBox">
			        <div class="btn">
			            <button class="search"></button>
			            <input type="text" class="searchtext" placeholder="请输入关键词...">
		        	</div>
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
