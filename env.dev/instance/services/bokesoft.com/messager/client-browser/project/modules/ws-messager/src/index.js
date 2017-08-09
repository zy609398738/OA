"use strict";

require("./ie8-polyfill");

var _ = require("lodash");
var $ = require("jquery");
var json = require("JSON2");

var moment=require("moment");
moment.locale('zh-cn');

var tmplDialog = require("./tmpl/dialog-box.html");
var tmplSessions = require("./tmpl/item-sessions.html");
var tmplBuddies = require("./tmpl/item-buddies.html");
var tmplSearchResult = require("./tmpl/search-result.html");

var defMyselfIcon = require("./tmpl/icons/default-avatar/icon-myself.png");
var defUserIcon = require("./tmpl/icons/default-avatar/icon-user.png");

var stateLaveIcon=require("./tmpl/icons/status/leave.png");
var stateOnlineIcon=require("./tmpl/icons/status/online.png");
var stateOfflineIcon=require("./tmpl/icons/status/offline.png");
var stateLurkIcon=require("./tmpl/icons/status/lurk.png");
var stateBusyIcon=require("./tmpl/icons/status/busy.png");
var stateIconTable = {
		"idle": stateLaveIcon, "online": stateOnlineIcon, "offline": stateOfflineIcon,
		"lurk": stateLurkIcon, "busy": stateBusyIcon
}

require("./tmpl/css/style.css");

var WebSocket = require("../../websocket");

var lightEditor = null;

var webSocketClient = null;
var backendClient = null;
var localDataClient = null;
var uploadHandler = null;
var clientToken = null;

var lastConnectTimestamp = 0;
var inReconnecting = false;

var lastDocumentActiveTime = 0;
//长时间不动，状态处理
$(document).mousemove(function(e){
	lastDocumentActiveTime=(new Date()).getTime();
});

//FIXME 全局变量太乱
var isIdle=false;
var buddyState=null;
var sessionState=null;
var lastBuddy='';

//本地全局变量
var localVars = {
	/** WebSocket 连接状态标识 */
	ws_Ready: false,
	/** WebSocket 当前连接的 Sender */
	ws_Sender: null,
	/** WebSocket 当前连接的 Receiver */
	ws_Receiver: null,
	/** WebSocket 当前连接的 Sender 的名称 */
	ws_SenderName: null,
	/** WebSocket 当前连接的 Receiver 的名称 */
	ws_ReceiverName: null
}

var setInervalIDs = {};	//存放所有 setInterval 返回的 ID, 以便在重复执行 setInterval 之前清除原有程序
var safeSetInterval = function(name, func, timeout){
	if (setInervalIDs[name]){
		clearInterval(setInervalIDs[name]);
	}
	setInervalIDs[name] = setInterval(func, timeout);
}

var doWebSocketConnect = function(fromUser, toUser, fromUserName, toUserName){		
	var wsUrl = globalOptions.webSocketBaseUrl + "/" + clientToken + "/" + fromUser + "/to/" + toUser;
    if (webSocketClient){
    	localVars.ws_Ready = false;
    	webSocketClient.close();
    }
    webSocketClient = WebSocket.create(wsUrl, {
    	onmessage: function(evt){
    		if (evt.data){
    			var msg = json.parse(evt.data);
    			
    			var type = msg.type;
    			if ("BLANK"!=type){		//BLANK 类型的数据不处理
					msg.state=buddyState;
    				localDataClient.pushLocalMessageHistory(msg.sender, msg.sender, msg);
    			}
    			
    			//处理 attachments
    			var attachments = msg.attachments;
    			if (attachments && Array.isArray(attachments)){
    				for(var i=0; i<attachments.length; i++){
    					var attachment = attachments[i];
    					//处理 MyActiveConnectData 类型
    					if (attachment && "MyActiveConnectData"==attachment.dataType){
    						refreshActiveConnectSessions(attachment);
    					}else if ("ReconnectData"==attachment.dataType){
							inReconnecting=true;
							closeMainPanel();
							if(((new Date().getTime())/1000-lastConnectTimestamp/1000)>30){
								doInitMessager();
								inReconnecting=false;
							}
						}
    				}
    			}
				//获取历史信息
				if(attachments.length>0&&attachments[0].dataType=="RecentHistory"&& lastBuddy.indexOf(toUser)<0){
					if (attachments[0].messages && Array.isArray(attachments[0].messages)){
						if((attachments[0].messages).length<1){
							lastBuddy+=toUser;
						}else{
							for(var i=0; i<(attachments[0].messages).length; i++){
								var message = (attachments[0].messages)[i];
								message.state=sessionState;
								localDataClient.pushLocalMessageHistory(msg.sender, msg.sender, message);
								lastBuddy+=toUser;
							}
						}
					}
				}
    		}
    	}
    });
    localVars.ws_Sender = fromUser;
    localVars.ws_Receiver = toUser;
    localVars.ws_SenderName = fromUserName;
    localVars.ws_ReceiverName = toUserName;
    webSocketClient.connect();
    localVars.ws_Ready = true;

    if (toUser != fromUser){	//Self conncection 不算在内
    	localDataClient.rememberSessionConnectingHistory(toUser);
    }
    if (uploadHandler){
        uploadHandler.updateWebSocketClient(webSocketClient);
    }
}
var refreshActiveConnectSessions = function(activeConnectData){
	var $rootElm = globalOptions.$rootElm;
	var $root = $($rootElm);

	var sessions = activeConnectData.sessions;
	
	//显示新消息
	if (activeConnectData.total > 0){
		$root.find(".showMessage").text(activeConnectData.total+"条新消息");
		$root.find(".showMessage").addClass('alerts');
	}else{
		$root.find(".showMessage").text("无新消息");
		$root.find(".showMessage").removeClass('alerts');
	}
	
	//在客户端缓存有消息的用户信息也应该算在 sessions 中
	localDataClient.appendLocalHistorySessions(sessions);

    var compiled = _.template(tmplSessions);
    
    backendClient.fillSessions(sessions, function(sessions){
		var data = {
			defUserIcon: defUserIcon,
			activeUserCode: activeConnectData.currentReceiver||"",
			sessions: sessions,
			moment: moment,
			idle: stateLaveIcon,
			busy: stateBusyIcon,
			printMessage: function(msg){
    			if (msg.type=="TEXT"){
    				return msg.data;
    			}else if (msg.type=="IMAGE"){
    				return "[图像]";
    			}else if (msg.type=="FILE"){
    				return "[文件]";
    			}else{
    				return "[未知类型 '"+msg.type+"']";
    			}
			}
		};
		var html = compiled(data);
		

		var $container = $root.find(".item-sessions");
		$container.find(".chat_item").unbind();
		$container.find(".del_button").unbind();
		$container.html(html);
		$container.find(".chat_item").click(showTalkBox);
		$container.find(".del_button").on('click', {
			activeUserCode: activeConnectData.currentReceiver
		}, function(event){
			var activeUserCode = event.data.activeUserCode;
			localDataClient.removeLocalHistorySessions(activeUserCode);

			var nextItem=$(this).parents(".chat_active").next();
			nextItem.addClass("chat_active");
			$(this).parents(".chat_active").remove();
			if (nextItem.length > 0){
				showTalkBox.call(nextItem);
			}else{
				//消息及编辑/发送区域的初始状态
				resetTalkBox();
				//切换到 self connect 连接模式
				websocketConnect2Self();
			}
		});
		
		patchGrayscale();
	});
}

var showChatList=function(){
    $(this).addClass("select-li").siblings().removeClass("select-li");
    
    var $root = $(globalOptions.$rootElm);
    $root.find(".user-list").hide().eq($('.tab-item').index(this)).show();
}

var _initLightEditor = function(){
	var $root = $(globalOptions.$rootElm);
	
    //初始化表情及文件上传
    uploadHandler = require("./service-upload.js").create({
		webSocketClient: webSocketClient,
		localDataClient: localDataClient,
		localVars: localVars
	});
    lightEditor = require("../../light-editor").build({
		editor: $root.find(".chatTextarea"),
		triggerEmoji: $root.find(".emojiBtn"),
		triggerUpload: $root.find(".uploadBtn"),
		uploadUrl: globalOptions.fileUploadUrl + "?t=" + clientToken,
		uploadCaller: uploadHandler
	});
    localDataClient.setLightEditor(lightEditor);
    //调整表情窗口的显示
    var $emojiContainer = $("#"+lightEditor.emojiInfo.emoji_container_id);
    $emojiContainer.css("top", "-120px");
    $emojiContainer.css("left", "0px");
    $emojiContainer.css("width", "330px");
    $emojiContainer.css("z-index", "11");	//后面的 上传 按钮运行时会设置 z-index=10
    $emojiContainer.find(".emoji_content").css("height", "170px");
}

var showTalkBox=function(){
	var $root = $(globalOptions.$rootElm);
    var $this = $(this);
	if($this.data("bokeMessagerGroupType")=="blacklist"){
		var pop=$root.find(".popTips");
		pop.show();
		setTimeout(function(){pop.hide()}, 1000);
		/*alert("黑名单内用户无法发送消息");*/
		return;
	}
    var nickName=$this.find(".nickname_text .user_name").html();
    var userCode=$this.data("bokeMessagerUser");
    $root.find(".talk-box .head").html(nickName).data("bokeMessagerUser", userCode);
    $this.parents(".chat_list").find(".chat_item").removeClass("chat_active");
    $this.addClass("chat_active");

    $root.find(".chatTextarea")
		.attr("contenteditable", true)
		.unbind()
		.focus()
		.keydown(function(e){
			if ( !e.shiftKey && !e.ctrlKey && (e.which == 13 || e.which == 10) ) {
				sendText();
				e.preventDefault();
			}
	    });
    //每次重置 chatTextarea 后需要重新初始化 LightEditor
    _initLightEditor();
    
    $root.find(".chatSendBtn")
		.unbind()
		.click(sendText);

    //如果是在第二个列表(包含分组的列表)中点击, 那么强制切到第一个列表
    if ($this.parents(".chat_group").html()){
		sessionState=$this.find("span img").data("state");
    	var firstTab = $root.find(".tab-item")[0];
    	showChatList.call(firstTab)
    }
    
    var selfCode = $(this).parents(".chat_list").data("bokeMessagerUser");
    var buddyCode = $(this).data("bokeMessagerUser");
	buddyState=$(this).find(".chat_status img").data("state");
    
    $root.find(globalOptions.$chatContentElm).html("");	//清空消息区域
	//然后重新画历史
    localDataClient.processLocalMessageHistory(buddyCode)
    
    //连接选择的用户
    backendClient.userInfo([selfCode, buddyCode], function(userInfoTable){
    	var selfName = userInfoTable[selfCode].name;
    	var buddyName = userInfoTable[buddyCode].name;
    	doWebSocketConnect(selfCode, buddyCode, selfName, buddyName);
    });
}
var showChatGroup=function() {
	$(this).parents(".chat_group").toggleClass("collapse");  //组的展开与折叠
}

var movedTo=function($root){
    var $main=$root.find(".main");
    var _move=false;
    var _x,_y;
	$main.find(".tab,.talk-box .head").mousedown(function(e){
        _move=true;
        _x=e.screenX-parseInt($main.css("left"));
        _y=e.screenY-parseInt($main.css("top"));
		$main.addClass("moving");   //加一个“移动中...”的标记
    });
    $(document).mousemove(function(e){
        if(_move){
            var x=e.screenX-_x;//移动时根据鼠标位置计算控件左上角的绝对位置
            var y=e.screenY-_y;
            var w_x=$(window).width();
            var w_h=$(window).height();
            var minL=0;
            var maxL=w_x-$main.width()+minL;
            var minT=0;
            var maxT=w_h-$main.height()+minL;
            if(x<minL){
                x=minL;
            }else if(x>maxL){
                x=maxL;
            }
            if(y<minT){
                y=minT;
            }else if(y>maxT){
                y=maxT;
            }
            $main.css({top:y+"px", left:x+"px"});//控件新位置
        }
    }).mouseup(function(){
        _move=false;
		$main.removeClass("moving");
    });
    //$main.draggable({ containment: 'body',scroll: false})
}

var showMainPanel = function(){
	if(inReconnecting){
		return;
	}
	
	var $root = $(globalOptions.$rootElm),
		$main = $root.find(".main");
    $main.css("max-height","590px");
	//计算弹出后应该出现的位置: 靠右靠下
	var left = $(window).width()-$main.width(),
		top = $(window).height()-$main.height();
	top = top < 0 ? 5 : top;
	$main.css({"display":"block",
				"position":"fixed",
				"margin":"0px",
				"left":left+"px",
				"top":$(window).height()+"px"});	//初始位置在窗口下方
	
	$main.show();
	$main.animate({top: top+'px'}, "show");		//动画从右下边沿弹出
	$root.find(".showMessage").hide();			//浮动消息区域隐藏
	
	safeSetInterval("refreshBuddies", function(){refreshBuddies()}, 5*60*1000);
}
var closeMainPanel=function(){
    //切换回 self-self 的连接获取当前连接用户等信息
	if(!inReconnecting){
		websocketConnect2Self();
	}
    var $root = $(globalOptions.$rootElm);
	var $main = $root.find(".main");
    $main.hide();
    $root.find(".showMessage").show();			//浮动消息区域显示
}

var sendText = function(){
	var $root = $(globalOptions.$rootElm);
	var $ta = $root.find(".chatTextarea");
	
	var text = lightEditor.getText();
	if (text) {
		var msg = {
				type: "TEXT", data: text,
				senderName: localVars.ws_SenderName,
				receiverName: localVars.ws_ReceiverName
		}
		webSocketClient.sendText(json.stringify(msg));
		
		msg.sender = localVars.ws_Sender;  //由于这个消息是本地产生的，提交到历史的时候需要加上 sender 属性

		//FIXME: 往 message 中放 state 试图用于本地历史没有任何意义
		var state=$root.find(".chat_active img").data('state');
		msg.state = state;
		localDataClient.pushLocalMessageHistory(localVars.ws_Receiver, localVars.ws_Sender, msg);
	}
	$ta.html("").focus();
}

var beginSendPing = function(){
	safeSetInterval("sendPing", function(){
		if (webSocketClient && localVars.ws_Ready){
			var msg = {type: "BLANK", data: "ping"};
			webSocketClient.sendText(json.stringify(msg));
		}
	}, 5*60*1000);
}

/**
 * 全局属性, 由 doSetupGlobal() 方法进行设置;
 * 包括如下选项
 *   - $rootElm 整个 Messager 显示的 root HTML 元素, 必填(支持 DOM 对象、jQuery 对象、以及 jQuery selector);
 *   - serviceBaseUrl Messager 需要的一组后台的服务的 baseUrl, 必填;
 *   - servicePostfix 服务 URL 的后缀, 必填, 不同的系统可能使用不同的后缀, 比如 .action、.jsp、.do、.aspx、.php 等等;
 *   - wsServerAddr Messager 服务器的 IP， 默认为 location.hostname
 *   - wsServerPort Messager 服务器的 WebSocket 端口, 默认为 7778
 *   - wsFlashPolicyPort Messager 服务器的 FlashPolicyFile 端口(为了可以使用 Flash WebSocket 客户端), 默认为 7843
 *   - pageBuddiesManager 主应用的 "好友管理" Web 页面, 用于 IM 和 主应用 之间的界面集成, 默认为空
 *   - hostCallback 用于让业务系统注入响应回调的 function，参数为：
 *        - type: 字符串; 目前只支持 HOST_ACTION - 业务系统自定义操作;
 *        - data: 字符串; 与具体 type 相关的数据，对于 HOST_ACTION, 此数据即为 actionData;
 *        - globalOptions: 目前 IM 系统中的”全局属性“对象; 
 */
var globalOptions = {};
/**
 * 设置 Messager 的全局属性
 * @param 选项名称参见 globalOptions 变量
 */
var doSetupGlobal = function(options){
	globalOptions = {
		$rootElm: options.$rootElm,
		
		serviceBaseUrl: options.serviceBaseUrl,
		servicePostfix: options.servicePostfix,
		
		wsServerAddr: options.wsServerAddr || location.hostname,
		wsServerPort: options.wsServerPort || 7778,
		wsFlashPolicyPort: options.wsFlashPolicyPort || 7843,
		
		pageBuddiesManager: options.pageBuddiesManager,
		
		hostCallback: options.hostCallback
	};
	
	/** 一些会跟随 ws* 变化的选项 */
	//WebSocket 服务的 baseUrl: `"ws://${wsServerAddr}:${wsServerPort}/boke-messager/messager"`
	// * 实际请求的 url 会在其后面加上 "/当前用户/to/聊天对象";
	globalOptions.webSocketBaseUrl = "ws://"+globalOptions.wsServerAddr+":"+globalOptions.wsServerPort+"/boke-messager/messager";
	//FlashPolicyFile 使用的 URL: `"xmlsocket://${wsServerAddr}:${wsFlashPolicyPort}"`
	globalOptions.flashPolicyFile = "xmlsocket://"+globalOptions.wsServerAddr+":"+globalOptions.wsFlashPolicyPort;
	//文件上传地址：`"http://${wsServerAddr}:${wsServerPort}/boke-messager/upload/"`,
	// * 这个地址使用 POST 方式访问时用于上传文件, 使用 GET 方式访问时用于下载上传的文件;
	globalOptions.fileUploadUrl = "http://"+globalOptions.wsServerAddr+":"+globalOptions.wsServerPort+"/boke-messager/upload/";
	//读写用户状态的 URL(注意始终跟谁 Messager 服务器地址变化)
	globalOptions.userStateUrl = "http://"+globalOptions.wsServerAddr+":"+globalOptions.wsServerPort+"/boke-messager/state/";
	//查询历史消息的 URL(注意始终跟谁 Messager 服务器地址变化)
	globalOptions.queryHistoryUrl = "http://"+globalOptions.wsServerAddr+":"+globalOptions.wsServerPort+"/boke-messager/history/";
	
	/** 一些内部私有的配置项 */
	globalOptions.$chatContentElm = ".talk-box .chatContent";	//显示消息历史的 HTML 元素, service-localdata.js 中也使用到了
	
	WebSocket.loadFlashPolicyFile(globalOptions.flashPolicyFile);
	
	var backendOpts = $.extend({}, globalOptions);
	backendClient = require("./service-backend.js").create(backendOpts);
	
	var localDataOpts = $.extend({}, globalOptions);
	localDataOpts.backendClient = backendClient;
	localDataOpts.defUserIcon = defUserIcon;
	localDataOpts.fileUploadUrl = globalOptions.fileUploadUrl;	//文件上传的地址同样作为文件的下载地址
	localDataClient = require("./service-localdata.js").create(localDataOpts);
}
/**
 * 在指定的 DOM 元素内创建 Messager
 */
var doInitMessager = function(){
    localDataClient.reset();
	
	var $rootElm = globalOptions.$rootElm;
    var compiled = _.template(tmplDialog);
    
    var initWithUser = function(userInfo){
		localDataClient.rememberUserInfo(userInfo);

		clientToken = userInfo.userToken;

		userInfo.userIcon = userInfo.userIcon || defMyselfIcon;
		userInfo.states = stateIconTable;
		userInfo.pageBuddiesManager = globalOptions.pageBuddiesManager;
		var html = compiled(userInfo);

	    var $root = $($rootElm);
	    $root.html(html);
	    movedTo($root);

	    $root.find(".tab-item").click(showChatList);
	    $root.find('.close-btn').click(closeMainPanel);
	    $root.find(".showMessage").click(showMainPanel);
		$root.find(globalOptions.$chatContentElm).click(function(e){			
			if ($(e.target).data("bkimAction")){
				var actionData = $(e.target).data("bkimAction");
				globalOptions.hostCallback("HOST_ACTION", actionData, globalOptions);
			}
		});
	    
	    //启动的时候就需要初始化一次 LightEditor
	    _initLightEditor();
	    
	    //好友搜索
		$root.find(".search-in-panel-buddies .web_wechat_search").click(refreshBuddies);
		$root.find(".search-in-panel-buddies .frm_search").keypress(function(event){
			var keycode = (event.keyCode ? event.keyCode : event.which);
			if(keycode == '13'){
				refreshBuddies();
			}
		});
		refreshBuddies();
		
		//消息搜索
		$root.find(".search-in-panel-sessions .web_wechat_search").click(function(event){
			event.stopPropagation();
			searchMessages(userInfo.userCode);
		});
		$root.find(".search-in-panel-sessions .frm_search").keypress(function(event){
			var keycode = (event.keyCode ? event.keyCode : event.which);
			if(keycode == '13'){
				event.stopPropagation();
				searchMessages(userInfo.userCode);
			}
		});
		
		//新增对话
		$root.find(".search-in-panel-sessions .add-session").click(addNewSession);
		
		var userCode=userInfo.userCode;
		$root.find(".state_combobox").change(
		    function(){
				var state=$root.find(".state_combobox").val();
				updateUserState(userCode, state, function(data){
					$root.find(".avatar .status img").attr('src', stateIconTable[state]);
					$root.find(".pop-box.user-state-panel .state_img").attr('src', stateIconTable[state]);
		        })	
			}
		);
		safeSetInterval("autoUpdateUserState", function(){
			var curTime=(new Date()).getTime();
			if((curTime-lastDocumentActiveTime)>5*60*1000){	//默认离开，五分钟
				if ("online" == $root.find(".state_combobox").val()){	//只有 online 会变为 idle, 隐身和忙碌状态不会自动变为 idle
					updateUserState(userCode, "idle", function(data){
						if(data.success){
							isIdle=true;
							$root.find(".state_combobox").val('idle');
							$root.find(".avatar .status img").attr('src', stateLaveIcon);
							$root.find(".pop-box.user-state-panel .state_img").attr('src', stateLaveIcon);
						}
					})
				}
			}else{
				if(isIdle && $root.find(".state_combobox").val()=='idle'){
					updateUserState(userCode, "online", function(data){
						if(data.success){
							isIdle=false;
							$root.find(".state_combobox").val('online');
							$root.find(".avatar .status img").attr('src', stateOnlineIcon);
							$root.find(".pop-box.user-state-panel .state_img").attr('src', stateOnlineIcon);
						}
					})
				}
			}
		},10*1000);

		//消息及编辑/发送区域的初始状态
		resetTalkBox();

	    //首先通过一个 self-self 的连接获取当前连接用户等信息
		websocketConnect2Self();
	    //开始 ping
	    setTimeout(function(){
	    	beginSendPing();
	    }, 10*1000);

		//点击头像弹出个人信息
		$root.find(".avatar").click(function(event){
			event.stopPropagation();
			
			$root.find(".pop-box").hide();
			$root.find(".pop-box.user-state-panel").show();
		});
		
		//用于关闭 pop-box 弹出层的一些事件处理
		$(document).click(function(){
			$root.find(".pop-box").hide();
		});
		$(document).keyup(function(event){
			var keycode = (event.keyCode ? event.keyCode : event.which);
			if(keycode == '27'){
				$root.find(".pop-box").hide();
			}
		});
    }
	
	var _initWithTestSupport = function(data){
		if(window.BKIM_TEST_USERCODE){
			initWithUser({
				userCode: window.BKIM_TEST_USERCODE,
				userName: window.BKIM_TEST_USERNAME,
				userIcon: "",
				userToken: window.BKIM_TEST_TOKEN
			});
		}else{
			initWithUser(data);
		}
	}
	backendClient.serviceIdentity(function(data){
		_initWithTestSupport(data);
	});
	lastConnectTimestamp=(new Date()).getTime();
}

/**
 * 第一次连接是自己发给自己的, 其目的是获取在线用户的信息
 */
var websocketConnect2Self = function(){
	var $rootElm = globalOptions.$rootElm;

    var selfCode = $($rootElm).find(".main").data("bokeMessagerUser");
	doWebSocketConnect(selfCode, selfCode, null, null);  
}

var resetTalkBox = function(){
	var $root = $(globalOptions.$rootElm);
    //消息及编辑/发送区域的初始状态
    $root.find(".talk-box .head").html("(没有对话)");
    $root.find(".chatTextarea").attr("contenteditable", false).unbind();
    $root.find(".chatSendBtn").unbind();
    //清除消息显示区域
	localDataClient.cleanHistoryArea();
}

var refreshBuddies = function(){
	var $rootElm = globalOptions.$rootElm;

    var compiled = _.template(tmplBuddies);
	
	var buddies2Search = $($rootElm).find(".search-in-panel-buddies .frm_search").val();
	buddies2Search = (buddies2Search||"").toUpperCase();	//搜索的时候不需要区分大小写
    
    backendClient.serviceBuddies(function(data){
		//根据搜索条件过滤，同时准备用于查找用户状态的条件
    	var foundGroups = [];
    	var userCodes = [];
		for (var i=0; i<data.length; i++){
	    	var group = data[i];
	    	var users = group.users;
	    	var foundUsers = [];
	    	if (users){
		    	for (var j=0; j<users.length; j++){
		    		var user = users[j];
		    		var _code = (user.code||"").toUpperCase();
		    		var _name = (user.name||"").toUpperCase();
					if( _code.indexOf(buddies2Search)>=0 || _name.indexOf(buddies2Search)>=0 ){
						foundUsers.push(user);
			    		userCodes.push(user.code);
					}
		    	}
	    	}
	    	if (foundUsers.length > 0){
	    		group.users = foundUsers;
	    		foundGroups.push(group);
	    	}
	    }
		//根据返回数据，查询对应状态
		queryUserStates(userCodes, function(userData){
			var userStates = {};	//使用 user code 为 key 保存对应的 state
			for(var key in userData){
				userStates[key] = userData[key];
			}
			var html = compiled({
				curUserCode: localVars.ws_Sender||"",	//当前 websocket 连接的用户
				userStates: userStates,
				groups: foundGroups,
				defUserIcon: defUserIcon,
				idle: stateLaveIcon,
				busy: stateBusyIcon,
				getState: function(stateTable, userCode){
    				var state = stateTable[userCode];
    				if (! state){
    					state = "offline";	//默认 state 为 offline
    				}
    				return state;
    			}
		    });
			var $root = $($rootElm);
			var $container = $root.find(".item-buddies");
			$container.find(".chat_item").unbind();
			$container.find('.chat_head').unbind();
			$container.html(html);
			$container.find(".chat_item").click(showTalkBox);
			$container.find('.chat_head').click(showChatGroup);
			
			patchGrayscale();
		});	
    });
}

var searchMessages = function(curUserCode){
	var $root = $(globalOptions.$rootElm);
	var toSearch = $root.find(".search-in-panel-sessions .frm_search").val();
	
	$root.find(".pop-box").hide();
	if (toSearch && toSearch.replace(/^\s+|\s+$/g, '')/*Trim*/ ){
		var $panel = $root.find(".search-in-panel-sessions .pop-box.search-sessions-result");
		$panel.unbind().click(function(event){
			event.stopPropagation();	//避免点击后关闭当前面板
		});
		
		var queryData = {
				self: curUserCode,
				from: (new Date()).getTime(),
				keywords: toSearch
		};
		var talkingUserCode = $root.find(".talk-box .head").data("bokeMessagerUser");
		if (talkingUserCode){
			queryData.other = talkingUserCode;
		}
		
		var $result = $panel.find(".search-result");
		$result.html("正在搜索 ...")
		
		var $pager = $panel.find(".search-pager");
		$pager.hide();
		
		$panel.find(".search-path span.title code").text(toSearch);
		
		var $pathCurr = $panel.find(".search-path a.current-user");
		$pathCurr.unbind().click(function(){
			if ($(this).hasClass("disabled")){
				return;
			}
			
			queryData.from = (new Date()).getTime();
			queryData.focus = null;
			queryData.keywords = toSearch;
			queryData.other = talkingUserCode;
			
			queryHistory(queryData, $panel, $result, $pager);
		});
		if (! talkingUserCode){	//如果当前没有交谈对象, 那么就不需要 “当前对话” 切换链接
			$pathCurr.hide();
			$pathCurr.next().hide();
		}else{
			$pathCurr.show();
			$pathCurr.next().show();
		}
		
		var $pathAll = $panel.find(".search-path a.all-users");
		$pathAll.unbind().click(function(){
			if ($(this).hasClass("disabled")){
				return;
			}

			queryData.from = (new Date()).getTime();
			queryData.focus = null;
			queryData.keywords = toSearch;
			queryData.other = null;

			queryHistory(queryData, $panel, $result, $pager);
		});
		
		$panel.show();
		
		queryHistory(queryData, $panel, $result, $pager);
	}
}

var queryHistory = function(queryData, $panel, $result, $pager){
	var ajax = require("boke-cms-ajax");
    ajax.post(globalOptions.queryHistoryUrl, {t: clientToken, data: json.stringify(queryData)}, function(data){
    	console.log(data);
    	var startTime = data.startTimestamp;
    	var endTime = data.endTimestamp;
    	var limits = data.limits;
    	var prevPageTimestamp = data.prevPageTimestamp;

    	//渲染历史消息列表
    	var msgs = data.messages;
    	var compiled = _.template(tmplSearchResult);
    	var html = compiled({
    		moment: moment,
    		messages: msgs,
    		self: queryData.self,
    		printMessage: function(msg){
    			if (msg.type=="TEXT"){
    				return msg.data;
    			}else if (msg.type=="IMAGE" || msg.type=="FILE"){
    				var url = globalOptions.fileUploadUrl + msg.data.fileUrl + "?t=" + clientToken;
    				var html = 
    					$("<a/>").attr("target", "_blank").attr("href", url).text(msg.data.fileName)[0].outerHTML;
    				return html;
    			}else{
    				return msg.data;
    			}
    		}
    	});
    	$result.html(html);
    	//定位到 focus 的那条记录
    	var focusTs = queryData.focus;
    	if (focusTs){
    		var focusOffset = -1;
    		$result.find(".history_item").each(function(){
    			if (focusTs == $(this).data("timestamp")){
    				$(this).addClass("focused_history_item");
    				focusOffset = $(this).position().top-$(this).height();
    			}
    		});
    		if (focusOffset && focusOffset>0){
    			$result.find(".message_history").scrollTop(focusOffset - $result.find(".message_history").height()/2);
    		}
    	}
    	
    	//点击历史中的某一项, 实现以该项开始的历史查询
    	$result.find(".history_item").click(function(event){
    		if (! queryData.keywords){
    			return;		//不存在 keywords 说明已经在 “对话历史” 显示中, 此时点击不应该有反应
    		}
    		
    		var timestamp = $(this).data("timestamp");
    		var sender = $(this).data("sender");
    		var receiver = $(this).data("receiver");
    		
			queryData.focus = timestamp;
			queryData.keywords = null;
			queryData.other = (sender==queryData.self)?receiver:sender;

			queryHistory(queryData, $panel, $result, $pager);
    	});
    	
    	//点击交谈对象, 实现跳转到相应的聊天界面
    	$result.find(".history_item .session code").click(function(event){
    		event.stopPropagation();
    		var userCode = $(this).data("userCode");
    		if (userCode){
    			$panel.hide();
    			popupWithUserCode(userCode);
    		}
    	});
    	
    	var $prev = $pager.find(".prev");
    	$prev.text("<< "+(new Date(startTime)).toLocaleString()).unbind();
    	var $next = $pager.find(".next");
    	$next.text((new Date(endTime)).toLocaleString()+" >>").unbind();
    	if (prevPageTimestamp <= 0){	//已翻到最前面一页
    		$prev.addClass("disabled").click(function(event){/*Do nothing*/});
    	}else{
    		$prev.removeClass("disabled");
    		$prev.click(function(){
    			//向前(更晚的数据)查询
    			queryData.from = prevPageTimestamp;
    			queryData.focus = null;
    			queryHistory(queryData, $panel, $result, $pager);
    		});
    	}
    	if (! data.hasMore){	//后台返回的数据通过 hasMore 属性通知是否还有更多数据
    		$next.addClass("disabled").click(function(event){/*Do nothing*/});
    	}else{
    		$next.removeClass("disabled");
    		$next.click(function(){
        		//向后(更早的数据)查询
    			queryData.from = endTime;
    			queryData.focus = null;
    			queryHistory(queryData, $panel, $result, $pager);
    		});
    	}

    	if (startTime && endTime){ //判断是否查询到数据
        	$pager.show();
    	}
    	
    	if (queryData.keywords){	//判断是否是点击某个历史消息后的“对话历史”
    		//在按照 keywords 查询的状态
    		$panel.find(".search-path span.in-session").hide();
    		if (queryData.other){
    			//指定交谈对象查询, 此时 “当前对话” 不可用
    			$panel.find(".search-path a.current-user").addClass("disabled");
    			$panel.find(".search-path a.all-users").removeClass("disabled");
    		}else{
    			//不指定交谈对象查询, 此时 “全部对话” 不可用
    			$panel.find(".search-path a.current-user").removeClass("disabled");
    			$panel.find(".search-path a.all-users").addClass("disabled");
    		}
    	}else{
    		//在 “对话历史” 状态
    		$panel.find(".search-path span.in-session").show();
    		//此时 “当前对话”/“全部对话” 都是可用(但是, “当前对话”可能一直是隐藏状态)
			$panel.find(".search-path a.current-user").removeClass("disabled");
			$panel.find(".search-path a.all-users").removeClass("disabled");
    	}

    }, {errorStyle: "notify"});
}

var addNewSession = function(event){
	event.stopPropagation();

	var $root = $(globalOptions.$rootElm);
	var $panel = $root.find(".search-in-panel-sessions .pop-box.add-session-panel");
	
	$root.find(".pop-box").hide();
	
	$panel.find(".error").text("").hide();
	$panel.unbind().click(function(event){
		event.stopPropagation();
	}).show();
	$panel.find(".user-code").focus();
	
	$panel.find(".buttons a").unbind().click(function(events){
		doAddNewSession($panel);
	});
	$panel.find(".user-code").unbind().keypress(function(event){
		var keycode = (event.keyCode ? event.keyCode : event.which);
		if(keycode == '13'){
			doAddNewSession($panel);
		}
	});
}
var doAddNewSession = function($panel){
	var userCode = $panel.find(".user-code").val();
	userCode = userCode.replace(/^\s+|\s+$/g, ''); /*Trim*/
	if (! userCode){
		return;
	}
	
	backendClient.userInfo([userCode], function(userInfoTable){
		if (userInfoTable[userCode]){
			$panel.hide();
			popupWithUserCode(userCode);
		}else{
			$panel.find(".error").text("用户编号 '"+userCode+"' 无效").show();
		}
    });
}

/**
 * 弹出聊天界面并选中指定的用户
 */
var popupWithUserCode = function(userCode){
    showMainPanel();
	refreshActiveConnectSessions({
		total: 0,
		currentReceiver: userCode,
		sessions: [{
			code: userCode,
			type: "CONNECTED",
			count: 0
		}]
	});
	setTimeout(function(){
		var $root = $(globalOptions.$rootElm);
		//如果不使用 setTimeout, chatItem 似乎找不到
		var chatItem = $root.find(".main .item-sessions .chat_active")[0];
		$(chatItem).data("bokeMessagerUser", userCode);
		showTalkBox.call(chatItem);
	}, 300);
}

/**
 * 浏览器高度变化时
 */
var resetHeight = function () {
	var $main = $(globalOptions.$rootElm).find(".main");
	
	if ($main.length<=0) return;	//还不存在 .main 元素 ...
	
	var winH = $(window).height(),
		mainH = $main.height()+$main.position().top;
	if(winH < mainH || winH < 590){
		$main.height("90%").css("top","5px");
	}
	else {
		$main.height("590px");
	}
}

$(window).resize(resetHeight);
 
/**
 * 设置用户状态
 */
var updateUserState = function(userCode, state, callback){
	var stateData = {};
	stateData[userCode] = state;
	
	var ajax = require("boke-cms-ajax");
    ajax.post(globalOptions.userStateUrl, {t: clientToken, data: json.stringify(stateData)}, function(data){
    	callback(data);
    }, {errorStyle: "notify"});
}
 
/**
 * 多用户状态查询
 * @param userCodes userCode 数组 
 */
var queryUserStates = function(userCodes, callback){
	if (userCodes.length<=0){
		return 
	}
	var url = globalOptions.userStateUrl+"?t="+clientToken;
	var ajax = require("boke-cms-ajax");
    ajax.post(url, {u:userCodes}, function(data){
    	callback(data);
    }, {errorStyle: "notify"});
}

/**
 * 解决 IE 10 以上不支持图像变灰的问题
 */
var patchGrayscale = function($selector){
	if (window.clipboardData && !!window.matchMedia){
		var $root = $(globalOptions.$rootElm);
		//IE10 or greater
		//REF: http://stackoverflow.com/questions/9900311/how-do-i-target-only-internet-explorer-10-for-certain-situations-like-internet-e
		$root.find("img.userhead_gray_mask").each(function(){
			var imgObj = $(this).get()[0];
			
			var canvas = document.createElement('canvas');
			var canvasContext = canvas.getContext('2d');
			
			var imgW = imgObj.naturalWidth;
			var imgH = imgObj.naturalHeight;
			canvas.width = imgW;
			canvas.height = imgH;
			
			canvasContext.drawImage(imgObj, 0, 0);
			var imgPixels = canvasContext.getImageData(0, 0, imgW, imgH);
			
			for (var y = 0; y < imgPixels.height; y++) {
			    for (var x = 0; x < imgPixels.width; x++) {
				    var i = (y * 4) * imgPixels.width + x * 4;
				    var avg = (imgPixels.data[i] + imgPixels.data[i + 1] + imgPixels.data[i + 2]) / 3;
				    imgPixels.data[i] = avg;
				    imgPixels.data[i + 1] = avg;
				    imgPixels.data[i + 2] = avg;
			    }
			}
			canvasContext.putImageData(imgPixels, 0, 0, 0, 0, imgPixels.width, imgPixels.height);
			imgObj.src = canvas.toDataURL();
		});
	}
}

/** Define the export point for module */
module.exports = {
	setupGlobal: doSetupGlobal,
    initMessager: doInitMessager,
    popupWithUserCode: popupWithUserCode
}
