function authorizationapppanel() {
	var title = '授权应用管理';
	var tbar_items = [ {
							text : '查看授权范围',
							id : 'authorizationScope',
							scale : 'small',
							width : 100,
							icon : 'images/xiugai.png',
							handler : function() {
								if (AuthorizationAppPanel.selModel.getSelection() != '') {
									if(AuthorizationAppPanel.record.data.flag == 1){
										Ext.Msg.alert('失败', '该授权已删除或已过期');
										return;
									}
									var client_id = AuthorizationAppPanel.record.data.appkey;
									Ext.Ajax.request({
										url : 'authorizationController.do?actionType=verifyAccesstoken',
										params : {
													client_id : client_id,
												 },
										success : function(response) {
											var result = Ext.decode(response.responseText);
											if(result.result == true){
												authorizationScope(client_id);
												Ext.Ajax.request( {
													url : 'authorizationRegistrationController.do?actionType=getGrade',
													success : function(response) {
														var result = Ext.decode(response.responseText);
														if (result.result == true) {
															var grade = result.data;
															if (grade >= 4) {
																Ext.getCmp('updateScope').setVisible(true);
															}
														} else {
															Ext.Msg.alert('失败', result.data);
														}
													},
													failure : function(response) {
														Ext.Msg.alert('失败', result.data);
													}
												});
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
						},{
							text : '取消授权',
							id : 'deleteAccesstoken',
							hidden : true,
							scale : 'small',
							width : 80,
							icon : 'images/shanchu.png',
							handler : function() {
								if (AuthorizationAppPanel.selModel.getSelection() != '') {
									if (AuthorizationAppPanel.record.data.flag == 1){
										Ext.Msg.alert('失败', '该授权已删除或已过期');
										return;
									}
									Ext.Msg.show({
												title : '提示',
												msg : '确定要取消授权吗？',
												buttons : Ext.Msg.YESNO,
												fn : function(type) {
													if ('yes' == type) {
														Ext.Ajax.request({
															url : 'authorizationRegistrationController.do?actionType=deleteAccesstoken',
															params : {
																		data : Ext.encode(AuthorizationAppPanel.record.data)
																	 },
															success : function(response) {
																var result = Ext.decode(response.responseText);
																if(result.result == true){
																	Ext.getCmp('AuthorizationAppPanel').store.load();
																	Ext.Msg.alert('成功', "删除成功！");
										//							Ext.bokedee.msg('保存信息', 1000,'保存成功');
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
											})
													}
												}
//						},{
//							text : '清除过期授权',
//							id : 'cleanExpiredAccesstoken',
//							hidden : true,
//							scale : 'small',
//							width : 100,
//							icon : 'images/shanchu.png',
//							handler : function() {
//									Ext.Msg.show({
//												title : '提示',
//												msg : '确定要清除吗？',
//												buttons : Ext.Msg.YESNO,
//												fn : function(type) {
//													if ('yes' == type) {
//														Ext.Ajax.request({
//															url : 'authorizationRegistrationController.do?actionType=cleanExpiredAccesstoken',
//															success : function(response) {
//																var result = Ext.decode(response.responseText);
//																if(result.result == true){
//																	Ext.getCmp('AuthorizationAppPanel').store.load();
//																	Ext.Msg.alert('成功', "清除成功！");
//										//							Ext.bokedee.msg('保存信息', 1000,'保存成功');
//																}else{
//																	Ext.Msg.alert('失败', result.data);
//																}
//															},
//															failure : function(response) {
//																Ext.Msg.alert('失败', result.data);
//															}
//															});
//													}
//												}
//											})
//												}
						}];
	var store = Ext.create('Ext.data.Store', {
				model : 'AuthorizationAppModel',
				proxy : {
					type : 'ajax',
					url : 'authorizationRegistrationController.do?actionType=getAllAuthorizationApp',
					reader : {
						type : 'json',
						root : 'data'
					}
				},
				autoLoad : true
			});
	var AuthorizationAppPanel = Ext.create('Ext.grid.Panel', {
		title : title,
		id : 'AuthorizationAppPanel',
		selModel : Ext.create('Ext.selection.CheckboxModel', {
					mode : 'SINGLE',
					listeners : {
						select : function(m, record, index) {
							AuthorizationAppPanel.record = record;
							AuthorizationAppPanel.index = index;
						}
					}
				}),
		width : '100%',
		height : '100%',
//		frame : true,
		defaults : {
			split : true
		},
		border : 1,
		method : 'post',
		defaultType : 'textfield',
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
					flex : 1
				}, {
					text : 'APP KEY',
					dataIndex : 'appkey',
					sortable : false,
					menuDisabled : true,
					hidden : true,
					flex : 1
				},{
					text : '创建时间',
					dataIndex : 'starttime',
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
					text : '授权到期时间',
					dataIndex : 'endtime',
					renderer : Ext.util.Format.dateRenderer('Y-m-d H:i:s'),
					sortable : false,
					menuDisabled : true,
					flex : 1
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
								return '<font style=color:red>已删除或已过期</font>';
							} 
					}
          		}],
		store : store,
	});
	return AuthorizationAppPanel;
}

function authorizationScope(client_id) {
	var tbar_items =[{
					text : '修改授权范围',
					id : 'updateScope',
					scale : 'small',
					width : 100,
					hidden : true,
					icon : 'images/xiugai.png',
					handler : function() {
			    			var treeRoot = win.items.items[0].store.tree.root;
							var treeJson = convertTreeStoreToData(treeRoot);
							var scope = {
									ScopeList : treeJson
								};
							Ext.Ajax.request({
								url : 'authorizationController.do?actionType=modifyAuthorizedTreeStore',
								params : {
											client_id : client_id,
											scope : Ext.encode(scope),
										 },
								success : function(response) {
									var result = Ext.decode(response.responseText);
									if(result.result == true){
										Ext.Msg.alert('成功','修改成功！');
									}else{
										Ext.Msg.alert('失败',result.data);
										
									}
								},
								failure : function(response) {
									Ext.Msg.alert('失败', response.responseText);
								}
							});
						}
					}];
	var scopeStoreURL = 'authorizationController.do?actionType=findAuthorizedTreeStore';
	var scopeStore = Ext.create('Ext.data.TreeStore', {
				id : 'jkpz_tree_store',
				proxy : {
					type : 'ajax',
					url : scopeStoreURL,
					extraParams : {
						client_id : client_id,
					}
				},
				autoload : true
			});
	var scopeTree = Ext.create('Ext.tree.Panel', {
				id : 'scopeTree',
				rootVisible : false,
				useArrows : true,
				tbar : tbar_items,
				height : '100%',
				flex : 1,
				store : scopeStore,
				listeners : {
					checkchange : function(node, checked) {
						doTreeCheckChange(node, checked);
					}
				}
			});
    var win = new Ext.Window( {
            title : '应用列表',
            layout : 'absolute',
            draggable : false,
            width : 800,
			height : 500,
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
			items : [scopeTree]
        });
    var reset = function() {
        f.form.reset();
    };
    win.show();
}
