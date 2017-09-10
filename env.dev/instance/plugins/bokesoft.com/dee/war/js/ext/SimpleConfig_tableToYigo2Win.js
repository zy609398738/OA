/**
 * 数据库表到表的yigo系统
 * 
 */
function dstableToYigo2Win(text, description, record, detailId, detailType,
		newtablename, hidden) {
	var win_buttons = [
			{
				text : '保存',
				handler : function() {
					var form_text = win_form.getValues().text;
					var form_description = win_form.getValues().description;
					var form_yigoUrl = win_form.getValues().yigoUrl;
					var form_yigoKey = win_form.getValues().yigoKey;
					var form_recordMpLog = win_form.getValues().recordMpLog;
					var form_DataSourceId = Ext.getCmp('yigoDataSource').value;
					var form_DataSourceName = Ext.getCmp('yigoDataSource').rawValue;
					var form_midDataSourceId = Ext.getCmp('midDataSource').value;
					var form_midDataSourceName = Ext.getCmp('midDataSource').rawValue
					var form_updateSql = win_form.getValues().updateSql.Trim();
					var form_pollingFrequency = win_form.getValues().pollingFrequency;
					if (null == form_text || '' == form_text) {
						Ext.Msg.alert('提示', '名称不能为空！！！');
						return;
					} else {
						if (!isRigthName(form_text)) {
							Ext.Msg.alert('提示', '名称不能包含空格及中文字符');
							return;
						}
						var items = Ext.getCmp('SimpleConfiggridPanel').store.data.items;
						for (var i = 0; i < items.length; i++) {
							if (form_text == items[i].data.text
									&& !(detailId == items[i].data.id)) {
								Ext.Msg.alert('提示', '名称已经存在！！！');
								return;
							}
						}

					}
					if (null == form_yigoUrl || '' == form_yigoUrl) {
						Ext.Msg.alert('提示', 'YiGO访问地址不能为空！！！');
						return;
					}
					if (null == form_yigoKey || '' == form_yigoKey) {
						Ext.Msg.alert('提示', 'YiGO单据key不能为空！！！');
						return;
					}
					if (null == form_DataSourceId || '' == form_DataSourceId) {
						Ext.Msg.alert('提示', 'Yigo数据源不能为空！！！');
						return;
					}
					if (null == form_midDataSourceId
							|| '' == form_midDataSourceId) {
						Ext.Msg.alert('提示', '中间表数据源不能为空！！！');
						return;
					}
					if (Ext.getCmp('win_form_tabpanel').items.length == 0) {
						Ext.Msg.alert('提示', '至少需要配置一张表！！！');
						return;
					}
					var billDbTable = win_form.getValues().billDbTable;
					if (null == billDbTable || '' == billDbTable) {
						var form_billKeyTableMapping = win_form.getValues().billKeyTableMapping;
						var obj = Ext.decode(form_billKeyTableMapping);
						var arrKey = Ext.getCmp('win_form_tabpanel').items.keys;
						var arrTable = new Array();
						for (var i = 0; i < arrKey.length; i++) {
							var temp = arrKey[i];
							for ( var key in obj) {
								if (key == temp) {
									arrTable[i] = obj[key];
								}
							}
						}
						var form_billDbTable = arrTable.join(",");
					} else {
						form_billDbTable = billDbTable;
					}
					var form_billTable = Ext.getCmp('win_form_tabpanel').items.keys
							.join(',');
					var yigoconfig = {
						yigoUrl : form_yigoUrl,
						yigoKey : form_yigoKey,
						recordMpLog : form_recordMpLog,
						billTable : form_billTable,
						billDbTable : form_billDbTable,
						dataSourceId : form_DataSourceId,
						dataSourceName : form_DataSourceName,
						midDataSourceId : form_midDataSourceId,
						midDataSourceName : form_midDataSourceName,
						updateSql : form_updateSql,
						errorUpdateSql : win_form.getValues().errorUpdateSql,
						pollingFrequency : form_pollingFrequency,
						statusCanUpdate : win_form.getValues().statusCanUpdate,
						autoRun : win_form.getValues().autoRun
					}

					var tableNames = form_billTable.split(',');// 数组第一个主表名
					// ，其他子表名
					for (var i = 0; i < tableNames.length; i++) {
						var sql = getCmp(tableNames[i]).getValues().midTableSql
								.Trim();
						if ('' == sql || null == sql) {
							Ext.Msg.alert('提示', '中间表到[' + tableNames[i]
									+ ']的查询语句不能为空！！！');
							return;
						} else {
							if (i != 0
									&& (sql.toUpperCase().trim().indexOf(
											'SELECT') == 0)
									&& sql.trim().split(' ').length != 1
									&& sql.indexOf('#[') == -1) {// 子表的查询语句必须关联主表
								Ext.Msg.alert('提示', '中间表到[' + tableNames[i]
										+ ']的查询语句条件必须关联主表[' + tableNames[0]
										+ ']！！！');
								return;
							}
							yigoconfig[tableNames[i] + '_sql'] = sql;
							yigoconfig[tableNames[i] + '_store'] = storeToObj(Ext
									.getCmp('win_form_tableToYigo2'
											+ tableNames[i]).store);
						}
					}
					var mapData = {// 第一个map
						id : detailId,
						text : form_text,
						description : form_description,
						type : detailType,
						data : yigoconfig
					}
					bodyLoadingMask.show();
					Ext.Ajax
							.request({
								url : 'interfaceSimpleConfigTableToYigo20Controller.do?actionType=updateSdInterfaceTableToYigo20',
								params : {
									data : Ext.encode(mapData)
								},
								success : function(response) {
									bodyLoadingMask.hide();
									var result = Ext
											.decode(response.responseText);
									if (result.result) {
										Ext.getCmp('SimpleConfiggridPanel').store
												.load();
										win.close();
										// Ext.Msg.alert('成功', '保存成功');
										Ext.bokedee.msg('保存信息', 1000, '保存成功');
									} else {
										Ext.Msg.alert('失败', result.data);
									}
								},
								failure : function(response) {
									bodyLoadingMask.hide();
									var result = Ext
											.decode(response.responseText);
									Ext.Msg.alert('失败', result.data);
								}

							});

				}
			}, {
				text : '取消',
				handler : function() {
					win.close();
				}
			} ]

	var yigodatasourceUrl = 'interfaceInfoFindController.do?actionType=findDatasourceForJdbcConnector';
	var win_form = Ext
			.create(
					'Ext.form.Panel',
					{
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
						items : [
								{
									name : 'billDbTable',
									hidden : true,
									readOnly : true
								},
								{
									name : 'billKeyTableMapping',
									hidden : true,
									readOnly : true
								},
								{
									fieldLabel : 'ID',
									name : 'id',
									hidden : true,
									readOnly : true
								},
								{
									fieldLabel : '名称' + needToFill,
									name : 'text',
									emptyText : '名称只能由数字、字母、减号和下划线组成',
									value : text,
									allowBlank : false
								},
								{
									xtype : 'textarea',
									fieldLabel : '描述',
									name : 'description',
									value : description,
									height : 30,
									allowBlank : true
								},
								{
									fieldLabel : 'YiGO访问地址' + needToFill,
									name : 'textfieldkey',
									xtype : 'fieldcontainer',
									layout : {
										type : 'hbox'
									},
									items : [
											{
												xtype : 'textfield',
												name : 'yigoUrl',
												emptyText : 'http://ip:端口/Yigo',
												flex : 6,
												allowBlank : false
											},
											{
												xtype : 'textfield',
												fieldLabel : '单据key'
														+ needToFill,
												name : 'yigoKey',
												labelWidth : 60,
												margins : '0 0 0 10',
												flex : 7
											},
											{
												xtype : 'button',
												margins : '0 0 0 10',
												text : '获取信息',
												handler : function() {
													var form_yigoUrl = win_form
															.getValues().yigoUrl;
													var form_yigoKey = win_form
															.getValues().yigoKey;
													if (null == form_yigoUrl
															|| '' == form_yigoUrl) {
														Ext.Msg
																.alert('提示',
																		'YiGO访问地址不能为空！！！');
														return;
													}
													if (null == form_yigoKey
															|| '' == form_yigoKey) {
														Ext.Msg
																.alert('提示',
																		'YiGO单据key不能为空！！！');
														return;
													}
													bodyLoadingMask.show();
													Ext.Ajax
															.request({
																url : 'interfaceSimpleConfigController.do?actionType=getYiGokeyinfo_2',
																params : {
																	url : form_yigoUrl,
																	key : form_yigoKey
																},
																success : function(
																		response) {
																	bodyLoadingMask
																			.hide();
																	var result = Ext
																			.decode(response.responseText);
																	if (result.result) {
																		chooseTableToYigo2Columns(
																				win_form,
																				result.data);
																	} else {
																		Ext.Msg
																				.alert(
																						'失败',
																						result.data);
																	}

																},
																failure : function(
																		response) {
																	bodyLoadingMask
																			.hide();
																	var result = Ext
																			.decode(response.responseText);
																	Ext.Msg
																			.alert(
																					'失败',
																					result.data);
																}

															});
												}
											} ]
								}, {
									xtype : 'fieldcontainer',
									layout : 'hbox',
									width : '100%',
									items : [ {
										fieldLabel : '中间表数据源' + needToFill,
										flex : 1,
										name : 'midDataSource',
										id : 'midDataSource',
										xtype : 'combobox',
										store : Ext.create('Ext.data.Store', {
											model : 'SimpleCombox',
											proxy : {
												type : 'ajax',
												url : yigodatasourceUrl,
												reader : {
													type : 'json',
													root : 'root'
												}
											},
											autoLoad : true
										}),
										editable : false,
										displayField : 'displayField',
										valueField : 'value',
										queryMode : 'local',
										emptyText : '请选择'
									}, {
										fieldLabel : 'YiGO数据源' + needToFill,
										flex : 1,
										labelWidth : 80,
										margins : '0 0 0 10',
										name : 'yigoDataSource',
										id : 'yigoDataSource',
										xtype : 'combobox',
										store : Ext.create('Ext.data.Store', {
											model : 'SimpleCombox',
											proxy : {
												type : 'ajax',
												url : yigodatasourceUrl,
												reader : {
													type : 'json',
													root : 'root'
												}
											},
											autoLoad : true
										}),
										editable : false,
										displayField : 'displayField',
										valueField : 'value',
										queryMode : 'local',
										emptyText : '请选择'
									}, {
										xtype : 'textfield',
										fieldLabel : '可更新Status值',
										name : 'statusCanUpdate',
										margins : '0 0 0 20',
										value : '',
										flex : 1
									} ]
								}, {
									xtype : 'fieldcontainer',
									layout : 'hbox',
									width : '100%',
									items : [ {
										fieldLabel : '自动启动',
										xtype : 'combobox',
										name : 'autoRun',
										flex : 1,
										store : Ext.create('Ext.data.Store', {
											model : 'SimpleCombox',
											data : [ {
												value : 'true',
												displayField : '是'
											}, {
												value : 'false',
												displayField : '否'
											} ]
										}),
										editable : false,
										displayField : 'displayField',
										valueField : 'value',
										queryMode : 'local',
										value : 'false'
									}, {
										fieldLabel : '间隔时间（秒）' + needToFill,
										margins : '0 0 0 20',
										xtype : 'numberfield',
										name : 'pollingFrequency',
										flex : 1,
										value : 100,
										minValue : 1
									}, {
										fieldLabel : '记录详细日志',
										margins : '0 0 0 20',
										xtype : 'combobox',
										name : 'recordMpLog',
										flex : 1,
										store : Ext.create('Ext.data.Store', {
											model : 'SimpleCombox',
											data : [ {
												value : 'true',
												displayField : '是'
											}, {
												value : 'false',
												displayField : '否'
											} ]
										}),
										editable : false,
										displayField : 'displayField',
										valueField : 'value',
										queryMode : 'local',
										value : 'false'
									} ]
								}, {
									xtype : 'tabpanel',
									id : 'win_form_tabpanel',
									hidden : hidden,
									margins : '5 0 5 0',
									items : []
								}, {
									xtype : 'textarea',
									fieldLabel : '成功更新语句',
									margins : '5 0 0 0',
									name : 'updateSql',
									id : 'updateSql',
									hidden : hidden,
									height : 25
								}, {
									xtype : 'textarea',
									fieldLabel : '异常更新语句',
									margins : '5 0 0 0',
									name : 'errorUpdateSql',
									id : 'errorUpdateSql',
									hidden : hidden,
									height : 25
								} ]
					});
	if (record && record.billTable) {
		win_form.getForm().setValues({
			text : text,
			description : description,
			yigoUrl : record.yigoUrl,
			yigoKey : record.yigoKey,
			recordMpLog : record.recordMpLog,
			yigoDataSource : record.dataSourceId,
			midDataSource : record.midDataSourceId,
			updateSql : record.updateSql,
			pollingFrequency : record.pollingFrequency,
			statusCanUpdate : record.statusCanUpdate,
			autoRun : record.autoRun,
			errorUpdateSql : record.errorUpdateSql,
			billKeyTableMapping : record.billKeyTableMapping,
			billDbTable : record.billDbTable
		});
		getTableToYigo2TabpanelConfigItems(win_form, record);
	}
	var win = Ext.create('Ext.Window', {
		title : 'table2Yigo2配置[' + newtablename + ']',
		width : 900 * bokedee_width,
		height : 610 * bokedee_height,
		draggable : false,
		autoScroll : true,
		// resizable : false,
		modal : true,
		buttons : win_buttons,
		items : [ win_form ]
	});
	win.show();
}
/**
 * tabletoyigo2 选择表的列名
 */
function chooseTableToYigo2Columns(win_form, json) {
	var mapData = json;
	var win_buttons = [
			{
				text : '确定',
				handler : function() {
					var tableNames = mapData.billTable.split(',');// 数组第一个主表名
					// 其他子表名
					var Mapping = mapData.billKeyTableMapping;
					win_form.getForm().setValues({// 把主表名称保存起来
						billTable : tableNames[0],
						billKeyTableMapping : JSON.stringify(Mapping)
					});
					var result = {};
					var tabstore = Ext.getCmp('win_form_grid' + tableNames[0])
							.getSelectionModel().selected;
					result[tableNames[0]] = storeToObj(tabstore);
					for (var i = 1; i < tableNames.length; i++) {
						tabstore = Ext.getCmp('win_form_grid' + tableNames[i])
								.getSelectionModel().selected;
						if (tabstore.length > 0) {
							result[tableNames[i]] = storeToObj(tabstore);
						} else {
							tableNames = Ext.Array.remove(tableNames,
									tableNames[i]);
							i--;
						}
					}
					if (tableNames.length != 0) {
						mapData.billTable = tableNames.join(',');
						getTableToYigo2TabpanelConfigItems(win_form, mapData,
								result);
					}
					win.close();
					getCmp('win_form_tabpanel').show();
					getCmp('updateSql').show();
					getCmp('errorUpdateSql').show();
				}
			}, {
				text : '取消',
				handler : function() {
					win.close();
				}
			} ];
	var tabpanel_chooseColumns = Ext.create('Ext.tab.Panel', {
		width : '100%',
		height : '100%',
		items : []
	});
	var win = Ext.create('Ext.Window', {
		title : '选择表的列名',
		width : 800 * bokedee_width,
		height : 450 * bokedee_height,
		draggable : false,
		autoScroll : true,
		// resizable : false,
		modal : true,
		buttons : win_buttons,
		items : [ tabpanel_chooseColumns ]
	});
	// 根据table名创建tabpanel的items
	var tabpanelitems = getTableToYigo2TabpanelItems(mapData);
	tabpanel_chooseColumns.add(tabpanelitems);
	win.show();
}
/**
 * 返回 tableToYigo2 的items数组
 */
function getTableToYigo2TabpanelItems(map) {
	var tableNames = map.billTable.split(',');// 数组第一个主表名 ，其他子表名
	var result = [];
	for (var i = 0; i < tableNames.length; i++) {
		var str = Ext.create('Ext.grid.Panel', {
			title : tableNames[i],
			id : 'win_form_grid' + tableNames[i],
			store : Ext.create('Ext.data.Store', {
				fields : [ 'caption', 'key', 'dataType', 'dbColumnName',
						'itemKey', 'dicTable' ],
				data : map[tableNames[i]],
				autoLoad : true
			}),
			margin : '5 0 0 5',
			width : '100%',
			height : '100%',
			selModel : Ext.create('Ext.selection.CheckboxModel', {
				mode : 'MULTI',
				checkOnly : true
			}),
			columns : [ {
				xtype : 'rownumberer',
				width : 30,
				locked : true,
				menuDisabled : true,
				sortable : false
			}, {
				header : '字段名',
				dataIndex : 'key',
				sortable : false,
				locked : true,
				menuDisabled : true,
				flex : 1,
				field : 'textfield'
			}, {
				header : '中文描述',
				dataIndex : 'caption',
				sortable : false,
				menuDisabled : true,
				flex : 1,
				field : 'textfield'
			}, {
				header : '字段类型',
				dataIndex : 'dataType',
				sortable : false,
				menuDisabled : true,
				flex : 1,
				field : 'textfield'
			}, {
				header : '数据库表列名',
				dataIndex : 'dbColumnName',
				sortable : false,
				menuDisabled : true,
				flex : 1,
				field : 'textfield'
			}, {
				header : '字典Key',
				dataIndex : 'itemKey',
				sortable : false,
				menuDisabled : true,
				flex : 1,
				field : 'textfield'
			}, {
				header : '字典表',
				dataIndex : 'dicTable',
				sortable : false,
				menuDisabled : true,
				flex : 1,
				field : 'textfield'
			} ]
		});
		result.push(str);
	}
	return result;
}
/**
 * 返回的TableToYigo2 两个数据源之间的配置items数组
 */
function getTableToYigo2TabpanelConfigItems(win_form, map, selected) {
	var tableNames = map.billTable.split(',');
	var result = [];
	var keys = Ext.getCmp('win_form_tabpanel').items.keys;
	for (var i = 0; i < tableNames.length; i++) {
		if (Ext.Array.contains(keys, tableNames[i])) {// 如果表的tab已经有了，只需要把store加入就行
			// 已有的key不能再加入
			var items = Ext.getCmp('win_form_tableToYigo2' + tableNames[i]).store.data.items;
			for (var x = 0; x < selected[tableNames[i]].length; x++) {
				var addkey = selected[tableNames[i]][x].key;// 要加入的key
				for (var y = 0; y < items.length; y++) {
					if (addkey == items[y].data.key) {// 如果key存在了 移除掉
						selected[tableNames[i]] = Ext.Array.remove(
								selected[tableNames[i]],
								selected[tableNames[i]][x]);
						x--;
						break;
					}
				}
			}
			Ext.getCmp('win_form_tableToYigo2' + tableNames[i]).store
					.add(selected[tableNames[i]]);
		} else {// 还没有 创建tab
			var p_tbar_items = [ {
				text : '添加',
				scale : 'small',
				icon : 'images/add.png',
				width : 50,
				handler : function() {

					win_form.currentActive.items.items[1].store.add([ {
						'midkey' : '',
						'key' : '',
						'caption' : '',
						'dataType' : 'Varchar',
						'allowBlank' : 'false',
						'primaryKey' : 'false'
					} ]);
				}
			}, {
				text : '删除',
				scale : 'small',
				icon : 'images/shanchu.png',
				width : 50,
				handler : function() {
					var form = win_form.currentActive.items.items[1];
					if (form.selModel.selected.length > 0) {
						form.store.remove(form.selModel.getSelection());
					}
				}
			} ];
			var win_form_Config_grid = Ext
					.create(
							'Ext.grid.Panel',
							{
								id : 'win_form_tableToYigo2' + tableNames[i],
								store : Ext.create('Ext.data.Store', {
									fields : [ 'midKey', 'key', 'caption',
											'dataType', 'allowBlank',
											'primaryKey', 'dicTable' ],
									data : selected ? selected[tableNames[i]]
											: map[tableNames[i] + '_store'],
									autoLoad : true
								}),
								width : '100%',
								tbar : p_tbar_items,
								selModel : Ext.create(
										'Ext.selection.CheckboxModel', {
											mode : 'MULTI',
											checkOnly : true
										}),
								columns : [
										{
											xtype : 'rownumberer',
											width : 30,
											locked : true,
											menuDisabled : true,
											sortable : false
										},
										{
											header : '中间表字段名',
											dataIndex : 'midKey',
											sortable : false,
											locked : true,
											menuDisabled : true,
											flex : 2,
											field : {
												xtype : 'combobox',
												name : 'type',
												store : Ext
														.create(
																'Ext.data.Store',
																{
																	storeId : 'midKeycombobox'
																			+ tableNames[i],
																	fields : [ {
																		name : 'value',
																		type : 'string'
																	} ],
																	data : []
																}),
												displayField : 'value',
												valueField : 'value',
												queryMode : 'local'
											}
										},
										{
											header : 'Yigo字段名',
											dataIndex : 'key',
											sortable : false,
											menuDisabled : true,
											flex : 1,
											field : 'textfield'
										},
										{
											header : '中文描述',
											dataIndex : 'caption',
											sortable : false,
											menuDisabled : true,
											flex : 1,
											field : 'textfield'
										},
										{
											header : '字段类型',
											dataIndex : 'dataType',
											sortable : false,
											menuDisabled : true,
											flex : 1,
											field : {
												xtype : 'combobox',
												editable : false,
												name : 'type',
												store : [ 'Long', 'Numeric',
														'Varchar', 'Decimal',
														'Int', 'Date',
														'TimeStamp', 'Status',
														'DateTime' ]
											}
										},
										{
											header : '字典表',
											dataIndex : 'dicTable',
											flex : 2,
											sortable : false,
											menuDisabled : true,
											field : 'textfield'
										},
										{
											header : '是否必填',
											sortable : false,
											menuDisabled : true,
											dataIndex : 'allowBlank',
											flex : 1,
											renderer : function(value) {
												if (value == 'true') {
													return '是';
												} else {
													return '否';
												}
											},
											field : {
												xtype : 'combobox',
												store : Ext
														.create(
																'Ext.data.Store',
																{
																	fields : [
																			{
																				name : 'displayField',
																				type : 'string'
																			},
																			{
																				name : 'value',
																				type : 'string'
																			} ],
																	data : [
																			{
																				value : 'true',
																				displayField : '是'
																			},
																			{
																				value : 'false',
																				displayField : '否'
																			} ]
																}),
												editable : false,
												displayField : 'displayField',
												valueField : 'value',
												queryMode : 'local',
												value : 'false'
											}
										},
										{
											header : '是否为主键',
											sortable : false,
											menuDisabled : true,
											dataIndex : 'primaryKey',
											flex : 1,
											renderer : function(value) {
												if (value == 'true') {
													return '是';
												} else {
													return '否';
												}
											},
											field : {
												xtype : 'combobox',
												store : Ext
														.create(
																'Ext.data.Store',
																{
																	fields : [
																			{
																				name : 'displayField',
																				type : 'string'
																			},
																			{
																				name : 'value',
																				type : 'string'
																			} ],
																	data : [
																			{
																				value : 'true',
																				displayField : '是'
																			},
																			{
																				value : 'false',
																				displayField : '否'
																			} ]
																}),
												editable : false,
												displayField : 'displayField',
												valueField : 'value',
												queryMode : 'local',
												value : 'false'
											}
										} ],
								plugins : Ext
										.create(
												'Ext.grid.plugin.CellEditing',
												{
													clicksToEdit : 1,
													listeners : {
														edit : function(editor,
																e, eOpts) {
															if (e.field == "primaryKey"
																	&& e.value == 'true') {
																e.record.data.allowBlank = 'true';
																e.record
																		.commit();
															}
														},
														beforeedit : function(
																editor, e) {
															if (editor.field == "dicTable") {
																var win_Value_form = Ext
																		.create(
																				'Ext.form.Panel',
																				{
																					border : 1,
																					items : [ {
																						xtype : 'textarea',
																						name : 'dicTableValue',
																						width : 400,
																						height : 250,
																						value : editor.value
																					} ]
																				});
																var win_Value = Ext
																		.create(
																				'Ext.Window',
																				{
																					title : '输入sql或表名',
																					draggable : false,
																					autoScroll : true,
																					resizable : false,
																					layout : 'fit',
																					modal : true,
																					buttons : [
																							{
																								text : '确定',
																								handler : function() {
																									editor.record.data.dicTable = win_Value_form
																											.getValues().dicTableValue;
																									editor.grid.store
																											.removeAt(editor.rowIdx);
																									editor.grid.store
																											.insert(
																													editor.rowIdx,
																													editor.record)
																									win_Value
																											.close();
																								}
																							},
																							{
																								text : '取消',
																								handler : function() {
																									win_Value
																											.close();
																								}
																							} ],
																					items : [ win_Value_form ]
																				})
																		.show();
															}
														}
													}
												}),
								height : 240 * bokedee_height
							});
			var win = Ext
					.create(
							'Ext.form.Panel',
							{
								title : tableNames[i],
								closable : i != 0,
								id : tableNames[i],
								autoScroll : true,
								layout : 'fit',
								draggable : false,
								resizable : false,
								listeners : {
									activate : function(tab) {
										win_form.currentActive = tab;
									}
								},
								items : [
										{
											xtype : 'fieldcontainer',
											layout : 'hbox',
											width : '100%',
											items : [
													{
														xtype : 'textarea',
														fieldLabel : '中间表查询语句',
														margins : '5 0 0 0',
														height : 40,
														value : map[tableNames[i]
																+ '_sql'],
														flex : 5,
														name : 'midTableSql',
														allowBlank : false
													},
													{
														xtype : 'button',
														margins : '15 5 0 10',
														text : '获取中间表字段名',
														flex : 1,
														handler : function() {
															var form_midDataSource = win_form
																	.getValues().midDataSource;
															var form_midTableSql = win_form.currentActive.items.items[0].items.items[0].rawValue
																	.Trim();
															var firstSql = getCmp('win_form_tabpanel').items.items[0].items.items[0].items.items[0].rawValue
																	.Trim();
															if (null == form_midDataSource
																	|| '' == form_midDataSource) {
																Ext.Msg
																		.alert(
																				'提示',
																				'请选择中间表数据源！！！');
																return;
															}
															if (null == firstSql
																	|| '' == firstSql) {
																Ext.Msg
																		.alert(
																				'提示',
																				'中间表到主表的查询语句不能为空！！！');
																return;
															}
															if (null == form_midTableSql
																	|| '' == form_midTableSql) {
																Ext.Msg
																		.alert(
																				'提示',
																				'中间表查询语句不能为空！！！');
																return;
															}
															bodyLoadingMask
																	.show();
															Ext.Ajax
																	.request({
																		url : 'interfaceSimpleConfigTableToYigo20Controller.do?actionType=getColumnsBySql',
																		params : {
																			id : form_midDataSource,
																			firstSql : firstSql,
																			sql : form_midTableSql
																		},
																		success : function(
																				response) {
																			bodyLoadingMask
																					.hide();
																			var result = Ext
																					.decode(response.responseText);
																			if (result.result) {
																				var comboxStore = Ext
																						.getStore('midKeycombobox'
																								+ win_form.currentActive.id);
																				comboxStore
																						.removeAll();
																				comboxStore
																						.add(result.data);// 更新combox的store
																				// 更新行记录
																				var activeStore = win_form.currentActive.items.items[1].store;
																				var records = activeStore.data.items;
																				for (var i = 0; i < records.length; i++) {
																					var data = records[i].data;
																					if ('' == data.midKey) {
																						for (var x = 0; x < result.data.length; x++) {
																							result.data[x];
																							if (data.key
																									.toUpperCase() == result.data[x].data.value
																									.toUpperCase()) {// 如果字段名相同（忽略大小写）
																								data.midKey = data.key
																										.toUpperCase();
																								activeStore
																										.removeAt(i);
																								activeStore
																										.insert(
																												i,
																												data);
																								break;
																							}
																						}
																					}
																				}
																			} else {
																				Ext.Msg
																						.alert(
																								'失败',
																								result.data);
																			}

																		},
																		failure : function(
																				response) {
																			bodyLoadingMask
																					.hide();
																			var result = Ext
																					.decode(response.responseText);
																			Ext.Msg
																					.alert(
																							'失败',
																							result.data);
																		}

																	});

														}
													} ]
										}, win_form_Config_grid ]
							});
			result.push(win);
		}
	}
	Ext.getCmp('win_form_tabpanel').add(result);
}