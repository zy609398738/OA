"use strict";

var json = require("JSON2");

var UploadHandler = function(options){
	this.webSocketClient = options.webSocketClient;
	this.localDataClient = options.localDataClient;
	this.localVars = options.localVars;
	
	/**
	 * uploadingId 与 message 对象的对应关系
	 */
	this.uploadingIdTable = {};
}

UploadHandler.prototype.updateWebSocketClient = function(webSocketClient){
	this.webSocketClient = webSocketClient;
}

UploadHandler.prototype.success = function(response){
	var data = json.parse(response);
    if (data.url && data.fileName){
    	var isImg = _isImage(data.fileName);
    	var msgType = isImg?"IMAGE":"FILE";
    	
    	var msg = {
			sender: this.localVars.ws_Sender,
			type: msgType,
			data: {
				fileName: data.fileName,
				fileUrl: data.url
			},
			senderName: this.localVars.ws_SenderName,
			receiverName: this.localVars.ws_ReceiverName
		}
    	//发送没有 uploadingId 的消息, 说明上传完成
    	this.webSocketClient.sendText(json.stringify(msg));
    	this.localDataClient.pushLocalMessageHistory(
    			this.localVars.ws_Receiver, this.localVars.ws_Sender, msg);
    }
}

//IE 8 不会执行到这里
UploadHandler.prototype.progress = function(event, position, total, percent, files){
	console.log(percent, files);

	var file = files[0];
	var uploadingId = file.name + "|" + file.size + "|" + file.lastModified;
	//uploadingId 需要处理以便可以用于 DOM 元素的 ID
	uploadingId = encodeURIComponent(uploadingId).replace(/(\.|\')/g, "_");
	
	var _pushMsg = function(self, msg){
		self.localDataClient.pushLocalMessageHistory(
				self.localVars.ws_Receiver, self.localVars.ws_Sender, msg);
		//如果当前已经到了 100%, 那么需要从 uploadingIdTable 中删除掉
		if (msg.data.uploadPercent>=100){
			delete(self.uploadingIdTable[uploadingId]);
		}
	}
	
	var msg = this.uploadingIdTable[uploadingId];
	if (! msg){
		msg = {
			sender: this.localVars.ws_Sender,
			type: null,
			data: {
				uploadingId: uploadingId,
				uploadPercent: percent || 0,
				fileIcon: null,
				fileName: null
			}
		};
		this.uploadingIdTable[uploadingId] = msg;
		
		//根据 progress 数据完善 message 对象
		if ( _isImage(file.name) ){
			if (window.FileReader){
				var oFReader = new FileReader();
				var self = this;
				oFReader.onload = function (oFREvent) {
				    var url = oFREvent.target.result;
				    msg.data.fileIcon = url;
				    msg.type = "IMAGE";
				    msg.data.fileName = file.name;
				    //发送消息
				    _pushMsg(self, msg);
				};
				oFReader.readAsDataURL(file);
			}else{
				msg.type = "IMAGE";
				msg.data.fileName = file.name;
			    //发送消息
				_pushMsg(this, msg);
			}
		}else{
			msg.type = "FILE";
			msg.data.fileName = file.name;
		    //发送消息
			_pushMsg(this, msg);

		}
	}else{
		msg.data.uploadPercent = percent;
	    //发送消息
		msg.rendered = false;	//同一条消息因为 percent 的不同需要重发
		_pushMsg(this, msg);
	}

}

UploadHandler.prototype.error = function(errorData){
	var error = errorData.responseText || errorData.statusText || json.stringify(errorData);
	var error =
		'<span style="color:red">文件上传错误!<br/>'
		+'<code style="color:gray;font-size:0.6em;font-style:italic">'+error+"</code></span>";
	alert(error);
	var msg = {sender: this.localVars.ws_Sender, type: "TEXT", data: error};
	this.localDataClient.pushLocalMessageHistory(
			this.localVars.ws_Receiver, this.localVars.ws_Sender, msg);
}

var _isImage = function(fileName){
	var imgFilter = /.*(bmp|gif|jpeg|jpg|png|svg|tiff|tif|icon|ico)$/i ;
	if (imgFilter.test(fileName)){
		return true;
	}else{
		return false;
	}
}

/** Define the export point for module */
module.exports = {
	create: function(options){
		var uploadHandler = new UploadHandler(options);
		return uploadHandler;
	}
}
