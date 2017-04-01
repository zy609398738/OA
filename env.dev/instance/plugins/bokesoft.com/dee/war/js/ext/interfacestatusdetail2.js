/**
 * 展示日志查询center界面 数据库日志查询节删除
 * 
 * @return {TypeName}
 */
function centerdslogmanagerpanel() {
	var p_tbar_items = ['开始时间:', {
				xtype : 'datefield',
				name : 'startDate',
				id : 'startDate',
				value : new Date(),
				format : 'Y/m/d',
				maxValue : new Date(),
				flex:1,
				endDateField : 'endDate',
				editable : false
			}, '结束时间:', {
				xtype : 'datefield',
				format : 'Y/m/d',
				id : 'endDate',
				name : 'endDate',
				value : new Date(),
				// maxValue:new Date(),
				startDateField : 'startDate',
				flex:1,
				editable : false
			}, '最小耗时:', {
				xtype : 'numberfield',
				id : 'useTimeStampMin',
				name : 'useTimeStampMin',
				minValue : 0,
				emptyText : '毫秒',
				maxValue : 999999999,
				flex:1
			}, '最大耗时:', {
				xtype : 'numberfield',
				id : 'useTimeStampMax',
				name : 'useTimeStampMax',
				minValue : 1,
				emptyText : '毫秒',
				maxValue : 999999999,
				flex:1
			}, {
				xtype : 'fieldset',
				defaultType : 'radio',
				width : 150,
				id : 'ordertype',
				layout : 'hbox',
				items : [{
							checked : true,
							boxLabel : '默认',
							name : 'radioorder',
							inputValue : '-1'
						}, {
							boxLabel : '升序',
							name : 'radioorder',
							inputValue : '1'
						}, {
							boxLabel : '降序',
							name : 'radioorder',
							inputValue : '0'
						}]
			}, {
				text : '查询',
				icon : 'images/chaxun.png',
				handler : function() {
					Ext.getCmp('center').removeAll();
					var interfacename = Ext.getCmp('interfaceCombobox').value;
					var servicename = Ext.getCmp('serviceCombobox').value;
					var startDate = Ext.getCmp('startDate').rawValue;
					var endDate = Ext.getCmp('endDate').rawValue;
					var useTimeStampMax = Ext.getCmp('useTimeStampMax').value;
					var useTimeStampMin = Ext.getCmp('useTimeStampMin').value;
					if (null == interfacename || '' == interfacename) {
						Ext.Msg.alert('提示', '请选择接口');
						return;
					}
					if (null == servicename || '' == servicename) {
						Ext.Msg.alert('提示', '请选择服务');
						return;
					}
					if (startDate - endDate > 0) {
						Ext.Msg.alert('提示', '开始时间不能大于结束时间');
						return;
					}
					if (Ext.isEmpty(useTimeStampMax)) {
						useTimeStampMax = 999999999;
					}
					if (Ext.isEmpty(useTimeStampMin)) {
						useTimeStampMin = 0;
					}
					if (useTimeStampMax <= useTimeStampMin) {
						Ext.Msg.alert('提示', '最小耗时必须小于最大耗时');
						return;
					}
					var interfacetype = 1;// 默认全部
					Ext.getCmp('radiotype').items.each(function(item) {
								if (item.checked) {
									interfacetype = item.inputValue;
									return;
								}
							});
					var orderByStartTime = -1;// 默认无序
					Ext.getCmp('ordertype').items.each(function(item) {
								if (item.checked) {
									orderByStartTime = item.inputValue;
									return;
								}
							});
					// 条件准备完成
					interfaceStatus_store.setProxy({
						type : 'ajax',
						url : 'interfaceLog2DatasourceController.do?actionType=findServiceAllRunningStatusDetail',
						timeout : 600000,
						extraParams : {
							interfaceId : interfacename,
							serviceId : servicename,
							startDate : startDate,
							endDate : endDate,
							interfacetype : interfacetype,
							useTimeStampMax : useTimeStampMax,
							useTimeStampMin : useTimeStampMin,
							orderByStartTime : orderByStartTime
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
			}];
	var interfaceComboboxURL = 'interfaceInfoFindController.do?actionType=findInterfaceCombobox';
	var serviceComboboxURL = 'interfaceInfoFindController.do?actionType=findServiceCombobox';
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

	var serviceCombobox_store = new Ext.data.Store({
				fields : ['displayField', 'value'],
				autoLoad : false
			});
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
	// 数据model
	Ext.define('interfaceLogStatusModel', {
				extend : 'Ext.data.Model',
				fields : ['id', 'starttimestamp', 'usetimestamp',
						'endtimestamp', {
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
				// sorters : [{
				// property : 'startTimeStamp',
				// direction : 'ASC'
				// }],
				listeners : {
					beforeload : function(store, option) {
						option.params = store.getProxy().params;
						// option.params.page = store.currentPage;
					}
				},
				autoLoad : false
			});
	var interfaceStatus_panel = Ext.create('Ext.panel.Panel', {
		title : '接口运行状态查询',
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
		}, {
			region : 'west',
			xtype : 'grid',
			resizable : false,
			sortableColumns : false,
			flex : 4.2,
			id : 'westgrid',
			collapsible : false,
			store : interfaceStatus_store,
			loadMask : true,
			viewConfig : {
				trackOver : false
			},
			dockedItems : [{
						xtype : 'pagingtoolbar',
						store : interfaceStatus_store,
						dock : 'bottom',
						displayInfo : true,
						beforePageText : '第',
						afterPageText : '页-共{0}页',
						displayMsg : "显示{0} - {1}条-共{2}条",
						emptyMsg : "没有数据"
					}],
			columns : [{
						xtype : 'rownumberer',
						text : '行号',
						width : 40,
						sortable : false
					}, {
						text : "id ",
						hidden : true,
						dataIndex : 'id '
					}, {
						text : "开始时间",
						resizable : false,
						sortable : true,
						dataIndex : 'starttimestamp',
						menuDisabled : true,
						renderer : Ext.util.Format.dateRenderer('Y-m-d H:i:s.u'),
						flex : 3
					}, {
						text : "结束时间",
						resizable : false,
						dataIndex : 'endtimestamp',
						sortable : false,
						renderer : Ext.util.Format.dateRenderer('Y-m-d H:i:s.u'),
						menuDisabled : true,
						flex : 3
					}, {
						text : "耗时(S)",
						resizable : false,
						dataIndex : 'usetimestamp',
						sortable : false,
						menuDisabled : true,
						flex : 1,
						renderer : function(value) {
							if (value == null) {
								return 'null'
							} else {
								return value / 1000;
							}
						}
					}, {
						text : "状态",
						resizable : false,
						dataIndex : 'status',
						sortable : false,
						menuDisabled : true,
						renderer : function(value) {
							return value == 1
									? '<font color="blue">S</font>'
									: '<font color="red">F</font>'
						},
						flex : 0.7
					}],
			listeners : {
				itemclick : function(grid, record) {
					bodyLoadingMask.show();
					Ext.Ajax.request({
						url : 'interfaceLog2DatasourceController.do?actionType=getAlltransformMsg',
						timeout : 600000,
						params : {
							id : record.data.id
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
		}, {
			title : '详细信息',
			xtype : 'panel',
			resizable : false,
			region : 'center',
			id : 'center',
			layout : 'fit',
			autoScroll : true,
			border : 1,
			flex : 5.8
		}]
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
					renderer : Ext.util.Format.dateRenderer('Y-m-d H:i:s.u'),
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
							'outbound_property', 'invocation_property'],
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
/**
 * 删除数据库日志
 */
function deleteDbLog() {
	var interfacename = Ext.getCmp('interfaceCombobox').value;
	var servicename = Ext.getCmp('serviceCombobox').value;
	var startDate = Ext.getCmp('startDate').rawValue;
	var endDate = Ext.getCmp('endDate').rawValue;
	var useTimeStampMax = Ext.getCmp('useTimeStampMax').value;
	var useTimeStampMin = Ext.getCmp('useTimeStampMin').value;
	if (null == interfacename || '' == interfacename) {
		Ext.Msg.alert('提示', '请选择接口');
		return;
	}
	if (null == servicename || '' == servicename) {
		Ext.Msg.alert('提示', '请选择服务');
		return;
	}
	if (startDate - endDate > 0) {
		Ext.Msg.alert('提示', '开始时间不能大于结束时间');
		return;
	}
	if (Ext.isEmpty(useTimeStampMax)) {
		useTimeStampMax = 999999999;
	}
	if (Ext.isEmpty(useTimeStampMin)) {
		useTimeStampMin = 0;
	}
	if (useTimeStampMax <= useTimeStampMin) {
		Ext.Msg.alert('提示', '最小耗时必须小于最大耗时');
		return;
	}
	var interfacetype = 1;// 默认全部
	Ext.getCmp('radiotype2').items.each(function(item) {
				if (item.checked) {
					interfacetype = item.inputValue;
					return;
				}
			});
	Ext.Msg.show({
		title : '确认删除',
		msg : '确定删除符合条件的日志信息吗？',
		buttons : Ext.Msg.YESNO,
		fn : function(type) {
			if ('yes' == type) {
				bodyLoadingMask.show();
				Ext.Ajax.request({
					url : 'interfaceLog2DatasourceController.do?actionType=deleteDbLog',
					params : {
						interfaceId : interfacename,
						serviceId : servicename,
						startDate : startDate,
						endDate : endDate,
						interfacetype : interfacetype,
						useTimeStampMax : useTimeStampMax,
						useTimeStampMin : useTimeStampMin
					},
					success : function(response) {
						bodyLoadingMask.hide();
						var result = Ext.decode(response.responseText);
						if (result.result) {
							Ext.getStore('logDelStore').loadRawData(
									result, false);
						} else {
							Ext.Msg.alert('删除失败', result.data);
						}
					},
					failure : function(response) {
						bodyLoadingMask.hide();
						var result = Ext.decode(response.responseText);
						Ext.Msg.alert('删除失败', result.data);
					}

				});
			}
		}
	})

}
function centerdeletedslogmanagerpanel() {
	var interfaceComboboxURL = 'interfaceInfoFindController.do?actionType=findInterfaceCombobox';
	var serviceComboboxURL = 'interfaceInfoFindController.do?actionType=findServiceCombobox';
	var interfaceCombobox = {
		xtype : 'combobox',
		fieldLabel : '接口',
		width : 350,
		labelWidth : 60,
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

	var serviceCombobox_store = new Ext.data.Store({
				fields : ['displayField', 'value'],
				autoLoad : false
			});
	var serviceCombobox = {
		xtype : 'combobox',
		fieldLabel : '服务',
		width : 350,
		labelWidth : 60,
		id : 'serviceCombobox',
		name : 'serviceCombobox',
		emptyText : '请选择服务',
		store : serviceCombobox_store,
		editable : false,
		displayField : 'description',
		valueField : 'value',
		queryMode : 'local'
	};
	var win_form = Ext.create('Ext.form.Panel', {
				title : '选择删除条件',
				// id : 'interfaceStatus_panel_del',
				width : '100%',
				margins : '5 0 0 5',
				height : '30%',
				frame : true,
				defaults : {
					split : true
				},
				border : 1,
				method : 'post',
				layout : {
					type : 'table',
					columns : 2
				},
				defaultType : 'textfield',
				items : [interfaceCombobox, serviceCombobox, {
							xtype : 'datefield',
							fieldLabel : '开始时间',
							labelWidth : 60,
							name : 'startDate',
							id : 'startDate',
							value : new Date(),
							format : 'Y/m/d',
							maxValue : new Date(),
							width : 350,
							endDateField : 'endDate',
							editable : false
						}, {
							xtype : 'datefield',
							labelWidth : 60,
							fieldLabel : '结束时间',
							format : 'Y/m/d',
							width : 350,
							id : 'endDate',
							name : 'endDate',
							value : new Date(),
							// maxValue:new Date(),
							startDateField : 'startDate',
							editable : false
						}, {
							xtype : 'numberfield',
							fieldLabel : '最小耗时',
							labelWidth : 60,
							id : 'useTimeStampMin',
							name : 'useTimeStampMin',
							minValue : 0,
							emptyText : '毫秒',
							maxValue : 999999999,
							width : 350
						}, {
							xtype : 'numberfield',
							fieldLabel : '最大耗时',
							labelWidth : 60,
							id : 'useTimeStampMax',
							name : 'useTimeStampMax',
							minValue : 1,
							emptyText : '毫秒',
							maxValue : 999999999,
							width : 350
						}, {
							xtype : 'fieldset',
							defaultType : 'radio',
							width : 350,
							id : 'radiotype2',
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
						}, {
							xtype : 'toolbar',
							dock : 'bottom',
							ui : 'footer',
							items : [{
										text : '删除',
										xtype : 'button',
										icon : 'images/shanchu.png',
										handler : function() {
											deleteDbLog()
										}
									}]
						}]
			});
	var interfaceStatus_panel_del = Ext.create('Ext.panel.Panel', {
				id : 'interfaceStatus_panel_del',
				width : '100%',
				margins : '5 0 0 5',
				height : '100%',
				frame : true,
				defaults : {
					split : true
				},
				items : [win_form, {
							xtype : 'grid',
							title : '删除结果',
							autoScroll : true,
							// title : title,
							border : 1,
							columns : [{
										header : '成功删除符合条件数据个数',
										dataIndex : 'totalCount',
										sortable : false,
										menuDisabled : true,
										flex : 1
									}],
							store : Ext.create('Ext.data.Store', {
										storeId : 'logDelStore',
										fields : ['totalCount'],
										data : [],
										autoLoad : false
									})
						}]
			});

	return interfaceStatus_panel_del;
}