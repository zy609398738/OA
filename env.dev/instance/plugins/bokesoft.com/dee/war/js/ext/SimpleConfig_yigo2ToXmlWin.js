/**
 * 配置的window
 */
function yigo2ToXmlWin(text, description, record, detailId, detailType,
		newtablename, hidden) {
	var treestore;
	var win_buttons = [{
		text : '保存',
		handler : function() {
			var form_text = win_form.getValues().text;
			var form_description = win_form.getValues().description;
			var form_yigoUrl = win_form.getValues().yigoUrl;
			var form_yigoKey = win_form.getValues().yigoKey;
			var form_recordMpLog = win_form.getValues().recordMpLog;
			var form_DataSourceId = Ext.getCmp('yigoDataSource').value;
			var form_DataSourceName = Ext.getCmp('yigoDataSource').rawValue
			var form_path = win_form.getValues().path.trim();
			var form_updateSql = win_form.getValues().updateSql.Trim();
			var form_pollingFrequency = win_form.getValues().pollingFrequency;
			var form_inboundType = Ext.getCmp('inboundType').value;
			var form_outboundType = Ext.getCmp('outboundType').value;
			var form_conditions = Ext.getCmp('conditions').value;
			var form_freeMarkerTemplate = Ext.getCmp('freeMarkerTemplate').value;
			var form_httpport = win_form.getValues().httpport.trim();
			var form_httppath = win_form.getValues().httppath.trim();
			var form_ftphost = win_form.getValues().ftphost.trim();
			var form_ftpuser = win_form.getValues().ftpuser.trim();
			var form_ftppwd = win_form.getValues().ftppwd.trim();
			var form_cdata = win_form.getValues().cdata;
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
			if (null == form_freeMarkerTemplate
					|| '' == form_freeMarkerTemplate) {
				Ext.Msg.alert('提示', 'XML模版配置不能为空！！！');
				return;
			}
			if (Ext.getCmp('win_form_tabpanel').items.length == 0) {
				Ext.Msg.alert('提示', '至少需要配置一张表！！！');
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
			if ('file' == form_outboundType
					&& (null == form_path || '' == form_path)) {
				Ext.Msg.alert('提示', 'XML保存地址不能为空！！！');
				return;
			}
			if ('ftp' == form_outboundType
					&& (form_ftphost == null || form_ftphost == ''
							|| form_ftpuser == null || form_ftpuser == ''
							|| form_ftppwd == null || form_ftppwd == '')) {
				Ext.Msg.alert('提示', 'ftp的IP、用户和密码不能为空！！！');
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
			var form_billTable = Ext.getCmp('win_form_tabpanel').items.keys
					.join(',');
			var form_billDbTable =arrTable.join(",");
			var yigoconfig = {
				yigoUrl : form_yigoUrl,
				yigoKey : form_yigoKey,
				recordMpLog : form_recordMpLog,
				billTable : form_billTable,
				billDbTable:form_billDbTable,
				dataSourceId : form_DataSourceId,
				dataSourceName : form_DataSourceName,
				updateSql : form_updateSql,
				path : form_path,
				pollingFrequency : form_pollingFrequency,
				httpport : form_httpport,
				httppath : form_httppath,
				ftphost : form_ftphost,
				ftpuser : form_ftpuser,
				ftppwd : form_ftppwd,
				inboundType : form_inboundType,
				outboundType : form_outboundType,
				conditions : form_conditions,
				autoRun : win_form.getValues().autoRun,
				freeMarkerTemplate : form_freeMarkerTemplate,
				treestore : treestore,
				cdata : form_cdata,
				tableType : win_form.getValues().tableType,
				billKeyTableMapping:form_billKeyTableMapping
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
				url : 'interfaceYigo2ToXmlController.do?actionType=updateSdInterfaceYigo2ToXml',
				params : {
					data : Ext.encode(mapData)
				},
				success : function(response) {
					bodyLoadingMask.hide();
					var result = Ext.decode(response.responseText);
					if (result.result) {
						Ext.getCmp('SimpleConfiggridPanel').store.load();
						win.close();
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
								"format" : "",
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
								labelWidth : 60,
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
												chooseYigo2ToXmlColumns(
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
										getCmp('autoRun').show();
										getCmp('pollingFrequency').show();
										getCmp('httpport').hide();
										getCmp('httppath').hide();
									} else if (newValue == 'http') {
										getCmp('autoRun').show();
										getCmp('pollingFrequency').hide();
										getCmp('httpport').show();
										getCmp('httppath').show();
									} else {
										getCmp('autoRun').hide();
										getCmp('httpport').hide();
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
						id : 'httppath',
						name : 'httppath',
						hidden : true,
						margins : '0 0 0 10',
						width : 415
					}, {
						fieldLabel : '自动启动',
						xtype : 'combobox',
						name : 'autoRun',
						margins : '0 0 0 10',
						labelWidth : 70,
						flex : 0.45,
						id : 'autoRun',
						hidden : true,
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
												value : 'ftp',
												displayField : 'ftp'
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
										getCmp('ftphost').hide();
										getCmp('ftpuser').hide();
										getCmp('ftppwd').hide();
									} else if (newValue == 'ftp') {
										getCmp('textfieldpath').hide();
										getCmp('ftphost').show();
										getCmp('ftpuser').show();
										getCmp('ftppwd').show();
									} else {
										getCmp('ftphost').hide();
										getCmp('ftpuser').hide();
										getCmp('ftppwd').hide();
										getCmp('textfieldpath').hide();
									};
								}
							}
						}
					}, {
						xtype : 'textfield',
						labelWidth : 60,
						fieldLabel : '服务器IP',
						id : 'ftphost',
						hidden : true,
						name : 'ftphost',
						margins : '0 0 0 5',
						width : 200
					}, {
						xtype : 'textfield',
						labelWidth : 40,
						fieldLabel : '用户',
						id : 'ftpuser',
						hidden : true,
						name : 'ftpuser',
						margins : '0 0 0 5',
						width : 175
					}, {
						xtype : 'textfield',
						labelWidth : 40,
						fieldLabel : '密码',
						id : 'ftppwd',
						hidden : true,
						name : 'ftppwd',
						margins : '0 0 0 10',
						width : 175
					}, {
						xtype : 'textfield',
						fieldLabel : 'XML保存地址',
						id : 'textfieldpath',
						name : 'path',
						margins : '0 0 0 10',
						hidden : true,
						width : 560
					}]
				}, {
					xtype : 'fieldcontainer',
					layout : 'hbox',
					width : '100%',
					items : [{
						xtype : 'textarea',
						fieldLabel : '导出XML的例子',
						id : 'freeMarkerTemplate',
						name : 'freeMarkerTemplate',
						height : 30,
						flex : 5,
						listeners : {
							focus : function(th, obj, eOpts) {
								var win_Value_form = Ext.create(
										'Ext.form.Panel', {
											border : 1,
											items : [{
														xtype : 'textarea',
														name : 'templateValue',
														width : 600,
														height : 400,
														value : th.rawValue
													}]
										});
								var win_Value = Ext.create('Ext.Window', {
									title : '导出XML的例子',
									draggable : false,
									autoScroll : true,
									resizable : false,
									layout : 'fit',
									modal : true,
									buttons : [{
										text : '格式化',
										handler : function() {
											var url = 'interfaceInfoFindController.do?actionType=formatString';
											var xmlData = win_Value_form
													.getValues().templateValue;
											if (xmlData != '') {// xml
												// 模版
												Ext.Ajax.request({
													url : url,
													params : {
														type : 'xml',
														text : xmlData
													},
													success : function(response) {
														win_Value_form
																.getForm()
																.setValues({
																	templateValue : response.responseText
																});
													}

												});
											}
										}
									}, {
										text : '解析',
										handler : function() {
											var xmlData = win_Value_form
													.getValues().templateValue;
											bodyLoadingMask.show();
											if (xmlData == '') {
												bodyLoadingMask.hide();
												Ext.Msg
														.alert('提示',
																'解析失败:没有数据');
												return;
											}
											var getTreeurl = 'interfaceInfoFindController.do?actionType=getTreeStore';
											Ext.Ajax.request({
												url : getTreeurl,
												params : {
													data : xmlData
												},
												success : function(response) {
													bodyLoadingMask.hide();
													treestore = response.responseText;
													if (treestore
															.search('Error') > -1) {
														Ext.Msg
																.alert(
																		'提示',
																		'解析失败:'
																				+ treestore);
														return;
													}
													var comboboxtree = Ext.JSON
															.encode(Ext.JSON
																	.decode(treestore).children);
													treestore = comboboxtree;
													var form_billTable = Ext
															.getCmp('win_form_tabpanel').items.keys
															.join(',');
													var tableNames = form_billTable
															.split(',');// 数组第一个主表名
													// ，其他子表名
													var yigoconfig = {}
													for (var i = 0; i < tableNames.length; i++) {
														yigoconfig[tableNames[i]
																+ '_store'] = storeToObj(Ext
																.getCmp(tableNames[i]).store);
													}
													Ext
															.getCmp('win_form_tabpanel')
															.removeAll();
													getYigo2ToXmlTabpanelConfigItems2(
															win_form,
															tableNames,
															yigoconfig,
															comboboxtree);
													Ext.Msg.alert('提示', '解析成功');
													getCmp('freeMarkerTemplate')
															.setValue(xmlData);
													win_Value.close();
												},
												failure : function(response) {
													bodyLoadingMask.hide();
													Ext.Msg.alert('提示', '操作失败');
													return;
												}

											});
										}
									}, {
										text : '确定',
										handler : function() {
											var xmlData = win_Value_form
													.getValues().templateValue;
											getCmp('freeMarkerTemplate')
													.setValue(xmlData);
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
					}, {
						fieldLabel : '加CDATA',
						margins : '0 0 0 10',
						xtype : 'combobox',
						name : 'cdata',
						labelWidth : 70,
						flex : 1.5,
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
						value : 'true'
					}]
				}, {
					name : 'tableType',
					fieldLabel : '单据类型',
					hidden : true
				}, {
					xtype : 'tabpanel',
					tbar : p_tbar_items2,
					hidden : hidden,
					id : 'win_form_tabpanel',
					items : []
				}, {
					xtype : 'textarea',
					fieldLabel : '查询条件',
					margins : '5 0 0 0',
					emptyText : '这里只写sql语句的where条件（包含where）,主表别名为head,条件也可以为空',
					name : 'conditions',
					id : 'conditions',
					hidden : hidden,
					height : 25
				}, {
					xtype : 'textarea',
					fieldLabel : '成功更新语句',
					margins : '5 0 0 0',
					emptyText : '可以为空',
					name : 'updateSql',
					id : 'updateSql',
					hidden : hidden,
					height : 25
				}]
	});
	if (record && record.billTable) {
		win_form.getForm().setValues({
					text : text,
					description : description,
					yigoUrl : record.yigoUrl,
					yigoKey : record.yigoKey,
					recordMpLog : record.recordMpLog,
					yigoDataSource : record.dataSourceId,
					inboundType : record.inboundType,
					outboundType : record.outboundType,
					path : record.path,
					updateSql : record.updateSql,
					pollingFrequency : record.pollingFrequency,
					inboundType : record.inboundType,
					conditions : record.conditions,
					autoRun : record.autoRun,
					freeMarkerTemplate : record.freeMarkerTemplate,
					httppath : record.httppath,
					httpport : record.httpport,
					ftphost : record.ftphost,
					ftpuser : record.ftpuser,
					ftppwd : record.ftppwd,
					cdata : record.cdata,
					tableType : record.tableType,
					billKeyTableMapping:record.billKeyTableMapping
				});
		treestore = record.treestore;
		getYigo2ToXmlTabpanelConfigItems(win_form, record, null, treestore);
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
/**
 * 解析返回的信息 创建多个tabpanel 选择列名
 */
function chooseYigo2ToXmlColumns(win_form, json) {
	var mapData = json;
	var win_buttons = [{
		text : '确定',
		handler : function() {
			var tableNames = mapData.billTable.split(',');// 数组第一个主表名 其他子表名
			var Mapping = mapData.billKeyTableMapping;
			var tableType = mapData.tableType;// 单据类型
			win_form.getForm().setValues({// 把主表名称保存起来
				billTable : tableNames[0],
				billKeyTableMapping: JSON.stringify(Mapping),
				tableType : tableType
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
				getYigo2ToXmlTabpanelConfigItems(win_form, mapData, result);
			}
			win.close();
			getCmp('win_form_tabpanel').show();
			getCmp('conditions').show();
			getCmp('updateSql').show();
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
/**
 * 返回 tabpanel 的items数组
 */
function getTabpanelitems(map) {
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
function getYigo2ToXmlTabpanelConfigItems(win, map, selected, treestore) {
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
							fields : ['createOnElement', 'key', 'caption',
									'dbColumnName', 'dataType', 'dicTable',
									'format'],
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
							header : '节点',
							dataIndex : 'createOnElement',
							locked : true,
							menuDisabled : true,
							width : 350,
							editor : {
								xtype : 'comboboxtree',
								editable : false,
								Comstore : treestore ? treestore : '[]'
							}
						}, {
							header : 'Yigo字段名',
							dataIndex : 'key',
							sortable : false,
							menuDisabled : true,
							width : 80,
							field : 'textfield'
						}, {
							header : '中文描述',
							dataIndex : 'caption',
							sortable : false,
							menuDisabled : true,
							width : 80,
							field : 'textfield'
						}, {
							header : '数据库表列名',
							dataIndex : 'dbColumnName',
							sortable : false,
							menuDisabled : true,
							width : 80,
							field : 'textfield'
						}, {
							header : '字段类型',
							dataIndex : 'dataType',
							sortable : false,
							menuDisabled : true,
							width : 80,
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
							width : 120,
							sortable : false,
							menuDisabled : true,
							field : 'textfield'
						}, {
							header : 'Format',
							dataIndex : 'format',
							width : 150,
							sortable : false,
							menuDisabled : true,
							field : 'textfield'
						}],
				plugins : Ext.create('Ext.grid.plugin.CellEditing', {
					clicksToEdit : 1,
					listeners : {
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
				height : 210*bokedee_height
			});
			result.push(win_form_Config_grid);
		}
	}
	Ext.getCmp('win_form_tabpanel').add(result);
}
function getYigo2ToXmlTabpanelConfigItems2(win, tableNames, selected,
		comboboxtree) {
	var result = [];
	var keys = Ext.getCmp('win_form_tabpanel').items.keys;
	for (var i = 0; i < tableNames.length; i++) {

		var win_form_Config_grid = Ext.create('Ext.grid.Panel', {
			title : tableNames[i],
			id : tableNames[i],
			closable : i != 0,
			store : Ext.create('Ext.data.Store', {
						fields : ['createOnElement', 'key', 'caption',
								'dataType', 'dbColumnName', 'dicTable'],
						data : selected[tableNames[i] + '_store'],
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
						header : '节点',
						dataIndex : 'createOnElement',
						locked : true,
						menuDisabled : true,
						flex : 2,
						editor : {
							xtype : 'comboboxtree',
							editable : false,
							Comstore : comboboxtree
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
					beforeedit : function(editor, e) {
						if (editor.field == "dicTable") {
							var win_Value_form = Ext.create('Ext.form.Panel', {
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
										editor.grid.store.insert(editor.rowIdx,
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
			height : 210
		});
		result.push(win_form_Config_grid);

	}
	Ext.getCmp('win_form_tabpanel').add(result);
}
