/**
 * 配置主表子表 字段
 */
function center_interfaceSimpleConfig() {
	var title = changeColorToRed('辅助配置 >> 接口预配置');
	var interfaceComboboxURL = 'interfaceSimpleConfigController.do?actionType=getAllSdInterfaces';
	var store = Ext.create('Ext.data.Store', {
				model : 'YigoConfig',
				proxy : {
					type : 'ajax',
					url : interfaceComboboxURL,
					reader : {
						type : 'json',
						root : 'data'
					}
				},
				autoLoad : true
			});
	var p_tbar_items = [{
		text : '新增',
		scale : 'small',
		hidden : isHiddenFromPermission('dataTemplate_config', 'YigoConfig',
				'add'),
		icon : 'images/add.png',
		width : 50,
		handler : function() {
			addOrUpdateSdInterface();
		}
	}, {
		text : '修改',
		scale : 'small',
		hidden : isHiddenFromPermission('dataTemplate_config', 'YigoConfig',
				'update'),
		icon : 'images/xiugai.png',
		handler : function() {
			if (SimpleConfiggridPanel.selModel.getSelection() != '') {
				bodyLoadingMask.show();
				var configType = SimpleConfiggridPanel.record.data.type
				Ext.Ajax.request({
					url : 'interfaceSimpleConfigController.do?actionType=getDetailSdInterfaceByIdAndType',
					params : {
						id : SimpleConfiggridPanel.record.data.id,
						type : configType
					},
					success : function(response) {
						bodyLoadingMask.hide();
						var result = Ext.decode(response.responseText);
						if (result.result) {
							if (configType == 'xml2yigo') {
								xmlToYigoWin(
										SimpleConfiggridPanel.record.data.text,
										SimpleConfiggridPanel.record.data.description,
										result.data,
										SimpleConfiggridPanel.record.data.id,
										configType);
							}else if (configType == 'customedxml2yigo') {
								customedxmlToYigo2Win(
										SimpleConfiggridPanel.record.data.text,
										SimpleConfiggridPanel.record.data.description,
										result.data,
										SimpleConfiggridPanel.record.data.id,
										configType);
							}else if (configType == 'table2yigo') {
								dstableToYigoWin(
										SimpleConfiggridPanel.record.data.text,
										SimpleConfiggridPanel.record.data.description,
										result.data,
										SimpleConfiggridPanel.record.data.id,
										configType);
							} else if (configType == 'excel2yigo') {
								excelToYigoWin(
										SimpleConfiggridPanel.record.data.text,
										SimpleConfiggridPanel.record.data.description,
										result.data,
										SimpleConfiggridPanel.record.data.id,
										configType);
							} else if (configType == 'yigo2xml') {
								yigoToXmlWin(
										SimpleConfiggridPanel.record.data.text,
										SimpleConfiggridPanel.record.data.description,
										result.data,
										SimpleConfiggridPanel.record.data.id,
										configType);
							} else if (configType == 'yigo2excel') {
								yigoToExcelWin(
										SimpleConfiggridPanel.record.data.text,
										SimpleConfiggridPanel.record.data.description,
										result.data,
										SimpleConfiggridPanel.record.data.id,
										configType);
							} else if (configType == 'sql2excel') {
								sqlToExcelWin(
										SimpleConfiggridPanel.record.data.text,
										SimpleConfiggridPanel.record.data.description,
										result.data,
										SimpleConfiggridPanel.record.data.id,
										configType);
							}else if (configType == 'yigo2table') {
								yigo2TableWin(
										SimpleConfiggridPanel.record.data.text,
										SimpleConfiggridPanel.record.data.description,
										result.data,
										SimpleConfiggridPanel.record.data.id,
										configType);
							}
						} else {
							Ext.Msg.alert('失败', result.data);
						}
					},
					failure : function(response) {
						bodyLoadingMask.hide();
						var result = Ext.decode(response.responseText);
						Ext.Msg.alert('失败', result.data);
					}

				});
			}
		}
	}, {
		text : '删除',
		scale : 'small',
		icon : 'images/shanchu.png',
		hidden : isHiddenFromPermission('dataTemplate_config', 'YigoConfig',
				'del'),
		width : 50,
		handler : function() {
			if (SimpleConfiggridPanel.selModel.getSelection() != '') {
				Ext.Msg.show({
					title : '提示',
					msg : '确定要删除吗？',
					buttons : Ext.Msg.YESNO,
					fn : function(type) {
						if ('yes' == type) {
							bodyLoadingMask.show();
							Ext.Ajax.request({
								url : 'interfaceSimpleConfigController.do?actionType=delOneSdInterface',
								params : {
									id : SimpleConfiggridPanel.record.data.id,
									type : SimpleConfiggridPanel.record.data.type
								},
								success : function(response) {
									bodyLoadingMask.hide();
									Ext.getCmp('SimpleConfiggridPanel').store
											.load();
									var result = Ext
											.decode(response.responseText);
									if (result.result) {
										Ext.getCmp('SimpleConfiggridPanel').store
												.removeAt(SimpleConfiggridPanel.index);
										Ext.Msg.alert('提示', '删除成功');
									} else {
										Ext.Msg.alert('失败', result.data);
									}
								},
								failure : function(response) {
									bodyLoadingMask.hide();
									var result = Ext
											.decode(response.responseText);
									Ext.Msg.alert('失败', result.data);
								}

							});
						}
					}
				})
			}
		}
	}, {
		text : '生成到接口配置',
		scale : 'small',
		hidden : isHiddenFromPermission('dataTemplate_config', 'YigoConfig',
				'create'),
		icon : 'images/yunxingmoshi.png',
		handler : function() {
			if (SimpleConfiggridPanel.selModel.getSelection() != '') {
				var info = SimpleConfiggridPanel.record.data.interfaces;
				if (info) {// 覆盖
					Ext.Msg.show({
								title : '提示',
								msg : '已经生成到了接口配置[' + info + ']，确定要覆盖吗？',
								buttons : Ext.Msg.YESNO,
								fn : function(type) {
									if ('yes' == type) {
										createInterafaceService(
												SimpleConfiggridPanel.record,
												'');
									}
								}
							})
				} else {// 选择接口在对应接口下生成服务
					// tabletoyigo不需要选择接口
					if (SimpleConfiggridPanel.record.data.type == 'table2yigo') {
						createInterafaceService(SimpleConfiggridPanel.record,
								'');
					} else {
						chooseInterfaceWin(SimpleConfiggridPanel.record);
					}
				}
			}
		}
	}, {
		text : '清除关联的接口和服务信息',
		scale : 'small',
		icon : 'images/shanchu.png',
		hidden : isHiddenFromPermission('dataTemplate_config', 'YigoConfig',
				'delInfo'),
		handler : function() {
			if (SimpleConfiggridPanel.selModel.getSelection() != '') {
				Ext.Msg.show({
					title : '提示',
					msg : '确定清除关联的信息吗？',
					buttons : Ext.Msg.YESNO,
					fn : function(type) {
						if ('yes' == type) {
							bodyLoadingMask.show();
							Ext.Ajax.request({
								url : 'interfaceSimpleConfigController.do?actionType=delInterfaceAndServiceId',
								params : {
									id : SimpleConfiggridPanel.record.data.id
								},
								success : function(response) {
									bodyLoadingMask.hide();
									SimpleConfiggridPanel.store.load();
									var result = Ext
											.decode(response.responseText);
									if (result.result) {
										Ext.Msg.alert('提示', '清除成功');
									} else {
										Ext.Msg.alert('失败', result.data);
									}
								},
								failure : function(response) {
									bodyLoadingMask.hide();
									var result = Ext
											.decode(response.responseText);
									Ext.Msg.alert('失败', result.data);
								}

							});
						}
					}
				})
			}
		}
	}]
	var SimpleConfiggridPanel = Ext.create('Ext.grid.Panel', {
		title : title,
		id : 'SimpleConfiggridPanel',
		width : '100%',
		margins : '5 0 0 5',
		tbar : p_tbar_items,
		plugins : [{
			ptype : 'rowexpander',
			rowBodyTpl : ['<p>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp{interfaces}</p>']
		}],
		selModel : Ext.create('Ext.selection.CheckboxModel', {
					mode : 'SINGLE',
					listeners : {
						select : function(m, record, index) {
							SimpleConfiggridPanel.record = record;
							SimpleConfiggridPanel.index = index;
						}
					}
				}),
		height : '100%',
		frame : true,
		defaults : {
			split : true
		},
		border : 1,
		method : 'post',
		defaultType : 'textfield',
		columns : [{
					xtype : 'rownumberer',
					width : 30,
					text : '序号',
					sortable : false,
					menuDisabled : true,
					sortable : false
				}, {
					header : 'id',
					dataIndex : 'id',
					sortable : false,
					menuDisabled : true,
					hidden : true
				}, {
					header : '名称',
					dataIndex : 'text',
					sortable : false,
					menuDisabled : true,
					flex : 2
				}, {
					header : '描述',
					dataIndex : 'description',
					sortable : false,
					menuDisabled : true,
					flex : 4
				}, {
					header : '类型',
					dataIndex : 'type',
					sortable : false,
					renderer : function(value) {
						if (value == 'xml2yigo') {
							return 'Xml格式到Yigo系统单据'
						} else if (value == 'customedxml2yigo') {
							return 'Xml格式到Yigo系统单据(自定义格式)'
						} else if (value == 'table2yigo') {
							return '数据库表到Yigo系统单据'
						} else if (value == 'excel2yigo') {
							return 'Excel文件到Yigo系统单据'
						} else if (value == 'yigo2xml') {
							return 'Yigo系统单据到Xml格式'
						} else if (value == 'yigo2excel') {
							return 'Yigo系统单据到Excel文件'
						} else if (value == 'sql2excel') {
							return 'Sql语句到Excel文件'
						} else if (value == 'yigo2table') {
							return 'Yigo系统单据到数据库表'
						}
					},
					menuDisabled : true,
					flex : 2
				}, {
					header : '修改日期',
					sortable : false,
					menuDisabled : true,
					dataIndex : 'modifytime',
					renderer : Ext.util.Format.dateRenderer('Y-m-d H:i:s'),
					flex : 2
				}],
		store : store,
		listeners : {
			itemdblclick : function(view, record, item, index, event) {
				bodyLoadingMask.show();
				Ext.Ajax.request({
					url : 'interfaceSimpleConfigController.do?actionType=getDetailSdInterfaceByIdAndType',
					params : {
						id : record.data.id,
						type : record.data.type
					},
					success : function(response) {
						bodyLoadingMask.hide();
						var result = Ext.decode(response.responseText);
						if (result.result) {
							if (record.data.type == 'xml2yigo') {
								xmlToYigoWin(record.data.text,
										record.data.description, result.data,
										record.data.id, record.data.type,
										record.data.text);
							} else if (record.data.type == 'customedxml2yigo') {
								customedxmlToYigo2Win(record.data.text,
										record.data.description, result.data,
										record.data.id, record.data.type,
										record.data.text);
							} else if (record.data.type == 'table2yigo') {
								dstableToYigoWin(record.data.text,
										record.data.description, result.data,
										record.data.id, record.data.type,
										record.data.text);
							} else if (record.data.type == 'excel2yigo') {
								excelToYigoWin(record.data.text,
										record.data.description, result.data,
										record.data.id, record.data.type,
										record.data.text);
							} else if (record.data.type == 'yigo2xml') {
								yigoToXmlWin(record.data.text,
										record.data.description, result.data,
										record.data.id, record.data.type,
										record.data.text);
							} else if (record.data.type == 'yigo2excel') {
								yigoToExcelWin(record.data.text,
										record.data.description, result.data,
										record.data.id, record.data.type,
										record.data.text);
							} else if (record.data.type == 'sql2excel') {
								sqlToExcelWin(record.data.text,
										record.data.description, result.data,
										record.data.id, record.data.type,
										record.data.text);
							}else if (record.data.type == 'yigo2table') {
								yigo2TableWin(record.data.text,
										record.data.description, result.data,
										record.data.id, record.data.type,
										record.data.text);
							}
						} else {
							Ext.Msg.alert('失败', result.data);
						}
					},
					failure : function(response) {
						bodyLoadingMask.hide();
						var result = Ext.decode(response.responseText);
						Ext.Msg.alert('失败', result.data);
					}

				});
			}
		}
	});
	return SimpleConfiggridPanel;
}
/**
 * 新增sdinterface 选择type
 */
function addOrUpdateSdInterface() {
	var win_buttons = [{
		text : '确定',
		handler : function() {
			var id = win_form.getValues().id;
			var text = win_form.getValues().text;
			var description = win_form.getValues().description;
			var type = win_form.getValues().type;
			if (null == text || '' == text) {
				Ext.Msg.alert('提示', '名称不能为空！！！');
				return;
			} else {
				if (!isRigthName(text)) {
				Ext.Msg.alert('提示', '名称不能包含空格及中文字符');
				return;
			}
				var items = Ext.getCmp('SimpleConfiggridPanel').store.data.items;
				for (var i = 0; i < items.length; i++) {
					if (text == items[i].data.text) {
						Ext.Msg.alert('提示', '名称已经存在！！！');
						return;
					}
				}

			}
			if (null == type || '' == type) {
				Ext.Msg.alert('提示', '请选择类型！！！');
				return;
			}
			win.close();
			if (type == 'xml2yigo') {
				xmlToYigoWin(text, description, null, "", type, text, true);
			}else if (type == 'customedxml2yigo') {
				customedxmlToYigo2Win(text, description, null, "", type, text, true);
			}else if (type == 'table2yigo') {
				dstableToYigoWin(text, description, null, "", type, text, true);
			} else if (type == 'excel2yigo') {
				excelToYigoWin(text, description, null, "", type, text, true);
			}else if (type == 'yigo2xml') {
				yigoToXmlWin(text, description, null, "", type, text, true);
			}else if (type == 'yigo2excel') {
				yigoToExcelWin(text, description, null, "", type, text, true);
			} else if (type == 'sql2excel') {
				sqlToExcelWin(text, description, null, "", type, text, true);
			}else if (type == 'yigo2table') {
				yigo2TableWin(text, description, null, "", type, text, true);
			}else{
				
			}
		}
	}, {
		text : '取消',
		handler : function() {
			win.close();
		}
	}];
	var SdInterfaceTypeCombox = Ext.create('Ext.data.Store', {
				fields : ['displayField', 'value'],
				storeId : 'SdInterfaceTypeCombox',
				data : [{
							'displayField' : 'Xml格式到Yigo系统单据',
							'value' : 'xml2yigo'
						},{
							'displayField' : 'Xml格式到Yigo系统单据(自定义格式)',
							'value' : 'customedxml2yigo'
						},{
							'displayField' : '数据库表到Yigo系统单据',
							'value' : 'table2yigo'
						}, {
							'displayField' : 'Excel文件到Yigo系统单据',
							'value' : 'excel2yigo'
						}, {
							'displayField' : 'Yigo系统单据到Xml格式',
							'value' : 'yigo2xml'
						}, {
							'displayField' : 'Yigo系统单据到Excel文件',
							'value' : 'yigo2excel'
						}, {
							'displayField' : 'Sql语句到Excel文件',
							'value' : 'sql2excel'
						},{
							'displayField' : 'Yigo系统单据到数据库表',
							'value' : 'yigo2table'
						}],
				autoLoad : true
			});
	var win_form = Ext.create('Ext.form.Panel', {
				width : '100%',
				height : 150,
				bodyPadding : 5,
				margins : '5 0 0 5',
				border : 0,
				method : 'post',
				layout : 'anchor',
				defaults : {
					anchor : '100%'
				},
				defaultType : 'textfield',
				items : [{
							name : 'id',
							hidden : true
						}, {
							fieldLabel : '名称'+needToFill,
							name : 'text',
							emptyText : '只能有数字和字母组成',
							allowBlank : false
						}, {
							xtype : 'textarea',
							fieldLabel : '描述',
							name : 'description',
							height : 60,
							allowBlank : true
						}, {
							xtype : 'combobox',
							fieldLabel : '类型'+needToFill,
							editable : false,
							name : 'type',
							store : SdInterfaceTypeCombox,
							displayField : 'displayField',
							valueField : 'value',
							queryMode : 'local',
							emptyText : '请选择'
						}]
			});
	var win = Ext.create('Ext.Window', {
				title : '新增Yigo配置',
				width : 400,
				height : 210,
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
 * 生成接口服务
 */
function createInterafaceService(record, interfaceId) {
	bodyLoadingMask.show();
	var url = '';
	if (record.data.type == 'xml2yigo') {
		url = 'interfaceSimpleConfigXmlToYigoController.do?actionType=createInterfaceJsonFile'
	} else if (record.data.type == 'customedxml2yigo') {
		url = 'interfaceSimpleConfigCustomedXmlToYigoController.do?actionType=createInterfaceJsonFile'
	} else if (record.data.type == 'table2yigo') {
		url = 'interfaceSimpleConfigTableToYigoController.do?actionType=createInterfaceJsonFile'
	} else if (record.data.type == 'excel2yigo') {
		url = 'interfaceExcelToYigoController.do?actionType=createInterfaceJsonFile'
	} else if (record.data.type == 'yigo2xml') {
		url = 'interfaceYigoToXmlController.do?actionType=createInterfaceJsonFile'
	} else if (record.data.type == 'yigo2excel') {
		url = 'interfaceYigoToExcelController.do?actionType=createInterfaceJsonFile'
	} else if (record.data.type == 'sql2excel') {
		url = 'interfaceSqlToExcelController.do?actionType=createInterfaceJsonFile'
	}else if (record.data.type == 'yigo2table') {
		url = 'interfaceSimpleConfigYigoToTableController.do?actionType=createInterfaceJsonFile'
	}else {
		bodyLoadingMask.hide();
		Ext.Msg.alert('提示', record.data.type + '类型还不支持 ！！！');
		return;
	}
	Ext.Ajax.request({
		url : url,
		params : {
			id : record.data.id,
			interfaceId : interfaceId
		},
		success : function(response) {
			bodyLoadingMask.hide();
			var result = Ext.decode(response.responseText);
			if (result.result) {
				Ext.Msg.alert('提示', '生成成功');
				var left_accordion_jkpz_tree = getCmp('left_accordion_jkpz_tree');
				var left_accordion_jkpz_tree_store = left_accordion_jkpz_tree.store;
				left_accordion_jkpz_tree_store.getRootNode().removeAll();
				left_accordion_jkpz_tree_store.load();
				getCmp('SimpleConfiggridPanel').store.load();
			} else {
				Ext.Msg.alert('失败', result.data);
			}
		},
		failure : function(response) {
			bodyLoadingMask.hide();
			var result = Ext.decode(response.responseText);
			Ext.Msg.alert('失败', result.data);
		}

	});
}
/**
 * 选择接口 在已有的接口下面生成服务
 */
function chooseInterfaceWin(record) {
	var win_buttons = [{
				text : '确定',
				handler : function() {
					var interfaceId = win_form.getValues().interfaceId;
					win.close();
					createInterafaceService(record, interfaceId);
				}
			}, {
				text : '取消',
				handler : function() {
					win.close();
				}
			}];
	var InterfaceCombox = Ext.create('Ext.data.Store', {
		model : 'Combox',
		proxy : {
			type : 'ajax',
			url : 'interfaceInfoFindController.do?actionType=findInterfaceCombobox',
			reader : {
				type : 'json',
				root : 'root'
			}
		},
		autoLoad : true
	});
	var win_form = Ext.create('Ext.form.Panel', {
				width : '100%',
				bodyPadding : 5,
				margins : '50 0 0 5',
				border : 0,
				method : 'post',
				layout : 'anchor',
				defaults : {
					anchor : '100%'
				},
				defaultType : 'textfield',
				items : [{
							xtype : 'combobox',
							fieldLabel : '接口',
							editable : false,
							name : 'interfaceId',
							store : InterfaceCombox,
							displayField : 'displayField',
							valueField : 'value',
							queryMode : 'local',
							emptyText : '请选择(不选时，会生成新的接口和服务)'
						}]
			});
	var win = Ext.create('Ext.Window', {
				title : '选择接口',
				width : 400,
				height : 210,
				layout : 'fit',
				draggable : false,
				bodyStyle : 'background:#ffffff;',
				resizable : false,
				modal : true,
				buttons : win_buttons,
				items : [win_form]
			});
	win.show();
}
