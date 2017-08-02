"use strict";

/**
 * Detect "publicPath" dynamiclly
 */
__webpack_public_path__ = require("webpack-public-path-fix").detect("/bokesoft-messager/dist/");

var im = require("../../modules/ws-messager");

/**
 * 设置 IM 的全局属性, 参数为包含各种属性的 json 对象;
 *  - $rootElm: 用于容纳 IM 组件的 HTML 元素 selector, 默认 '#im-box.bokesoft-messager'
 *  - serviceBaseUrl: 用于连接主系统 /identity、/userinfo、/buddies 等 "backend" 服务的基础 URL, 默认值 '/im-service'
 *  - servicePostfix: 用于连接主系统 /identity、/userinfo、/buddies 等 "backend" 服务的 URL 后缀, 默认值 '.action'
 *  - wsServerAddr Messager 服务器的 IP， 默认为 location.hostname
 *  - wsServerPort Messager 服务器的 WebSocket 端口, 默认为 7778
 *  - wsFlashPolicyPort Messager 服务器的 FlashPolicyFile 端口(为了可以使用 Flash WebSocket 客户端), 默认为 7843
 *  - pageBuddiesManager 主应用的 "好友管理" Web 页面, 用于 IM 和 主应用 之间的界面集成, 默认为空
 *  - hostCallback 用于让业务系统注入响应回调的 function，参数为：
 *        - type: 字符串; 目前只支持 HOST_ACTION - 业务系统自定义操作;
 *        - data: 字符串; 与具体 type 相关的数据，对于 HOST_ACTION, 此数据即为 actionData;
 *        - globalOptions: 目前 IM 系统中的”全局属性“对象; 
 * 其他可选设置参考 `modules/ws-messager/src/index.js` 中变量 `globalOptions`.
 */
window.IM_SetupGlobal = function(options){
	if (! options){
		options = {};
	}
	options.$rootElm = options.$rootElm || "#im-box.bokesoft-messager";
	options.serviceBaseUrl = options.serviceBaseUrl || "/im-service";
	options.servicePostfix = options.servicePostfix || ".action";
	options.wsServerAddr = options.wsServerAddr;
	options.wsServerPort = options.wsServerPort;
	options.wsFlashPolicyPort = options.wsFlashPolicyPort;	
	options.pageBuddiesManager = options.pageBuddiesManager;
	options.hostCallback = options.hostCallback;
	
	im.setupGlobal(options);
}

window.IM_SetupMessager = function(){
	im.initMessager();
}

window.IM_PopupWithUserCode = function(userCode){
	im.popupWithUserCode(userCode);
}
