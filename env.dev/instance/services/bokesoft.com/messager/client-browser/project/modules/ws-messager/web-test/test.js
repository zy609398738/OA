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
		alert(type);
		alert(data);
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
			}, {errorStyle: "notify"});
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

window.testMessagePost = function(){
	var type = "TEXT";
	var sender = $("#boke-test-00X").find("option:selected").val();
	var receiver = $("#boke-test-XXX").find("option:selected").val();
	if(sender==null||sender ==undefined||sender==""){
		alert("请初始化用户");
		return;
	}
	if(receiver==null||receiver ==undefined||receiver==""){
		alert("请选择推送用户");
		return;
	}
	var timestamp =  Date.parse(new Date());
	var senderName = "";
	var receiverName = "";
var data = "这是" + (new Date()) + "推送的信息请点击 " + "[[Action:V01:{\"title\":\"XXX]]\", \"actionData\":\"YYY\", \"_id\":\"ZZZ\"}:ZZZ]](data是YYY),这是第二个[[Action:V01:{\"title\":\"XXX\", \"actionData\":\"[[Action:V01:YYY\", \"_id\":\"ZZZ\"}:ZZZ]](data是[[Action:V01:YYY)";	
	ajax.post(
		IM_SERVER_ADDRESS+"messagePost/open",
		{data:JSON.stringify({type:type,timestamp:timestamp,sender:sender,receiver:receiver,senderName:"",receiverName:"",data:data})}, 
		function(data){
			if(data.success){
				alert("测试成功");
			}
		}, 
		{errorStyle: "notify"}
	);


	
	
	
	
}