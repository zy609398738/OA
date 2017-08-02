var assert = require("assert");
var actionData = require("..");



var str = "[[Action:V01:{\"title\":\"XXX]]\", \"actionData\":\"YYY\", \"_id\":\"ZZZ\"}:ZZZ]]这是第三个[[Action:V01:{\"title\":\"XXX\", \"actionData\":\"[[Action:V01:YYY\", \"_id\":\"ZZZ\"}:ZZZ]]撒大声地";

var obj = new Array();

describe('Utils(action-data)', function() {

	describe('#parseActionData(obj,str)', function() {
		it('===============', function() {			
			actionData.parseActionData(obj,str);
			for(var i=0;i<obj.length;i++){
				console.log("=========== "+obj[i].type);
				console.log("=========== "+obj[i].data);
			}
			
		});
	});

});  