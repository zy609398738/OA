var TEST_WS_URL = "ws://"+location.hostname+":7778/boke-messager/messager/boke-test-001/to/boke-test-002";

var ws = require("..");
ws.loadFlashPolicyFile("xmlsocket://" + location.hostname + ":7843");

var client = ws.create(TEST_WS_URL);

window.testSend = function(){
	client.sendText("Client -> Server, "+new Date());
}
window.testClose = function(){
	client.close();
}
