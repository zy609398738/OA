//初始打开系统时默认载入的入口菜单和首页
function reloadAndOpenStart() {
	reloadAndOpenEntry('','TSL/Base/TSL_Index');
}

//解析当前URL参数打开菜单入口或指定单据
function parseURL() {
	var str = window.location.search.substr(1);
	var formKey=getUrlParam(str,"formkey");
	if(formKey){	
		parseURLByStr(str);
	}else{
		reloadAndOpenStart();
	}
	var language=$.cookie("locale");
	if(language){
		$(".select-language").val(language);
	}
}

//获取url中的参数
function getUrlParam(url,name) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
	var r = url.match(reg);  //匹配目标参数
	if (r != null) return unescape(r[2]); return null; //返回参数值
}

//解析指定URL参数打开菜单入口或指定单据			
function parseURLByStr(str) {
	if(str) {
		var entrypath=getUrlParam(str,"entrypath");
		var args = str.split("&");
		if(entrypath){
			openEntry(entrypath);
		}else {
			var workitemid=getUrlParam(str,"workitemid");
			if(workitemid){
				openWorkitemID(workitemid);
			}else{
				var formkey=getUrlParam(str,"formkey");
				var oid=getUrlParam(str,"oid");
				openForm(formkey,oid);
			}
		}
	}
}
//根据路径打开入口
function OpenEntryByPath(entrypath) {
	var args = {
		path: entrypath
	};
	openEntry(args);
}

//打开单据界面
function openFormByKey(key,id) {
    var args = {
		formKey: key,
		OID: id
	};
    openForm(args);
}

//打开单据界面
function openWorkitemID(workitemid) {
	var args = {
		WID: workitemid
	};
	YIUI.FormUtil.openWorkItem(args, YIUI.MainContainer);
}

//打开单据界面
function openForm(formkey,oid) {
	var args = {
		formKey: formkey,
		OID: oid
	};
	YIUI.FormUtil.openForm(args, YIUI.MainContainer);
}

//打开web界面
function openWebForm(url,formCaption) {
	//处理路径中有空格的情况
	url=url.replace(/ /g, "%20");
	var urlPara = {URL:url};
	if(formCaption){
		urlPara={URL:url,FormCaption:formCaption};
	}
	var node= {
		formKey: "OA_ShowWeb",
		OID: -1,
		//target: "newtab",
		callParas: JSON.stringify(urlPara),
	};
	openForm(node);
}

//重新加载入口
function reloadEntry(node) {
	if(node!=null && node.length>0){
		YIUI.MenuTree.reload(node);
	}
}

//重新加载并打开入口菜单
function reloadAndOpenEntry(reloadNode,defaultNode) {
	reloadEntry(reloadNode);
	if(defaultNode!=null && defaultNode.length>0){
		var opts = {
			path: defaultNode
		};
		openEntry(opts);
	}
}
//关闭所有窗口
function closeAll() {
	YIUI.MainContainer.closeAll()
}

//IM即时通讯的消息回调
function imHostCallBack(type,data,globalOptions){
	var callParas=data.split(",");
	openFormByKey(callParas[1],callParas[2]);
}

//设置语言
function setLanguage(language){
	$.cookie("locale",language);
	location.reload();
}