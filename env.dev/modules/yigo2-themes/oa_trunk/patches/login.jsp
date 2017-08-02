<%@page contentType="text/html;charset=UTF-8" language="java" %>
<!doctype html>
<html>
	<head>
		<meta http-equiv="Content-Type" content="text/html;charset=UTF-8">
	    <meta http-equiv="Content-Type" content="application/x-javascript;charset=UTF-8">
	    <title>协同办公 - 用户登录</title>
	   	<script>
	   		document.cookie = "myStyle=blue; " + document.cookie;
	   	</script>
		<script type="text/javascript" src="yesui/v2/yesui/ui/loginfile.js"></script>
		<link href="/yigo/_$/images/main/fav.ico" rel="shortcut icon" type="image/x-icon" />
		<link rel="stylesheet" href="_$/resources/@buildin/css/oa.css">
		<script>
			window.onerror = function(msg) {
				msg = msg.replace("Uncaught Error: ", "");
				var dialog = $("<div></div>").attr("id", "error_dialog");
	            dialog.modalDialog(msg, {title: "错误", showClose: true, type: "error", height: 200, width: 400});
			};
			$(document).ready(function(){
				var defaultVersion = 8.0;
				var ua = navigator.userAgent.toLowerCase();
				var isIE = $.browser.isIE;
				var safariVersion;
				var isTrue = $.cookie("isTrue");
				if (isTrue == null) {
					if (isIE) {
						safariVersion = ua.match(/msie ([\d.]+)/);
						if (safariVersion != null) {
							safariVersion = safariVersion[1];
							if (safariVersion < defaultVersion) {
								$.cookie("loginURL", window.location.href);
							    var location_pathname = document.location.pathname;
							    while (location_pathname.indexOf('/') == 0) location_pathname = location_pathname.substr(1);
							    var baseurl = unescape(location_pathname.substr(0));
							    var service = baseurl.substring(0, baseurl.indexOf('/'));
								var url = [window.location.protocol, '//', window.location.host, '/', service].join('');
								window.location.href = url + "/error.jsp";
							}
						}
					}
				}				
				 
				
			});
		
	        $(function(){
				//设置是否显示组织机构
	        	var hasSession = false;
				//组织机构值保存字段
	        	var paraKey = "OrgID";
	        	
				var input = $("input");
				$(".login-username").focus();
				var doEnter = function($this) {
					var oldVal = $this.attr("oldVal");
					if(oldVal == $this.val()) {
						return;
					} else {
						$this.attr("oldVal", $this.val());
					}
		        	var vw = $(".login_sel_vw"), $ul = $("ul.login-combox-list", vw).empty();
					var data = {
			            service: "LoadSessionParaItems",
			            user: $(".login-username").val()
			        };
			        var result = Svr.Request.getSyncData(Svr.SvrMgr.ServletURL, data);
			        if(!result || $.isEmptyObject(result)) return;
			        var items = result.items;
			        var len = items.length, $ul;
			        if(len > 0) {
			        	var $f_li = null;
			        	for(var i = 0; i < len; i++) {
			        		var item = items[i];
			        		var $li = $("<li class='login-combox-item'></li>");
			        		if(i == 0) {
			        			$f_li = $li;
			        		}
			        		$li.attr("value", item.value).html(item.caption);
			        		$ul.append($li);
			        	}
			        	$f_li.click();
			        }
				};
				input.keyup(function(e) {
					var keyCode = e.keyCode;
					if(keyCode == 13) {
						if($(this).hasClass("login-username")) {
							//doEnter($(this));
							$(this).blur();
						}
						$(".login-button").click();
					}
				});
				$(".login-button").click(function() {
					var username = $(".login-username").val(),
						password = $(".login-password").val();
					var paras = {};
					paras[paraKey] = $(".login_paras .login-combox-value").attr("value");
					Svr.SvrMgr.doLogin(username, password, paras);
				}); 
				if(hasSession) {
					$(".login-username").blur(function() {
						doEnter($(this));
					});
					$(".login_paras .dropDown-button").click(function(e) {
						var vw = $(".login_sel_vw");
						var $div = $(this).parents(".login_paras");
						var left = $div.offset().left;
						var top = $(".login_org").offset().top + $(".login_org").height();
						vw.css({
							"top": top + "px",
							"left": left + "px"
						});
						vw.outerWidth($div.outerWidth());
						vw.show();
			            $(document).on("mousedown", function (e) {
			                var target = $(e.target);
			                if (target.closest($(".login_sel_vw")).length == 0) {
			                	$(".login_sel_vw").hide();
						    	$(document).off("mousedown");
			                }
			            });
					});
					$(".login_sel_vw").delegate("li", "click", function(e) {
						$(".login_sel_vw .sel").removeClass("sel");
						$(this).addClass("sel");
						$(".login_paras .login-combox-value").html($(this).html());
						$(".login_paras .login-combox-value").attr("value", $(this).attr("value"));
	                	$(".login_sel_vw").hide();
					});
				} else {
					$(".login_org").remove();
				}

				//密码显示
				$(".login-password-btn").on("click",function(){
					var _input =  $(".login-password"),
						_type = _input.attr("type");
					if(_type == "password"){
						_input.attr("type","text");
						$(this).addClass("login-password-btn-open")
					}else{
						_input.attr("type","password");
						$(this).removeClass("login-password-btn-open")
					}
				})	
			});
			
        </script>
	</head>
	<body>
    	<div class="login-main">
			<div class="login-mobile">
					<a href="/yigo/_$/mobile/yes-mobile.apk" class="login-a">移动端</a>
			</div>
			<div class="warpper">
				<div class="login-logo-box" style="left: 42.0833%; top: 2.94118%; overflow: hidden;">
					<img src="/yigo/_$/images/main/logo-login.png" class="logo-pic">
				</div>
				<div class="login-loginbox" style="right: 41.632%; bottom: 17.7654%; overflow: hidden;">
					<div class="form-tr username">
						<div class="login-icon" style="background: rgb(49, 166, 107); border-color: rgb(49, 166, 107); opacity: 0.77; color: rgb(255, 255, 255);">
							<i class="fa fa-user fa-2x name-icon"></i>
							<img src="/yigo/_$/images/main/username.png" style="width: 100%;height: 100%;">
						</div>
						<div class="inputborder" style="background: rgb(255, 255, 255); border-color: rgb(255, 255, 255); opacity: 0.87; color: rgb(49, 166, 107);">
							<input type="text" id="username" name="username" value="" placeholder="用户名" style="color: rgb(49, 166, 107);" class="login-username">
						</div>
	                    	</div>
				<div class="form-tr user-password">
					<div class="login-icon" style="background: rgb(49, 166, 107); border-color: rgb(49, 166, 107); opacity: 0.77; color: rgb(255, 255, 255);">
						<i class="fa fa-unlock-alt fa-2x password-icon"></i>
						<img src="/yigo/_$/images/main/password.png" style="width: 100%;height: 100%;">
					</div>
					<div class="inputborder" style="background: rgb(255, 255, 255); border-color: rgb(255, 255, 255); opacity: 0.87; color: rgb(49, 166, 107);">
						<input type="password" id="password" name="password" value="" placeholder="密码" style="color: rgb(49, 166, 107);" class="login-password">
						<em class="login-password-btn login-password-btn-close"></em>
					</div>
	                    	</div>
				<div class="login_org login-combox" >
					<span class="login-combox-name">组织机构</span>
					<div class="login_paras login-combox-content">
						<p>
							<span class="login-combox-value">请选择</span>
							<span class="dropDown-button"></span>
						</p>
					</div>
			        </div>

				<div class="login-button" type="button" value="登录" style="background: rgb(49, 166, 107); opacity: 0.87; color: rgb(255, 255, 255);">登&emsp;录</div>
				</div>

			</div>
    	</div>
		
		<div class='login_sel_vw'>
	   		<ul class="login-combox-list">
	   		</ul>
	   	</div> 

	</body>
</html>
