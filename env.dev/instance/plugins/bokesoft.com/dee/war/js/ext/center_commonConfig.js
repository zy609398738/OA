/**
 * 中间面板公共配置DataSource的Grid
 */
function center_pdDataSource() {

	var p_tbar_items = [{
		text : '新增',
		scale : 'small',
		hidden : isHiddenFromPermission('common_config',
				'findGgpzStoreDataSource', 'savePdDataSource'),
		icon : 'images/add.png',
		width : 50,
		handler : function() {
			windowSaveOrUpdateDataSource(null, false);
		}
	}, {
		text : '修改',
		scale : 'small',
		hidden : isHiddenFromPermission('common_config',
				'findGgpzStoreDataSource', 'updatePdDataSource'),
		icon : 'images/xiugai.png',
		width : 50,
		handler : function() {
			if (p.p_sel_record != null) {
				windowSaveOrUpdateDataSource(p.p_sel_record, false);
			}
		}
	}, {
		text : '删除',
		scale : 'small',
		hidden : isHiddenFromPermission('common_config',
				'findGgpzStoreDataSource', 'delPublicDeploy'),
		icon : 'images/shanchu.png',
		width : 50,
		handler : function() {
			if (p.p_sel_record != null) {
				deletePublicDeploy(p.p_sel_record);
			}
		}
	}, {
		text : '查看',
		scale : 'small',
		hidden : isHiddenFromPermission('common_config',
				'findGgpzStoreDataSource', 'findPdDataSource'),
		icon : 'images/chakan.png',
		width : 50,
		handler : function() {
			if (p.p_sel_record != null) {
				if (isHiddenFromPermission('common_config',
						'findGgpzStoreDataSource', 'updatePdDataSource') == false) {
					windowSaveOrUpdateDataSource(p.p_sel_record, true);
				}
			}
		}
	}];

	var t = changeColorToRed("公共配置　>>　数据源");
	var p_CheckboxModel = Ext.create('Ext.selection.CheckboxModel', {
				mode : 'SINGLE',
				listeners : {
					select : function(m, record, index) {
						p.p_sel_record = record;
						p.p_sel_model = m.getSelection()[0];
						p.p_sel_index = index;
					}
				}
			});

	var p_store_u = 'interfaceInfoFindController.do?actionType=findGgpzStore&type=DataSource.json';

	var p_listeners = {
		itemdblclick : function(view, record, item, index, event) {
			if (isHiddenFromPermission('common_config',
					'findGgpzStoreDataSource', 'updatePdDataSource') == false) {
				windowSaveOrUpdateDataSource(p.p_sel_record, false);
			}
		}
	}

	var modelType = 'PublicDeploy';

	var p_columns = [{
				header : '配置名称',
				sortable : false,
				menuDisabled : true,
				dataIndex : 'text',
				flex : 3
			}, {
				header : '配置类型',
				sortable : false,
				menuDisabled : true,
				dataIndex : 'driverClassName',
				flex : 3
			}, {
				header : '配置描述',
				sortable : false,
				menuDisabled : true,
				dataIndex : 'description',
				flex : 10
			}];

	var p_store = Ext.create('Ext.data.Store', {
				model : modelType,
				proxy : {
					type : 'ajax',
					url : p_store_u
				},
				autoLoad : true,
				listeners : {
					load : function(me) {
						bodyLoadingMask.hide();
						right.hide();
					}
				}
			});

	var p = Ext.create('Ext.grid.Panel', {
				id : 'center_publicDeploy',
				title : t,
				border : 0,
				height : '100%',
				width : '100%',
				viewConfig : {
					loadMask : false
				},
				sortableColumns : false,
				selModel : p_CheckboxModel,
				tbar : {
					items : p_tbar_items
				},
				columns : p_columns,
				store : p_store,
				listeners : p_listeners
			});
	return p;
};

/**
 * 中间面板公共配置Connector的Grid
 */
function center_pdConnector() {

	var p_tbar_items = [{
		text : '新增',
		scale : 'small',
		hidden : isHiddenFromPermission('common_config',
				'findGgpzStoreConnector', 'savePdConnector'),
		icon : 'images/add.png',
		width : 50,
		handler : function() {
			windowSaveOrUpdatePdConnector(null, false);
		}
	}, {
		text : '修改',
		scale : 'small',
		hidden : isHiddenFromPermission('common_config',
				'findGgpzStoreConnector', 'updatePdConnector'),
		icon : 'images/xiugai.png',
		width : 50,
		handler : function() {
			if (p.p_sel_record != null) {
				if (p.p_sel_record.raw.isSystem != ""
						&& p.p_sel_record.raw.isSystem) {
					Ext.Msg.alert('提示', "默认的不能修改或删除");
					return;
				};
				windowSaveOrUpdatePdConnector(p.p_sel_record, false);
			}
		}
	}, {
		text : '删除',
		scale : 'small',
		hidden : isHiddenFromPermission('common_config',
				'findGgpzStoreConnector', 'delPublicDeploy'),
		icon : 'images/shanchu.png',
		width : 50,
		handler : function() {
			if (p.p_sel_record != null) {
				if (p.p_sel_record.raw.isSystem != ""
						&& p.p_sel_record.raw.isSystem) {
					Ext.Msg.alert('提示', "默认的不能修改或删除");
					return;
				};
				deletePublicDeploy(p.p_sel_record);
			}
		}
	}, {
		text : '查看',
		scale : 'small',
		hidden : isHiddenFromPermission('common_config',
				'findGgpzStoreConnector', 'findPdDataSource'),
		icon : 'images/chakan.png',
		width : 50,
		handler : function() {
			if (p.p_sel_record != null) {
				windowSaveOrUpdatePdConnector(p.p_sel_record, true);
			}
		}
	}];

	var t = changeColorToRed("公共配置　>>　连接器");
	var p_CheckboxModel = Ext.create('Ext.selection.CheckboxModel', {
				mode : 'SINGLE',
				listeners : {
					select : function(m, record, index) {
						p.p_sel_record = record;
						p.p_sel_model = m.getSelection()[0];
						p.p_sel_index = index;
					}
				}
			});

	var p_store_u = 'interfaceInfoFindController.do?actionType=findGgpzStore&type=Connector.json';

	var p_listeners = {
		itemdblclick : function(view, record, item, index, event) {
			if (isHiddenFromPermission('common_config',
					'findGgpzStoreConnector', 'updatePdConnector') == false) {
				if (p.p_sel_record.raw.isSystem != ""
						&& p.p_sel_record.raw.isSystem) {
					Ext.Msg.alert('提示', "默认的不能修改或删除");
					return;
				};
				windowSaveOrUpdatePdConnector(p.p_sel_record, false);
			}
		}
	}

	var p_columns;

	p_columns = [{
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
			}];

	var p_store = Ext.create('Ext.data.Store', {
				model : 'PublicDeploy',
				proxy : {
					type : 'ajax',
					url : p_store_u
				},
				autoLoad : true,
				listeners : {
					load : function(me) {
						bodyLoadingMask.hide();
						right.hide();
					}
				}
			});

	var p = Ext.create('Ext.grid.Panel', {
				id : 'center_publicDeploy',
				title : t,
				border : 0,
				height : '100%',
				width : '100%',
				viewConfig : {
					loadMask : false
				},
				sortableColumns : false,
				selModel : p_CheckboxModel,
				tbar : {
					items : p_tbar_items
				},
				columns : p_columns,
				store : p_store,
				listeners : p_listeners
			});
	return p;
};

/**
 * 中间面板公共配置SpringBean的Grid
 */
function center_pdSpringBean() {

	var p_tbar_items = [{
		text : '新增',
		scale : 'small',
		hidden : isHiddenFromPermission('common_config',
				'findGgpzStoreSpringBean', 'saveSpringBean'),
		icon : 'images/add.png',
		width : 50,
		handler : function() {
			windowSaveOrUpdateSpringBean(null, false);
		}
	}, {
		text : '修改',
		scale : 'small',
		hidden : isHiddenFromPermission('common_config',
				'findGgpzStoreSpringBean', 'updateSpringBean'),
		icon : 'images/xiugai.png',
		width : 50,
		handler : function() {
			if (p.p_sel_record != null) {
				windowSaveOrUpdateSpringBean(p.p_sel_record, false);
			}
		}
	}, {
		text : '删除',
		scale : 'small',
		hidden : isHiddenFromPermission('common_config',
				'findGgpzStoreSpringBean', 'delPublicDeploy'),
		icon : 'images/shanchu.png',
		width : 50,
		handler : function() {
			if (p.p_sel_record != null) {
				deletePublicDeploy(p.p_sel_record);
			}
		}
	}, {
		text : '查看',
		scale : 'small',
		hidden : isHiddenFromPermission('common_config',
				'findGgpzStoreSpringBean', 'findSpringBean'),
		icon : 'images/chakan.png',
		width : 50,
		handler : function() {
			if (p.p_sel_record != null) {
				windowSaveOrUpdateSpringBean(p.p_sel_record, true);
			}
		}
	}];

	var t = changeColorToRed("公共配置　>>　Spring对象");

	var p_CheckboxModel = Ext.create('Ext.selection.CheckboxModel', {
				mode : 'SINGLE',
				listeners : {
					select : function(m, record, index) {
						p.p_sel_record = record;
						p.p_sel_model = m.getSelection()[0];
						p.p_sel_index = index;
					}
				}
			});

	var p_store_u = 'interfaceInfoFindController.do?actionType=findGgpzStore&type=SpringBean.json';

	var p_listeners = {
		itemdblclick : function(view, record, item, index, event) {
			if (isHiddenFromPermission('common_config',
					'findGgpzStoreSpringBean', 'updateSpringBean') == false) {
				windowSaveOrUpdateSpringBean(p.p_sel_record, false);
			}

		}
	}

	var p_columns = [{
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
			}];

	var p_store = Ext.create('Ext.data.Store', {
				model : 'PublicDeploy',
				proxy : {
					type : 'ajax',
					url : p_store_u
				},
				autoLoad : true,
				listeners : {
					load : function(me) {
						bodyLoadingMask.hide();
						right.hide();
					}
				}
			});

	var p = Ext.create('Ext.grid.Panel', {
				id : 'center_publicDeploy',
				title : t,
				border : 0,
				height : '100%',
				width : '100%',
				viewConfig : {
					loadMask : false
				},
				sortableColumns : false,
				selModel : p_CheckboxModel,
				tbar : {
					items : p_tbar_items
				},
				columns : p_columns,
				store : p_store,
				listeners : p_listeners
			});
	return p;
};

/**
 * 中间面板公共配置Transformer的Grid
 */
function center_pdTransformer() {

	var transformerType = 'coreConfig/commonTransformerConfig/commonTransformer.json';

	var p_tbar_items = [{
		text : '查看',
		scale : 'small',
		hidden : isHiddenFromPermission('common_config',
				'findGgpzStoreTransformer', 'checkTransformer'),
		icon : 'images/chakan.png',
		width : 50,
		handler : function() {
			if (p.p_sel_record != null) {
				windowGGPZTransformer(p.p_sel_record);
			}
		}
	}];

	var t = changeColorToRed("公共配置　>>　Transformer");

	var p_CheckboxModel = Ext.create('Ext.selection.CheckboxModel', {
				mode : 'SINGLE',
				listeners : {
					select : function(m, record, index) {
						p.p_sel_record = record;
						p.p_sel_model = m.getSelection()[0];
						p.p_sel_index = index;
					}
				}
			});

	var p_store_u = 'interfaceInfoFindController.do?actionType=findGgpzStore&type='
			+ transformerType;

	var p_listeners = {
		itemdblclick : function(view, record, item, index, event) {
			if (isHiddenFromPermission('common_config',
					'findGgpzStoreTransformer', 'checkTransformer') == false) {
				windowGGPZTransformer(p.p_sel_record);
			}

		}
	}

	var p_columns = [{
				header : '配置名称',
				sortable : false,
				menuDisabled : true,
				dataIndex : 'text',
				flex : 3
			}, {
				header : '配置描述',
				sortable : false,
				menuDisabled : true,
				dataIndex : 'description',
				flex : 10
			}, {
				header : '对应类名',
				sortable : false,
				menuDisabled : true,
				dataIndex : 'className',
				flex : 3
			}];
	/**
	 * 这里的store因为一直不变 所以用缓存数据就好
	 * 
	 * @type
	 */
	var p_store;
	if (Ext.data.StoreManager.containsKey('center_pdTransformerStoreId')) {
		bodyLoadingMask.hide();
		right.hide();
		p_store = Ext.data.StoreManager.get('center_pdTransformerStoreId');
	} else {
		var p_store = Ext.create('Ext.data.Store', {
					storeId : 'center_pdTransformerStoreId',
					model : 'PublicDeploy',
					proxy : {
						type : 'ajax',
						url : p_store_u
					},
					autoLoad : true,
					listeners : {
						load : function(me) {
							bodyLoadingMask.hide();
							right.hide();
						}
					}
				});
	}

	var p = Ext.create('Ext.grid.Panel', {
				id : 'center_publicDeploy',
				title : t,
				border : 0,
				height : '100%',
				width : '100%',
				viewConfig : {
					loadMask : false
				},
				sortableColumns : false,
				selModel : p_CheckboxModel,
				tbar : {
					items : p_tbar_items
				},
				columns : p_columns,
				store : p_store,
				listeners : p_listeners
			});
	return p;
};

/**
 * 中间面板公共配置GlobalSource的Grid
 */
function center_pdGlobalSource() {

	var p_pluginCellEdit = Ext.create('Ext.grid.plugin.CellEditing', {
				clicksToEdit : 1,
				listeners : {
					beforeedit : function(record) {

					}
				}
			});

	function globalSourceSaveOrUpdate(globalSource) {
		Ext.Ajax.request({
					url : 'interfaceInfoSaveController.do',
					params : {
						actionType : 'saveOrUpdateGlobalSource',
						text : globalSource
					},
					success : function(response) {
						if ('success' == response.responseText)
							//Ext.Msg.alert('提示', '保存成功');
							Ext.bokedee.msg('保存信息', 1000,'保存成功');
						else
							Ext.Msg.alert('保存失败', response.responseText);
					}
				});
	}

	var t = changeColorToRed("公共配置　>>　全局配置");

	var p_tbar_items = [{
		text : '新增',
		scale : 'small',
		hidden : isHiddenFromPermission('common_config',
				'findGgpzStoreGlobalSource', 'newGlobalSource'),
		icon : 'images/add.png',
		width : 50,
		handler : function() {
			var r = Ext.ModelManager.create({
						key : '',
						value : '',
						description : ''
					}, 'globalSource');
			p_store.insert(p_store.getCount(), r);
			var row = p_store.getCount() - 1;
			p_pluginCellEdit.startEditByPosition({
						row : row,
						column : 0
					});
		}
	}, {
		text : '删除',
		scale : 'small',
		hidden : isHiddenFromPermission('common_config',
				'findGgpzStoreGlobalSource', 'delPublicDeploy'),
		icon : 'images/shanchu.png',
		width : 50,
		handler : function() {
			if (p.p_sel_record) {
				p_store.removeAt(p.p_sel_index);
				p.p_sel_record = undefined;
			}
		}
	}, {
		text : '保存',
		scale : 'small',
		hidden : isHiddenFromPermission('common_config',
				'findGgpzStoreGlobalSource', 'saveOrUpdateGlobalSource'),
		icon : 'images/baocun.png',
		width : 50,
		handler : function() {
			if (validateGlobalSource(p_store))
				return;
			var globalSource = storeToJSON(p_store);
			globalSourceSaveOrUpdate(globalSource);
		}
	}];

	var p_CheckboxModel = Ext.create('Ext.selection.CheckboxModel', {
				mode : 'SINGLE',
				listeners : {
					select : function(m, record, index) {
						p.p_sel_record = record;
						p.p_sel_model = m.getSelection()[0];
						p.p_sel_index = index;
					}
				}
			});

	var p_store_u = 'interfaceInfoFindController.do?actionType=findGgpzStore&type=GlobalSource.json';

	var p_columns = [{
				header : '名称',
				dataIndex : 'key',
				sortable : false,
				menuDisabled : true,
				flex : 3,
				editor : {
					xtype : 'textfield',
					allowBlank : false
				}
			}, {
				header : '值',
				sortable : false,
				menuDisabled : true,
				dataIndex : 'value',
				flex : 3,
				editor : {
					xtype : 'textfield',
					allowBlank : false
				}
			}, {
				header : '描述',
				sortable : false,
				menuDisabled : true,
				dataIndex : 'description',
				flex : 10,
				editor : {
					xtype : 'textfield'
				}
			}];

	var p_store = Ext.create('Ext.data.Store', {
				model : 'globalSource',
				proxy : {
					type : 'ajax',
					url : p_store_u
				},
				autoLoad : true,
				listeners : {
					load : function(me) {
						bodyLoadingMask.hide();
						right.hide();
					}
				}
			});

	var plugins = [p_pluginCellEdit];

	var p = Ext.create('Ext.grid.Panel', {
				id : 'center_publicDeploy',
				title : t,
				border : 0,
				height : '100%',
				width : '100%',
				viewConfig : {
					loadMask : false
				},
				sortableColumns : false,
				selModel : p_CheckboxModel,
				tbar : {
					items : p_tbar_items
				},
				columns : p_columns,
				store : p_store,
				plugins : plugins
			});
	return p;
};

/**
 * 中间面板公共配置WebServiceActionMapping的Grid
 */
function center_pdWebServiceActionMapping() {

	var type = 'WebServiceActionMapping.json';

	var p_CheckboxModel = Ext.create('Ext.selection.CheckboxModel', {
				mode : 'SINGLE',
				listeners : {
					select : function(m, record, index) {
						p.p_sel_record = record;
						p.p_sel_model = m.getSelection()[0];
						p.p_sel_index = index;
					}
				}
			});

	var t = "公共配置　>>　Web服务映射";
	var p_tbar_items = [{
		text : '新增',
		scale : 'small',
		hidden : isHiddenFromPermission('common_config',
				'findGgpzStoreWSAMapping', 'newWSAMapping'),
		icon : 'images/add.png',
		width : 50,
		handler : function() {
			windowAddOrUpdateServiceMapping();
		}
	}, {
		text : '删除',
		scale : 'small',
		hidden : isHiddenFromPermission('common_config',
				'findGgpzStoreWSAMapping', 'delPublicDeploy'),
		icon : 'images/shanchu.png',
		width : 50,
		handler : function() {
			if (p.p_sel_record) {
				deleteWebServiceMapping(p.p_sel_record.data.key, p.p_sel_index);
				p.p_sel_record = undefined;
			}
		}
	}, {
		text : '修改',
		scale : 'small',
		hidden : isHiddenFromPermission('common_config',
				'findGgpzStoreWSAMapping', 'saveOrUpdateWSAMapping'),
		icon : 'images/xiugai.png',
		width : 50,
		handler : function() {
			if (p.p_sel_record) {
				windowAddOrUpdateServiceMapping(p.p_sel_record);
			}
		}
	}];
	t = changeColorToRed(t);
	var p_store_u = 'interfaceInfoFindController.do?actionType=findGgpzStore&type='
			+ type
	var p_columns = [{
				header : '名称',
				dataIndex : 'key',
				sortable : false,
				menuDisabled : true,
				locked : true,
				width : 200
			}, {
				header : '接口',
				sortable : false,
				menuDisabled : true,
				dataIndex : 'interfacesName',
				flex : 4

			}, {
				header : '服务',
				sortable : false,
				menuDisabled : true,
				dataIndex : 'servicesName',
				flex : 4
			}, {
				header : '值（之前版本的数据才会有值）',
				dataIndex : 'value',
				sortable : false,
				menuDisabled : true,
				flex : 6
			}, {
				header : '描述',
				sortable : false,
				menuDisabled : true,
				dataIndex : 'description',
				flex : 10
			}];

	var p_store = Ext.create('Ext.data.Store', {
				model : 'globalSource',
				proxy : {
					type : 'ajax',
					url : p_store_u
				},
				autoLoad : true,
				listeners : {
					load : function(me) {
						bodyLoadingMask.hide();
						right.hide();
					}
				}
			});

	var p = Ext.create('Ext.grid.Panel', {
				id : 'center_publicDeploy',
				title : t,
				border : 0,
				height : '100%',
				width : '100%',
				viewConfig : {
					loadMask : false,
					listeners : {
						itemdblclick : function(view, record, item, index,
								event) {
							windowAddOrUpdateServiceMapping(record);
						}
					}
				},
				sortableColumns : false,
				tbar : {
					items : p_tbar_items
				},
				selModel : p_CheckboxModel,
				columns : p_columns,
				store : p_store
			});
	return p;
};

/**
 * 中间面板公共配置ServletActionMapping的Grid
 */
function center_pdWebServletActionMapping() {

	var type = 'ServletActionMapping.json';

	var p_CheckboxModel = Ext.create('Ext.selection.CheckboxModel', {
				mode : 'SINGLE',
				listeners : {
					select : function(m, record, index) {
						p.p_sel_record = record;
						p.p_sel_model = m.getSelection()[0];
						p.p_sel_index = index;
					}
				}
			});

	var t = "公共配置　>>　Servlet映射";
	var p_tbar_items = [{
		text : '新增',
		scale : 'small',
		hidden : isHiddenFromPermission('common_config',
				'findGgpzStoreWSAMapping', 'newWSAMapping'),
		icon : 'images/add.png',
		width : 50,
		handler : function() {
			windowAddOrUpdateServletMapping();
		}
	}, {
		text : '删除',
		scale : 'small',
		hidden : isHiddenFromPermission('common_config',
				'findGgpzStoreWSAMapping', 'delPublicDeploy'),
		icon : 'images/shanchu.png',
		width : 50,
		handler : function() {
			if (p.p_sel_record) {
				if (p.p_sel_index == 0) {// 公共密钥
					Ext.Msg.alert('提示', '公共密钥不能删除，只能查看或更新');
					return;
				}
				deleteServletMapping(p.p_sel_record.data.id, p.p_sel_index);
				p.p_sel_record = undefined;
			}
		}
	}, {
		text : '修改',
		scale : 'small',
		hidden : isHiddenFromPermission('common_config',
				'findGgpzStoreWSAMapping', 'saveOrUpdateWSAMapping'),
		icon : 'images/xiugai.png',
		width : 50,
		handler : function() {
			if (p.p_sel_record) {
				if (p.p_sel_index == 0) {// 公共密钥
					windowUpdateSAMappingPublicKey(p.p_sel_record);
				} else {
					windowAddOrUpdateServletMapping(p.p_sel_record);
				}
			}
		}
	}];
	t = changeColorToRed(t);
	var p_store_u = 'interfaceInfoFindController.do?actionType=findGgpzStore&type='
			+ type
	var p_columns = [{
				header : '名称',
				dataIndex : 'key',
				sortable : false,
				menuDisabled : true,
				locked : true,
				width : 200
			}, {
				header : '接口',
				sortable : false,
				menuDisabled : true,
				dataIndex : 'interfacesName',
				flex : 4

			}, {
				header : '服务',
				sortable : false,
				menuDisabled : true,
				dataIndex : 'servicesName',
				flex : 4
			}, {
				header : '描述',
				sortable : false,
				menuDisabled : true,
				dataIndex : 'description',
				flex : 10
			}];

	var p_store = Ext.create('Ext.data.Store', {
				model : 'ServletMapping',
				proxy : {
					type : 'ajax',
					url : p_store_u
				},
				autoLoad : true,
				listeners : {
					load : function(me) {
						bodyLoadingMask.hide();
						right.hide();
					}
				}
			});

	var p = Ext.create('Ext.grid.Panel', {
				id : 'center_publicDeploy',
				title : t,
				border : 0,
				height : '100%',
				width : '100%',
				viewConfig : {
					loadMask : false,
					listeners : {
						itemdblclick : function(view, record, item, index,
								event) {
							if (index == 0) {// 公共密钥
								windowUpdateSAMappingPublicKey(record);
							} else {
								windowAddOrUpdateServletMapping(record);
							}
						}
					}
				},
				sortableColumns : false,
				tbar : {
					items : p_tbar_items
				},
				selModel : p_CheckboxModel,
				columns : p_columns,
				store : p_store
			});
	return p;
};
/**
 * 中间面板公共配置VmFileImport的Grid
 */
function center_pdVmFileImport() {

	var type = 'VmFileImport.json';

	var p_CheckboxModel = Ext.create('Ext.selection.CheckboxModel', {
				mode : 'SINGLE',
				listeners : {
					select : function(m, record, index) {
						p.p_sel_record = record;
						p.p_sel_model = m.getSelection()[0];
						p.p_sel_index = index;
					}
				}
			});

	var t = "公共配置　>>　文件导入设置";
	var p_tbar_items = [{
		text : '新增',
		scale : 'small',
		hidden : isHiddenFromPermission('common_config',
				'findGgpzStoreWSAMapping', 'newWSAMapping'),
		icon : 'images/add.png',
		width : 50,
		handler : function() {
			windowAddOrUpdateVmFileImport();
		}
	}, {
		text : '删除',
		scale : 'small',
		hidden : isHiddenFromPermission('common_config',
				'findGgpzStoreWSAMapping', 'delPublicDeploy'),
		icon : 'images/shanchu.png',
		width : 50,
		handler : function() {
			if (p.p_sel_record) {
				deleteVmFileImport(p.p_sel_record.data.id, p.p_sel_index);
				p.p_sel_record = undefined;
			}
		}
	}, {
		text : '修改',
		scale : 'small',
		hidden : isHiddenFromPermission('common_config',
				'findGgpzStoreWSAMapping', 'saveOrUpdateWSAMapping'),
		icon : 'images/xiugai.png',
		width : 50,
		handler : function() {
			if (p.p_sel_record) {
				windowAddOrUpdateVmFileImport(p.p_sel_record);
			}
		}
	}, {
		text : '文件上传路径',
		scale : 'small',
		icon : 'images/chakan.png',
		width : 100,
		handler : function() {
			if (p.p_sel_record) {
//				alert('文件上传路径为：' + 'http://localhost:48000/BokeDee/fileUpload?action=detail&services=' + p.p_sel_record.data.services);
				Ext.Msg.alert(
								'下载地址',window.location.origin + '/BokeDee/fileUpload?action=detail&services=' + p.p_sel_record.data.services);
			}
		}
	}];
	t = changeColorToRed(t);
	var p_store_u = 'interfaceInfoFindController.do?actionType=findGgpzStore&type='
			+ type

	var p_store = Ext.create('Ext.data.Store', {
				model : 'VmFileImport',
				proxy : {
					type : 'ajax',
					url : p_store_u
				},
				autoLoad : true,
				listeners : {
					load : function(me) {
						bodyLoadingMask.hide();
						right.hide();
					}
				}
			});
	var p = Ext.create('Ext.grid.Panel', {
				id : 'center_publicDeploy',
				title : t,
				border : 0,
				height : '100%',
				width : '100%',
				viewConfig : {
					loadMask : false,
					listeners : {
						itemdblclick : function(view, record, item, index,
								event) {
							windowAddOrUpdateVmFileImport(record);
						}
					}
				},
				sortableColumns : false,
				tbar : {
					items : p_tbar_items
				},
				selModel : p_CheckboxModel,
				columns : [{
							header : '名称',
							dataIndex : 'key',
							sortable : false,
							menuDisabled : true,
							locked : true,
							width : 200
						}, {
							header : '接口',
							dataIndex : 'interfacesName',
							sortable : false,
							menuDisabled : true,
							flex : 4
						}, {
							header : '服务',
							dataIndex : 'servicesName',
							sortable : false,
							menuDisabled : true,
							flex : 4
						}, {
							header : '描述',
							dataIndex : 'description',
							sortable : false,
							menuDisabled : true,
							flex : 10
						}],
				store : p_store
			});
	return p;
};