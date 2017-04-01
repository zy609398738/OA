/**
 * 中间面板日志管理
 */
function center_startLog() {
	var logType = 'startLog';
	var interfaceComboboxURL = 'interfaceInfoFindController.do?actionType=findInterfaceCombobox';
	var serviceComboboxURL = 'interfaceInfoFindController.do?actionType=findServiceCombobox';
	var interfaceCombobox = {
		xtype : 'combobox',
		id : 'interfaceCombobox',
		flex : 1,
		name : 'interfaceCombobox',
		value : '请选择接口',
		store : Ext.create('Ext.data.Store', {
					model : 'Combox',
					proxy : {
						type : 'ajax',
						url : interfaceComboboxURL,
						reader : {
							type : 'json',
							root : 'root'
						}
					},
					autoLoad : true
				}),
		editable : false,
		displayField : 'displayField',
		valueField : 'value',
		queryMode : 'local',
		allowBlank : false,
		listeners : {
			select : function(combobox, record) {
				Ext.Ajax.request({
							url : serviceComboboxURL,
							params : {
								interfaceId : record[0].data.value
							},
							success : function(response) {
								serviceCombobox_store.removeAll();
								var result = response.responseText;
								var j = Ext.decode(result);
								serviceCombobox_store.add(j.root);
							}
						})
			}
		}
	};

	var serviceCombobox_store = new Ext.data.Store({
				model : 'Combox',
				autoLoad : false
			});
	var serviceCombobox = {
		xtype : 'combobox',
		id : 'serviceCombobox',
		name : 'interfaceCombobox',
		value : '请选择服务',
		store : serviceCombobox_store,
		editable : false,
		displayField : 'displayField',
		valueField : 'value',
		queryMode : 'local',
		allowBlank : false
	};

	function searchHandler() {
		if (getCmp('interfaceCombobox').value == '请选择接口') {
			Ext.Msg.alert('提示', '请选择接口');
			return false;
		}
		if (getCmp('endDate').lastValue - getCmp('startDate').lastValue > 2678400000) {
			Ext.Msg.alert('提示', '查询间隔不得超过一个月');
			return;
		};
		p_store.load({
					url : 'interfaceLogManagerController.do?actionType=findLog',
					params : {
						startDate : getCmp('startDate').rawValue,
						endDate : getCmp('endDate').rawValue,
						interfaceId : getCmp('interfaceCombobox').lastValue,
						logType : logType
					}
				});

	}

	var tbar_items = [{
				text : '查询',
				scale : 'small',
				hidden : isHiddenFromPermission('log_manage', 'startLog',
						'findLog'),
				width : 50,
				styleHtmlCls : 'btnFont_size_24',
				icon : 'images/chaxun.png',
				handler : function() {
					searchHandler();
				}
			}, '-', {
				text : '查看',
				scale : 'small',
				hidden : isHiddenFromPermission('log_manage', 'startLog',
						'findLogContent'),
				width : 50,
				styleHtmlCls : 'btnFont_size_24',
				icon : 'images/chakan.png',
				handler : function() {
					if (p.selModel.selected.items.length == 1) {
						windowShowLogContent(logType);
					} else {
						Ext.Msg.alert('提示', '请选择一个');
					}

				}
			}, '-', {
				text : '删除',
				scale : 'small',
				hidden : isHiddenFromPermission('log_manage', 'startLog',
						'deleteLog'),
				width : 50,
				styleHtmlCls : 'btnFont_size_24',
				icon : 'images/shanchu.png',
				handler : function() {
					if (p.selModel.selected.items.length > 0) {
						deleteLogs(logType, p.selModel.selected.items, null,
								'logManager', p.selModel.getSelection());
					} else {
						Ext.Msg.alert('提示', '请选择');
					}
				}
			}]
	var p_columns = [{
				xtype : 'rownumberer',
				width : 35,
				text : '序号',
				menuDisabled : true,
				sortable : false
			}, {
				header : '接口名称',
				sortable : false,
				menuDisabled : true,
				dataIndex : 'text',
				flex : 1
			}, {
				header : '日期',
				sortable : false,
				menuDisabled : true,
				dataIndex : 'date',
				flex : 1

			}, {
				header : '时间',
				sortable : false,
				menuDisabled : true,
				dataIndex : 'time',
				flex : 1
			}, {
				header : '文件名称',
				sortable : false,
				menuDisabled : true,
				dataIndex : 'fileName',
				flex : 1
			}];

	var p_CheckboxModel = Ext.create('Ext.selection.CheckboxModel', {
				mode : 'MULTI',
				checkOnly : true,
				listeners : {
					select : function(m, record, index) {
						p.p_sel_record = record;
						p.p_sel_model = m.getSelection()[0];
						p.p_sel_index = index;
					}
				}
			});

	var p_store_u = 'interfaceInfoFindController.do?actionType=findInterfaceStore';
	var p_store = new Ext.data.Store({
				model : 'logManngerPanel',
				autoLoad : false
			});

	var tit = '日志管理 >> ' + '启动异常日志';
	tit = changeColorToRed(tit);

	var p = Ext.create('Ext.grid.Panel', {
				border : 0,
				id : 'logManager',
				height : '100%',
				width : '100%',
				loadMask : true,
				sortableColumns : false,
				title : tit,
				selModel : p_CheckboxModel,
				dockedItems : [{
							xtype : 'toolbar',
							dock : 'top',
							items : ['开始时间：', {
										xtype : 'datefield',
										name : 'startDate',
										id : 'startDate',
										value : new Date(),
										flex : 1,
										endDateField : 'endDate',
										editable : false
									}, ' 结束时间：', {
										xtype : 'datefield',
										id : 'endDate',
										name : 'endDate',
										value : new Date(),
										startDateField : 'startDate',
										flex : 1,
										editable : false
									}, '要查询的接口：', interfaceCombobox]
						}, {
							xtype : 'toolbar',
							items : tbar_items
						}],
				columns : p_columns,
				store : p_store,
				listeners : {
					itemdblclick : function() {
						if (p.p_sel_record != null) {
							if (isHiddenFromPermission('log_manage',
									'startLog', 'findLogContent') == false) {
								windowShowLogContent(logType,
										getCmp('interfaceCombobox').rawValue);
							}
						}
					}
				}
			});
	return p;
};

/**
 * 中间面板日志管理
 */
function center_loadConfigLog() {
	var logType = 'loadConfigLog';
	var interfaceComboboxURL = 'interfaceInfoFindController.do?actionType=findInterfaceCombobox';
	var serviceComboboxURL = 'interfaceInfoFindController.do?actionType=findServiceCombobox';
	var interfaceCombobox = {
		xtype : 'combobox',
		id : 'interfaceCombobox',
		flex : 1,
		name : 'interfaceCombobox',
		value : '请选择接口',
		store : Ext.create('Ext.data.Store', {
					model : 'Combox',
					proxy : {
						type : 'ajax',
						url : interfaceComboboxURL,
						reader : {
							type : 'json',
							root : 'root'
						}
					},
					autoLoad : true
				}),
		editable : false,
		displayField : 'displayField',
		valueField : 'value',
		queryMode : 'local',
		allowBlank : false,
		listeners : {
			select : function(combobox, record) {
				Ext.Ajax.request({
							url : serviceComboboxURL,
							params : {
								interfaceId : record[0].data.value
							},
							success : function(response) {
								serviceCombobox_store.removeAll();
								var result = response.responseText;
								var j = Ext.decode(result);
								serviceCombobox_store.add(j.root);
							}
						})
			}
		}
	};

	var serviceCombobox_store = new Ext.data.Store({
				model : 'Combox',
				autoLoad : false
			});
	var serviceCombobox = {
		xtype : 'combobox',
		id : 'serviceCombobox',
		name : 'interfaceCombobox',
		value : '请选择服务',
		store : serviceCombobox_store,
		editable : false,
		displayField : 'displayField',
		valueField : 'value',
		queryMode : 'local',
		allowBlank : false
	};

	function searchHandler() {
		if (getCmp('interfaceCombobox').value == '请选择接口') {
			Ext.Msg.alert('提示', '请选择接口');
			return false;
		}
		if (getCmp('endDate').lastValue - getCmp('startDate').lastValue > 2678400000) {
			Ext.Msg.alert('提示', '查询间隔不得超过一个月');
			return;
		};
		p_store.load({
					url : 'interfaceLogManagerController.do?actionType=findLog',
					params : {
						startDate : getCmp('startDate').rawValue,
						endDate : getCmp('endDate').rawValue,
						interfaceId : getCmp('interfaceCombobox').lastValue,
						logType : logType
					}
				});
	}

	var tbar_items = [{
		text : '查询',
		scale : 'small',
		hidden : isHiddenFromPermission('log_manage', 'loadConfigLog',
				'findLog'),
		width : 50,
		styleHtmlCls : 'btnFont_size_24',
		icon : 'images/chaxun.png',
		handler : function() {
			searchHandler();
		}
	}, '-', {
		text : '查看',
		scale : 'small',
		hidden : isHiddenFromPermission('log_manage', 'loadConfigLog',
				'findLogContent'),
		width : 50,
		styleHtmlCls : 'btnFont_size_24',
		icon : 'images/chakan.png',
		handler : function() {
			if (p.selModel.selected.items.length == 1) {
				windowShowLogContent(logType);
			} else {
				Ext.Msg.alert('提示', '请选择一个');
			}
		}
	}, '-', {
		text : '删除',
		scale : 'small',
		hidden : isHiddenFromPermission('log_manage', 'loadConfigLog',
				'deleteLog'),
		width : 50,
		styleHtmlCls : 'btnFont_size_24',
		icon : 'images/shanchu.png',
		handler : function() {
			if (p.selModel.selected.items.length > 0) {
				deleteLogs(logType, p.selModel.selected.items, null,
						'logManager', p.selModel.getSelection());
			} else {
				Ext.Msg.alert('提示', '请选择');
			}
		}
	}]
	var p_columns = [{
				xtype : 'rownumberer',
				width : 35,
				text : '序号',
				menuDisabled : true,
				sortable : false
			}, {
				header : '接口名称',
				sortable : false,
				menuDisabled : true,
				dataIndex : 'text',
				flex : 1
			}, {
				header : '日期',
				sortable : false,
				menuDisabled : true,
				dataIndex : 'date',
				flex : 1

			}, {
				header : '时间',
				sortable : false,
				menuDisabled : true,
				dataIndex : 'time',
				flex : 1
			}, {
				header : '文件名称',
				sortable : false,
				menuDisabled : true,
				dataIndex : 'fileName',
				flex : 1
			}];

	var p_CheckboxModel = Ext.create('Ext.selection.CheckboxModel', {
				mode : 'MULTI',
				checkOnly : true,
				listeners : {
					select : function(m, record, index) {
						p.p_sel_record = record;
						p.p_sel_model = m.getSelection()[0];
						p.p_sel_index = index;
					}
				}
			});

	var p_store_u = 'interfaceInfoFindController.do?actionType=findInterfaceStore';
	var p_store = new Ext.data.Store({
				model : 'logManngerPanel',
				autoLoad : false
			});

	var tit = '日志管理 >> ' + '配置加载异常日志';
	tit = changeColorToRed(tit);

	var p = Ext.create('Ext.grid.Panel', {
				border : 0,
				id : 'logManager',
				height : '100%',
				width : '100%',
				loadMask : true,
				sortableColumns : false,
				title : tit,
				selModel : p_CheckboxModel,
				dockedItems : [{
							xtype : 'toolbar',
							dock : 'top',
							items : ['开始时间：', {
										xtype : 'datefield',
										name : 'startDate',
										id : 'startDate',
										value : new Date(),
										width : 50,
										endDateField : 'endDate',
										editable : false
									}, ' 结束时间：', {
										xtype : 'datefield',
										id : 'endDate',
										name : 'endDate',
										value : new Date(),
										startDateField : 'startDate',
										width : 50,
										editable : false
									}, '要查询的接口：', interfaceCombobox]
						}, {
							xtype : 'toolbar',
							items : tbar_items
						}],
				columns : p_columns,
				store : p_store,
				listeners : {
					itemdblclick : function() {
						if (p.p_sel_record != null) {
							if (isHiddenFromPermission('log_manage',
									'loadConfigLog', 'findLogContent') == false) {
								windowShowLogContent(logType,
										getCmp('interfaceCombobox').rawValue);
							}
						}
					}
				}
			});
	return p;
};

/**
 * 中间面板日志管理
 */
function center_runtimeLog(runtimeLogData) {
	var logType = 'runtimeLog';
	var interfaceComboboxURL = 'interfaceInfoFindController.do?actionType=findInterfaceCombobox';
	var serviceComboboxURL = 'interfaceInfoFindController.do?actionType=findServiceCombobox';
	var interfaceCombobox = {
		xtype : 'combobox',
		id : 'interfaceCombobox',
		flex : 1,
		name : 'interfaceCombobox',
		value : '请选择接口',
		store : Ext.create('Ext.data.Store', {
					model : 'Combox',
					proxy : {
						type : 'ajax',
						url : interfaceComboboxURL,
						reader : {
							type : 'json',
							root : 'root'
						}
					},
					autoLoad : true
				}),
		editable : false,
		displayField : 'displayField',
		valueField : 'value',
		queryMode : 'local',
		allowBlank : false,
		listeners : {
			select : function(combobox, record) {
				Ext.Ajax.request({
							url : serviceComboboxURL,
							params : {
								interfaceId : record[0].data.value
							},
							success : function(response) {
								serviceCombobox_store.removeAll();
								var result = response.responseText;
								var j = Ext.decode(result);
								serviceCombobox_store.add(j.root);
								if (runtimeLogData) {
									// 如果从欢迎界面直接查询 跳转过来 有参数 直接查询
									// 参数有&分割 分别是 date interfaceId serviceId
									var runtimeLogData = runtimeLogData
											.split('&');
									getCmp('serviceCombobox')
											.setValue(runtimeLogData[2]);
								}
							}
						})
			}
		}
	};

	var serviceCombobox_store = new Ext.data.Store({
				model : 'Combox',
				autoLoad : false
			});
	var serviceCombobox = {
		xtype : 'combobox',
		id : 'serviceCombobox',
		name : 'interfaceCombobox',
		value : '请选择服务',
		flex : 1,
		store : serviceCombobox_store,
		editable : false,
		displayField : 'displayField',
		valueField : 'value',
		queryMode : 'local',
		allowBlank : false
	};

	function searchHandler() {
		if (getCmp('interfaceCombobox').value == '请选择接口') {
			Ext.Msg.alert('提示', '请选择接口');
			return false;
		}
		if (getCmp('serviceCombobox').value == '请选择服务') {
			Ext.Msg.alert('提示', '请选择服务');
			return false;
		}
		if (getCmp('endDate').lastValue - getCmp('startDate').lastValue > 2678400000) {
			Ext.Msg.alert('提示', '查询间隔不得超过一个月');
			return;
		};
		p_store.load({
					url : 'interfaceLogManagerController.do?actionType=findLog',
					params : {
						startDate : getCmp('startDate').rawValue,
						endDate : getCmp('endDate').rawValue,
						interfaceId : getCmp('interfaceCombobox').lastValue,
						serviceId : getCmp('serviceCombobox').lastValue,
						logType : logType
					}
				});
	}

	var tbar_items = [{
				text : '查询',
				scale : 'small',
				hidden : isHiddenFromPermission('log_manage', 'runtimeLog',
						'findLog'),
				width : 50,
				styleHtmlCls : 'btnFont_size_24',
				icon : 'images/chaxun.png',
				handler : function() {
					searchHandler();
				}
			}, '-', {
				text : '查看',
				scale : 'small',
				hidden : isHiddenFromPermission('log_manage', 'runtimeLog',
						'findLogContent'),
				width : 50,
				styleHtmlCls : 'btnFont_size_24',
				icon : 'images/chakan.png',
				handler : function() {
					if (p.selModel.selected.items.length == 1) {
						windowShowLogContent(logType,
								getCmp('interfaceCombobox').rawValue);
					} else {
						Ext.Msg.alert('提示', '请选择一个');
					}

				}
			}, '-', {
				text : '删除',
				scale : 'small',
				hidden : isHiddenFromPermission('log_manage', 'runtimeLog',
						'deleteLog'),
				width : 50,
				styleHtmlCls : 'btnFont_size_24',
				icon : 'images/shanchu.png',
				handler : function() {
					if (p.selModel.selected.items.length > 0) {
						deleteLogs(logType, p.selModel.selected.items, getCmp('interfaceCombobox').rawValue,
								'logManager', p.selModel.getSelection());
					} else {
						Ext.Msg.alert('提示', '请选择');
					}
				}
			}]
	var p_columns = [{
				xtype : 'rownumberer',
				width : 35,
				text : '序号',
				menuDisabled : true,
				sortable : false
			}, {
				header : '服务名称',
				sortable : false,
				menuDisabled : true,
				dataIndex : 'text',
				flex : 1
			}, {
				header : '日期',
				sortable : false,
				menuDisabled : true,
				dataIndex : 'date',
				flex : 1

			}, {
				header : '时间',
				sortable : false,
				menuDisabled : true,
				dataIndex : 'time',
				flex : 1
			}, {
				header : '文件名称',
				sortable : false,
				menuDisabled : true,
				dataIndex : 'fileName',
				flex : 1
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

	var p_store_u = 'interfaceInfoFindController.do?actionType=findInterfaceStore';
	var p_store = new Ext.data.Store({
				model : 'logManngerPanel',
				autoLoad : false
			});

	var tit = '日志管理 >> ' + '运行异常日志';
	tit = changeColorToRed(tit);

	var p = Ext.create('Ext.grid.Panel', {
		border : 0,
		id : 'logManager',
		height : '100%',
		width : '100%',
		loadMask : true,
		sortableColumns : false,
		title : tit,
		selModel : p_CheckboxModel,
		dockedItems : [{
			xtype : 'toolbar',
			dock : 'top',
			items : ['开始时间：', {
						xtype : 'datefield',
						name : 'startDate',
						id : 'startDate',
						value : new Date(),
						flex : 1,
						endDateField : 'endDate',
						editable : false
					}, ' 结束时间：', {
						xtype : 'datefield',
						id : 'endDate',
						name : 'endDate',
						value : new Date(),
						startDateField : 'startDate',
						flex : 1,
						editable : false
					}, '要查询的接口：', interfaceCombobox, '要查询的服务：', serviceCombobox]
		}, {
			xtype : 'toolbar',
			items : tbar_items
		}],
		columns : p_columns,
		store : p_store,
		listeners : {
			itemdblclick : function() {
				if (p.p_sel_record != null) {
					if (isHiddenFromPermission('log_manage', 'runtimeLog',
							'findLogContent') == false) {
						windowShowLogContent(logType,
								getCmp('interfaceCombobox').rawValue);
					}
				}
			}
		}
	});
	if (runtimeLogData) {
		// 如果从欢迎界面直接查询 跳转过来 有参数 直接查询
		// 参数有&分割 分别是 date interfaceId serviceId
		var runtimeLogData = runtimeLogData.split('&');
		var date = new Date();
		date = Ext.Date.parse(runtimeLogData[0], 'Ymd');
		getCmp('startDate').setValue(Ext.Date.format(date, 'm/d/Y'));
		getCmp('endDate').setValue(Ext.Date.format(date, 'm/d/Y'));
		getCmp('interfaceCombobox').setValue(runtimeLogData[1]);
		Ext.Ajax.request({
					url : serviceComboboxURL,
					params : {
						interfaceId : runtimeLogData[1]
					},
					success : function(response) {
						serviceCombobox_store.removeAll();
						var result = response.responseText;
						var j = Ext.decode(result);
						serviceCombobox_store.add(j.root);
						getCmp('serviceCombobox').setValue(runtimeLogData[2]);
						runtimeLogData = null;
						searchHandler();
						/**
						 * 这个是最左边的一块面板 同时展开
						 */
					}
				})
	}
	// left.layout.setExpanded(getCmp('left_accordion_logManager_tree'));
	left.items.items[4].expand();
	return p;
};

/**
 * 中间面板调试日志管理
 * 
 * @return {TypeName}
 */
function center_debugLogManager() {
	var logType = 'debugLog';
	var interfaceComboboxURL = 'interfaceInfoFindController.do?actionType=findInterfaceCombobox';
	var serviceComboboxURL = 'interfaceInfoFindController.do?actionType=findServiceCombobox';
	var findLogURL = 'interfaceLogManagerController.do?actionType=findLog';
	var findLogDetail = 'interfaceLogManagerController.do?actionType=findDebugLogDetail';
	var interfaceCombobox = {
		xtype : 'combobox',
		id : 'interfaceCombobox',
		flex : 1,
		name : 'interfaceCombobox',
		value : '请选择接口',
		store : Ext.create('Ext.data.Store', {
					model : 'Combox',
					proxy : {
						type : 'ajax',
						url : interfaceComboboxURL,
						reader : {
							type : 'json',
							root : 'root'
						}
					},
					autoLoad : true
				}),
		editable : false,
		displayField : 'displayField',
		valueField : 'value',
		queryMode : 'local',
		allowBlank : false,
		listeners : {
			select : function(combobox, record) {
				Ext.Ajax.request({
							url : serviceComboboxURL,
							params : {
								interfaceId : record[0].data.value
							},
							success : function(response) {
								serviceCombobox_store.removeAll();
								var result = response.responseText;
								var j = Ext.decode(result);
								serviceCombobox_store.add(j.root);
							}
						})
			}
		}
	};

	var serviceCombobox_store = new Ext.data.Store({
				model : 'Combox',
				autoLoad : false
			});
	var serviceCombobox = {
		xtype : 'combobox',
		flex : 1,
		id : 'serviceCombobox',
		name : 'interfaceCombobox',
		value : '请选择服务',
		store : serviceCombobox_store,
		editable : false,
		displayField : 'displayField',
		valueField : 'value',
		queryMode : 'local',
		allowBlank : false
	};
	var head_tbar_items = [{
		text : '查询',
		scale : 'small',
		hidden : isHiddenFromPermission('log_manage', 'debugLog', 'findLog'),
		width : 50,
		styleHtmlCls : 'btnFont_size_24',
		icon : 'images/chaxun.png',
		handler : function() {
			if (getCmp('interfaceCombobox').value == '请选择接口') {
				Ext.Msg.alert('提示', '请选择接口');
				return false;
			}
			if (getCmp('serviceCombobox').value == '请选择服务') {
				Ext.Msg.alert('提示', '请选择服务');
				return false;
			}
			if (getCmp('endDate').lastValue - getCmp('startDate').lastValue > 2678400000) {
				Ext.Msg.alert('提示', '查询间隔不得超过一个月');
				return;
			}
			head_store.load({
						url : findLogURL,
						params : {
							startDate : getCmp('startDate').rawValue,
							endDate : getCmp('endDate').rawValue,
							interfaceId : getCmp('interfaceCombobox').lastValue,
							serviceId : getCmp('serviceCombobox').lastValue,
							logType : logType
						}
					});
			detail_store.removeAll();
		}
	}, '-', {
		text : '查看',
		scale : 'small',
		hidden : isHiddenFromPermission('log_manage', 'debugLog',
				'findDebugLogDetail'),
		width : 50,
		styleHtmlCls : 'btnFont_size_24',
		icon : 'images/chakan.png',
		handler : function() {
			if (p.items.items[0].selModel.selected.items.length == 1) {
				p.head_record.data.interfaceName = getCmp('interfaceCombobox').rawValue;
				detail_store.load({
							url : findLogDetail,
							params : {
								logType : logType,
								text : Ext.encode(p.head_record.data)
							}
						});
			} else {
				Ext.Msg.alert('提示', '请选择一个');
			}
		}
	}, '-', {
		text : '删除',
		scale : 'small',
		hidden : isHiddenFromPermission('log_manage', 'debugLog', 'deleteLog'),
		width : 50,
		styleHtmlCls : 'btnFont_size_24',
		icon : 'images/shanchu.png',
		handler : function() {
			if (p.items.items[0].selModel.selected.items.length > 0) {
				deleteLogs(logType, p.items.items[0].selModel.selected.items,
						getCmp('interfaceCombobox').rawValue, 'headPanel',
						p.items.items[0].selModel.getSelection());
				detail_store.removeAll();
			} else {
				Ext.Msg.alert('提示', '请选择');
			}
		}
	}];
	var detail_tbar_items = [{
				text : '查看',
				scale : 'small',
				width : 50,
				styleHtmlCls : 'btnFont_size_24',
				icon : 'images/chakan.png',
				handler : function() {
					windowShowDebugLogDetail();
				}
			}]
	var head_columns = [{
				xtype : 'rownumberer',
				width : 35,
				text : '序号',
				menuDisabled : true,
				sortable : false
			}, {
				header : '服务名称',
				sortable : false,
				menuDisabled : true,
				dataIndex : 'text',
				flex : 1
			}, {
				header : '日期',
				sortable : false,
				menuDisabled : true,
				dataIndex : 'date',
				flex : 1

			}, {
				header : '时间',
				sortable : false,
				menuDisabled : true,
				dataIndex : 'time',
				flex : 1
			}, {
				header : '文件名称',
				sortable : false,
				menuDisabled : true,
				dataIndex : 'fileName',
				flex : 1
			}];

	var detail_columns = [{
				xtype : 'rownumberer',
				width : 35,
				text : '序号',
				menuDisabled : true,
				sortable : false
			}, {
				header : 'Id',
				sortable : false,
				menuDisabled : true,
				dataIndex : 'id',
				flex : 2
			}, {
				header : 'Transformer_Name',
				sortable : false,
				menuDisabled : true,
				dataIndex : 'Transformer_Name',
				flex : 2
			}, {
				header : 'Process_DateTime',
				sortable : false,
				menuDisabled : true,
				dataIndex : 'Process_DateTime',
				flex : 2
			}, {
				header : 'Payload_Type',
				sortable : false,
				menuDisabled : true,
				dataIndex : 'Payload_Type',
				flex : 2
			}, {
				header : 'isnormal',
				dataIndex : 'isnormal',
				sortable : false,
				menuDisabled : true,
				renderer : function(value) {
					if (value == 0)
						return '否';
					else
						return '是';
				},
				flex : 1
			}, {
				header : 'serviceName',
				sortable : false,
				menuDisabled : true,
				dataIndex : 'serviceName',
				flex : 2
			}];

	var head_checkboxModel = Ext.create('Ext.selection.CheckboxModel', {
				mode : 'MULTI',
				checkOnly : true,
				listeners : {
					select : function(m, record, index) {
						p.head_record = record;
						p.head_model = m.getSelection()[0];
						p.head_index = index;
					}
				}
			});

	var detail_checkboxModel = Ext.create('Ext.selection.CheckboxModel', {
				mode : 'MULTI',
				listeners : {
					select : function(m, record, index) {
						p.detail_record = record;
						p.detail_model = m.getSelection()[0];
						p.detail_index = index;
					}
				}
			});

	var p_store_u = 'interfaceInfoFindController.do?actionType=findInterfaceStore';
	var head_store = new Ext.data.Store({
				model : 'logManngerPanel',
				proxy : {
					type : 'ajax',
					timeout : 600000
				},
				autoLoad : false
			});

	var detail_store = new Ext.data.Store({
				model : 'debugLogDetail',
				proxy : {
					type : 'ajax',
					timeout : 600000
				},
				autoLoad : false
			});

	var tit = '日志管理 >> ' + '调试日志';
	tit = changeColorToRed(tit);

	var headPanel = Ext.create('Ext.grid.Panel', {
		border : 0,
		id : 'headPanel',
		height : '35%',
		width : '100%',
		loadMask : true,
		selModel : head_checkboxModel,
		sortableColumns : false,
		dockedItems : [{
			xtype : 'toolbar',
			dock : 'top',
			items : ['开始时间：', {
						xtype : 'datefield',
						name : 'startDate',
						id : 'startDate',
						value : new Date(),
						flex : 1,
						endDateField : 'endDate',
						editable : false
					}, ' 结束时间：', {
						xtype : 'datefield',
						id : 'endDate',
						name : 'endDate',
						value : new Date(),
						startDateField : 'startDate',
						flex : 1,
						editable : false
					}, '要查询的接口：', interfaceCombobox, '要查询的服务：', serviceCombobox]
		}, {
			xtype : 'toolbar',
			items : head_tbar_items
		}],
		columns : head_columns,
		store : head_store,
		listeners : {
			itemdblclick : function(view, record, item, index, event) {
				record.data.interfaceName = getCmp('interfaceCombobox').rawValue;
				detail_store.load({
							url : findLogDetail,
							params : {
								logType : logType,
								text : Ext.encode(record.data)
							}
						});
			}
		}
	});

	var detailPanel = Ext.create('Ext.grid.Panel', {
				border : 0,
				id : 'detailPanel',
				height : '65%',
				width : '100%',
				loadMask : true,
				tbar : {
					items : detail_tbar_items
				},
				selModel : detail_checkboxModel,
				title : changeColorToRed('接口运行详细信息'),
				columns : detail_columns,
				store : detail_store,
				listeners : {
					itemdblclick : function(view, record) {
						windowShowDebugLogDetail();
					}
				}
			});

	var p = Ext.create('Ext.Panel', {
				border : 0,
				id : 'debugLogManager',
				height : '100%',
				width : '100%',
				title : tit,
				// layout:'fit',
				items : [headPanel, detailPanel]
			});
	return p;
};

function center_synLogManager() {
	var tbar_items = [{
		text : '查询',
		scale : 'small',
		hidden : isHiddenFromPermission('log_manage', 'synchroniseLog',
				'findLog'),
		width : 50,
		styleHtmlCls : 'btnFont_size_24',
		icon : 'images/chaxun.png',
		handler : function() {
			if (getCmp('endDate').lastValue - getCmp('startDate').lastValue > 2678400000) {
				Ext.Msg.alert('提示', '查询间隔不得超过一个月');
				return;
			}
			p_store.load({
						url : 'interfaceLogManagerController.do?actionType=findLog',
						params : {
							startDate : getCmp('startDate').rawValue,
							endDate : getCmp('endDate').rawValue,
							logType : 'synchroniseLog'
						}
					});
		}
	}, '-', {
		text : '查看',
		scale : 'small',
		hidden : isHiddenFromPermission('log_manage', 'synchroniseLog',
				'findLogContent'),
		width : 50,
		styleHtmlCls : 'btnFont_size_24',
		icon : 'images/chakan.png',
		handler : function() {
			if (p.selModel.selected.items.length == 1) {
				windowShowSynLogContent();
			} else {
				Ext.Msg.alert('提示', '请选择一个');
			}
		}
	}, '-', {
		text : '删除',
		scale : 'small',
		hidden : isHiddenFromPermission('log_manage', 'synchroniseLog',
				'deleteLog'),
		width : 50,
		styleHtmlCls : 'btnFont_size_24',
		icon : 'images/shanchu.png',
		handler : function() {
			if (p.selModel.selected.items.length > 0) {
				deleteLogs('synchroniseLog', p.selModel.selected.items, null,
						'synLogManager', p.selModel.getSelection());
			} else {
				Ext.Msg.alert('提示', '请选择');
			}
		}
	}];
	var p_columns = [{
				xtype : 'rownumberer',
				width : 35,
				text : '序号',
				menuDisabled : true,
				sortable : false
			}, {
				header : '文件名称',
				sortable : false,
				menuDisabled : true,
				dataIndex : 'fileName',
				flex : 2
			}, {
				header : '日期',
				sortable : false,
				menuDisabled : true,
				dataIndex : 'date',
				flex : 1

			}, {
				header : '时间',
				sortable : false,
				menuDisabled : true,
				dataIndex : 'time',
				flex : 1
			}];

	var p_CheckboxModel = Ext.create('Ext.selection.CheckboxModel', {
				mode : 'MULTI',
				checkOnly : true,
				listeners : {
					select : function(m, record, index) {
						p.p_sel_record = record;
						p.p_sel_model = m.getSelection()[0];
						p.p_sel_index = index;
					}
				}
			});

	var p_store = new Ext.data.Store({
				model : 'logManngerPanel',
				autoLoad : false
			});

	var tit = '日志管理 >> 同步日志';
	tit = changeColorToRed(tit);

	var p = Ext.create('Ext.grid.Panel', {
				border : 0,
				id : 'synLogManager',
				height : '100%',
				width : '100%',
				loadMask : true,
				sortableColumns : false,
				title : tit,
				selModel : p_CheckboxModel,
				dockedItems : [{
							xtype : 'toolbar',
							dock : 'top',
							items : ['开始时间：', {
										xtype : 'datefield',
										name : 'startDate',
										id : 'startDate',
										value : new Date(),
										flex : 1,
										endDateField : 'endDate',
										editable : false
									}, ' 结束时间：', {
										xtype : 'datefield',
										id : 'endDate',
										name : 'endDate',
										value : new Date(),
										startDateField : 'startDate',
										flex : 1,
										editable : false
									}]
						}, {
							xtype : 'toolbar',
							items : tbar_items
						}],
				columns : p_columns,
				store : p_store,
				listeners : {
					itemdblclick : function() {
						if (p.p_sel_record != null) {
							if (isHiddenFromPermission('log_manage',
									'synchroniseLog', 'findLogContent') == false) {
								windowShowSynLogContent();
							}
						}
					}
				}
			});
	return p;
};
/**
 * 定时任务center_timingTaskLogManager
 * 
 */
function center_timingTaskLogManager() {
	var logType = 'timingTaskLog';
	var timingTaskTypeComboboxURL = 'interfaceTimingTaskController.do?actionType=getJobTypeCombox';
	var timingTaskNameComboboxURL = 'interfaceTimingTaskController.do?actionType=findTaskLogCombobox';
	var timingTaskTypeCombobox = {
		xtype : 'combobox',
		id : 'timingTaskTypeCombobox',
		name : 'timingTaskTypeCombobox',
		flex:1,
		value : '请选择',
		width : 180,
		store : Ext.create('Ext.data.Store', {
					model : 'Combox',
					proxy : {
						type : 'ajax',
						url : timingTaskTypeComboboxURL,
						reader : {
							type : 'json',
							root : 'root'
						}
					},
					autoLoad : true
				}),
		editable : false,
		displayField : 'displayField',
		valueField : 'value',
		queryMode : 'local',
		allowBlank : false
	};
	var timingTaskNameCombobox = {
		xtype : 'combobox',
		flex:1,
		id : 'timingTaskNameCombobox',
		name : 'timingTaskNameCombobox',
		value : '请选择',
		store : Ext.create('Ext.data.Store', {
					model : 'Combox',
					proxy : {
						type : 'ajax',
						url : timingTaskNameComboboxURL,
						reader : {
							type : 'json',
							root : 'root'
						}
					},
					autoLoad : true
				}),
		editable : false,
		displayField : 'displayField',
		valueField : 'value',
		queryMode : 'local',
		allowBlank : false
	};
	var tbar_items = [{
		text : '查询',
		scale : 'small',
		width : 50,
		hidden : isHiddenFromPermission('log_manage', 'timingTaskLog',
				'findLog'),
		styleHtmlCls : 'btnFont_size_24',
		icon : 'images/chaxun.png',
		handler : function() {
			if ('请选择' == getCmp('timingTaskTypeCombobox').value) {
				Ext.Msg.alert("提示", "请选择任务类型！")
				return;
			} else if ('请选择' == getCmp('timingTaskNameCombobox').value) {
				Ext.Msg.alert("提示", "请选择任务名称！")
				return;
			} else {
				var timingTask = {
					startdate : getCmp('startDate').rawValue,
					// hour : getCmp('hour').rawValue,
					timingTask : getCmp('timingTaskTypeCombobox').value,
					TaskName : getCmp('timingTaskNameCombobox').value
				}
				var timingTaskJson = Ext.encode(timingTask);
				headPanel_store.removeAll();
				detailPanel_store.removeAll();
				headPanel_store.load({
							params : {
								data : timingTaskJson
							}
						})

			}
		}
	}, '-', {
		text : '查看',
		scale : 'small',
		width : 50,
		hidden : isHiddenFromPermission('log_manage', 'timingTaskLog',
				'findLogContent'),
		styleHtmlCls : 'btnFont_size_24',
		icon : 'images/chakan.png',
		handler : function() {
			if (headPanel.headPanel_sel_record == 1) {
				record = headPanel.headPanel_sel_record;
				detailPanel_store.load({
							params : {
								data : record.data.timingTaskId + '/'
										+ record.data.taskName
							}
						})
			} else {
				Ext.Msg.alert('提示', '请选择一个');
			}

		}
	}, '-', {
		text : '删除',
		scale : 'small',
		hidden : isHiddenFromPermission('log_manage', 'timingTaskLog',
				'deleteLog'),
		width : 50,
		styleHtmlCls : 'btnFont_size_24',
		icon : 'images/shanchu.png',
		handler : function() {

			if (headPanel.selModel.selected.items.length > 0) {
				var data = headPanel.selModel.selected.items;
				var array = new Array();
				for (var i = 0; i < data.length; i++) {
					var row = data[i].data;
					array.push(row.timingTaskId + '/' + row.taskName);
				}
				deleteTimingTaskLog(array, headPanel.selModel.getSelection());
			} else {
				Ext.Msg.alert('提示', '请选择');
			}
		}
	}]
	var headPanel_columns = [{
				xtype : 'rownumberer',
				width : 35,
				text : '序号',
				menuDisabled : true,
				sortable : false
			}, {
				header : '任务类型',
				dataIndex : 'taskName',
				sortable : false,
				menuDisabled : true,
				renderer : function(value) {
					return getCmp('timingTaskTypeCombobox').rawValue
				},
				flex : 1
			}, {
				header : '任务名称',
				sortable : false,
				menuDisabled : true,
				dataIndex : 'taskName',
				renderer : function(value) {
					return getCmp('timingTaskNameCombobox').rawValue
				},
				flex : 1
			}, {
				header : '生成日期',
				sortable : false,
				menuDisabled : true,
				dataIndex : 'taskName',
				renderer : function(value) {
					return getCmp('startDate').rawValue + '    '
							+ value.substr(0, value.length - 4) + '点'
				},
				flex : 1
			}];
	var detailPanel_columns = [{
				xtype : 'rownumberer',
				width : 35,
				text : '序号',
				menuDisabled : true,
				sortable : false
			}, {
				header : '接口名称',
				sortable : false,
				menuDisabled : true,
				dataIndex : 'interfaceName',
				flex : 1
			}, {
				header : '服务名称',
				sortable : false,
				menuDisabled : true,
				dataIndex : 'serviceName',
				flex : 1
			}, {
				header : '是否成功',
				sortable : false,
				menuDisabled : true,
				dataIndex : 'isSuccess',
				renderer : function(value) {
					return value == 'true' ? '是' : '否';
				},
				flex : 0.5
			}, {
				header : '错误信息',
				sortable : false,
				menuDisabled : true,
				dataIndex : 'msg',
				flex : 1
			}, {
				header : '开始时间',
				sortable : false,
				menuDisabled : true,
				dataIndex : 'starttime',
				flex : 1
			}, {
				header : '结束时间',
				sortable : false,
				menuDisabled : true,
				dataIndex : 'endtime',
				flex : 1
			},];

	var headPanel_CheckboxModel = Ext.create('Ext.selection.CheckboxModel', {
				mode : 'MULTI',
				checkOnly : true,
				listeners : {
					select : function(m, record, index) {
						headPanel.headPanel_sel_record = record;
						headPanel.headPanel_sel_index = index;
					}
				}
			});

	var headPanel_store_u = 'interfaceLogManagerController.do?actionType=findtimingLogs';
	var headPanel_store = new Ext.data.Store({
				model : 'TimingLog',
				proxy : {
					type : 'ajax',
					url : headPanel_store_u
				},
				sorters : {
					property : 'taskName',
					direction : 'ASC'
				},
				autoLoad : false
			});
	var detailPanel_store_u = 'interfaceLogManagerController.do?actionType=findtimingLog';
	var detailPanel_store = new Ext.data.Store({
				model : 'TimingLog',
				proxy : {
					type : 'ajax',
					timeout:600000,
					url : detailPanel_store_u
				},
				sorters : {
					property : 'starttime',
					direction : 'DESC'
				},
				autoLoad : false
			});

	var tit = '日志管理 >> ' + '计划任务日志';
	tit = changeColorToRed(tit);

	var headPanel = Ext.create('Ext.grid.Panel', {
				border : 0,
				id : 'headPanelTimingTask',
				height : '25%',
				width : '100%',
				loadMask : true,
				sortableColumns : false,
				selModel : headPanel_CheckboxModel,
				dockedItems : [{
					xtype : 'toolbar',
					dock : 'top',
					items : ['查询日期：', {
								xtype : 'datefield',
								name : 'startDate',
								id : 'startDate',
								value : new Date(),
								flex:1,
								editable : false
							}, '任务类型：', timingTaskTypeCombobox, '任务名称：',
							timingTaskNameCombobox]
				}, {
					xtype : 'toolbar',
					items : tbar_items
				}],
				columns : headPanel_columns,
				store : headPanel_store,
				listeners : {
					itemdblclick : function(view, record) {
						detailPanel_store.load({
									params : {
										data : record.data.timingTaskId + '/'
												+ record.data.taskName
									}
								})
					}
				}
			});
	var detailPanel = Ext.create('Ext.grid.Panel', {
				border : 0,
				id : 'detailPanel',
				height : '75%',
				width : '100%',
				loadMask : true,
				sortableColumns : false,
				title : "定时任务明细",
				bbar : [],
				columns : detailPanel_columns,
				store : detailPanel_store
			});
	var p = Ext.create('Ext.Panel', {
				border : 0,
				id : 'logManager',
				height : '100%',
				width : '100%',
				title : tit,
				// layout:'auto',
				items : [headPanel, detailPanel]
			});
	return p;
}