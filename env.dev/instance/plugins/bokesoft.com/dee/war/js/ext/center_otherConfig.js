/**
 * 系统信息
 */
function center_systemInfo() {
	bodyLoadingMask.show();
	var title = changeColorToRed('系统信息');
	var isFirst = true;
	var findSystemInfoURL = 'interfaceInfoFindController.do?actionType=findSystemInfo';
	var workDir
= {
		xtype : 'textfield',
		fieldLabel : '工作目录',
		id : 'center_workDir',
		readOnly : true,
		height : 27,
		value : '获取工作目录失败',
		width : 700* bokedee_width
	}

	var licInfo = {
		xtype : 'textarea',
		fieldLabel : '证书源信息',
		id : 'center_licInfo',
		readOnly : true,
		height : 70,
		value : '获取工作证书信息失败',
		width : 700* bokedee_width
	}

	var curlicStatus = {
		xtype : 'textarea',
		fieldLabel : '当前证书状态',
		id : 'center_curlicStatus',
		readOnly : true,
		height : 27,
		value : '获取当前证书状态失败',
		width : 700* bokedee_width
	}

	var jdkInfo = {
		xtype : 'textfield',
		fieldLabel : 'JDK版本',
		height : 27,
		id : 'center_jdkVersionInfo',
		readOnly : true,
		value : '获取JDK版本失败',
		width : 700* bokedee_width
	}

	var setIsAcceptURL = 'interfaceInfoSaveController.do?actionType=setSynAccept';

	var isAccept = Ext.create('Ext.form.field.Checkbox', {
				fieldLabel : '是否接受同步',
				height : 27,
				id : 'center_isAccept',
				hidden : isHiddenFromPermission('other_config', 'otherInfo',
						'setSynAccept'),
				value : false,
				width : 700* bokedee_width,
				listeners : {
					change : function(checkbox, newValue) {
						if (isFirst == false) {
							Ext.Ajax.request({
										url : setIsAcceptURL,
										params : {
											isAccept : newValue
										},
										success : function(response) {
											if ('success' == response.responseText) {
												Ext.Msg.alert('提示', '修改成功');
											} else {
												Ext.Msg.alert('提示', '修改失败');
											}
										}
									});
						} else {
							isFirst = false;
						}

					}
				}
			})
	var datasourceUrl = 'interfaceInfoFindController.do?actionType=findDatasourceForJdbcConnector';
	var DsStoredata = [{
				'displayField' : '请选择数据源',
				'value' : ''
			}];
//	var DsStoredata2 = [{
//				'displayField' : '请选择数据源',
//				'value' : ''
//			}];
	Ext.Array.insert(DsStoredata, 1,
			Ext.decode(ajaxSyncCall(datasourceUrl)).root);
//	Ext.Array.insert(DsStoredata2, 1,
//			Ext.decode(ajaxSyncCall(datasourceUrl)).root);
	var setDs = {
		xtype : 'fieldcontainer',
		layout : 'hbox',
		width : 500* bokedee_width,
		items : [{
			fieldLabel : '记录日志数据源',
			width : 350* bokedee_width,
			name : 'logDataSource',
			id : 'logDataSource',
			xtype : 'combobox',
			store : Ext.create('Ext.data.Store', {
						model : 'SimpleCombox',
						data : DsStoredata,
						autoLoad : true
					}),
			editable : false,
			displayField : 'displayField',
			valueField : 'value',
			queryMode : 'local',
			value : '',
			listeners : {
				'select' : {
					fn : function(combo, records, eOpts) {
						var newValue = records[0].data.value;
						if (newValue == '') {
							getCmp('createTable').hide();
						} else {
							getCmp('createTable').show();
						}
						var data = {
							log2DatasouceId : newValue
						}
						bodyLoadingMask.show();
						Ext.Ajax.request({
							url : 'interfaceLog2DatasourceController.do?actionType=updateDatasource',
							params : {
								data : Ext.encode(data)
							},
							success : function(response) {
								bodyLoadingMask.hide();
								var result = Ext.decode(response.responseText);
								if (result.result) {
									Ext.Msg.alert('成功', '数据源修改成功');
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
				}
			}
		}, {
			xtype : 'button',
			margins : '0 0 0 10',
			text : '执行数据库脚本',
			hidden : true,
			id : 'createTable',
			handler : function() {
				bodyLoadingMask.show();
				var form_DataSource = Ext.getCmp('logDataSource').value;
//				alert(form_DataSource);
				Ext.Ajax.request({
					url : 'interfaceLog2DatasourceController.do?actionType=createLogTable',
					params : {
						id : form_DataSource
					},
					success : function(response) {
						bodyLoadingMask.hide();
						var result = Ext.decode(response.responseText);
						if (result.result) {
							Ext.Msg.alert('成功', result.data);
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
		}]
	}
	
	var setAuthorizationDs = {
		xtype : 'fieldcontainer',
		layout : 'hbox',
		width : 500* bokedee_width,
		items : [{
			fieldLabel : '授权信息数据源',
			width : 350* bokedee_width,
			name : 'authorizationDataSource',
			id : 'authorizationDataSource',
			xtype : 'combobox',
			store : Ext.create('Ext.data.Store', {
						model : 'SimpleCombox',
						data : DsStoredata,
						autoLoad : true
					}),
			editable : false,
			displayField : 'displayField',
			valueField : 'value',
			queryMode : 'local',
			value : '',
			listeners : {
				'select' : {
					fn : function(combo, records, eOpts) {
						var newValue = records[0].data.value;
						if (newValue == '') {
							getCmp('createTable2').hide();
						} else {
							getCmp('createTable2').show();
						}
						var data = {
							authorizationDatasouceId : newValue
						}
						bodyLoadingMask.show();
						Ext.Ajax.request({
							url : 'authorizationRegistrationController.do?actionType=updateDatasource',
							params : {
								data : Ext.encode(data)
							},
							success : function(response) {
								bodyLoadingMask.hide();
								var result = Ext.decode(response.responseText);
								if (result.result) {
									Ext.Msg.alert('成功', '数据源修改成功');
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
				}
			}
		},{
			xtype : 'button',
			margins : '0 0 0 10',
			text : '执行数据库脚本',
			hidden : true,
			id : 'createTable2',
			handler : function() {
				bodyLoadingMask.show();
				Ext.Ajax.request({
					url : 'authorizationRegistrationController.do?actionType=createAuthorizationTable',
					success : function(response) {
						bodyLoadingMask.hide();
						var result = Ext.decode(response.responseText);
						if (result.result) {
							Ext.Msg.alert('成功', "执行成功！");
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
		}]
	}
	
	var logKeepDays = {
			xtype : 'fieldcontainer',
			layout : 'hbox',
			width : 500* bokedee_width,
			items : [{
				fieldLabel : '日志最长保留天数',
				width : 250* bokedee_width,
				name : 'center_logKeepDays_name',
				id : 'center_logKeepDays',
				xtype : 'numberfield',
				readOnly : false,
				minValue:0
			}, {
				xtype : 'button',
				margins : '0 0 0 10',
				text : '保存',
				id : 'center_save_logKeepDays',
				handler : function() {
					bodyLoadingMask.show();
					var form_keep_days = Ext.getCmp('center_logKeepDays').value;
//					alert(form_DataSource);
					Ext.Ajax.request({
						url : 'interfaceInfoSaveController.do?actionType=updateLogKeepDays',
						params : {
							days : form_keep_days
						},
						success : function(response) {
							bodyLoadingMask.hide();
							if (response.responseText == 'success') {
								Ext.Msg.alert('成功', 'Success');
							} else {
								Ext.Msg.alert('失败', response.responseText);
							}
						},
						failure : function(response) {
							bodyLoadingMask.hide();
							var result = Ext.decode(response.responseText);
							Ext.Msg.alert('失败', result.data);
						}

					});
				}
			}]
		}	
	
	var logKeepDays = {
			xtype : 'fieldcontainer',
			layout : 'hbox',
			width : 500* bokedee_width,
			items : [{
				fieldLabel : '日志最长保留天数',
				width : 250* bokedee_width,
				name : 'center_logKeepDays_name',
				id : 'center_logKeepDays',
				xtype : 'numberfield',
				readOnly : false,
				minValue:0
			}, {
				xtype : 'button',
				margins : '0 0 0 10',
				text : '保存',
				id : 'center_save_logKeepDays',
				handler : function() {
					bodyLoadingMask.show();
					var form_keep_days = Ext.getCmp('center_logKeepDays').value;
//					alert(form_DataSource);
					Ext.Ajax.request({
						url : 'interfaceInfoSaveController.do?actionType=updateLogKeepDays',
						params : {
							days : form_keep_days
						},
						success : function(response) {
							bodyLoadingMask.hide();
							if (response.responseText == 'success') {
								Ext.Msg.alert('成功', 'Success');
							} else {
								Ext.Msg.alert('失败', response.responseText);
							}
						},
						failure : function(response) {
							bodyLoadingMask.hide();
							var result = Ext.decode(response.responseText);
							Ext.Msg.alert('失败', result.data);
						}

					});
				}
			}]
		}	
	
	Ext.Ajax.request({
				url : findSystemInfoURL,
				success : function(response) {
					var data = Ext.decode(response.responseText);
					getCmp('center_workDir').setValue(data.workDir);
					getCmp('center_licInfo').setValue(data.licInfo);
					getCmp('center_curlicStatus').setValue(data.curlicStatus);
					getCmp('center_jdkVersionInfo').setValue(data.jdkVersion);
					getCmp('center_isAccept').setValue(data.isAccept);
					getCmp('center_logKeepDays').setValue(data.logKeepDays);
					
					if (data.isAccept == false) {
						isFirst = false;
					}
					getCmp('logDataSource').setValue(data.log2DatasouceId);
					getCmp('authorizationDataSource').setValue(data.authorizationDatasouceId);
					if (data.log2DatasouceId) {
						getCmp('createTable').show();
					}
					if (data.authorizationDatasouceId) {
						getCmp('createTable2').show();
					}
				}
			});
	var p = Ext.create('Ext.panel.Panel', {
				id : 'center_systemInfo',
				title : title,
				draggable : false,
				resizable : false,
				border : 1,
				layout : 'anchor',
				width : '100%',
				height : '100%',
				bodyPadding : 15,
				items : [workDir, licInfo, curlicStatus, jdkInfo, isAccept,
						setDs, setAuthorizationDs, logKeepDays]
			});
	bodyLoadingMask.hide();
	return p;
}

function center_wsTest() {
		var wsServicesCombox_store_u = 'interfaceWsAndHttpTestController.do?actionType=findWsServices';
	
	var wsServicesCombox_store = Ext.create('Ext.data.Store', {
				model : 'ComboBoxWsServicesInfo',
				proxy : {
					type : 'ajax',
					url : wsServicesCombox_store_u
				},
				autoLoad : true
			});		
	
	var wsServicesCombox = Ext.create('Ext.form.field.ComboBox', {
				width : 180* bokedee_width,
				name : 'wsServices',
				id : 'wsServices',
				allowBlank : false,
				store : wsServicesCombox_store,
				editable : false,
				displayField : 'displayField',
				valueField : 'value',
				queryMode : 'local',
				value : '请选择',
				listeners : {
					select : function(combox) {
						// 移除webservice调用参数， 参数会随着webservice方法的变化 随之变化
						p2.remove('center_ws_params');
						p2.remove('center_retContent');
						Ext.Ajax.request({
									url : 'interfaceWsAndHttpTestController.do',
									async: false,
									params : {
										actionType : 'findWsMethodName',
										wsService : this.value
									},
									success : function(response) {
										wsMethodNameCombox.store.removeAll();
										wsMethodNameCombox.show();
										var result = response.responseText;
										var j = Ext.decode(result);
										wsMethodNameCombox.store.add(j.root);
										wsMethodNameCombox.setValue('请选择');
									},
									failure : function(response) {
										Ext.Msg.alert('出错了',
												response.responseText);
									}
								});
						// 计算wsdl路径
						contactWsdlUrl();
					}
				}
			});
			
	
	var wsMethodNameCombox = Ext.create('Ext.form.field.ComboBox', {
				width : 245 * bokedee_width,
				name : 'wsMethodName',
				id : 'wsMethodName',
				fieldLabel : '&nbsp;&nbsp;&nbsp;方法名称',
				hidden : false,
				editable : false,
				displayField : 'displayField',
				valueField : 'value',
				queryMode : 'local',
				value : '请选择',
				store : Ext.create('Ext.data.Store', {
							model : 'ComboBoxWsServicesInfo'
						}),
				listeners : {
					select : function(combox) {
						// 移除webservice调用参数， 参数会随着webservice方法的变化 随之变化
						p2.remove('center_ws_params');
						// 如果之前测试已有返回接口， 需要在选择其他方法进行测试的时候移除
						p2.remove('center_retContent');
						// 创建webservice 调用参数 控件
						var wsp = Ext.create('Ext.form.FieldSet', {
									id : 'center_ws_params',
									title : '调用WebService方法参数',
									width : 530* bokedee_width
									});
						var params = combox.lastSelection[0].data.params;
						for (var i = 0; i < params.length; i++) {
							var heightv = 27;
							var param = params[i];
							if ('textarea' == param.xtype) {
								heightv = 80;
							}
							// 根据后台的webservice调用参数设置自动生成参数控件
							if ('numberfield' == param.xtype) {
								var xcom = {
										xtype: param.xtype,
										fieldLabel: param.diaplayName,
										id: param.fieldId,
										readOnly: false,
										height: heightv,
										allowDecimals:true,
										decimalPrecision:10,
										value: '',
										width: 500* bokedee_width
									}
									wsp.add(xcom);
							}
							else {
								var xcom = {
									xtype: param.xtype,
									fieldLabel: param.diaplayName,
									id: param.fieldId,
									readOnly: false,
									height: heightv,
									value: '',
									width: 500* bokedee_width
								}
								wsp.add(xcom);
							}
							p2.add(wsp);
						}
						p2.remove('center_testButton');
						p2.add(testButton);	
					}
				}
				
			});	
	
	var wsLogPanel_store = Ext.create('Ext.data.Store', {
				model : 'LogConfig',
				proxy : {
					type : 'ajax',
					url : 'interfaceWsAndHttpTestController.do?actionType=wsLogRecord',
					reader : {
						type : 'json',
						root : 'data'
					}
				},
				autoLoad : true
				
			});
	
	var wsLogPaneltbar = {
				items : [{
				text : '查看缓存日志',
				scale : 'small',
				icon : 'images/chaxun.png',
				hidden : isHiddenFromPermission('other_config', 'wsAndHttpTest',
						'cacheLog'),
				width : 120,
				handler : function() {
						Ext.getCmp('wsLogPanel').store.removeAll();
			  			Ext.getCmp('wsLogPanel').store.proxy.url = 'interfaceWsAndHttpTestController.do?actionType=wsLogRecord';
			  			Ext.getCmp('wsLogPanel').store.load();
					}
				},{
				text : '持久化',
				scale : 'small',
				icon : 'images/xiugai.png',
				hidden : isHiddenFromPermission('other_config', 'wsAndHttpTest',
						'persistence'),
				width : 70,
				handler : function() {
					bodyLoadingMask.show();
							var records = wsLogPanel.selModel.getSelection();
							var uuidList = [];
							for (var i = 0; i < records.length; i++) {
								uuidList[i] = records[i].data.uuid;
							}
							var uuidListJson = Ext.encode(uuidList);
							if(records == ''){
								bodyLoadingMask.hide()
								Ext.bokedee.msg('提示', 1000,'请选择需要持久化的日志');
							}else if(records != ''){
								Ext.Ajax.request({
								url : 'interfaceWsAndHttpTestController.do?actionType=wsLogPersistence',
								async: false,
								params : {
									uuidList : uuidListJson
								},
								success : function(response) {
									bodyLoadingMask.hide();
									var result = Ext
											.decode(response.responseText);
									if (result.result) {
										Ext.bokedee.msg('保存成功', 1000,'已将选中日志持久化！');
									}
								},
								failure : function(response) {
									bodyLoadingMask.hide();
									var result = Ext
											.decode(response.responseText);
									Ext.Msg.alert('失败', result.data);
									}
								});
								Ext.getCmp('wsLogPanel').store.removeAll();
			  					Ext.getCmp('wsLogPanel').store.load();
							}
					}
				},{
				text : '查看持久化日志',
				scale : 'small',
				icon : 'images/chaxun.png',
				hidden : isHiddenFromPermission('other_config', 'wsAndHttpTest',
						'persistenceLog'),
				width : 120,
				handler : function() {
						Ext.getCmp('wsLogPanel').store.removeAll();
						Ext.getCmp('wsLogPanel').store.proxy.url = 'interfaceWsAndHttpTestController.do?actionType=wsLogPersistenceRecord';
			  			Ext.getCmp('wsLogPanel').store.load();
					}
				}
				,{
				text : '删除',
				scale : 'small',
				icon : 'images/shanchu.png',
				hidden : isHiddenFromPermission('other_config', 'wsAndHttpTest',
						'del'),
				width : 50,
				handler : function() {
					var records = wsLogPanel.selModel.getSelection();
					var uuidList = [];
					for (var i = 0; i < records.length; i++) {
						uuidList[i] = records[i].data.uuid;
					}
					var uuidListJson = Ext.encode(uuidList);
					if (wsLogPanel.selModel.getSelection() != '') {
						Ext.Msg.show({
							title : '提示',
							msg : '确定要删除吗？',
							buttons : Ext.Msg.YESNO,
							fn : function(type) {
								if ('yes' == type) {
									bodyLoadingMask.show();
									Ext.Ajax.request({
										url : 'interfaceWsAndHttpTestController.do?actionType=wsDelRecordLog',
										params : {
											uuidList : uuidListJson
										},
										success : function(response) {
											bodyLoadingMask.hide();
											Ext.getCmp('wsLogPanel').store
													.load();
											var result = Ext
													.decode(response.responseText);
											if (result.result) {
												Ext.getCmp('wsLogPanel').store
														.removeAt(wsLogPanel.index);
												Ext.bokedee.msg('提示', 1000,'删除成功');
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
							}
						})
					}
				}
			}
				]
	}	
	
	var contactWsdlUrl = function () {
			var center_ipAddress = Ext.getCmp('center_ipAddress').value;
			var center_wsserviceName = Ext.getCmp('wsServices').value;
			var center_port = Ext.getCmp('center_port').value;
			var center_contextPath = Ext.getCmp('center_contextPath').value;
			
			var wsdl_url = 'http://' + center_ipAddress + ':' + center_port + '/' + center_contextPath + '/services/' + center_wsserviceName + '?wsdl';
			Ext.getCmp('center_wsdl_url').setValue(wsdl_url);	
	}	
	
	
	var ipAddress = {
		xtype : 'textfield',
		fieldLabel : 'Web服务地址',
		id : 'center_ipAddress',
		readOnly : false,
		height : 27,
		value : 'localhost',
		width : 500* bokedee_width,
		listeners : {
					change : function(owner, newValue, oldValue, eOpts) {
						contactWsdlUrl();
					}
				}
	}
	
	var retContent = {
		xtype : 'textarea',
		fieldLabel : '返回内容',
		id : 'center_retContent',
		readOnly : false,
		height : 220,
		value : '',
		width : 530* bokedee_width
	}
	
	var wsdl_url = {
		xtype : 'textfield',
		fieldLabel : 'WSDL地址',
		id : 'center_wsdl_url',
		readOnly : true,
		height : 27,
		value : '',
		width : 500* bokedee_width
	}
	
	var ws_username = {
		xtype : 'textfield',
		fieldLabel : 'Ws 用户名',
		id : 'center_ws_username',
		readOnly : false,
		height : 27,
		value : '',
		width : 500* bokedee_width
	}	
	
	var ws_password = {
		xtype : 'textfield',
		fieldLabel : 'Ws 密码',
		id : 'center_ws_password',
		readOnly : false,
		height : 27,
		value : '',
		width : 500* bokedee_width
	}		
	
	var port = {
		xtype : 'numberfield',
		fieldLabel : '端口号',
		id : 'center_port',
		readOnly : false,
		height : 27,
		value : '48000',
		width : 500* bokedee_width,
		listeners : {
					change : function(owner, newValue, oldValue, eOpts) {
						contactWsdlUrl();
					}
				}
	}
	
	var contextPath = {
		xtype : 'textfield',
		fieldLabel : '上下文路径',
		id : 'center_contextPath',
		readOnly : false,
		height : 27,
		value : 'BokeDee',
		width : 500* bokedee_width,
		listeners : {
					change : function(owner, newValue, oldValue, eOpts) {
						contactWsdlUrl();
					}
				}
	}
	
	var testButton = Ext.create('Ext.button.Button',{
			text : '测试',
			hidden : false,
			id : 'center_testButton',
			handler : function() {
				bodyLoadingMask.show();
				p2.remove('center_retContent');
				

				var center_ipAddress = Ext.getCmp('center_ipAddress').value;
				var center_wsserviceName = Ext.getCmp('wsServices').value;
				var center_wsMethodName = Ext.getCmp('wsMethodName').value;
				var center_port = Ext.getCmp('center_port').value;
				var center_contextPath = Ext.getCmp('center_contextPath').value;
				var center_ws_username = Ext.getCmp('center_ws_username').value;
				var center_ws_password = Ext.getCmp('center_ws_password').value;
				var center_wsdl_url = Ext.getCmp('center_wsdl_url').value;
				var paramsSel = Ext.getCmp('wsMethodName').lastSelection[0].data.params;
				var params = {
						ipAddress : center_ipAddress,
						wsserviceName : center_wsserviceName,
						wsMethodName : center_wsMethodName,
						port : center_port,
						contextPath : center_contextPath,
						paramsSel : Ext.encode(paramsSel),
						ws_username : center_ws_username,
						ws_password : center_ws_password,
						wsdl_url : center_wsdl_url
					};
				
				
				for (var i = 0; i < paramsSel.length; i++) {
					var param = paramsSel[i];
					var paramVal = Ext.getCmp(param.fieldId).value;
					var text = param.text;
					params[text]=paramVal;
				}					
				Ext.Ajax.request({
					url : 'interfaceWsAndHttpTestController.do?actionType=buttonTestWs',
					params : params,
					async: false,
					timeout :300000,
					success : function(response) {
						bodyLoadingMask.hide();
						var result = Ext.decode(response.responseText);
						p2.add(retContent);
						Ext.getCmp('center_retContent').setValue(result.data);
						
					},
					failure : function(response) {
						bodyLoadingMask.hide();
						var result = Ext.decode(response.responseText);
						p2.add(retContent);
						Ext.getCmp('center_retContent').setValue(result);
						
					}

				});
				Ext.getCmp('wsLogPanel').store.removeAll();
			  	Ext.getCmp('wsLogPanel').store.proxy.url = 'interfaceWsAndHttpTestController.do?actionType=wsLogRecord';
			  	Ext.getCmp('wsLogPanel').store.load();
			}
		
	});
	
	var webservice_url = Ext.create('Ext.form.FieldSet', {
			id : 'center_ws_url',
			title : '调用BokeDee WebService地址',
			frame: true,
			resizable : false,
			border : 5,
			width : 530* bokedee_width,
			items: [ipAddress,port,contextPath,ws_username,ws_password,wsdl_url]
			});	
			
	var wsAndMethodName= Ext.create('Ext.form.FieldContainer',{
					fieldLabel : 'Web服务名称',
					layout : 'hbox',
					width : '50%',
					items : [wsServicesCombox,wsMethodNameCombox]
				});
	
	var wsLogPanel = Ext.create('Ext.grid.Panel', {
				border : 0,
				title: '日志查看',
				id : 'wsLogPanel',
				x : 560,
				y : 0,
				height : '100%',
				loadMask : true,
				autoScroll : true,
				tbar : wsLogPaneltbar,
				selModel : Ext.create('Ext.selection.CheckboxModel', {
					mode : 'MULTI',
					listeners : {
						select : function(m, record, index) {
							wsLogPanel.record = record;
							wsLogPanel.index = index;
						}
					}
				}),
				listeners : {
					itemdblclick : function() {
							bodyLoadingMask.show();
							Ext.Ajax.request({
							url : 'interfaceWsAndHttpTestController.do?actionType=wsLogRecordDetail',
							params : {
											uuid : wsLogPanel.record.data.uuid
										},
							success : function(response) {
								bodyLoadingMask.hide();
								var result = Ext
										.decode(response.responseText);
								if (result.result) {
									Ext.getCmp('wsServices').setValue(result.data.wsserviceName);
									Ext.getCmp('wsServices').fireEvent('select',wsServicesCombox);
									Ext.getCmp('wsMethodName').setValue(result.data.wsMethodName);
									Ext.getCmp('wsMethodName').fireEvent('select',wsMethodNameCombox);
									Ext.getCmp('center_ipAddress').setValue(result.data.ipAddress);
									Ext.getCmp('center_port').setValue(result.data.port);
									Ext.getCmp('center_contextPath').setValue(result.data.contextPath);
									Ext.getCmp('center_ws_username').setValue(result.data.ws_username);
									Ext.getCmp('center_ws_password').setValue(result.data.ws_password);
									Ext.getCmp('center_wsdl_url').setValue(result.data.wsdlurl);
									var paramsSel = Ext.getCmp('wsMethodName').lastSelection[0].data.params;
									for (var i = 0; i < paramsSel.length; i++) {
										Ext.getCmp(result.data.paramsSel[i].fieldId).setValue(result.data.paramsSel[i].value);
									}
									p2.add(retContent);
									Ext.getCmp('center_retContent').setValue(result.data.result);
									Ext.bokedee.msg('提示', 1000,'载入信息成功');
								}
							},
							failure : function(response) {
								bodyLoadingMask.hide();
								var result = Ext
										.decode(response.responseText);
								Ext.Msg.alert('失败', result.data);
								}
							});
							;
					}
				},
				columns : [{
							xtype : 'rownumberer',
							width : 30,
							sortable : false
						}, {
							header : 'uuid',
							dataIndex : 'uuid',
							sortable : false,
							menuDisabled : true,
							hidden : true,
							flex : 4
						},{
							header : '测试时间',
							dataIndex : 'testTime',
							sortable : false,
							menuDisabled : true,
							flex : 2,
							renderer : Ext.util.Format.dateRenderer('Y-m-d H:i:s')
						},{
							header : 'Web服务地址',
							dataIndex : 'ipAddress',
							sortable : false,
							menuDisabled : true,
							flex : 1.5
						},{
							header : '端口号',
							dataIndex : 'port',
							sortable : false,
							menuDisabled : true,
							flex : 1
						},{
							header : 'Web服务名称',
							dataIndex : 'wsMethodName',
							sortable : false,
							menuDisabled : true,
							flex : 1.5
						},{
							header : '方法名称',
							dataIndex : 'wsserviceName',
							sortable : false,
							menuDisabled : true,
							flex : 1.5
						},{
							header : '是否持久化',
							dataIndex : 'isPersistence',
							sortable : false,
							menuDisabled : true,
							flex : 1.5
						}],
				store : wsLogPanel_store
			});
	
	wsLogPanel.getView().on('render', function(view) {
			var tip = Ext.create('Ext.tip.ToolTip', {
		    target: view.el,
		    delegate: view.itemSelector,
		    trackMouse: true,
		    maxWidth : '100%',
		    renderTo: Ext.getBody(),
		    style : {
				background : '#FFFF90'
			},
		    listeners: {
		        beforeshow: function updateTipBody(tip) {
		            if((view.getRecord(tip.triggerElement).raw.result).length > 1000){
		            	tip.update(
		            	'Xml内容：' + view.getRecord(tip.triggerElement).raw.paramsSel[0].value
		            	+ '，' + '<br/>' + 
						'Action名称：'	 + view.getRecord(tip.triggerElement).raw.paramsSel[1].value
						+ '，' + '<br/>' + 
						'返回内容：' + ((view.getRecord(tip.triggerElement).raw.result).substring(0,1000))+ '...'
												);
		            }else if((view.getRecord(tip.triggerElement).raw.result).length <= 1000){
		            	tip.update(
		            	'Xml内容：' + view.getRecord(tip.triggerElement).raw.paramsSel[0].value
		            	+ '，' + '<br/>' + 
						'Action名称：'	 + view.getRecord(tip.triggerElement).raw.paramsSel[1].value
						+ '，' + '<br/>' + 
						'返回内容：' + view.getRecord(tip.triggerElement).raw.result
												);
		            }
		        }
		    }
		});
	});
	
	var p2 = Ext.create('Ext.panel.Panel', {
			id : 'center_wstestInfo',
			draggable : false,
			resizable : false,
			border : 1,
			width : '100%',
			height : '100%',
			layout : 'anchor',
			autoScroll:true,
			x : 0,
			y : 0,
			bodyPadding : 15,
			items : [wsAndMethodName,webservice_url]
		});
	
	var p = Ext.create('Ext.panel.Panel', {	
				id : 'center_operatorManager',
				title : '测试BokeDee WebService服务',
				draggable : false,
				resizable : false,
				layout : 'absolute',
				border : 0,
				width : '100%',
				height : '100%',
				items : [p2,wsLogPanel]
			});
	
		return p;
}

function center_httpTest() {
	
	var ipAddress = {
		xtype : 'textfield',
		fieldLabel : 'Http访问地址',
		id : 'center_http_ipAddress',
		readOnly : false,
		height : 27,
		value : 'http://ip:port/path',
		width : 530* bokedee_width
	}
	
	var requestEncoding = {
		xtype : 'textfield',
		fieldLabel : '&nbsp;&nbsp;&nbsp;&nbsp;Http请求字符集',
		id : 'center_request_encoding',
		readOnly : false,
		labelWidth : 120,
		height : 27,
		value : 'UTF-8',
		width : 190* bokedee_width
	}
	
	var paramUrlEncoding = {
		xtype : 'checkboxfield',
		fieldLabel : '&nbsp;&nbsp;&nbsp;&nbsp;参数值UrlEcoder',
		id : 'center_param_urlencoding',
		readOnly : false,
		checked   : true,
		labelWidth : 120,
		height : 27,
		width : 250* bokedee_width
	}
	
	var checkboxgroup = {
		id : 'center_http_radio_post_param',
		xtype: 'radiogroup',
		defaultType : 'radio',
		columns: 1,
        fieldLabel: '参数方式选择',
        items: [
            {boxLabel: '多个参数设置', name: 'rb-auto', inputValue: '多个参数设置', checked: true},
            {
				boxLabel: '直接设置报文内容',
				name: 'rb-auto',
				inputValue: '直接设置报文内容'
			}
			,
        ],
		listeners: {
			change: function(radiofield, newValue,oldvalue){
				if (newValue['rb-auto'].length != 2) {
					if (newValue['rb-auto'] == '多个参数设置') {
						p.remove('center_http_testButton');
						p.remove('center_http_retContent');
						p.remove('httptest_Grid_id');
						p.remove('center_postContent');
						p.add(httpParamGrid());
						p.add(testButton);
					} else if (newValue['rb-auto'] == '直接设置报文内容') {
						p.remove('center_http_testButton');
						p.remove('center_http_retContent');
						p.remove('httptest_Grid_id');
						p.remove('center_postContent');
						p.add(postContent);
						p.add(testButton);
					}
				}
			}
		}
    };
	
	
	var comboxHttpMethod = Ext.create('Ext.data.Store', {
		model : 'Combox',
		data : [ {
			id : '请选择',
			text : '请选择'
		}, {
			id : 'POST',
			text : 'POST'
		}, {
			id : 'GET',
			text : 'GET'
		} ]
	});
	
	var requestMehtodCombox = Ext.create('Ext.form.field.ComboBox', {
			width : 200,
			name : 'http_request_method',
			id : 'http_request_method',
			fieldLabel : 'Http请求方式',
			allowBlank : false,
			store : comboxHttpMethod,
			editable : false,
			displayField : 'text',
			valueField : 'id',
			queryMode : 'local',
			value : '请选择',
				listeners : {
					select : function(combox) {
						p.remove('center_http_testButton');
						p.remove('center_http_retContent');
						p.remove('httptest_Grid_id');
						p.remove('center_http_radio_post_param');
						p.remove('center_postContent');
						
						if (combox.value == 'GET') {
							p.add(httpParamGrid());
						} else if (combox.value == 'POST') {
							p.add(checkboxgroup);
							p.add(httpParamGrid());
						}
						p.add(testButton);

					}
				}
			}
		)
	
	var retContent = {
		xtype : 'textarea',
		fieldLabel : '返回内容',
		id : 'center_http_retContent',
		readOnly : false,
		height : 220,
		value : '',
		width : 530* bokedee_width
	}
	
	var postContent = {
		xtype : 'textarea',
		fieldLabel : 'post内容',
		id : 'center_postContent',
		readOnly : false,
		height : 220,
		value : '',
		width : 530* bokedee_width
	}
	
	function httpParamGrid() {
			function httptest_GridEdit(record, index) {
		function httptest_param_btn() {
			record.data.value = httptest_param_form.getValues().paramValue;
			httptest_Grid_store.removeAt(index);
			httptest_Grid_store.insert(index, record)
			httptest_param.close();
		}
		var httptest_param_form = Ext.create('Ext.form.Panel', {
					border : 0,
					items : [{
								xtype : 'textarea',
								name : 'paramValue',
								width : 788* bokedee_width,
								height : 382* bokedee_height,
								value : record.data.value
							}]
				});
		var httptest_param = Ext.create('Ext.Window', {
					title : '参数值',
					width : 800* bokedee_width,
					height : 450* bokedee_height,
					draggable : false,
					autoScroll : true,
					resizable : false,
					modal : true,
					buttons : [{
								text : '确定',
								handler : function() {
									httptest_param_btn();
								}
							}, {
								text : '取消',
								handler : function() {
									httptest_param.close();
								}
							}],
					items : [httptest_param_form]
				}).show();
	}	
	
	
	function httptest_Grid_item_btnDelHandler() {
		Ext.Msg.show({
			title : '删除参数',
			msg : httptest_Grid_store.getAt(httptest_Grid._index).data.key,
			buttons : Ext.Msg.YESNO,
			fn : function(type) {
				if ('yes' == type) {
					httptest_Grid_store.removeAt(httptest_Grid._index);
					httptest_Grid._record = null;
				}
			}
		})
	}
	
	var httptest_Grid_pluginCellEdit = Ext.create(
			'Ext.grid.plugin.CellEditing', {
				clicksToEdit : 1
			});	
	
	var httptest_Grid_item = [{
		text : '新增',
		icon : 'images/add.png',
		scale : 'small',
		width : 50,
		handler : function() {
			var r = Ext.ModelManager.create({
						key : '参数名',
						value : '参数值'
					}, 'Service');
			httptest_Grid_store.insert(httptest_Grid_store.getCount(),
					r);
			var row = httptest_Grid_store.getCount() - 1;
			httptest_Grid_pluginCellEdit.startEditByPosition({
						row : row,
						column : 1
					});
		}
	}, {
		text : '删除',
		scale : 'small',
		icon : 'images/shanchu.png',
		width : 50,
		handler : function() {
			if (httptest_Grid._record != null) {
				httptest_Grid_item_btnDelHandler();
			}
		}
	}, {
		text : '编辑参数值',
		scale : 'small',
		icon : 'images/xiugai.png',
		width : 85,
		handler : function() {
			var record = httptest_Grid._record, index;
			if (record != null) {
				index = httptest_Grid._index;
				httptest_GridEdit(record, index);
			}
		}
	}];
		
	var httptest_Grid_store = Ext.create('Ext.data.Store', {
				model : 'KeyValue',
				data : [],
				autoLoad : false
			});
			
	
	var httptest_Grid_CheckboxModel = Ext.create(
			'Ext.selection.CheckboxModel', {
				mode : 'SINGLE',
				listeners : {
					select : function(m, record, index) {
						httptest_Grid._record = record;
						httptest_Grid._index = index;
					}
				}
			});			
	
	var	httptest_Grid = Ext.create('Ext.grid.Panel', {
					title : '参数值',
					autoScroll : true,
					id : 'httptest_Grid_id',
					selModel : httptest_Grid_CheckboxModel,
					store : httptest_Grid_store,
					tbar : {
						items : httptest_Grid_item
					},
					columns : [{
								header : '键',
								dataIndex : 'key',
								flex : 22,
								field : 'textfield'
							}, {
								header : '值',
								dataIndex : 'value',
								flex : 78,
								field : 'textarea'
							}],
					plugins : [httptest_Grid_pluginCellEdit],
					height : 196,
					width : 530
				});
		return httptest_Grid;
	}

	
	var mehtodAndEncoding= Ext.create('Ext.form.FieldContainer',{
				layout : 'hbox',
				width : '100%',
				items : [requestMehtodCombox, requestEncoding, paramUrlEncoding]
			});
	
	var testButton = Ext.create('Ext.button.Button',{
			text : '测试',
			hidden : false,
			id : 'center_http_testButton',
			handler : function() {
				bodyLoadingMask.show();
				p.remove('center_http_retContent');
				
				var center_http_ipAddress = Ext.getCmp('center_http_ipAddress').value;
				var center_request_encoding = Ext.getCmp('center_request_encoding').value;
				var http_request_method = Ext.getCmp('http_request_method').value;
				var center_param_urlencoding = Ext.getCmp('center_param_urlencoding').value;
				var httptest_Grid_id = null;
				var center_postContent = null;
				var center_http_radio_post_param = null;
				var center_postContent_com =  Ext.getCmp('center_postContent');
				var httptest_Grid_id_com = Ext.getCmp('httptest_Grid_id');
				var center_http_radio_post_param_com = Ext.getCmp('center_http_radio_post_param');
				if(httptest_Grid_id_com != null) {
					httptest_Grid_id = storeToJSON(httptest_Grid_id_com.store);
				}
				if (center_postContent_com != null) {
					center_postContent = center_postContent_com.value;
				}
				if (center_http_radio_post_param_com != null){
					center_http_radio_post_param = getCmp('center_http_radio_post_param').lastValue['rb-auto'];
				}
				var params = {
						center_http_ipAddress : center_http_ipAddress,
						center_request_encoding : center_request_encoding,
						center_param_urlencoding : center_param_urlencoding,
						http_request_method : http_request_method,
						httptest_Grid_id : httptest_Grid_id,
						center_postContent : center_postContent,
						center_http_radio_post_param : center_http_radio_post_param
						
					};
				Ext.Ajax.request({
					url : 'interfaceWsAndHttpTestController.do?actionType=buttonTestHttp',
					params : params,
					timeout :300000,
					async: false,
					success : function(response) {
						bodyLoadingMask.hide();
						var result = Ext.decode(response.responseText);
						p.add(retContent);
						Ext.getCmp('center_http_retContent').setValue(result.data);
						
					},
					failure : function(response) {
						bodyLoadingMask.hide();
						var result = Ext.decode(response.responseText);
						p.add(retContent);
						Ext.getCmp('center_http_retContent').setValue(result);
						
					}
				});
				Ext.getCmp('httpLogPanel').store.removeAll();
			  	Ext.getCmp('httpLogPanel').store.proxy.url = 'interfaceWsAndHttpTestController.do?actionType=httpLogRecord';
			  	Ext.getCmp('httpLogPanel').store.load();
				
			}
	});
	
	var httpLogPanel_store = Ext.create('Ext.data.Store', {
				model : 'LogConfig',
				proxy : {
					type : 'ajax',
					url : 'interfaceWsAndHttpTestController.do?actionType=httpLogRecord',
					reader : {
						type : 'json',
						root : 'data'
					}
				},
				autoLoad : true
				
			});
	
	var httpLogPaneltbar = {
				items : [{
				text : '查看缓存日志',
				scale : 'small',
				icon : 'images/chaxun.png',
				hidden : isHiddenFromPermission('other_config', 'wsAndHttpTest',
						'cacheLog'),
				width : 120,
				handler : function() {
						Ext.getCmp('httpLogPanel').store.removeAll();
			  			Ext.getCmp('httpLogPanel').store.proxy.url = 'interfaceWsAndHttpTestController.do?actionType=httpLogRecord';
			  			Ext.getCmp('httpLogPanel').store.load();
					}
				},{
				text : '持久化',
				scale : 'small',
				icon : 'images/xiugai.png',
				hidden : isHiddenFromPermission('other_config', 'wsAndHttpTest',
						'persistence'),
				width : 60,
				handler : function() {
					bodyLoadingMask.show();
							var records = httpLogPanel.selModel.getSelection();
							var uuidList = [];
							for (var i = 0; i < records.length; i++) {
								uuidList[i] = records[i].data.uuid;
							}
							var uuidListJson = Ext.encode(uuidList);
							if(records == ''){
								bodyLoadingMask.hide()
								Ext.bokedee.msg('提示', 1000,'请选择需要持久化的日志');
							}else if(records != ''){
								Ext.Ajax.request({
								url : 'interfaceWsAndHttpTestController.do?actionType=httpLogPersistence',
								async: false,
								params : {
									uuidList : uuidListJson
								},
								success : function(response) {
									bodyLoadingMask.hide();
									var result = Ext
											.decode(response.responseText);
									if (result.result) {
										Ext.bokedee.msg('保存成功', 1000,'已将选中日志持久化！');
									}
								},
								failure : function(response) {
									bodyLoadingMask.hide();
									var result = Ext
											.decode(response.responseText);
									Ext.Msg.alert('失败', result.data);
									}
								});
								Ext.getCmp('httpLogPanel').store.removeAll();
			  					Ext.getCmp('httpLogPanel').store.load();
							}
					}
				},{
				text : '查看持久化日志',
				scale : 'small',
				icon : 'images/chaxun.png',
				hidden : isHiddenFromPermission('other_config', 'wsAndHttpTest',
						'persistenceLog'),
				width : 120,
				handler : function() {
						Ext.getCmp('httpLogPanel').store.removeAll();
						Ext.getCmp('httpLogPanel').store.proxy.url = 'interfaceWsAndHttpTestController.do?actionType=httpLogPersistenceRecord';
			  			Ext.getCmp('httpLogPanel').store.load();
					}
				}
				,{
							 
				text : '删除',
				scale : 'small',
				icon : 'images/shanchu.png',
				hidden : isHiddenFromPermission('other_config', 'wsAndHttpTest',
						'del'),
				width : 50,
				handler : function() {
					var records = httpLogPanel.selModel.getSelection();
					var uuidList = [];
					for (var i = 0; i < records.length; i++) {
						uuidList[i] = records[i].data.uuid;
					}
					var uuidListJson = Ext.encode(uuidList);
					if (httpLogPanel.selModel.getSelection() != '') {
						Ext.Msg.show({
							title : '提示',
							msg : '确定要删除吗？',
							buttons : Ext.Msg.YESNO,
							fn : function(type) {
								if ('yes' == type) {
									bodyLoadingMask.show();
									Ext.Ajax.request({
										url : 'interfaceWsAndHttpTestController.do?actionType=httpDelRecordLog',
										params : {
											uuidList : uuidListJson
										},
										success : function(response) {
											bodyLoadingMask.hide();
											Ext.getCmp('httpLogPanel').store
													.load();
											var result = Ext
													.decode(response.responseText);
											if (result.result) {
												Ext.getCmp('httpLogPanel').store
														.removeAt(wsLogPanel.index);
												Ext.bokedee.msg('提示', 1000,'删除成功');
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
							}
						})
					}
				}
			}
				]
	}	
	
	var httpLogPanel = Ext.create('Ext.grid.Panel', {
				border : 0,
				title: '日志查看',
				id : 'httpLogPanel',
				x : 560,
				y : 0,
				height : '100%',
				loadMask : true,
				autoScroll : true,
				tbar : httpLogPaneltbar,
				selModel : Ext.create('Ext.selection.CheckboxModel', {
					mode : 'MULTI',
					listeners : {
						select : function(m, record, index) {
							httpLogPanel.record = record;
							httpLogPanel.index = index;
						}
					}
				}),
				listeners : {
					itemdblclick : function() {
							bodyLoadingMask.show();
							Ext.Ajax.request({
							url : 'interfaceWsAndHttpTestController.do?actionType=httpLogRecordDetail',
							params : {
											uuid : httpLogPanel.record.data.uuid
										},
							success : function(response) {
								bodyLoadingMask.hide();
								var result = Ext
										.decode(response.responseText);
								if (result.result) {
									Ext.getCmp('http_request_method').setValue(result.data.httpRequestMethod);
									Ext.getCmp('http_request_method').fireEvent('select',requestMehtodCombox);
									Ext.getCmp('center_request_encoding').setValue(result.data.centerRequestEncoding);
									Ext.getCmp('center_param_urlencoding').setValue(result.data.centerParamUrlencoding);
									Ext.getCmp('center_http_ipAddress').setValue(result.data.centerHttpIpAddress);
									if(Ext.getCmp('http_request_method').value == 'GET'){
										var store = Ext.getCmp('httptest_Grid_id').store;
										store.add(result.data.httpTestGrid);
										p.add(retContent);
										Ext.getCmp('center_http_retContent').setValue(result.data.result);
									}else if(Ext.getCmp('http_request_method').value == 'POST'){
										Ext.getCmp('center_http_radio_post_param').setValue({'rb-auto': result.data.centerHttpRadioPostParam})
										Ext.getCmp('center_http_radio_post_param').fireEvent('select',checkboxgroup);
										if(Ext.getCmp('center_http_radio_post_param').lastValue['rb-auto'] == '多个参数设置'){
											var store = Ext.getCmp('httptest_Grid_id').store;
											store.add(result.data.httpTestGrid);
											p.add(retContent);
											Ext.getCmp('center_http_retContent').setValue(result.data.result);
										}else if(Ext.getCmp('center_http_radio_post_param').lastValue['rb-auto'] == '直接设置报文内容'){
											Ext.getCmp('center_postContent').setValue(result.data.centerPostContent);
											p.add(retContent);
											Ext.getCmp('center_http_retContent').setValue(result.data.result);
										}
									}
									
									Ext.bokedee.msg('提示', 1000,'载入信息成功');
								}
							},
							failure : function(response) {
								bodyLoadingMask.hide();
								var result = Ext
										.decode(response.responseText);
								Ext.Msg.alert('失败', result.data);
								}
							});
							;
					}
				},
				columns : [{
							xtype : 'rownumberer',
							width : 30,
							sortable : false
						}, {
							header : 'uuid',
							dataIndex : 'uuid',
							sortable : false,
							menuDisabled : true,
							hidden : true,
							flex : 4
						},{
							header : '测试时间',
							dataIndex : 'testTime',
							sortable : false,
							menuDisabled : true,
							flex : 2,
							renderer : Ext.util.Format.dateRenderer('Y-m-d H:i:s')
						},{
							header : 'Http请求方式',
							dataIndex : 'httpRequestMethod',
							sortable : false,
							menuDisabled : true,
							flex : 1.5
						},{
							header : 'Http请求字符集',
							dataIndex : 'centerRequestEncoding',
							sortable : false,
							menuDisabled : true,
							flex : 1
						},{
							header : 'Http访问地址',
							dataIndex : 'centerHttpIpAddress',
							sortable : false,
							menuDisabled : true,
							flex : 2
						},{
							header : '是否持久化',
							dataIndex : 'isPersistence',
							sortable : false,
							menuDisabled : true,
							flex : 1.5
						}],
				store : httpLogPanel_store
			});
	
	httpLogPanel.getView().on('render', function(view) {
			var tip = Ext.create('Ext.tip.ToolTip', {
		    target: view.el,
		    delegate: view.itemSelector,
		    trackMouse: true,
		    maxWidth : '100%',
		    renderTo: Ext.getBody(),
		    style : {
				background : '#FFFF90'
			},
		    listeners: {
				beforeshow: function updateTipBody(tip) {
						if((view.getRecord(tip.triggerElement).raw.result).length > 1000){
			            	if(view.getRecord(tip.triggerElement).raw.httpRequestMethod == 'POST'){
		            			tip.update(
		            		    'HTTP请求方式：' + view.getRecord(tip.triggerElement).raw.httpRequestMethod
		            			+ '，' + '<br/>' + 
		            			'HTTP访问地址：' + view.getRecord(tip.triggerElement).raw.centerHttpIpAddress
		            			+ '，' + '<br/>' + 
								'参数方式选择：'	 + view.getRecord(tip.triggerElement).raw.centerHttpRadioPostParam
								+ '，' + '<br/>' + 
								'返回内容：' + ((view.getRecord(tip.triggerElement).raw.result).substring(0,1000))+ '...'
												);
		            		}else if(view.getRecord(tip.triggerElement).raw.httpRequestMethod == 'GET'){
		            			tip.update(
		            		    'HTTP请求方式：' + view.getRecord(tip.triggerElement).raw.httpRequestMethod
		            			+ '，' + '<br/>' + 
		            			'HTTP访问地址：' + view.getRecord(tip.triggerElement).raw.centerHttpIpAddress
		            			+ '，' + '<br/>' + 
								'返回内容：' + ((view.getRecord(tip.triggerElement).raw.result).substring(0,1000))+ '...'
												);
		            		}
			            }else if((view.getRecord(tip.triggerElement).raw.result).length <= 1000){
			            	if(view.getRecord(tip.triggerElement).raw.httpRequestMethod == 'POST'){
		            			tip.update(
		            		    'HTTP请求方式：' + view.getRecord(tip.triggerElement).raw.httpRequestMethod
		            			+ '，' + '<br/>' + 
		            			'HTTP访问地址：' + view.getRecord(tip.triggerElement).raw.centerHttpIpAddress
		            			+ '，' + '<br/>' + 
								'参数方式选择：'	 + view.getRecord(tip.triggerElement).raw.centerHttpRadioPostParam
								+ '，' + '<br/>' + 
								'返回内容：' + view.getRecord(tip.triggerElement).raw.result
												);
		            		}else if(view.getRecord(tip.triggerElement).raw.httpRequestMethod == 'GET'){
		            			tip.update(
		            		    'HTTP请求方式：' + view.getRecord(tip.triggerElement).raw.httpRequestMethod
		            			+ '，' + '<br/>' + 
		            			'HTTP访问地址：' + view.getRecord(tip.triggerElement).raw.centerHttpIpAddress
		            			+ '，' + '<br/>' + 
								'返回内容：' + view.getRecord(tip.triggerElement).raw.result
												);
		            		}
			            }
		        }
		    }
		});
	});
	
	var p = Ext.create('Ext.panel.Panel', {
			id : 'center_httptestInfo',
			draggable : false,
			resizable : false,
			border : 0,
			layout : 'anchor',
			autoScroll:true,
			width : '100%',
			height : '100%',
			x : 0,
			y : 0,
			bodyPadding : 15,
			items : [mehtodAndEncoding,ipAddress,testButton]
		});
	
	var p2 = Ext.create('Ext.panel.Panel', {	
				id : 'center_operatorManager2',
				title : '测试BokeDee Http服务',
				draggable : false,
				resizable : false,
				layout : 'absolute',
				border : 0,
				width : '100%',
				height : '100%',
				items : [p,httpLogPanel]
			});
	
		return p2;
}

function center_wsAndHttpTest() {

		var result = [];
		result.push(center_wsTest());
		result.push(center_httpTest());
		
		var tab = Ext.create('Ext.tab.Panel', {
		    width: '100%',
		    height: '100%',
			autoScroll:true,
		    items: []
		});
		tab.add(result);
		
	return tab;
}
/**
 * 系统资源信息
 */
function center_systemCondition() {
	var findSystemInfoURL = 'interfaceInfoFindDownloadController.do?actionType=findDownloadStore&type=DownloadSource.json';

	function systemConditionSaveOrUpdate(DownloadSource) {
		Ext.Ajax.request({
					url : 'interfaceInfoDownloadSaveController.do',
					params : {
						actionType : 'saveOrUpdateDownloadSource',
						text : DownloadSource
					},
					success : function(response) {
						if ('success' == response.responseText)
							//Ext.Msg.alert('提示', '保存成功');
						Ext.bokedee.msg('保存信息', 1000,'保存成功');
						else
							Ext.Msg.alert('保存失败', response.responseText);
					}
				});
	}

	// 设置可编辑数据
	var p_pluginCellEdit = Ext.create('Ext.grid.plugin.CellEditing', {
				clicksToEdit : 1,
				listeners : {
					beforeedit : function(record) {

					}
				}
			});

	var t = changeColorToRed('资源下载配置');

	// 设置工具栏
	var p_tbar_items = [{
				text : '新增',
				scale : 'small',
				icon : 'images/add.png',
				hidden : isHiddenFromPermission('other_config', 'sysResource',
						'add'),
				width : 50,
				handler : function() {
					var r = Ext.ModelManager.create({
								FileType : '',
								FileDescription : '',
								Masterfiledirectory : '',
								Theworkingdirectory : '',
								Verification : ''
							}, 'globalSource');
					p_store.insert(p_store.getCount(), r);
					var row = p_store.getCount() - 1;
					p_pluginCellEdit.startEditByPosition({
								row : row,
								column : 0
							});
				}
			}, {
				text : '删除',
				scale : 'small',
				hidden : isHiddenFromPermission('other_config', 'sysResource',
						'del'),
				icon : 'images/shanchu.png',
				width : 50,
				handler : function() {
					if (p.p_sel_record) {
						p_store.removeAt(p.p_sel_index);
						p.p_sel_record = undefined;
					}
				}
			}, {
				text : '保存',
				scale : 'small',
				hidden : isHiddenFromPermission('other_config', 'sysResource',
						'save'),
				icon : 'images/baocun.png',
				width : 50,
				handler : function() {
					var DownloadSource = storeToJSON(p_store);
					systemConditionSaveOrUpdate(DownloadSource);
				}
			}, {
				text : '查看下载地址',
				scale : 'small',
				hidden : isHiddenFromPermission('other_config', 'sysResource',
						'findDownloadUrl'),
				icon : 'images/chakan.png',
				handler : function() {
					if (p.p_sel_record) {
						Ext.Msg
								.alert(
										'下载地址',
										window.location.origin
												+ '/BokeDee/downloadFiles.jsp?FileType='
												+ p.p_sel_record.data.FileType);
					}
				}
			}];

	// 复选框选择模式
	var p_CheckboxModel = Ext.create('Ext.selection.CheckboxModel', {
				mode : 'SINGLE',
				listeners : {
					select : function(m, record, index) {
						p.p_sel_record = record;
						p.p_sel_model = m.getSelection()[0];
						p.p_sel_index = index;
					}
				}
			});

	// 设置ComboBox数据
	var states = Ext.create('Ext.data.Store', {
				fields : ['abbr', 'name'],
				data : [{
							"abbr" : "yes",
							"name" : "是"
						}, {
							"abbr" : "no",
							"name" : "否"
						}]
			});

	// 设置column
	var p_columns = [{
				header : '资源类型',
				dataIndex : 'FileType',
				sortable : false,
				menuDisabled : true,
				flex : 2,
				editor : {
					xtype : 'textfield',
					regex : /^[a-zA-Z]+$/,
					regexText : '格式为英文字母',
					allowBlank : false
				}
			}, {
				header : '资源描述',
				dataIndex : 'FileDescription',
				sortable : false,
				menuDisabled : true,
				flex : 3,
				editor : {
					xtype : 'textfield',
					allowBlank : false
				}
			}, {
				header : '主目录',
				sortable : false,
				menuDisabled : true,
				dataIndex : 'Masterfiledirectory',
				flex : 4,
				editor : {
					xtype : 'textfield',
					allowBlank : false
				}
			}, {
				header : '临时目录',
				sortable : false,
				menuDisabled : true,
				dataIndex : 'Theworkingdirectory',
				flex : 4,
				editor : {
					xtype : 'textfield',
					allowBlank : false
				}
			}, {
				header : '是否需要验证',
				sortable : false,
				menuDisabled : true,
				dataIndex : 'Verification',
				flex : 2,
				editor : {
					xtype : 'combobox',
					allowBlank : false,
					editable : false,
					store : states,
					displayField : 'name',
					valueField : 'abbr'
				},
				renderer : function(val) {
					if (val == "no") {
						return "否";
					}
					if (val == "yes") {
						return "是";
					}
				}
			}];
	// 数据模板
	Ext.regModel('DownloadFileInformation', {
				fields : [{
							name : 'FileType',
							type : 'string'
						}, {
							name : 'FileDescription',
							type : 'string'
						}, {
							name : 'Masterfiledirectory',
							type : 'string'
						}, {
							name : 'Theworkingdirectory',
							type : 'string'
						}, {
							name : 'Verification',
							type : 'string'
						}]
			});

	// 设置数据对象
	var p_store = Ext.create('Ext.data.Store', {
				model : 'DownloadFileInformation',
				proxy : {
					type : 'ajax',
					url : findSystemInfoURL
				},
				autoLoad : true,
				listeners : {
					load : function(me) {
						bodyLoadingMask.hide();
						right.hide();
					}
				}
			});

	// 转换格式
	function storeToJSON(store) {
		return Ext.JSON.encode(storeToObj(store));
	}

	/**
	 * 把Store转成JSON
	 * 
	 * @param {Object}
	 *            store
	 * @return {TypeName}
	 */
	function storeToObj(store) {
		var array = new Array();
		for (var i = 0; i < store.getCount(); i++) {
			var row = store.getAt(i);
			array.push(row.data);
		}
		return array;
	}

	var plugins = [p_pluginCellEdit];

	// 数据列表显示
	var p = Ext.create('Ext.grid.Panel', {
				id : 'center_systemInfo',
				title : t,
				border : 0,
				height : '100%',
				width : '100%',
				viewConfig : {
					loadMask : false
				},
				sortableColumns : false,
				selModel : p_CheckboxModel,
				tbar : {
					items : p_tbar_items
				},
				columns : p_columns,
				store : p_store,
				plugins : plugins
			});

	return p;

}
/**
 * Excel导入到数据库
 */
function center_excelImportToTable(){
		
	var title = changeColorToRed('Excel导入到数据库');
	var store = Ext.create('Ext.data.Store', {
				model : 'YigoConfig',
				proxy : {
					type : 'ajax',
					url : 'excelImportToTableController.do?actionType=getAllExcel',
					reader : {
						type : 'json',
						root : 'data'
					}
				},
				autoLoad : true
			});
	var p_tbar_items = [{
							text : '新增',
							scale : 'small',
							icon : 'images/add.png',
							hidden : isHiddenFromPermission('other_config', 'excelImportToTable',
								'add'),
							width : 50,
							handler : function() {
								excelImport();
							}
						},{
							text : '修改',
							scale : 'small',
							icon : 'images/xiugai.png',
							hidden : isHiddenFromPermission('other_config', 'excelImportToTable',
								'update'),
							width : 50,
							handler : function() {
								if (ExcelImpotgridPanel.selModel.getSelection() != '') {
									bodyLoadingMask.show();
									Ext.Ajax.request({
										url : 'excelImportToTableController.do?actionType=getDetailExcelById',
										params : {
											id : ExcelImpotgridPanel.record.data.id
										},
										success : function(response) {
											bodyLoadingMask.hide();
											var result = Ext.decode(response.responseText);
											if (result.result) {
												excelImport(
													ExcelImpotgridPanel.record.data.text,
													ExcelImpotgridPanel.record.data.description,
													result.data,
													ExcelImpotgridPanel.record.data.id);
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
							}
						},{
							text : '删除',
							scale : 'small',
							icon : 'images/shanchu.png',
							hidden : isHiddenFromPermission('other_config', 'excelImportToTable',
								'del'),
							width : 50,
							handler : function() {
								if (ExcelImpotgridPanel.selModel.getSelection() != '') {
									Ext.Msg.show({
										title : '提示',
										msg : '确定要删除吗？',
										buttons : Ext.Msg.YESNO,
										fn : function(type) {
											if ('yes' == type) {
												bodyLoadingMask.show();
												Ext.Ajax.request({
													url : 'excelImportToTableController.do?actionType=delOneExcel',
													params : {
														id : ExcelImpotgridPanel.record.data.id
													},
													success : function(response) {
														bodyLoadingMask.hide();
														Ext.getCmp('ExcelImpotgridPanel').store
																.load();
														var result = Ext
																.decode(response.responseText);
														if (result.result) {
															Ext.getCmp('ExcelImpotgridPanel').store
																	.removeAt(ExcelImpotgridPanel.index);
															Ext.Msg.alert('提示', '删除成功');
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
										}
									})
								}
							}
						}]
	
	var ExcelImpotgridPanel = Ext.create('Ext.grid.Panel', {
		title : title,
		id : 'ExcelImpotgridPanel',
		width : '100%',
		margins : '5 0 0 5',
		tbar : p_tbar_items,
		selModel : Ext.create('Ext.selection.CheckboxModel', {
					mode : 'SINGLE',
					listeners : {
						select : function(m, record, index) {
							ExcelImpotgridPanel.record = record;
							ExcelImpotgridPanel.index = index;
						}
					}
				}),
		border : 1,
		defaultType : 'textfield',
		columns : [{
					xtype : 'rownumberer',
					width : 40,
					text : '序号',
					sortable : false,
					menuDisabled : true,
					sortable : false
				},  {
					header : '名称',
					dataIndex : 'text',
					sortable : false,
					menuDisabled : true,
					flex : 2
				}, {
					header : 'id',
					dataIndex : 'id',
					sortable : false,
					menuDisabled : true,
					hidden : true
				},{
					header : '描述',
					dataIndex : 'description',
					sortable : false,
					menuDisabled : true,
					flex : 4
				},{
					header : '选择导入文件',
//					dataIndex : 'button',
					sortable : false,
					menuDisabled : true,
					flex : 2,
					renderer:function(v,style,me){
					var html = "<input style='width:80px;height:22px' type='button' "
  				 			+ "value='选择导入文件' onclick='selectExcelPath( "
  				  			+ me.index
  				  			+ ");'/>" ;
  				  		console.log(html)
						return html;
    				 }   
//				},
//				{
//            xtype:'actioncolumn', 
//            items: [{
//                icon: 'images/add.png', 
//                handler: function(grid, rowIndex, colIndex) {
//                    var rec = grid.getStore().getAt(rowIndex);
//                    alert("Edit " + rec.get('firstname'));
//                }
            }],
		store : store,
		listeners : {
			itemdblclick : function() {
				bodyLoadingMask.show();
				Ext.Ajax.request({
										url : 'excelImportToTableController.do?actionType=getDetailExcelById',
										params : {
											id : ExcelImpotgridPanel.record.data.id,
											type : ExcelImpotgridPanel.record.data.type
										},
										success : function(response) {
											bodyLoadingMask.hide();
											var result = Ext.decode(response.responseText);
											if (result.result) {
												excelImport(
													ExcelImpotgridPanel.record.data.text,
													ExcelImpotgridPanel.record.data.description,
													result.data,
													ExcelImpotgridPanel.record.data.id);
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
		}
		
	});
	
	return ExcelImpotgridPanel;
}
/**
 * Excel导入数据界面
 */
function excelImport(text, description, record, detailId){

	var win_buttons =[{
		text : '保存',
		handler : function() {
			var form_text = win_form.getValues().text;
			var form_description = win_form.getValues().description;
			var form_dataSource = win_form.getValues().dataSource;
			var form_table = win_form.getValues().table;
			var form_sheetIndex = win_form.getValues().sheetIndex;
			var form_sheetName = win_form.getValues().sheetName;
			var form_sheetStartLine = win_form.getValues().sheetStartLine;
			var form_sheetTitle = win_form.getValues().sheetTitle;
			var form_excelPath = win_form.getValues().excelPath;
//			var form_excelPath = win_form.getForm().findField('excelPath').getValue();
//			var from_colName = win_form.getValues.colNamesMapping.colName;
//			alert(form_excelPath);
			
			if (null == form_text || '' == form_text) {
				Ext.Msg.alert('提示', '名称不能为空！！！');
				return;
			} else {
				if (!isRigthName(form_text)) {
					//Ext.Msg.alert('提示', '名称不能包含空格及中文字符');
					Ext.bokedee.msg('保存提示', 1000,'名称不能包含空格、中文及特殊字符字符');
					return;
				}
				var items = Ext.getCmp('ExcelImpotgridPanel').store.data.items;
				for (var i = 0; i < items.length; i++) {
					if (form_text == items[i].data.text
							&& !(detailId == items[i].data.id)) {
						Ext.Msg.alert('提示', '名称已经存在！！！');
						return;
					}
				}

			}
			
			
			if (null == form_dataSource || '' == form_dataSource) {
				Ext.Msg.alert('提示', '数据源不能为空！！！');
				return;
			}
			if (null == form_table || '' == form_table) {
				Ext.Msg.alert('提示', '表名不能为空！！！');
				return;
			}
			if ((null == form_sheetIndex || '' == form_sheetIndex)&&(null == form_sheetName || '' == form_sheetName)) {
				Ext.Msg.alert('提示', 'Sheet索引和名称不能都为空！！！');
				return;
			}
			if (form_sheetStartLine < form_sheetTitle) {
				Ext.Msg.alert('提示', '起始行不能小于标题行！！！');
				return;
			}
//			if (null == from_colName || '' == from_colName) {
//				Ext.Msg.alert('提示', 'Excel列名不能为空！！！');
//				return;
//			}
			
			var yigoconfig = {
				text : form_text,
				description : form_description,
				dataSource : form_dataSource,
				table : form_table,
				sheetIndex : form_sheetIndex,
				sheetName : form_sheetName,
				sheetStartLine : form_sheetStartLine,
				sheetTitle : form_sheetTitle,
				excelPath : form_excelPath,
				colNamesMapping : storeToObj(Ext.getCmp('colNamesMapping').store)
			}
		
		var mapData = {// 第一个map
				id : detailId,
				text : form_text,
				description : form_description,
				data : yigoconfig
			}
			
		Ext.Ajax.request({
				url : 'excelImportToTableController.do?actionType=updateExcelImport',
				params : {
					data : Ext.encode(mapData)
				},
				success : function(response) {
					bodyLoadingMask.hide();
					var result = Ext.decode(response.responseText);
					if (result.result) {
						Ext.getCmp('ExcelImpotgridPanel').store.load();
						win.close();
						//Ext.Msg.alert('成功', '保存成功');
						Ext.bokedee.msg('保存信息', 1000,'保存成功');
					} else {
						Ext.Msg.alert('失败');
					}
				},
				failure : function(response) {
					bodyLoadingMask.hide();
					var result = Ext.decode(response.responseText);
					Ext.Msg.alert('失败');
				}

			});
			
		}
	}, {
		text : '取消',
		handler : function() {	
			win.close();
		}
	}]
	
	var p_CheckboxModel = Ext.create('Ext.selection.CheckboxModel', {
				mode : 'MULTI'
			});
	
	var p_tbar_items = [{
							 
							text : '删除',
							scale : 'small',
							icon : 'images/shanchu.png',
							width : 50,
							handler : function() {
								if (p.selModel.selected.length > 0) {
								p.store.remove(p.selModel.getSelection());
					}
								}
							}
						
						]
	
	var win_store = Ext.create('Ext.data.Store', {
		fields : [ 'colName', 'dbColumnName', 'dbColumnType', 'date', 'dbColumnTypeName' ],
		data : record ? record.data.colNamesMapping : [],
		autoLoad : true
	});
						
	//字段匹配grid
	var p =Ext.create('Ext.grid.Panel', {
				
				title: '字段匹配',
				id : 'colNamesMapping',
			    width : '100%',
			    height : 390,
			    tbar : p_tbar_items,
			    viewConfig : {
					loadMask : false
				},
				store:win_store,
				selModel : p_CheckboxModel,
				plugins : Ext.create('Ext.grid.plugin.CellEditing', {
					clicksToEdit : 1}),
			    columns: [ {
							xtype : 'rownumberer',
							width : 40,
							text : '序号',
							sortable : false,
							menuDisabled : true,
							sortable : false
						}, {
							header : 'Excel列名',
							dataIndex : 'colName',
							sortable : false,
							menuDisabled : true,
							flex : 1,
							field : {
								xtype : 'combobox',
								name : 'colName',
								store : ['A', 'B', 'C', 'D', 'E', 'F', 'G',
										'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O',
										'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W',
										'X', 'Y', 'Z']
									}
							},{
							header : '数据库字段',
							dataIndex : 'dbColumnName',
							sortable : false,
							menuDisabled : true,
							flex : 1
							},{
							header : '日期Format',
							dataIndex : 'date',
							sortable : false,
							menuDisabled : true,
							flex : 1,
							field : 'textfield'
							},{
							header : '数据库字段类型',
							dataIndex : 'dbColumnType',
							sortable : false,
							menuDisabled : true,
							flex : 1,
							field : 'textfield',
							hidden : true
							},{
							header : '数据库字段类型名称',
							dataIndex : 'dbColumnTypeName',
							sortable : false,
							menuDisabled : true,
							flex : 1
							}
			    ]
			}
			);
	
	var win_form = Ext.create('Ext.form.Panel', {
				width : '100%',
				height : '100%',
				bodyPadding : 5,
				margins : '50 0 0 5',
				border : 0,
				method : 'post',
				layout : 'anchor',
				defaults : {
					anchor : '100%'
				},
				defaultType : 'textfield',
				store : Ext.create('Ext.data.Store', {
							fields : ['colName', 'dbColumnName', 'dbColumnTypeName'],
							data : record ? record.colNamesMapping : [],
							autoLoad : true
						}),
				items : [{
							fieldLabel : 'ID',
							name : 'id',
							hidden : true,
							readOnly : true
						},{
							fieldLabel : '名称'+needToFill,
							name : 'text',
							emptyText : '只能有数字、减号、下划线和字母组成',
							value : text,
							allowBlank : false
						},{
							xtype : 'textarea',
							fieldLabel : '描述',
							name : 'description',
							value : description,
							height : 40,
							allowBlank : true
						},{
							xtype : 'fieldcontainer',
							layout : 'hbox',
							width : '100%',
							items : [{
										fieldLabel : '数据源'+needToFill,
										flex : 1,
										name : 'dataSource',
										id : 'dataSource',
										allowBlank : false,
										xtype : 'combobox',
										editable : false,
										displayField : 'displayField',
										valueField : 'value',
										queryMode : 'local',
										emptyText : '请选择',
										allowBlank : true,
										store : Ext.create('Ext.data.Store', {
											model : 'SimpleCombox',
											proxy : {
												type : 'ajax',
												url : 'interfaceInfoFindController.do?actionType=findDatasourceForJdbcConnector',
												reader : {
													type : 'json',
													root : 'root'
												}
											},
											autoLoad : true
										})
									}, {
										fieldLabel : '表'+needToFill,
										margins : '0 0 0 20',
										xtype : 'textfield',
										valueField : 'value',
										id : 'table',
										name : 'table',
										flex : 0.6
									},{
										xtype : 'button',
										margins : '0 0 0 10',
										text : '获取信息',
										valueField : 'value',
										handler : function() {
												var form_DataSource = Ext.getCmp('dataSource').value;
												var form_table = Ext.getCmp('table').value;
												if (Ext.getCmp('colNamesMapping').store.getCount()<1) {
													bodyLoadingMask.show();
													Ext.Ajax.request({
													url : 'excelImportToTableController.do?actionType=excelImport',
													params : {
														id:form_DataSource,
														tb:form_table
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
															Ext.Msg
																	.alert('成功',
																			'导入成功！');
														} else {
															Ext.Msg
																	.alert('失败',
																			'表不存在！');
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
												else{
//													alert('aaa');
													bodyLoadingMask.show();
													var colNamesMappingCount = Ext.getCmp('colNamesMapping').store.count();
													Ext.Ajax.request({
													url : 'excelImportToTableController.do?actionType=excelImport',
													params : {
														id:form_DataSource,
														tb:form_table
													},
													success : function(response) {
														bodyLoadingMask.hide();
														var result = Ext
																.decode(response.responseText);
														
														if (result.result) {
															for(var j=0; j<colNamesMappingCount; j++){
																var form_colName = Ext.getCmp('colNamesMapping').store.getAt(j).get('colName');
																var form_date = Ext.getCmp('colNamesMapping').store.getAt(j).get('date');
																var form_dbColumnName = Ext.getCmp('colNamesMapping').store.getAt(j).get('dbColumnName');
																var form_dbColumnType = Ext.getCmp('colNamesMapping').store.getAt(j).get('dbColumnType');
																var form_dbColumnTypeName = Ext.getCmp('colNamesMapping').store.getAt(j).get('dbColumnTypeName');
																Ext.Array.each(result.data, function(data, index, countriesItSelf) {
																	if (form_dbColumnName == data.dbColumnName) {
																	data['colName'] = form_colName;
																	data['date'] = form_date;
															    }
																});
															}
															Ext.getCmp('colNamesMapping').store
																	.removeAll();
															Ext.getCmp('colNamesMapping').store
																	.add(result.data);
															Ext.Msg
																	.alert('成功',
																			'导入成功！');
														}
														
														else {
															Ext.Msg
																	.alert('失败',
																			'表不存在！');
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
											}
										}]
						},{
							xtype : 'fieldcontainer',
							fieldLabel : 'Sheet索引',
							layout : 'hbox',
							defaultType : 'textfield',
							items : [{
										name : 'sheetIndex',
										size : 10,
										xtype : 'numberfield',
										minValue : 1
									}, {
										name : 'sheetName',
										margins : '0 0 0 10',
										fieldLabel : 'Sheet名字',
										labelWidth : 70
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
						},
						p
									
							]
			});
	if (record) {
		win_form.getForm().setValues({
					text : text,
					description : description,
					dataSource : record.data.dataSource,
					table : record.data.table,
					sheetIndex : record.data.sheetIndex,
					sheetName : record.data.sheetName,
					sheetStartLine : record.data.sheetStartLine,
					sheetTitle : record.data.sheetTitle,
					excelPath : record.data.excelPath
				});
	}
	var win = Ext.create('Ext.Window', {
				title : '新增Excel导入数据',
				width : 800*bokedee_width,
				height : 600*bokedee_height,
				layout : 'absolute',
				draggable : false,
				bodyStyle : 'background:#ffffff;',
				resizable : false,
				modal : true,
				buttons : win_buttons,
				items : [win_form]

			});
	win.show();
}
/**
 * 选择导入文件
 */
function selectExcelPath(selIndex)
{
	var record = Ext.getCmp('ExcelImpotgridPanel').getStore().getAt(selIndex);
	
	var win_form = Ext.create('Ext.form.Panel', {
				width : '100%',
				height : '100%',
				bodyPadding : 5,
				margins : '50 0 0 5',
				border : 0,
				method : 'post',
				layout : 'anchor',
				defaults : {
					anchor : '100%'
				},
				defaultType : 'textfield',
				//store : store,
				
				items : [
								{
									fieldLabel : 'Excel文件',
									name : 'excelFile',
									id : 'excelPath', 
									xtype: 'textfield',
									inputType:'file',  
									height : 30
								},{
									fieldLabel : 'ID',
									name : 'id',
									hidden : true,
									readOnly : false,
									value : record.data.id
								},{
									fieldLabel : 'uuID',
									id : 'uuid',
									name : 'uuid',
									hidden : true,
									readOnly : false,
									value : Ext.data.IdGenerator.get('uuid').generate()
								},{
									fieldLabel : '当前Excel处理到行数',
									name : 'processedLines',
									id : 'processedLines',
									hidden : false,
									readOnly : false
								},{
									fieldLabel : '已成功处理行数',
									name : 'successLines',
									id : 'successLines',
									hidden : false,
									readOnly : false
								},{
									fieldLabel : '失败的行数',
									name : 'failLines',
									id : 'failLines',
									hidden : false,
									readOnly : false
								}
						],
						 buttons:[  
                            {  
                                text:'上传',  
                                handler:function(){  
                                	var fileVal = Ext.getCmp('excelPath').rawValue;
                                    if(win_form.form.isValid() && fileVal != ''){  
                                    	Ext.getCmp('successLines').setValue('');
                    					Ext.getCmp('processedLines').setValue('');
                                    	var task = {
                                				run : function() {
                                					var data = ajaxSyncCall('excelImportToTableController.do?actionType=excelImportPs&uuid=' + Ext.getCmp('uuid').value);
                                					var result = Ext.decode(data);
                                					Ext.getCmp('successLines').setValue(result.data.successLines);
                                					Ext.getCmp('processedLines').setValue(result.data.currentXlsLine);
                                				},
                                				interval : 1
                                			};
                                    	
                                    	var runner = new Ext.util.TaskRunner();
                            			runner.start(task);
                            			
                                    	var o = win_form.form.submit({  
                                            url:'excelImportToTableController.do?actionType=excelInformationImport',  
                                            waitMsg:'文件上传中...', 
                                            success: function(form, action) {
                                            	runner.stop(task);
                                    			var result = Ext.decode(action.response.responseText);
                                    			Ext.getCmp('successLines').setValue(result.data.successLines);
                            					Ext.getCmp('processedLines').setValue(result.data.currentXlsLine);
											    Ext.Msg.alert("系统提示", "成功！");
                                                
                                            },  
                                            failure: function(form, action) {  
                                            	runner.stop(task);
                                            	var result = Ext.decode(action.response.responseText);
                                                Ext.Msg.alert("系统提示", result.data);  
                                            }  
                                        });  
                                    	//alert(o);
                                    }else{  
                                        Ext.Msg.alert("系统提示","请选择文件后再上传！");  
                                    }  
                                }  
                            },  
                            {  
                                text:'取消',  
                                handler:function(){  
                                    win.hide();  
                                }  
                            }  
                        ]
	})
    
	var win = Ext.create('Ext.Window', {
				title : '选择导入文件',
				width : 800*bokedee_width,
				height : 350*bokedee_height,
				layout : 'absolute',
				draggable : false,
				bodyStyle : 'background:#ffffff;',
				resizable : false,
				modal : true,
				items : [win_form]

			});
		win.show();
}

function ajaxSyncCall(url, params, method) {
	changeToLogin();
	if (!method)
		method = 'POST';
	var obj;
	var value;
	if (window.ActiveXObject) {
		obj = new ActiveXObject('Microsoft.XMLHTTP');
	} else if (window.XMLHttpRequest) {
		obj = new XMLHttpRequest();
	}
	obj.open(method, url, false);
	obj.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
	obj.send(params);
	return obj.responseText;
}
