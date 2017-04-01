var MAP_C_SERVICE = (function() {
    var matches = /^\/*(\w+)\//g.exec(decodeURI(location.pathname));
    return (matches && matches.length >= 2) ? matches[1] : null;
})();

var MAP_C_SERVER_URL = location.protocol + '//' + location.host + '/' + MAP_C_SERVICE;

var MAP_Office = {
	saveURL : MAP_C_SERVER_URL + '/rfc.do?__webCall=1&__out=1&__uuid=111111&__exp=WebUploadTempFile()',
	openURL : MAP_C_SERVER_URL + '/rfc.do?__webCall=1&__out=1&__exp=WebDownload(webgetattachpath({'+BILLKEY+"\\"+BILLID+'}))',
	getCurrUserName : function() {
		var currUserName;
		$.ajax({
			type : 'post',
			async : false,
			url : MAP_C_SERVER_URL + '/rfc.do?__webCall=1&__out=1&__exp=getenvvalue({UserName})',
			success : function (_resJson) {
				currUserName = _resJson;
			}
		});
		return currUserName;
	},
	isHasFile : function(path) {
		var hasFile = true;
		$.ajax({
			type : 'post',
			async : false,
			url : MAP_C_SERVER_URL + '/rfc.do?__webCall=1&__out=1&__exp=webgetattachpath({' + path + '})',
			success : function (_resJson) {
				try{
					hasFile = eval(_resJson);
				} catch(e) {
					return true;
				}
			}
		});
		return hasFile;
	},
	saveFileToURL : function(billKey, billID, fileName) {
		if (TANGER_OCX_OBJ.doctype == 0) return;
		switch (TANGER_OCX_OBJ.doctype) {
			case 1 :
				fileType = "Word.Document";
				break;
			case 2 :
				fileType = "Excel.Sheet";
				break;
			case 3 :
				fileType = "PowerPoint.Show";
				break;
			case 4 :
				fileType = "Visio.Drawing";
				break;
			case 5 :
				fileType = "MSProject.Project";
				break;
			case 6 :
				fileType = "WPS Doc";
				break;
			case 7 :
				fileType = "Kingsoft Sheet";
				break;
			default :
				fileType = "unkownfiletype";
		}
		TANGER_OCX_OBJ.ActiveDocument.AcceptAllRevisions();//接收所有修订
		result = TANGER_OCX_OBJ.SaveAsOtherFormatToURL(5, this.saveURL, "fileUpload",
                                "fileType=" + fileType + "&BillKey=" + billKey + "&BillID="
                                                + billID, fileName, 0); // 如果fileName 指定为aa.doc 则会生成aa.doc如果不指定 则会在后台生成 新文件.doc
		//TANGER_OCX_OBJ.ActiveDocument.ShowRevisions = false;
		// 另外保存一份html
		if (TANGER_OCX_OBJ.doctype == 6) {
			TANGER_OCX_OBJ.PublishAsHTMLToURL(this.saveURL,"fileUpload",
			"fileType=" + fileType + "&BillKey=" + billKey + "_View&BillID="
			+ billID, billID+".htm", 0); 
		} else {
			TANGER_OCX_OBJ.PublishAsHTMLToURL(this.saveURL,"fileUpload",
			"fileType=" + fileType + "&BillKey=" + billKey + "_View&BillID="
			+ billID, billID, 0); 	
		}
	},
	load : function() {
		//if (!$.browser.msie)
			//return;
		TANGER_OCX_OBJ = document.getElementById("TANGER_OCX");
		TANGER_OCX_OBJ.TitleBar = false;
		TANGER_OCX_OBJ.WebUserName = MAP_Office.getCurrUserName();
//		TANGER_OCX_OBJ.AddCustomButtonOnMenu(1, "定义数据区域", true, 1);
//		TANGER_OCX_OBJ.AddCustomButtonOnMenu(2, "替换数据区域", true, 2);
//		TANGER_OCX_OBJ.AddCustomButtonOnMenu(4, "隐藏留痕", true, 4);
//		TANGER_OCX_OBJ.AddCustomButtonOnMenu(5, "显示留痕", true, 5);
		if (ISEDITOR == 'true') {
			ISEDITOR = false;
		} else if(ISEDITOR == 'false') {
			ISEDITOR = true;
			TANGER_OCX_OBJ.ToolBars = false;
			TANGER_OCX_OBJ.Menubar = false;
		}
		// 对应表单中的修改
			var isFileExist = MAP_Office.isHasFile(BILLKEY+"\\"+BILLID);
			if (isFileExist != false) {
				TANGER_OCX_OBJ.OpenFromURL(this.openURL,false);
				if (TANGER_OCX_OBJ.doctype == 1 || TANGER_OCX_OBJ.doctype == 6) {
					TANGER_OCX_OBJ.ActiveDocument.TrackRevisions = true; //打开修订模式
					TANGER_OCX_OBJ.ActiveDocument.ShowRevisions = false;
					TANGER_OCX_OBJ.AddCustomButtonOnMenu(4, "显示留痕", true, 4);
					TANGER_OCX_OBJ.AddCustomButtonOnMenu(5, "隐藏留痕", true, 5);
				}
			}
			if (isFileExist == false) {
				if (TANGER_OCX_OBJ.GetWPSVer() == 6) {
					TANGER_OCX_OBJ.CreateNew("WPS.Document");// wps 2005,2007
				} else if (TANGER_OCX_OBJ.GetWPSVer() == 100) {
					TANGER_OCX_OBJ.CreateNew("Word.Document");
				} else {
					TANGER_OCX_OBJ.CreateNew("WPSFile.4.8001");// WPS2003
				}
			}
			TANGER_OCX_OBJ.SetReadOnly(ISEDITOR); 
	},
	setReadOnly : function(isReadOnly) {
		if (TANGER_OCX_OBJ != undefined) {
			if (isReadOnly) {
				TANGER_OCX_OBJ.ToolBars = false;
				TANGER_OCX_OBJ.Menubar = false;
			} else {
				TANGER_OCX_OBJ.ToolBars = true;
				TANGER_OCX_OBJ.Menubar = true;
			}
			TANGER_OCX_OBJ.SetReadOnly(isReadOnly);
		}
	},
	replaceText : function() {
		if (TANGER_OCX_OBJ != undefined) {
			var bookMarks = TANGER_OCX_OBJ.ActiveDocument.BookMarks;
			var count = bookMarks.count;
			for (var i = 1; i <= count; i++) {
				var bookMarkKey = bookMarks(i).Name;
				var bookMarkValue = TANGER_OCX_OBJ.GetBookmarkValue(bookMarkKey);
				TANGER_OCX_OBJ.SetBookmarkValue(bookMarkKey, bookMarkValue + "_replace");
			}
		}
	},
	// 添加服务器红头文件
	doTaoHong : function(url) {
		if (TANGER_OCX_OBJ != undefined) {
			TANGER_OCX_OBJ.ActiveDocument.Application.Selection.HomeKey(6);
			TANGER_OCX_OBJ.AddTemplateFromURL(url);
		}
	},
	// 添加套红工具栏
	addTaoHong : function() {
		TANGER_OCX_OBJ.AddCustomMenu2(3,"添加套红");
		$.ajax({
			type : 'post',
			async : false,
			url : MAP_C_SERVER_URL + '/rfc.do?__webCall=1&__out=1&__exp=getalltemname({approval\\template})',
			success : function (_resJson) {
				var _json =  eval('('+_resJson+')');
				for (var i = 0; i < _json.length; i++) {
					var fileName = _json[i].fileName;
					TANGER_OCX_OBJ.AddCustomMenuItem2(3,i,-1,false,fileName,false);
				}
			}
		});
	},
	// 打印预览
	printPrevView : function() {
		if (TANGER_OCX_OBJ != undefined) {
			var isFileExist = MAP_Office.isHasFile(BILLKEY+"\\"+BILLID);
			if (isFileExist != false) {
				TANGER_OCX_OBJ.FullScreenMode=true;
				TANGER_OCX_OBJ.PrintPreview();
			}
		}
	},
	// 打印
	printOut : function() {
		if (TANGER_OCX_OBJ != undefined) {
			var isFileExist = MAP_Office.isHasFile(BILLKEY+"\\"+BILLID);
			if (isFileExist != false) {
				TANGER_OCX_OBJ.PrintOut(true);
			}
		}
	},
	// 添加保存到服务器按钮
	addSaveIcon : function() {
		if (TANGER_OCX_OBJ != undefined) {
			TANGER_OCX_OBJ.AddCustomButtonOnMenu(6,"保存",false,6);
		}
	},
	// 保存按钮操作
	saveFileToURLAndClose : function() {
		if (TANGER_OCX_OBJ != undefined) {
			if (TANGER_OCX_OBJ.doctype == 1 || TANGER_OCX_OBJ.doctype == 6) {
				fileName = "新文档.doc";
				if (DOCNAME != undefined && DOCNAME != 'null' & DOCNAME != '') {
					fileName = DOCNAME+".doc";
				}
				MAP_Office.saveFileToURL(BILLKEY,BILLID,fileName);

			} else {
				MAP_Office.saveFileToURL(BILLKEY,BILLID);
			}
			window.alert('保存成功！');
			TANGER_OCX_OBJ.Close();
			window.close();
		}
	}
}
