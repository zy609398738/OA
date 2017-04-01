/**
 * 创建和更新权限管理[operator]的Window
 */
function windowSaveOrUpdateOperator(record) {

	var win_buttonsURL = 'interfacePermissionManagerController.do?actionType=saveOrUpdateOperator';

	var win_buttons = [
			{
				text : '确定',
				handler : function() {
					var form_id = win_form.getValues().id;
					var form_loginname = win_form.getValues().loginname;
					var form_username = win_form.getValues().username;
					var form_password = win_form.getValues().password;
					var form_description = win_form.getValues().description;
					var form_isAdmin = win_form.getValues().isAdmin;
					if (validateStringIsNull(form_loginname)) {
						Ext.Msg.alert('提示','用户名不能为空');
						return;
					}
					if (form_loginname == 'bokedee') {
						Ext.Msg.alert('提示','用户名不可以使用bokedee');
						return;
					}
					if (validateStringIsNull(form_username)) {
						Ext.Msg.alert('提示','姓名不能为空');
						return;
					}
					if (validateStringIsNull(form_password)
							|| form_password.length < 6) {
						Ext.Msg.alert('提示','密码长度不能小于6位');
						return;
					}

					if (form_password != win_form.getValues().confirmPassword) {
						Ext.Msg.alert('提示','两次密码输入不一致');
						return;
					}
					var selection = win_form_grid_CheckboxModel.getSelection();
					var roles = [];
					for ( var i in selection) {
						roles[i] = selection[i].data.id;
					}
					var operator = {
						password : form_password,
						username : form_username,
						loginname : form_loginname,
						description : form_description,
						id : form_id,
						createDate : win_form.getValues().createDate,
						isAdmin : form_isAdmin,
						roles : roles
					}

					var operatorJson = Ext.encode(operator);

					Ext.Ajax.request( {
						url : win_buttonsURL,
						params : {
							operator : operatorJson
						},
						success : function(response) {
							if ('success' == response.responseText) {
								win.close();
								//Ext.Msg.alert('提示','保存成功');
								Ext.bokedee.msg('保存信息', 1000,'保存成功');
								getCmp('center_operatorList').store.load();
								getCmp('center_roleList').store.removeAll();
							} else {
								Ext.Msg.alert('提示','保存失败：' + response.responseText);
							}
						}
					});
				}
			}, {
				text : '取消',
				handler : function() {
					win.close();
				}
			} ];

	var win_form_grid_storeURL = 'interfacePermissionManagerController.do?actionType=findRole';

	var win_form_grid_store = Ext.create('Ext.data.Store', {
		model : 'role',
		proxy : {
			type : 'ajax',
			url : win_form_grid_storeURL
		},
		autoLoad : true,
		listeners : {
			load : function(me) {
				if (record) {
					var roles = record.raw.roles;
					var forSelect = [];
					var k = 0;
					for ( var i in roles) {
						for ( var j = 0; j < me.getCount(); j++) {
							if (roles[i] == me.getAt(j).data.id) {
								forSelect[k] = me.getAt(j);
								k++;
								break;
							}
						}
					}
					win_form_grid_CheckboxModel.select(forSelect);
				}
			}
		}
	});

	var win_form_grid_CheckboxModel = Ext.create('Ext.selection.CheckboxModel',
			{
				mode : 'MULTI',
				checkOnly : true
			});

	var win_form_grid = Ext.create('Ext.grid.Panel', {
		title : '分配角色',
		store : win_form_grid_store,
		autoScroll:true,
		selModel : win_form_grid_CheckboxModel,
		columns : [ {
			header : '角色名称',
			dataIndex : 'rolename',
			flex : 22,
			field : 'textfield'
		}, {
			header : '角色描述',
			dataIndex : 'description',
			flex : 78,
			field : 'textfield'
		} ],
		height : 250
	});

	var win_form = Ext.create('Ext.form.Panel', {
		width : '100%',
		height : '100%',
		bodyPadding : 5,
		autoScroll : true,
		margins : '20 0 0 5',
		border : 0,
		method : 'post',
		layout : 'anchor',
		defaults : {
			anchor : '100%'
		},
		defaultType : 'textfield',
		items : [ {
			name : 'id',
			hidden : true
		}, {
			name : 'createDate',
			hidden : true
		}, {
			fieldLabel : '用户名'+needToFill,
			name : 'loginname',
			allowBlank : false
		}, {
			xtype : 'fieldcontainer',
			id : 'permission_operatorPassword',
			labelWidth : 100,
			items : [ {
				xtype : 'textfield',
				fieldLabel : '密码'+needToFill,
				name : 'password',
				inputType : 'password',
				width : 778,
				allowBlank : false
			}, {
				xtype : 'textfield',
				fieldLabel : '确认密码'+needToFill,
				name : 'confirmPassword',
				width : 778,
				inputType : 'password',
				allowBlank : false
			} ]
		}, {
			fieldLabel : '姓名'+needToFill,
			name : 'username',
			allowBlank : false
		}, {
			fieldLabel : '是否管理员'+needToFill,
			xtype : 'combobox',
			editable : false,
			name : 'isAdmin',
			id : 'permission_isAdmin',
			store : Ext.create('Ext.data.Store', {
				model : 'Combox',
				data : [ {
					value : true,
					displayField : '是'
				}, {
					value : false,
					displayField : '否'
				} ]
			}),
			displayField : 'displayField',
			valueField : 'value',
			queryMode : 'local',
			allowBlank : false,
			value : false,
			width : 778,
			listeners : {
				select : function(combobox, record) {
					if (record[0].data.value == true) {
						win_form_grid.hide();
					} else {
						win_form_grid.show();
					}
				}
			}
		}, {
			xtype : 'textarea',
			fieldLabel : '描述',
			name : 'description',
			allowBlank : true,
			height : 45
		}, win_form_grid ]
	});
	if (record) {
		win_form.getForm().setValues( {
			loginname : record.data['loginname'],
			id : record.data['id'],
			description : record.data['description'],
			createDate : record.data['createDate'],
			username : record.raw['username'],
			password : record.raw['password'],
			confirmPassword : record.raw['password']
		});
		getCmp('permission_isAdmin').select(record.raw['isAdmin']);
		if (record.raw['isAdmin'] == true) {
			win_form_grid.hide();
		}
		getCmp('permission_operatorPassword').hide();
	}

	var win = Ext.create('Ext.Window', {
		title : '操作员管理',
		id : 'saveOrUpdateOperator',
		width : 800,
		height : 450,
		draggable : false,
		autoScroll : true,
		resizable : false,
		modal : true,
		buttons : win_buttons,
		items : [ win_form ]
	});
	win.show();
}

/**
 * 创建和更新角色管理[role]的Window
 * @param {Object} record
 * @return {TypeName} 
 */

function windowSaveOrUpdateRole(record) {

	var win_buttonsURL = 'interfacePermissionManagerController.do?actionType=saveOrUpdateRole';

	var win_buttons = [ {
		text : '确定',
		handler : function() {
			var form_id = win_form.getValues().id;
			var form_rolename = win_form.getValues().rolename;
			var form_description = win_form.getValues().description;
			if (validateStringIsNull(form_rolename)) {
				Ext.Msg.alert('提示','用户名不能为空');
				return;
			}
			var role = {
				id : form_id,
				rolename : form_rolename,
				description : form_description
			}
			var roleJson = Ext.encode(role);
			Ext.Ajax.request( {
				url : win_buttonsURL,
				params : {
					role : roleJson
				},
				success : function(response) {
					if ('success' == response.responseText) {
						win.close();
						//Ext.Msg.alert('提示','保存成功');
						Ext.bokedee.msg('保存信息', 1000,'保存成功');
						getCmp('center_roleList1').store.load();
					} else {
						Ext.Msg.alert('提示','保存失败：' + response.responseText);
					}
				}
			});
		}
	}, {
		text : '取消',
		handler : function() {
			win.close();
		}
	} ];

	var win_form = Ext.create('Ext.form.Panel', {
		width : '100%',
		height : '100%',
		bodyPadding : 5,
		autoScroll : true,
		margins : '20 0 0 5',
		border : 0,
		method : 'post',
		layout : 'anchor',
		defaults : {
			anchor : '100%'
		},
		defaultType : 'textfield',
		items : [ {
			name : 'id',
			hidden : true
		}, {
			fieldLabel : '角色名称'+needToFill,
			name : 'rolename',
			allowBlank : false
		}, {
			xtype : 'textarea',
			fieldLabel : '描述',
			name : 'description',
			allowBlank : true,
			height : 100
		} ]
	});
	if (record) {
		win_form.getForm().setValues( {
			id : record.data['id'],
			description : record.data['description'],
			rolename : record.raw['rolename']
		});
	}

	var win = Ext.create('Ext.Window', {
		title : '角色管理',
		id : 'saveOrUpdateRole',
		width : 800,
		height : 450,
		draggable : false,
		autoScroll : true,
		resizable : false,
		modal : true,
		buttons : win_buttons,
		items : [ win_form ]
	});
	win.show();
}

/**
 * 修改操作员密码
 * @param {Object} record
 * @return {TypeName} 
 */
function windowAlterOperatorPassword(record) {

	var win_buttonsURL = 'interfacePermissionManagerController.do?actionType=alterOperatorPassword';

	var win_buttons = [
			{
				text : '确定',
				handler : function() {
					var form_id = win_form.getValues().id;
					var form_oldPassword = win_form.getValues().oldPassword;
					var form_password = win_form.getValues().password;
					if (validateStringIsNull(form_password)
							|| form_password.length < 6) {
						Ext.Msg.alert('提示','密码长度不能小于6位');
						return;
					}
					if (form_password != win_form.getValues().confirmPassword) {
						Ext.Msg.alert('提示','两次密码输入不一致');
						return;
					}
					Ext.Ajax.request( {
						url : win_buttonsURL,
						params : {
							id : form_id,
							oldPassword : form_oldPassword,
							newPassword : form_password
						},
						success : function(response) {
							if ('修改成功' == response.responseText) {
								Ext.Msg.alert('提示','修改成功');
								win.close();
							} else {
								Ext.Msg.alert('提示','修改失败：' + response.responseText);
							}
						}
					});
				}
			}, {
				text : '取消',
				handler : function() {
					win.close();
				}
			} ];

	var win_form = Ext.create('Ext.form.Panel', {
		width : '100%',
		height : '100%',
		bodyPadding : 5,
		autoScroll : true,
		margins : '20 0 0 5',
		border : 0,
		method : 'post',
		layout : 'anchor',
		defaults : {
			anchor : '100%'
		},
		defaultType : 'textfield',
		items : [ {
			name : 'id',
			hidden : true
		}, {
			xtype : 'textfield',
			fieldLabel : '原始密码',
			name : 'oldPassword',
			inputType : 'password',
			width : 778,
			allowBlank : false
		}, {
			xtype : 'textfield',
			fieldLabel : '密码',
			name : 'password',
			inputType : 'password',
			width : 778,
			allowBlank : false
		}, {
			xtype : 'textfield',
			fieldLabel : '确认密码',
			name : 'confirmPassword',
			width : 778,
			inputType : 'password',
			allowBlank : false
		} ]
	});
	win_form.getForm().setValues( {
		id : record.data['id']
	});

	var win = Ext.create('Ext.Window', {
		title : '修改密码',
		id : 'alterOperatorPassword',
		width : 800,
		height : 450,
		draggable : false,
		autoScroll : true,
		resizable : false,
		modal : true,
		buttons : win_buttons,
		items : [ win_form ]
	});
	win.show();
}
