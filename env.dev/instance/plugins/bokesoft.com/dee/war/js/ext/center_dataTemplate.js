/**
 * 自定义数据模版
 * 
 * @return {TypeName}
 */
function center_customTemplate() {
	var title = changeColorToRed('配置模版 >> 自定义模版');
	var p_tbar_items = [{
		text : '新增',
		scale : 'small',
		hidden : isHiddenFromPermission('dataTemplate_config',
				'customTemplate', 'add'),
		icon : 'images/add.png',
		width : 50,
		handler : function() {
			addTemplateNameAndDesc();
		}
	}, {
		text : '修改',
		scale : 'small',
		hidden : isHiddenFromPermission('dataTemplate_config',
				'customTemplate', 'update'),
		icon : 'images/xiugai.png',
		width : 50,
		handler : function() {
			if (templateList.record) {
				windowShowTemplateDetail(templateList.record);
			}
		}
	}, {
		text : '删除',
		scale : 'small',
		hidden : isHiddenFromPermission('dataTemplate_config',
				'customTemplate', 'del'),
		icon : 'images/shanchu.png',
		width : 50,
		handler : function() {
			if (templateList.record) {
				deleteTemplateListRecord(templateList.record.data['id'],
						templateList.index);
			}
		}
	}];
	var templateList_storeURL = 'interfaceProcessDataTemplateController.do?actionType=findTemplateList';
	var templateList_store = Ext.create('Ext.data.Store', {
				model : 'dataTemplateConfig',
				proxy : {
					type : 'ajax',
					url : templateList_storeURL
				},
				autoLoad : true,
				listeners : {
					load : function(me) {

					}
				}
			});

	var templateList_CheckboxModel = Ext.create('Ext.selection.CheckboxModel',
			{
				mode : 'SINGLE',
				listeners : {
					select : function(m, record, index) {
						templateList.record = record;
						templateList.index = index;
					}
				}
			});

	var templateList = Ext.create('Ext.grid.Panel', {
				autoScroll : true,
				title : title,
				border : 0,
				width : '100%',
				height : '100%',
				tbar : p_tbar_items,
				id : 'templateList',
				selModel : templateList_CheckboxModel,
				flex : 9,
				columns : [{
							xtype : 'rownumberer',
							width : 30,
							menuDisabled : true,
							sortable : false
						}, {
							header : '名称',
							dataIndex : 'name',
							sortable : false,
							menuDisabled : true,
							flex : 1
						}, {
							header : '描述',
							dataIndex : 'description',
							sortable : false,
							menuDisabled : true,
							flex : 2
						}],
				store : templateList_store,
				listeners : {
					itemdblclick : function(view, record, item, index, event) {
						windowShowTemplateDetail(record);
					}
				}
			});

	return templateList;
}
/**
 * 新增模版的名称和描述 新增之后不可修改
 */
function addTemplateNameAndDesc() {
	var win_buttons = [{
		text : '确定',
		handler : function() {
			var name = win_form.getValues().name;
			var description = win_form.getValues().description;
			var template = win_form.getValues().standardTemplate;
			if (name == '' || name.indexOf(' ') > -1) {
				Ext.Msg.alert('提示', '模版名称是必填项，不能包含空格！');
				return;
			}
			var temp = {
				name : name,
				description : description,
				data : ''
			};
			Ext.Ajax.request({
				url : 'interfaceProcessDataTemplateController.do?actionType=addOrUpdateOneTemplate',
				params : {
					value : Ext.encode(temp)
				},
				success : function(response) {
					if (32 == response.responseText.length) {
						temp.id = response.responseText;
					} else {
						Ext.Msg.alert('提示', '新增失败！');
						return;
					}
					win.close();
					getCmp('templateList').store.load();
					var detRecord = {// 为了和record的数据格式统一
						data : temp
					}
					windowShowTemplateDetail(detRecord, template);
				},
				failure : function(response) {
					Ext.Msg.alert('提示', '新增失败:' + response.responseText);
					return;
				}
			});
		}
	}, {
		text : '取消',
		handler : function() {
			win.close();
		}
	}];
	var win_form = Ext.create('Ext.form.Panel', {
		width : '100%',
		height : 400,
		bodyPadding : 5,
		margins : '20 0 0 5',
		border : 0,
		method : 'post',
		layout : 'anchor',
		defaults : {
			anchor : '100%'
		},
		defaultType : 'textfield',
		items : [{
					fieldLabel : '模版名称',
					name : 'name',
					allowBlank : false
				}, {
					xtype : 'textarea',
					fieldLabel : '模版描述',
					name : 'description'
				}, {
					xtype : 'combo',
					fieldLabel : '引用标准模版',
					name : 'standardTemplate',
					editable : false,
					store : Ext.create('Ext.data.Store', {
						model : 'dataTemplateConfig',
						proxy : {
							type : 'ajax',
							url : 'interfaceProcessDataTemplateController.do?actionType=findStandardTemplateList',
							reader : {
								type : 'json'
							}
						},
						autoLoad : true
					}),
					displayField : 'name',
					valueField : 'data',
					queryMode : 'local',
					emptyText : '请选择'
				}]
	});
	var win = Ext.create('Ext.Window', {
				title : '新增模版名称和描述',
				width : 500 * bokedee_width,
				height : 310 * bokedee_height,
				layout : 'absolute',
				draggable : false,
				bodyStyle : 'background:#ffffff;',
				resizable : false,
				modal : true,
				buttons : win_buttons,
				items : [win_form]
			});
	win.show();
}
/**
 * 新增界面
 * 
 * @param {Object}
 *            record 模版信息
 * @param {Object}
 *            hasInbound 是否已有inbound
 */
function windowAddDataTemplate(record, hasInbound) {
	var win_buttons = [{
		text : '确定',
		handler : function() {
			addProcessToTemplete('tabpanel_inbound', 'inbound');
			addProcessToTemplete('tabpanel_transformer_au', 'transformer_au');
			addProcessToTemplete('tabpanel_transformer_unau',
					'transformer_unau');
			addProcessToTemplete('tabpanel_GGPZTransformer', 'GGPZTransformer');
			addProcessToTemplete('tabpanel_outbound', 'outbound');
			win.close();
		}
	}, {
		text : '取消',
		handler : function() {
			win.close();
		}
	}];
	/**
	 * 在这里把五个store用缓存数据
	 * 
	 * @param {Object}
	 *            id
	 * @param {Object}
	 *            index Ext.data.StoreManager.containsKey('')
	 */
	var tabpanelList_storeURL = 'interfaceInfoFindController.do?actionType=findSmallTypeCombobox&bigType=';
	var tabpanel_inbound_store;
	if (Ext.data.StoreManager.containsKey('tabpanel_inbound_store')) {
		tabpanel_inbound_store = Ext.data.StoreManager
				.get('tabpanel_inbound_store');
	} else {
		tabpanel_inbound_store = Ext.create('Ext.data.Store', {
					model : 'dataTemplate',
					storeId : 'tabpanel_inbound_store',
					proxy : {
						type : 'ajax',
						url : tabpanelList_storeURL + 'inbound',
						reader : {
							type : 'json',
							root : 'root'
						}
					},
					autoLoad : true
				});
	}
	var tabpanel_outbound_store;
	if (Ext.data.StoreManager.containsKey('tabpanel_outbound_store')) {
		tabpanel_outbound_store = Ext.data.StoreManager
				.get('tabpanel_outbound_store');
	} else {
		tabpanel_outbound_store = Ext.create('Ext.data.Store', {
					model : 'dataTemplate',
					storeId : 'tabpanel_outbound_store',
					proxy : {
						type : 'ajax',
						url : tabpanelList_storeURL + 'outbound',
						reader : {
							type : 'json',
							root : 'root'
						}
					},
					autoLoad : true
				});
	}
	var tabpanel_transformer_au_store;
	if (Ext.data.StoreManager.containsKey('tabpanel_transformer_au_store')) {
		tabpanel_transformer_au_store = Ext.data.StoreManager
				.get('tabpanel_transformer_au_store');
	} else {
		tabpanel_transformer_au_store = Ext.create('Ext.data.Store', {
					model : 'dataTemplate',
					storeId : 'tabpanel_transformer_au_store',
					proxy : {
						type : 'ajax',
						url : tabpanelList_storeURL + 'transformer_au',
						reader : {
							type : 'json',
							root : 'root'
						}
					},
					autoLoad : true
				});
	}
	var tabpanel_transformer_unau_store;
	if (Ext.data.StoreManager.containsKey('tabpanel_transformer_unau_store')) {
		tabpanel_transformer_unau_store = Ext.data.StoreManager
				.get('tabpanel_transformer_unau_store');
	} else {
		tabpanel_transformer_unau_store = Ext.create('Ext.data.Store', {
					model : 'dataTemplate',
					storeId : 'tabpanel_transformer_unau_store',
					proxy : {
						type : 'ajax',
						url : tabpanelList_storeURL + 'transformer_unau',
						reader : {
							type : 'json',
							root : 'root'
						}
					},
					autoLoad : true
				});
	}
	var tabpanel_GGPZTransformer_store;
	if (Ext.data.StoreManager.containsKey('tabpanel_GGPZTransformer_store')) {
		tabpanel_GGPZTransformer_store = Ext.data.StoreManager
				.get('tabpanel_GGPZTransformer_store');
	} else {
		tabpanel_GGPZTransformer_store = Ext.create('Ext.data.Store', {
					storeId : 'tabpanel_GGPZTransformer_store',
					model : 'dataTemplate',
					proxy : {
						type : 'ajax',
						url : tabpanelList_storeURL + 'GGPZTransformer',
						reader : {
							type : 'json',
							root : 'root'
						}
					},
					autoLoad : true
				});
	}
	var win_form_grid_pluginCellEdit2 = Ext.create(
			'Ext.grid.plugin.CellEditing', {
				clicksToEdit : 1
			});
	var win_form_grid_pluginCellEdit3 = Ext.create(
			'Ext.grid.plugin.CellEditing', {
				clicksToEdit : 1
			});
	var win_form_grid_pluginCellEdit4 = Ext.create(
			'Ext.grid.plugin.CellEditing', {
				clicksToEdit : 1
			});
	var win_form_grid_pluginCellEdit5 = Ext.create(
			'Ext.grid.plugin.CellEditing', {
				clicksToEdit : 1
			});
	var tabpanel_inbound = Ext.create('Ext.grid.Panel', {
				title : 'inbound',
				autoScroll : true,
				disabled : hasInbound,
				id : 'tabpanel_inbound',
				store : tabpanel_inbound_store,
				width : '100%',
				selModel : Ext.create('Ext.selection.CheckboxModel', {
							mode : 'SINGLE'
						}),
				columns : [{
							xtype : 'rownumberer',
							width : 30,
							sortable : false
						}, {
							header : '名称',
							dataIndex : 'displayField',
							sortable : false,
							menuDisabled : true,
							flex : 78
						}, {
							dataIndex : 'value',
							sortable : false,
							menuDisabled : true,
							hidden : true
						}],
				height : 310
			});
	var tabpanel_outbound = Ext.create('Ext.grid.Panel', {
				title : 'outbound',
				autoScroll : true,
				id : 'tabpanel_outbound',
				store : tabpanel_outbound_store,
				width : '100%',
				selModel : Ext.create('Ext.selection.CheckboxModel', {
							mode : 'MULTI',
							checkOnly : true
						}),
				columns : [{
							xtype : 'rownumberer',
							width : 30,
							sortable : false
						}, {
							header : '名称',
							dataIndex : 'displayField',
							sortable : false,
							menuDisabled : true,
							flex : 78
						}, {
							dataIndex : 'value',
							hidden : true
						}, {
							header : '个数',
							dataIndex : 'quantity',
							sortable : false,
							menuDisabled : true,
							flex : 78,
							field : {
								xtype : 'numberfield',
								minValue : 1
							}
						}],
				plugins : [win_form_grid_pluginCellEdit2],
				height : 310
			});
	var tabpanel_transformer_au = Ext.create('Ext.grid.Panel', {
				title : 'Transformer常用',
				autoScroll : true,
				id : 'tabpanel_transformer_au',
				store : tabpanel_transformer_au_store,
				width : '100%',
				selModel : Ext.create('Ext.selection.CheckboxModel', {
							mode : 'MULTI',
							checkOnly : true
						}),
				columns : [{
							xtype : 'rownumberer',
							width : 30,
							sortable : false
						}, {
							header : '名称',
							sortable : false,
							menuDisabled : true,
							dataIndex : 'displayField',
							flex : 78
						}, {
							dataIndex : 'value',
							hidden : true
						}, {
							header : '个数',
							dataIndex : 'quantity',
							sortable : false,
							menuDisabled : true,
							flex : 78,
							field : {
								xtype : 'numberfield',
								minValue : 1
							}
						}],
				plugins : [win_form_grid_pluginCellEdit3],
				height : 310
			});
	var tabpanel_transformer_unau = Ext.create('Ext.grid.Panel', {
				title : 'Transformer不常用',
				autoScroll : true,
				id : 'tabpanel_transformer_unau',
				store : tabpanel_transformer_unau_store,
				width : '100%',
				selModel : Ext.create('Ext.selection.CheckboxModel', {
							mode : 'MULTI',
							checkOnly : true
						}),
				columns : [{
							xtype : 'rownumberer',
							width : 30,
							sortable : false
						}, {
							header : '名称',
							dataIndex : 'displayField',
							sortable : false,
							menuDisabled : true,
							flex : 78
						}, {
							dataIndex : 'value',
							hidden : true
						}, {
							header : '个数',
							dataIndex : 'quantity',
							flex : 78,
							sortable : false,
							menuDisabled : true,
							field : {
								xtype : 'numberfield',
								minValue : 1
							}
						}],
				plugins : [win_form_grid_pluginCellEdit4],
				height : 310
			});
	var tabpanel_GGPZTransformer = Ext.create('Ext.grid.Panel', {
				title : '公共Transformer',
				autoScroll : true,
				id : 'tabpanel_GGPZTransformer',
				store : tabpanel_GGPZTransformer_store,
				width : '100%',
				selModel : Ext.create('Ext.selection.CheckboxModel', {
							mode : 'MULTI',
							checkOnly : true
						}),
				columns : [{
							xtype : 'rownumberer',
							width : 30,
							sortable : false
						}, {
							header : '名称',
							dataIndex : 'displayField',
							sortable : false,
							menuDisabled : true,
							flex : 78
						}, {
							dataIndex : 'value',
							hidden : true
						}, {
							header : '个数',
							dataIndex : 'quantity',
							sortable : false,
							menuDisabled : true,
							flex : 78,
							field : {
								xtype : 'numberfield',
								minValue : 1
							}
						}],
				plugins : [win_form_grid_pluginCellEdit5],
				height : 310
			});
	var win_form = Ext.create('Ext.form.Panel', {
				width : '100%',
				bodyPadding : 5,
				margins : '20 0 0 5',
				border : 0,
				method : 'post',
				layout : 'anchor',
				defaults : {
					anchor : '100%'
				},
				defaultType : 'textfield',
				items : [{
					xtype : 'tabpanel',
					activeTab : tabpanel_transformer_au,
					items : [tabpanel_transformer_au, tabpanel_GGPZTransformer,
							tabpanel_inbound, tabpanel_outbound,
							tabpanel_transformer_unau]
				}, {
					name : 'id',
					hidden : true
				}]
			});

	var win = Ext.create('Ext.Window', {
				title : '新增自定义模版明细',
				width : 700 * bokedee_width,
				height : 400 * bokedee_height,
				layout : 'absolute',
				draggable : false,
				bodyStyle : 'background:#ffffff;',
				resizable : false,
				modal : true,
				buttons : win_buttons,
				items : [win_form]
			});
	win.show();
}
/**
 * 删除模版
 * 
 * @param {Object}
 *            id
 * @param {Object}
 *            index
 */
function deleteTemplateListRecord(id, index) {
	Ext.Msg.show({
				title : '删除',
				msg : '你确定要删除?',
				buttons : Ext.Msg.YESNO,
				fn : function(type) {
					if ('yes' == type) {
						Ext.Ajax.request({
									url : 'interfaceProcessDataTemplateController.do',
									params : {
										actionType : 'deleteTemplateListRecord',
										id : id
									},
									success : function(response) {
										if ('success' == response.responseText) {
											getCmp('templateList').store
													.removeAt(index);
										} else {
											Ext.Msg.alert('提示', '删除失败');
										}
									},
									failure : function() {
										Ext.Msg.alert('提示', '删除失败');
									}
								});
					}
				}
			});
}
/**
 * 查看模版内容，可以新增和删除流程 排序
 * 
 * @param {Object}
 *            record template 模版的内容
 */
function windowShowTemplateDetail(record, template) {
	var storeData;
	if (record.data.data == '') {
		if (template != null) {// 如果新增时 选择了标准模版
			storeData = Ext.decode(template)
		} else {
			storeData = []
		}
	} else {
		storeData = Ext.decode(record.data.data)
	}

	var tbar = [{
		text : '新增',
		scale : 'small',
		hidden : isHiddenFromPermission('interface_config',
				'findInterfaceStore', 'saveProcessor'),
		icon : 'images/add.png',
		width : 50,
		handler : function() {
			// 判读第一个是不是Inbound类型
			if (getCmp('templateDetailPanel').store.data.length > 0
					&& getCmp('templateDetailPanel').store.getAt(0).data.bigType == 'inbound') {
				windowAddDataTemplate(record, true);
			} else {
				windowAddDataTemplate(record, false);
			}
		}
	}, {
		text : '删除',
		scale : 'small',
		hidden : isHiddenFromPermission('interface_config',
				'findInterfaceStore', 'delProcessor'),
		icon : 'images/shanchu.png',
		width : 50,
		handler : function() {
			if (templateDetailPanel.record != null) {
				getCmp('templateDetailPanel').store
						.removeAt(templateDetailPanel.index);
			}
		}
	}, {
		text : '上移',
		scale : 'small',
		hidden : isHiddenFromPermission('interface_config',
				'findInterfaceStore', 'upTransformerItem'),
		icon : 'images/shangyi.png',
		width : 50,
		handler : function() {
			if (templateDetailPanel.record != null
					&& templateDetailPanel.index > 0) {
				if (getCmp('templateDetailPanel').store
						.getAt(templateDetailPanel.index - 1).data.bigType == 'inbound') {
					Ext.Msg.alert('提示', 'inbound只能在第一位');
				} else {
					var store = getCmp('templateDetailPanel').store;
					store.removeAt(templateDetailPanel.index);
					store.insert(templateDetailPanel.index - 1,
							templateDetailPanel.record);
					templateDetailPanel.getSelectionModel()
							.select(templateDetailPanel.index - 1);
				}
			}
		}
	}, {
		text : '下移',
		scale : 'small',
		hidden : isHiddenFromPermission('interface_config',
				'findInterfaceStore', 'downTransformerItem'),
		icon : 'images/xiayi.png',
		width : 50,
		handler : function() {
			if (templateDetailPanel.record != null
					&& templateDetailPanel.index < getCmp('templateDetailPanel').store.data.length
							- 1) {
				if (getCmp('templateDetailPanel').store
						.getAt(templateDetailPanel.index).data.bigType == 'inbound') {
					Ext.Msg.alert('提示', 'inbound只能在第一位');
				} else {
					var store = getCmp('templateDetailPanel').store;
					store.removeAt(templateDetailPanel.index);
					store.insert(templateDetailPanel.index + 1,
							templateDetailPanel.record);
					templateDetailPanel.getSelectionModel()
							.select(templateDetailPanel.index + 1);
				}
			}
		}
	}];
	var win_buttons = [{
		text : '确定',
		handler : function() {
			var form_name = win_form.getValues().name;
			var form_description = win_form.getValues().description;
			if (form_name.length == 0) {
				Ext.Msg.alert('提示', '自定义模版名称不能为空！！！');
				return;
			}
			if (form_description.length == 0) {
				Ext.Msg.alert('提示', '自定义模版描述不能为空！！！');
				return;
			}
			var temp = {
				id : record.data.id,
				name : form_name,
				description : form_description,
				data : storeToJSON(getCmp('templateDetailPanel').store)
			};
			Ext.Ajax.request({
				url : 'interfaceProcessDataTemplateController.do?actionType=addOrUpdateOneTemplate',
				params : {
					value : Ext.encode(temp)
				},
				success : function(response) {
					if (32 == response.responseText.length) {
						Ext.Msg.alert('提示', '操作成功！');
						win.close();
						getCmp('templateList').store.load();
						return;
					} else {
						Ext.Msg.alert('提示', '操作失败！');
						return;
					}
				},
				failure : function(response) {
					Ext.Msg.alert('提示', '操作失败:' + response.responseText);
					win.close();
					return;
				}
			});
		}
	}, {
		text : '取消',
		handler : function() {
			win.close();
		}
	}];
	var templateDetailPanel_CheckboxModel = Ext.create(
			'Ext.selection.CheckboxModel', {
				mode : 'SINGLE',
				listeners : {
					select : function(m, record, index) {
						templateDetailPanel.record = record;
						templateDetailPanel.index = index;
					}
				}
			});
	var templateDetail_store = Ext.create('Ext.data.Store', {
				model : 'TemplateMessageProcessor',
				data : storeData,
				autoLoad : true
			});
	var win_form_grid_pluginCellEdit = Ext.create(
			'Ext.grid.plugin.CellEditing', {
				clicksToEdit : 1
			});
	var templateDetailPanel = Ext.create('Ext.grid.Panel', {
				id : 'templateDetailPanel',
				border : 1,
				height : 345,
				width : '100%',
				viewConfig : {
					loadMask : false
				},
				sortableColumns : false,
				selModel : templateDetailPanel_CheckboxModel,
				tbar : tbar,
				columns : [{
							xtype : 'rownumberer',
							width : 30,
							sortable : false
						}, {
							header : '名称',
							dataIndex : 'text',
							flex : 2,
							field : {
								xtype : 'textfield'
							}
						}, {
							header : '类型',
							dataIndex : 'smallType',
							flex : 1
						}, {
							header : '类别',
							dataIndex : 'bigType',
							flex : 1
						}],
				store : templateDetail_store,
				plugins : [win_form_grid_pluginCellEdit],
				listeners : {
					itemclick : function(grid, rowIndex) {
					},
					itemdblclick : function(view, record, item, index, event) {

					}
				}
			});
	var win_form = Ext.create('Ext.form.Panel', {
				xtype : 'form',
				width : '100%',
				height : '100%',
				bodyPadding : 5,
				autoScroll : true,
				margins : '20 0 0 5',
				border : 1,
				layout : 'anchor',
				defaults : {
					anchor : '100%'
				},
				defaultType : 'textfield',
				items : [{
							fieldLabel : '名称',
							allowBlank : false,
							value : record.data.name,
							name : 'name'
						}, {
							xtype : 'textarea',
							fieldLabel : '描述',
							name : 'description',
							value : record.data.description,
							allowBlank : true,
							height : 45
						}, templateDetailPanel]
			});
	var win = Ext.create('Ext.Window', {
				title : '自定义模版明细',
				width : 800 * bokedee_width,
				height : 500 * bokedee_height,
				layout : 'absolute',
				draggable : false,
				bodyStyle : 'background:#ffffff;',
				resizable : false,
				modal : true,
				buttons : win_buttons,
				items : [win_form]
			});
	win.show();
}
/**
 * 向模版中加入流程
 */
function addProcessToTemplete(gridName, bigType) {
	var oneData;
	var obj = {};
	if (getCmp(gridName).selModel.selected.length > 0) {
		var length = getCmp(gridName).selModel.selected.length;
		for (var i = 0; i < length; i++) {
			oneData = getCmp(gridName).selModel.getSelection()[i].data;
			obj.smallType = oneData.value;
			obj.bigType = bigType;
			obj.id = '';
			if (oneData.quantity != '' && oneData.quantity > 0) {
				for (var x = 1; x <= oneData.quantity; x++) {
					obj.text = oneData.displayField + x;
					getCmp('templateDetailPanel').store.add(obj);
				}
			} else {
				obj.text = oneData.displayField;
				if ('tabpanel_inbound' == gridName) {// 如果是inboun 加到第一位
					getCmp('templateDetailPanel').store.insert(0, obj);
				} else {
					getCmp('templateDetailPanel').store.add(obj);
				}
			}
		}
	}
}
/**
 * 标准模版数据
 * 
 * @return {TypeName}
 */
function center_standardTemplate() {
	var title = changeColorToRed('配置模版 >>标准模版');
	var p_tbar_items = [{
		text : '查看',
		scale : 'small',
		hidden : isHiddenFromPermission('dataTemplate_config',
				'standardTemplate', 'look'),
		icon : 'images/chakan.png',
		width : 50,
		handler : function() {
			if (standardTemplateList.record != null) {
				windowShowStandardTemplateDetail(standardTemplateList.record);
			}
		}
	}];
	var standardTemplateList_store;
	if (Ext.data.StoreManager.containsKey('standardTemplateList_store')) {
		standardTemplateList_store = Ext.data.StoreManager
				.get('standardTemplateList_store');
	} else {
		var standardTemplateList_storeURL = 'interfaceProcessDataTemplateController.do?actionType=findStandardTemplateList';
		standardTemplateList_store = Ext.create('Ext.data.Store', {
					storeId : 'standardTemplateList_store',
					model : 'dataTemplateConfig',
					proxy : {
						type : 'ajax',
						url : standardTemplateList_storeURL
					},
					autoLoad : true
				});
	}

	var standardTemplateList_CheckboxModel = Ext.create(
			'Ext.selection.CheckboxModel', {
				mode : 'SINGLE',
				listeners : {
					select : function(m, record, index) {
						standardTemplateList.record = record;
					}
				}
			});

	var standardTemplateList = Ext.create('Ext.grid.Panel', {
				autoScroll : true,
				title : title,
				border : 0,
				width : '100%',
				height : '100%',
				tbar : p_tbar_items,
				id : 'templateList',
				selModel : standardTemplateList_CheckboxModel,
				columns : [{
							xtype : 'rownumberer',
							width : 30,
							sortable : false
						}, {
							header : '名称',
							dataIndex : 'name',
							sortable : false,
							menuDisabled : true,
							flex : 1
						}, {
							header : '描述',
							dataIndex : 'description',
							sortable : false,
							menuDisabled : true,
							flex : 2
						}],
				store : standardTemplateList_store,
				listeners : {
					itemdblclick : function(view, record, item, index, event) {
						windowShowStandardTemplateDetail(record);
					}
				}
			});

	return standardTemplateList;
}
/**
 * 查看标准模版内容
 * 
 * @param {Object}
 *            record
 */
function windowShowStandardTemplateDetail(record) {
	var win_buttons = [{
				text : '关闭',
				handler : function() {
					win.close();
				}
			}];
	var standardTemplateDetail_store = Ext.create('Ext.data.Store', {
				model : 'TemplateMessageProcessor',
				data : Ext.decode(record.data.data),
				autoLoad : true
			});
	var standardTemplateDetailPanel = Ext.create('Ext.grid.Panel', {
				id : 'standardTemplateDetailPanel',
				title : '模版：' + record.data.name,
				border : 0,
				height : '100%',
				width : '100%',
				viewConfig : {
					loadMask : false
				},
				sortableColumns : false,
				columns : [{
							xtype : 'rownumberer',
							width : 30,
							sortable : false
						}, {
							header : '名称',
							dataIndex : 'text',
							sortable : false,
							menuDisabled : true,
							flex : 2
						}, {
							header : '类型',
							dataIndex : 'smallType',
							sortable : false,
							menuDisabled : true,
							flex : 1
						}, {
							header : '类别',
							dataIndex : 'bigType',
							sortable : false,
							menuDisabled : true,
							flex : 1
						}],
				store : standardTemplateDetail_store
			});
	var win = Ext.create('Ext.Window', {
				title : '标准模版明细',
				width : 800 * bokedee_width,
				height : 500 * bokedee_height,
				layout : 'absolute',
				draggable : false,
				bodyStyle : 'background:#ffffff;',
				resizable : false,
				modal : true,
				buttons : win_buttons,
				items : [standardTemplateDetailPanel]
			});
	win.show();
}