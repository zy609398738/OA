function authorizationuserpanel() {
	var tbar_items = [{
						text : '新增用户',
						id : 'addUser',
						hidden : true,
						scale : 'small',
						width : 100,
						icon : 'images/add.png',
						handler : function() {
							userRegistration();
						}
					},{
						text : '查看用户信息',
						scale : 'small',
						width : 100,
						icon : 'images/chakan.png',
						handler : function() {
							if (userInfoPanel.selModel.getSelection() != '') {
								userInfo(userInfoPanel.record);
							}
						}
					},{
						text : '修改用户信息',
						id : 'changeUserInfo',
						hidden : true,
						scale : 'small',
						width : 100,
						icon : 'images/xiugai.png',
						handler : function() {
							if (userInfoPanel.selModel.getSelection() != '') {
								if (userInfoPanel.record.data.flag == 1) {
									Ext.Msg.alert('提示', '用户已删除！');
									return;
								}
								changeInfo(userInfoPanel.record);
							}
						}
					},{
						text : '修改密码',
						id : 'changePassword',
						hidden : true,
						scale : 'small',
						width : 100,
						icon : 'images/xiugaimima.png',
						handler : function() {
							if (userInfoPanel.selModel.getSelection() != '') {
								if (userInfoPanel.record.data.flag == 1) {
									Ext.Msg.alert('提示', '用户已删除！');
									return;
								}
								changePassword(userInfoPanel.record);
							}
						}
					},{
						text : '重置密码',
						id : 'resetPassword',
						hidden : true,
						scale : 'small',
						width : 100,
						icon : 'images/xiugaimima.png',
						handler : function() {
							if (userInfoPanel.selModel.getSelection() != '') {
								if (userInfoPanel.record.data.flag == 1) {
									Ext.Msg.alert('提示', '用户已删除！');
									return;
								}
								resetPassword(userInfoPanel.record);
							}
						}
					},{
						text : '修改用户等级',
						id : 'changeGrade',
						hidden : true,
						scale : 'small',
						width : 100,
						icon : 'images/xiugaimima.png',
						handler : function() {
							if (userInfoPanel.selModel.getSelection() != '') {
								if (userInfoPanel.record.data.flag == 1) {
									Ext.Msg.alert('提示', '用户已删除！');
									return;
								}
								if (userInfoPanel.record.data.userid == 10000) {
									Ext.Msg.alert('提示', '默认管理员用户等级不可更改！');
									return;
								}
								changeGrade(userInfoPanel.record);
							}
						}
					},{
						text : '删除用户',
						id : 'deleteUser',
						hidden : true,
						scale : 'small',
						width : 100,
						icon : 'images/shanchu.png',
						handler : function() {
							if (userInfoPanel.selModel.getSelection() != '') {
								if (userInfoPanel.record.data.flag == 1) {
									Ext.Msg.alert('提示', '用户已删除！');
									return;
								}
								if (userInfoPanel.record.data.userid == 10000) {
									Ext.Msg.alert('提示', '默认管理员用户不可删除！');
									return;
								}
								Ext.Msg.show( {
											title : '提示',
											msg : '确定要删除吗？',
											buttons : Ext.Msg.YESNO,
											fn : function(type) {
												if ('yes' == type) {
													Ext.Ajax.request( {
																url : 'authorizationRegistrationController.do?actionType=deleteUser',
																params : {
																	data : Ext.encode(userInfoPanel.record.data)
																},
																success : function(response) {
																	var result = Ext.decode(response.responseText);
																	if (result.result == true) {
																		Ext.getCmp('userInfoPanel').store.load();
																		Ext.Msg.alert('成功','删除成功！');
																	} else {
																		Ext.Msg.alert('失败',result.data);
																	}
																},
																failure : function(response) {
																	Ext.Msg.alert('失败',result.data);
																}
														});
												}
											}
										})
							}
						}
					}];
	var title = '用户信息';
	var store= Ext.create('Ext.data.Store', {
				model : 'UserInfoModel',
				proxy : {
					type : 'ajax',
					url : 'authorizationRegistrationController.do?actionType=getUserInfo',
					reader : {
						type : 'json',
						root : 'data'
					},
				},
				autoLoad : true
			});
	var userInfoPanel = Ext.create('Ext.grid.Panel', {
		title : title,
		id : 'userInfoPanel',
		width : '100%',
		height : '100%',
		defaults : {
			split : true
		},
		border : 1,
		method : 'post',
		defaultType : 'textfield',
		selModel : Ext.create('Ext.selection.CheckboxModel', {
					mode : 'SINGLE',
					listeners : {
						select : function(m, record, index) {
							userInfoPanel.record = record;
							userInfoPanel.index = index;
						}
					}
				}),
		tbar : tbar_items,
		columns : [{
					xtype : 'rownumberer',
					text : '序号',
					sortable : false,
					menuDisabled : true,
					width : 40
				}, {
					text : '用户名',
					dataIndex : 'username',
					sortable : false,
					menuDisabled : true,
					flex : 1
				},{
					text : '用户id',
					dataIndex : 'userid',
					sortable : false,
					menuDisabled : true,
					hidden : true,
					flex : 1
				},{
					text : '名称',
					dataIndex : 'name',
					sortable : false,
					menuDisabled : true,
					flex : 1
				},{
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
					text : '权限等级',
					dataIndex : 'grade',
					sortable : false,
					menuDisabled : true,
					flex : 1
				},{
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
	});
	return userInfoPanel;
	
}

function userRegistration() {
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
            		id : 'username',
                    name : 'username',
                    fieldLabel : '用户名'
                },{
                	id : 'password',
                    name : 'password',
                    fieldLabel : '密码',
                    inputType : 'password',
                },{
                	id : 'repassword',
                    name : 'repassword',
                    fieldLabel : '确认密码',
                    inputType: 'password'
                },{
                	id : 'name',
                    name : 'name',
                    fieldLabel : '名称',
                },{
                	id : 'description',
                    name : 'description',
                    fieldLabel : '描述',
                    xtype:'textarea',
                }]
        });
    var userregister = function(){
    			var username = Ext.getCmp('username').value;
    			var password = Ext.getCmp('password').value;
    			var repassword = Ext.getCmp('repassword').value;
    			var name = Ext.getCmp('name').value;
    			var description = Ext.getCmp('description').value;
    			if (null == username || '' == username) {
				Ext.Msg.alert('提示', '用户名不能为空！！！');
				return;
				}
    			if (null == password || '' == password) {
				Ext.Msg.alert('提示', '密码不能为空！！！');
				return;
				}
    			if (password.length<6) {
				Ext.Msg.alert('提示', '密码至少需要6位！');
				return;
				}
    			if (repassword != password) {
				Ext.Msg.alert('提示', '两次输入的密码不相同！！！');
				return;
				}
    			if (null == repassword || '' == repassword) {
				Ext.Msg.alert('提示', '请再次输入密码！！！');
				return;
				}
				Ext.Ajax.request({
					url : 'authorizationRegistrationController.do?actionType=saveAuthorizationUser',
					params : {
								username : username,
								password : password,
								name : name,
								description : description
							 },
					success : function(response) {
						var result = Ext.decode(response.responseText);
						if(result.result == true){
							Ext.getCmp('userInfoPanel').store.load();
							Ext.Msg.alert('成功', "新增成功！");
							win.close();
//							Ext.bokedee.msg('保存信息', 1000,'保存成功');
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
            title : '新增用户',
            layout : 'column',
//            closable:false,
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
            buttons : [ {
                    text : '确定',
                    handler : userregister
                },{
					text : '取消',
					handler : function() {	
						win.close();
					}
				}]
        });
    win.show();
}

function userInfo(record) {
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
                	id : 'username',
                    name : 'username',
                    fieldLabel : '用户名',
                },{
                	id : 'name',
                    name : 'name',
                    fieldLabel : '名称',
                },{
                	id : 'description',
                    name : 'description',
                    fieldLabel : '描述',
                    xtype:'textarea',
                }]
        });
    if (record) {
		f.getForm().setValues({
					username : record.data.username,
					name : record.data.name,
					description : record.data.description,
				});
	}
    var win = new Ext.Window( {
            title : '用户信息',
            layout : 'column',
//            closable:false,
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

function changeInfo(record) {
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
                	id : 'name',
                    name : 'name',
                    fieldLabel : '名称',
                },{
                	id : 'description',
                    name : 'description',
                    fieldLabel : '描述',
                    xtype:'textarea',
                }]
        });
    var userregister = function(){
    			var name = Ext.getCmp('name').value;
    			var description = Ext.getCmp('description').value;
				Ext.Ajax.request({
					url : 'authorizationRegistrationController.do?actionType=updateUser',
					params : {
								name : name,
								description : description,
								data : Ext.encode(record.data)
							 },
					success : function(response) {
						var result = Ext.decode(response.responseText);
						if(result.result == true){
							Ext.getCmp('userInfoPanel').store.load();
							Ext.Msg.alert('成功', "修改成功！");
							win.close();
//							Ext.bokedee.msg('保存信息', 1000,'保存成功');
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
					name : record.data.name,
					description : record.data.description,
				});
	}
    var win = new Ext.Window( {
            title : '修改用户信息',
            layout : 'column',
//          	closable:false,
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
            buttons : [ {
                    text : '确定',
                    handler : userregister
                },{
					text : '取消',
					handler : function() {	
						win.close();
					}
				}]
        });
    win.show();
}

function changePassword(record) {
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
                	id : 'oldpassword',
                    name : 'oldpassword',
                    fieldLabel : '原密码',
                    inputType : 'password',
                },{
                	id : 'newpassword',
                    name : 'newpassword',
                    fieldLabel : '新密码',
                    inputType : 'password',
                },{
                	id : 'repassword',
                    name : 'repassword',
                    fieldLabel : '确认密码',
                    inputType: 'password'
                }]
        });
    var changepassword = function(){
    			var oldpassword = Ext.getCmp('oldpassword').value;
    			var newpassword = Ext.getCmp('newpassword').value;
    			var repassword = Ext.getCmp('repassword').value;
    			if (null == newpassword || '' == newpassword) {
				Ext.Msg.alert('提示', '密码不能为空！！！');
				return;
				}
    			if (newpassword.length<6) {
				Ext.Msg.alert('提示', '密码至少需要6位！');
				return;
				}
    			if (oldpassword == newpassword) {
				Ext.Msg.alert('提示', '原密码与新密码必须不同！！！');
				return;
				}
    			if (repassword != newpassword) {
				Ext.Msg.alert('提示', '两次输入的密码不相同！！！');
				return;
				}
    			if (null == repassword || '' == repassword) {
				Ext.Msg.alert('提示', '请再次输入密码！！！');
				return;
				}
				Ext.Ajax.request({
					url : 'authorizationRegistrationController.do?actionType=changePassword',
					params : {
								oldpassword : oldpassword,
								newpassword : newpassword,
								data : Ext.encode(record.data)
							 },
					success : function(response) {
						var result = Ext.decode(response.responseText);
						if(result.result == true){
							Ext.getCmp('userInfoPanel').store.load();
							Ext.Msg.alert('成功', "修改成功！");
							win.close();
						}else{
							Ext.Msg.alert('失败', result.data);
						}
					},
					failure : function(response) {
						Ext.Msg.alert('失败', result.data);
					}
					});
    };
    var win = new Ext.Window( {
            title : '修改密码',
            layout : 'column',
//            closable:false,
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
            buttons : [ {
                    text : '确定',
                    handler : changepassword
                },{
					text : '取消',
					handler : function() {	
						win.close();
					}
				}]
        });
    win.show();
}

function resetPassword(record) {
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
                	id : 'newpassword',
                    name : 'newpassword',
                    fieldLabel : '新密码',
                    inputType : 'password',
                },{
                	id : 'repassword',
                    name : 'repassword',
                    fieldLabel : '确认密码',
                    inputType: 'password'
                }]
        });
    var resetpassword = function(){
    			var newpassword = Ext.getCmp('newpassword').value;
    			var repassword = Ext.getCmp('repassword').value;
    			if (null == newpassword || '' == newpassword) {
				Ext.Msg.alert('提示', '密码不能为空！！！');
				return;
				}
    			if (newpassword.length<6) {
				Ext.Msg.alert('提示', '密码至少需要6位！');
				return;
				}
    			if (repassword != newpassword) {
				Ext.Msg.alert('提示', '两次输入的密码不相同！！！');
				return;
				}
    			if (null == repassword || '' == repassword) {
				Ext.Msg.alert('提示', '请再次输入密码！！！');
				return;
				}
				Ext.Ajax.request({
					url : 'authorizationRegistrationController.do?actionType=resetPassword',
					params : {
								newpassword : newpassword,
								data : Ext.encode(record.data)
							 },
					success : function(response) {
						var result = Ext.decode(response.responseText);
						if(result.result == true){
							Ext.getCmp('userInfoPanel').store.load();
							Ext.Msg.alert('成功', "修改成功！");
							win.close();
						}else{
							Ext.Msg.alert('失败', result.data);
						}
					},
					failure : function(response) {
						Ext.Msg.alert('失败', result.data);
					}
					});
    };
    var win = new Ext.Window( {
            title : '重置密码',
            layout : 'column',
//            closable:false,
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
            buttons : [ {
                    text : '确定',
                    handler : resetpassword
                },{
					text : '取消',
					handler : function() {	
						win.close();
					}
				}]
        });
    win.show();
}

function changeGrade(record) {
    var f = new Ext.form.FormPanel( {
            defaultType : 'numberfield',
            labelAlign : 'right',
            labelWidth : 100,
            labelPad : 0,
            frame : true,
            width : 500,
            defaults : {
            width : 350
            },
            items : [ {
            	     id : 'grade',
                     name : 'grade',
                	 fieldLabel: "用户等级",
                   	 baseChars: "12345",
                   	 maxValue : "5",
                   	 minValue : "1",
                   	 allowDecimals:false,
                   	 editable : false
                }]
        });
    var changegrade = function(){
    			var grade = Ext.getCmp('grade').value;
    			if(grade < 1 || grade > 5){
    				Ext.Msg.alert('提示', "权限等级必须在1到5之间！");
    				renturn;
    			}
				Ext.Ajax.request({
					url : 'authorizationRegistrationController.do?actionType=changeGrade',
					params : {
								grade : grade,
								data : Ext.encode(record.data)
							 },
					success : function(response) {
						var result = Ext.decode(response.responseText);
						if(result.result == true){
							Ext.getCmp('userInfoPanel').store.load();
							Ext.Msg.alert('成功', "修改成功！");
							win.close();
//							Ext.bokedee.msg('保存信息', 1000,'保存成功');
						}else{
							Ext.Msg.alert('失败', result.data);
						}
					},
					failure : function(response) {
						Ext.Msg.alert('失败', result.data);
					}
					});
    };
    if (record) {
		f.getForm().setValues({
					grade : record.data.grade,
				});
	}
    var win = new Ext.Window( {
            title : '修改用户等级',
            layout : 'column',
//            closable:false,
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
            buttons : [ {
                    text : '确定',
                    handler : changegrade
                },{
					text : '取消',
					handler : function() {	
						win.close();
					}
				}]
        });
    win.show();
}
