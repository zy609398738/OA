/**
 * 数据库表到表的yigo系统
 * 
 */
function yigo2ToTableWin(text, description, record, detailId, detailType,
		newtablename, hidden) {
	var win_buttons = [{
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
			var form_selectSql = win_form.getValues().selectSql.Trim();
			var form_updateSql = win_form.getValues().updateSql.Trim();
			var form_pollingFrequency = win_form.getValues().pollingFrequency;
			var form_httpport = win_form.getValues().httpport.trim();
			var form_httppath = win_form.getValues().httppath.trim();
			var form_inboundType = Ext.getCmp('inboundType').value;
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
			if (null == form_midDataSourceId || '' == form_midDataSourceId) {
				Ext.Msg.alert('提示', '中间表数据源不能为空！！！');
				return;
			}
			if ('jdbc' == form_inboundType
					&& (form_pollingFrequency == null || form_pollingFrequency == '')) {
				Ext.Msg.alert('提示', '间隔时间不能为空！！！');
				return;
			}
			if ('http' == form_inboundType
					&& (form_httpport == null || form_httpport == ''
							|| form_httppath == null || form_httppath == '')) {
				Ext.Msg.alert('提示', 'http端口号和PAHT不能为空！！！');
				return;
			}
			if (Ext.getCmp('win_form_tabpanel').items.length == 0) {
				Ext.Msg.alert('提示', '至少需要配置一张表！！！');
				return;
			}
			var form_midTable = Ext.getCmp('win_form_tabpanel').items.keys
					.join(',');
			var yigoconfig = {
				yigoUrl : form_yigoUrl,
				yigoKey : form_yigoKey,
				recordMpLog : form_recordMpLog,
				midTable : form_midTable,
				dataSourceId : form_DataSourceId,
				dataSourceName : form_DataSourceName,
				midDataSourceId : form_midDataSourceId,
				midDataSourceName : form_midDataSourceName,
				selectSql : form_selectSql,
				updateSql : form_updateSql,
				errorUpdateSql : win_form.getValues().errorUpdateSql,
				autoRun : win_form.getValues().autoRun,
				httpport : form_httpport,
				httppath : form_httppath,
				inboundType : form_inboundType,
				pollingFrequency : form_pollingFrequency,
				tableType : win_form.getValues().tableType,
				billKeyTableMapping:win_form.getValues().billKeyTableMapping
			};
			var midTableData = {};
			var form_billKeyTableMapping=win_form.getValues().billKeyTableMapping;
			var obj1=Ext.decode(form_billKeyTableMapping);
			var tableNames = form_midTable.split(',');// 中间表集合
			for (var i = 0; i < tableNames.length; i++) {
				var midTabPanel = getCmp('win_form_tabpanel_mid_'
						+ tableNames[i]);
				var items = midTabPanel.items.items;
				var obj;
				var obj2 = {};
				var billTable = new Array([items.length]);
				for (var x = 0; x < items.length; x++) {
					obj = items[x];
					billTable[x] = obj.title;
					obj2[obj.title] = storeToObj(obj.store);
				}
				var arrTable=new Array();
				for(var j=0;j<billTable.length;j++){
					var temp=billTable[j];
					for(var key in obj1){
						if(key==temp){
							arrTable[j]=obj1[key];
						}
					}
				}
				obj2.billTable = billTable.join(',');
				obj2.billDbTable=arrTable.join(',');
				midTableData[tableNames[i]] = obj2;
			}
			yigoconfig.midTableData = midTableData;
			var mapData = {// 第一个map
				id : detailId,
				text : form_text,
				description : form_description,
				type : detailType,
				data : yigoconfig
			}
			bodyLoadingMask.show();
			Ext.Ajax.request({
				url : 'interfaceSimpleConfigYigo2ToTableController.do?actionType=updateSdInterfaceTableToYigo2',
				params : {
					data : Ext.encode(mapData)
				},
				success : function(response) {
					bodyLoadingMask.hide();
					var result = Ext.decode(response.responseText);
					if (result.result) {
						Ext.getCmp('SimpleConfiggridPanel').store.load();
						win.close();
						//Ext.Msg.alert('成功', '保存成功');
						Ext.bokedee.msg('保存信息', 1000,'保存成功');
					} else {
						Ext.Msg.alert('失败', result.data);
					}
				},
				failure : function(response) {
					bodyLoadingMask.hide();
					var result = Ext.decode(response.responseText);
					Ext.Msg.alert('失败', result.data);
				}

			});

		}
	}, {
		text : '取消',
		handler : function() {
			win.close();
		}
	}]

	var yigodatasourceUrl = 'interfaceInfoFindController.do?actionType=findDatasourceForJdbcConnector';
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
		items : [{
					name : 'billKeyTableMapping',
					hidden : true,
					readOnly : true
				},{
					fieldLabel : 'ID',
					name : 'id',
					hidden : true,
					readOnly : true
				}, {
					fieldLabel : '名称'+needToFill,
					name : 'text',
					emptyText : '名称只能由数字、字母、减号和下划线组成',
					value : text,
					allowBlank : false
				}, {
					xtype : 'textarea',
					fieldLabel : '描述',
					name : 'description',
					value : description,
					height : 30,
					allowBlank : true
				}, {
					name : 'tableType',
					fieldLabel : '单据类型',
					hidden : true
				}, {
					fieldLabel : 'YiGO访问地址'+needToFill,
					name : 'textfieldkey',
					xtype : 'fieldcontainer',
					layout : {
						type : 'hbox'
					},
					items : [{
								xtype : 'textfield',
								name : 'yigoUrl',
								emptyText : 'http://ip:端口/Yigo',
								flex : 6,
								allowBlank : false
							}, {
								xtype : 'textfield',
								fieldLabel : '单据key'+needToFill,
								name : 'yigoKey',
								labelWidth : 60,
								margins : '0 0 0 10',
								flex : 7
							}, {
								xtype : 'button',
								margins : '0 0 0 10',
								text : '添加一个中间表',
								handler : function() {
									addOneTableName(win_form);
								}
							}, {
								xtype : 'button',
								margins : '0 0 0 10',
								text : '获取信息',
								handler : function() {
									getYigoInfo(win_form);
								}
							}]
				}, {
					xtype : 'fieldcontainer',
					layout : 'hbox',
					width : '100%',
					items : [{
								fieldLabel : '中间表数据源'+needToFill,
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
								fieldLabel : 'YiGO数据源'+needToFill,
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
								fieldLabel : '自动启动',
								xtype : 'combobox',
								labelWidth : 60,
								margins : '0 0 0 10',
								name : 'autoRun',
								flex : 0.5,
								store : Ext.create('Ext.data.Store', {
											model : 'SimpleCombox',
											data : [{
														value : 'true',
														displayField : '是'
													}, {
														value : 'false',
														displayField : '否'
													}]
										}),
								editable : false,
								displayField : 'displayField',
								valueField : 'value',
								queryMode : 'local',
								value : 'false'
							}, {
								fieldLabel : '记录详细日志',
								margins : '0 0 0 10',
								labelWidth : 85,
								xtype : 'combobox',
								name : 'recordMpLog',
								flex : 0.6,
								store : Ext.create('Ext.data.Store', {
											model : 'SimpleCombox',
											data : [{
														value : 'true',
														displayField : '是'
													}, {
														value : 'false',
														displayField : '否'
													}]
										}),
								editable : false,
								displayField : 'displayField',
								valueField : 'value',
								queryMode : 'local',
								value : 'false'
							}]
				}, {
					xtype : 'fieldcontainer',
					layout : 'hbox',
					width : '100%',
					items : [{
						fieldLabel : 'inbound类型',
						width : 200,
						name : 'inboundType',
						id : 'inboundType',
						allowBlank : false,
						xtype : 'combobox',
						store : Ext.create('Ext.data.Store', {
									model : 'SimpleCombox',
									data : [{
												value : '',
												displayField : '请选择'
											}, {
												value : 'jdbc',
												displayField : 'jdbc'
											}, {
												value : 'http',
												displayField : 'http'
											}],
									autoLoad : true
								}),
						editable : false,
						displayField : 'displayField',
						valueField : 'value',
						queryMode : 'local',
						value : '',
						listeners : {
							'change' : {
								fn : function(combox, newValue, oldValue, eOpts) {
									if (newValue == 'jdbc') {
										getCmp('pollingFrequency').show();
										getCmp('selectSql').show();
										getCmp('httpport').hide();
										getCmp('httppath').hide();
									} else if (newValue == 'http') {
										getCmp('pollingFrequency').hide();
										getCmp('selectSql').hide();
										getCmp('httpport').show();
										getCmp('httppath').show();
									} else {
										getCmp('httpport').hide();
										getCmp('selectSql').hide();
										getCmp('httppath').hide();
										getCmp('pollingFrequency').hide();
									};
								}
							}
						}
					}, {
						xtype : 'numberfield',
						labelWidth : 50,
						fieldLabel : '端口号',
						minValue : 1,
						id : 'httpport',
						hideTrigger : true,
						hidden : true,
						name : 'httpport',
						margins : '0 0 0 10',
						width : 140
					}, {
						xtype : 'textfield',
						labelWidth : 40,
						fieldLabel : 'PATH',
						emptyText:'路径?id=',
						id : 'httppath',
						name : 'httppath',
						hidden : true,
						margins : '0 0 0 10',
						width : 415
					}, {
						xtype : 'numberfield',
						labelWidth : 100,
						fieldLabel : '间隔时间（秒）',
						minValue : 0.7,
						id : 'pollingFrequency',
						hideTrigger : true,
						hidden : true,
						value : 100,
						name : 'pollingFrequency',
						margins : '0 0 0 10',
						width : 300
					}]
				}, {
					xtype : 'tabpanel',
					id : 'win_form_tabpanel',
					hidden : hidden,
					margins : '5 0 5 0',
					items : []
				}, {
					xtype : 'textarea',
					fieldLabel : '轮询查询语句',
					margins : '5 0 0 0',
					name : 'selectSql',
					id : 'selectSql',
					emptyText:'这里写查询符合条件的单据id的SQL语句',
					hidden : hidden,
					height : 25
				}, {
					xtype : 'textarea',
					fieldLabel : '成功更新语句',
					margins : '5 0 0 0',
					name : 'updateSql',
					id : 'updateSql',
					emptyText:'这里更新的SQL语句条件取值为：#[header:inbound:id]',
					hidden : hidden,
					height : 25
				}, {
					xtype : 'textarea',
					fieldLabel : '异常更新语句',
					emptyText:'这里异常更新的SQL语句条件取值为：#[header:inbound:id]',
					margins : '5 0 0 0',
					name : 'errorUpdateSql',
					id : 'errorUpdateSql',
					hidden : hidden,
					height : 25
				}]
	});
	if (record && record.midTable) {
		win_form.getForm().setValues({
					text : text,
					description : description,
					yigoUrl : record.yigoUrl,
					yigoKey : record.yigoKey,
					recordMpLog : record.recordMpLog,
					yigoDataSource : record.dataSourceId,
					midDataSource : record.midDataSourceId,
					updateSql : record.updateSql,
					selectSql : record.selectSql,
					statusCanUpdate : record.statusCanUpdate,
					autoRun : record.autoRun,
					errorUpdateSql : record.errorUpdateSql,
					inboundType : record.inboundType,
					pollingFrequency : record.pollingFrequency,
					httppath : record.httppath,
					httpport : record.httpport,
					tableType : record.tableType,
					billKeyTableMapping:record.billKeyTableMapping
				});
		var names = record.midTable.split(',')
		for (name in names) {
			addTableTable(win_form, names[name], record.midDataSourceId,
					record.midTableData[names[name]])
		}
	}
	var win = Ext.create('Ext.Window', {
				title : 'Yigo2Table配置[' + newtablename + ']',
				width : 900*bokedee_width,
				height : 650*bokedee_height,
				draggable : false,
				autoScroll : true,
//				resizable : false,
				modal : true,
				buttons : win_buttons,
				items : [win_form]
			});
	win.show();
}
/**
 * tabletoyigo 选择表的列名
 */
function chooseYigo2ToTableColumns(win_form, json) {
	var mapData = json;
	var win_buttons = [{
		text : '确定',
		handler : function() {
			var tableNames = mapData.billTable.split(',');// 数组第一个主表名 其他子表名
			var Mapping = mapData.billKeyTableMapping;
			var tableType = mapData.tableType;// 单据类型
			win_form.getForm().setValues({// 把主表名称保存起来
				billKeyTableMapping: JSON.stringify(Mapping),
				tableType : tableType
			});
			var result = {};
//			var tabstore = Ext.getCmp('win_form_grid' + tableNames[0])
//					.getSelectionModel().selected;
//			result[tableNames[0]] = storeToObj(tabstore);
			for (var i = 0; i < tableNames.length; i++) {
				tabstore = Ext.getCmp('win_form_grid' + tableNames[i])
						.getSelectionModel().selected;
				if (tabstore.length > 0) {
					result[tableNames[i]] = storeToObj(tabstore);
				} else {
					tableNames = Ext.Array.remove(tableNames, tableNames[i]);
					i--;
				}
			}
			if (tableNames.length != 0) {
				mapData.billTable = tableNames.join(',');
				getYigo2ToTableTabpanelConfigItems(win_form, mapData, result);
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
	}];
	var tabpanel_chooseColumns = Ext.create('Ext.tab.Panel', {
				width : '100%',
				height : '100%',
				items : []
			});
	var win = Ext.create('Ext.Window', {
				title : '选择要导入到中间表的单据字段',
				width : 800*bokedee_width,
				height : 450*bokedee_height,
				draggable : false,
				autoScroll : true,
//				resizable : false,
				modal : true,
				buttons : win_buttons,
				items : [tabpanel_chooseColumns]
			});
	// 根据table名创建tabpanel的items
	var tabpanelitems = getTableToYigo2TabpanelItems(mapData);
	tabpanel_chooseColumns.add(tabpanelitems);
	win.show();
}
/**
 * 返回 tableToYigo 的items数组
 */
function getTableToYigo2TabpanelItems(map) {
	var tableNames = map.billTable.split(',');// 数组第一个主表名 ，其他子表名
	var result = [];
	for (var i = 0; i < tableNames.length; i++) {
		var str = Ext.create('Ext.grid.Panel', {
					title : tableNames[i],
					id : 'win_form_grid' + tableNames[i],
					store : Ext.create('Ext.data.Store', {
								fields : ['caption', 'key', 'dataType',
										'dbColumnName', 'itemKey', 'dicTable'],
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
					columns : [{
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
							}]
				});
		result.push(str);
	}
	return result;
}
/**
 * 返回的TableToYigo 两个数据源之间的配置items数组
 */
function getYigo2ToTableTabpanelConfigItems(win_form, map, selected) {
	var currentActiveId;
	if (win_form.currentActive) {
		currentActiveId = win_form.currentActive.title;
	} else {
		Ext.Msg.alert('提示', '请先添加中间表！！！');
		return;
	}
	var tableNames = map.billTable.split(',');
	var result = [];
	var keys = Ext.getCmp('win_form_tabpanel_mid_' + currentActiveId).items.keys;
	for (var i = 0; i < tableNames.length; i++) {
		if (Ext.Array.contains(keys, 'win_form_yigoToTable_' + currentActiveId
						+ '_' + tableNames[i])) {// 如果表的tab已经有了，只需要把store加入就行
			// 已有的key不能再加入
			var items = Ext.getCmp('win_form_yigoToTable_' + currentActiveId
					+ '_' + tableNames[i]).store.data.items;
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
			Ext.getCmp('win_form_yigoToTable_' + currentActiveId + '_'
					+ tableNames[i]).store.add(selected[tableNames[i]]);
		} else {// 还没有 创建tab
			var p_tbar_items = [{
				text : '添加',
				scale : 'small',
				icon : 'images/add.png',
				width : 50,
				handler : function() {
					var id = 'win_form_tabpanel_mid_'
							+ win_form.currentActive.id;
					getCmp(getCmp(id).activeTab.id).store.add([{
								'midkey' : '',
								'key' : '',
								'caption' : '',
								'dataType' : 'Varchar',
								'allowBlank' : 'false',
								'primaryKey' : 'false'
							}]);
				}
			}, {
				text : '删除',
				scale : 'small',
				icon : 'images/shanchu.png',
				width : 50,
				handler : function() {
					var id = 'win_form_tabpanel_mid_'
							+ win_form.currentActive.id;
					var form = getCmp(getCmp(id).activeTab.id);
					if (form.selModel.selected.length > 0) {
						form.store.remove(form.selModel.getSelection());
					}
				}
			}];
			var p_store;
			var storeid = 'yigoToTable_midKeycombobox_' + currentActiveId
			if (Ext.data.StoreManager.containsKey(storeid)) {
				p_store = Ext.data.StoreManager.get(storeid);
			} else {
				var p_store = Ext.create('Ext.data.Store', {
							storeId : 'yigoToTable_midKeycombobox_'
									+ currentActiveId,
							fields : [{
										name : 'value',
										type : 'string'
									}],
							data : []
						})
			}

			var win_form_Config_grid = Ext.create('Ext.grid.Panel', {
				id : 'win_form_yigoToTable_' + currentActiveId + '_'
						+ tableNames[i],
				title : tableNames[i],
				closable : true,
				store : Ext.create('Ext.data.Store', {
							fields : ['midKey', 'key', 'caption',
									'dbColumnName', 'dataType', 'dicTable'],
							data : selected
									? selected[tableNames[i]]
									: map[tableNames[i]],
							autoLoad : true
						}),
				width : '100%',
				tbar : p_tbar_items,
				selModel : Ext.create('Ext.selection.CheckboxModel', {
							mode : 'MULTI',
							checkOnly : true
						}),
				columns : [{
							xtype : 'rownumberer',
							width : 30,
							locked : true,
							menuDisabled : true,
							sortable : false
						}, {
							header : '中间表字段名',
							dataIndex : 'midKey',
							sortable : false,
							locked : true,
							menuDisabled : true,
							flex : 2,
							field : {
								xtype : 'combobox',
								name : 'type',
								store : p_store,
								displayField : 'value',
								valueField : 'value',
								queryMode : 'local'
							}
						}, {
							header : 'Yigo字段名',
							dataIndex : 'key',
							sortable : false,
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
							header : '数据库表列名',
							dataIndex : 'dbColumnName',
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
							field : {
								xtype : 'combobox',
								editable : false,
								name : 'type',
								store : ['Long','Numeric',
											'Varchar', 'Decimal', 'Int', 'Date',
											'TimeStamp', 'Status', 'DateTime']
							}
						}, {
							header : '字典表',
							dataIndex : 'dicTable',
							flex : 2,
							sortable : false,
							menuDisabled : true,
							field : 'textfield'
						}],
				plugins : Ext.create('Ext.grid.plugin.CellEditing', {
					clicksToEdit : 1,
					listeners : {
						edit : function(editor, e, eOpts) {
							if (e.field == "primaryKey" && e.value == 'true') {
								e.record.data.allowBlank = 'true';
								e.record.commit();
							}
						},
						beforeedit : function(editor, e) {
							if (editor.field == "dicTable") {
								var win_Value_form = Ext.create(
										'Ext.form.Panel', {
											border : 1,
											items : [{
														xtype : 'textarea',
														name : 'dicTableValue',
														width : 400,
														height : 250,
														value : editor.value
													}]
										});
								var win_Value = Ext.create('Ext.Window', {
									title : '输入sql或表名',
									draggable : false,
									autoScroll : true,
									resizable : false,
									layout : 'fit',
									modal : true,
									buttons : [{
										text : '确定',
										handler : function() {
											editor.record.data.dicTable = win_Value_form
													.getValues().dicTableValue;
											editor.grid.store
													.removeAt(editor.rowIdx);
											editor.grid.store.insert(
													editor.rowIdx,
													editor.record)
											win_Value.close();
										}
									}, {
										text : '取消',
										handler : function() {
											win_Value.close();
										}
									}],
									items : [win_Value_form]
								}).show();
							}
						}
					}
				}),
				height : 255*bokedee_height
			});
			result.push(win_form_Config_grid);
		}
	}
	Ext.getCmp('win_form_tabpanel_mid_' + currentActiveId).add(result);
}
/**
 * 新增一个表名
 * 
 */

function addOneTableName(win_forms) {
	var form_yigoUrl = win_forms.getValues().yigoUrl;
	var form_yigoKey = win_forms.getValues().yigoKey;
	if (null == form_yigoUrl || '' == form_yigoUrl) {
		Ext.Msg.alert('提示', 'YiGO访问地址不能为空！！！');
		return;
	}
	if (null == form_yigoKey || '' == form_yigoKey) {
		Ext.Msg.alert('提示', 'YiGO单据key不能为空！！！');
		return;
	}
	var form_midDataSourceId = Ext.getCmp('midDataSource').value;
	if (Ext.isEmpty(form_midDataSourceId)) {
		Ext.Msg.alert('提示', '请选择中间表数据源');
		return;
	}
	var win_buttons = [{
				text : '确定',
				handler : function() {
					var text = win_form.getValues().text;
					if (null == text || '' == text) {
						Ext.Msg.alert('提示', '名称不能为空！！！');
						return;
					}
					var keys = Ext.getCmp('win_form_tabpanel').items.keys;
					if (Ext.Array.contains(keys, text)) {// 如果表名已经存在
						Ext.Msg.alert('提示', '中间表[' + text + ']已经添加了');
						return;
					}
					win.close();
					addTableTable(win_forms, text, form_midDataSourceId);
				}
			}, {
				text : '取消',
				handler : function() {
					win.close();
				}
			}];
	var win_form = Ext.create('Ext.form.Panel', {
				width : '100%',
				bodyPadding : '5 0 0 0',
				border : 0,
				labelWidth : 50,
				method : 'post',
				layout : 'anchor',
				defaults : {
					anchor : '100%'
				},
				defaultType : 'textfield',
				items : [{
							fieldLabel : '名称',
							name : 'text',
							emptyText : '中间表表名',
							allowBlank : false
						}]
			});
	var win = Ext.create('Ext.Window', {
				title : '中间表表名',
				width : 340,
				height : 150,
				layout : 'absolute',
				draggable : false,
				bodyStyle : 'background:#ffffff;',
//				resizable : false,
				modal : true,
				buttons : win_buttons,
				items : [win_form]
			});
	win.show();
}
/**
 * 添加一个中间表配置tab
 */
function addTableTable(win_form, tablename, dataSourceId, midData) {
	bodyLoadingMask.show();
	Ext.Ajax.request({
		url : 'interfaceSimpleConfigYigo2ToTableController.do?actionType=getColumnsBySql',
		params : {
			id : dataSourceId,
			sql : tablename
		},
		success : function(response) {
			bodyLoadingMask.hide();
			var result = Ext.decode(response.responseText);
			if (result.result) {
				var comboxStore = Ext.create('Ext.data.Store', {
							storeId : 'yigoToTable_midKeycombobox_' + tablename,
							fields : [{
										name : 'value',
										type : 'string'
									}],
							data : result.data
						})
				// var comboxStore = Ext.getStore('midKeycombobox'
				// + win_form.currentActive.id);
				// comboxStore.removeAll();
				// comboxStore.add(result.data);// 更新combox的store
				var win = Ext.create('Ext.form.Panel', {
							title : tablename,
							id : tablename,
							closable : true,
							autoScroll : true,
							layout : 'fit',
							autoShow : true,
							height : 300,
							draggable : false,
//							resizable : false,
							listeners : {
								activate : function(tab) {
									win_form.currentActive = tab;
								}
							},
							items : [{
										xtype : 'tabpanel',
										id : 'win_form_tabpanel_mid_'
												+ tablename,
										margins : '5 0 5 0',
										items : []
									}]
						});
				var tab = Ext.getCmp('win_form_tabpanel');
				tab.add(win);
				tab.setActiveTab(win);
				tab.show();
				if (!midData) {
					getYigoInfo(win_form);
				} else {
					getYigo2ToTableTabpanelConfigItems(win_form, midData, false);
				}

			} else {
				Ext.Msg.alert('失败', result.data);
			}

		},
		failure : function(response) {
			bodyLoadingMask.hide();
			var result = Ext.decode(response.responseText);
			Ext.Msg.alert('失败', result.data);
		}

	});
}
/**
 * 在中间表tab中加入 yigo单据的表信息
 */
function addYigoTab() {

}
/**
 * 获取信息按钮事件
 */
function getYigoInfo(win_form) {
	if (Ext.getCmp('win_form_tabpanel').items.length == 0) {
				Ext.Msg.alert('提示', '至少需要先增加一张中间表！！！');
				return;
			}
	var form_yigoUrl = win_form.getValues().yigoUrl;
	var form_yigoKey = win_form.getValues().yigoKey;
	if (null == form_yigoUrl || '' == form_yigoUrl) {
		Ext.Msg.alert('提示', 'YiGO访问地址不能为空！！！');
		return;
	}
	if (null == form_yigoKey || '' == form_yigoKey) {
		Ext.Msg.alert('提示', 'YiGO单据key不能为空！！！');
		return;
	}
	var form_midDataSourceId = Ext.getCmp('midDataSource').value;
	if (Ext.isEmpty(form_midDataSourceId)) {
		Ext.Msg.alert('提示', '请选择中间表数据源');
		return;
	}
	bodyLoadingMask.show();
	Ext.Ajax.request({
				url : 'interfaceSimpleConfigController.do?actionType=getYiGokeyinfo_2',
				params : {
					url : form_yigoUrl,
					key : form_yigoKey
				},
				success : function(response) {
					bodyLoadingMask.hide();
					var result = Ext.decode(response.responseText);
					if (result.result) {
						chooseYigo2ToTableColumns(win_form, result.data);
					} else {
						Ext.Msg.alert('失败', result.data);
					}

				},
				failure : function(response) {
					bodyLoadingMask.hide();
					var result = Ext.decode(response.responseText);
					Ext.Msg.alert('失败', result.data);
				}

			});
}