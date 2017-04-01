// 整个这段为了支持 IE11
if (Object.hasOwnProperty.call(window, "ActiveXObject") && !window.ActiveXObject) { // is IE11
    Ext.apply(Ext, {
        isIE : false, // cosmetic, since it's false by default for IE11
        isIE11: true,
        ieVersion: 11
    });


    Ext.override(Ext.layout.container.Container, {
        getLayoutTargetSize : function() {
            var target = this.getTarget(),
                ret;


            if (target) {
                ret = target.getViewSize();


                // IE in will sometimes return a width of 0 on the 1st pass of getViewSize.
                // Use getStyleSize to verify the 0 width, the adjustment pass will then work properly
                // with getViewSize
                if ((Ext.isIE || Ext.isIE11) && ret.width == 0){ 
                    ret = target.getStyleSize();
                }


                ret.width -= target.getPadding('lr');
                ret.height -= target.getPadding('tb');
            }
            return ret;
        }
    });
}
////
Ext.onReady(function() {

	Ext.QuickTips.init();
	
	// 所有ajax调用默认 超时时间都为 10分钟
	Ext.Ajax.timeout = 600000;

	// 数据模板
	Ext.regModel('datafiles', {
				fields : [{
							name : 'fileName',
							type : 'string'
						}, {
							name : 'url',
							type : 'string'
						}, {
							name : 'time',
							type : 'string'
						}]
			});
	// 定义数据源对象
	var dataSource = Ext.create('Ext.data.Store', {
				autoLoad : false,
				model : 'datafiles',
				sorters : {
					property : 'time',
					direction : 'DESC'
				}
			});

	document.getElementById('ceshi').innerHTML = "";
	Ext.ClassManager.setAlias('Ext.selection.CheckboxModel',
			'selection.checkboxmodel');

	// 工具栏目录
	var toolbar = Ext.create('Ext.toolbar.Toolbar', {
		id : 'mytoolbar',
		items : [{
			text : '打包下载选中的文件',
			id : 'dabao',
			handler : function() {
				var msg = '';
				var rows = grid.getSelectionModel().getSelection();
				for (var i = 0; i < rows.length; i++) {
					msg = msg + rows[i].get('url') + '>';
				}
				if (rows.length == 0) {
					return;
				} else {
					Ext.MessageBox.confirm("提示", "您确定要下载打包所选的文件吗？", function(
							btnId) {
						if (btnId == 'yes') {
							var requestConfig = {
								url : 'doDownload.jsp',
								params : {
									url : msg
								},
								callback : function(options, success, response) {
									window.open("downloadZipFile.jsp");
								}
							}
							Ext.Ajax.request(requestConfig);
						}

					});
				}

			}
		}]
	});

	// 文件列表
	var grid = Ext.create('Ext.grid.Panel', {
		id : 'mygrid',
		title : urlName,
		renderTo : 'ceshi',
		width : '100%',
		height : '100%',
		frame : true,
		multiSelect : true,
		selModel : {
			selType : 'checkboxmodel'
		},
		tbar : toolbar,
		store : dataSource,
		columns : [{
					xtype : 'rownumberer',
					width : 40,
					sortable : false
				}, {
					header : "文件名",
					width : 300,
					dataIndex : 'fileName',
					sortable : true
				}, {
					header : "修改时间",
					width : 200,
					dataIndex : 'time',
					sortable : true
				}, {
					header : "文件下载",
					xtype : 'actioncolumn',
					width : 100,
					items : [{
						icon : 'images/xiayi.png',
						tooltip : '下载文件',
						getClass : function(value, metadata, record) {
							var fileName = record.get('fileName');
							var a = fileName.length;
							if (fileName.indexOf("<img src=") == -1 && a != 0) {
								return 'x-grid-center-icon';
							} else {
								return 'x-hide-display';
							}

						},
						handler : function(grid, rowIndex, colIndex) {
							var record = grid.getStore().getAt(rowIndex);
							var path = record.get('url');
							var name = record.get('fileName');
							if (name.indexOf("<img src=") == -1) {
								Ext.MessageBox.confirm("提示", "您确定要下载所选的文件吗？",
										function(btnId) {
											if (btnId == 'yes') {
												window
														.open("downloadSimpleFile.jsp?url="
																+ path);
											}
										});
							}
						}
					}

					]
				}]
	});
	// 打开文件夹
	grid.addListener('itemdblclick', click, this);
	function click(view, record, item, index, e) {
		if (typeof(record.raw) != 'undefined') {
			name = record.raw.fileName;
			url = record.raw.url;
		}
		if (name.indexOf("<img src=") == -1) {
			return;
		} else {
			var urlName;
			if (url.lastIndexOf("\\") > url.lastIndexOf("/")) {
				urlName = url.substring(url.lastIndexOf("\\") + 1, url.length);
			} else if ((url.lastIndexOf("\\") < url.lastIndexOf("/"))) {
				urlName = url.substring(url.lastIndexOf("/") + 1, url.length);
			} else {
				urlName = url.substring(url.lastIndexOf("\\") + 1, url.length);
			}
			Ext.getCmp("mygrid").setTitle(urlName);
			dataSource.load({
						type : 'ajax',
						url : 'interfaceInfoDownloadSourceController.do?lujing='
								+ encodeURI(encodeURI(url)),
						reader : {
							type : 'json'
						}
					});
			Ext.getCmp("mytoolbar").add({
				text : urlName + ">>",
				id : url,
				handler : function showDouble(value) {
					Ext.getCmp("mygrid").setTitle(urlName);
					dataSource.load({
						type : 'ajax',
						url : 'interfaceInfoDownloadSourceController.do?lujing='
								+ encodeURI(encodeURI(value.id)),
						reader : {
							type : 'json'
						}
					});
					var items = Ext.getCmp("mytoolbar").items.keys;
					var leng = value.id.length;
					for (var i = 0; i < items.length; i++) {
						var b = items[i].length;
						if (b > leng) {
							Ext.getCmp("mytoolbar").remove(items[i--]);
						}
					}

				},
				iconCls : 'openIcon'
			});
		}
	}

	var pathName;// 文件夹路径名
	var urlName;// 文件夹名

	// 获取路径
	var data = document.getElementsByName("master")[0].value;
	if (data.length == 0) {
		return;
	} else {
		var lujingname = data
				.substring(data.lastIndexOf("\\") + 1, data.length);
		if (lujingname.length == 0) {
			urlName = data;
		} else {
			urlName = lujingname;
		}
		Ext.getCmp("mygrid").setTitle(urlName);
		pathName = data;
		dataSource.load({
			type : 'ajax',
			url : 'interfaceInfoDownloadSourceController.do?lujing=' + encodeURI(encodeURI(pathName)),
			reader : {
				type : 'json'
			}
		});
		Ext.getCmp("mytoolbar").add({
			text : urlName + ">>",
			id : pathName,
			handler : function show() {
				Ext.getCmp("mygrid").setTitle(urlName);
				dataSource.load({
							type : 'ajax',
							url : 'interfaceInfoDownloadSourceController.do?lujing='
									+ encodeURI(encodeURI(pathName)),
							reader : {
								type : 'json'
							}
						});
				var items = Ext.getCmp("mytoolbar").items.keys;
				for (var i = 0; i < items.length; i++) {
					if (items[i] != "dabao" && items[i] != pathName) {
						Ext.getCmp("mytoolbar").remove(items[i--]);
					}
				}

			},
			iconCls : 'openIcon'
		});

	}

});