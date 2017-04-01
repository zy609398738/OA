"use strict";

var im = require("../../modules/ws-messager");

/**
 * 设置 IM 的全局属性, 参数为包含各种属性的 json 对象;
 *  - $rootElm: 用于容纳 IM 组件的 HTML 元素 selector, 默认 '#im-box.bokesoft-messager'
 *  - serviceBaseUrl: 用于连接主系统 /identity、/userinfo、/buddies 等 "backend" 服务的基础 URL, 默认值 '/im-service'
 *  - servicePostfix: 用于连接主系统 /identity、/userinfo、/buddies 等 "backend" 服务的 URL 后缀, 默认值 '.action'
 * 其他可选设置参考 `modules/ws-messager/src/index.js` 中变量 `globalOptions`.
 */
window.IM_SetupGlobal = function(options){
	if (! options){
		options = {};
	}
	options.$rootElm = options.$rootElm || "#im-box.bokesoft-messager";
	options.serviceBaseUrl = options.serviceBaseUrl || "/im-service";
	options.servicePostfix = options.servicePostfix || ".action";
	
	im.setupGlobal(options);
}

window.IM_SetupMessager = function(){
	im.initMessager();
}

window.IM_PopupWithUserCode = function(userCode){
	im.popupWithUserCode(userCode);
}
