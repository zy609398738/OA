/**
 * 配置的window
 */
function sqlToExcelWin(text, description, record, detailId, detailType,
		newtablename, hidden) {
	var p_tbar_items = [{
				text : '添加',
				scale : 'small',
				icon : 'images/add.png',
				width : 50,
				handler : function() {
					win_form_Config_grid.store.add([{
								"colName" : "",
								"dbColumnName" : ""
							}]);
				}
			}, {
				text : '删除',
				scale : 'small',
				icon : 'images/shanchu.png',
				width : 50,
				handler : function() {
					if (win_form_Config_grid.selModel.selected.length > 0) {
						win_form_Config_grid.store
								.remove(win_form_Config_grid.selModel
										.getSelection());
					}
				}
			}];
	var win_form_Config_grid = Ext.create('Ext.grid.Panel', {
				title : 'Excel列名Mapping',
				id : 'colNamesMapping',
				tbar : p_tbar_items,
				store : Ext.create('Ext.data.Store', {
							fields : ['colName', 'dbColumnName'],
							data : record ? record.colNamesMapping : [],
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
							width : 35,
							locked : true,
							text : '序号',
							menuDisabled : true,
							sortable : false
						}, {
							header : 'Excel列名',
							dataIndex : 'colName',
							sortable : false,
							locked : true,
							menuDisabled : true,
							flex : 1,
							field : 'textfield'
						}, {
							header : 'SQL执行的列名',
							dataIndex : 'dbColumnName',
							sortable : false,
							menuDisabled : true,
							flex : 1,
							field : 'textfield'
						}],
				plugins : Ext.create('Ext.grid.plugin.CellEditing', {
							clicksToEdit : 1
						}),
				height : 280*bokedee_height
			});
	var win_buttons = [{
		text : '保存',
		handler : function() {
			var form_text = win_form.getValues().text;
			var form_description = win_form.getValues().description;
			var form_recordMpLog = win_form.getValues().recordMpLog;
			var form_excelType = win_form.getValues().excelType;
			var form_DataSourceId = Ext.getCmp('yigoDataSource').value;
			var form_sheetName = win_form.getValues().sheetName;
			var form_sheetStartLine = win_form.getValues().sheetStartLine;
			var form_sheetTitle = win_form.getValues().sheetTitle;
			var form_path = win_form.getValues().path.trim();
			var form_updateSql = win_form.getValues().updateSql.Trim();
			var form_selectSql = win_form.getValues().selectSql.trim();
			var form_pollingFrequency = win_form.getValues().pollingFrequency;
			var form_inboundType = Ext.getCmp('inboundType').value;
			var form_outboundType = Ext.getCmp('outboundType').value;
			var form_httpport = win_form.getValues().httpport.trim();
			var form_httppath = win_form.getValues().httppath.trim();
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
			if (null == form_selectSql || '' == form_selectSql) {
				Ext.Msg.alert('提示', '查询SQL不能为空！！！');
				return;
			}
			if (null == form_DataSourceId || '' == form_DataSourceId) {
				Ext.Msg.alert('提示', '数据源不能为空！！！');
				return;
			}
			if (null == form_sheetName || '' == form_sheetName) {
				Ext.Msg.alert('提示', 'Sheet名称必须！！！');
				return;
			}
			if (null == form_sheetStartLine || '' == form_sheetStartLine) {
				Ext.Msg.alert('提示', '起始行不能为空！！！');
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
				Ext.Msg.alert('提示', '端口号和PATH都不能为空！！！');
				return;
			}
			if ('file' == form_outboundType
					&& (null == form_path || '' == form_path)) {
				Ext.Msg.alert('提示', 'Excel保存地址不能为空！！！');
				return;
			}
			if (Ext.getCmp('colNamesMapping').store.data.length == 0) {
				Ext.Msg.alert('提示', 'Excel列名Mapping不能为空！！！');
				return;
			}

			var yigoconfig = {
				recordMpLog : form_recordMpLog,
				dataSourceId : form_DataSourceId,
				sheetName : form_sheetName,
				sheetStartLine : form_sheetStartLine,
				sheetTitle : form_sheetTitle,
				excelType : form_excelType,
				updateSql : form_updateSql,
				selectSql : form_selectSql,
				path : form_path,
				httpport : form_httpport,
				httppath : form_httppath,
				pollingFrequency : form_pollingFrequency,
				inboundType : form_inboundType,
				outboundType : form_outboundType,
				autoRun : win_form.getValues().autoRun,
				colNamesMapping : storeToObj(Ext.getCmp('colNamesMapping').store)
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
				url : 'interfaceSqlToExcelController.do?actionType=updateSdInterfaceSqlToExcel',
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
					xtype : 'fieldcontainer',
					layout : 'hbox',
					width : '100%',
					items : [{
								fieldLabel : '数据源'+needToFill,
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
								fieldLabel : '自动启动',
								xtype : 'combobox',
								name : 'autoRun',
								margins : '0 0 0 10',
								labelWidth : 70,
								flex : 0.45,
								id : 'autoRun',
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
								margins : '0 0 0 20',
								xtype : 'combobox',
								name : 'recordMpLog',
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
					fieldLabel : '查询SQL语句'+needToFill,
					name : 'textfieldkey',
					xtype : 'fieldcontainer',
					layout : {
						type : 'hbox'
					},
					items : [{
								xtype : 'textarea',
								name : 'selectSql',
								flex : 7,
								height : 30
							}, {
								xtype : 'button',
								margins : '0 0 0 10',
								text : '执行SQL获取列名',
								handler : function() {
									var form_yigoDataSource = win_form
											.getValues().yigoDataSource;
									var form_selectSql = win_form.getValues().selectSql
											.trim();
									if (null == form_yigoDataSource
											|| '' == form_yigoDataSource) {
										Ext.Msg.alert('提示', '数据源不能为空！！！');
										return;
									}
									if (null == form_selectSql
											|| '' == form_selectSql) {
										Ext.Msg.alert('提示', '查询SQL不能为空！！！');
										return;
									}
									bodyLoadingMask.show();
									Ext.Ajax.request({
										url : 'interfaceSqlToExcelController.do?actionType=getColNamesBySelectSql',
										params : {
											id : form_yigoDataSource,
											sql : form_selectSql
										},
										success : function(response) {
											bodyLoadingMask.hide();
											var result = Ext
													.decode(response.responseText);
											if (result.result) {
												Ext.getCmp('colNamesMapping').store
														.removeAll();
												Ext.getCmp('colNamesMapping').store
														.add(result.data);
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
												value : 'http',
												displayField : 'http'
											}, {
												value : 'jdbc',
												displayField : 'jdbc'
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
									if (newValue == 'jdbc') {
										getCmp('pollingFrequency').show();
										getCmp('httpport').hide();
										getCmp('httppath').hide();
									} else if (newValue == 'http') {
										getCmp('pollingFrequency').hide();
										getCmp('httpport').show();
										getCmp('httppath').show();
									} else {
										getCmp('pollingFrequency').hide();
										getCmp('numberfieldport').hide();
										getCmp('httppath').hide();
									};
								}
							}
						}
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
						id : 'httppath',
						name : 'httppath',
						hidden : true,
						margins : '0 0 0 10',
						width : 415
					}]
				}, {
					xtype : 'fieldcontainer',
					layout : 'hbox',
					width : '100%',
					items : [{
						fieldLabel : 'outbound类型',
						width : 200,
						name : 'outboundType',
						id : 'outboundType',
						allowBlank : false,
						xtype : 'combobox',
						store : Ext.create('Ext.data.Store', {
									model : 'SimpleCombox',
									data : [{
												value : '',
												displayField : '请选择'
											}, {
												value : 'file',
												displayField : 'file'
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
									if (newValue == 'file') {
										getCmp('textfieldpath').show();
									} else {
										getCmp('textfieldpath').hide();
									};
								}
							}
						}
					}, {
						xtype : 'textfield',
						fieldLabel : 'Excel保存地址',
						id : 'textfieldpath',
						name : 'path',
						margins : '0 0 0 10',
						hidden : true,
						width : 565
					}]
				}, {
					xtype : 'fieldcontainer',
					fieldLabel : 'Excel类型'+needToFill,
					layout : 'hbox',
					defaultType : 'textfield',
					items : [{
								xtype : 'combobox',
								name : 'excelType',
								flex : 0.45,
								store : ['2007', '2003'],
								value : '2003'
							}, {
								name : 'sheetName',
								fieldLabel : 'Sheet名字'+needToFill,
								margins : '0 0 0 10',
								labelWidth : 70,
								value : 'sheet1',
								emptyText : 'name'
							}, {
								fieldLabel : '标题行'+needToFill,
								margins : '0 0 0 10',
								labelWidth : 50,
								size : 10,
								value : 1,
								name : 'sheetTitle',
								xtype : 'numberfield',
								minValue : 1
							}, {
								fieldLabel : '起始行'+needToFill,
								margins : '0 0 0 10',
								labelWidth : 50,
								size : 10,
								value : 2,
								name : 'sheetStartLine',
								xtype : 'numberfield',
								minValue : 1
							}]
				}, win_form_Config_grid, {
					xtype : 'textarea',
					fieldLabel : '成功更新语句',
					margins : '5 0 0 0',
					emptyText : '可以为空',
					name : 'updateSql',
					id : 'updateSql',
					height : 35
				}]
	});
	if (record) {
		win_form.getForm().setValues({
					text : text,
					description : description,
					recordMpLog : record.recordMpLog,
					yigoDataSource : record.dataSourceId,
					inboundType : record.inboundType,
					outboundType : record.outboundType,
					path : record.path,
					sheetName : record.sheetName,
					sheetStartLine : record.sheetStartLine,
					sheetTitle : record.sheetTitle,
					updateSql : record.updateSql,
					selectSql : record.selectSql,
					excelType : record.excelType,
					pollingFrequency : record.pollingFrequency,
					inboundType : record.inboundType,
					autoRun : record.autoRun,
					httppath : record.httppath,
					httpport : record.httpport
				});
	}
	var win = Ext.create('Ext.Window', {
				title : detailType + '配置[' + newtablename + ']',
				width : 800*bokedee_width,
				height : 620*bokedee_height,
				draggable : false,
				autoScroll : true,
//				resizable : false,
				modal : true,
				buttons : win_buttons,
				items : [win_form]
			});
	win.show();
}