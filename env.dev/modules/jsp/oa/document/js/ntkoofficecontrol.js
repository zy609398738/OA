// 请勿修改，否则可能出错
	var userAgent = navigator.userAgent, 
			rMsie = /(msie\s|trident.*rv:)([\w.]+)/, 
			rFirefox = /(firefox)\/([\w.]+)/, 
			rOpera = /(opera).+version\/([\w.]+)/, 
			rChrome = /(chrome)\/([\w.]+)/, 
			rSafari = /version\/([\w.]+).*(safari)/;
			var browser;
			var version;
	var ua = userAgent.toLowerCase();
	function uaMatch(ua) {
		var match = rMsie.exec(ua);
		if (match != null) {
			return { browser : "IE", version : match[2] || "0" };
		}
		var match = rFirefox.exec(ua);
		if (match != null) {
			return { browser : match[1] || "", version : match[2] || "0" };
		}
		var match = rOpera.exec(ua);
		if (match != null) {
			return { browser : match[1] || "", version : match[2] || "0" };
		}
		var match = rChrome.exec(ua);
		if (match != null) {
			return { browser : match[1] || "", version : match[2] || "0" };
		}
		var match = rSafari.exec(ua);
		if (match != null) {
			return { browser : match[2] || "", version : match[1] || "0" };
		}
		if (match != null) {
			return { browser : "", version : "0" };
		}
	}
	var browserMatch = uaMatch(userAgent.toLowerCase());
	if (browserMatch.browser) {
		browser = browserMatch.browser;
		version = browserMatch.version;
	}
	
	// 成功打开文档
	function OnComplete3(str,doc) {
		MAP_Office.addSaveIcon();
		MAP_Office.addTaoHong();
		//saved属性用来判断文档是否被修改过,文档打开的时候设置成ture,当文档被修改,自动被设置为false,该属性由office提供.
		TANGER_OCX_OBJ.activeDocument.saved=true;
		//获取文档控件中打开的文档的文档类型
		switch (TANGER_OCX_OBJ.doctype) {
			case 1:
				fileType = "Word.Document";
				fileTypeSimple = "wrod";
				break;
			case 2:
				fileType = "Excel.Sheet";
				fileTypeSimple="excel";
				break;
			case 3:
				fileType = "PowerPoint.Show";
				fileTypeSimple = "ppt";
				break;
			case 4:
				fileType = "Visio.Drawing";
				break;
			case 5:
				fileType = "MSProject.Project";
				break;
			case 6:
				fileType = "WPS Doc";
				fileTypeSimple="wps";
				break;
			case 7:
				fileType = "Kingsoft Sheet";
				fileTypeSimple="et";
				break;
			default :
				fileType = "unkownfiletype";
				fileTypeSimple="unkownfiletype";
		}
		
	}	

	// 成功打开服务器文档回调函数
	function OnComplete(){
		if (TANGER_OCX_OBJ.doctype == 1 || TANGER_OCX_OBJ.doctype == 6) {
			TANGER_OCX_OBJ.ActiveDocument.TrackRevisions = true; //打开修订模式
			TANGER_OCX_OBJ.ActiveDocument.ShowRevisions = false;
			TANGER_OCX_OBJ.AddCustomButtonOnMenu(4, "显示留痕", true, 4);
			TANGER_OCX_OBJ.AddCustomButtonOnMenu(5, "隐藏留痕", true, 5);
		}
	}
	
	// 自定义按钮二级菜单（添加套红功能）
	function CustomMenuCmd(menuPos,submenuPos,subsubmenuPos,menuCaption,menuID){
		MAP_Office.doTaoHong(MAP_C_SERVER_URL + '/ext/oa/workflow/template/' + menuCaption);
	}
	
	// 自定义按钮
	function CustomButtonOnMenuCmd(btnPos,btnCaption,btnCmdId) {
		if (TANGER_OCX_OBJ.doctype == 1 || TANGER_OCX_OBJ.doctype == 6) {
				if (btnCmdId == 0) {
					MAP_Office.saveFileToURL();
				} else if (btnCmdId == 1) {
					TANGER_OCX_OBJ.ActiveDocument.Application.Dialogs(168).Show();
				} else if (btnCmdId == 2) {
					MAP_Office.replaceText();
				} else if (btnCmdId == 3) {
					//MAP_Office.doTaoHong();
				} else if (btnCmdId == 4) {
					TANGER_OCX_OBJ.ActiveDocument.ShowRevisions = true;
				} else if (btnCmdId == 5) {
					TANGER_OCX_OBJ.ActiveDocument.ShowRevisions = false;
				} else if (btnCmdId == 6) {
					MAP_Office.saveFileToURLAndClose();
				}
			} else {
				TANGER_OCX_OBJ.ShowTipMessage('提示','此功能只支持在word中使用，谢谢！！！',false);	
			}
	}

	var classid = 'C9BC4DFF-4248-4a3c-8A49-63A7D317F404';
	if (browser=="IE"){
		document.write('<!-- 用来产生编辑状态的ActiveX控件的JS脚本-->   ');
		document.write('<!-- 因为微软的ActiveX新机制，需要一个外部引入的js-->   ');
		document.write('<object id="TANGER_OCX" classid="clsid:C39F1330-3322-4a1d-9BF0-0BA2BB90E970"');
		document.write('codebase="ofctnewclsid.cab#version=5,0,2,2" width="100%" height="100%">   ');
		document.write('<param name="IsUseUTF8URL" value="-1">   ');
		document.write('<param name="IsUseUTF8Data" value="-1">   ');
		document.write('<param name="BorderStyle" value="1">   ');
		document.write('<param name="BorderColor" value="14402205">   ');
		document.write('<param name="TitlebarColor" value="15658734">   ');
		document.write('<param name="isoptforopenspeed" value="0">   ');

		document.write('<param name="ProductCaption" value="南京市国资委">  ');
		document.write('<param name="ProductKey" value="12FD8A50D31555EEF22715DFC8ACDC90E3512665"> ');

		document.write('<param name="TitlebarTextColor" value="0">   ');
		document.write('<param name="MenubarColor" value="14402205">   ');
		document.write('<param name="MenuButtonColor" VALUE="16180947">   ');
		document.write('<param name="MenuBarStyle" value="3">   ');
		document.write('<param name="MenuButtonStyle" value="7">   ');
		document.write('<param name="WebUserName" value="NTKO">   ');
		document.write('<param name="Caption" value="NTKO OFFICE文档控件示例演示 http://www.ntko.com">   ');
		document.write('<SPAN STYLE="color:red">不能装载文档控件。请在检查浏览器的选项中检查浏览器的安全设置。</SPAN>   ');
		document.write('</object>');
	} else if (browser=="firefox"){ 	
		document.write('<object id="TANGER_OCX" type="application/ntko-plug"  codebase="ofctnewclsid.cab#version=5,0,2,2" width="100%" height="100%" ForOnSaveToURL="OnComplete2" ForOnBeginOpenFromURL="OnComplete" ForOndocumentopened="OnComplete3"');
		document.write('ForOnpublishAshtmltourl="publishashtml"');
		document.write('ForOnpublishAspdftourl="publishaspdf"');
		document.write('ForOnSaveAsOtherFormatToUrl="saveasotherurl"');
		document.write('ForOnDoWebGet="dowebget"');
		document.write('ForOnDoWebExecute="webExecute"');
		document.write('ForOnDoWebExecute2="webExecute2"');
		document.write('ForOnFileCommand="FileCommand"');
		document.write('ForOnCustomMenuCmd2="CustomMenuCmd"');
		document.write('_IsUseUTF8URL="-1"   ');

		document.write('ForOnCustomButtonOnMenuCmd="CustomButtonOnMenuCmd"');
		document.write('_ProductCaption="南京市国资委" ');
		document.write('_ProductKey="12FD8A50D31555EEF22715DFC8ACDC90E3512665"');

		document.write('_IsUseUTF8Data="-1"   ');
		document.write('_BorderStyle="1"   ');
		document.write('_BorderColor="14402205"   ');
		document.write('_MenubarColor="14402205"   ');
		document.write('_MenuButtonColor="16180947"   ');
		document.write('_MenuBarStyle="3"  ');
		document.write('_MenuButtonStyle="7"   ');
		document.write('_WebUserName="NTKO"   ');
		document.write('clsid="{C39F1330-3322-4a1d-9BF0-0BA2BB90E970}" >');
		document.write('<SPAN STYLE="color:red">尚未安装NTKO Web FireFox跨浏览器插件。请点击<a href="ntkoplugins.xpi">安装组1件</a></SPAN>   ');
		document.write('</object>   ');
	}else if(browser=="chrome"){
		document.write('<object id="TANGER_OCX" clsid="{C39F1330-3322-4a1d-9BF0-0BA2BB90E970}"  ForOnSaveToURL="OnComplete2" ForOnBeginOpenFromURL="OnComplete" ForOndocumentopened="OnComplete3"');
		document.write('ForOnpublishAshtmltourl="publishashtml"');
		document.write('ForOnpublishAspdftourl="publishaspdf"');
		document.write('ForOnSaveAsOtherFormatToUrl="saveasotherurl"');
		document.write('ForOnDoWebGet="dowebget"');
		document.write('ForOnDoWebExecute="webExecute"');
		document.write('ForOnDoWebExecute2="webExecute2"');
		document.write('ForOnFileCommand="FileCommand"');
		document.write('ForOnCustomMenuCmd2="CustomMenuCmd"');

		document.write('ForOnCustomButtonOnMenuCmd="CustomButtonOnMenuCmd"');
		document.write('_ProductCaption="南京市国资委" ');
		document.write('_ProductKey="12FD8A50D31555EEF22715DFC8ACDC90E3512665"');

		document.write('codebase="ofctnewclsid.cab#version=5,0,2,2" width="100%" height="100%" type="application/ntko-plug" ');
		document.write('_IsUseUTF8URL="-1"   ');
		document.write('_IsUseUTF8Data="-1"   ');
		document.write('_BorderStyle="1"   ');
		document.write('_BorderColor="14402205"   ');
		document.write('_MenubarColor="14402205"   ');
		document.write('_MenuButtonColor="16180947"   ');
		document.write('_MenuBarStyle="3"  ');
		document.write('_MenuButtonStyle="7"   ');
		document.write('_WebUserName="NTKO"   ');
		document.write('_Caption="NTKO OFFICE文档控件示例演示 http://www.ntko.com">    ');
		document.write('<SPAN STYLE="color:red">尚未安装NTKO Web Chrome跨浏览器插件。请点击<a href="ntkoplugins.crx">安装组件</a></SPAN>   ');
		document.write('</object>');
	}else if (Sys.opera){
		alert("sorry,ntko web印章暂时不支持opera!");
	}else if (Sys.safari){
		 alert("sorry,ntko web印章暂时不支持safari!");
	}