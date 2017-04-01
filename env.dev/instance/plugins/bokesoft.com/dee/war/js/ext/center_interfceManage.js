/**
 * /** 中间面板的生成XML的Grid
 */
function center_buildXML() {

	function buildXML(type) {
		var records = p_CheckboxModel.getSelection();
		if (records.length == 0) {
			alert('请选择要生成的接口');
			return;
		}
		bodyLoadingMask.show();
		var url = 'interfaceManageController.do';
		var interfaceList = [];
		for (var i = 0; i < records.length; i++) {
			interfaceList[i] = records[i].data;
		}
		var interfaceListJson = Ext.encode(interfaceList);
		Ext.Ajax.request({
					url : url,
					params : {
						actionType : type,
						interfaceList : interfaceListJson
					},
					success : function(response) {
						bodyLoadingMask.hide();
						Ext.Msg.alert('提示', response.responseText);
						if ('生成配置文件成功' == response.responseText) {
							p_store.load();
						}
					},
					failure : function(response) {
						bodyLoadingMask.hide();
						Ext.Msg.alert('提示', '生成配置文件失败');
					}
				});
	}

	function build_del() {
		var records = p_CheckboxModel.getSelection();
		if (records.length == 0) {
			Ext.Msg.alert('提示', '请选择要删除的接口');
			return;
		}
		var url = 'interfaceManageController.do';
		var interfaceList = [];
		for (var i = 0; i < records.length; i++) {
			interfaceList[i] = records[i].data.text;
		}
		var interfaceListJson = Ext.encode(interfaceList);
		deleteBuildConfig(interfaceListJson);
	}

	var p_tbar_items = [{
		text : '调试模式',
		scale : 'small',
		hidden : isHiddenFromPermission('interfce_manage',
				'findInterfaceStore', 'build_debug'),
		width : 80,
		icon : 'images/tiaoshimoshi.png',
		handler : function() {
			buildXML('build_debug');
		}
	}, {
		text : '运行模式',
		scale : 'small',
		hidden : isHiddenFromPermission('interfce_manage',
				'findInterfaceStore', 'build_run'),
		icon : 'images/yunxingmoshi.png',
		width : 80,
		handler : function() {
			buildXML('build_run');
		}
	}, {
		text : '删除运行文件',
		scale : 'small',
		hidden : isHiddenFromPermission('interfce_manage',
				'findInterfaceStore', 'build_del'),
		icon : 'images/shanchu.png',
		width : 120,
		handler : function() {
			build_del();
		}
	}];

	var p_CheckboxModel = Ext.create('Ext.selection.CheckboxModel', {
				mode : 'MULTI',
				listeners : {
					select : function(m, record, index) {
						p.p_sel_record = record;
						p.p_sel_model = m.getSelection()[0];
						p.p_sel_index = index;
					}
				}
			});

	var p_store_u = 'interfaceInfoFindController.do?actionType=findInterfaceStoreForBuildXML';
	var p_store = new Ext.data.Store({
				model : 'InterfaceBuild',
				proxy : {
					type : 'ajax',
					url : p_store_u
				},
				autoLoad : true,
				listeners : {
					load : function(me) {
						bodyLoadingMask.hide();
					}
				}
			});

	var tit = '接口管理 >> 生成运行文件';
	tit = changeColorToRed(tit);
	var p = Ext.create('Ext.grid.Panel', {
				border : 0,
				id : 'center_buildXML',
				height : '100%',
				width : '100%',
				viewConfig : {
					loadMask : false
				},
				title : tit,
				selModel : p_CheckboxModel,
				tbar : {
					items : p_tbar_items
				},
				columns : [{
							header : '接口名称',
							dataIndex : 'text',
							sortable : false,
							menuDisabled : true,
							flex : 2
						}, {
							header : '启动方式',
							dataIndex : 'autoRun',
							sortable : false,
							menuDisabled : true,
							flex : 1,
							renderer : function(value) {
								if (value == 'true')
									return '自动';
								else
									return '手动';
							}
						}, {
							header : '是否已生成',
							dataIndex : 'isAlreadyBuild',
							sortable : false,
							menuDisabled : true,
							flex : 1,
							renderer : function(value) {
								if (value == true)
									return '是';
								else
									return '否';
							}
						}, {
							header : '接口描述',
							dataIndex : 'description',
							sortable : false,
							menuDisabled : true,
							flex : 7
						}],
				store : p_store
			})
	return p;
};
/**
 * 中间面板的生成XML的Grid
 */
function center_interfaceRunManager() {

	var p_store_refresh = 'interfaceRunManagerController.do?actionType=refresh';
	var p_store_reload = 'interfaceRunManagerController.do?actionType=reload';
	var p_tbar_items = [{
		text : '重新加载所有接口',
		scale : 'small',
		hidden : isHiddenFromPermission('interfce_manage', 'refresh', 'reload'),
		width : 130,
		icon : 'images/chongxinjiazaisuoyoujiekou.png',
		handler : function() {
			bodyLoadingMask.show();
			p_store.load({
						url : p_store_reload
					});
		}
	}, {
		text : '刷新',
		scale : 'small',
		hidden : isHiddenFromPermission('interfce_manage', 'refresh', 'refresh'),
		width : 80,
		icon : 'images/shuaxin.png',
		handler : function() {
			bodyLoadingMask.show();
			p_store.load({
						url : p_store_refresh
					});
		}
	}];

	var p_CheckboxModel = Ext.create('Ext.selection.CheckboxModel', {
				mode : 'SINGLE'
			});

	var p_store = Ext.create('Ext.data.Store', {
				id : 'interfaceRunManagerStore',
				model : 'InterfaceManager',
				proxy : {
					type : 'ajax',
					timeout : 600000,
					url : p_store_refresh
				},
				autoLoad : true,
				listeners : {
					load : function(me) {
						bodyLoadingMask.hide();
					}
				}
			});

	var tit = '接口管理 >> 接口运行管理';
	tit = changeColorToRed(tit);
	var p = Ext.create('Ext.grid.Panel', {
				border : 0,
				id : 'center_interfaceRunManager',
				height : '100%',
				width : '100%',
				viewConfig : {
					loadMask : false
				},
				title : tit,
				// selModel : p_CheckboxModel,
				tbar : {
					items : p_tbar_items
				},
				columns : [{
							header : '接口名称',
							dataIndex : 'text',
							sortable : false,
							menuDisabled : true,
							flex : 4
						}, {
							header : '启动方式',
							dataIndex : 'autoRun',
							sortable : false,
							menuDisabled : true,
							flex : 2,
							renderer : function(value) {
								if (value == 'true')
									return '自动';
								else
									return '手动';
							}
						}, {
							header : '运行模式',
							dataIndex : 'runMode',
							sortable : false,
							menuDisabled : true,
							flex : 3
						}, {
							header : '生成时间',
							dataIndex : 'createDateTime',
							sortable : false,
							menuDisabled : true,
							flex : 5
						}, {
							header : '接口描述',
							dataIndex : 'description',
							sortable : false,
							menuDisabled : true,
							flex : 7
						}, {
							header : '操作',
							dataIndex : 'description',
							sortable : false,
							menuDisabled : true,
							flex : 5,
							renderer : function(value, metaData, record) {
								return interfaceManagerButton(record);
							}
						}],
				store : p_store
			});
	return p;
};

/**
 * 同步面板
 */
function center_synch() {
	var title = changeColorToRed('接口管理 >> 同步');
	var synchComboboxUrl = 'interfaceInfoFindController.do?actionType=findSynchCombobox';
	var synchGridUrl = 'interfaceInfoFindController.do?actionType=findSynchGrid';
	var findSendInfoUrl = 'interfaceSynPrepareController.do?actionType=synchData';
	var propertyGridUrl = 'interfaceSimpleConfigController.do?actionType=getAllSdInterfaces';
	var synchDataUrl = '/interfaceSynController.do';
	var findSystemInfoURL = 'interfaceInfoFindDownloadController.do?actionType=findDownloadStore&type=DownloadSource.json';
	var cookie = new JSCookie();
	var ggpzGrid_store = Ext.create('Ext.data.Store', {
				model : 'Synchggpz'
			})
	var interfaceGrid_store = Ext.create('Ext.data.Store', {
				model : 'SynchInterface'
			})
	var timingTaskGrid_store = Ext.create('Ext.data.Store', {
				model : 'SynchTimingTask'
			})
	var propertyGrid_store = Ext.create('Ext.data.Store', {
				model : 'SynchProperty'
			})

	var YigoConfigGrid_store = Ext.create('Ext.data.Store', {
				model : 'YigoConfig'
			});
	var DownloadSourceGrid_store = Ext.create('Ext.data.Store', {
				model : 'DownloadFileInformation'
			});

	var DownloadSourceGrid_CheckboxModel = Ext.create(
			'Ext.selection.CheckboxModel', {
				mode : 'MULTI'
			});
	var YigoConfigGrid_CheckboxModel = Ext.create(
			'Ext.selection.CheckboxModel', {
				mode : 'MULTI'
			});
	var ggpzGrid_CheckboxModel = Ext.create('Ext.selection.CheckboxModel', {
				mode : 'MULTI'
			});
	var interfaceGrid_CheckboxModel = Ext.create('Ext.selection.CheckboxModel',
			{
				mode : 'MULTI'
			});
	var timingTaskGrid_CheckboxModel = Ext.create(
			'Ext.selection.CheckboxModel', {
				mode : 'MULTI'
			});
	var propertyGrid_CheckboxModel = Ext.create('Ext.selection.CheckboxModel',
			{
				mode : 'MULTI'
			});
	var propertyGrid = Ext.create('Ext.grid.Panel', {
				id : 'synchPropertyGrid',
				width : '100%',
				hidden : true,
				loadMask : true,
				sortableColumns : false,
				title : changeColorToRed('同步源'),
				selModel : propertyGrid_CheckboxModel,
				columns : [{
							header : '名称',
							dataIndex : 'key',
							sortable : false,
							menuDisabled : true,
							flex : 3
						}, {
							header : '值',
							dataIndex : 'value',
							sortable : false,
							menuDisabled : true,
							flex : 3
						}, {
							header : '描述',
							dataIndex : 'description',
							sortable : false,
							menuDisabled : true,
							flex : 10
						}],
				store : propertyGrid_store
			});

	var ggpzGrid = Ext.create('Ext.grid.Panel', {
				id : 'synchGgpzGrid',
				width : '100%',
				loadMask : true,
				hidden : true,
				sortableColumns : false,
				title : changeColorToRed('同步源'),
				selModel : ggpzGrid_CheckboxModel,
				columns : [{
							header : '配置名称',
							sortable : false,
							menuDisabled : true,
							dataIndex : 'text',
							flex : 3
						}, {
							header : '配置类型',
							sortable : false,
							menuDisabled : true,
							dataIndex : 'smallType',
							flex : 3
						}, {
							header : '配置描述',
							sortable : false,
							menuDisabled : true,
							dataIndex : 'description',
							flex : 10
						}],
				store : ggpzGrid_store
			});

	var interfaceGrid = Ext.create('Ext.grid.Panel', {
				id : 'synchInterfaceGrid',
				width : '100%',
				loadMask : true,
				hidden : true,
				sortableColumns : false,
				title : changeColorToRed('同步源'),
				selModel : interfaceGrid_CheckboxModel,
				columns : [{
							header : '接口名称',
							dataIndex : 'interfaceName',
							sortable : false,
							menuDisabled : true,
							flex : 3
						}, {
							header : '服务名称',
							dataIndex : 'text',
							sortable : false,
							menuDisabled : true,
							flex : 3
						}, {
							header : '服务描述',
							dataIndex : 'description',
							sortable : false,
							menuDisabled : true,
							flex : 10
						}],
				store : interfaceGrid_store
			});

	var timingTaskGrid = Ext.create('Ext.grid.Panel', {
				id : 'synchTimingTaskGrid',
				width : '100%',
				loadMask : true,
				hidden : true,
				sortableColumns : false,
				title : changeColorToRed('同步源'),
				selModel : timingTaskGrid_CheckboxModel,
				columns : [{
							header : '任务名称',
							dataIndex : 'taskname',
							sortable : false,
							menuDisabled : true,
							flex : 1
						}, {
							header : '任务描述',
							sortable : false,
							menuDisabled : true,
							dataIndex : 'desc',
							flex : 1
						}],
				store : timingTaskGrid_store
			});
	var DownloadSourceGrid = Ext.create('Ext.grid.Panel', {
				id : 'synchDownloadSourceGrid',
				width : '100%',
				loadMask : true,
				hidden : true,
				sortableColumns : false,
				title : changeColorToRed('同步源'),
				selModel : DownloadSourceGrid_CheckboxModel,
				columns : [{
							header : '资源类型',
							dataIndex : 'FileType',
							sortable : false,
							menuDisabled : true,
							flex : 1
						}, {
							header : '资源描述',
							sortable : false,
							menuDisabled : true,
							dataIndex : 'FileDescription',
							flex : 1
						}],
				store : DownloadSourceGrid_store
			});
	var YigoConfigGrid = Ext.create('Ext.grid.Panel', {
				id : 'synYigoConfigGrid',
				width : '100%',
				loadMask : true,
				hidden : true,
				sortableColumns : false,
				title : changeColorToRed('同步源'),
				selModel : YigoConfigGrid_CheckboxModel,
				columns : [{
							header : '预配置名称',
							sortable : false,
							menuDisabled : true,
							dataIndex : 'text',
							flex : 3
						}, {
							header : '预配置类型',
							sortable : false,
							menuDisabled : true,
							dataIndex : 'type',
							flex : 3
						}, {
							header : '预配置描述',
							sortable : false,
							menuDisabled : true,
							dataIndex : 'description',
							flex : 10
						}],
				store : YigoConfigGrid_store
			});

	function initAddress() {
		var ipData = cookie.GetCookie('ipData');
		var portData = cookie.GetCookie('portData');
		var contextData = cookie.GetCookie('contextData');
		if (ipData != null && '' != ipData) {
			synchComboboxIPAddress.store.add(Ext.decode(ipData));
			getCmp('synchComboboxIPAddress')
					.setValue(Ext.decode(ipData)[0].value);
		}
		if (portData != null && '' != portData) {
			synchComboboxPort.store.add(Ext.decode(portData));
			getCmp('synchComboboxPort').setValue(Ext.decode(portData)[0].value);
		}
		if (contextData != null && '' != contextData) {
			synchComboboxContext.store.add(Ext.decode(contextData));
			getCmp('synchComboboxContext')
					.setValue(Ext.decode(contextData)[0].value);
		}
	}

	function recordAddress(ip, port, context) {
		var store = synchComboboxIPAddress.store;
		var isAdd = true;
		for (var i = 0, n = store.getCount(); i < n; i++) {
			if (store.getAt(i).data.value == ip) {
				isAdd = false;
				break;
			}
		}
		var data = {
			displayField : ip,
			value : ip
		}
		var tempJson = cookie.GetCookie('ipData');
		tempJson = tempJson == '' ? '[]' : tempJson;
		var ipDataCookie = Ext.decode(tempJson);
		var ipData = [data];
		if (isAdd) {
			for (var i = 1, n = ipDataCookie.length + 1 < 6
					? ipDataCookie.length + 1
					: 5; i < n; i++) {
				ipData[i] = ipDataCookie[i - 1];
			}
			store.insert(0, data);
		} else {
			var j = 1;
			for (var i = 0, n = ipDataCookie.length < 6
					? ipDataCookie.length
					: 5; i < n; i++) {
				if (ipDataCookie[i].value != ip) {
					ipData[j++] = ipDataCookie[i];
				}
			}
		}
		cookie.SetCookie('ipData', Ext.encode(ipData));
		isAdd = true;
		store = synchComboboxPort.store;
		for (var i = 0, n = store.getCount(); i < n; i++) {
			if (store.getAt(i).data.value == port) {
				isAdd = false
				break;
			}
		}
		data = {
			displayField : port,
			value : port
		}
		tempJson = cookie.GetCookie('portData');
		tempJson = tempJson == '' ? '[]' : tempJson;
		var portDataCookie = Ext.decode(tempJson);
		var portData = [];
		portData[0] = data;
		if (isAdd) {
			for (var i = 1, n = portDataCookie.length + 1 < 6
					? portDataCookie.length + 1
					: 5; i < n; i++) {
				portData[i] = portDataCookie[i - 1];
			}
			store.insert(0, data);
		} else {
			var j = 1;
			for (var i = 0, n = portDataCookie.length < 6
					? portDataCookie.length
					: 5; i < n; i++) {
				if (portDataCookie[i].value != port) {
					portData[j++] = portDataCookie[i];
				}
			}
		}
		cookie.SetCookie('portData', Ext.encode(portData));
		isAdd = true;
		store = synchComboboxContext.store;
		for (var i = 0, n = store.getCount(); i < n; i++) {
			if (store.getAt(i).data.value == context) {
				isAdd = false;
				break;
			}
		}
		data = {
			displayField : context,
			value : context
		}
		tempJson = cookie.GetCookie('contextData');
		tempJson = tempJson == '' ? '[]' : tempJson;
		var contextDataCookie = Ext.decode(tempJson);
		var contextData = [];
		contextData[0] = data;
		if (isAdd) {
			for (var i = 1, n = contextDataCookie.length + 1 < 6
					? contextDataCookie.length + 1
					: 5; i < n; i++) {
				contextData[i] = contextDataCookie[i - 1];
			}
			store.insert(0, data);
		} else {
			var j = 1;
			for (var i = 0, n = contextDataCookie.length < 6
					? contextDataCookie.length
					: 5; i < n; i++) {
				if (contextDataCookie[i].value != context) {
					contextData[j++] = contextDataCookie[i];
				}
			}
		}
		cookie.SetCookie('contextData', Ext.encode(contextData));
	}

	var synchCombobox = {
		frame : false,
		xtype : 'combobox',
		fieldLabel : '选择要同步的模块',
		width : 400,
		height : 30,
		hidden : false,
		id : 'synchCombobox',
		editable : false,
		displayField : 'displayField',
		valueField : 'value',
		queryMode : 'local',
		value : '请选择同步的模块',
		store : Ext.create('Ext.data.Store', {
					model : 'SynchCombobox',
					proxy : {
						type : 'ajax',
						url : synchComboboxUrl
					},
					autoLoad : true
				}),
		listeners : {
			select : function(combox, record) {
				var data = record[0].data;
				if (data.type == 'synchGgpz') {
					ggpzGrid_store.load({
								url : synchGridUrl,
								params : {
									type : data.value
								}
							});
					ggpzGrid.show();
					interfaceGrid.hide();
					timingTaskGrid.hide();
					YigoConfigGrid.hide();
					propertyGrid.hide();
					DownloadSourceGrid.hide();
				} else if (data.type == 'synchProperty') {
					propertyGrid_store.load({
								url : synchGridUrl,
								params : {
									type : data.value
								}
							});
					ggpzGrid.hide();
					interfaceGrid.hide();
					YigoConfigGrid.hide();
					timingTaskGrid.hide();
					propertyGrid.show();
					DownloadSourceGrid.hide();
				} else if (data.type == 'synchInterface') {
					interfaceGrid_store.load({
								url : synchGridUrl,
								params : {
									type : data.value
								}
							});
					ggpzGrid.hide();
					propertyGrid.hide();
					timingTaskGrid.hide();
					YigoConfigGrid.hide();
					DownloadSourceGrid.hide();
					interfaceGrid.show();
				} else if (data.type == 'synchTimingTask') {
					timingTaskGrid_store.load({
								url : synchGridUrl,
								params : {
									type : data.value
								}
							});
					ggpzGrid.hide();
					propertyGrid.hide();
					interfaceGrid.hide();
					YigoConfigGrid.hide();
					timingTaskGrid.show();
					DownloadSourceGrid.hide();
				} else if (data.type == 'synchDownloadSource') {
					DownloadSourceGrid_store.load({
								url : findSystemInfoURL
							});
					ggpzGrid.hide();
					propertyGrid.hide();
					interfaceGrid.hide();
					YigoConfigGrid.hide();
					timingTaskGrid.hide();
					DownloadSourceGrid.show();
				} else if (data.type == 'synchSdInterfaces') {
					YigoConfigGrid_store.setProxy({
								type : 'ajax',
								url : propertyGridUrl,
								reader : {
									root : 'data'
								}
							});
					YigoConfigGrid_store.load();
					ggpzGrid.hide();
					propertyGrid.hide();
					interfaceGrid.hide();
					timingTaskGrid.hide();
					YigoConfigGrid.show();
					DownloadSourceGrid.hide();
				}
			}
		}
	}

	var isOverWrite = {
		xtype : 'checkboxfield',
		fieldLabel : '名称相同时覆盖',
		name : 'isOverWrite',
		inputValue : '1',
		height : 30,
		id : 'isOverWrite'
	}

	var synchComboboxIPAddress = Ext.create('Ext.form.ComboBox', {
				fieldLabel : 'IP地址',
				id : 'synchComboboxIPAddress',
				width : 400,
				height : 27,
				hidden : false,
				displayField : 'displayField',
				valueField : 'value',
				queryMode : 'local',
				store : Ext.create('Ext.data.Store', {
							model : 'SimpleCombox'
						})
			});

	var synchComboboxPort = Ext.create('Ext.form.ComboBox', {
				fieldLabel : '端口',
				id : 'synchComboboxPort',
				width : 400,
				height : 27,
				hidden : false,
				displayField : 'displayField',
				valueField : 'value',
				queryMode : 'local',
				store : Ext.create('Ext.data.Store', {
							model : 'SimpleCombox'
						})
			})

	var synchComboboxContext = Ext.create('Ext.form.ComboBox', {
				fieldLabel : 'Context',
				id : 'synchComboboxContext',
				width : 400,
				height : 27,
				hidden : false,
				displayField : 'displayField',
				valueField : 'value',
				queryMode : 'local',
				value : 'BokeDee',
				store : Ext.create('Ext.data.Store', {
							model : 'SimpleCombox'
						})
			})

	function synchData() {
		var ip = getCmp('synchComboboxIPAddress').lastValue;
		var port = getCmp('synchComboboxPort').lastValue;
		var context = getCmp('synchComboboxContext').lastValue;
		if (ip == null || '' == ip) {
			Ext.Msg.alert('提示', 'IP地址不可以为空');
			return;
		}
		if (port == null || '' == port) {
			Ext.Msg.alert('提示', '端口不可以为空');
			return;
		}
		if (context == null || '' == context) {
			Ext.Msg.alert('提示', 'Context不可以为空');
			return;
		}
		recordAddress(ip, port, context);
		if (getCmp('synchCombobox').lastValue == '请选择同步的模块') {
			Ext.Msg.alert('提示', '请选择同步的模块');
			return;
		}
		var url = 'http://' + ip + ':' + port + '/' + context + synchDataUrl;
		var data = [];
		var operatorType = getCmp('isOverWrite').checked == true
				? 'override'
				: 'ignore';
		var actionType;
		var synchComboboxValue = getCmp('synchCombobox').lastValue;
		var selection;
		if ('DataSource.json' == synchComboboxValue) {
			actionType = 'synDataSource';
			selection = getCmp('synchGgpzGrid').getSelectionModel()
					.getSelection();
		} else if ('Connector.json' == synchComboboxValue) {
			actionType = 'synConnector';
			selection = getCmp('synchGgpzGrid').getSelectionModel()
					.getSelection();
		} else if ('SpringBean.json' == synchComboboxValue) {
			actionType = 'synSpringBean';
			selection = getCmp('synchGgpzGrid').getSelectionModel()
					.getSelection();
		} else if ('GlobalSource.json' == synchComboboxValue) {
			actionType = 'synGlobalSource';
			selection = getCmp('synchPropertyGrid').getSelectionModel()
					.getSelection();
		} else if ('WebServiceActionMapping.json' == synchComboboxValue) {
			actionType = 'synWebServiceActionMapping';
			selection = getCmp('synchPropertyGrid').getSelectionModel()
					.getSelection();
		} else if ('Interface.json' == synchComboboxValue) {
			actionType = 'synInterface';
			selection = getCmp('synchInterfaceGrid').getSelectionModel()
					.getSelection();
		} else if ('TimingTask.json' == synchComboboxValue) {
			actionType = 'synchTimingTask';
			selection = getCmp('synchTimingTaskGrid').getSelectionModel()
					.getSelection();
		}else if ('DownloadSource.json' == synchComboboxValue) {
			actionType = 'synchDownloadSource';
			selection = getCmp('synchDownloadSourceGrid').getSelectionModel()
					.getSelection();
		}else if ('SdInterfaces.json' == synchComboboxValue) {
			actionType = 'synchSdInterfaces';
			selection = getCmp('synYigoConfigGrid').getSelectionModel()
					.getSelection();
		}
		if ('GlobalSource.json' == synchComboboxValue) {
			for (var i in selection) {
				data[i] = selection[i].data;
				data[i]['bigType'] = 'GlobalSource.json';
			}
		} else if ('TimingTask.json' == synchComboboxValue) {
			for (var i in selection) {
				data[i] = selection[i].data;
				data[i]['bigType'] = 'TimingTask.json';
			}
		} else if ('WebServiceActionMapping.json' == synchComboboxValue) {
			for (var i in selection) {
				data[i] = selection[i].data;
				data[i]['bigType'] = 'WebServiceActionMapping.json';
			}
		}else if ('DownloadSource.json' == synchComboboxValue) {
			for (var i in selection) {
				data[i] = selection[i].data;
				data[i]['bigType'] = 'DownloadSource.json';
			}
		}else if ('SdInterfaces.json' == synchComboboxValue) {
			for (var i in selection) {
				data[i] = selection[i].data;
				data[i]['bigType'] = 'SdInterfaces.json';
			}
		}else {
			for (var i in selection) {
				data[i] = selection[i].data;
			}
		}
		if (data.length == 0) {
			Ext.Msg.alert('提示', '尚未选择同步源');
			return;
		}
		windowSyn(data, url, operatorType, actionType, findSendInfoUrl);
	}
	initAddress();
	var p = Ext.create('Ext.Panel', {
				id : 'center_synch',
				title : title,
				draggable : false,
				resizable : false,
				tbar : {
					items : [{
						text : '开始同步',
						scale : 'small',
						hidden : isHiddenFromPermission('interfce_manage',
								'synchData', 'synchData'),
						width : 85,
						styleHtmlCls : 'btnFont_size_24',
						icon : 'images/kaishitongbu.png',
						handler : function() {
							synchData();
						}
					}]
				},
				defaults : {
					height : '50%'
				},
				border : 0,
				width : '100%',
				height : '100%',
				bodyPadding : 10,
				items : [synchCombobox, propertyGrid, ggpzGrid, interfaceGrid,
						timingTaskGrid, YigoConfigGrid, DownloadSourceGrid,
						isOverWrite, synchComboboxIPAddress, synchComboboxPort,
						synchComboboxContext]
			});
	return p;
}
/**
 * 定时任务 timingTask
 */
function timingTask() {
	var timingTask_JobTypeCombox;
	if (Ext.data.StoreManager.containsKey('timingTask_JobTypeCombox')) {
		timingTask_JobTypeCombox = Ext.data.StoreManager
				.get('timingTask_JobTypeCombox');
	} else {
		timingTask_JobTypeCombox = Ext.create('Ext.data.Store', {
			fields : ['displayField', 'value', 'needservice'],
			storeId : 'timingTask_JobTypeCombox',
			proxy : {
				type : 'ajax',
				url : 'interfaceTimingTaskController.do?actionType=getJobTypeCombox',
				reader : {
					type : 'json'
				}

			},
			autoLoad : true
		});
	}
	var p_tbar_items = [{
		text : '新增',
		scale : 'small',
		hidden : isHiddenFromPermission('interfce_manage', 'timingTask',
				'saveTimingTask'),
		icon : 'images/add.png',
		width : 50,
		handler : function() {
			chooseTask();
		}
	}, {
		text : '修改',
		scale : 'small',
		hidden : isHiddenFromPermission('interfce_manage', 'timingTask',
				'updateTimingTask'),
		icon : 'images/xiugai.png',
		width : 50,
		styleHtmlCls : 'btnFont_size_24',
		handler : function() {
			var record = timingTaskList.record;
			if (record) {
				//if (record.raw.isSystem != "" && record.raw.isSystem) {
				//	Ext.Msg.alert('提示', "系统任务不能修改");
				//	return;
				//} else {
					var data = getTimingRecord(record.raw.id); // 获取接口服务相关数据
					windowaddTimingTask(record.raw.jobtype,
							record.raw.tasktype, data, record.data.mode)// 修改定时任务
				//}
			} else {
				Ext.Msg.alert("提示", "请选择一个！")
				return;
			}
		}
	}, {
		text : '删除',
		scale : 'small',
		hidden : isHiddenFromPermission('interfce_manage', 'timingTask',
				'delTimingTask'),
		icon : 'images/shanchu.png',
		width : 50,
		handler : function() {
			if (timingTaskList.record) {
				if (timingTaskList.record.raw.isSystem != ""
						&& timingTaskList.record.raw.isSystem) {
					Ext.Msg.alert('提示', "系统任务不能删除");
					return;
				};
				if (timingTaskList.record.data.mode == 'true') {// 启用状态不能删除
					Ext.Msg.alert("提示", "任务启用状态不能删除,请先禁用")
					return;
				} else {
					deleteTimingTask(timingTaskList.record.data['id'],
							timingTaskList.index);
				}
			} else {
				Ext.Msg.alert("提示", "请选择一个！")
				return;
			}
		}
	}];
	var CheckboxModel = Ext.create('Ext.selection.CheckboxModel', {
				mode : 'SINGLE',
				listeners : {
					select : function(m, record, index) {
						timingTaskList.record = record;
						timingTaskList.index = index;
					}
				}
			});

	var timingTask_storeURL = 'interfaceTimingTaskController.do?actionType=getAllTimingTask';
	var timingTask_store = Ext.create('Ext.data.Store', {
				model : 'TimingTask',
				storeId : 'timingTask_store',
				proxy : {
					type : 'ajax',
					url : timingTask_storeURL
				},
				sorters : {
					property : 'isSystem',
					direction : 'ASC'
				},
				autoLoad : true
			});

	var title = changeColorToRed('接口管理 >> 定时任务');
	var timingTaskList = Ext.create('Ext.grid.Panel', {
		id : 'taskList',
		title : title,
		border : 0,
		width : '100%',
		height : '100%',
		autoScroll : true,
		selModel : CheckboxModel,
		tbar : {
			items : p_tbar_items
		},
		flex : 10,
		columns : [{
					xtype : 'rownumberer',
					sortable : false,
					menuDisabled : true,
					width : 30,
					sortable : false
				}, {
					header : 'id',
					hidden : true,
					sortable : false,
					menuDisabled : true,
					dataIndex : 'id'
				}, {
					header : '任务名称',
					flex : 1,
					sortable : false,
					menuDisabled : true,
					dataIndex : 'taskname'
				}, {
					header : '任务描述',
					flex : 1,
					sortable : false,
					menuDisabled : true,
					dataIndex : 'desc'
				}, {
					header : '级别',
					flex : 1,
					sortable : false,
					menuDisabled : true,
					renderer : function(value) {
						return value == 'true' ? '系统' : '自定义';
					},
					dataIndex : 'isSystem'
				}, {
					header : '接口名称',
					flex : 2,
					sortable : false,
					menuDisabled : true,
					dataIndex : 'interfaces'
				}, {
					header : '服务名称',
					flex : 2,
					sortable : false,
					menuDisabled : true,
					dataIndex : 'service'
				}, {
					header : '启动方式',
					flex : 1,
					sortable : false,
					menuDisabled : true,
					renderer : function(value) {
						return value == 'true' ? '手动启动' : '自动启动';
					},
					dataIndex : 'enable'
				}, {
					header : '任务类型',
					flex : 3,
					sortable : false,
					menuDisabled : true,
					renderer : function(value) {
						var URL = 'interfaceTimingTaskController.do?actionType=getJobTypeComboxDisplayField&value=';
						return ajaxSyncCall(URL + value, null, null);
					},
					dataIndex : 'jobtype'
				}, {
					header : '触发类型',
					flex : 1,
					sortable : false,
					menuDisabled : true,
					renderer : function(value) {
						return value == 'true' ? '简单' : '复杂';
					},
					dataIndex : 'tasktype'
				}, {
					header : '创建日期',
					flex : 2,
					sortable : false,
					menuDisabled : true,
					dataIndex : 'createtime'
				}, {
					header : '修改日期',
					flex : 2,
					sortable : false,
					menuDisabled : true,
					dataIndex : 'modifytime'
				}, {
					header : 'mode',
					hidden : true,
					sortable : false,
					menuDisabled : true,
					dataIndex : 'mode'
				}, {
					header : '操作',
					sortable : false,
					menuDisabled : true,
					flex : 1,
					renderer : function(value, metaData, record) {
						return TimingTaskManagerButton(record);
					},
					dataIndex : 'mode'
				}],
		store : timingTask_store,
		listeners : {
			itemdblclick : function(view, record, item, index, event) {
				//if (record.raw.isSystem != "" && record.raw.isSystem) {
				//	Ext.Msg.alert('提示', "系统任务不能修改");
				//	return;
				//} else {
					var b = record.raw.tasktype;
					var data = getTimingRecord(record.raw.id); // 获取接口服务相关数据
					windowaddTimingTask(record.raw.jobtype,
							record.raw.tasktype, data, record.data.mode)// 修改定时任务
				//}
			}
		}
	});
	return timingTaskList;

}
/**
 * 根据定时任务的id查询接口和服务的store
 */
function getTimingRecord(id) {
	var URL = 'interfaceTimingTaskController.do?actionType=getRecordByID&TimingTaskId='
			+ id;
	var record = ajaxSyncCall(URL, null, null);
	return Ext.decode(record);
}
/**
 * 定时任务按钮的事件
 */
function StartOrStop(id, mode) {
	var StartURL = 'interfaceTimingTaskController.do?actionType=startTimingTask';
	var StopURL = 'interfaceTimingTaskController.do?actionType=stopTimingTask';
	Ext.Ajax.request({
				url : mode == 'true' ? StopURL : StartURL,
				params : {
					TimingTaskId : id
				},
				success : function(response) {
					if (response.responseText == "success") {
						Ext.getStore('timingTask_store').load();
					} else {
						Ext.Msg.alert('提示', '失败了:' + response.responseText);
					}
				}
			})
}
/**
 * 按钮状态
 * 
 */
function TimingTaskManagerButton(record) {
	return '<input style="' + changeColour(record.data.mode)
			+ '" type="button" value="' + TinmingTaskButton(record.data.mode)
			+ '" onclick="StartOrStop(\'' + record.data.id + '\',\''
			+ record.data.mode + '\');"/>';
	// if('fail' != record.data.mode){
	// return '<input style="width:80px;height:22px;" type="button" value="' +
	// TinmingTaskButton(record.data.mode) + '"
	// onclick="interfaceRun(\''+record.data.text+'\',\''+record.data.mode+'\');"/>';
	// }
	// return '接口未启动';
}
// change colour
function changeColour(mode) {
	return mode == 'true'
			? 'width:50px;height:22px;background:#9999FF;'
			: 'width:50px;height:22px;background:#FFEE99;';
}

function TinmingTaskButton(value) {
	return value == 'true' ? '禁用' : '启用';
}