/**
 * 日志查询
 */
function centerdslogmanagerpanel() {

	var p_tbar_items =[ '关键字:', {
				xtype : 'textfield',
				id : 'content',
				name : 'content',
				flex:1.5,
				emptyText : '如果需要查询多个关键字， 可以用空格隔开',
				editable : true
			},'开始时间:', {
				xtype : 'datefield',
				name : 'startDate',
				id : 'startDate',
				value : new Date(),
				format : 'Y-m-d',
				maxValue : new Date(),
				flex:0.3,
				endDateField : 'endDate',
				editable : false
			},{
				xtype: 'timefield',
				hideLabel: true,
				name: 'starttime_time',
				id: 'starttime_time',
				altFormats: 'H:i:s',
				format: 'H:i:s',
				increment: 30,
				value:'00:00:00',
				editable : false,
				flex:0.25
			}, '结束时间:', {
				xtype : 'datefield',
				format : 'Y-m-d',
				id : 'endDate',
				name : 'endDate',
				value : new Date(),
				startDateField : 'startDate',
				flex:0.3,
				editable : false
			},{
				xtype: 'timefield',
				hideLabel: true,
				name: 'endtime_time',
				id: 'endtime_time',
				altFormats: 'H:i:s',
				format: 'H:i:s',
				increment: 30,
				value:'23:59:59',
				editable : false,
				flex:0.25
			},
			{
				text : '查询',
				icon : 'images/chaxun.png',
				handler : function() {
					Ext.getCmp('center').removeAll();
					var interfacename = Ext.getCmp('interfaceCombobox').value;
					var servicename = Ext.getCmp('serviceCombobox').value;
					var startDate = Ext.getCmp('startDate').rawValue;
					var endDate = Ext.getCmp('endDate').rawValue;
					var startTime = Ext.getCmp('starttime_time').rawValue;
					var endTime = Ext.getCmp('endtime_time').rawValue;			
					var content = '';
					if (Ext.getCmp("content").rawValue == "如果需要查询多个关键字， 可以用空格隔开") {
					} else {
						content = encodeURI(Ext.getCmp("content").rawValue);
					}
					
				
					var interfacetype = 1;// 默认全部
					Ext.getCmp('radiotype').items.each(function(item) {
								if (item.checked) {
									interfacetype = item.inputValue;
									return;
								}
							});
					Ext.getCmp('radiotype').items.each(function(item) {
								if (item.checked) {
									interfacetype = item.inputValue;
									return;
								}
							});
					interfaceStatus_store.setProxy({
						type : 'ajax',
						url : 'interfaceIndexController.do?actionType=findServiceAllRunningStatusDetail',
						timeout : 600000,
						extraParams : {
							interfacetype : interfacetype,	
							interfaceId : interfacename,
							serviceId : servicename,
							startDate : startDate,
							endDate : endDate,
							startTime : startTime,
							endTime : endTime,
							content : content
						},
						reader : {
							root : 'list',
							totalProperty : 'totalCount'
						}
					});
					interfaceStatus_store.loadPage(1, {
								params : interfaceStatus_store.getProxy().params
							});
				}
			},{
				text : 'Fetch日志',
				icon : 'images/chaxun.png',
				handler : function() {
					bodyLoadingMask.show();
					Ext.Ajax.request({
							url : 'interfaceIndexController.do?actionType=addIndex',
							timeout : 6000000,
							success : function(response) {
								bodyLoadingMask.hide();
								var r = response.responseText;
								var result = Ext.decode(r);
								if(result.indexStatus == 1){
									Ext.Msg.alert('成功','Fetch日志成功！');
								}
							},
							failure : function(response) {

							}
							});
					
				}
			}];
	
	var interfaceComboboxURL = 'interfaceIndexController.do?actionType=findInterfaceCombobox';
	var serviceComboboxURL = 'interfaceIndexController.do?actionType=findServiceCombobox';
	
	var serviceCombobox_store = new Ext.data.Store({
				fields : ['displayField', 'value'],
				autoLoad : false
			});
	
	var interfaceCombobox = {
		xtype : 'combobox',
		flex:1,
		id : 'interfaceCombobox',
		name : 'interfaceCombobox',
		emptyText : '请选择接口',
		store : Ext.create('Ext.data.Store', {
					fields : ['displayField', 'value', 'description'],
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
		displayField : 'description',
		valueField : 'value',
		queryMode : 'local',
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
								Ext.getCmp('serviceCombobox').setValue('');
							}
						})
			}
		}
	};

	var serviceCombobox = {
		xtype : 'combobox',
		flex:1,
		id : 'serviceCombobox',
		name : 'serviceCombobox',
		emptyText : '请选择服务',
		store : serviceCombobox_store,
		editable : false,
		displayField : 'description',
		valueField : 'value',
		queryMode : 'local'
	};
	
	Ext.define('interfaceLogStatusModel', {
				extend : 'Ext.data.Model',
				fields : ['logid', 'starttimestamp', 'usetimestamp','source',"starttimedate",
						'interfacename','servicename', {
							name : 'status',
							type : 'int'
						}],
				sorters : [{
							property : 'starttimestamp',
							direction : 'ASC'
						}]
			});

	var interfaceStatus_store = Ext.create('Ext.data.Store', {
				id : 'interfaceStatus_store',
				pageSize : 2000,
				model : 'interfaceLogStatusModel',
				listeners : {
					beforeload : function(store, option) {
						option.params = store.getProxy().params;
					}
				},
				autoLoad : false
			});
	
	var interfaceStatus_panel = Ext.create('Ext.panel.Panel', {
		title : '接口日志查询--每次查询最多只显示5000千条日志，请适当选择查询条件及时间范围',
		layout : 'border',
		id : 'interfaceStatus_panel',
		width : '100%',
		margins : '5 0 0 5',
		height : '100%',
		frame : true,
		items : [{
			region : 'north',
			xtype : 'panel',
			split : false,
			dockedItems : [{
				xtype : 'toolbar',
				dock : 'top',
				items : ['接口:', interfaceCombobox, '-', '服务：', serviceCombobox,
						{
							xtype : 'fieldset',
							flex : 1,
							defaultType : 'radio',
							id : 'radiotype',
							layout : 'hbox',
							items : [{
										checked : true,
										boxLabel : '全部',
										name : 'radiocheck',
										inputValue : '-1'
									}, {
										boxLabel : '成功',
										name : 'radiocheck',
										inputValue : '1'
									}, {
										boxLabel : '失败',
										name : 'radiocheck',
										inputValue : '0'
									}]
						}]
			}, {
				xtype : 'toolbar',
				items : p_tbar_items
			}]
		}
			,{
			region : 'west',
			xtype : 'grid',
			resizable : false,
			sortableColumns : false,
			flex : 4,
			id : 'westgrid',
			collapsible : false,
			store : interfaceStatus_store,
			loadMask : true,
			viewConfig : {
				trackOver : false
			},
			//dockedItems : [{
			//			xtype : 'pagingtoolbar',
			//			store : interfaceStatus_store,
			//			dock : 'bottom',
			//			displayInfo : true,
						//beforePageText : '第',
						//afterPageText : '页-共{0}页',
						//displayMsg : "显示{0} - {1}条-共{2}条",
			//			emptyMsg : "没有数据"
			//		}],
			columns : [{
						xtype : 'rownumberer',
						text : '行号',
						width : 45,
						sortable : false
					},
					{
						text : "id",
						dataIndex : 'logid',
						hidden : true
					},
					{
						text : "接口名称",
						dataIndex : 'interfacename',
						sortable : false,
						menudisabled : true,
						width : 160
					}, {
						text : "服务名称",
						dataIndex : 'servicename',
						sortable : false,
						menudisabled : true,
						width : 160
					}, {
						text : "开始时间",
						sortable : true,
						dataIndex : 'starttimestamp',
						menudisabled : true,
						width : 160
					}, {
						text : "状态",
						dataIndex : 'status',
						sortable : false,
						menudisabled : true,
						renderer : function(value) {
							return value == 1
									? '<font color="blue">S</font>'
									: '<font color="red">F</font>'
						},
						width : 30
					}, {
						text : "耗时(s)",
						dataIndex : 'usetimestamp',
						sortable : false,
						menudisabled : true,
						width : 60,
						renderer : function(value) {
							if (value == null) {
								return 'null'
							} else {
								return value / 1000;
							}
						}
					}, {
						text : "source",
						dataIndex : 'source',
						sortable : false,
						hidden : true,
						menudisabled : true,
						flex : 3
					}, {
						text : "starttimedate",
						dataIndex : 'starttimedate',
						sortable : false,
						hidden : true,
						menudisabled : true,
						flex : 3
					}],
			listeners : {
				itemclick : function(grid, record) {
					bodyLoadingMask.show();
					Ext.Ajax.request({
						url : 'interfaceIndexController.do?actionType=getAlltransformMsg',
						timeout : 600000,
						params : {
							id : record.data.logid,
							source : record.data.source,
							servicename : record.data.servicename,
							interfacename : record.data.interfacename,
							starttimedate : record.data.starttimedate
						},
						success : function(response) {
							bodyLoadingMask.hide();
							var result = Ext.decode(response.responseText);
							if (result.result) {
								showDbAlltransformMsg(result.data);
							} else {
								Ext.Msg.alert('失败', result.data);
							}
						},
						failure : function(response) {
							bodyLoadingMask.hide();
							var result = Ext.decode(response.responseText);
							if (result.result)
								Ext.Msg.alert('失败', result.data);
						}
					})
				}
			}
		}
		, {
			title : '详细信息',
			xtype : 'panel',
			resizable : false,
			region : 'center',
			id : 'center',
			layout : 'fit',
			autoScroll : true,
			border : 1,
			flex : 4
		}
		]
	});
	return interfaceStatus_panel;
}

/**
 * 展示所有节点信息
 * 
 * @param {Object}
 *            record
 * @return {TypeName}
 */
function showDbAlltransformMsg(record) {
	Ext.getCmp('center').removeAll();
	var centerpanel = Ext.create('Ext.grid.Panel', {
		autoScroll : true,
		// title : title,
		border : 0,
		width : '100%',
		height : '100%',
		columns : [{
					header : '节点名称',
					dataIndex : 'transformer_name',
					sortable : false,
					menuDisabled : true,
					flex : 1.5
				}, {
					header : '开始时间',
					dataIndex : 'process_datetime',
					sortable : false,
					menuDisabled : true,
					flex : 1
				}, {
					header : 'Payload类型',
					dataIndex : 'payload_type',
					sortable : false,
					menuDisabled : true,
					flex : 0.8
				}, {
					header : '是正常流程',
					dataIndex : 'isnormal',
					sortable : false,
					menuDisabled : true,
					flex : 0.5,
					renderer : function(value) {
						return 1 == value ? '是' : '否'
					}
				}],
		store : Ext.create('Ext.data.Store', {
					fields : ['id', 'transformer_name', 'process_datetime',
							'payload_type', 'isnormal', 'servicename',
							'interfacename', 'payload_content',
							'inbound_property', 'session_property',
							'outbound_property', 'invocation_property', 'source'],
					data : record,
					autoLoad : true
				}),
		listeners : {
			itemclick : function(view, record, item, index, event) {
				var data = record.data;
				Inbound_Property_data = {
					'root' : []
				};
				Invocation_Property_data = {
					'root' : []
				};
				Session_Property_data = {
					'root' : []
				};
				Outbound_Property_data = {
					'root' : []
				};
				var index = 0;
				var map = Ext.decode(data.inbound_property);
				for (var i in Ext.decode(data.inbound_property)) {
					Inbound_Property_data['root'][index] = {
						key : i,
						value : map[i]
					};
					index++;
				}
				index = 0;
				map = Ext.decode(data.invocation_property);
				for (var i in map) {
					Invocation_Property_data['root'][index] = {
						key : i,
						value : map[i]
					};
					index++;
				}
				index = 0;
				map = Ext.decode(data.session_property);
				for (var i in map) {
					Session_Property_data['root'][index] = {
						key : i,
						value : map[i]
					};
					index++;
				}
				index = 0;
				map = Ext.decode(data.outbound_property);
				for (var i in map) {
					Outbound_Property_data['root'][index] = {
						key : i,
						value : map[i]
					};
					index++;
				}
				var win = Ext.create('Ext.Window', {
					title : '(节点名称：' + record.data.transformer_name + ')报文内容',
					width : 700,
					height : 450,
					resizable : false,
					modal : true,
					items : [{
								xtype : 'textarea',
								autoScroll : true,
								value : record.data.payload_content,
								width : 690,
								height : 255
							}, {
								xtype : 'tabpanel',
								id : 'win_tabpanel',
								height : '35%',
								items : [{
											xtype : 'gridpanel',
											title : 'Inbound_Property',
											border : 1,
											autoScroll : true,
											sortableColumns : false,
											columns : [{
														header : '键',
														dataIndex : 'key',
														flex : 2,
														field : 'textfield'
													}, {
														header : '值',
														flex : 4,
														dataIndex : 'value',
														field : 'textarea'
													}],
											store : Ext.create(
													'Ext.data.Store', {
														fields : ['key',
																'value'],
														data : Inbound_Property_data,
														autoLoad : true,
														proxy : {
															type : 'memory',
															reader : {
																type : 'json',
																root : 'root'
															}
														}
													})
										}, {
											xtype : 'gridpanel',
											title : 'Invocation_Property',
											border : 1,
											sortableColumns : false,
											autoScroll : true,
											columns : [{
														header : '键',
														dataIndex : 'key',
														flex : 2,
														field : 'textfield'
													}, {
														header : '值',
														flex : 4,
														dataIndex : 'value',
														field : 'textarea'
													}],
											store : Ext.create(
													'Ext.data.Store', {
														autoLoad : true,
														fields : ['key',
																'value'],
														data : Invocation_Property_data,
														proxy : {
															type : 'memory',
															reader : {
																type : 'json',
																root : 'root'
															}
														}
													})
										}, {
											xtype : 'gridpanel',
											title : 'Session_Property',
											border : 1,
											sortableColumns : false,
											autoScroll : true,
											columns : [{
														header : '键',
														dataIndex : 'key',
														flex : 2,
														field : 'textfield'
													}, {
														header : '值',
														dataIndex : 'value',
														flex : 4,
														field : 'textarea'
													}],
											store : Ext.create(
													'Ext.data.Store', {
														autoLoad : true,
														fields : ['key',
																'value'],
														data : Session_Property_data,
														proxy : {
															type : 'memory',
															reader : {
																type : 'json',
																root : 'root'
															}
														}
													})
										}, {
											xtype : 'gridpanel',
											title : 'Outbound_Property',
											border : 1,
											sortableColumns : false,
											autoScroll : true,
											columns : [{
														header : '键',
														dataIndex : 'key',
														flex : 2,
														field : 'textfield'
													}, {
														header : '值',
														dataIndex : 'value',
														flex : 4,
														field : 'textarea'
													}],
											store : Ext.create(
													'Ext.data.Store', {
														autoLoad : true,
														fields : ['key',
																'value'],
														data : Outbound_Property_data,
														proxy : {
															type : 'memory',
															reader : {
																type : 'json',
																root : 'root'
															}
														}
													})
										}]
							}],
					buttons : [{
								text : '关闭',
								handler : function() {
									win.close();
								}
							}]
				});
				win.show();
				Ext.getCmp('win_tabpanel').setActiveTab(1);
				Ext.getCmp('win_tabpanel').setActiveTab(0);
			}
		}
	});
	var view = centerpanel.getView().on('render', function(view) {
		view.tip = Ext.create('Ext.tip.ToolTip', {
					target : view.el,
					delegate : view.itemSelector,
					trackMouse : true,
					maxWidth : '50%',
					width : 400,
					height : 250,
					renderTo : Ext.getBody(),
					listeners : {
						beforeshow : function updateTipBody(tip) {
							tip.update(view.getRecord(tip.triggerElement)
									.get('payload_content'));
						}
					}
				});
	});
	Ext.getCmp('center').add(centerpanel);
}
