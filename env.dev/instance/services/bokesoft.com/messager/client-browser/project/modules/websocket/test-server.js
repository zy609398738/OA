var app = require("../../../modules/supports/webpack-dev-web-test");

app.start();

(function(){
	var PORT_WEBSOCKET = 7778;
	
	var WebSocket = require('faye-websocket'),
        http = require('http');

    var server = http.createServer();

    server.on('upgrade', function(request, socket, body) {
        if (WebSocket.isWebSocket(request)) {
            var ws = new WebSocket(request, socket, body);
            ws.on("open", function(event){
            	console.log("[WebSocket] open");
            	ws.send("[OPNE] "+new Date());
            });
            ws.on('message', function(event) {
            	console.log("[WebSocket] From Client: "+event.data);
                ws.send("[Received] "+new Date());
            });
            ws.on('close', function(event) {
                console.log('[WebSocket] close', event.code, event.reason);
                ws = null;
            });
        }
    });

    server.listen(PORT_WEBSOCKET);
    console.log(">>> WebSocket Server listen: "+PORT_WEBSOCKET);
})();