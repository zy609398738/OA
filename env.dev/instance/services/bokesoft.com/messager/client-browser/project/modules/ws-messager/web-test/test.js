var IM_SERVER_ADDRESS = "http://"+location.hostname+":7778/boke-messager/";

var ajax = require("boke-cms-ajax");
var $ = require("jquery");
var im = require("..");

im.setupGlobal({
	$rootElm: "#box.bokesoft-messager",
	serviceBaseUrl: "/im-service",
	servicePostfix: ".json",
	pageBuddiesManager: "./",//管理好友的页面地址, 仅供测试
	hostCallback: function(type, data, globalOptions){
		alert("执行操作: type='"+type+"', data='"+data+"'");
	}
});

$(document).ready(function(){
	/**
	 * 用于测试"初始化Messager"的一些特殊处理:
	 *  1. "(不指定)"的情况下, 系统执行执行的是正常的初始化流程, 将从服务器端(node test-server.js)得到 identity 信息;
	 *     —— 实际上 test-server.js 永远会返回对应测试用户 "boke-test-001" 的 identity 信息;
	 *  2. 如果选择了具体需要初始化的用户, 那么将基于系统对 window.BKIM_TEST_* 的支持, 直接走测试的流程.
	 */
	$(document).find("select#boke-test-00X").change(function(){
		if ($(this).val()){
			var _uCode = $(this).val();
			var _token = (new Date()).getTime() + ":" + _uCode;
			
			window.BKIM_TEST_USERCODE = _uCode;
			window.BKIM_TEST_USERNAME = $(this).find("option:selected").text();
			window.BKIM_TEST_TOKEN = _token;
			
			var loginData = {
					token: _token,
					userCode: _uCode,
					option: "login"
			};
			ajax.post(IM_SERVER_ADDRESS+"session/open", {data:JSON.stringify(loginData)}, 
				function(data){
					if(data.success){
						$(document).find("input#boke-test-tokenX").val(window.BKIM_TEST_TOKEN);
					}
				}, {errorStyle: "notify"}
			);
		}else{
			//如果选择第一项 "(不指定)", 那么从服务器端获得 identity 信息, 所以这 3 个测试用的全局变量全部需要清空
			window.BKIM_TEST_USERCODE = null;
			window.BKIM_TEST_USERNAME = null;
			window.BKIM_TEST_TOKEN = null;
			
			$(document).find("input#boke-test-tokenX").val("");
		}
	});
});

window.testSetupMessager = function(){
	im.initMessager();
};

window.testPopupWithUserCode = function(){
	im.popupWithUserCode("boke-test-002");
};

window.testClearToken = function(){
	var $tokenTxt = $(document).find("input#boke-test-tokenX");
	var logoutData = {token: $tokenTxt.val(), option: "logout"};
	
	ajax.post(IM_SERVER_ADDRESS+"session/close", {data:JSON.stringify(logoutData)}, 
		function(data){
			if(data.success){
				$tokenTxt.val("");
			}
		}, {errorStyle: "notify"}
	);
};

window.testUpdateBlacklist = function(index){
	var b1 = $(document).find("select#boke-test-1X"+index).val(),
		b2 = $(document).find("select#boke-test-2X"+index).val(),
		userCode = $(document).find("select#boke-test-0X"+index).val(),
		blist = [],
		blacklist = {};
	
	if(userCode==""){
		alert("请选择对应行的UserCode");
	}else{
		b1==""|| blist.push(b1);
		b2==""|| blist.push(b2);
		blacklist[userCode] = blist;
		ajax.post(IM_SERVER_ADDRESS+"blacklist/add", {data:JSON.stringify({blacklist: blacklist, overwrite: false})}, 
			function(data){
				if(data.success){
					alert("黑名单更新成功");
				}
			}, {errorStyle: "notify"}
		);
	}
};
window.testOverwriteBlacklist = function(){
	var b1 = $(document).find("select#boke-test-1X0").val(),
		b2 = $(document).find("select#boke-test-2X0").val(),
		b11 = $(document).find("select#boke-test-1X1").val(),
		b12 = $(document).find("select#boke-test-2X1").val(),
		userCode1 = $(document).find("select#boke-test-0X0").val(),
		userCode2 = $(document).find("select#boke-test-0X1").val(),
		blist1 = [],
		blist2 = [],
		blacklist = {};
	b1==""|| blist1.push(b1);
	b2==""|| blist1.push(b2);
	b11==""|| blist2.push(b11);
	b12==""|| blist2.push(b12);
	userCode1==""|| (blacklist[userCode1] = blist1);
	userCode2==""|| (blacklist[userCode2] = blist2);
	ajax.post(
		IM_SERVER_ADDRESS+"blacklist/reload",
		{data:JSON.stringify({blacklist: blacklist, overwrite: true})}, 
		function(data){
			if(data.success){
				alert("黑名单覆写成功");
			}
		}, 
		{errorStyle: "notify"}
	);
};

var _post = function(msg, successCallback){
	var type = "TEXT";
	var sender = $("#boke-test-sender").find("option:selected").val();
	if(sender==null||sender ==undefined||sender==""){
		alert("请选择发送方");
		return;
	}
	var receiver = $("#boke-test-receiver").find("option:selected").val();
	if(receiver==null||receiver ==undefined||receiver==""){
		alert("请选择接收方");
		return;
	}
	var timestamp =  Date.parse(new Date());
	var senderName = "";
	var receiverName = "";
    var data = msg;	
	ajax.post(
		IM_SERVER_ADDRESS+"messagePost/open", {
			data:JSON.stringify({
				type: type,
				timestamp: timestamp,
				sender: sender,
				receiver: receiver,
				senderName: "No-Sender-Name",
				receiverName: "No-Receiver-Name",
				data:data
			})
		},
		function(data){
			if(data.success){
				successCallback(data);
			}
		}
	);	
}
window.testMessagePost = function(){
	var now = new Date();
    var msg = '这是 ' + now + ' 推送的信息; 推送者 😊[[bokesoft.com]]😊.';
    _post(msg, function(data){
    	alert("消息推送完成");
    });
}
window.testMessagePostWithAction = function(){
	var now = new Date();
    var msg = '这是 😊[[Action:V01:{"title": "😄' + now + '😄", "actionData": "'+now.getTime()+'", "_id":"001"}:001]] 推送的信息; '
             + '推送者 [[Action:V01:{"title": "😥[[bokesoft.com]]😥", "actionData": "http://www.bokesoft.com", "_id":"BOKESOFT"}:BOKESOFT]].';
    _post(msg, function(data){
    	alert("消息推送完成");
    });
}
window.testMessagePost300 = function(){
	var now = new Date();
	var messages = [
	    "分布式 NewSQL 数据库 TiDB",
	    "开源数据库 AliSQL",
	    "轻型的关系数据库管理系统 SQLite",
	    "MySQL 分支 MariaDB",
	    "数据库服务器 PostgreSQL",
	    "MySQL衍生版 Percona Server",
	    "淘宝分布式数据库 OceanBase",
	    "商业数据库 Informix",
	    "数据库服务器 MySQL",
	    "内存数据库系统 FastDB",
	    "移动数据库 Realm",
	    "基于内存的数据库系统 VoltDB",
	    "Google MySQL",
	    "嵌入式数据库 HSQLDB",
	    "数据库 EnterpriseDB",
	    "集群数据库系统 Postgres-XL",
	    "基于 PostgreSQL 的集群数据库 CitusDB",
	    "JavaScript数据库 Taffy DB",
	    "MySQL衍生数据库 MepSQL",
	    "关系型数据库 PipelineDB"
	];
	
	var count = 0;
	var _send = function(){
	    count ++;
		var index = parseInt(Math.random()*messages.length);
	    var msg = count + ": ["+now+"] " + messages[index];
	    _post(msg, function(data){
	    	if (count < 300){
	    		setTimeout(_send, 100);	    		
	    	}else{
	    		alert(count + "条消息推送完成");
	    	}
	    });
	}
	
	_send();
}
