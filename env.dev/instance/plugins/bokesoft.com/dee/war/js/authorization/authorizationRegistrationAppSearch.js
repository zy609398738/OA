function registrationappsearchpanel() {
	var tbar_items = [{
						text : '查询',
						scale : 'small',
						width : 50,
						icon : 'images/chaxun.png',
						handler : function() {
							if(Ext.getCmp('startDate').rawValue>Ext.getCmp('endDate').rawValue){
								Ext.Msg.alert('提示', '开始时间不得大于结束时间！');
								return;
							}
							var flag = -1;// 默认全部
							Ext.getCmp('flag').items.each(function(item) {
								if (item.checked) {
									flag = item.inputValue;
									return;
								}
							});
		   					store.setProxy({
								type : 'ajax',
								url : 'authorizationRegistrationController.do?actionType=getRegistrationAppList',
								extraParams : {
		   							startdate : Ext.getCmp('startDate').rawValue,
		   						 	enddate : Ext.getCmp('endDate').rawValue,
		   						 	flag :  flag,
									appname : Ext.getCmp('appname').rawValue,
									username : Ext.getCmp('username').rawValue
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
//					},{
//						text : '查看',
//						scale : 'small',
//						width : 50,
//						icon : 'images/chakan.png',
//						handler : function() {
//		   					if (p.selModel.getSelection() != '') {
//								appDetailInfo(p.record);
//							} else {
//								Ext.Msg.alert('提示', '请选择一个');
//							}
//						}
	          		},{
						text : '删除应用',
						scale : 'small',
						width : 80,
						icon : 'images/shanchu.png',
						handler : function() {
							if (p.selModel.getSelection() != '') {
								Ext.Msg.show( {
											title : '提示',
											msg : '确定要删除吗？',
											buttons : Ext.Msg.YESNO,
											fn : function(type) {
												if ('yes' == type) {
													Ext.Ajax.request( {
																url : 'authorizationRegistrationController.do?actionType=deleteApp',
																params : {
																	data : Ext.encode(p.record.data)
																},
																success : function(response) {
																	var result = Ext.decode(response.responseText);
																	if (result.result == true) {
																		Ext.getCmp('RegistrationAppSearchPanel').store.load();
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
	var store = new Ext.data.Store({
	    		pageSize: 10, // 分页大小
				model : 'RegistrationAppListModel',
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
								url : 'authorizationRegistrationController.do?actionType=getRegistrationAppList',
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
		id : 'RegistrationAppSearchPanel',
		height : '100%',
		width : '100%',
		loadMask : true,
		sortableColumns : false,
		tbar : tbar_items,
		dockedItems : [{
			xtype : 'toolbar',
			dock : 'top',
			items : ['开始时间：', {
						xtype : 'datefield',
						name : 'startDate',
						id : 'startDate',
						value : new Date(),
						flex : 1,
						endDateField : 'endDate',
						editable : false
					}, ' 结束时间：', {
						xtype : 'datefield',
						id : 'endDate',
						name : 'endDate',
						value : new Date(),
						startDateField : 'startDate',
						flex : 1,
						editable : false
					}, '应用名称：', {
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
						width : 200,
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
									boxLabel : '已删除',
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
				}, {
					header : '创建应用用户',
					dataIndex : 'username',
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
				}, {
					text : '最后修改时间',
					dataIndex : 'updatetime',
					renderer : Ext.util.Format.dateRenderer('Y-m-d H:i:s'),
					sortable : false,
					menuDisabled : true,
					flex : 1
				}, {
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
		title : '注册应用查询',
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

function appDetailInfo(record) {
	var store = Ext.create('Ext.data.Store',
					{
						model : 'RegistrationAppModel',
						proxy : {
							type : 'ajax',
							url : 'authorizationRegistrationController.do?actionType=getDetailRegistrationApp',
							reader : {
								type : 'json',
								root : 'data'
							},
							extraParams : {
								username : record.data.username,
								appname : record.data.appname,
							}
						},
						autoLoad : true
					});
	var p = Ext.create('Ext.grid.Panel', {
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
		border : 1,
		columns : [{
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
					flex : 1
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
	});
    var win = new Ext.Window( {
            title : '详细信息',
            layout : 'absolute',
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
			items : [p]
        });
    var reset = function() {
        f.form.reset();
    };
    win.show();
}
