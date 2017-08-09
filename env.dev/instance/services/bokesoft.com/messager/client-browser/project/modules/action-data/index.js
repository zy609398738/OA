/**
 * 自定义操作解析
 * [[Action:V01:{"title":"XXXX", "actionData":"YYY", "_id":"ZZZ"}:ZZZ]]
 *
 * - [[Action:V01 - 头部，版本号 “V01” 备用
 * - 尾部：最后一个":"之后，主要是用于与 "_id" 进行校验
 * - _id 主要用于与尾部进行校验            
 *
 *   基本约定：
 *    * 第二个 ":" 之前是头部，最后一个 ":" 之后是尾部;
 *     - 所以要求 _id 数据中不能有 ":" ; 
 *    * 头尾之间就是 json 格式的 Action 定义数据;
 *    * Action 定义数据中的 _id 需要检查是否和 尾部 内容一致;
 *    * Action 定义数据中的所有内容都是字符串类型（考虑到跨平台和技术体系的需要）; 
 */

"use strict";

var ACTION_HEADER="[[Action:V01:";
var ACTION_TAILER="]]";

var json = require("JSON2");

var doParse = function(snippets, str){
	if(! str){
		return;
	}
	if(str.indexOf(ACTION_HEADER)<0){
		pushText(snippets, str);
		return;
	}
	
	var textBeforeAction = str.substring(0, str.indexOf(ACTION_HEADER)); //  [[Action:V01:  之前的字符  不包含第一个 [[Action:V01:
	if (textBeforeAction){
		pushText(snippets, textBeforeAction);	
	}
	
	var textWithHeader = str.substr(str.indexOf(ACTION_HEADER));  //  [[Action:V01:  之后的字符 包含第一个 [[Action:V01:	
	var tailerPos = textWithHeader.indexOf(ACTION_TAILER);   //第一个 ]] 的位置
	if(tailerPos<0){//找不到结尾 - 不是真的标签
		pushText(snippets, textWithHeader);		
		return;
	}	
	scan2Tailer(textWithHeader, tailerPos, snippets);				
	
};

//添加 type 为 text 的数据对象
var pushText = function(snippets, str){
	if (snippets.length>0 && snippets[snippets.length-1].type=="text"){
		snippets[snippets.length-1].data = snippets[snippets.length-1].data + str;
	}else{
		snippets.push({
			type:"text",
			data: str
		});
	}
}
//添加 type 为action的数据对象
var pushAction = function(snippets, actionObject){
	snippets.push({
		type:"action",
		data: actionObject
	});
}

//解析 ]] 获取"[[Action:V01:" 到 "]]" 之间的字符串   {"title":"XXXX", "actionData":"YYY", "_id":"ZZZ"}:ZZZ
var scan2Tailer = function(textWithHeader, tailerPosition, snippets){

	var actionWithChecker = textWithHeader.substring(ACTION_HEADER.length, tailerPosition);
	//{"title":"XXXX", "actionData":"YYY", "_id":"ZZZ"}:ZZZ

	var actionData = parseAction(actionWithChecker);
	if(actionData){
		pushAction(snippets, actionData);
		
		var nextSnippet = textWithHeader.substring(tailerPosition+2);
		doParse(snippets, nextSnippet);
	}else{
		var nextTailerPos = textWithHeader.indexOf(ACTION_TAILER, tailerPosition+2);	//下一个 "]]" 的位置
		if(nextTailerPos<0){	//一直找到最后也没有 "]]", 说明不是真的 Action 定义
			pushText(snippets, textWithHeader);
		}else{
			scan2Tailer(textWithHeader, nextTailerPos, snippets);
		}
	}
};

//判断传入的 JSON 是否合法的 action，如果是则返回 JSON 对象，否则返回 null
var parseAction = function(actionWithChecker){
	// actionWithChecker   {"title":"XXXX", "actionData":"YYY", "_id":"ZZZ"}:ZZZ
	if(actionWithChecker.indexOf(":")<0){
		return null;
	}
	var _splitterPos = actionWithChecker.lastIndexOf(":");
	var _checker = actionWithChecker.substr(_splitterPos+1); //ZZZ
	var _json = actionWithChecker.substring(0, _splitterPos).trim();//{"title":"XXXX", "actionData":"YYY", "_id":"ZZZ"}
	
	try{
		var actObj = json.parse(_json);
		if (actObj && actObj._id && actObj._id==_checker){
			return actObj;
		}else{
			return null;
		}
	}catch(ex){
		return null;
	}
};

module.exports = {
	parse: function(str){
		var snippets = [];
		doParse(snippets, str);
		return snippets;
	}
}