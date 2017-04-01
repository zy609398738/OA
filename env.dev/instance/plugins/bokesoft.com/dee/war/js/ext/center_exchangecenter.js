// 交换代码
function center_exchangecode() {
	var title = changeColorToRed('交换中心 >> 交换代码');
	var p_tbar_items = [{
		text : '新增',
		scale : 'small',
		hidden : isHiddenFromPermission('exchange_center', 'exchangecode',
				'addexchange'),
		icon : 'images/add.png',
		width : 50,
		handler : function() {
			windowaddExchange();
			// windowSaveOrUpdateDataSource(null, false);
		}
	}, {
		text : '修改',
		scale : 'small',
		hidden : isHiddenFromPermission('exchange_center', 'exchangecode',
				'changeexchange'),
		icon : 'images/xiugai.png',
		width : 50,
		handler : function() {
			if (exchangeList.record) {
				windowchangeExchange(exchangeList.record);
			}
		}
	}, {
		text : '删除',
		scale : 'small',
		hidden : isHiddenFromPermission('exchange_center', 'exchangecode',
				'delexchange'),
		icon : 'images/shanchu.png',
		width : 50,
		handler : function() {
			if (exchangeList.record) {
				deleteExchange(exchangeList.record.data['id'],
						exchangeList.index);
			}
		}
	}];
	var exchangeList_storeURL = 'interfaceExchangeCenterController.do?actionType=findexchange';
	var exchangeList_store = Ext.create('Ext.data.Store', {
				model : 'Exchange',
				proxy : {
					type : 'ajax',
					url : exchangeList_storeURL
				},
				sorters : {
					property : 'createtime',
					direction : 'DESC'
				},
				autoLoad : true,
				listeners : {
					load : function(me) {
						if (me.data.items.length > 0
								&& me.data.items[0].data.id == "-1") {
							Ext.Msg.alert("提示", me.data.items[0].data.msg);
							me.removeAll();
						}
					}
				}
			});

	var exchangeList_CheckboxModel = Ext.create('Ext.selection.CheckboxModel',
			{
				mode : 'SINGLE',
				listeners : {
					select : function(m, record, index) {
						exchangeList.record = record;
						exchangeList.index = index;
					}
				}
			});

	var exchangeList = Ext.create('Ext.grid.Panel', {
				autoScroll : true,
				title : title,
				border : 0,
				width : '100%',
				height : '100%',
				tbar : p_tbar_items,
				id : 'exchangeList',
				selModel : exchangeList_CheckboxModel,
				flex : 9,
				columns : [{
							xtype : 'rownumberer',
							width : 30,
							sortable : false,
							menuDisabled : true,
							sortable : false
						}, {
							header : 'ID',
							sortable : false,
							menuDisabled : true,
							hidden : true,
							dataIndex : 'id',
							flex : 1
						}, {
							header : '代码',
							sortable : false,
							menuDisabled : true,
							dataIndex : 'code',
							flex : 1
						}, {
							header : '名称',
							sortable : false,
							menuDisabled : true,
							dataIndex : 'name',
							flex : 1
						}, {
							header : '密码',
							dataIndex : 'password',
							sortable : false,
							menuDisabled : true,
							hidden : true,
							flex : 1
						}, {
							header : '是否是Admin',
							sortable : false,
							menuDisabled : true,
							dataIndex : 'isadmin',
							flex : 1,
							renderer : function(value) {
								return value == true ? '是' : '否';
							}
						}, {
							header : '是否已激活',
							sortable : false,
							menuDisabled : true,
							dataIndex : 'exstate',
							flex : 1,
							renderer : function(value) {
								return value == true ? '是' : '否';
							}
						}, {
							header : '修改日期',
							sortable : false,
							menuDisabled : true,
							dataIndex : 'modifytime',
							renderer : Ext.util.Format
									.dateRenderer('Y-m-d H:i:s'),
							flex : 1
						}, {
							header : '创建日期',
							sortable : false,
							menuDisabled : true,
							dataIndex : 'createtime',
							renderer : Ext.util.Format
									.dateRenderer('Y-m-d H:i:s'),
							flex : 1
						}, {
							header : '交换密钥',
							sortable : false,
							menuDisabled : true,
							dataIndex : 'UUID',
							flex : 1
						}],
				store : exchangeList_store,
				listeners : {
					itemdblclick : function(view, record, item, index, event) {
						windowchangeExchange(record);
					}
				}
			});

	return exchangeList;
}
// 交换群组
function center_exchangegroup() {
	var title = changeColorToRed('交换中心 >> 交换群组');
	var p_tbar_items = [{
		text : '新增',
		scale : 'small',
		hidden : isHiddenFromPermission('exchange_center', 'exchangegroup',
				'addexchangeGroup'),
		icon : 'images/add.png',
		width : 50,
		handler : function() {
			windowaddExchangeGroup();
			// windowSaveOrUpdateDataSource(null, false);
		}
	}, {
		text : '修改',
		scale : 'small',
		hidden : isHiddenFromPermission('exchange_center', 'exchangegroup',
				'changeexchangeGroup'),
		icon : 'images/xiugai.png',
		width : 50,
		handler : function() {
			if (exchangeListGroup.record) {
				windowchangeExchangeGroup(exchangeListGroup.record);
			}
		}
	}, {
		text : '删除',
		scale : 'small',
		hidden : isHiddenFromPermission('exchange_center', 'exchangegroup',
				'delexchangeGroup'),
		icon : 'images/shanchu.png',
		width : 50,
		handler : function() {
			if (exchangeListGroup.record) {
				deleteExchangeGroup(exchangeListGroup.record.data['id'],
						exchangeListGroup.index);
			}
		}
	}];
	var exchangeListGroup_storeURL = 'interfaceExchangeCenterController.do?actionType=findexchangeGroup';
	var exchangeListGroup_store = Ext.create('Ext.data.Store', {
				model : 'ExchangeGroup',
				proxy : {
					type : 'ajax',
					url : exchangeListGroup_storeURL
				},
				sorters : {
					property : 'createtime',
					direction : 'DESC'
				},
				autoLoad : true,
				listeners : {
					load : function(me) {
						if (me.data.items.length > 0
								&& me.data.items[0].data.id == "-1") {
							Ext.Msg.alert("提示", me.data.items[0].data.msg);
							me.removeAll();
						}
					}
				}
			});

	var exchangeListGroup_CheckboxModel = Ext.create(
			'Ext.selection.CheckboxModel', {
				mode : 'SINGLE',
				listeners : {
					select : function(m, record, index) {
						exchangeListGroup.record = record;
						exchangeListGroup.index = index;
					}
				}
			});

	var exchangeListGroup = Ext.create('Ext.grid.Panel', {
				autoScroll : true,
				title : title,
				border : 0,
				width : '100%',
				height : '100%',
				tbar : p_tbar_items,
				id : 'exchangeListGroup',
				selModel : exchangeListGroup_CheckboxModel,
				flex : 9,
				columns : [{
							xtype : 'rownumberer',
							width : 30,
							sortable : false,
							menuDisabled : true,
							sortable : false
						}, {
							header : 'ID',
							sortable : false,
							menuDisabled : true,
							hidden : true,
							dataIndex : 'id',
							flex : 1
						}, {
							header : '代码',
							sortable : false,
							menuDisabled : true,
							dataIndex : 'code',
							flex : 1
						}, {
							header : '名称',
							sortable : false,
							menuDisabled : true,
							dataIndex : 'name',
							flex : 1
						}, {
							header : '密码',
							dataIndex : 'password',
							sortable : false,
							menuDisabled : true,
							hidden : true,
							flex : 1
						}, {
							header : '是否已激活',
							sortable : false,
							menuDisabled : true,
							dataIndex : 'exstate',
							flex : 1,
							renderer : function(value) {
								return value == true ? '是' : '否';
							}
						}, {
							header : '修改日期',
							dataIndex : 'modifytime',
							sortable : false,
							menuDisabled : true,
							renderer : Ext.util.Format
									.dateRenderer('Y-m-d H:i:s'),
							flex : 1
						}, {
							header : '创建日期',
							dataIndex : 'createtime',
							sortable : false,
							menuDisabled : true,
							renderer : Ext.util.Format
									.dateRenderer('Y-m-d H:i:s'),
							flex : 1
						}, {
							header : '交换密钥',
							sortable : false,
							menuDisabled : true,
							dataIndex : 'UUID',
							flex : 1
						}],
				store : exchangeListGroup_store,
				listeners : {
					itemdblclick : function(view, record, item, index, event) {
						windowchangeExchangeGroup(record);
					}
				}
			});
	return exchangeListGroup;
}
// ActionType
function center_exchangeaction() {
	var title = changeColorToRed('交换中心 >> ActionType');

	var p_tbar_items = [{
		text : '新增',
		scale : 'small',
		hidden : isHiddenFromPermission('exchange_center', 'exchangeAction',
				'addexchangeAction'),
		icon : 'images/add.png',
		width : 50,
		handler : function() {
			windowaddExchangeActionType();
			// windowSaveOrUpdateDataSource(null, false);
		}
	}, {
		text : '修改',
		scale : 'small',
		hidden : isHiddenFromPermission('exchange_center', 'exchangeAction',
				'changeexchangeAction'),
		icon : 'images/xiugai.png',
		width : 50,
		handler : function() {
			if (exchangeActionType.record) {
				windowchangeExchangeActionType(exchangeActionType.record);
			}
		}
	}, {
		text : '删除',
		scale : 'small',
		hidden : isHiddenFromPermission('exchange_center', 'exchangeAction',
				'delexchangeAction'),
		icon : 'images/shanchu.png',
		width : 50,
		handler : function() {
			if (exchangeActionType.record) {
				deleteExchangeActionType(exchangeActionType.record.data['id'],
						exchangeActionType.index);
			}
		}
	}];
	var exchangeActionType_storeURL = 'interfaceExchangeCenterController.do?actionType=findActionType';
	var exchangeActionType_store = Ext.create('Ext.data.Store', {
				model : 'ExchangeActionType',
				proxy : {
					type : 'ajax',
					url : exchangeActionType_storeURL
				},
				sorters : {
					property : 'createtime',
					direction : 'DESC'
				},
				autoLoad : true,
				listeners : {
					load : function(me) {
						if (me.data.items.length > 0
								&& me.data.items[0].data.id == "-1") {
							Ext.Msg.alert("提示", me.data.items[0].data.msg);
							me.removeAll();
						}
					}
				}
			});

	var exchangeActionType_CheckboxModel = Ext.create(
			'Ext.selection.CheckboxModel', {
				mode : 'SINGLE',
				listeners : {
					select : function(m, record, index) {
						exchangeActionType.record = record;
						exchangeActionType.index = index;
					}
				}
			});

	var exchangeActionType = Ext.create('Ext.grid.Panel', {
				title : title,
				border : 0,
				width : '100%',
				height : '100%',
				autoScroll : true,
				tbar : p_tbar_items,
				id : 'exchangeActionType',
				selModel : exchangeActionType_CheckboxModel,
				flex : 3,
				columns : [{
							xtype : 'rownumberer',
							width : 30,
							sortable : false,
							menuDisabled : true,
							sortable : false
						}, {
							header : 'ID',
							hidden : true,
							sortable : false,
							menuDisabled : true,
							dataIndex : 'id'
						}, {
							header : 'ACTIONTYPE',
							sortable : false,
							menuDisabled : true,
							flex : 1,
							dataIndex : 'actiontype'
						}, {
							header : '描述',
							sortable : false,
							menuDisabled : true,
							flex : 1,
							dataIndex : 'description'
						}, {
							header : '最大处理数',
							sortable : false,
							menuDisabled : true,
							flex : 1,
							dataIndex : 'type'
						}, {
							header : '创建日期',
							sortable : false,
							menuDisabled : true,
							dataIndex : 'createtime',
							flex : 1,
							renderer : Ext.util.Format
									.dateRenderer('Y-m-d H:i:s')
						}],
				store : exchangeActionType_store,
				listeners : {
					itemdblclick : function(view, record, item, index, event) {
						windowchangeExchangeActionType(record);
					}
				}
			});
	return exchangeActionType;

}
// 接收事件
function center_receiveevent() {
	var title = changeColorToRed('交换中心 >> 接收事件');
	var eventcomboxURL = 'interfaceExchangeCenterController.do?actionType=findActionType';
	var eventcombox = {
		xtype : 'combobox',
		id : 'eventcombox',
		name : 'eventcombox',
		size : 30,
		value : '请选择',
		store : Ext.create('Ext.data.Store', {
					model : 'ExchangeActionType',
					proxy : {
						type : 'ajax',
						url : eventcomboxURL
					},
					autoLoad : true
				}),
		editable : false,
		displayField : 'actiontype',
		valueField : 'actiontype',
		queryMode : 'local',
		allowBlank : false
	};
	var eventid = {
		xtype : 'textfield',
		id : 'eventid',
		size : 30
	};
	var ssource = {
		xtype : 'textfield',
		id : 'ssource',
		size : 30
	};
	var rtarget = {
		xtype : 'textfield',
		id : 'rtarget',
		size : 30
	};
	var p_tbar_items = ['开始时间:', {
				xtype : 'datefield',
				name : 'startDate',
				id : 'startDate',
				value : new Date(),
				size : 15,
				endDateField : 'endDate',
				editable : false
			}, '结束时间:', {
				xtype : 'datefield',
				id : 'endDate',
				name : 'endDate',
				value : new Date(),
				startDateField : 'startDate',
				size : 15,
				editable : false
			}, 'ActionType：', eventcombox, {
				text : '查询',
				scale : 'small',
				hidden : isHiddenFromPermission('exchange_center',
						'exchangeEvent', 'findexchangeEvent'),
				width : 50,
				styleHtmlCls : 'btnFont_size_24',
				icon : 'images/chaxun.png',
				handler : function() {
					if (getCmp('eventcombox').value == '请选择') {
						Ext.Msg.alert('提示', '请选择ActionType');
						return false;
					}
					var exchanges = {
						data : true,// 确定是接收事件还是备份查询
						startdate : getCmp('startDate').rawValue,
						enddate : getCmp('endDate').rawValue,
						actiontype : getCmp('eventcombox').lastValue,
						eventid : getCmp('eventid').value,
						ssource : getCmp('ssource').value,
						rtarget : getCmp('rtarget').value
					}
					var exchangeJson = Ext.encode(exchanges);
					exchangeEvent_store.setProxy({
						type : 'ajax',
						url : 'interfaceExchangeCenterController.do?actionType=findEventOrCopy',
						params : {
							exchange : exchangeJson
						},
						reader : {
							root : 'list',
							totalProperty : 'totalCount'
						}
					});
					exchangeEvent_store.loadPage(1, {
								params : exchangeEvent_store.getProxy().params
							});
				}
			}, {
				text : '查看',
				scale : 'small',
				hidden : isHiddenFromPermission('exchange_center',
						'exchangeEvent', 'getexchangeEvent'),
				icon : 'images/xiugai.png',
				width : 50,
				handler : function() {
					if (exchangeEvent.record) {
						windowshowBizdata(exchangeEvent.record.data.id, true);
					}
				}
			}, {
				text : '删除',
				scale : 'small',
				hidden : isHiddenFromPermission('exchange_center',
						'exchangeEvent', 'delexchangeEvent'),
				icon : 'images/shanchu.png',
				width : 50,
				handler : function() {
					if (exchangeEvent.record) {
						deleteExchangeEvent(exchangeEvent.record.data['id'],
								exchangeEvent.index);
					}
				}
			}];
	// var exchangeEvent_storeURL =
	// 'interfaceExchangeCenterController.do?actionType=findEvent';
	var exchangeEvent_store = Ext.create('Ext.data.Store', {

				model : 'ExchangeEvent',
				pageSize : 20,
				autoLoad : false,
				sorters : {
					property : 'createtime',
					direction : 'DESC'
				},
				listeners : {
					beforeload : function(store, option) {
						option.params = store.getProxy().params;
						option.params.page = store.currentPage;
					}
				}
			});

	var exchangeEvent_CheckboxModel = Ext.create('Ext.selection.CheckboxModel',
			{
				mode : 'SINGLE',
				listeners : {
					select : function(m, record, index) {
						exchangeEvent.record = record;
						exchangeEvent.index = index;
					}
				}
			});
	var exchangeEvent = Ext.create('Ext.grid.Panel', {
		title : title,
		border : 0,
		width : '100%',
		height : '100%',
		autoScroll : true,
		id : 'exchangeEvent',
		selModel : exchangeEvent_CheckboxModel,
		flex : 9,
		dockedItems : [{
			xtype : 'toolbar',
			dock : 'top',
			items : ['事件ID:', eventid, '-', '发送者：', ssource, '-', '接收者：',
					rtarget]
		}, {
			xtype : 'toolbar',
			items : p_tbar_items
		}, {
			xtype : 'pagingtoolbar',
			store : exchangeEvent_store,
			dock : 'bottom',
			displayInfo : true,
			beforePageText : '第',
			afterPageText : '页-共{0}页',
			displayMsg : "显示{0} - {1}条-共{2}条",
			emptyMsg : "没有数据",
			items : [{
				xtype : 'combobox',
				id : 'comSize',
				editable : false,
				size : 5,
				store : ['20', '40', '60', '80', '100'],
				fieldLabel : '每页显示条数',
				listeners : {
					'change' : function() {
						if (getCmp('eventcombox').value == '请选择') {
							Ext.Msg.alert('提示', '请选择ActionType');
							return false;
						}
						pageNO = Ext.getCmp('comSize').getValue();
						exchangeEvent_store.pageSize = pageNO;
						var exchanges = {
							data : true,// 确定是接收事件还是备份查询
							startdate : getCmp('startDate').rawValue,
							enddate : getCmp('endDate').rawValue,
							actiontype : getCmp('eventcombox').lastValue,
							eventid : getCmp('eventid').value,
							ssource : getCmp('ssource').value,
							rtarget : getCmp('rtarget').value
						};
						var exchangeJson = Ext.encode(exchanges);
						exchangeEvent_store.setProxy({
							type : 'ajax',
							url : 'interfaceExchangeCenterController.do?actionType=findEventOrCopy',
							params : {
								exchange : exchangeJson
							},
							reader : {
								root : 'list',
								totalProperty : 'totalCount'
							}
						});
						exchangeEvent_store.loadPage(1, {
									params : exchangeEvent_store.getProxy().params
								});
					}
				}
			}]
		}],
		columns : [{
					xtype : 'rownumberer',
					width : 30,
					sortable : false,
					menuDisabled : true,
					sortable : false
				}, {
					header : 'ID',
					sortable : false,
					menuDisabled : true,
					hidden : true,
					dataIndex : 'id',
					flex : 1
				}, {
					header : '事件ID',
					sortable : false,
					menuDisabled : true,
					dataIndex : 'eventid',
					flex : 1
				}, {
					header : '发送者',
					sortable : false,
					menuDisabled : true,
					dataIndex : 'ssource',
					flex : 1
				}, {
					header : '接收者',
					sortable : false,
					menuDisabled : true,
					dataIndex : 'rtarget',
					flex : 1
				}, {
					header : '创建日期',
					sortable : false,
					menuDisabled : true,
					dataIndex : 'createtime',
					renderer : Ext.util.Format.dateRenderer('Y-m-d H:i:s'),
					flex : 1
				}, {
					header : '过期日期',
					sortable : false,
					menuDisabled : true,
					dataIndex : 'expiretime',
					hidden : true,
					renderer : Ext.util.Format.dateRenderer('Y-m-d H:i:s'),
					flex : 1
				}, {
					header : 'ACTIONTYPE',
					sortable : false,
					menuDisabled : true,
					dataIndex : 'actiontype',
					flex : 1
				}, {
					header : '信息类型',
					sortable : false,
					menuDisabled : true,
					dataIndex : 'type',
					renderer : function(value) {
						if (value == 0) {
							return value = '代码——>代码'
						} else if (value == 1) {
							return value = '代码——>群组'
						} else if (value == 2) {
							return value = '群组——>代码'
						} else {
							return value = '群组——>群组'
						}
					},
					flex : 1
				}],
		store : exchangeEvent_store,
		listeners : {
			itemdblclick : function(view, record, item, index, event) {
				windowshowBizdata(record.data.id, true);
			}
		}
	});

	return exchangeEvent;

}
// 备份查询
function center_copyfind() {
	var title = changeColorToRed('交换中心 >> 备份查询');
	var copycomboxURL = 'interfaceExchangeCenterController.do?actionType=findActionType';
	var copycombox = {
		xtype : 'combobox',
		id : 'copycombox',
		name : 'copycombox',
		size : 30,
		value : '请选择',
		store : Ext.create('Ext.data.Store', {
					model : 'ExchangeActionType',
					proxy : {
						type : 'ajax',
						url : copycomboxURL
					},
					autoLoad : true
				}),
		editable : false,
		displayField : 'actiontype',
		valueField : 'actiontype',
		queryMode : 'local',
		allowBlank : false
	};
	var eventid = {
		xtype : 'textfield',
		id : 'eventid',
		size : 30
	};
	var ssource = {
		xtype : 'textfield',
		id : 'ssource',
		size : 30
	};
	var rtarget = {
		xtype : 'textfield',
		id : 'rtarget',
		size : 30
	};
	var p_tbar_items = ['开始时间:', {
				xtype : 'datefield',
				name : 'startDate',
				id : 'startDate',
				value : new Date(),
				size : 15,
				endDateField : 'endDate',
				editable : false
			}, '结束时间:', {
				xtype : 'datefield',
				id : 'endDate',
				name : 'endDate',
				value : new Date(),
				startDateField : 'startDate',
				size : 15,
				editable : false
			}, 'ActionType：', copycombox, {
				text : '查询',
				scale : 'small',
				width : 50,
				hidden : isHiddenFromPermission('exchange_center',
						'exchangeCopy', 'findexchangeCopy'),
				styleHtmlCls : 'btnFont_size_24',
				icon : 'images/chaxun.png',
				handler : function() {
					if (getCmp('copycombox').value == '请选择') {
						Ext.Msg.alert('提示', '请选择ActionType');
						return false;
					}
					var exchanges = {
						data : false,// 确定是接收事件还是备份查询
						startdate : getCmp('startDate').rawValue,
						enddate : getCmp('endDate').rawValue,
						actiontype : getCmp('copycombox').lastValue,
						eventid : getCmp('eventid').value,
						ssource : getCmp('ssource').value,
						rtarget : getCmp('rtarget').value
					}
					var exchangeJson = Ext.encode(exchanges);
					exchangeEvent_store.setProxy({
						type : 'ajax',
						url : 'interfaceExchangeCenterController.do?actionType=findEventOrCopy',
						params : {
							exchange : exchangeJson
						},
						reader : {
							root : 'list',
							totalProperty : 'totalCount'
						}
					});
					exchangeEvent_store.loadPage(1, {
								params : exchangeEvent_store.getProxy().params
							});
				}
			}, {
				text : '查看',
				scale : 'small',
				hidden : isHiddenFromPermission('exchange_center',
						'exchangeCopy', 'getexchangeCopy'),
				icon : 'images/xiugai.png',
				width : 50,
				handler : function() {
					if (exchangeCopy.record) {
						windowshowBizdata(exchangeCopy.record.data.id, false);
					}
				}
			}, {
				text : '删除',
				scale : 'small',
				hidden : isHiddenFromPermission('exchange_center',
						'exchangeCopy', 'delexchangeCopy'),
				icon : 'images/shanchu.png',
				width : 50,
				handler : function() {
					if (exchangeCopy.record) {
						deleteExchangeCopy(exchangeCopy.record.data['id'],
								exchangeCopy.index);
					}
				}
			}];
	var exchangeEvent_store = Ext.create('Ext.data.Store', {
				model : 'ExchangeEvent',
				pageSize : 20,
				autoLoad : false,
				sorters : {
					property : 'createtime',
					direction : 'DESC'
				},
				listeners : {
					beforeload : function(store, option) {
						option.params = store.getProxy().params;
						option.params.page = store.currentPage;
					}
				}
			});
	var exchangeEvent_CheckboxModel = Ext.create('Ext.selection.CheckboxModel',
			{
				mode : 'SINGLE',
				listeners : {
					select : function(m, record, index) {
						exchangeCopy.record = record;
						exchangeCopy.index = index;
					}
				}
			});
	var exchangeCopy = Ext.create('Ext.grid.Panel', {
		autoScroll : true,
		title : title,
		border : 0,
		width : '100%',
		height : '100%',
		id : 'exchangeCopy',
		selModel : exchangeEvent_CheckboxModel,
		dockedItems : [{
			xtype : 'toolbar',
			dock : 'top',
			items : ['事件ID:', eventid, '-', '发送者：', ssource, '-', '接收者：',
					rtarget]
		}, {
			xtype : 'toolbar',
			items : p_tbar_items
		}, {
			xtype : 'pagingtoolbar',
			store : exchangeEvent_store,
			dock : 'bottom',
			displayInfo : true,
			beforePageText : '第',
			afterPageText : '页-共{0}页',
			displayMsg : "显示{0} - {1}条-共{2}条",
			emptyMsg : "没有数据",
			items : [{
				xtype : 'combobox',
				id : 'comSize',
				editable : false,
				size : 5,
				store : ['20', '40', '60', '80', '100'],
				fieldLabel : '每页显示条数',
				listeners : {
					'change' : function() {
						if (getCmp('copycombox').value == '请选择') {
							Ext.Msg.alert('提示', '请选择ActionType');
							return false;
						}
						pageNO = Ext.getCmp('comSize').getValue();
						exchangeEvent_store.pageSize = pageNO;
						var exchanges = {
							data : false,// 确定是接收事件还是备份查询
							startdate : getCmp('startDate').rawValue,
							enddate : getCmp('endDate').rawValue,
							actiontype : getCmp('copycombox').lastValue,
							eventid : getCmp('eventid').value,
							ssource : getCmp('ssource').value,
							rtarget : getCmp('rtarget').value
						}
						var exchangeJson = Ext.encode(exchanges);
						exchangeEvent_store.setProxy({
							type : 'ajax',
							url : 'interfaceExchangeCenterController.do?actionType=findEventOrCopy',
							params : {
								exchange : exchangeJson
							},
							reader : {
								root : 'list',
								totalProperty : 'totalCount'
							}
						});
						exchangeEvent_store.loadPage(1, {
									params : exchangeEvent_store.getProxy().params
								});
					}
				}
			}]
		}],
		flex : 9,
		columns : [{
					xtype : 'rownumberer',
					sortable : false,
					menuDisabled : true,
					width : 30,
					sortable : false
				}, {
					header : 'ID',
					sortable : false,
					menuDisabled : true,
					hidden : true,
					dataIndex : 'id',
					flex : 1
				}, {
					header : '事件ID',
					sortable : false,
					menuDisabled : true,
					dataIndex : 'eventid',
					flex : 1
				}, {
					header : '发送者',
					sortable : false,
					menuDisabled : true,
					dataIndex : 'ssource',
					flex : 1
				}, {
					header : '接收者',
					sortable : false,
					menuDisabled : true,
					dataIndex : 'rtarget',
					flex : 1
				}, {
					header : '创建日期',
					sortable : false,
					menuDisabled : true,
					dataIndex : 'createtime',
					renderer : Ext.util.Format.dateRenderer('Y-m-d H:i:s'),
					flex : 1
				}, {
					header : '过期日期',
					sortable : false,
					menuDisabled : true,
					dataIndex : 'expiretime',
					hidden : true,
					renderer : Ext.util.Format.dateRenderer('Y-m-d H:i:s'),
					flex : 1
				}, {
					header : '备份日期',
					sortable : false,
					menuDisabled : true,
					dataIndex : 'copytime',
					renderer : Ext.util.Format.dateRenderer('Y-m-d H:i:s'),
					flex : 1
				}, {
					header : 'ACTIONTYPE',
					sortable : false,
					menuDisabled : true,
					dataIndex : 'actiontype',
					flex : 1
				}, {
					header : '信息类型',
					sortable : false,
					menuDisabled : true,
					dataIndex : 'type',
					renderer : function(value) {
						if (value == 0) {
							return value = '代码——>代码'
						} else if (value == 1) {
							return value = '代码——>群组'
						} else if (value == 2) {
							return value = '群组——>代码'
						} else {
							return value = '群组——>群组'
						}
					},
					flex : 1
				}],
		store : exchangeEvent_store,
		listeners : {
			itemdblclick : function(view, record, item, index, event) {
				windowshowBizdata(record.data.id, false);
			}
		}
	});
	return exchangeCopy;
}