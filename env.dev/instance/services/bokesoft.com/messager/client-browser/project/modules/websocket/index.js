"use strict";

/* The implementations */

require("../web-socket-js/swfobject.js");
require("../web-socket-js/web_socket.js");
var swf = require("file!../web-socket-js/WebSocketMain.swf");

window.WEB_SOCKET_SWF_LOCATION = swf;
window.WEB_SOCKET_DEBUG = false;

var flashPolicyFileLoaded = false;
var defaultFlashPolicyFile = "xmlsocket://" + location.hostname + ":7843";
/**
 * Load FlashPolicyFile to make IE8 compatible
 */
var loadFlashPolicyFile = function(flashPolicyFile){
	if (null!=WebSocket.loadFlashPolicyFile){
		WebSocket.loadFlashPolicyFile(flashPolicyFile);
	}
	flashPolicyFileLoaded = true;
}

/**
 * Create a websocket client;
 * @param url The websocket server url
 * @param options connection options
 *  - flashPolicyFile: The FlashPolicyFile Url, default "xmlsocket://" + location.hostname + ":7843"
 *  - onopen: onopen event handler
 *  - onmessage: onmessage event handler
 *  - onclose: onclose event handler
 */
var create = function(url, options){
	if (! flashPolicyFileLoaded){
		loadFlashPolicyFile(defaultFlashPolicyFile);
	}
	
	return {
		url: url,
		options: options,
		socket: null,
		textMessages: [],	//Messages to send
		connect: function(){
			var socket = new WebSocket(url);
			this.socket = socket;
			
			var client = this;
			socket.onopen = function(evt){
				console.log("WebSocket onopen >", evt);
				if (client.options && client.options.onopen){
					client.options.onopen.call(client, evt);
				}
				client.sendText();	//Send all cached message
			}
			socket.onmessage = function(evt){
				console.info("WebSocket onmessage > " + evt.data);
				if (client.options && client.options.onmessage){
					client.options.onmessage.call(client, evt);
				}
			}
			socket.onclose = function(evt){
				console.info("WebSocket onclose > Socket has been closed, readyState=" + client.socket.readyState);
				if (client.options && client.options.onclose){
					client.options.onclose.call(client, evt);
				}
			}
		},
		sendText: function(message){
			if (message){
				this.textMessages.push(message);
			}
			
			var socket = this.socket;
			if ( !socket || socket.readyState!=1/*连接成功*/ ){
				if (!socket || socket.readyState!=0/*正在连接*/){
					this.connect(this.url);
				}
			}else{
				for (var i=0; i<this.textMessages.length; i++){
					var msg = this.textMessages[i];
					socket.send(msg);
				}
				this.textMessages = [];
			}
		},
		close: function(){
			if (this.socket){
				this.socket.close();
			}
		}
	};
}

/** Define the export point for module */
module.exports = {
	create: create,
	loadFlashPolicyFile: loadFlashPolicyFile
}
