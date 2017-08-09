"use strict";

var $ = require("jquery");
var _ = require("lodash");

var fileTypes = require("../../file-types");
var ActionData = require("../../action-data");

/**
 * 创建本地数据(消息历史)的处理对象
 */
var LocalDataClient = function(options){
	/**
	 * 用于缓存每个用户 收/发 的消息, 以便绘制会话历史;
	 * 结构为：{
	 *     userXXX: [	//消息是按照对方的 userCode 存储的
	 *         sender: "XXXX",	    	//消息发送方, 标识是发送的消息还是收到的消息
	 *         type: "TEXT",			//消息类型
	 *                                  // * TEXT: 为正常的文本消息(实际上支持一定的 HTML 格式)
	 *                                  // * IMAGE: 图片, 此时消息文本为图片的相对 URL 路径
	 *                                  // * FILE: 文件, 此时消息文本为图片的相对 URL 路径
	 *         data: "XXXXXXX",		    //消息数据, 不同类型的消息此字段数据结构不同
	 *            - TEXT 消息 - 此字段为消息的 HTML 文本
	 *            - IMAGE/FILE 消息 - 字段结构如下:
	 *             - uploadingId: "XXXX",     //唯一的,代表一次上传过程的 ID
	 *             - uploadPercent: 99,       //上传的进度(0-100), 在上传完成后这个数值会变为 -1;
	 *             - fileName: "XXXXXX",      //消息内容的文件名
	 *             - fileUrl: "XXXXXXX",      //消息内容的下载地址
	 *         rendered: true|false,    //消息是否已经显示在界面上
	 *         invalid: true|false      //消息是否已经失效, 失效的消息永远不会显示出来
	 *     ],
	 *     userYYY: [...],
	 *     ...
	 * }
	 */
	this.userMsgTable = {};
	
	/** 当前连接用户的信息 */
	this.userInfo = {};
	
	/** 用于处理消息显示的 light editor */
	this.lightEditor = null;
	
	/**
	 * 用于缓存会话用户的连接历史, 以便辅助实现会话列表的显示;
	 * 结构为: {
	 *     userXXX: 9999999999,		//用户代码与时间戳的对应关系
	 *     userYYY: 9999999999,
	 *     ...
	 * }
	 */
	this.connectingHistory = {};
	/** 会话用户连接历史的超时时间 */
	this.connectingHistoryTimeout = 3*60*60*1000;	//3小时
	
	this.options = {
		$rootElm: options.$rootElm,
		$chatContentElm: options.$chatContentElm,
		backendClient: options.backendClient,
		fileUploadUrl: options.fileUploadUrl,
		defUserIcon: options.defUserIcon
	}

	return this;
};

/**
 * 重置本地信息
 */
LocalDataClient.prototype.reset = function(){
	this.userMsgTable = {};
	this.connectingHistory = {};
	this.userInfo = {};
}

/**
 * 记录当前用户信息
 */
LocalDataClient.prototype.rememberUserInfo = function(userInfo){
	this.userInfo = userInfo;
}

/**
 * 设置用于处理消息显示的 light editor
 */
LocalDataClient.prototype.setLightEditor = function(lightEditor){
	this.lightEditor = lightEditor;
}

/**
 * 将消息记录到本地消息表中.
 * @param otherSide 当前对话方
 * @param sender 消息的发送方, 注意可能是当前用户, 也可能是对话方
 * @param message 消息数据, 其中一定包括 type 和 data 字段, 可能包含 timestamp
 */
LocalDataClient.prototype.pushLocalMessageHistory = function(otherSide, sender, message){
	var msgArray = this.userMsgTable[otherSide];
	if (! msgArray){
		msgArray = [];
		this.userMsgTable[otherSide] = msgArray;
	}
	if (!message.timestamp){
		message.timestamp = (new Date()).getTime();
	}
	msgArray.push(message);
	//绘制数据
	renderMessageHistory(this, otherSide);
};

/**
 * 记录会话用户的连接历史信息
 * @param otherSide 当前对话方的 userCode
 */
LocalDataClient.prototype.rememberSessionConnectingHistory = function(otherSide){
	this.connectingHistory[otherSide] = (new Date()).getTime();
};

/**
 * 处理某个会话方的本地消息表.
 * @param buddyCode 会话方
 */
LocalDataClient.prototype.processLocalMessageHistory = function(buddyCode){
	//绘制数据
	renderMessageHistory(this, buddyCode);
};

/**
 * 向会话列表中补充从本地的通话历史中整理出会话的信息
 * (数据结构参考 com.bokesoft.services.messager.server.model.MyActiveConnectData.SessionStat).
 * @param sessions IM 中当前活动的会话信息, 这些会话就不需要再从历史会话中整理了
 */
LocalDataClient.prototype.appendLocalHistorySessions = function(sessions){
	var codeCache = {};
	for (var i=0; i<sessions.length; i++){
		codeCache[sessions[i].code] = 1;
	}
	
	for (var code in this.userMsgTable){
		if (! codeCache[code]){ //如果 sessions 中不存在 ...
			codeCache[code] = 1;
			
			var localMsgs = this.userMsgTable[code];
			var lastMsg = localMsgs[localMsgs.length-1];
			
			sessions.push({
				lastMsg: lastMsg,
				lastTime: lastMsg.timestamp,
				code: code,
				type: "REMIND",
				count: 0
			});
		}
	}
	//附加上 connecting history
	var now = (new Date()).getTime();
	for (var code in this.connectingHistory){
		if ( (!codeCache[code])
				&& (now - this.connectingHistory[code] < this.connectingHistoryTimeout) ){
			sessions.push({
				lastMsg: null,
				lastTime: 0,	//时间为 0, 所以这些项目永远排在最下面
				code: code,
				type: "REMIND",
				count: 0
			});
		}
	}

	//sessions按时间倒序
	sessions.sort(function(s1, s2){
		return s2.lastTime - s1.lastTime;
	});
};

/**
 * 移除会话历史用户记录
 * @param userCode
 */
LocalDataClient.prototype.removeLocalHistorySessions = function(userCode){
	var newUserMsgTable = {};
	for (var codeInClientMsg in this.userMsgTable){
		if (codeInClientMsg !=userCode ){
			newUserMsgTable[codeInClientMsg] = this.userMsgTable[codeInClientMsg] ;
		}
	}
	this.userMsgTable = newUserMsgTable;
};

/**
 * 清除界面上显示的历史消息记录
 */
LocalDataClient.prototype.cleanHistoryArea = function(){
	var $root = $(this.options.$rootElm);
	var $content = $root.find(this.options.$chatContentElm);
	$content.html("");
}

/**
 * 向内容节点中绘制消息历史
 * @param self 绘制时依赖的 LocalDataClient 对象(this)
 * @param otherSide 对话中的"对方"代码
 */
var renderMessageHistory = function(self, otherSide){
	var msgArray = self.userMsgTable[otherSide] || [];
	
	var backendClient = self.options.backendClient;
	var $root = $(self.options.$rootElm);
	var $content = $root.find(self.options.$chatContentElm);

	var oldHtml = $content.html();
    var renderAll = false;
    if (! oldHtml){
    	renderAll = true;		//如果当前消息区域被清空, 那么就需要全部重画
    }
    
    backendClient.fillMessages(msgArray, function(msgArray){
        for (var i=0; i<msgArray.length; i++){
        	var msg = msgArray[i];
        	if ( (renderAll || !msg.rendered) && (!msg.invalid) ){
        		var $div = $("<div class='message-item clearfix'/>");
        		if (msg.sender != otherSide){
        			$div.addClass("self");
        		}else{
        			$div.addClass("buddy");
        		}
        		
        		var messageBody = "";
        		if ("TEXT"==msg.type){
        			messageBody = _renderTextMsg(self, msg);
        		}
        		if ("IMAGE"==msg.type){
        			messageBody = _renderFileMsg(msg, self.options.fileUploadUrl, self.userInfo.userToken);
        		}
        		if ("FILE"==msg.type){
        			messageBody = _renderFileMsg(msg, self.options.fileUploadUrl, self.userInfo.userToken);
        		}
        		
        		if (messageBody){
            		var msgHtml = 
            			"<div class='message-body'>" +
            			"  <div class='userImg'><img src='"+_.escape(msg.senderIcon || self.options.defUserIcon)+"'/></div>" +
            			"  <p class='senderNick'>"+_.escape(msg.senderName || msg.sender)+"</p>" +
            			"  <div class='pre'>"+ messageBody +"</div>" +
            			"  <p class='msgTime'>"+(new Date(msg.timestamp)).toLocaleString()+"</p>" +
            			"</div>";
            		$div.html(msgHtml).appendTo($content)
        		}

        		msg.rendered = true;
        	}
        }
        
        //滚动到底部
        $content[0].scrollTop = $content[0].scrollHeight; 
    });
}
var _renderTextMsg = function(self, msg){
	var text=msg.data;
	var snippets = ActionData.parse(text);

	var $div = $("<div/>");
	for(var i=0; i<snippets.length; i++){
		var snippet = snippets[i];
		if(snippet.type == "text"){
			var html = self.lightEditor.renderHtml(snippet.data);
			var $b = $("<span/>").html(html).appendTo($div);
		}
		if(snippet.type == "action"){
			var action = snippet.data;
			var html = self.lightEditor.renderHtml(action.title);
			var $a = $("<a/>").attr("data-bkim-action", action.actionData)
			                  .attr("href", "javascript:void(0)").html(html).appendTo($div);
		}			
	}				
	return $div.html();			

}
var _doRenderUploading = function(msg, uploadingId){
	var result = null;
	
	var divClass = "image-message";
	if ("FILE" == msg.type){
		divClass = "file-message";
	}
	
	var $div = $(document.getElementById(uploadingId));

	var circleR = 15; //半径
	var _renderTextNumPercent = function (uploadPercent) {
		var percentFloatNum = uploadPercent / 100,
	    	perimeter =  Math.PI * 2 *circleR;
	    $("#circle2").attr("stroke-dasharray", perimeter * percentFloatNum + " " + perimeter * (1- percentFloatNum));
	}

	//检查相应元素是否已存在
	if ($div.length==0){
		//如果找不到, 创建显示区域
		$div = $("<div class='"+divClass+"'/>").attr("id", uploadingId);
		$("<svg class='percent'/>").appendTo($div);
		$("<img/>").attr("src", _calcFileIcon(msg)).appendTo($div);
		$("<div class='fileName'/>").append($("<code/>").text(msg.data.fileName)).appendTo($div);

		var svgTpl =
			"<text class='percentNum' x='12' y='22'>"+msg.data.uploadPercent+"%</text>" +
			"<circle cx='20' cy='20' r='"+circleR+"' stroke-width='3' stroke='#C9CACA' fill='none'></circle>" +
			"<circle id='circle2' cx='20' cy='20' r='"+circleR+"' stroke-width='3' stroke='#E73468' fill='none'></circle>";

		$div.find(".percent").html(svgTpl);
		result = $("<div/>").append($div).html();
		_renderTextNumPercent(msg.data.uploadPercent);

	}else{
		$div.find(".percentNum").text(msg.data.uploadPercent+'%');
		_renderTextNumPercent(msg.data.uploadPercent);
		result = null;	//返回空值使消息窗口不会显示新的消息项
	}
	if (msg.data.uploadPercent>=100){
		msg.invalid = true;
		//如果已经到了 100%, 那么需要删除这个对象
		setTimeout(function(){
			var $div = $(document.getElementById(uploadingId));
			$div.parents(".message-item").remove();
		}, 200);
	}
	return result;	
}
var _calcFileIcon = function(msg){
	var name = msg.data.fileName;
	var type = msg.type;
	if ("IMAGE" == type){
		return fileTypes.getImageIcon(name);
	}else{ // type=="FILE"
		return fileTypes.getFileIcon(name);
	}
}
var _doRenderUploaded = function(msg, fileUploadUrl, userToken){
	var divClass = "file-message";
	var fileIcon = _calcFileIcon(msg);
	if ("IMAGE" == msg.type){
		divClass = "image-message";
		fileIcon = fileUploadUrl + msg.data.fileUrl;
	}
    var fileUrl = fileUploadUrl + msg.data.fileUrl;

	var $div = $("<div class='"+divClass+"'/>");
	
	var $a = $("<a/>").attr("target", "_blank").attr("href", fileUrl+"?t="+userToken).appendTo($div);
	$("<img/>").attr("src", fileIcon+"?t="+userToken).appendTo($a);
	
	$("<div/>").append($("<code/>").text(msg.data.fileName)).appendTo($a);
	
	return $("<div/>").append($div).html();
}
var _renderFileMsg = function(msg, fileUploadUrl, userToken){
	var result = null;
	
	var uploadingId = msg.data.uploadingId;
	if (uploadingId){
		result = _doRenderUploading(msg, uploadingId);
	}else{
		//没有 uploadingId 说明上传已经完成
		result = _doRenderUploaded(msg, fileUploadUrl, userToken);
	}
	return result;
}

/** Define the export point for module */
module.exports = {
	create: function(options){
		var localDataClient = new LocalDataClient(options);
		return localDataClient;
	}
}
