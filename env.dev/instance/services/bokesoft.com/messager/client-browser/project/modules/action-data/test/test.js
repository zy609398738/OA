var json = require("JSON2");
var assert = require("assert");

var _parse = require("..").parse;

var testcases = [{
	name: "典型测试",
	input: '这是一条包含 [[Action:V01:{"title":"测试用的 Action", "actionData":"测试数据", "_id":"20170620测试"}:20170620测试]] 的消息',
	result: `[
	    {
	        "type": "text",
	        "data": "这是一条包含 "
	    },
	    {
	        "type": "action",
	        "data": {
	            "title": "测试用的 Action",
	            "actionData": "测试数据",
	            "_id": "20170620测试"
	        }
	    },
	    {
	        "type": "text",
	        "data": " 的消息"
	    }
	]`
},{
	name: "典型测试 - 仅 Action 无其他文本",
	input: '[[Action:V01:{"title":"测试用的 Action", "actionData":"测试数据", "_id":"20170620测试"}:20170620测试]]',
	result: `[
	    {
	        "type": "action",
	        "data": {
	            "title": "测试用的 Action",
	            "actionData": "测试数据",
	            "_id": "20170620测试"
	        }
	    }
	]`
},{
	name: "要求用例1",
	input: '测试 [[Action:V01:{"title":"XXXX", "actionData":"YY]]Y", "_id":"ZZZ"}:ZZZ]] 用例',
	result: `[
	    {
	        "type": "text",
	        "data": "测试 "
	    },
	    {
	        "type": "action",
	        "data": {
	            "title": "XXXX",
	            "actionData": "YY]]Y",
	            "_id": "ZZZ"
	        }
	    },
	    {
	        "type": "text",
	        "data": " 用例"
	    }
	]`
},{
	name: "要求用例1(扩展信息)",
	input: '测试 [[Action:V01:{"title":"XXXX", "actionData":"YY]]Y", "name":"测试用例", "_id":"ZZZ"}:ZZZ]] 用例',
	result: `[
	    {
	        "type": "text",
	        "data": "测试 "
	    },
	    {
	        "type": "action",
	        "data": {
	            "title": "XXXX",
	            "actionData": "YY]]Y",
	            "name": "测试用例",
	            "_id": "ZZZ"
	        }
	    },
	    {
	        "type": "text",
	        "data": " 用例"
	    }
	]`
},{
	name: "要求用例1(头部不一致)",
	input: '测试 [[Action: V01:{"title":"XXXX", "actionData":"YY]]Y", "_id":"ZZZ"}:ZZZ]] 用例',
	result: `[
	    {
	        "type": "text",
	        "data": '测试 [[Action: V01:{"title":"XXXX", "actionData":"YY]]Y", "_id":"ZZZ"}:ZZZ]] 用例'
	    }
	]`
},{
	name: "要求用例1(无效 JSON)",
	input: '测试 [[Action:V01:{title:"XXXX", actionData:"YY]]Y", _id:"ZZZ"}:ZZZ]] 用例',
	result: `[
	    {
	        "type": "text",
	        "data": '测试 [[Action:V01:{title:"XXXX", actionData:"YY]]Y", _id:"ZZZ"}:ZZZ]] 用例'
	    }
	]`
},{
	name: "要求用例2",
	input: '测试 [[Action:V01:{"title":"XXXX", "actionData":"YY]]Y", "_id":"ZZZA"}:ZZZB]] 用例',
	result: `[
	    {
	        "type": "text",
	        "data": '测试 [[Action:V01:{"title":"XXXX", "actionData":"YY]]Y", "_id":"ZZZA"}:ZZZB]] 用例'
	    }
	]`
},{
	name: "要求用例3",
	input: '测试 [[Action:V01:{"title":"XXXX", "actionData":"[[Action:V01:", "_id":"ZZZ"}:ZZZ]] 用例',
	result: `[
	    {
	        "type": "text",
	        "data": "测试 "
	    },
	    {
	        "type": "action",
	        "data": {
	            "title": "XXXX",
	            "actionData": "[[Action:V01:",
	            "_id": "ZZZ"
	        }
	    },
	    {
	        "type": "text",
	        "data": " 用例"
	    }
	]`
},{
	name: "普通字符串",
	input: 'Hello, World!',
	result: `[
	    {
	        "type": "text",
	        "data": "Hello, World!"
	    }
	]`
},{
	name: "空字符串",
	input: '',
	result: `[]`
},{
	name: "结尾检测",
	input: '[START] [[Action:V01:{"title":"测试", "actionData":"测试", "_id":"测试"}:测试]] "_id":"测试"}:测试]] [END]',
	result: `[
	    {
	        "type": "text",
	        "data": "[START] "
	    },
	    {
	        "type": "action",
	        "data": {"title": "测试", "actionData": "测试", "_id": "测试"}
	    },
	    {
	        "type": "text",
	        "data": ' "_id":"测试"}:测试]] [END]'
	    }
	]`
},{
	name: "结尾检测(2)",
	input: '[START] [[Action:V01:{"title":"测试", "actionData":"测试\\\", \\\"_id\\\":\\\"测试\\\"}:测试]]" ,"_id":"测试"}:测试]] [END]',
	result: `[
	    {
	        "type": "text",
	        "data": "[START] "
	    },
	    {
	        "type": "action",
	        "data": {"title": "测试", "actionData": '测试", "_id":"测试"}:测试]]', "_id": "测试"}
	    },
	    {
	        "type": "text",
	        "data": ' [END]'
	    }
	]`
},{
	name: "校验不通过的情况",
	input: '这是一条包含 [[Action:V01:{"title":"测试用的 Action", '
		  +'"actionData":"测试数据", "_id":"20170620测试"}:20170620测试2]] 的消息',
	result: `[
	    {
	        "type": "text",
	        "data": '这是一条包含 [[Action:V01:{"title":"测试用的 Action", '
	               +'"actionData":"测试数据", "_id":"20170620测试"}:20170620测试2]] 的消息'
	    }
	]`
},{
	name: "比较复杂的情形",
	input: '复杂的情况 第一个-[[Action:V01:{"title":"XXXX]]", "actionData":"YYY", "_id":"ZZZ"}:ZZZ]]，'
		  +'这是第二个[[Action:V01:{"title":"XXXXX", "actionData":"[[Action:V01:YYY", "_id":"ZZZ"}:ZZZ]] 结束了',
	result: `[{
	    type: 'text', data: '复杂的情况 第一个-'
	},{
	    type: 'action',
	    data: {
	        title: 'XXXX]]',
	        actionData: 'YYY',
	        _id: 'ZZZ'
	    }
	},{
	    type: 'text', data: '，这是第二个'
	},{
	    type: 'action',
        data: {
            title: 'XXXXX',
            actionData: '[[Action:V01:YYY', _id: 'ZZZ'
        }
    },{
        type: 'text', data: ' 结束了'
    }]`
}]

describe('Action 标签数据解析(action-data) 测试', function() {
    for(var i=0; i<testcases.length; i++){
    	const t = testcases[i];
		it(t.name, function() {
			console.log("执行测试: " + t.name);
			const result = _parse(t.input);
			console.log("解析结果:\n", result);
			doCheck(t.result, json.stringify(result));
		});
    }
});

var doCheck = function(s1, s2){
	var s1 = json.stringify(eval("("+s1+")"), null, 4);
	var s2 = json.stringify(eval("("+s2+")"), null, 4);
	assert.equal(s1, s2);
}