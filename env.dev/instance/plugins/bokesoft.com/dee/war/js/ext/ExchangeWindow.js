/**
 * 新增交换代码
 */
function windowaddExchange() {

	var win_buttonsURL = 'interfaceExchangeCenterController.do?actionType=addExchange';

	var win_buttons = [
			{
				text : '确定',
				handler : function() {
					var form_code = win_form.getValues().code;
					var form_name = win_form.getValues().name;
					var form_password = win_form.getValues().password;
					var form_isadmin = win_form.getValues().isadmin;
					var form_exstate = win_form.getValues().exstate;
					var exchange = {
						code : form_code,
						name : form_name,
						password : form_password,
						isadmin : form_isadmin,
						exstate : form_exstate,
						codeId : storeToObj(getCmp('win_form_grid_exchange_code').store)
					}
					if (form_code.length == 0 || form_name.length == 0
							|| form_password.length == 0) {
						Ext.Msg.alert('提示', '不能有空的');
						return;
					}
					if(form_code.split('&').length>1){
						Ext.Msg.alert('提示', 'code不能包含&符号');
						return;
					}
					Ext.Ajax
							.request( {
								url : 'interfaceExchangeCenterController.do?actionType=checkCode',
								params : {
									code : form_code
								},
								success : function(response) {
									if ('false' == response.responseText) {
										Ext.Msg.alert('提示', '代码或组群中已存在同名的code');
										return;
									} else {
										var exchangeJson = Ext.encode(exchange);
										Ext.Ajax
												.request( {
													url : win_buttonsURL,
													params : {
														exchange : exchangeJson
													},
													success : function(response) {
														if ('success' == response.responseText) {
															win.close();
															Ext.Msg.alert('提示',
																	'新增成功');
															getCmp('exchangeList').store
																	.load();
														} else {
															Ext.Msg
																	.alert(
																			'提示',
																			'新增失败：' + response.responseText);
														}
													}
												});

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

	var win_form_grid_CheckboxModel1 = Ext.create(
			'Ext.selection.CheckboxModel', {
				mode : 'MULTI',
				checkOnly : true
			});

	var win_form_grid_CheckboxModel2 = Ext.create(
			'Ext.selection.CheckboxModel', {
				mode : 'MULTI',
				checkOnly : true
			});
	// 代码明细
	var exchangeList_store = Ext.create('Ext.data.Store', {
		model : 'Exchange',
		data : [],
		autoLoad : true
	});
	var win_form_grid = Ext.create('Ext.grid.Panel', {
		title : '交换好友',
		id : 'win_form_grid_exchange_code',
		store : exchangeList_store,
		width : '100%',
		selModel : win_form_grid_CheckboxModel1,
		columns : [ {
            xtype: 'rownumberer',
            width: 30,
            sortable: false
        },{
			header : 'ID',
			dataIndex : 'id',
			hidden : true,
			flex : 22,
			field : 'textfield'
		}, {
			header : '代码',
			dataIndex : 'code',
			flex : 78,
			field : 'textfield'
		}, {
			header : '名称',
			dataIndex : 'name',
			flex : 78,
			field : 'textfield'
		}, {
			header : '是否是群组',
			dataIndex : 'type',
			flex : 78,
			renderer : function(value) {
				return value == true ? '是' : '否';
			},
			field : 'textfield'
		} ],
		listeners : {
			activate : function(tab) {
				win_form.currentActive = tab;
			}
		},
		height : 190
	});
	// 组群明细
	var exchangeListGroup_store = Ext.create('Ext.data.Store', {
		model : 'ExchangeGroup',
		data : []
	});
	var win_form_grid_group = Ext.create('Ext.grid.Panel', {
		title : '所属交换群组',
		disabled : true,
		store : exchangeListGroup_store,
		id : 'win_form_grid_exchange_group',
		width : '100%',
		selModel : win_form_grid_CheckboxModel2,
		columns : [ {
            xtype: 'rownumberer',
            width: 30,
            sortable: false
        },{
			header : 'ID',
			dataIndex : 'id',
			hidden : true,
			flex : 22,
			field : 'textfield'
		}, {
			header : '名称',
			dataIndex : 'name',
			flex : 78,
			field : 'textfield'
		}, {
			header : '代码',
			dataIndex : 'code',
			flex : 78,
			field : 'textfield'
		}, {
			header : '是否是群组',
			dataIndex : 'type',
			flex : 78,
			field : 'textfield'
		} ],
		listeners : {
			activate : function(tab) {
				win_form.currentActive = tab;
			}
		},
		height : 190
	});
	var p_tbar_items2 = [
			{
				text : '添加',
				scale : 'small',
				icon : 'images/add.png',
				width : 50,
				handler : function() {
					addCode('交换好友添加', win_form.currentActive, 'findDetailcode',
							-1);

				}
			},
			{
				text : '删除',
				scale : 'small',
				icon : 'images/shanchu.png',
				width : 50,
				handler : function() {
					if (win_form.currentActive.selModel.selected.length > 0) {
						win_form.currentActive.store
								.remove(win_form.currentActive.selModel
										.getSelection());
					}
				}
			} ];

	var win_form = Ext.create('Ext.form.Panel', {
		width : '100%',
		height : 400,
		x : 0,
		y : 0,
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
			fieldLabel : '代码',
			name : 'code',
			allowBlank : false
		}, {
			fieldLabel : '名称',
			name : 'name',
			allowBlank : false
		}, {
			fieldLabel : '密码',
			name : 'password',
			inputType : 'password',
			allowBlank : false
		}, {
			fieldLabel : '是否Admin',
			xtype : 'combobox',
			name : 'isadmin',
			id : 'isadmin',
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
			editable : false,
			displayField : 'displayField',
			valueField : 'value',
			queryMode : 'local',
			allowBlank : false,
			value : '否'
		}, {
			fieldLabel : '是否已激活',
			xtype : 'combobox',
			editable : false,
			name : 'exstate',
			id : 'exstate',
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
			value : '否'
		}, {
			xtype : 'tabpanel',
			id : 1111,
			tbar : p_tbar_items2,
			items : [ win_form_grid, win_form_grid_group ],
			listeners : {
				tabchange : function(tab) {
					var id = win_form.currentActive.id;
					if (id != ("win_form_grid_exchange_code")) {

					}
				}
			}
		} ]
	});
	var win = Ext.create('Ext.Window', {
		title : '新增交换代码',
		width : 800,
		height : 450,
		layout : 'absolute',
		draggable : false,
		bodyStyle : 'background:#ffffff;',
		resizable : false,
		modal : true,
		buttons : win_buttons,
		items : [ win_form ]
	});
	win.show();
}
// 交换代码和群组明细添加
function addCode(name, active, method, id) {
	var title2 = '交换中心 >> 交换代码>>' + name;
	var exchangeList_storeURL = 'interfaceExchangeCenterController.do?actionType=' + method;
	var exchange = {
		id : id,
		list : storeToObj(active.store)
	}

	var exchangeJson = Ext.encode(exchange);

	var exchangeList_store = Ext.create('Ext.data.Store', {
		model : 'Exchange',
		data : [],
		autoLoad : true
	});

	exchangeList_store.load( {
		url : exchangeList_storeURL,
		params : {
			exchange : exchangeJson
		}
	});
	var exchangeList_CheckboxModel = Ext.create('Ext.selection.CheckboxModel',
			{
				mode : 'MULTI',
				checkOnly : true
			});

	var exchangeList = Ext.create('Ext.grid.Panel', {
		height : 386,
		selModel : exchangeList_CheckboxModel,
		flex : 9,
		columns : [{
            xtype: 'rownumberer',
            width: 30,
            sortable: false
        },{
			header : 'ID',
			dataIndex : 'id',
			hidden : true,
			flex : 1
		}, {
			header : '代码',
			dataIndex : 'code',
			flex : 78
		}, {
			header : '名称',
			dataIndex : 'name',
			flex : 78
		}, {
			header : '是否是群组',
			dataIndex : 'type',
			renderer : function(value) {
				return value == true ? '是' : '否';
			},
			flex : 78
		} ],
		store : exchangeList_store
	});
	var win_form = Ext.create('Ext.form.Panel', {
		draggable : false,
		resizable : false,
		layout : 'hbox',
		border : 0,
		width : '100%',
		height : 400,
		items : [ exchangeList ]
	});
	var win_buttons = [ {
		text : '确定',
		handler : function() {
			var codeRecords = exchangeList_CheckboxModel.getSelection();
			var addToStore = active.store;
			for ( var i = 0; i < codeRecords.length; i++) {
				addToStore.add( {
					id : codeRecords[i].data.id,
					name : codeRecords[i].data.name,
					type : codeRecords[i].data.type,
					code : codeRecords[i].data.code
				});
			}
			win.close();
		}
	}, {
		text : '取消',
		handler : function() {
			win.close();
		}
	} ];
	var win = Ext.create('Ext.Window', {
		title : title2,
		width : 800,
		height : 450,
		draggable : true,
		resizable : false,
		modal : true,
		buttons : win_buttons,
		items : [ win_form ]
	});
	win.show();
}
/**
 * 修改交换代码
 */
function windowchangeExchange(record) {

	var win_buttonsURL = 'interfaceExchangeCenterController.do?actionType=changeExchange';

	var win_buttons = [
			{
				text : '确定',
				handler : function() {
					var form_id = win_form.getValues().id;
					var form_name = win_form.getValues().name;
					var form_password = win_form.getValues().password;
					var form_isadmin = win_form.getValues().isadmin;
					var form_exstate = win_form.getValues().exstate;
					var form_UUID = win_form.getValues().UUID;
					var exchange = {
						UUID : form_UUID,
						id : form_id,
						name : form_name,
						password : form_password,
						isadmin : form_isadmin,
						exstate : form_exstate,
						codeId : storeToObj(getCmp('win_form_grid_exchange_code').store)
					}
					if (form_name.length == 0 || form_password.length == 0) {
						Ext.Msg.alert('提示', '不能有空的');
						return;
					}
					var exchangeJson = Ext.encode(exchange);

					Ext.Ajax.request( {
						url : win_buttonsURL,
						params : {
							exchange : exchangeJson
						},
						success : function(response) {
							if ('success' == response.responseText) {
								win.close();
								Ext.Msg.alert('提示', '修改成功');
								getCmp('exchangeList').store.load();
							} else {
								Ext.Msg.alert('提示',
										'修改失败：' + response.responseText);
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
	var win_form_grid_CheckboxModel1 = Ext.create(
			'Ext.selection.CheckboxModel', {
				mode : 'MULTI',
				checkOnly : true
			});
	// 代码好友
	var dataid = record.data['id'];
	var exchangeList_storeURL = 'interfaceExchangeCenterController.do?actionType=findDetailcode2&dataid=' + dataid;
	var exchangeList_store = Ext.create('Ext.data.Store', {
		model : 'Exchange',
		proxy : {
			type : 'ajax',
			url : exchangeList_storeURL
		},
		autoLoad : true
	});
	var p_tbar_items2 = [
			{
				xtype : 'button',
				text : '添加',
				scale : 'small',
				icon : 'images/add.png',
				width : 50,
				handler : function() {
					var id = win_form.currentActive.id;
					addCode('交换好友添加', win_form.currentActive, 'findDetailcode',
							win_form.getValues().id);
				}
			},
			{
				xtype : 'button',
				text : '删除',
				scale : 'small',
				icon : 'images/shanchu.png',
				width : 50,
				handler : function() {
					if (win_form.currentActive.selModel.selected.length == 0) {
						Ext.Msg.alert('提示', '至少选择一个');
						return;
					}
					var id = win_form.currentActive.id;
					if (win_form.currentActive.selModel.selected.length > 0) {
						win_form.currentActive.store
								.remove(win_form.currentActive.selModel
										.getSelection());
					}
				}
			} ];
	var win_form_grid = Ext.create('Ext.grid.Panel', {
		title : '交换好友',
		id : 'win_form_grid_exchange_code',
		store : exchangeList_store,
		margin : '5 0 0 5',
		tbar : p_tbar_items2,
		width : '100%',
		selModel : win_form_grid_CheckboxModel1,
		columns : [{
            xtype: 'rownumberer',
            width: 30,
            sortable: false
        },{
			header : 'ID',
			dataIndex : 'id',
			hidden : true,
			flex : 22,
			field : 'textfield'
		}, {
			header : '代码',
			dataIndex : 'code',
			flex : 78,
			field : 'textfield'
		}, {
			header : '名称',
			dataIndex : 'name',
			flex : 78,
			field : 'textfield'
		}, {
			header : '是否是群组',
			dataIndex : 'type',
			flex : 78,
			renderer : function(value) {
				return value == true ? '是' : '否';
			},
			field : 'textfield'
		} ],
		listeners : {
			activate : function(tab) {
				win_form.currentActive = tab;
			}
		},
		height : 185
	});
	// 组群明细
	var exchangeListGroup_storeURL = 'interfaceExchangeCenterController.do?actionType=ownerGroups&dataid=' + dataid;
	var exchangeListGroup_store = Ext.create('Ext.data.Store', {
		model : 'ExchangeGroup',
		proxy : {
			type : 'ajax',
			url : exchangeListGroup_storeURL
		},
		autoLoad : true
	});
	var win_form_grid_group = Ext.create('Ext.grid.Panel', {
		title : '所属交换群组',
		store : exchangeListGroup_store,
		id : 'win_form_grid_exchange_group',
		margin : '5 0 0 5',
		width : '100%',
		autoScroll : true,
		columns : [{
            xtype: 'rownumberer',
            width: 30,
            sortable: false
        },{
			header : 'ID',
			dataIndex : 'id',
			hidden : true,
			flex : 22,
			field : 'textfield'
		}, {
			header : '代码',
			dataIndex : 'code',
			flex : 78,
			field : 'textfield'
		}, {
			header : '名称',
			dataIndex : 'name',
			flex : 78,
			field : 'textfield'
		}, {
			header : '是否是群组',
			dataIndex : 'type',
			flex : 78,
			renderer : function(value) {
				return value = '是';
			},
			field : 'textfield'
		} ],
		listeners : {
			activate : function(tab) {
				win_form.currentActive = tab;
			}
		},
		height : 185
	});

	var win_form = Ext.create('Ext.form.Panel', {
		width : '100%',
		height : '100%',
		bodyPadding : 5,
		autoScroll : false,
		margins : '20 0 0 5',
		border : 0,
		method : 'post',
		layout : 'anchor',
		defaults : {
			anchor : '100%'
		},
		defaultType : 'textfield',
		items : [ {
			fieldLabel : 'ID',
			name : 'id',
			allowBlank : false,
			hidden : true,
			readOnly : true
		}, {
			fieldLabel : '代码',
			name : 'code',
			readOnly : true,
			allowBlank : false
		}, {
			fieldLabel : '名称',
			name : 'name',
			allowBlank : false
		}, {
			fieldLabel : '密码',
			name : 'password',
			inputType : 'password',
			allowBlank : false
		}, {
			fieldLabel : '是否Admin',
			xtype : 'combobox',
			name : 'isadmin',
			id : 'isadmin',
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
			editable : false,
			displayField : 'displayField',
			valueField : 'value',
			queryMode : 'local',
			allowBlank : false,
			value : '否'
		}, {
			fieldLabel : '是否已激活',
			xtype : 'combobox',
			editable : false,
			name : 'exstate',
			id : 'exstate',
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
			value : '否'
		}, {
			fieldLabel : '交换密钥',
			name : 'UUID',
			allowBlank : false,
			readOnly : true
		}, {
			xtype : 'tabpanel',
			//tbar : p_tbar_items2,
			items : [ win_form_grid, win_form_grid_group ]
		} ]
	});

	win_form.getForm().setValues( {
		id : record.data['id'],
		code : record.data['code'],
		name : record.data['name'],
		password : record.data['password'],
		isadmin : record.data['isadmin'],
		exstate : record.data['exstate'],
		UUID : record.data['UUID']
	});

	var win = Ext.create('Ext.Window', {
		title : '修改交换代码',
		id : 'addExchange',
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
 * 新增交换组群
 */
function windowaddExchangeGroup() {
	var win_buttonsURL = 'interfaceExchangeCenterController.do?actionType=addExchangeGroup';
	var win_buttons = [
			{
				text : '确定',
				handler : function() {
					var form_code = win_form.getValues().code;
					var form_name = win_form.getValues().name;
					var form_password = win_form.getValues().password;
					var form_exstate = win_form.getValues().exstate;
					var selection = win_form_grid_CheckboxModel1.getSelection();

					var ExchangeGroup = {
						code : form_code,
						name : form_name,
						password : form_password,
						exstate : form_exstate,
						codeId : storeToObj(getCmp('win_form_grid_exchange_code').store),
						groupId : storeToObj(getCmp('win_form_grid_exchange_group').store)
					}
					if (form_code.length == 0 || form_name.length == 0
							|| form_password.length == 0) {
						Ext.Msg.alert('提示', '不能有空的');
						return;
					}
					if(form_code.split('&').length>1){
						Ext.Msg.alert('提示', 'code不能包含&符号');
						return;
					}
					Ext.Ajax
							.request( {
								url : 'interfaceExchangeCenterController.do?actionType=checkCode',
								params : {
									code : form_code
								},
								success : function(response) {
									if ('false' == response.responseText) {
										Ext.Msg.alert('提示', '代码或组群中已存在同名的code');
										return;
									} else {
										var ExchangeGroupJson = Ext
												.encode(ExchangeGroup);

										Ext.Ajax
												.request( {
													url : win_buttonsURL,
													params : {
														ExchangeGroup : ExchangeGroupJson
													},
													success : function(response) {
														if ('success' == response.responseText) {
															win.close();
															Ext.Msg.alert('提示',
																	'新增成功');
															getCmp('exchangeListGroup').store
																	.load();
														} else {
															Ext.Msg
																	.alert(
																			'提示',
																			'新增失败：' + response.responseText);
														}
													}
												});

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
	var win_form_grid_CheckboxModel1 = Ext.create(
			'Ext.selection.CheckboxModel', {
				mode : 'MULTI',
				checkOnly : true
			});

	var win_form_grid_CheckboxModel2 = Ext.create(
			'Ext.selection.CheckboxModel', {
				mode : 'MULTI',
				checkOnly : true
			});
	// 代码明细
	var exchangeList_storeURL = 'interfaceExchangeCenterController.do?actionType=findexchange';
	var exchangeList_store = Ext.create('Ext.data.Store', {
		model : 'Exchange',
		data : [],
		autoLoad : true
	});
	var win_form_grid = Ext.create('Ext.grid.Panel', {
		title : '交换代码成员',
		id : 'win_form_grid_exchange_code',
		store : exchangeList_store,
		margin : '5 0 0 5',
		width : '100%',
		selModel : win_form_grid_CheckboxModel1,
		columns : [{
            xtype: 'rownumberer',
            width: 30,
            sortable: false
        },{
			header : 'ID',
			dataIndex : 'id',
			hidden : true,
			flex : 22,
			field : 'textfield'
		}, {
			header : '代码',
			dataIndex : 'code',
			flex : 78,
			field : 'textfield'
		}, {
			header : '名称',
			dataIndex : 'name',
			flex : 78,
			field : 'textfield'
		}, {
			header : '是否是群组',
			dataIndex : 'type',
			flex : 78,
			renderer : function(value) {
				return value == true ? '是' : '否';
			},
			field : 'textfield'
		} ],
		listeners : {
			activate : function(tab) {
				win_form.currentActive = tab;
			}
		},
		height : 210
	});
	// 组群明细
	var exchangeListGroup_storeURL = 'interfaceExchangeCenterController.do?actionType=findDetailgroup2';
	var exchangeListGroup_store = Ext.create('Ext.data.Store', {
		model : 'ExchangeGroup',
		data : [],
		autoLoad : true
	});
	var win_form_grid_group = Ext.create('Ext.grid.Panel', {
		title : '交换好友',
		store : exchangeListGroup_store,
		id : 'win_form_grid_exchange_group',
		margin : '5 0 0 5',
		width : '100%',
		selModel : win_form_grid_CheckboxModel2,
		columns : [ {
            xtype: 'rownumberer',
            width: 30,
            sortable: false
        },{
			header : 'ID',
			dataIndex : 'id',
			hidden : true,
			flex : 22,
			field : 'textfield'
		}, {
			header : '代码',
			dataIndex : 'code',
			flex : 78,
			field : 'textfield'
		}, {
			header : '名称',
			dataIndex : 'name',
			flex : 78,
			field : 'textfield'
		}, {
			header : '是否是群组',
			dataIndex : 'type',
			flex : 78,
			renderer : function(value) {
				return value == true ? '是' : '否';
			},
			field : 'textfield'
		} ],
		listeners : {
			activate : function(tab) {
				win_form.currentActive = tab;
			}
		},
		height : 210
	});
	var p_tbar_items2 = [
			{
				text : '添加',
				scale : 'small',
				icon : 'images/add.png',
				width : 50,
				handler : function() {
					var id = win_form.currentActive.id;
					if (id == ("win_form_grid_exchange_code")) {
						addCode('交换代码成员添加', win_form.currentActive,
								'findexchange', -1);
					} else {
						addCode('交换好友添加', win_form.currentActive,
								'findDetailcode', -1);
					}
				}
			},
			{
				text : '删除',
				scale : 'small',
				icon : 'images/shanchu.png',
				width : 50,
				handler : function() {
					if (win_form.currentActive.selModel.selected.length > 0) {
						win_form.currentActive.store
								.remove(win_form.currentActive.selModel
										.getSelection());
					} else {
						Ext.Msg.alert('提示', '至少选择一个');
						return;
					}
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
			fieldLabel : '代码',
			name : 'code',
			allowBlank : false
		}, {
			fieldLabel : '名称',
			name : 'name',
			allowBlank : false
		}, {
			fieldLabel : '密码',
			name : 'password',
			inputType : 'password',
			allowBlank : false
		}, {
			fieldLabel : '是否已激活',
			xtype : 'combobox',
			editable : false,
			name : 'exstate',
			id : 'exstate',
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
			value : '否'
		}, {
			xtype : 'tabpanel',
			tbar : p_tbar_items2,
			items : [ win_form_grid, win_form_grid_group ]
		} ]
	});

	var win = Ext.create('Ext.Window', {
		title : '新增交换群组',
		id : 'addExchange',
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
 * 修改交换组群
 */
function windowchangeExchangeGroup(record) {

	var win_buttonsURL = 'interfaceExchangeCenterController.do?actionType=changeExchangeGroup';

	var win_buttons = [
			{
				text : '确定',
				handler : function() {
					var form_id = win_form.getValues().id;
					var form_name = win_form.getValues().name;
					var form_password = win_form.getValues().password;
					var form_exstate = win_form.getValues().exstate;
					var ExchangeGroup = {
						id : form_id,
						name : form_name,
						password : form_password,
						exstate : form_exstate,
						codeId : storeToObj(getCmp('win_form_grid_exchange_code').store),
						groupId : storeToObj(getCmp('win_form_grid_exchange_group').store)
					}
					if (form_name.length == 0 || form_password.length == 0) {
						Ext.Msg.alert('提示', '不能有空的');
						return;
					}
					var exchangeJson = Ext.encode(ExchangeGroup);
					Ext.Ajax.request( {
						url : win_buttonsURL,
						params : {
							ExchangeGroup : exchangeJson
						},
						success : function(response) {
							if ('success' == response.responseText) {
								win.close();
								Ext.Msg.alert('提示', '修改成功');
								getCmp('exchangeListGroup').store.load();
							} else {
								Ext.Msg.alert('提示',
										'修改失败：' + response.responseText);
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
	var win_form_grid_CheckboxModel1 = Ext.create(
			'Ext.selection.CheckboxModel', {
				mode : 'MULTI',
				checkOnly : true
			});
	var win_form_grid_CheckboxModel2 = Ext.create(
			'Ext.selection.CheckboxModel', {
				mode : 'MULTI',
				checkOnly : true
			});
	// 成员
	var dataid = record.data['id'];
	var exchangeList_storeURL = 'interfaceExchangeCenterController.do?actionType=findGroupCell&dataid=' + dataid;
	var exchangeList_store = Ext.create('Ext.data.Store', {
		model : 'Exchange',
		proxy : {
			type : 'ajax',
			url : exchangeList_storeURL
		},
		autoLoad : true
	});
	var win_form_grid = Ext.create('Ext.grid.Panel', {
		title : '交换代码成员',
		id : 'win_form_grid_exchange_code',
		store : exchangeList_store,
		margin : '5 0 0 5',
		width : '100%',
		selModel : win_form_grid_CheckboxModel1,
		columns : [ {
            xtype: 'rownumberer',
            width: 30,
            sortable: false
        },{
			header : 'ID',
			dataIndex : 'id',
			hidden : true,
			flex : 22,
			field : 'textfield'
		}, {
			header : '代码',
			dataIndex : 'code',
			flex : 78,
			field : 'textfield'
		}, {
			header : '名称',
			dataIndex : 'name',
			flex : 78,
			field : 'textfield'
		}, {
			header : '是否是群组',
			dataIndex : 'type',
			flex : 78,
			renderer : function(value) {
				return value = '否';
			},
			field : 'textfield'
		} ],
		listeners : {
			activate : function(tab) {
				win_form.currentActive = tab;
			}
		},
		height : 185
	});
	// 交换好友
	var exchangeListGroup_storeURL = 'interfaceExchangeCenterController.do?actionType=findDetailcode2&dataid=' + dataid;
	var exchangeListGroup_store = Ext.create('Ext.data.Store', {
		model : 'ExchangeGroup',

		proxy : {
			type : 'ajax',
			url : exchangeListGroup_storeURL
		},
		autoLoad : true
	});
	var win_form_grid_group = Ext.create('Ext.grid.Panel', {
		title : '交换好友',
		store : exchangeListGroup_store,
		id : 'win_form_grid_exchange_group',
		margin : '5 0 0 5',
		width : '100%',
		selModel : win_form_grid_CheckboxModel2,
		columns : [{
            xtype: 'rownumberer',
            width: 30,
            sortable: false
        },{
			header : 'ID',
			dataIndex : 'id',
			hidden : true,
			flex : 22,
			field : 'textfield'
		}, {
			header : '代码',
			dataIndex : 'code',
			flex : 78,
			field : 'textfield'
		}, {
			header : '名称',
			dataIndex : 'name',
			flex : 78,
			field : 'textfield'
		}, {
			header : '是否是群组',
			dataIndex : 'type',
			flex : 78,
			renderer : function(value) {
				return value == true ? '是' : '否';
			},
			field : 'textfield'
		} ],
		listeners : {
			activate : function(tab) {
				win_form.currentActive = tab;
			}
		},
		height : 185
	});
	var p_tbar_items2 = [
			{
				text : '添加',
				scale : 'small',
				icon : 'images/add.png',
				width : 50,
				handler : function() {
					var id = win_form.currentActive.id;
					if (id == ("win_form_grid_exchange_code")) {
						addCode('交换代码成员添加', win_form.currentActive,
								'findexchange', win_form.getValues().id);
					} else {
						addCode('交换好友添加', win_form.currentActive,
								'findDetailcode', win_form.getValues().id);
					}
				}
			},
			{
				text : '删除',
				scale : 'small',
				icon : 'images/shanchu.png',
				width : 50,
				handler : function() {
					if (win_form.currentActive.selModel.selected.length > 0) {
						win_form.currentActive.store
								.remove(win_form.currentActive.selModel
										.getSelection());
					} else {
						Ext.Msg.alert('提示', '至少选择一个');
						return;
					}
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
			fieldLabel : 'ID',
			name : 'id',
			allowBlank : false,
			hidden : true,
			readOnly : true
		}, {
			fieldLabel : '代码',
			name : 'code',
			readOnly : true,
			allowBlank : false
		}, {
			fieldLabel : '名称',
			name : 'name',
			allowBlank : false
		}, {
			fieldLabel : '密码',
			name : 'password',
			inputType : 'password',
			allowBlank : false
		}, {
			fieldLabel : '是否已激活',
			xtype : 'combobox',
			editable : false,
			name : 'exstate',
			id : 'exstate',
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
			value : '否'
		}, {
			fieldLabel : '交换密钥',
			name : 'UUID',
			allowBlank : false,
			readOnly : true
		}, {
			xtype : 'tabpanel',
			tbar : p_tbar_items2,
			items : [ win_form_grid, win_form_grid_group ]
		} ]
	});

	win_form.getForm().setValues( {
		id : record.data['id'],
		code : record.data['code'],
		name : record.data['name'],
		password : record.data['password'],
		exstate : record.data['exstate'],
		UUID : record.data['UUID']
	});

	var win = Ext.create('Ext.Window', {
		title : '修改交换群组',
		id : 'addExchange',
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
 * 新增ActionType
 */
function windowaddExchangeActionType() {
	var win_buttonsURL = 'interfaceExchangeCenterController.do?actionType=addExchangeActionType';
	var win_buttons = [ {
		text : '确定',
		handler : function() {
			var form_description = win_form.getValues().description;
			var form_actiontype = win_form.getValues().actiontype;
			var form_type = win_form.getValues().type;

			var ExchangeActionType = {
				description : form_description,
				actiontype : form_actiontype,
				type : form_type
			}
			if (form_actiontype.length == 0) {
				Ext.Msg.alert('提示', 'actiontype不能有空的');
				return;
			}
			if (form_type.length == 0) {
				Ext.Msg.alert('提示', 'Number不能为空的');
				return;
			}
			var hasexist = 0;
			getCmp('exchangeActionType').store.each(function(model) {
				if (form_actiontype == (model.get('actiontype'))) {
					hasexist = 1;
				}
			});
			if (hasexist == 1) {
				Ext.Msg.alert('提示', 'Actiontype已存在');
				return;
			}
			var exchangeJson = Ext.encode(ExchangeActionType);

			Ext.Ajax.request( {
				url : win_buttonsURL,
				params : {
					ExchangeActionType : exchangeJson
				},
				success : function(response) {
					if ('success' == response.responseText) {
						win.close();
						Ext.Msg.alert('提示', '新增成功');
						getCmp('exchangeActionType').store.load();
					} else {
						Ext.Msg.alert('提示', '新增失败：' + response.responseText);
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
	var win_form_grid_CheckboxModel = Ext.create('Ext.selection.CheckboxModel',
			{
				mode : 'MULTI',
				checkOnly : true
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
			fieldLabel : 'ActionType',
			name : 'actiontype',
			allowBlank : false
		}, {
			fieldLabel : '最大处理数',
			xtype : 'numberfield',
			value : 1000,
			editable : false,
			step : 100,
			minValue : 100,
			maxValue : 3000,
			name : 'type',
			emptyText : '不能为空',
			allowBlank : false
		}, {
			xtype : 'textareafield',
			fieldLabel : '描述',
			name : 'description',
			height : 300
		} ]
	});
	var win = Ext.create('Ext.Window', {
		title : '新增ActionType',
		id : 'addExchangeActionType',
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
 * 修改ActionType
 */
function windowchangeExchangeActionType(record) {
	var win_buttonsURL = 'interfaceExchangeCenterController.do?actionType=changeExchangeActionType';
	var win_buttons = [
			{
				text : '确定',
				handler : function() {
					var form_description = win_form.getValues().description;
					var form_actiontype = win_form.getValues().actiontype;
					var form_type = win_form.getValues().type;
					var ExchangeActionType = {
						id : record.data['id'],
						description : form_description,
						actiontype : form_actiontype,
						type : form_type
					}
					if (form_actiontype.length == 0) {
						Ext.Msg.alert('提示', '不能有空的');
						return;
					}
					if (form_type.length == 0) {
						Ext.Msg.alert('提示', 'Number不能为空的');
						return;
					}
					var hasexist = 0;
					getCmp('exchangeActionType').store.each(function(model) {
						if (form_actiontype == (model.get('actiontype'))
								&& record.data['id'] != model.get('id')) {
							hasexist = 1;
						}
					});
					if (hasexist == 1) {
						Ext.Msg.alert('提示', 'Actiontype已存在');
						return;
					}
					var exchangeJson = Ext.encode(ExchangeActionType);

					Ext.Ajax.request( {
						url : win_buttonsURL,
						params : {
							ExchangeActionType : exchangeJson
						},
						success : function(response) {
							if ('success' == response.responseText) {
								win.close();
								Ext.Msg.alert('提示', '修改成功');
								getCmp('exchangeActionType').store.load();
							} else {
								Ext.Msg.alert('提示',
										'修改失败：' + response.responseText);
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
			fieldLabel : 'ActionType',
			name : 'actiontype',
			allowBlank : false
		}, {
			fieldLabel : '最大处理数',
			xtype : 'numberfield',
			step : 100,
			editable : false,
			minValue : 100,
			maxValue : 3000,
			name : 'type',
			emptyText : '不能为空',
			allowBlank : false
		}, {
			xtype : 'textareafield',
			fieldLabel : '描述',
			name : 'description',
			height : 300
		} ]
	});
	win_form.getForm().setValues( {
		description : record.data['description'],
		actiontype : record.data['actiontype'],
		type : record.data['type']
	});

	var win = Ext.create('Ext.Window', {
		title : '修改ActionType',
		id : 'addExchangeActionType',
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
 * 查看bizdata
 * 
 */
function windowshowBizdata(bizdataID,isEvent) {
	var url='interfaceExchangeCenterController.do?actionType=getBizdataByID&bizdataID='+bizdataID+'&isEvent='+isEvent;
	var bizdata= ajaxSyncCall(url,null,null);
	var win_buttons = [ {
		text : '确定',
		handler : function() {
			win.close();
		}
	} ];
	var win = Ext.create('Ext.Window', {
		title : 'bizdata',
		width : 800,
		height : 450,
		layout : 'fit',
		draggable : false,
		buttons : win_buttons,
		bodyStyle : 'background:#ffffff;',
		resizable : false,
		modal : true,
		items : [ {
			xtype : 'textareafield',
			width : 760,
			height : 400,
			hideLabel : true,
			value : bizdata,
			readOnly : true,
			autoScroll : true
		} ]
	});
	win.show();
}
