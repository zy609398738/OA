function list_map_dispatch(fieldName, label) {

	var win_buttons = [ {
		text : '确定',
		handler : function() {
			var rp = getCmp('right_propertyGrid');
			if (win_grid_store.getCount() != 0) {
				Ext.Ajax.request( {
					url : 'interfaceInfoFindController.do',
					params : {
						actionType : 'getMap_dispatchStore',
						data : storeToJSON(win_grid_store)
					},
					success : function(response) {
						if (!(response.responseText.indexOf('Exception')>-1||response.responseText.indexOf('Error') > -1)){
							rp.setProperty(fieldName, response.responseText);
						}else{
							rp.setProperty(fieldName, '点此编辑');
						}
					}
				});
			} else {
				rp.setProperty(fieldName, '点此编辑');
			}
			win.close();
		}
	}, {
		text : '取消',
		handler : function() {
			win.close();
		}
	} ];

	function win_gridEdit(record, index) {
		function win_Value_btn() {
			record.data.value = win_Value_form.getValues().propertyValue;
			win_grid_store.removeAt(index);
			win_grid_store.insert(index, record)
			win_Value.close();
		}
		var win_Value_form = Ext.create('Ext.form.Panel', {
			border : 0,
			items : [ {
				xtype : 'textarea',
				name : 'propertyValue',
				width : 788,
				height : 382,
				value : record.data.value
			} ]
		});
		var win_Value = Ext.create('Ext.Window', {
			title : record.data.key,
			width : 800,
			height : 450,
			draggable : false,
			autoScroll : true,
			resizable : false,
			modal : true,
			buttons : [ {
				text : '确定',
				handler : function() {
					win_Value_btn();
				}
			}, {
				text : '取消',
				handler : function() {
					win_Value.close();
				}
			} ],
			items : [ win_Value_form ]
		}).show();
	}

	var win_grid_CheckboxModel = Ext.create('Ext.selection.CheckboxModel', {
		mode : 'SINGLE',
		listeners : {
			select : function(m, record, index) {
				win_grid._record = record;
				win_grid._index = index;
			}
		}
	});
	var vj = [];
	var v = getCmp('right_propertyGrid').getSource()[fieldName];
	if (v != null && v != '点此编辑' && '' != v) {
		//这里把数据传到后台 根据id查询对应的接口和服务名字
		var url = 'interfaceInfoFindController.do?actionType=getDispachEditName';
		v = ajaxSyncCall(url, 'value=' + v, null);
		vj = Ext.decode(v);
	}
	var win_grid_store = Ext.create('Ext.data.Store', {
		model : 'DispatchEditModel',
		data : vj,
		autoLoad : false
	});
	var win_grid_item = [ {
		text : '新增',
		icon : 'images/add.png',
		scale : 'small',
		width : 50,
		handler : function() {
			windowEditDispatch();
		}
	}, {
		text : '删除',
		scale : 'small',
		icon : 'images/shanchu.png',
		width : 50,
		handler : function() {
			if (win_grid._index != null) {
				win_grid_item_btnDelHandler(win_grid._index);
			}
		}
	}, {
		text : '修改',
		scale : 'small',
		icon : 'images/xiugai.png',
		width : 50,
		handler : function() {
			var record = win_grid._record;
			if (record != null) {
				windowEditDispatch(record, win_grid._index);
			}
		}
	} ];

	function win_grid_item_btnDelHandler(gridIndex) {
		Ext.Msg.show( {
			title : '删除',
			msg : '确定删除：' + win_grid_store.getAt(gridIndex).data.name,
			buttons : Ext.Msg.YESNO,
			fn : function(type) {
				if ('yes' == type) {
					win_grid_store.removeAt(gridIndex);
					gridIndex = undefined;
				}
			}
		})
	}
	var win_grid = Ext.create('Ext.grid.Panel', {
		id : 'dispatchEditGrid',
		autoScroll : true,
		selModel : win_grid_CheckboxModel,
		store : win_grid_store,
		tbar : {
			items : win_grid_item
		},
		columns : [ {
			header : '名称',
			dataIndex : 'name',
			flex : 2
		}, {
			header : '表达式',
			dataIndex : 'expression',
			flex : 2
		}, {
			header : '值',
			dataIndex : 'value',
			flex : 2
		}, {
			header : '接口',
			dataIndex : 'interfacesName',
			flex : 2
		}, {
			header : '服务',
			dataIndex : 'servicesName',
			flex : 2
		} ],
		height : 386,
		listeners : {
			itemdblclick : function(view, record, item, index, event) {
				windowEditDispatch(record, win_grid._index);
			}
		}
	});

	var win = Ext.create('Ext.Window', {
		title : label,
		width : 800,
		height : 450,
		draggable : false,
		autoScroll : true,
		resizable : false,
		modal : true,
		buttons : win_buttons,
		items : [ win_grid ]
	});

	win.show();

}
function windowEditDispatch(record, index) {

	win_buttons =[ {
		text : '确定',
		handler : function() {
			var form_expression = win_form.getValues().expression;
			var form_name = win_form.getValues().name;
			var form_value = win_form.getValues().value;
			var form_interfaces = win_form.getValues().interfaces;
			var form_services = win_form.getValues().services;
			if (form_interfaces=='请选择接口'|| form_interfaces=='') {
				Ext.Msg.alert('提示', '请选择接口');
				return;
			}
			if (form_services=='请选择服务'|| form_services=='') {
				Ext.Msg.alert('提示', '请选择服务');
				return;
			}
			var store=Ext.getCmp('dispatchEditGrid').store;
			var count = store.getCount();
			if(record==null){//新增
				for ( var i = 0; i < count; i++) {
					if(form_name==store.getAt(i).data.name){
						Ext.Msg.alert('提示','该名称已存在');
						return;
					}
				}
			}else{//修改移除后再新增
				store.removeAt(index);
			}
			var data = {
				name : form_name,
				expression: form_expression,
				value : form_value,
				interfaces : form_interfaces,
				services : form_services,
				interfacesName : getCmp('interfaces').rawValue,
				servicesName : getCmp('services').rawValue,
			};
			Ext.getCmp('dispatchEditGrid').store.add(data);
			win.close();
		}
	}, {
		text : '取消',
		handler : function() {
			win.close();
		}
	} ];

	var interfaceComStore_url = 'interfaceInfoFindController.do?actionType=findWebServiceInterfaceStore&type=http,vm';

    var serviceComStore_url = 'interfaceInfoFindController.do?actionType=findWebServiceServiceStore&type=http,vm';

	var win_form = Ext
			.create(
					'Ext.form.Panel',
					{
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
						items : [
								{
									fieldLabel : '名称',
									name : 'name',
									allowBlank : false,
									readOnly : record!=null?true:false,
								},
								{
									fieldLabel : '表达式',
									name : 'expression',
									allowBlank : false
								},
								{
									fieldLabel : '值',
									name : 'value',
									allowBlank : false
								},
								{
									xtype : 'fieldcontainer',
									fieldLabel : '配置服务',
									layout : 'hbox',
									defaultType : 'combobox',
									items : [
											{
												xtype : 'combobox',
												id : 'interfaces',
												name : 'interfaces',
												flex : 1,
												value : '请选择接口',
												store : Ext
														.create(
																'Ext.data.Store',
																{
																	model : 'Combox',
																	proxy : {
																		type : 'ajax',
																		url : interfaceComStore_url,
																		reader : {
																			type : 'json',
																			root : 'root'
																		}
																	},
																	listeners : {
																		load : function(response) {
																			if (record!=null) {
																				Ext.Ajax
																						.request( {
																							url : serviceComStore_url,
																							params : {
																								interfaceId : record.data.interfaces
																							},
																							success : function(
																									response) {
																								Ext
																										.getCmp('services').store
																										.removeAll();
																								Ext
																										.getCmp(
																												'services')
																										.setValue(
																												'请选择服务');
																								var result = response.responseText;
																								var j = Ext
																										.decode(result);
																								Ext
																										.getCmp('services').store
																										.add(j.root);
																								getCmp(
																										'interfaces')
																										.select(
																												record.data.interfaces);
																								getCmp(
																										'services')
																										.select(
																												record.data.services);
																							}
																						})
																			}
																		}
																	},
																	autoLoad : true
																}),
												listeners : {
													select : function(newValue) {
														Ext.Ajax
																.request( {
																	url : serviceComStore_url,
																	params : {
																		interfaceId : newValue.value
																	},
																	success : function(
																			response) {
																		Ext
																				.getCmp('services').store
																				.removeAll();
																		Ext
																				.getCmp(
																						'services')
																				.setValue(
																						'请选择服务');
																		var result = response.responseText;
																		var j = Ext
																				.decode(result);
																		Ext
																				.getCmp('services').store
																				.add(j.root);
																	}
																})
													}
												},
												editable : false,
												displayField : 'displayField',
												valueField : 'value',
												queryMode : 'local'
											},
											{
												xtype : 'combobox',
												id : 'services',
												name : 'services',
												flex : 1,
												value : '请选择服务',
												store : Ext.create(
														'Ext.data.Store', {
															model : 'Combox'
														}),
												editable : false,
												displayField : 'displayField',
												valueField : 'value',
												queryMode : 'local'
											} ]
								}]
					});

	if(record!=null){
		win_form.getForm().setValues( {
			name : record.data['name'],
			value : record.data['value'],
			expression : record.data['expression'],
		});
	}
	var win = Ext.create('Ext.Window', {
		title : '配置',
		width : 500,
		height : 300,
		draggable : false,
		autoScroll : true,
		resizable : false,
		modal : true,
		buttons : win_buttons,
		items : [ win_form ]
	});
	win.show();
}