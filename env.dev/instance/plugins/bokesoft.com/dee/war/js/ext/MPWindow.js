/**
 * 创建和更新接口的Window，不可改变大小，不可拖动
 * 
 * @return {TypeName}
 */
function windowSaveOrUpdateInterface(record) {
	var serviceUpdateIndex;
	function win_buttons_success(response) {
		var responseText = response.responseText;
		var left_accordion_jkpz_tree = getCmp('left_accordion_jkpz_tree');
		var left_accordion_jkpz_tree_store = left_accordion_jkpz_tree.store;
		if ('success' != responseText) {
			Ext.Msg.alert('保存结果', responseText);
		} else if ('success' == responseText) {
			getCmp('center_interface').store.removeAll();
			getCmp('center_interface').store.load();
			left_accordion_jkpz_tree_store.getRootNode().removeAll();
			left_accordion_jkpz_tree_store.load();
			//Ext.Msg.alert('保存结果', '保存成功');
			Ext.bokedee.msg('保存信息', 1000,'保存成功');
			win.close();
		}
	}

	function win_form_grid_item_btnDelHandler() {
		Ext.Msg.show({
					title : '删除服务',
					msg : win_form_grid_store.getAt(serviceUpdateIndex).data.text,
					buttons : Ext.Msg.YESNO,
					fn : function(type) {
						if ('yes' == type) {
							win_form_grid_store.removeAt(serviceUpdateIndex);
							serviceUpdateIndex = undefined;
						}
					}
				})
	}

	var win_form_grid_item = [{
				text : '新增',
				icon : 'images/add.png',
				scale : 'small',
				width : 50,
				handler : function() {
					var r = Ext.ModelManager.create({
								text : '',
								description : '',
								recordMpLog : 'false',
								fileImport : 'false',
								enable : 'true'
							}, 'Service');
					win_form_grid_store.insert(win_form_grid_store.getCount(),
							r);
					var row = win_form_grid_store.getCount() - 1;
					win_form_grid_pluginCellEdit.startEditByPosition({
								row : row,
								column : 1
							});
				}
			}, {
				text : '删除',
				scale : 'small',
				icon : 'images/shanchu.png',
				width : 50,
				handler : function() {
					if (serviceUpdateIndex != null) {
						win_form_grid_item_btnDelHandler();
					}
				}
			}];

	var win_form_grid_pluginCellEdit = Ext.create(
			'Ext.grid.plugin.CellEditing', {
				clicksToEdit : 1,
				listeners : {
					beforeedit : function(record) {
						serviceUpdateIndex = record.rowIdx;
					}
				}
			});

	var win_form_grid_store = Ext.create('Ext.data.Store', {
				model : 'Service',
				data : [{
							text : '',
							description : '',
							recordMpLog : 'false',
							fileImport : 'false',
							enable : 'true'
						}],
				autoLoad : false,
				listeners : {
					load : function(me) {
					}
				}
			});
	var win_form_grid = Ext.create('Ext.grid.Panel', {
				title : '服务[至少填写一个]',
				store : win_form_grid_store,
				tbar : {
					items : win_form_grid_item
				},
				selModel : Ext.create('Ext.selection.CheckboxModel', {
							mode : 'SINGLE',
							listeners : {
								select : function(m, record, index) {
									serviceUpdateIndex = index;
								}
							}
						}),
				columns : [{
							xtype : 'rownumberer',
							width : 30,
							sortable : false,
							menuDisabled : true,
							text : '序号'
						}, {
							header : '服务名称',
							dataIndex : 'text',
							flex : 3,
							field : 'textfield'
						}, {
							header : '服务描述',
							dataIndex : 'description',
							flex : 6,
							field : 'textfield'
						}, {
							header : '启用',
							dataIndex : 'enable',
							flex : 2,
							renderer : function(value) {
								if (value == "false") {
									return "否"
								} else {
									return "是"
								}
							},
							field : {
								xtype : 'combobox',
								editable : false,
								name : 'enable',
								store : Ext.create('Ext.data.Store', {
											fields : ['value', 'displayField'],
											data : [{
														value : 'true',
														displayField : '是'
													}, {
														value : 'false',
														displayField : '否'
													}]
										}),
								displayField : 'displayField',
								valueField : 'value',
								queryMode : 'local'
							}
						}, {
							header : '记录详细日志',
							dataIndex : 'recordMpLog',
							flex : 2,
							renderer : function(value) {
								if (value == "true") {
									return "是"
								} else {
									return "否"
								}
							},
							field : {
								xtype : 'combobox',
								editable : false,
								name : 'recordMpLog',
								store : Ext.create('Ext.data.Store', {
											fields : ['value', 'displayField'],
											data : [{
														value : 'true',
														displayField : '是'
													}, {
														value : 'false',
														displayField : '否'
													}]
										}),
								displayField : 'displayField',
								valueField : 'value',
								queryMode : 'local',
								allowBlank : false
							}
						}, {
							header : '文件导入',
							dataIndex : 'fileImport',
							flex : 2,
							renderer : function(value) {
								if (value == "true") {
									return "是"
								} else {
									return "否"
								}
							},
							field : {
								xtype : 'combobox',
								editable : false,
								name : 'fileImport',
								store : Ext.create('Ext.data.Store', {
											fields : ['value', 'displayField'],
											data : [{
														value : 'true',
														displayField : '是'
													}, {
														value : 'false',
														displayField : '否'
													}]
										}),
								displayField : 'displayField',
								valueField : 'value',
								queryMode : 'local',
								value : 'false'
							}
						}],
				plugins : [win_form_grid_pluginCellEdit],
				height : 195,
				width : '100%'
			});

	var win_form = Ext.create('Ext.form.Panel', {
				width : '100%',
				height : '100%',
				bodyPadding : 5,
				border : 0,
				layout : 'anchor',
				defaults : {
					anchor : '100%'
				},
				defaultType : 'textfield',
				items : [{
							fieldLabel : '接口名称' + needToFill,
							name : 'text',
							emptyText : '名称不能包含中文字符和空格等,一般由字母数字和下划线组成',
							allowBlank : false
						}, {
							name : 'id',
							hidden : true
						}, {
							xtype : 'combobox',
							fieldLabel : '启动方式' + needToFill,
							name : 'autoRun',
							id : 'interfaceAutoRun',
							store : Ext.create('Ext.data.Store', {
										model : 'Combox',
										data : [{
													value : 'true',
													displayField : '自动启动'
												}, {
													value : 'false',
													displayField : '手动启动'
												}]
									}),
							editable : false,
							displayField : 'displayField',
							valueField : 'value',
							queryMode : 'local',
							allowBlank : false,
							value : 'false'
						}, {
							xtype : 'numberfield',
							fieldLabel : '响应时间(毫秒)' + needToFill,
							name : 'responseTime',
							allowBlank : false,
							step : 1000,
							value : 600000
						}, {
							xtype : 'numberfield',
							fieldLabel : '启动序号',
							name : 'startIndex',
							minValue : 1,
							emptyText : '在自动启动时有效，为空时没有顺序'
						}, {
							xtype : 'textarea',
							fieldLabel : '描述信息',
							name : 'description'
						}, win_form_grid]
			});
	var win_buttons = [{
		text : '确定',
		id : 'textid',
		handler : function() {
			var form_text = win_form.getValues().text;
			var form_autoRun = win_form.getValues().autoRun;
			var form_id = win_form.getValues().id;
			var form_description = win_form.getValues().description;
			var form_responseTime = win_form.getValues().responseTime;
			var form_startIndex = win_form.getValues().startIndex;
			if (form_responseTime == '' || form_text == ''
					|| win_form_grid_store.getCount() == 0) {
				Ext.Msg.alert('提示', '至少要有个服务，接口名称和响应时间不能为空');
				return;
			}
			if (!isRigthName(form_text)) {
				Ext.Msg.alert('提示', '接口名称不能包含空格及中文字符');
				return;
			}
			// 判断启动序号是否重复
			if (validateStartIndexIsTheSame(form_id, form_startIndex)) {
				return;
			}
			if (validateServiceNameIsTheSameOrIsNull(win_form_grid_store)) {
				return;
			}
			var services = storeToJSON(win_form_grid_store);

			var actionType;
			if (record) {
				actionType = 'updateInterface';
			} else {
				actionType = 'saveInterface';
			}

			Ext.Ajax.request({
						url : 'interfaceInfoSaveController.do',
						params : {
							actionType : actionType,
							services : services,
							text : form_text,
							id : form_id,
							autoRun : form_autoRun,
							responseTime : form_responseTime,
							description : form_description,
							startIndex : form_startIndex
						},
						success : function(response) {
							win_buttons_success(response);
						},
						failure : function(response) {
							Ext.Msg.alert('出错了', response.responseText);
						}
					});
		}
	}, {
		text : '取消',
		handler : function() {
			win.close();
		}
	}];
	var win = Ext.create('Ext.Window', {
				title : '创建和更新接口',
				width : 800 * bokedee_width,
				height : 450 * bokedee_height,
				draggable : false,

				modal : true,
				items : win_form,
				buttons : win_buttons
			});
	if (record) {
		win_form.getForm().setValues({
					id : record.data.id,
					text : record.data.text,
					description : record.data.description,
					autoRun : record.data.autoRun,
					responseTime : record.data.responseTime,
					startIndex : record.data.startIndex
				});
		var combox = getCmp('interfaceAutoRun');
		for (var i = 0; i < combox.store.getCount(); i++) {
			if (record.data.autoRun + '' == combox.store.getAt(i).data.autoRun) {
				combox.select(combox.store.getAt(i));
			}
		}
		var url = 'interfaceInfoFindController.do?actionType=findServicesByInterfaceId&interfaceId='
				+ record.data.id;
		win_form_grid_store.removeAll();
		win_form_grid_store.load({
					url : url
				});
	}
	win.show();
}

/**
 * 创建和更新Transformer的Window
 */
function windowSaveOrUpdateMessageProcessor(interfaceId, serviceId, record,
		nodeStore) {
	function win_buttons_success(response) {
		var responseText = response.responseText;
		if ('success' != responseText) {
			Ext.Msg.alert('保存结果', responseText);
		} else if ('success' == responseText) {
			var center_service = getCmp('center_service');
			center_service.store.removeAll();
			center_service.store.load();
			center_service.s = false;
			//Ext.Msg.alert('保存结果', '保存成功');
			Ext.bokedee.msg('保存信息', 1000,'保存成功');
			win.close();
		}
	}

	function win_buttons_GGPZ() {
		bodyLoadingMask.show();
		var actionType;
		if (record) {
			actionType = 'updateProcessor';
		} else {
			actionType = 'saveProcessor';
		}

		Ext.Ajax.request({
					url : 'interfaceInfoSaveController.do',
					params : {
						actionType : actionType,
						text : win_form.record.displayField,
						description : win_form.record.description,
						smallType : win_form.record.value,
						className : win_form.record.className,
						interfaceId : interfaceId,
						enable : win_form.getValues().enable,
						upNode : win_form.getValues().upNode,
						id : win_form.getValues().id,
						serviceId : serviceId,
						isRef : true,
						bigType : win_form.getValues().bigType,
						flowMode : getCmp('flowMode').value
					},
					success : function(response) {
						bodyLoadingMask.hide();
						if ('success' == response.responseText) {
							getCmp('center_service').store.removeAll();
							getCmp('center_service').store.load();
							getCmp('center_service').s = false;
							//Ext.Msg.alert('保存结果', '保存成功');
							Ext.bokedee.msg('保存信息', 1000,'保存成功');
						} else {
							Ext.Msg.alert('出错了', response.responseText);
						}
						win.close();
					},
					failure : function(response) {
						bodyLoadingMask.hide();
						Ext.Msg.alert('出错了', response.responseText);
					}
				});
	}

	function win_buttons_other() {
		var form_text = win_form.getValues().text;
		var form_flowMode = win_form.getValues().flowMode;
		var form_description = win_form.getValues().description;
		var className = win_form.record.className;
		if (form_text == '' || win_form_smallType.value == '请选择') {
			alert('MessageProcessor名称不能为空,必须指定具体的类型');
			return;
		}
		if (form_text.indexOf('*') > -1 || form_text.indexOf(' ') > -1) {
			alert('MessageProcessor名称中不能含有[*]或者空格');
			return;
		}
		if ('inbound' == win_form.getValues().bigType) {
			var center_service = getCmp('center_service');
			var iText = center_service.IRecord.data.text;
			var sText = center_service.SRecord.data.text;
			var isInbound = O.isInbound[iText][sText];
			if (isInbound == true) {
				if ('异常流程' == form_flowMode) {
					Ext.Msg.alert('提示', 'Inbound不可以出现在异常流程中');
					return;
				}
			}
		}
		var actionType;
		if (record) {
			actionType = 'updateProcessor';
		} else {
			actionType = 'saveProcessor';
		}
		Ext.Ajax.request({
					url : 'interfaceInfoSaveController.do',
					params : {
						actionType : actionType,
						text : form_text,
						description : form_description,
						smallType : win_form.record.value,
						className : win_form.record.className,
						interfaceId : interfaceId,
						id : win_form.getValues().id,
						enable : win_form.getValues().enable,
						upNode : win_form.getValues().upNode,
						serviceId : serviceId,
						isRef : false,
						bigType : win_form.getValues().bigType,
						flowMode : getCmp('flowMode').value,
						simpleMpLog : win_form.getValues().simpleMpLog
					},
					success : function(response) {
						if ('inbound' == win_form.getValues().bigType) {
							var center_service = getCmp('center_service');
							var iText = center_service.IRecord.data.text;
							var sText = center_service.SRecord.data.text;
							O.isInbound[iText][sText] = true;
							getCmp('center_service').s = false;
						}
						win_buttons_success(response);
					},
					failure : function(response) {
						Ext.Msg.alert('出错了', response.responseText);
					}
				});
	}

	var win_buttons = [{
		text : '确定',
		id : 'textid',
		handler : function() {
			if (win_form_smallType.value != '请选择') {
				if ('GGPZTransformer' == win_form_bigType['value']
						|| 'standardtemplate' == win_form_bigType['value']
						|| 'custemtemplate' == win_form_bigType['value'])
					win_buttons_GGPZ();
				else
					win_buttons_other();
			} else {
				Ext.Msg.alert('提示', '请选择小类');
			}
		}
	}, {
		text : '取消',
		handler : function() {
			win.close();
		}
	}];
	var win_form_bigType_store_u = 'interfaceInfoFindController.do?actionType=findBigTypeCombobox';
	function win_form_bigType_store_load() {
		var bigType = 'transformer_au';
		if (record) {
			win_form_bigType.setValue(record.data['bigType']);
			bigType = record.data['bigType'];

		} else
			win_form_bigType.setValue('transformer_au');
		Ext.Ajax.request({
					url : 'interfaceInfoFindController.do',
					params : {
						actionType : 'findSmallTypeCombobox',
						bigType : bigType
					},
					success : function(response) {
						win_form_smallType.store.removeAll();
						var result = response.responseText;
						var j = Ext.decode(result);
						win_form_smallType.store.add(j.root);
						if (record) {
							win_form_smallType
									.setValue(record.data['smallType']);
							win_form.getForm().setValues({
								id : record.data.id,
								text : record.data.text,
								description : record.data.description,
								flowMode : record.data.flowMode,
								enable : record.data.enable,
								simpleMpLog : record.data.simpleMpLog == ""
										? 'false'
										: record.data.simpleMpLog
							});
						} else
							win_form_smallType.setValue('请选择');
						if ('GGPZTransformer' != win_form_bigType.value)
							getCmp('createTransformerFC').show();
						else
							getCmp('createTransformerFC').hide();
					},
					failure : function(response) {
						Ext.Msg.alert('出错了', response.responseText);
					}
				});
	}
	var win_form_bigType_store = Ext.create('Ext.data.Store', {
				model : 'ComboBoxMessageprocessor',
				proxy : {
					type : 'ajax',
					url : win_form_bigType_store_u
				},
				autoLoad : true,
				listeners : {
					load : win_form_bigType_store_load
				}
			});

	var win_form_bigType = Ext.create('Ext.form.field.ComboBox', {
				flex : 1,
				name : 'bigType',
				allowBlank : false,
				store : win_form_bigType_store,
				editable : false,
				displayField : 'displayField',
				valueField : 'value',
				queryMode : 'local',
				listeners : {
					select : function(combox) {
						getCmp('flowMode').store.removeAll();
						if ('GGPZTransformer' != combox.value
								&& 'custemtemplate' != combox.value
								&& 'standardtemplate' != combox.value) {
							getCmp('createTransformerFC').show();
							if ('transformer_au' == combox.value
									|| 'transformer_unau' == combox.value) {
								getCmp('flowMode').store
										.add(flowModeStoreDataB);
							} else {
								getCmp('flowMode').store
										.add(flowModeStoreDataA);
							}
						} else {
							getCmp('createTransformerFC').hide();
							getCmp('flowMode').store.add(flowModeStoreDataB);
						}
						Ext.Ajax.request({
									url : 'interfaceInfoFindController.do',
									params : {
										actionType : 'findSmallTypeCombobox',
										bigType : win_form_bigType.value
									},
									success : function(response) {
										win_form_smallType.store.removeAll();
										win_form_smallType.show();
										var result = response.responseText;
										var j = Ext.decode(result);
										win_form_smallType.store.add(j.root);
										win_form_smallType.setValue('请选择');
									},
									failure : function(response) {
										Ext.Msg.alert('出错了',
												response.responseText);
									}
								});
					}
				}
			});
	var win_form_smallType = Ext.create('Ext.form.field.ComboBox', {
				flex : 2,
				name : 'smallType',
				margins : '0 0 0 5',
				hidden : false,
				editable : false,
				displayField : 'displayField',
				valueField : 'value',
				queryMode : 'local',
				value : 'false',
				store : Ext.create('Ext.data.Store', {
							model : 'ComboBoxMessageprocessor'
						}),
				listeners : {
					select : function(combox, record) {
						win_form.record = record[0].data;
					}
				}
			});

	var flowModeStoreDataA = [{
				value : 'normal',
				displayField : '正常流程'
			}, {
				value : 'exception',
				displayField : '异常流程'
			}];
	var flowModeStoreDataB = [{
				value : 'normal',
				displayField : '正常流程'
			}, {
				value : 'exception',
				displayField : '异常流程'
			}, {
				value : 'response',
				displayField : '响应流程'
			}];
	var win_form = Ext.create('Ext.form.Panel', {
		width : '100%',
		height : '100%',
		bodyPadding : 5,
		margins : '20 0 0 5',
		border : 0,
		url : 'interfaceInfoSaveController.do',
		method : 'post',
		layout : 'anchor',
		defaults : {
			anchor : '100%'
		},
		defaultType : 'textfield',
		items : [{
					xtype : 'fieldcontainer',
					fieldLabel : '选择节点类型' + needToFill,
					layout : 'hbox',
					defaultType : 'combobox',
					items : [win_form_bigType, win_form_smallType]
				}, {
					xtype : 'combobox',
					fieldLabel : '流程节点模式' + needToFill,
					editable : false,
					id : 'flowMode',
					name : 'flowMode',
					width : 777,
					store : Ext.create('Ext.data.Store', {
								fields : ['value', 'displayField'],
								data : flowModeStoreDataB
							}),
					listeners : {
						change : function(filed, value) {
							if (nodeStore) {
								var combox = Ext.getCmp('upNode');
								combox.store.removeAll();
								combox.setValue('请选择');
								nodeStore.each(function(item) {
											if (value == 'normal'
													&& item.data.flowMode == '正常流程') {
												combox.store.add(item)
											} else if (value == 'exception'
													&& item.data.flowMode == '异常流程') {
												combox.store.add(item)
											} else if (value == 'response'
													&& item.data.flowMode == '响应流程') {
												combox.store.add(item)
											}
										});
							}
						}
					},
					displayField : 'displayField',
					valueField : 'value',
					queryMode : 'local',
					width : 777,
					allowBlank : false,
					value : 'normal'
				}, {
					xtype : 'combobox',
					fieldLabel : '是否启用',
					editable : false,
					name : 'enable',
					width : 777,
					store : Ext.create('Ext.data.Store', {
								fields : ['value', 'displayField'],
								data : [{
											value : 'true',
											displayField : '是'
										}, {
											value : 'false',
											displayField : '否'
										}]
							}),
					displayField : 'displayField',
					valueField : 'value',
					queryMode : 'local',
					width : 777,
					allowBlank : false,
					value : 'true'
				}, {
					xtype : 'combobox',
					fieldLabel : '记录该节点日志',
					editable : false,
					name : 'simpleMpLog',
					width : 777,
					store : Ext.create('Ext.data.Store', {
								fields : ['value', 'displayField'],
								data : [{
											value : 'true',
											displayField : '是'
										}, {
											value : 'false',
											displayField : '否'
										}]
							}),
					displayField : 'displayField',
					valueField : 'value',
					queryMode : 'local',
					width : 777,
					allowBlank : false,
					value : 'false'
				}, {
					xtype : 'combobox',
					fieldLabel : '此节点之上',
					editable : false,
					id : 'upNode',
					name : 'upNode',
					width : 777,
					store : Ext.create('Ext.data.Store', {
								model : 'MessageProcessor'
							}),
					hidden : record ? true : false,// 新增的情况下 选择上层节点
					displayField : 'text',
					valueField : 'id',
					queryMode : 'local',
					width : 777,
					allowBlank : false,
					value : '请选择'
				}, {
					xtype : 'fieldcontainer',
					id : 'createTransformerFC',
					defaultType : 'textfield',
					hidden : true,
					layout : 'anchor',
					items : [{
								fieldLabel : '流程节点名称' + needToFill,
								name : 'text',
								width : 777,
								allowBlank : false
							}, {
								name : 'id',
								hidden : true
							}, {
								name : 'isRef',
								hidden : true,
								value : false
							}, {
								xtype : 'textarea',
								fieldLabel : '流程节点描述',
								name : 'description',
								width : 777,
								height : 100,
								allowBlank : true
							}]
				}]
	});

	if (record) {
		win_form.record = Object();
		win_form.record.displayField = record.data.text;
		win_form.record.description = record.data.description;
		win_form.record.value = record.data.smallType;
		win_form.record.className = record.data.className;
	} else {
		var combox = Ext.getCmp('upNode');
		combox.store.removeAll();
		combox.setValue('请选择');
		nodeStore.each(function(item) {
					if (item.data.flowMode == '正常流程') {
						combox.store.add(item)
					}
				});
	}
	var win = Ext.create('Ext.Window', {
				title : '创建和更新MessageProcessor',
				width : 800 * bokedee_width,
				height : 450 * bokedee_height,
				draggable : false,

				modal : true,
				buttons : win_buttons,
				items : [win_form]
			});
	win.show();
}

/**
 * 复制接口的Window
 */
function windowCopyInterface(record) {

	var serviceUpdateIndex;

	function win_buttons_success(response) {
		var responseText = response.responseText;
		var left_accordion_jkpz_tree = getCmp('left_accordion_jkpz_tree');
		var left_accordion_jkpz_tree_store = left_accordion_jkpz_tree.store;
		if ('success' != responseText) {
			Ext.Msg.alert('复制结果', responseText);
		} else if ('success' == responseText) {
			getCmp('center_interface').store.removeAll();
			getCmp('center_interface').store.load();
			left_accordion_jkpz_tree_store.getRootNode().removeAll();
			left_accordion_jkpz_tree_store.load();
			Ext.Msg.alert('复制结果', '复制成功');
			win.close();
		}
	}

	var win_buttons = [{
		text : '确定',
		handler : function() {
			var id = win_form.getValues().id;
			var form_text = win_form.getValues().text;
			var form_autoRun = win_form.getValues().autoRun;
			var form_description = win_form.getValues().description;
			var form_responseTime = win_form.getValues().responseTime;
			var form_startIndex = win_form.getValues().startIndex;
			if (form_responseTime == '' || form_text == ''
					|| win_form_grid_store.getCount() == 0) {
				alert('至少要有一个服务，接口名称和响应时间不能为空');
				return;
			}
			if (form_text.indexOf('*') > -1 || form_text.indexOf(' ') > -1) {
				alert('接口名称与描述中不能含有[*]或者空格');
				return;
			}
			if (validateServiceNameIsTheSameOrIsNull(win_form_grid_store)) {
				return;
			}
			var services = storeToJSON(win_form_grid_store);
			var gs = win_form_grid_store;
			var serviceFlag = {};
			for (var i = 0; i < gs.getCount(); i++) {
				var r = gs.getAt(i);
				serviceFlag[r.data.text] = r.raw == undefined
						? 'null'
						: r.raw.text;
			}
			var serviceFlagJson = Ext.encode(serviceFlag);
			Ext.Ajax.request({
						url : 'interfaceInfoSaveController.do',
						params : {
							actionType : 'copyInterface',
							id : id,
							serviceFlag : serviceFlagJson,
							services : services,
							text : form_text,
							autoRun : form_autoRun,
							responseTime : form_responseTime,
							description : form_description,
							startIndex : form_startIndex
						},
						success : function(response) {
							win_buttons_success(response);
						},
						failure : function(response) {
							Ext.Msg.alert('保存失败', response.responseText);
						}
					});
		}
	}, {
		text : '取消',
		handler : function() {
			win.close();
		}
	}];
	var win_form_grid_pluginCellEdit = Ext.create(
			'Ext.grid.plugin.CellEditing', {
				clicksToEdit : 1,
				listeners : {
					beforeedit : function(record) {
						serviceUpdateIndex = record.rowIdx;
					}
				}
			});

	var win_form_grid_store = Ext.create('Ext.data.Store', {
				model : 'Service',
				data : [{
							text : '',
							description : ''
						}],
				autoLoad : false,
				listeners : {
					load : function(me) {
						var xx = 1;
					}
				}
			});

	var win_form_grid_items = [{
				text : '新增',
				scale : 'small',
				icon : 'images/add.png',
				width : 50,
				handler : function() {
					var r = Ext.ModelManager.create({
								text : '',
								description : ''
							}, 'Service');
					win_form_grid_store.insert(win_form_grid_store.getCount(),
							r);
					var row = win_form_grid_store.getCount() - 1;
					win_form_grid_pluginCellEdit.startEditByPosition({
								row : row,
								column : 0
							});
				}
			}, {
				text : '删除',
				scale : 'small',
				icon : 'images/shanchu.png',
				width : 50,
				handler : function() {
					if (win_form_grid_store.getCount() == 1) {
						alert('至少要有一个服务');
						return;
					}
					win_form_grid_store.removeAt(serviceUpdateIndex);
				}
			}];

	var win_form_grid = Ext.create('Ext.grid.Panel', {
				title : '服务[至少填写一个]',
				store : win_form_grid_store,
				tbar : {
					items : win_form_grid_items
				},
				columns : [{
							header : '服务名称',
							dataIndex : 'text',
							flex : 22,
							field : 'textfield'
						}, {
							header : '服务描述',
							dataIndex : 'description',
							flex : 78,
							field : 'textfield'
						}],
				plugins : [win_form_grid_pluginCellEdit],
				height : 220

			});
	var win_form = Ext.create('Ext.form.Panel', {
				width : '100%',
				height : '100%',
				bodyPadding : 5,
				border : 0,
				url : 'interfaceInfoSaveController.do',
				method : 'post',
				layout : 'anchor',
				defaults : {
					anchor : '100%'
				},
				defaultType : 'textfield',
				items : [{
							fieldLabel : '接口名称',
							name : 'text',
							allowBlank : false
						}, {
							name : 'id',
							hidden : true
						}, {
							xtype : 'combobox',
							fieldLabel : '启动方式',
							id : 'interfaceAutoRun',
							name : 'autoRun',
							store : Ext.create('Ext.data.Store', {
										model : 'Combox',
										data : [{
													value : 'true',
													displayField : '自动启动'
												}, {
													value : 'false',
													displayField : '手动启动'
												}]

									}),
							editable : false,
							displayField : 'displayField',
							valueField : 'value',
							queryMode : 'local',
							allowBlank : false
						}, {
							xtype : 'numberfield',
							fieldLabel : '响应时间(毫秒)',
							name : 'responseTime',
							allowBlank : false,
							step : 1000
						}, {
							xtype : 'textarea',
							fieldLabel : '描述信息',
							name : 'description'
						}, win_form_grid]
			});

	var win = Ext.create('Ext.Window', {
				title : '复制接口',
				id : 'winCopyInterface',
				width : 800 * bokedee_width,
				height : 450 * bokedee_height,
				draggable : false,

				modal : true,
				items : win_form,
				buttons : win_buttons
			});
	win_form.getForm().setValues({
				id : record.data.id,
				text : record.data.text + '.copy',
				description : record.data.description,
				autoRun : record.data.autoRun,
				responseTime : record.data.responseTime
			});
	var combox = getCmp('interfaceAutoRun');
	for (var i = 0; i < combox.store.getCount(); i++) {
		if (record.data.autoRun + '' == combox.store.getAt(i).data.autoRun) {
			combox.select(combox.store.getAt(i));
		}
	}
	var url = 'interfaceInfoFindController.do?actionType=findServicesByInterfaceId&interfaceId='
			+ record.data.id;
	win_form_grid_store.removeAll();
	win_form_grid_store.load({
				url : url
			});
	win.show();
}

/**
 * 设置工作目录
 * 
 * @return {TypeName}
 */

function windowSetWorkPath() {

	function win_buttonsAddFun(btn, txt) {
		if ('ok' == btn) {
			Ext.Ajax.request({
						url : 'interfaceInfoSaveController.do',
						params : {
							actionType : 'addWorkPath',
							path : txt
						},
						success : function(response) {
							var result = response.responseText;
							if ('fail' != result) {
								var j = Ext.decode(result);
								getCmp('allWP').store.removeAll();
								getCmp('allWP').store.add(j.root);
								alert('添加成功');
							} else {
								Ext.Msg.alert('未添加成功', '目录不存在,请先手动创建');
							}
						},
						failure : function(response) {
							Ext.Msg.alert('添加失败', response.responseText);
						}
					});
		}
	}

	function win_buttonsDelFun() {
		var isDelFile = getCmp('isDelFile').getValue();
		Ext.Ajax.request({
					url : 'interfaceInfoSaveController.do',
					params : {
						actionType : 'delWorkPath',
						path : win_form.getValues().allWP,
						isDelFile : isDelFile
					},
					success : function(response) {
						var result = response.responseText;
						if ('success' == result) {
							alert(result);
							var j = Ext.decode(result);
							getCmp('allWP').store.removeAll();
							getCmp('allWP').store.add(j.root);
							if (j.root[0]) {
								getCmp('allWP').select(getCmp('allWP').store
										.getAt(0));
							}
							alert('删除成功');
						}
					},
					failure : function(response) {
						Ext.Msg.alert('删除失败', response.responseText);
					}
				});
	}

	function win_buttonsSwitchWPFun() {
		Ext.Ajax.request({
					url : 'interfaceInfoSaveController.do',
					params : {
						actionType : 'switchWP',
						workPath : win_form.getValues().allWP
					},
					success : function(response) {
						var result = response.responseText;
						if ('success' == result) {
							window.location.href = 'index.jsp';
						} else {
							var j = Ext.decode(result);
							getCmp('allWP').store.removeAll();
							getCmp('allWP').store.add(j.root);
							getCmp('allWP').setValue(O.get(WORKDIR));
							Ext.Msg.alert('切换不成功', '目录不存在,请先手动创建');
						}
					},
					failure : function(response) {
						Ext.Msg.alert('切换失败', response.responseText);
					}
				});
	}

	var win_buttons_DelWorkDir = {
		text : '删除工作目录',
		handler : function() {
			if (win_form.getValues().allWP == O.get(WORKDIR)) {
				alert('当前工作目录不可以删除！');
				return false;
			}
			var title = '确认删除,';
			if (getCmp('isDelFile').getValue())
				title += '同时删除文件';
			else
				title += '不删除文件';
			Ext.Msg.show({
						title : title,
						msg : '工作目录：' + win_form.getValues().allWP,
						buttons : Ext.Msg.YESNO,
						fn : function(type) {
							if ('yes' == type) {
								win_buttonsDelFun();
							}
						}
					})
		}
	}

	var win_buttons = [{
				text : '切换',
				handler : function() {
					if (win_form.getValues().allWP == O.get(WORKDIR)) {
						alert('目标工作目录与当前工作目录相同');
						return false;
					}
					Ext.Msg.show({
								title : '切换工作目录',
								msg : '切换工作目录为：' + win_form.getValues().allWP,
								buttons : Ext.Msg.YESNO,
								fn : function(type) {
									if ('yes' == type) {
										win_buttonsSwitchWPFun();
									}
								}
							})
				}
			}, {
				text : '增加工作目录',
				handler : function() {
					Ext.MessageBox
							.prompt('工作目录', '请输入工作目录:', win_buttonsAddFun);
				}
			},
			/* win_buttons_DelWorkDir, */{
				text : '取消',
				handler : function() {
					win.close();
				}
			}];

	var win_form_fAllWP = 'interfaceInfoFindController.do?actionType=findAllWP';

	var selectFloder = {
		fieldLabel : '选择工作目录',
		xtype : 'combobox',
		editable : false,
		id : 'allWP',
		name : 'allWP',
		store : Ext.create('Ext.data.Store', {
					model : 'Combox',
					proxy : {
						type : 'ajax',
						url : win_form_fAllWP,
						reader : {
							type : 'json',
							root : 'root'
						}
					},
					autoLoad : true
				}),
		displayField : 'displayField',
		valueField : 'value',
		queryMode : 'local',
		allowBlank : false,
		value : O.get(WORKDIR),
		width : 773
	}

	var isDelFile = {
		xtype : 'checkboxfield',
		margins : '0 0 0 15',
		fieldLabel : '同时删除文件',
		id : 'isDelFile'
	}

	var win_form = Ext.create('Ext.form.Panel', {
				width : '100%',
				height : '100%',
				bodyPadding : 5,
				layout : 'absolute',
				autoScroll : true,
				margins : '20 0 0 5',
				border : 0,
				method : 'post',
				defaults : {
					anchor : '100%'
				},
				defaultType : 'textfield',
				items : [{
							fieldLabel : '当前工作目录',
							name : 'workDir',
							allowBlank : false,
							value : O.get(WORKDIR),
							x : 5,
							y : 10,
							readOnly : true
						}, {
							xtype : 'fieldcontainer',
							layout : 'hbox',
							x : 5,
							y : 40,
							items : [selectFloder]
						}, {
							xtype : 'container',
							x : 120,
							y : 350,
							height : 30,
							width : 700,
							autoEl : {
								tag : 'div',
								html : '备注：添加工作目录时可以使用绝对路径和相对路径，相对路径保存在服务器的bin目录下。'
							}
						}]
			});

	var win = Ext.create('Ext.Window', {
				title : '设置工作目录',
				width : 800 * bokedee_width,
				height : 450 * bokedee_height,
				draggable : false,
				autoScroll : true,

				modal : true,
				buttons : win_buttons,
				items : [win_form]
			});

	win.show();
}

/**
 * 复制服务
 * 
 * @param {Object}
 *            record
 * @return {TypeName}
 */
function windowCopyService(record) {

	function win_buttons_success(response) {
		var responseText = response.responseText;
		var left_accordion_jkpz_tree = getCmp('left_accordion_jkpz_tree');
		var left_accordion_jkpz_tree_store = left_accordion_jkpz_tree.store;
		if ('success' != responseText) {
			Ext.Msg.alert('复制结果', responseText);
		} else if ('success' == responseText) {
			left_accordion_jkpz_tree_store.getRootNode().removeAll();
			left_accordion_jkpz_tree_store.load();
			Ext.Msg.alert('复制结果', '复制成功');
			win.close();
		}
	}

	function win_buttonsAjax(interfaceId, serviceId, copyToInterfaceId,
			interfaceName, serviceRename, messageProcessorPrefixName) {
		Ext.Ajax.request({
					url : 'interfaceInfoSaveController.do',
					params : {
						actionType : 'copyService',
						interfaceId : interfaceId,
						serviceId : serviceId,
						interfaceName : interfaceName,
						copyToInterfaceId : copyToInterfaceId,
						serviceRename : serviceRename,
						messageProcessorPrefixName : messageProcessorPrefixName
					},
					success : function(response) {
						win_buttons_success(response);
					},
					failure : function(response) {
						Ext.Msg.alert('保存失败', response.responseText);
					}
				});

	}

	var win_buttons = [{
		text : '确定',
		handler : function() {
			if (win_form.getValues().serviceCombobox == '请选择...') {
				alert('请选择要复制的服务！！！');
				return;
			}
			if (form_messageProcessorPrefixName)
				if (form_messageProcessorPrefixName.indexOf(' ') > -1) {
					alert('Messageprocessor前缀名重命名没有填取，或者包含空字符串');
					return;
				}
			if (win_form.getValues().rename) {
				if (win_form.getValues().rename == ''
						|| win_form.getValues().rename.indexOf(' ') > -1) {
					alert('服务重命名没有填取，或者包含空字符串');
					return;
				}
			} else {
				alert('服务重命名没有填取');
				return;
			}
			if (win_form.getValues().interfaceCombobox == '请选择...') {
				alert('请选择要目标接口！！！');
				return;
			}
			var interfaceId = win_form.getValues().interfaceId;
			var interfaceName = win_form.interfaceSelected.displayField;
			var serviceId = win_form.serviceSelected.value;
			var copyToInterfaceId = win_form.interfaceSelected.value;
			var form_serviceRename = win_form.getValues().rename;
			var form_messageProcessorPrefixName = win_form.getValues().messageProcessorPrefixName;
			win_buttonsAjax(interfaceId, serviceId, copyToInterfaceId,
					interfaceName, form_serviceRename,
					form_messageProcessorPrefixName);
		}
	}, {
		text : '取消',
		handler : function() {
			win.close();
		}
	}];
	var copyServiceComboboxURL = 'interfaceInfoFindController.do?actionType=findServicesComboboxByInterfaceId&interfaceId='
			+ record.data.id;
	var copyToInterfaceComboboxURL = 'interfaceInfoFindController.do?actionType=findInterfaceCombobox';
	var win_form = Ext.create('Ext.form.Panel', {
				width : '100%',
				height : '100%',
				bodyPadding : 5,
				border : 0,
				url : 'interfaceInfoSaveController.do',
				method : 'post',
				layout : 'anchor',
				defaults : {
					anchor : '100%'
				},
				defaultType : 'textfield',
				items : [{
							name : 'interfaceId',
							hidden : true
						}, {
							xtype : 'combobox',
							fieldLabel : '要复制的服务',
							id : 'copyServiceCombobox',
							name : 'serviceCombobox',
							store : Ext.create('Ext.data.Store', {
										model : 'Combox',
										proxy : {
											type : 'ajax',
											url : copyServiceComboboxURL,
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
							value : '请选择...',
							allowBlank : false,
							listeners : {
								select : function(combobox, record) {
									win_form.serviceSelected = record[0].raw
								}
							}
						}, {
							fieldLabel : '服务重命名为',
							name : 'rename',
							allowBlank : false
						}, {
							xtype : 'combobox',
							fieldLabel : '复制到目标接口',
							id : 'copyToInterfaceCombobox',
							name : 'interfaceCombobox',
							value : '请选择...',
							store : Ext.create('Ext.data.Store', {
										model : 'Combox',
										proxy : {
											type : 'ajax',
											url : copyToInterfaceComboboxURL,
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
									win_form.interfaceSelected = record[0].raw
								}
							}
						}, {
							fieldLabel : 'MessageProcessor前缀名',
							name : 'messageProcessorPrefixName'
						}]
			});

	var win = Ext.create('Ext.Window', {
				title : '复制服务',
				id : 'winCopyService',
				width : 800 * bokedee_width,
				height : 450 * bokedee_height,
				draggable : false,

				modal : true,
				items : win_form,
				buttons : win_buttons
			});
	win_form.getForm().setValues({
				interfaceId : record.data.id
			});
	win.show();
}
/**
 * 复制Messageprocessor
 * 
 * @param {Object}
 *            mpInfo
 * @return {TypeName}
 */
function windowCopyMessageprocessor(mpInfo) {

	function win_buttons_success(response) {
		var responseText = response.responseText;
		if ('success' != responseText) {
			Ext.Msg.alert('复制结果', responseText);
		} else if ('success' == responseText) {
			Ext.Msg.alert('复制结果', '复制成功');
			getCmp('center_service').store.removeAll();
			getCmp('center_service').store.load();
			getCmp('center_service').p_sel_record = null;
			getCmp('center_service').s = false;
			win.close();
		}
	}

	function win_buttonsAjax(copyToServiceId, copyToInterfaceId, form_mpRename,
			mpInfoJson) {
		Ext.Ajax.request({
					url : 'interfaceInfoSaveController.do',
					params : {
						actionType : 'copyMessageprocessor',
						copyToServiceId : copyToServiceId,
						copyToInterfaceId : copyToInterfaceId,
						mpRename : form_mpRename,
						mpInfoJson : mpInfoJson
					},
					success : function(response) {
						win_buttons_success(response);
					},
					failure : function(response) {
						Ext.Msg.alert('保存失败', response.responseText);
					}
				});
	}

	var win_buttons = [{
		text : '确定',
		handler : function() {

			if (win_form.getValues().serviceCombobox == '请选择...') {
				alert('请选择要复制的服务！！！');
				return;
			}
			if (win_form.getValues().rename) {
				if (win_form.getValues().rename == ''
						|| win_form.getValues().rename.indexOf(' ') > -1) {
					alert('服务重命名没有填取，或者包含空字符串');
					return;
				}
			} else {
				alert('服务重命名没有填取');
				return;
			}
			if (win_form.getValues().interfaceCombobox == '请选择...') {
				alert('请选择要目标接口！！！');
				return;
			}
			var copyToServiceId = win_form.serviceSelected.value;
			var copyToInterfaceId = win_form.interfaceSelected.value;
			var form_mpRename = win_form.getValues().rename;
			mpInfo.upNode = win_form.getValues().upNode;
			var mpInfoJson = Ext.encode(mpInfo);
			win_buttonsAjax(copyToServiceId, copyToInterfaceId, form_mpRename,
					mpInfoJson);
		}
	}, {
		text : '取消',
		handler : function() {
			win.close();
		}
	}];

	function copyToInterfaceComboboxSelect(record) {
		win_form.interfaceSelected = record[0].data;
		var interfaceId = record[0].raw.value;
		Ext.Ajax.request({
			url : copyServiceComboboxURL,
			params : {
				interfaceId : interfaceId
			},
			success : function(response) {
				var serviceComboboxStore = getCmp('copyServiceCombobox').store;
				serviceComboboxStore.removeAll();
				var j = Ext.decode(response.responseText);
				serviceComboboxStore.add(j.root);
				getCmp('copyServiceCombobox').select(serviceComboboxStore
						.getAt(0));
				win_form.serviceSelected = serviceComboboxStore.getAt(0).data;
				// 选择复制的位置
				// getCmp('copyServiceCombobox').value
				// getCmp('copyToInterfaceCombobox').value
				// mpInfo.flowMode
				var type = mpInfo.flowMode
				if (type == "正常流程") {
					type = "normal";
				} else if (type == "异常流程") {
					type = "exception";
				} else {
					type = "response";
				}
				var findTransformerUrl = 'interfaceInfoFindController.do?actionType=findTransformerByType&interfaceId='
						+ getCmp('copyToInterfaceCombobox').value
						+ '&serviceId='
						+ getCmp('copyServiceCombobox').value
						+ '&type=' + type;
				var result = ajaxSyncCall(findTransformerUrl, null, null);
				var nodeStore = getCmp('upNode').store;
				nodeStore.removeAll();
				nodeStore.add(Ext.decode(result));
			}
		});
	}

	var copyServiceComboboxURL = 'interfaceInfoFindController.do?actionType=findServicesComboboxByInterfaceId'
	var copyToInterfaceComboboxURL = 'interfaceInfoFindController.do?actionType=findInterfaceCombobox';
	var win_form = Ext.create('Ext.form.Panel', {
		width : '100%',
		height : '100%',
		bodyPadding : 5,
		border : 0,
		url : 'interfaceInfoSaveController.do',
		method : 'post',
		layout : 'anchor',
		defaults : {
			anchor : '100%'
		},
		defaultType : 'textfield',
		items : [{
					fieldLabel : 'MP名称',
					name : 'mpName',
					readOnly : true
				}, {
					fieldLabel : 'MP重命名为',
					name : 'rename',
					allowBlank : false
				}, {
					xtype : 'combobox',
					fieldLabel : '复制到目标接口',
					id : 'copyToInterfaceCombobox',
					name : 'interfaceCombobox',
					value : '请选择...',
					store : Ext.create('Ext.data.Store', {
								model : 'Combox',
								proxy : {
									type : 'ajax',
									url : copyToInterfaceComboboxURL,
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
							copyToInterfaceComboboxSelect(record);
							Ext.getCmp('upNode').setValue('请选择...');
						}
					}
				}, {
					xtype : 'combobox',
					fieldLabel : '复制到目标服务',
					id : 'copyServiceCombobox',
					name : 'serviceCombobox',
					store : Ext.create('Ext.data.Store', {
								model : 'Combox',
								data : [],
								proxy : {
									type : 'memory',
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
					value : '请选择...',
					allowBlank : false,
					listeners : {
						select : function(combobox, record) {
							win_form.serviceSelected = record[0].data;
							// 选择复制的位置
							// getCmp('copyServiceCombobox').value
							// getCmp('copyToInterfaceCombobox').value
							// mpInfo.flowMode
							var type = mpInfo.flowMode
							if (type == "正常流程") {
								type = "normal";
							} else if (type == "异常流程") {
								type = "exception";
							} else {
								type = "response";
							}
							var findTransformerUrl = 'interfaceInfoFindController.do?actionType=findTransformerByType&interfaceId='
									+ getCmp('copyToInterfaceCombobox').value
									+ '&serviceId='
									+ getCmp('copyServiceCombobox').value
									+ '&type=' + type;
							var result = ajaxSyncCall(findTransformerUrl, null,
									null);
							var nodeStore = getCmp('upNode').store;
							nodeStore.removeAll();
							nodeStore.add(Ext.decode(result));
							Ext.getCmp('upNode').setValue('请选择...');
						}
					}
				}, {
					xtype : 'combobox',
					fieldLabel : '此节点之上',
					editable : false,
					id : 'upNode',
					name : 'upNode',
					width : 777,
					store : Ext.create('Ext.data.Store', {
								model : 'MessageProcessor'
							}),
					displayField : 'text',
					valueField : 'id',
					queryMode : 'local',
					width : 777,
					allowBlank : false,
					value : '请选择...'
				}, {
					name : 'interfaceId',
					hidden : true
				}]
	});

	var win = Ext.create('Ext.Window', {
				title : '复制Messageprocessor',
				id : 'winCopyService',
				width : 800 * bokedee_width,
				height : 450 * bokedee_height,
				draggable : false,

				modal : true,
				items : win_form,
				buttons : win_buttons
			});
	win_form.getForm().setValues({
				mpName : mpInfo.text
			});
	win.show();
}

/**
 * 显示日志内容
 * 
 * @param {Object}
 *            logType
 * @param {Object}
 *            interfaceName
 */
function windowShowLogContent(logType, interfaceName) {
	var data = getCmp('logManager').p_sel_record.data;
	var url = 'interfaceLogManagerController.do?actionType=findLogContent';
	Ext.Ajax.request({
		url : url,
		params : {
			logType : logType,
			text : Ext.encode(data),
			interfaceName : interfaceName
		},
		success : function(response) {
			document.getElementById('logContent').value = response.responseText;
		}
	});

	var textAreaLogContent = '<textarea wrap="off" style="width:790px;height:390px;"id="logContent" ></textarea>';

	var win_form = Ext.create('Ext.form.Panel', {
				layout : 'fit',
				width : '100%',
				height : '100%',
				bodyPadding : 0,
				border : 0,
				html : textAreaLogContent
			});

	var win_buttons = [{
				text : '关闭',
				handler : function() {
					win.close();
				}
			}];

	var win = Ext.create('Ext.Window', {
				title : data.text,
				id : 'showLogContent',
				width : 800 * bokedee_width,
				height : 450 * bokedee_height,
				draggable : false,

				modal : true,
				items : win_form,
				buttons : win_buttons
			});
	win.show();
}

/**
 * 显示日志内容
 * 
 * @param {Object}
 *            logType
 * @param {Object}
 *            interfaceName
 */
function windowShowSynLogContent() {
	var data = getCmp('synLogManager').p_sel_record.data;
	var url = 'interfaceLogManagerController.do?actionType=findLogContent';
	function doSuccess(result) {
		document.getElementById('logContent').value = result;
	}
	Ext.Ajax.request({
				url : url,
				params : {
					logType : 'synchroniseLog',
					text : Ext.encode(data)
				},
				success : function(response) {
					doSuccess(response.responseText);
				}
			});

	var textAreaLogContent = '<textarea wrap="off" style="width:790px;height:390px;"id="logContent" ></textarea>';

	var win_form = Ext.create('Ext.form.Panel', {
				layout : 'fit',
				width : '100%',
				height : '100%',
				bodyPadding : 0,
				border : 0,
				html : textAreaLogContent
			});

	var win_buttons = [{
				text : '关闭',
				handler : function() {
					win.close();
				}
			}];

	var win = Ext.create('Ext.Window', {
				title : data.text,
				id : 'showLogContent',
				width : 800 * bokedee_width,
				height : 450 * bokedee_height,
				draggable : false,
				modal : true,
				items : win_form,
				buttons : win_buttons
			});
	win.show();
}

/**
 * 显示调试日志的内容
 * 
 * @param {Object}
 *            record
 * @return {TypeName}
 */
function windowShowDebugLogDetail() {
	var data = getCmp('debugLogManager').detail_record.data;
	var win_buttons = [{
				text : '关闭',
				handler : function() {
					win.close();
				}
			}];
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
	for (var i in data.Inbound_Property) {
		Inbound_Property_data['root'][index] = {
			key : i,
			value : data.Inbound_Property[i]
		};
		index++;
	}
	index = 0;
	for (var i in data.Invocation_Property) {
		Invocation_Property_data['root'][index] = {
			key : i,
			value : data.Invocation_Property[i]
		};
		index++;
	}
	index = 0;
	for (var i in data.Session_Property) {
		Session_Property_data['root'][index] = {
			key : i,
			value : data.Session_Property[i]
		};
		index++;
	}
	index = 0;
	for (var i in data.Outbound_Property) {
		Outbound_Property_data['root'][index] = {
			key : i,
			value : data.Outbound_Property[i]
		};
		index++;
	}

	var win_center = Ext.create('Ext.panel.Panel', {
				title : '主菜单',
				region : 'center',
				collapsible : true,
				split : true,
				width : 190
			});

	var win = Ext.create('Ext.Window', {
				autoScroll : true,
				width : 1200 * bokedee_width,
				height : 600 * bokedee_height,
				layout : {
					type : 'table',
					columns : 1
				},
				draggable : false,

				defaults : {
					frame : true,
					width : 1170,
					height : 150
				},
				modal : true,
				items : [{
							title : 'Payload_Content',
							items : [{
										xtype : 'textarea',
										value : data.Payload_Content,
										width : 1160,
										height : 380
									}],
							width : 1170,
							height : 415
						}, {
							xtype : 'gridpanel',
							title : 'Inbound_Property',
							border : 1,
							height : 200,
							autoHeight : true,
							autoScroll : true,
							sortableColumns : false,
							plugins : Ext.create('Ext.grid.plugin.CellEditing',
									{
										clicksToEdit : 1,
										listeners : {
											beforeedit : function(record) {
												serviceUpdateIndex = record.rowIdx;
											}
										}
									}),
							columns : [{
										header : '键',
										dataIndex : 'key',
										width : 400,
										field : 'textfield'
									}, {
										header : '值',
										dataIndex : 'value',
										width : 760,
										field : 'textarea'
									}],
							store : Ext.create('Ext.data.Store', {
										fields : ['key', 'value'],
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
							plugins : Ext.create('Ext.grid.plugin.CellEditing',
									{
										clicksToEdit : 1,
										listeners : {
											beforeedit : function(record) {
												serviceUpdateIndex = record.rowIdx;
											}
										}
									}),
							autoScroll : true,
							columns : [{
										header : '键',
										dataIndex : 'key',
										width : 400,
										field : 'textfield'
									}, {
										header : '值',
										dataIndex : 'value',
										width : 760,
										field : 'textarea'
									}],
							store : Ext.create('Ext.data.Store', {
										autoLoad : true,
										fields : ['key', 'value'],
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
							plugins : Ext.create('Ext.grid.plugin.CellEditing',
									{
										clicksToEdit : 1,
										listeners : {
											beforeedit : function(record) {
												serviceUpdateIndex = record.rowIdx;
											}
										}
									}),
							autoScroll : true,
							columns : [{
										header : '键',
										dataIndex : 'key',
										width : 400,
										field : 'textfield'
									}, {
										header : '值',
										dataIndex : 'value',
										width : 760,
										field : 'textarea'
									}],
							store : Ext.create('Ext.data.Store', {
										autoLoad : true,
										fields : ['key', 'value'],
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
							plugins : Ext.create('Ext.grid.plugin.CellEditing',
									{
										clicksToEdit : 1,
										listeners : {
											beforeedit : function(record) {
												serviceUpdateIndex = record.rowIdx;
											}
										}
									}),
							autoScroll : true,
							columns : [{
										header : '键',
										dataIndex : 'key',
										width : 400,
										field : 'textfield'
									}, {
										header : '值',
										dataIndex : 'value',
										width : 760,
										field : 'textarea'
									}],
							store : Ext.create('Ext.data.Store', {
										autoLoad : true,
										fields : ['key', 'value'],
										data : Outbound_Property_data,
										proxy : {
											type : 'memory',
											reader : {
												type : 'json',
												root : 'root'
											}
										}
									})
						}],
				buttons : win_buttons
			});
	win.show();
}

/**
 * 同步数据确认窗口
 * 
 * @param {Object}
 *            record
 * @return {TypeName}
 */
function windowSyn(data, url, operatorType, actionType, findSendInfoUrl) {
	var win_buttons = [{
				text : '确认同步',
				handler : function() {
					Ext.Ajax.request({
								url : findSendInfoUrl,
								timeout : 180000,
								params : {
									text : Ext.encode(data),
									url : url,
									operatorType : operatorType,
									actionType1 : actionType
								},
								success : function(response) {
									win.close();
									alert(response.responseText);
								},
								failure : function(response) {
									Ext.Msg.alert('同步数据失败',
											response.responseText);
								}
							});
				}
			}, {
				text : '取消同步',
				handler : function() {
					win.close();
				}
			}];

	var synGrid_store = Ext.create('Ext.data.Store', {
				model : 'Synchggpz',
				data : data
			})

	var columns = [{
				header : '配置名称',
				dataIndex : 'text',
				flex : 3
			}, {
				header : '配置描述',
				dataIndex : 'description',
				flex : 10
			}]
	if (data[0].text == '') {
		columns = [{
					header : '配置名称',
					dataIndex : 'key',
					flex : 3
				}, {
					header : '配置描述',
					dataIndex : 'description',
					flex : 10
				}]
	}
	if (actionType == 'synchTimingTask') {
		columns = [{
					header : '配置名称',
					dataIndex : 'taskname',
					flex : 3
				}, {
					header : '配置描述',
					dataIndex : 'desc',
					flex : 10
				}]
	} else if (actionType == 'synchDownloadSource') {
		columns = [{
					header : '配置名称',
					dataIndex : 'FileType',
					flex : 3
				}, {
					header : '配置描述',
					dataIndex : 'FileDescription',
					flex : 10
				}]
	} else if (actionType == 'synchSdInterfaces') {
		columns = [{
					header : '配置名称',
					dataIndex : 'text',
					flex : 3
				}, {
					header : '配置描述',
					dataIndex : 'description',
					flex : 10
				}]
	}
	var synGrid = Ext.create('Ext.grid.Panel', {
				height : 280 * bokedee_height,
				loadMask : true,
				sortableColumns : false,
				title : '同步源',
				columns : columns,
				store : synGrid_store
			});

	var win = Ext.create('Ext.Window', {
				title : '同步数据确认窗口',
				width : 600 * bokedee_width,
				height : 450 * bokedee_height,
				draggable : false,

				modal : true,
				items : [synGrid, {
							fieldLabel : '同名时覆盖',
							xtype : 'textfield',
							width : 590 * bokedee_width,
							value : operatorType == 'ignore' ? '否' : '是',
							readOnly : true
						}, {
							fieldLabel : '同步地址',
							xtype : 'textfield',
							value : url,
							width : 590 * bokedee_width,
							readOnly : true
						}],
				buttons : win_buttons
			});
	win.show();
}
