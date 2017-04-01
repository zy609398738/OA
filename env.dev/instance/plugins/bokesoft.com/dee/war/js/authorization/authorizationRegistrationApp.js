function authorizationregistrationapppanel() {
	var tbar_items = [
			{
				text : '创建新应用',
				id : 'addApp',
				hidden : true,
				scale : 'small',
				width : 100,
				icon : 'images/add.png',
				handler : function() {
					appRegistration();
				}
			},
			{
				text : '查看应用信息',
				scale : 'small',
				width : 100,
				icon : 'images/chaxun.png',
				handler : function() {
					if (RegistrationAppPanel.selModel.getSelection() != '') {
						appInfo(RegistrationAppPanel.record);
					}
				}
			},
			{
				text : '查看该应用授权用户',
				id : 'appAuthorizationUser',
				scale : 'small',
				hidden : true,
				width : 140,
				icon : 'images/chaxun.png',
				handler : function() {
					if (RegistrationAppPanel.selModel.getSelection() != '') {
						if (RegistrationAppPanel.record.data.flag == 1) {
							Ext.Msg.alert('提示', '应用已删除！');
							return;
						}
						appAuthorizationUser(RegistrationAppPanel.record);
					}
				}
			},
			{
				text : '修改应用信息',
				id : 'updateApp',
				hidden : true,
				scale : 'small',
				width : 100,
				icon : 'images/xiugai.png',
				handler : function() {
					if (RegistrationAppPanel.selModel.getSelection() != '') {
						if (RegistrationAppPanel.record.data.flag == 1) {
							Ext.Msg.alert('提示', '应用已删除！');
							return;
						}
						updateApp(RegistrationAppPanel.record);
					}
				}
			},
			{
				text : '删除应用',
				id : 'deleteApp',
				hidden : true,
				scale : 'small',
				width : 80,
				icon : 'images/shanchu.png',
				handler : function() {
					if (RegistrationAppPanel.selModel.getSelection() != '') {
						if (RegistrationAppPanel.record.data.flag == 1) {
							Ext.Msg.alert('提示', '应用已删除！');
							return;
						}
						Ext.Msg.show( {
								title : '提示',
								msg : '确定要删除吗？',
								buttons : Ext.Msg.YESNO,
								fn : function(type) {
									if ('yes' == type) {
										Ext.Ajax.request( {
											url : 'authorizationRegistrationController.do?actionType=deleteApp',
											params : {
												data : Ext
														.encode(RegistrationAppPanel.record.data)
											},
											success : function(response) {
												var result = Ext.decode(response.responseText);
												if (result.result == true) {
													Ext.getCmp('RegistrationAppPanel').store.load();
													Ext.Msg.alert('成功','删除成功！');
												} else {
													Ext.Msg.alert('失败',result.data);
												}
											},
											failure : function(
													response) {
												Ext.Msg.alert('失败',result.data);
											}
										});
									}
								}
							})
					}
				}
			}];
	var title = '注册应用管理';
	var store = Ext	.create(
					'Ext.data.Store',
					{
						model : 'RegistrationAppModel',
						proxy : {
							type : 'ajax',
							url : 'authorizationRegistrationController.do?actionType=getAllRegistrationApp',
							reader : {
								type : 'json',
								root : 'data'
							}
						},
						sorters : [ {  
			                property : 'createtime',  
			                direction : 'DESC'  
			            } ]  ,
						autoLoad : true
					});
	var RegistrationAppPanel
= Ext.create('Ext.grid.Panel', {
		title : title,
		id : 'RegistrationAppPanel',
		width : '100%',
		height : '100%',
		selModel : Ext.create('Ext.selection.CheckboxModel', {
					mode : 'SINGLE',
					listeners : {
						select : function(m, record, index) {
							RegistrationAppPanel.record = record;
							RegistrationAppPanel.index = index;
						}
					}
				}),
//		frame : true,
		border : 1,
		tbar : {
			items : tbar_items
		},
		columns : [{
					xtype : 'rownumberer',
					text : '序号',
					sortable : false,
					menuDisabled : true,
					width : 40
				}, {
					text : '应用名称',
					dataIndex : 'appname',
					sortable : false,
					menuDisabled : true,
					flex : 1,
				}, {
                	text : 'appid',
					dataIndex : 'appid',
					sortable : false,
					menuDisabled : true,
					flex : 1,
					hidden : true,
                }, {
					text : 'APP KEY',
					dataIndex : 'appkey',
					sortable : false,
					menuDisabled : true,
					flex : 1
				}, {
					text : 'APP SECRET',
					dataIndex : 'appsecret',
					sortable : false,
					menuDisabled : true,
					flex : 2
				}, {
					text : '创建时间',
					dataIndex : 'createtime',
					renderer : Ext.util.Format.dateRenderer('Y-m-d H:i:s'),
					sortable : false,
					menuDisabled : true,
					flex : 1
				},{
					text : '最后修改时间',
					dataIndex : 'updatetime',
					renderer : Ext.util.Format.dateRenderer('Y-m-d H:i:s'),
					sortable : false,
					menuDisabled : true,
					flex : 1
				},{
					text : '提供者',
					dataIndex : 'provider',
					sortable : false,
					menuDisabled : true,
					flex : 1
				}, {
					text : '描述',
					dataIndex : 'description',
					sortable : false,
					menuDisabled : true,
					flex : 2
          		},{
          			text : '是否可用',
					dataIndex : 'flag',
					sortable : false,
					menuDisabled : true,
					flex : 1,
					renderer : function(value) {
							if ('0' == value) {
								return '<font style=color:blue>可使用</font>';
							} else if ('1' == value) {
								return '<font style=color:red>已删除</font>';
							} 
					}
          		}],
		store : store,
		listeners : {
			
	}
	});
	return RegistrationAppPanel;
}

function appRegistration() {
    var f = new Ext.form.FormPanel( {
            defaultType : 'textfield',
            labelAlign : 'right',
            labelWidth : 100,
            labelPad : 0,
            frame : true,
            width : 500,
            defaults : {
            width : 350
            },
            items : [ {
            		id : 'appname',
                    name : 'appname',
                    fieldLabel : '名称'
                },{
                	id : 'provider',
                    name: 'provider',
                    fieldLabel: '提供方'
                },{
                	id : 'description',
                    name : 'description',
                    fieldLabel : '描述',
                    xtype:'textarea'
                }]
        });
    var appregistration = function(){
    			var appname = Ext.getCmp('appname').value;
    			var provider = Ext.getCmp('provider').value;
    			var description = Ext.getCmp('description').value;
    			if (null == appname || '' == appname) {
				Ext.Msg.alert('提示', '应用名称不能为空！！！');
				return;
				}
				Ext.Ajax.request({
					url : 'authorizationRegistrationController.do?actionType=saveAuthorizationApp',
					params : {
								appname : appname,
								provider : provider,
								description : description,
							 },
					success : function(response) {
						var result = Ext.decode(response.responseText);
						if(result.result == true){
							Ext.getCmp('RegistrationAppPanel').store.load();
							Ext.Msg.alert('成功', "保存成功！");
							win.close();
						}else{
							Ext.Msg.alert('失败', result.data);
						}
					},
					failure : function(response) {
						Ext.Msg.alert('失败', response.responseText);
					}
				});
    };
    var win = new Ext.Window( {
            title : '创建新应用',
            layout : 'column',
            closeable:false,
            modal : true,
            draggable : false,
            resizable : false,
            bodyStyle : 'overflow-x:hidden; overflow-y:hidden',
            defaults : {
                border : false
            },
            items : {
                columnWidth : 1,
                items : f
            },
            buttons : [ {
                    text : '确定',
                    handler : appregistration
                },{
					text : '取消',
					handler : function() {	
						win.close();
					}
				}]
        });
    win.show();
}

function appInfo(record) {
     var f = new Ext.form.FormPanel( {
            defaultType : 'textfield',
            labelAlign : 'right',
            labelWidth : 100,
            labelPad : 0,
            frame : true,
            width : 500,
            defaults : {
            width : 350
            },
            items : [ {
                	id : 'appname',
                    name : 'appname',
                    fieldLabel : '应用名称',
                },{
                	id : 'appkey',
                    name : 'appkey',
                    fieldLabel : 'appkey',
                },{
                	id : 'appsecret',
                    name : 'appsecret',
                    fieldLabel : 'appsecret',
                },{
                	id : 'provider',
                    name : 'provider',
                    fieldLabel : '提供者',
                },{
                	id : 'description',
                    name : 'description',
                    fieldLabel : '描述',
                    xtype:'textarea',
                }]
        });
    if (record) {
		f.getForm().setValues({
					appname : record.data.appname,
					appkey : record.data.appkey,
					appsecret : record.data.appsecret,
					provider : record.data.provider,
					description : record.data.description,
				});
	}
    var win = new Ext.Window( {
            title : '应用信息',
            layout : 'column',
            closeable:false,
            draggable : false,
            modal : true,
            resizable : false,
            bodyStyle : 'overflow-x:hidden; overflow-y:hidden',
            defaults : {
                border : false
            },
            items : {
                columnWidth : 1,
                items : f
            },
            buttons : [{
					text : '关闭',
					handler : function() {	
						win.close();
					}
				}]
        });
    var reset = function() {
        f.form.reset();
    };
    win.show();
}

function appAuthorizationUser(record) {
	var store = Ext.create('Ext.data.Store', {
				model : 'AppAuthorizationUserModel',
				proxy : {
					type : 'ajax',
					url : 'authorizationRegistrationController.do?actionType=getAppAuthorizationUser',
					reader : {
						type : 'json',
						root : 'data'
					},
					extraParams : {
						appkey : record.data.appkey,
					}
				},
				autoLoad : true
			});
	var tbar_items = [{
						text : '查看该用户授权范围',
						id : 'scopeInfo',
						scale : 'small',
						width : 140,
						icon : 'images/chaxun.png',
						handler : function() {
								if (f.selModel.getSelection() != '') {
									if(f.record.data.flag == 1){
										Ext.Msg.alert('失败', '该授权已删除或已过期');
										return;
									}
									var client_id = f.record.data.appkey;
									Ext.Ajax.request({
										url : 'authorizationController.do?actionType=verifyAccesstoken',
										params : {
													client_id : client_id,
												 },
										success : function(response) {
											var result = Ext.decode(response.responseText);
											if(result.result == true){
												authorizationScope(client_id);
											}else{
												Ext.Msg.alert('失败', result.data);
											}
										},
										failure : function(response) {
											Ext.Msg.alert('失败', result.data);
										}
									});
								}
							}
					}];
    var f = Ext.create('Ext.grid.Panel', {
				id : 'appauthorizationuser',
				border : 0,
				height : '100%',
				width : '100%',
				viewConfig : {
					loadMask : false
				},
				selModel : Ext.create('Ext.selection.CheckboxModel', {
					mode : 'SINGLE',
					listeners : {
						select : function(m, record, index) {
							f.record = record;
							f.index = index;
						}
					}
				}),
				tbar : tbar_items,
				sortableColumns : false,
				columns : [{
							header : '序号',
							xtype : 'rownumberer',
							width : 30,
							sortable : false
						}, {
							header : '应用名称',
							dataIndex : 'appname',
							sortable : false,
							menuDisabled : true,
							flex : 1
						}, {
							header : '应用key',
							dataIndex : 'appkey',
							hidden : true,
							sortable : false,
							menuDisabled : true,
							flex : 1
						}, {
							header : '用户',
							dataIndex : 'username',
							sortable : false,
							menuDisabled : true,
							flex : 1
						}, {
							header : '截至日期',
							dataIndex : 'endtime',
							sortable : false,
							menuDisabled : true,
							flex : 2,
							renderer : Ext.util.Format.dateRenderer('Y-m-d H:i:s.u')
						},{
		          			text : '是否可用',
							dataIndex : 'flag',
							sortable : false,
							menuDisabled : true,
							flex : 1,
							renderer : function(value) {
									if ('0' == value) {
										return '<font style=color:blue>可使用</font>';
									} else if ('1' == value) {
										return '<font style=color:red>已删除</font>';
									} 
							}
		          		}],
				store : store
			});
    var win = new Ext.Window( {
            title : record.data.appname + '的授权用户',
            layout : 'absolute',
            width : 800,
			height : 500,
			draggable : false,
            draggable : false,
			bodyStyle : 'background:#ffffff;',
			resizable : false,
			modal : true,
            buttons : [{
					text : '关闭',
					handler : function() {	
						win.close();
					}
				}],
			items : [f]
        });
    var reset = function() {
        f.form.reset();
    };
    win.show();
}

function updateApp(record) {
    var f = new Ext.form.FormPanel( {
            defaultType : 'textfield',
            labelAlign : 'right',
            labelWidth : 100,
            labelPad : 0,
            frame : true,
            width : 500,
            defaults : {
            width : 350
            },
            items : [ {
                	id : 'provider',
                    name : 'provider',
                    fieldLabel : '提供者',
                },{
                	id : 'description',
                    name : 'description',
                    fieldLabel : '描述',
                    xtype:'textarea',
                }]
        });
    var updateapp = function(){
    			var provider = Ext.getCmp('provider').value;
    			var description = Ext.getCmp('description').value;
				Ext.Ajax.request({
					url : 'authorizationRegistrationController.do?actionType=updateApp',
					params : {
								provider : provider,
								description : description,
								data : Ext.encode(record.data)
							 },
					success : function(response) {
						var result = Ext.decode(response.responseText);
						if(result.result == true){
							Ext.getCmp('RegistrationAppPanel').store.load();
							Ext.Msg.alert('成功', "修改成功！");
							win.close();
						}else{
							Ext.Msg.alert('失败', result.data);
						}
					},
					failure : function(response) {
						Ext.Msg.alert('失败', response.responseText);
					}
					});
    };
    if (record) {
		f.getForm().setValues({
					provider : record.data.provider,
					description : record.data.description,
				});
	}
    var win = new Ext.Window( {
            title : '修改应用信息',
            layout : 'column',
            closeable:false,
            modal : true,
            draggable : false,
            resizable : false,
            bodyStyle : 'overflow-x:hidden; overflow-y:hidden',
            defaults : {
                border : false
            },
            items : {
                columnWidth : 1,
                items : f
            },
            buttons : [ {
                    text : '确定',
                    handler : updateapp
                },{
					text : '取消',
					handler : function() {	
						win.close();
					}
				}]
        });
    win.show();
}
