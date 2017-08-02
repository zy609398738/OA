"use strict";


var parseActionData = function(obj,str){
	if(str.length == 0){
		return;
	}
	if(str.indexOf("[[Action:V01:")<0){
		textPush(obj,str);
		return;
	}
	var textStr = str.substring(0,str.indexOf("[[Action:V01:")); //  [[Action:V01:  之前的字符  不包含第一个 [[Action:V01:
	textPush(obj,textStr);	
	var otherStr = str.substr(str.indexOf("[[Action:V01:"));  //    [[Action:V01:  之后的字符 包含第一个 [[Action:V01:	
	//此处不是真的标签
	if(otherStr.indexOf("]]")<0){
		textPush(obj,otherStr);		
		return;
	}	
	var index = otherStr.indexOf("]]");  //第一个 ]] 的位置
	parseString(index,otherStr,obj,function(afterstr){
		parseActionData(obj,afterstr);
	});				
	
};

//添加 type 为text的数据对象
var textPush = function(obj,str){
	var textData = {type:"text",data:""};
	textData.data = str;
	obj.push(textData);
}
//添加 type 为action的数据对象
var actionPush = function(obj,str){
	var actionData = {type:"action",data:""};
	actionData.data = str;
	obj.push(actionData);
}

//解析  ]]   获取"[[Action:V01:" 到 "]]" 之间的字符串   {"title":"XXX", "actionData":"YYY", "_id":"ZZZ"}:ZZZ
var parseString = function(index,parseStr,obj,callback){

	var action = parseStr.substring(13,index);   //{"title":"XXX", "actionData":"YYY", "_id":"ZZZ"}:ZZZ		
	
	if(parseAction(action)){
		actionPush(obj,action.substring(0,action.lastIndexOf(":")));		
		var afterstr = parseStr.substring(index+2);
		callback(afterstr);
	}else{
		if(parseStr.substring(index+2).indexOf("]]")<0){
			textPush(obj,parseStr);
			callback("");
		}
		var indexNext = index + 2 + parseStr.substring(index+2).indexOf("]]"); //下一个 "]]" 的位置				
		parseString(indexNext,parseStr,obj,callback);
	}
};

//判断是不是真的action
var parseAction = function(action){
	//   action   {"title":"XXX", "actionData":"YYY", "_id":"ZZZ"}:ZZZ
	if(action.indexOf(":")<0){
		return false;
	}
	var _idCheck = action.substr(action.lastIndexOf(":")+1); //zzz
	var tmp = action.substring(0,action.lastIndexOf(":")).trim();//{"title":"XXX", "actionData":"YYY", "_id":"ZZZ"}
	var _idValue = action.substring(tmp.lastIndexOf(":")+2,tmp.length-2);
	if(_idCheck == _idValue){
		return true;   //action.substring(0,action.lastIndexOf(":"));  {"title":"XXX", "actionData":"YYY", "_id":"ZZZ"} 
	}else{
		return false;
	}	
};





module.exports = {
	parseActionData : parseActionData
}