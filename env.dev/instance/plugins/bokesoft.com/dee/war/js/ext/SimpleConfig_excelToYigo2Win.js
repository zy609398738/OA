/**
 * 配置的window
 */
function excelToYigo2Win(text, description, record, detailId, detailType,
		newtablename, hidden) {
	var win_buttons = [{
		text : '保存',
		handler : function() {
			var form_text = win_form.getValues().text;
			var form_description = win_form.getValues().description;
			var form_yigoUrl = win_form.getValues().yigoUrl;
			var form_yigoKey = win_form.getValues().yigoKey;
			var form_recordMpLog = win_form.getValues().recordMpLog;
			var form_dispatchVM = win_form.getValues().dispatchVM;
			var form_DataSourceId = Ext.getCmp('yigoDataSource').value;
			var form_DataSourceName = Ext.getCmp('yigoDataSource').rawValue
			var form_inboundType = Ext.getCmp('inboundType').value;
			var form_sheetIndex = win_form.getValues().sheetIndex;
			var form_sheetName = win_form.getValues().sheetName;
			var form_sheetStartLine = win_form.getValues().sheetStartLine;
			var form_sheetTitle = win_form.getValues().sheetTitle;
			var form_endConditions = win_form.getValues().endConditions;
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
				Ext.Msg.alert('提示', '数据源不能为空！！！');
				return;
			}
			if ((null == form_sheetIndex || '' == form_sheetIndex)
					&& (null == form_sheetName || '' == form_sheetName)) {
				Ext.Msg.alert('提示', 'Sheet名称和索引必须填一个！！！');
				return;
			}
			if (null == form_sheetStartLine || '' == form_sheetStartLine) {
				Ext.Msg.alert('提示', '起始行不能为空！！！');
				return;
			}
			if (Ext.getCmp('win_form_tabpanel').items.length == 0) {
				Ext.Msg.alert('提示', '至少需要配置一张表！！！');
				return;
			}
			var form_billKeyTableMapping=win_form.getValues().billKeyTableMapping;
			var obj=Ext.decode(form_billKeyTableMapping);
			var arrKey=Ext.getCmp('win_form_tabpanel').items.keys;
			var arrTable=new Array();
			for(var i=0;i<arrKey.length;i++){
				var temp=arrKey[i];
				for(var key in obj){
					if(key==temp){
						arrTable[i]=obj[key];
					}
				}
			}
			var form_billDbTable =arrTable.join(",");
			var form_billTable = Ext.getCmp('win_form_tabpanel').items.keys
					.join(',');
			var yigoconfig = {
				yigoUrl : form_yigoUrl,
				yigoKey : form_yigoKey,
				recordMpLog : form_recordMpLog,
				billTable : form_billTable,
				billDbTable:form_billDbTable,
				dataSourceId : form_DataSourceId,
				dispatchVM : form_dispatchVM,
				dataSourceName : form_DataSourceName,
				inboundType : form_inboundType,
				sheetName : form_sheetName,
				sheetIndex : form_sheetIndex,
				sheetStartLine : form_sheetStartLine,
				sheetTitle : form_sheetTitle,
				statusCanUpdate : win_form.getValues().statusCanUpdate,
				endConditions : form_endConditions,
				billKeyTableMapping:form_billKeyTableMapping
			}
			if ('vm' == form_inboundType) {
				var form_path = win_form.getValues().path;
				if (null == form_path || '' == form_path) {
					Ext.Msg.alert('提示', 'PATH不能为空！！！');
					return;
				} else {
					yigoconfig.path = form_path
				}
			} else if ('http' == form_inboundType) {
				var form_port = win_form.getValues().port;
				var form_path = win_form.getValues().path;
				if (null == form_path || '' == form_path || null == form_port
						|| '' == form_port) {
					Ext.Msg.alert('提示', '端口和PATH都不能为空！！！');
					return;
				} else {
					yigoconfig.port = form_port;
					yigoconfig.path = form_path
				}

			}
			var tableNames = form_billTable.split(',');// 数组第一个主表名 ，其他子表名
			for (var i = 0; i < tableNames.length; i++) {
				yigoconfig[tableNames[i] + '_store'] = storeToObj(Ext
						.getCmp(tableNames[i]).store);
			}
			var mapData = {// 第一个map
				id : detailId,
				text : form_text,
				description : form_description,
				type : detailType,
				data : yigoconfig
			}
			bodyLoadingMask.show();
			Ext.Ajax.request({
				url : 'interfaceExcelToYigo20Controller.do?actionType=updateSdInterfaceExcelToYigo20',
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
	var p_tbar_items2 = [{
				text : '添加',
				scale : 'small',
				icon : 'images/add.png',
				width : 50,
				handler : function() {
					win_form.currentActive.store.add([{
								"colName" : "",
								"key" : "",
								"caption" : "",
								"dataType" : "String",
								"allowBlank" : "false",
								"primaryKey" : "false"
							}]);
				}
			}, {
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
			}];

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
					emptyText : '只能有数字、减号、下划线和字母组成',
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
								labelWidth : 100,
								margins : '0 0 0 10',
								flex : 7
							}, {
								xtype : 'button',
								margins : '0 0 0 10',
								text : '获取信息',
								handler : function() {
									var form_yigoUrl = win_form.getValues().yigoUrl;
									var form_yigoKey = win_form.getValues().yigoKey;
									if (null == form_yigoUrl
											|| '' == form_yigoUrl) {
										Ext.Msg.alert('提示', 'YiGO访问地址不能为空！！！');
										return;
									}
									if (null == form_yigoKey
											|| '' == form_yigoKey) {
										Ext.Msg.alert('提示', 'YiGO单据key不能为空！！！');
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
											var result = Ext
													.decode(response.responseText);
											if (result.result) {
												chooseExcelToYigo2Columns(
														win_form, result.data);
											} else {
												Ext.Msg
														.alert('失败',
																result.data);
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
							}]
				}, {
					xtype : 'fieldcontainer',
					layout : 'hbox',
					width : '100%',
					items : [{
								fieldLabel : 'YiGO数据源'+needToFill,
								flex : 1,
								name : 'yigoDataSource',
								id : 'yigoDataSource',
								allowBlank : false,
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
								fieldLabel : '记录详细日志',
								margins : '0 0 0 20',
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
							}, {
								xtype : 'textfield',
								fieldLabel : '可更新Status值',
								name : 'statusCanUpdate',
								// labelWidth : 50,
								margins : '0 0 0 20',
								value : '',
								flex : 0.8
							}]
				}, {
					xtype : 'fieldcontainer',
					layout : 'hbox',
					width : '100%',
					items : [{
						fieldLabel : 'inbound类型',
						width : 250,
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
												value : 'http',
												displayField : 'http'
											}, {
												value : 'vm',
												displayField : 'vm'
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
									if (newValue == 'vm') {
										getCmp('numberfieldport').hide();
										getCmp('textfieldpath').show();
									} else if (newValue == 'http') {
										getCmp('numberfieldport').show();
										getCmp('textfieldpath').show();
									} else {
										getCmp('numberfieldport').hide();
										getCmp('textfieldpath').hide();
									};
								}
							}
						}
					}, {
						xtype : 'numberfield',
						labelWidth : 50,
						fieldLabel : '端口号',
						minValue : 1,
						id : 'numberfieldport',
						hideTrigger : true,
						hidden : true,
						name : 'port',
						margins : '0 0 0 10',
						width : 140
					}, {
						xtype : 'textfield',
						labelWidth : 40,
						fieldLabel : 'PATH',
						id : 'textfieldpath',
						name : 'path',
						hidden : true,
						margins : '0 0 0 10',
						width : 365
					}]
				}, {
					xtype : 'fieldcontainer',
					fieldLabel : 'Sheet索引',
					layout : 'hbox',
					defaultType : 'textfield',
					items : [{
								name : 'sheetIndex',
								emptyText : 'index优先',
								size : 10,
								xtype : 'numberfield',
								minValue : 1
							}, {
								name : 'sheetName',
								margins : '0 0 0 10',
								fieldLabel : 'Sheet名字',
								labelWidth : 70,
								emptyText : 'name'
							}, {
								fieldLabel : '标题行',
								margins : '0 0 0 10',
								labelWidth : 50,
								size : 10,
								name : 'sheetTitle',
								xtype : 'numberfield',
								minValue : 1
							}, {
								fieldLabel : '起始行',
								margins : '0 0 0 10',
								labelWidth : 50,
								size : 10,
								name : 'sheetStartLine',
								xtype : 'numberfield',
								minValue : 1
							}]
				}, {
					xtype : 'fieldcontainer',
					fieldLabel : '结束条件',
					layout : 'hbox',
					defaultType : 'textfield',
					items : [{
						emptyText : '不填时是整行为空结束，或填等式条件：列名=* 如A=test,B=null有多个等式条件用\',\'隔开',
						flex : 1.3,
						name : 'endConditions'
					}, {
						fieldLabel : '循环分发单条数据',
						margins : '0 0 0 10',
						labelWidth : 100,
						xtype : 'combobox',
						name : 'dispatchVM',
						flex : 0.45,
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
					xtype : 'tabpanel',
					tbar : p_tbar_items2,
					hidden : hidden,
					id : 'win_form_tabpanel',
					items : []
				}]
	});
	if (record && record.billTable) {
		win_form.getForm().setValues({
					text : text,
					description : description,
					yigoUrl : record.yigoUrl,
					yigoKey : record.yigoKey,
					recordMpLog : record.recordMpLog,
					dispatchVM : record.dispatchVM,
					yigoDataSource : record.dataSourceId,
					inboundType : record.inboundType,
					port : record.port,
					path : record.path,
					sheetName : record.sheetName,
					sheetIndex : record.sheetIndex,
					sheetStartLine : record.sheetStartLine,
					sheetTitle : record.sheetTitle,
					statusCanUpdate : record.statusCanUpdate,
					endConditions : record.endConditions,
					billKeyTableMapping:record.billKeyTableMapping
				});
		getExcelToYigo2TabpanelConfigItems(win_form, record);
	}
	var win = Ext.create('Ext.Window', {
				title : detailType + '配置[' + newtablename + ']',
				width : 800*bokedee_width,
				height : 600*bokedee_height,
				draggable : false,
				autoScroll : true,
				//resizable : false,
				modal : true,
				buttons : win_buttons,
				items : [win_form]
			});
	win.show();
}
/**
 * 解析返回的信息 创建多个tabpanel 选择列名
 */
function chooseExcelToYigo2Columns(win_form, json) {
	var mapData = json;
	var win_buttons = [{
		text : '确定',
		handler : function() {
			var tableNames = mapData.billTable.split(',');// 数组第一个主表名 其他子表名
			var Mapping = mapData.billKeyTableMapping;
			win_form.getForm().setValues({// 把主表名称保存起来
				billTable : tableNames[0],
				billKeyTableMapping: JSON.stringify(Mapping)
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
					tableNames = Ext.Array.remove(tableNames, tableNames[i]);
					i--;
				}
			}
			if (tableNames.length != 0) {
				mapData.billTable = tableNames.join(',');
				getExcelToYigo2TabpanelConfigItems(win_form, mapData, result);
			}
			win.close();
			getCmp('win_form_tabpanel').show();
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
				title : '选择表的列名',
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
	var tabpanelitems = getTabpanelitems(mapData);
	tabpanel_chooseColumns.add(tabpanelitems);
	win.show();
}
function getExcelToYigo2TabpanelConfigItems(win, map, selected) {
	var tableNames = map.billTable.split(',');
	var result = [];
	var keys = Ext.getCmp('win_form_tabpanel').items.keys;
	for (var i = 0; i < tableNames.length; i++) {
		if (Ext.Array.contains(keys, tableNames[i])) {// 如果表的tab已经有了，只需要把store加入就行
			// 已有的key不能再加入
			var items = Ext.getCmp(tableNames[i]).store.data.items;
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
			Ext.getCmp(tableNames[i]).store.add(selected[tableNames[i]]);
		} else {// 还没有 创建tab
			var win_form_Config_grid = Ext.create('Ext.grid.Panel', {
				title : tableNames[i],
				id : tableNames[i],
				closable : i != 0,
				store : Ext.create('Ext.data.Store', {
							fields : ['colName', 'key', 'caption', 'dataType',
									'allowBlank', 'primaryKey', 'dicTable'],
							data : selected
									? selected[tableNames[i]]
									: map[tableNames[i] + '_store'],
							autoLoad : true
						}),
				margin : '5 0 0 5',
				width : '100%',
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
							header : 'Excel列名',
							dataIndex : 'colName',
							sortable : false,
							locked : true,
							menuDisabled : true,
							flex : 2,
							field : {
								xtype : 'combobox',
								name : 'colName',
								store : ['A', 'B', 'C', 'D', 'E', 'F', 'G',
										'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O',
										'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W',
										'X', 'Y', 'Z']
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
						}, {
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
								store : Ext.create('Ext.data.Store', {
											fields : [{
														name : 'displayField',
														type : 'string'
													}, {
														name : 'value',
														type : 'string'
													}],
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
							}
						}, {
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
								store : Ext.create('Ext.data.Store', {
											fields : [{
														name : 'displayField',
														type : 'string'
													}, {
														name : 'value',
														type : 'string'
													}],
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
							}
						}],
				plugins : Ext.create('Ext.grid.plugin.CellEditing', {
					clicksToEdit : 1,
					listeners : {
						edit:function(editor,e,eOpts) {
							if (e.field == "primaryKey"&&e.value=='true') {
								e.record.data.allowBlank='true';
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
				listeners : {
					activate : function(tab) {
						win.currentActive = tab;
					}
				},
				height : 250*bokedee_height
			});
			result.push(win_form_Config_grid);
		}
	}
	Ext.getCmp('win_form_tabpanel').add(result);
}
