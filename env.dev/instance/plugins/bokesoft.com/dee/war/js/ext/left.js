/**
 * @return {TypeName}
 */
function left_accordion() {

	var left_accordion_tree_storeURL = 'interfaceInfoFindController.do?actionType=findLeftTreeStore';
	var jkpz_tree_storeURL = 'interfaceInfoFindController.do?actionType=findJkpzTreeStore';
	var result = ajaxSyncCall(left_accordion_tree_storeURL);
	if (result.substring(0, 1) != '{') {
		Ext.Msg.alert('提示', result);
		location.href = 'loginDesign.jsp';
		return;
	}
	var treeData = Ext.decode(result);
	if (!treeData.common_config) {
		treeData.common_config = {
			value : []
		};
	}
	if (!treeData.interface_config) {
		treeData.interface_config = {
			value : []
		};
	}
	if (!treeData.log_manage) {
		treeData.log_manage = {
			value : []
		};
	}
	if (!treeData.interfce_manage) {
		treeData.interfce_manage = {
			value : []
		};
	}
	if (!treeData.other_config) {
		treeData.other_config = {
			value : []
		};
	}
	if (!treeData.exchange_center) {
		treeData.exchange_center = {
			value : []
		};
	}
	if (!treeData.permission_config) {
		treeData.permission_config = {
			value : []
		};
	}
	if (!treeData.dataTemplate_config) {
		treeData.dataTemplate_config = {
			value : []
		};
	}
	var ggpz_tree_store = Ext.create('Ext.data.TreeStore', {
				id : 'ggpz_tree_store',
				root : treeData.common_config.value,
				autoload : true
			});

	var jkpz_tree_store = Ext.create('Ext.data.TreeStore', {
				id : 'jkpz_tree_store',
				fields : ['id', 'text', 'name', 'description', 'enable'],
				proxy : {
					type : 'ajax',
					url : jkpz_tree_storeURL
				},
				root : treeData.interface_config.value,
				autoload : false
			});

	var logManager_tree_store = Ext.create('Ext.data.TreeStore', {
				id : 'logManager_tree_store',
				root : treeData.log_manage.value,
				autoload : true
			});

	var InterfaceManager_tree_store = Ext.create('Ext.data.TreeStore', {
				id : 'InterfaceManager_tree_store',
				root : treeData.interfce_manage.value,
				autoload : true
			});
	var info_tree_store = Ext.create('Ext.data.TreeStore', {
				id : 'info_tree_store',
				root : treeData.other_config.value,
				autoload : true
			});
	var dataTemplate_tree_store = Ext.create('Ext.data.TreeStore', {
				id : 'dataTemplate_tree_store',
				root : treeData.dataTemplate_config.value,
				autoload : true
			});

	var permission_tree_store = Ext.create('Ext.data.TreeStore', {
				id : 'permission_tree_store',
				root : treeData.permission_config.value,
				autoload : true
			});

	var exchange_tree_store = Ext.create('Ext.data.TreeStore', {
				id : 'exchange_tree_store',
				root : treeData.exchange_center.value,
				autoload : true
			});
	var left_accordion_ggpz_tree = Ext.create('Ext.tree.Panel', {
				id : 'left_accordion_ggpz_tree',
				rootVisible : false,
				iconCls : 'treeNode',
				frame : false,
				useArrows : true,
				loadMask : true,
				border : 0,
				height : '100%',
				store : ggpz_tree_store,
				listeners : {
					itemclick : function(view, record) {
						doTreeClick(view, record, 'center_publicDeploy',
								'center_publicDeploy');
					}
				}
			});

	var left_accordion_logManager_tree = Ext.create('Ext.tree.Panel', {
		id : 'left_accordion_logManager_tree',
		rootVisible : false,
		iconCls : 'treeNode',
		frame : false,
		useArrows : true,
		loadMask : true,
		border : 0,
		height : '100%',
		store : logManager_tree_store,
		listeners : {
			itemclick : function(view, record) {
				doTreeClick(view, record, 'center_logManager', record.raw.text);
			}
		}
	});

	var left_accordion_InterfaceManager_tree = Ext.create('Ext.tree.Panel', {
				id : 'left_accordion_InterfaceManager_tree',
				rootVisible : false,
				iconCls : 'treeNode',
				frame : false,
				useArrows : true,
				loadMask : true,
				border : 0,
				height : '100%',
				store : InterfaceManager_tree_store,
				listeners : {
					itemclick : function(view, record) {
						doTreeClick(view, record, 'center_buildXML',
								record.raw.text);
					}
				}
			});

	var left_accordion_jkpz_tree = Ext.create('Ext.tree.Panel', {
				id : 'left_accordion_jkpz_tree',
				rootVisible : false,
				iconCls : 'treeNode',
				frame : false,
				useArrows : true,
				loadMask : true,
				border : 0,
				width : '100%',
				height : '100%',
				store : jkpz_tree_store,
				listeners : {
					itemclick : function(view, record) {
						doTreeClick(view, record, 'center_service',
								'center_service');
					}
				},
				viewConfig : {
					loadMask : false,
					getRowClass : function(record, rowIndex, rowParams, store) {
						if (record.data.leaf && record.data.enable == 'false') {
							return 'enable-service-background-row';
						} else if (record.data.enable == 'false') {// 如果是接口名下面的服务都是 未启用 也 改变颜色
							return 'enable-service-background-row';
						}
					}
				}
			});
	left_accordion_jkpz_tree.getView().on('render', function(view) {
		view.tip = Ext.create('Ext.tip.ToolTip', {
					target : view.el,
					delegate : view.itemSelector,
					trackMouse : true,
					maxWidth : '100%',
					renderTo : Ext.getBody(),
					style : {
						background : '#FFFF90'
					},
					listeners : {
						beforeshow : function updateTipBody(tip) {
							tip.update(view.getRecord(tip.triggerElement)
									.get('text')
									+ ':'
									+ view.getRecord(tip.triggerElement)
											.get('description'));
						}
					}
				});
	});
	var left_accordion_info_tree = Ext.create('Ext.tree.Panel', {
		id : 'left_accordion_info_tree',
		rootVisible : false,
		iconCls : 'treeNode',
		frame : false,
		useArrows : true,
		loadMask : true,
		border : 0,
		height : '100%',
		store : info_tree_store,
		listeners : {
			itemclick : function(view, record) {
				doTreeClick(view, record, 'center_systemInfo', record.raw.text);
			}
		}
	});

	var left_accordion_dataTemplate_tree = Ext.create('Ext.tree.Panel', {
				id : 'left_accordion_dataTemplate_tree',
				rootVisible : false,
				iconCls : 'treeNode',
				frame : false,
				useArrows : true,
				loadMask : true,
				border : 0,
				height : '100%',
				store : dataTemplate_tree_store,
				listeners : {
					itemclick : function(view, record) {
						doTreeClick(view, record, 'center_dataTemplate',
								record.raw.text);
					}
				}
			});

	var left_accordion_permission_tree = Ext.create('Ext.tree.Panel', {
		id : 'left_accordion_permission_tree',
		rootVisible : false,
		iconCls : 'treeNode',
		frame : false,
		useArrows : true,
		loadMask : true,
		border : 0,
		height : '100%',
		store : permission_tree_store,
		listeners : {
			itemclick : function(view, record) {
				doTreeClick(view, record, 'center_permission', record.raw.text);
			}

		}
	});

	var left_exchange_center_tree = Ext.create('Ext.tree.Panel', {
				id : 'left_exchange_center_tree',
				rootVisible : false,
				iconCls : 'treeNode',
				frame : false,
				useArrows : true,
				loadMask : true,
				border : 0,
				height : '100%',
				store : exchange_tree_store,
				listeners : {
					itemclick : function(view, record) {
						doTreeClick(view, record, 'center_exchange_center',
								record.raw.text);
					}

				}
			});

	function createAccordionItem(obj) {
		if (!obj.text) {
			return null;
		}
		var item = {
			title : obj.text,
			iconCls : obj.iconCls,
			items : [getCmp(obj.items)]
		};
		if (obj.tools) {
			item.tools = Ext.decode(obj.tools);
		}
		return item;
	}
	var accordion = [];
	var j = 0;
	for (var i in treeData) {
		var item = createAccordionItem(treeData[i]);
		if (item != null) {
			accordion[j] = item;
			j++;
		}
	}
	return accordion;
}

/**
 * 这个是最左边的一块面板
 */
var left = Ext.create('Ext.panel.Panel', {
			id : 'left',
			title : '主菜单',
			region : 'west',
			collapsible : true,
			split : true,
			// hidden : true,
			width : 220,
			layout : 'accordion',
			activeItem : '2',
			defaultType : 'panel'
		});

/**
 * 监听面Left板合起事件
 * 
 * @param {Object}
 *            p
 */
left.on('beforecollapse', function(p) {
			if (Ext.isChrome) {
				getCmp(center.items.keys).width = Ext.getCmp(center.items.keys).width
						+ p.width;
			} else {
				getCmp(center.items.keys).width = '100%';
			}

		});
/**
 * 监听Left展开事件
 * 
 * @param {Object}
 *            p
 */
left.on('beforeexpand', function(p) {
			if (Ext.isChrome) {
				getCmp(center.items.keys).width = Ext.getCmp(center.items.keys).width
						- p.width;
			} else {
				getCmp(center.items.keys).width = '100%';
			}
		});