function center_operatorManager() {
	var title = changeColorToRed('权限管理 >> 操作员管理');

	var operatorList_tbar = {
		items : [{
			text : '新增操作员',
			scale : 'small',
			width : 100,
			hidden : isHiddenFromPermission('permission_config',
					'findOperator', 'saveOperator'),
			icon : 'images/add.png',
			handler : function() {
				windowSaveOrUpdateOperator();
			}
		}, {
			text : '修改操作员',
			scale : 'small',
			hidden : isHiddenFromPermission('permission_config',
					'findOperator', 'updateOperator'),
			width : 100,
			icon : 'images/xiugai.png',
			handler : function() {
				if (operatorList.record) {
					windowSaveOrUpdateOperator(operatorList.record);
				}
			}
		}, {
			text : '删除操作员',
			scale : 'small',
			hidden : isHiddenFromPermission('permission_config',
					'findOperator', 'deletePermission'),
			width : 100,
			icon : 'images/shanchu.png',
			handler : function() {
				if (operatorList.record) {
					deletePermission(operatorList.record, 'operator',
							operatorList.index)
				}
			}
		}, {
			text : '修改密码',
			scale : 'small',
			hidden : isHiddenFromPermission('permission_config',
					'findOperator', 'alterOperatorPassword'),
			width : 100,
			icon : 'images/xiugaimima.png',
			handler : function() {
				if (operatorList.record) {
					windowAlterOperatorPassword(operatorList.record);
				}
			}
		}]
	}
	var operatorList_storeURL = 'interfacePermissionManagerController.do?actionType=findOperator';

	var operatorList_store = Ext.create('Ext.data.Store', {
				model : 'operator',
				proxy : {
					type : 'ajax',
					url : operatorList_storeURL
				},
				sorters : {
					property : 'createDate',
					direction : 'DESC'
				},
				autoLoad : true
			});

	var roleList_storeURL = 'interfacePermissionManagerController.do?actionType=findRole';

	var roleList_store = Ext.create('Ext.data.Store', {
				model : 'role'
			});

	var operatorList_CheckboxModel = Ext.create('Ext.selection.CheckboxModel',
			{
				mode : 'SINGLE',
				listeners : {
					select : function(m, record, index) {
						operatorList.record = record;
						operatorList.index = index;
						roleList_store.load({
									url : roleList_storeURL,
									params : {
										roles : Ext.encode(record.data.roles)
									}
								});
					}
				}
			});

	var operatorList = Ext.create('Ext.grid.Panel', {
				height : 565,
				tbar : operatorList_tbar,
				id : 'center_operatorList',
				selModel : operatorList_CheckboxModel,
				flex : 7,
				columns : [{
							header : '用户名',
							sortable : false,
							menuDisabled : true,
							dataIndex : 'loginname',
							flex : 1
						}, {
							header : '姓名',
							sortable : false,
							menuDisabled : true,
							dataIndex : 'username',
							flex : 1
						}, {
							header : '描述',
							sortable : false,
							menuDisabled : true,
							dataIndex : 'description',
							flex : 1
						}, {
							header : '是否是Admin',
							sortable : false,
							menuDisabled : true,
							dataIndex : 'isAdmin',
							flex : 1,
							renderer : function(value) {
								if (true == value) {
									return '是';
								} else if (false == value) {
									return '否';
								}
							}
						}, {
							header : '创建日期',
							sortable : false,
							menuDisabled : true,
							dataIndex : 'createDate',
							flex : 1
						}, {
							header : '修改日期',
							sortable : false,
							menuDisabled : true,
							dataIndex : 'updateDate',
							flex : 1
						}],
				store : operatorList_store,
				listeners : {
					itemdblclick : function(view, record, item, index, event) {
						if (isHiddenFromPermission('permission_config',
								'findOperator', 'updateOperator') == false) {
							windowSaveOrUpdateOperator(operatorList.record);
						}
					}
				}
			});

	var roleList = Ext.create('Ext.grid.Panel', {
				id : 'center_roleList',
				height : 565,
				flex : 3,
				plugins : [Ext.create('Ext.grid.plugin.CellEditing', {
							clicksToEdit : 1
						})],
				columns : [{
							header : '角色名',
							sortable : false,
							menuDisabled : true,
							dataIndex : 'rolename',
							flex : 1
						}, {
							header : '描述',
							sortable : false,
							menuDisabled : true,
							dataIndex : 'description',
							flex : 1
						}],
				store : roleList_store
			});

	var p = Ext.create('Ext.Panel', {
				id : 'center_operatorManager',
				title : title,
				draggable : false,
				resizable : false,
				layout : 'hbox',
				border : 0,
				width : '100%',
				height : '100%',
				items : [operatorList, roleList]
			});
	return p;
}

function center_roleManager() {
	var title = changeColorToRed('权限管理 >> 角色管理');
	var isReload = true;
	var shouldSelect = -1;
	var roleList_tbar = {
		items : [{
			text : '新增角色',
			scale : 'small',
			hidden : isHiddenFromPermission('permission_config', 'findRole',
					'saveRole'),
			width : 85,
			icon : 'images/add.png',
			handler : function() {
				windowSaveOrUpdateRole();
			}
		}, {
			text : '修改角色',
			scale : 'small',
			hidden : isHiddenFromPermission('permission_config', 'findRole',
					'updateRole'),
			width : 85,
			icon : 'images/xiugai.png',
			handler : function() {
				windowSaveOrUpdateRole(role_roleList.record);
			}
		}, {
			text : '删除角色',
			scale : 'small',
			hidden : isHiddenFromPermission('permission_config', 'findRole',
					'deletePermission'),
			width : 85,
			icon : 'images/shanchu.png',
			handler : function() {
				if (role_roleList.record) {
					deletePermission(role_roleList.record, 'role',
							role_roleList.index)
				}
			}
		}]
	}

	var roleList_storeURL = 'interfacePermissionManagerController.do?actionType=findRole';

	var roleList_store = Ext.create('Ext.data.Store', {
				model : 'role',
				proxy : {
					type : 'ajax',
					url : roleList_storeURL
				},
				sorters : {
					property : 'createDate',
					direction : 'DESC'
				},
				autoLoad : true,
				listeners : {
					load : function(me) {
						isReload = true;
						if (shouldSelect != -1) {
							roleList_CheckboxModel.select(shouldSelect);
						}
					}
				}
			});

	var pwerTree_storeURL = 'interfacePermissionManagerController.do?actionType=findPermission';
	var pwerTree_savePermissionURL = 'interfacePermissionManagerController.do?actionType=saveOrUpdateRole';
	function careateTree(record) {

		function saveRolePermission() {
			if (getCmp('center_roleManager').items.items[1]) {
				var treeRoot = getCmp('center_roleManager').items.items[1].store.tree.root;
				var treeJson = convertTreeStoreToData(treeRoot);
				var role = {
					id : role_roleList.record.data.id,
					permission : treeJson
				};
				Ext.Ajax.request({
							url : pwerTree_savePermissionURL,
							params : {
								role : Ext.encode(role)
							},
							success : function(response) {
								if ('success' == response.responseText) {
									//Ext.Msg.alert('提示', '保存成功');
									Ext.bokedee.msg('保存信息', 1000,'保存成功');
									roleList_store.load();
								} else {
									Ext.Msg.alert('提示', '保存失败：'
													+ response.responseText);
								}
							}
						});
			}
		}

		var tree_tbar = {
			items : [{
						text : '保存权限',
						scale : 'small',
						width : 100,
						icon : 'images/baocun.png',
						handler : function() {
							saveRolePermission();
						}
					}]
		}

		var store = Ext.create('Ext.data.TreeStore', {
					root : {
						children : record.data.permission
					},
					autoload : true
				});
		var tree = Ext.create('Ext.tree.Panel', {
					store : store,
					rootVisible : false,
					title : record.data.rolename + '的权限',
					tbar : tree_tbar,
					useArrows : true,
					flex : 3,
					height : 565,
					listeners : {
						checkchange : function(node, checked) {
							doTreeCheckChange(node, checked);
						}
					}
				});
		return tree;
	}

	var roleList_CheckboxModel = Ext.create('Ext.selection.CheckboxModel', {
				mode : 'SINGLE',
				listeners : {
					select : function(m, record, index) {
						if (isReload == false) {
							shouldSelect = index;
							roleList_store.load();
						} else {
							isReload = false;
							role_roleList.record = record;
							role_roleList.index = index;
							p.remove(1);
							p.add(careateTree(record));
						}
					}
				}
			});

	var role_roleList = Ext.create('Ext.grid.Panel', {
				height : 565,
				id : 'center_roleList1',
				flex : 7,
				tbar : roleList_tbar,
				selModel : roleList_CheckboxModel,
				columns : [{
							header : '角色名',
							sortable : false,
							menuDisabled : true,
							dataIndex : 'rolename',
							flex : 1
						}, {
							header : '描述',
							sortable : false,
							menuDisabled : true,
							dataIndex : 'description',
							flex : 1
						}, {
							header : '创建日期',
							sortable : false,
							menuDisabled : true,
							dataIndex : 'createDate',
							flex : 1
						}, {
							header : '修改日期',
							sortable : false,
							menuDisabled : true,
							dataIndex : 'updateDate',
							flex : 1
						}],
				store : roleList_store,
				listeners : {
					itemdblclick : function() {
						if (isHiddenFromPermission('permission_config',
								'findRole', 'updateRole') == false) {
							windowSaveOrUpdateRole(role_roleList.record);
						}
					}
				}
			});

	var powerTree_store = Ext.create('Ext.data.TreeStore', {
				root : [],
				autoload : true
			});

	var powerTree = Ext.create('Ext.tree.Panel', {
				store : powerTree_store,
				rootVisible : false,
				useArrows : true,
				flex : 3,
				height : 565,
				listeners : {
					checkchange : function(node, checked) {
						doTreeCheckChange(node, checked);
					}
				}
			});

	var p = Ext.create('Ext.Panel', {
				id : 'center_roleManager',
				title : title,
				draggable : false,
				resizable : false,
				layout : 'hbox',
				border : 0,
				width : '100%',
				height : '100%',
				items : [role_roleList, powerTree]
			});
	return p;
}
