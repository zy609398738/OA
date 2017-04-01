function authorizationappsearchpanel() {
	var tbar_items = [{
						text : '查询',
						id : 'search',
						scale : 'small',
						width : 50,
						icon : 'images/chaxun.png',
						handler : function() {
						var flag = -1;// 默认全部
							Ext.getCmp('flag').items.each(function(item) {
								if (item.checked) {
									flag = item.inputValue;
									return;
								}
							});
		   					store.setProxy({
								type : 'ajax',
								url : 'authorizationRegistrationController.do?actionType=getAuthorizationAppList',
								extraParams : {
									appname : Ext.getCmp('appname').rawValue,
									username : Ext.getCmp('username').rawValue,
									flag :  flag
								},
								reader : {
										root : 'data',
										totalProperty : 'totalCount'
									}
								});
		   					store.loadPage(1, {
									params : store.getProxy().params
								});
							}
					},{
						text : '取消授权',
						id : 'deleteAccesstoken',
						scale : 'small',
						width : 80,
						icon : 'images/shanchu.png',
						handler : function() {
							if (p.selModel.getSelection() != '') {
								Ext.Msg.show({
											title : '提示',
											msg : '确定要取消授权吗？',
											buttons : Ext.Msg.YESNO,
											fn : function(type) {
												if ('yes' == type) {
													Ext.Ajax.request({
														url : 'authorizationRegistrationController.do?actionType=deleteAccesstokenBySearch',
														params : {
																	data : Ext.encode(p.record.data)
																 },
														success : function(response) {
															var result = Ext.decode(response.responseText);
															if(result.result == true){
																Ext.getCmp('AuthorizationAppSearchPanel').store.load();
																Ext.Msg.alert('成功', "删除成功！");
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
					},{
						text : '查看该用户授权范围',
						id : 'scopeInfo',
						scale : 'small',
						width : 140,
						icon : 'images/chaxun.png',
						handler : function() {
								if (p.selModel.getSelection() != '') {
									if(p.record.data.flag == 1){
										Ext.Msg.alert('失败', '该授权已删除或已过期');
										return;
									}
									var username = p.record.data.username;
									var client_id = p.record.data.appkey;
									Ext.Ajax.request({
										url : 'authorizationController.do?actionType=verifyAccesstoken',
										params : {
													username : username,
													client_id : client_id
												 },
										success : function(response) {
											var result = Ext.decode(response.responseText);
											if(result.result == true){
												authorizationScopeBySearch(client_id,username);
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
					}]
	var store = new Ext.data.Store({
	    		pageSize: 10, // 分页大小
				model : 'AuthorizationAppListModel',
				proxy : {
					type : 'ajax',
					reader : {
						type : 'json',
						root : 'data',
						totalProperty : 'totalCount'
					},
				},
				listeners : {
					beforeload : function(store, option) {
						option.params = store.getProxy().params;
						if(store.getProxy().url == null){
							store.setProxy({
								type : 'ajax',
								url : 'authorizationRegistrationController.do?actionType=getAuthorizationAppList',
								extraParams : {
		   						 	flag :  100,
								},
								reader : {
										root : 'data',
										totalProperty : 'totalCount'
									}
								});
						}
						option.limit = Ext.getCmp('limit').rawValue;
						store.pageSize = Ext.getCmp('limit').rawValue;
					}
				},
				autoLoad : false,
			});
   var p = Ext.create('Ext.grid.Panel', {
		border : 0,
		tbar : tbar_items,
		id : 'AuthorizationAppSearchPanel',
		height : '100%',
		width : '100%',
		loadMask : true,
		sortableColumns : false,
		dockedItems : [{
			xtype : 'toolbar',
			dock : 'top',
			items : ['应用名称：', {
						xtype : 'textfield',
						name : 'appname',
						id : 'appname',
						flex : 2,
					}, ' 用户名：', {
						xtype : 'textfield',
						id : 'username',
						name : 'username',
						flex : 2,
					}, ' 每页显示：', {
						xtype : 'combobox',
						store : [5,10,15,20],
						editable : false,
						value : 10,
						id : 'limit',
						name : 'limit',
						width : 100,
					},{
						xtype : 'fieldset',
						defaultType : 'radio',
						width : 260,
						id : 'flag',
						layout : 'hbox',
						items : [{
									checked : true,
									boxLabel : '全部',
									name : 'radioorder',
									inputValue : '-1'
								}, {
									boxLabel : '可使用',
									name : 'radioorder',
									inputValue : '0'
								}, {
									boxLabel : '已过期或已删除',
									name : 'radioorder',
									inputValue : '1'
								}]
					}]
		}],
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
							flex : 1,
						},{
							header : 'APPKEY',
							dataIndex : 'appkey',
							sortable : false,
							menuDisabled : true,
							flex : 1,
						},{
							header : '授权用户',
							dataIndex : 'username',
							sortable : false,
							menuDisabled : true,
							flex : 1,
						},{
							header : '开始时间',
							dataIndex : 'starttime',
							sortable : false,
							renderer : Ext.util.Format.dateRenderer('Y-m-d H:i:s'),
							menuDisabled : true,
							flex : 1,
						},{
							header : '结束时间',
							dataIndex : 'endtime',
							sortable : false,
							renderer : Ext.util.Format.dateRenderer('Y-m-d H:i:s'),
							menuDisabled : true,
							flex : 1,
						}, {
							text : '最后修改时间',
							dataIndex : 'updatetime',
							renderer : Ext.util.Format.dateRenderer('Y-m-d H:i:s'),
							sortable : false,
							menuDisabled : true,
							flex : 1
						},{
		          			header : '是否可用',
							dataIndex : 'flag',
							sortable : false,
							menuDisabled : true,
							flex : 1,
							renderer : function(value) {
									if ('0' == value) {
										return '<font style=color:blue>可使用</font>';
									} else if ('1' == value) {
										return '<font style=color:red>已过期或已删除</font>';
									} 
							}
		          		}],
		store : store,
		title : '授权应用查询',
		selModel : Ext.create('Ext.selection.CheckboxModel', {
			mode : 'SINGLE',
			listeners : {
				select : function(m, record, index) {
					p.record = record;
					p.index = index;
				}
			}
		}),
		bbar: Ext.create('Ext.PagingToolbar', {
                    store: store,
                    displayInfo: true,
                    beforePageText : '第',
					afterPageText : '页-共{0}页',
                    displayMsg: '显示{0}-{1}条，共{2}条',
                    emptyMsg: "没有数据"
                })
	});
	var panel = Ext.create('Ext.panel.Panel', {
				id : 'center_systemInfo',
				draggable : false,
				resizable : false,
//				layout : 'anchor',
				width : '100%',
				height : '100%',
				items : [p]
			});
	return panel;
	
}

function authorizationScopeBySearch(client_id, username) {
	var scopeStoreURL = 'authorizationController.do?actionType=findAuthorizedTreeStore';
	var scopeStore = Ext.create('Ext.data.TreeStore', {
				id : 'jkpz_tree_store',
				proxy : {
					type : 'ajax',
					url : scopeStoreURL,
					extraParams : {
						client_id : client_id,
						username : username
					}
				},
				autoload : true
			});
	var scopeTree = Ext.create('Ext.tree.Panel', {
				id : 'scopeTree',
				rootVisible : false,
				useArrows : true,
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
            width : 800*bokedee_width,
			height : 500*bokedee_height,
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