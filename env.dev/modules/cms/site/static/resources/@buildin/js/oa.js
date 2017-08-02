/*YIUI.AttachmentHandler.preview=function(path, name, control){ 
	var last=name.lastIndexOf('.');
	var fix=name.substr(last+1,name.len);
	var fileUrl="";
	if(fix.toUpperCase()=="DOC" || fix.toUpperCase()=="DOCX"){
		 fileUrl="../../pageoffice/SimpleWord/WordYigo.jsp?filePath="+path+"&fileName="+name;
	}else if(fix.toUpperCase()=="XLS" || fix.toUpperCase()=="XLSX"){
		 fileUrl="../../pageoffice/SimpleWord/ExcelYigo.jsp?filePath="+path+"&fileName="+name;
	}else if(fix.toUpperCase()=="PPT" || fix.toUpperCase()=="PPTX"){
		fileUrl="../../pageoffice/SimpleWord/PPTYigo.jsp?filePath="+path+"&fileName="+name;
	}else if(fix.toUpperCase()=="PDF"){
		fileUrl="a/cms2-yigo2-adapter/cms/view-yigo-file/"+path;
	}else if(fix.toUpperCase()=="CEB"){
		var form = YIUI.FormStack.getForm(control.ofFormID);
		path = UI.BaseFuns.InvokeService(null,{form:form},["OA_Ceb2Pdf", false, false, path]);
		// path=InvokeService("OA_Ceb2Pdf",false,false,path,name);
		fileUrl="a/cms2-yigo2-adapter/cms/view-yigo-file/"+path;
	}else{
		fileUrl="a/cms2-yigo2-adapter/cms/view-yigo-file/"+path;
	}
		var formKey = 'OA_ShowWeb';
        var target = YIUI.FormTarget.NEWTAB;

		var data = {formKey: formKey,  cmd: "PureNewForm"};
	    
		var a = {URL:fileUrl};
	    data.callParas = JSON.stringify(a);
	        
		var success = function (jsonObj) {
			var newForm = YIUI.FormBuilder.build(jsonObj, target);
			if (target != YIUI.FormTarget.MODAL) {
				YIUI.MainContainer.build(newForm);
			}
			newForm.setOperationState(YIUI.Form_OperationState.Default);
		};
		Svr.SvrMgr.dealWithPureForm(data, success);

	 
	//window.open(fileUrl);
	//处理路径中有空格的情况
	fileUrl=fileUrl.replace(/ /g, "%20");
	var urlPara = {URL:fileUrl};
	  
	var node= {
		formKey: "OA_ShowWeb",
		OID: -1,
		//target: "newtab",
		callParas: JSON.stringify(urlPara),
	};
	openForm(node);
}
*/
//初始打开系统时默认载入的入口菜单和首页
function reloadAndOpenStart(reloadNode,defaultNode) {
	reloadAndOpenEntry('','OABusiness/OA/OA_Index');
}

//解析当前URL参数打开菜单入口或指定单据
function parseURL() {
				var str = window.location.search.substr(1);
				parseURLByStr(str);
			}

//解析指定URL参数打开菜单入口或指定单据			
function parseURLByStr(str) {
	if(str) {
		var args = str.split("&");
		for (var i = 0, len = args.length; i < len; i++) {
			var str = args[i];
			var arg = str.split("=");
			var key = arg[0];
			if(key.toLowerCase() == "entrypath") {
				var opts = {
					path: arg[1]
				};
				openEntry(opts);
				break;
			}
			if(key.toLowerCase() == "formkey") {
				var str1 = args[i+1];
				var arg1 = str1.split("=");
				var args = {
					formKey: arg[1],
					OID: arg1[1]
					};
				openForm(args);
				break;
			}
		}
	
}
}
//根据路径打开入口
function OpenEntryByPath(node) {
	var opts = {
		path: node
	};
	openEntry(opts);
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
function openForm(node) {
	YIUI.FormUtil.openForm(node, YIUI.MainContainer);
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