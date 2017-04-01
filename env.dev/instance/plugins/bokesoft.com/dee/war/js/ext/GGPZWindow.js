/**
 * 创建和更新公共配置[Connector]的Window
 */
function windowSaveOrUpdatePdConnector(record, readOnly) {
	function win_buttons_doSuccess() {
		getCmp('center_publicDeploy').store.removeAll();
		getCmp('center_publicDeploy').store.load();
		// Ext.Msg.alert('保存结果', '保存成功');
		Ext.bokedee.msg('保存信息', 1000,'保存成功');
		win.close();
	}

	function win_buttons_do(head, form_ConnectorType) {
		if (!win_form.getForm().isValid()) {
			Ext.Msg.alert('提示', '有必填项为空');
			return;
		}
		var actionType;
		if (record) {
			actionType = 'updatePdConnector';
		} else {
			actionType = 'savePdConnector';
		}

		var connectorData = {};
		if (attrData != null) {
			var data = Ext.JSON.decode(attrData);
			for (var length = 0; length < data.length; length++) {
				var attrname = data[length].name;
				connectorData[attrname] = win_form.getValues()[attrname];
			}
			if ('Jdbc' == form_ConnectorType) {// 如果是jdbc类型的 把sql语句加到参数里
				var queries = storeToJSON(win_form_jdbcGrid.store);
				if (win_form_jdbcGrid.store.getCount() == 0) {
					queries = [];
				}
				if (validateJdbcQueryIsTheSameOrIsNull(win_form_jdbcGrid.store)) {
					return;
				}
				connectorData.queries = queries
			}
		}
		Ext.Ajax.request({
					url : 'interfaceInfoSaveController.do',
					params : {
						head : head,
						actionType : actionType,
						smallType : form_ConnectorType,
						data : Ext.encode(connectorData)
					},
					success : function(response) {
						var result = response.responseText;
						if ('success' == result) {
							win_buttons_doSuccess();
						} else {
							Ext.Msg.alert('出错了', result);
						}
					}
				});
	}

	var win_buttons;

	if (readOnly == true) {
		win_buttons = [{
					text : '关闭',
					handler : function() {
						win.close();
					}
				}];
	} else {
		win_buttons = [{
			text : '确定',
			id : 'textid',
			handler : function() {
				var form_text = win_form.getValues().text;
				var form_type = win_form.getValues().bigType;
				var form_ConnectorType = win_form.getValues().smallType;
				var form_description = win_form.getValues().description;
				if (form_text == '') {
					Ext.Msg.alert('提示', '配置名称不能为空');
					return;
				}
				if (form_text.indexOf('*') > -1 || form_text.indexOf(' ') > -1) {
					Ext.Msg.alert('提示', '配置名称中不能含有[*]或者空格');
					return;
				}
				var headObj = {
					text : form_text,
					bigType : form_type,
					description : form_description,
					id : win_form.getValues().id
				};
				var head = Ext.encode(headObj);
				win_buttons_do(head, form_ConnectorType);
			}
		}, {
			text : '取消',
			handler : function() {
				win.close();
			}
		}];
	}

	function win_form_jdbcGrid_item_btnDelHandler() {
		Ext.Msg.show({
			title : '删除Query',
			msg : win_form_jdbcGrid_store.getAt(win_form_jdbcGrid._index).data.key,
			buttons : Ext.Msg.YESNO,
			fn : function(type) {
				if ('yes' == type) {
					win_form_jdbcGrid_store.removeAt(win_form_jdbcGrid._index);
					win_form_jdbcGrid._record = null;
				}
			}
		})
	}

	var win_form_jdbcGrid_CheckboxModel = Ext.create(
			'Ext.selection.CheckboxModel', {
				mode : 'SINGLE',
				listeners : {
					select : function(m, record, index) {
						win_form_jdbcGrid._record = record;
						win_form_jdbcGrid._index = index;
					}
				}
			});

	function win_form_jdbcGridEdit(record, index) {
		function win_jdbcQuery_btn() {
			record.data.value = win_jdbcQuery_form.getValues().jdbcQueryValue;
			win_form_jdbcGrid_store.removeAt(index);
			win_form_jdbcGrid_store.insert(index, record)
			win_jdbcQuery.close();
		}
		var win_jdbcQuery_form = Ext.create('Ext.form.Panel', {
					border : 0,
					items : [{
								xtype : 'textarea',
								readOnly : readOnly,
								name : 'jdbcQueryValue',
								width : 788,
								height : 382,
								value : record.data.value
							}]
				});
		var win_jdbcQuery = Ext.create('Ext.Window', {
					title : 'Jdbc:query',
					width : 800 * bokedee_width,
					height : 450 * bokedee_height,
					draggable : false,
					autoScroll : true,
					resizable : false,
					modal : true,
					buttons : [{
								text : '确定',
								handler : function() {
									win_jdbcQuery_btn();
								}
							}, {
								text : '取消',
								handler : function() {
									win_jdbcQuery.close();
								}
							}],
					items : [win_jdbcQuery_form]
				}).show();
	}

	var win_form_jdbcGrid_item = [{
		text : '新增',
		icon : 'images/add.png',
		scale : 'small',
		width : 50,
		handler : function() {
			var r = Ext.ModelManager.create({
						key : 'Quer1',
						value : '这里填写SQL语句'
					}, 'Service');
			win_form_jdbcGrid_store.insert(win_form_jdbcGrid_store.getCount(),
					r);
			var row = win_form_jdbcGrid_store.getCount() - 1;
			win_form_jdbcGrid_pluginCellEdit.startEditByPosition({
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
			if (win_form_jdbcGrid._record != null) {
				win_form_jdbcGrid_item_btnDelHandler();
			}
		}
	}, {
		text : '编辑SQL',
		scale : 'small',
		icon : 'images/xiugai.png',
		width : 75,
		handler : function() {
			var record = win_form_jdbcGrid._record, index;
			if (record != null) {
				index = win_form_jdbcGrid._index;
				win_form_jdbcGridEdit(record, index);
			}
		}
	}];

	var win_form_jdbcGrid_pluginCellEdit = Ext.create(
			'Ext.grid.plugin.CellEditing', {
				clicksToEdit : 1
			});

	var win_form_win_fcJUrl = 'interfaceInfoFindController.do?actionType=findDatasourceForJdbcConnector';
	var win_form_win_jmsJMSUrl = '.do?actionType=findFactoryForJMSConnector';
	var win_form_jdbcGrid_store = Ext.create('Ext.data.Store', {
				model : 'KeyValue',
				data : [],
				autoLoad : false
			});

	var win_form_jdbcGrid = [];
	function create_form_jdbcGrid() {
		win_form_jdbcGrid = Ext.create('Ext.grid.Panel', {
					title : 'Jdbc:query',
					autoScroll : true,
					selModel : win_form_jdbcGrid_CheckboxModel,
					store : win_form_jdbcGrid_store,
					tbar : {
						items : win_form_jdbcGrid_item
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
					plugins : [win_form_jdbcGrid_pluginCellEdit],
					height : 198,
					width : 780
		});
		return win_form_jdbcGrid;
	}
	function dataSourceRefComboxStoreLoad(me) {
		if (record) {
			var dataSourceRefId = record.raw['dataSourceRef'];
			var count = me.getCount();
			for (var i = 0; i < count; i++) {
				if (me.getAt(i).raw.value == dataSourceRefId) {
					win.dataSourceRef = me.getAt(i).raw;
					getCmp('dataSourceRef').select(me.getAt(i));
				}
			}
		}
	}

	function factoryRefComboxStoreLoad(me) {
		var connectionFactory_refID = record.raw['connectionFactory_ref'];
		var count = me.getCount();
		for (var i = 0; i < count; i++) {
			if (me.getAt(i).raw.value == connectionFactory_refID) {
				getCmp('connectionFactory_ref').select(me.getAt(i));
			}
		}
	}

	var win_form_fdConnector = 'interfaceInfoFindController.do?actionType=getSpringBeansOrConnector';
	// 只是Combobox的值
	var connectordata = ajaxSyncCall(win_form_fdConnector, 'value=false', null);

	var connectorStore = Ext.create('Ext.data.Store', {
				fields : ['type', 'text'],
				data : Ext.JSON.decode(connectordata),
				autoLoad : true
			});
	var attrData;
	var win_form = Ext.create('Ext.form.Panel', {
				width : '100%',
				height : '100%',
				bodyPadding : 5,
				autoScroll : true,
				margins : '20 0 0 5',
				border : 0,
				url : 'interfaceInfoSaveController.do',
				method : 'post',
				layout : 'anchor',
				defaults : {
					anchor : '100%'
				},
				defaultType : 'textfield',
				items : [{
					xtype : 'combobox',
					fieldLabel : 'Connector类型'+needToFill,
					editable : false,
					readOnly : readOnly,
					name : 'smallType',
					store : connectorStore,
					displayField : 'text',
					valueField : 'type',
					queryMode : 'local',
					allowBlank : false,
					value : 'Http',
					listeners : {
						change : function(field, newValue, oldValue) {
							attrData = createSpringBeanOrConnectorConfig(
									newValue, oldValue, win_form, attrData,
									false);
							if (newValue == 'Jdbc') {
								win_form_jdbcGrid = create_form_jdbcGrid();
								win_form.add(win_form_jdbcGrid);
							}
							if (oldValue == 'Jdbc') {
								win_form_jdbcGrid.destroy();
							}
						}
					}
				}, {
					fieldLabel : '配置名称'+needToFill,
					readOnly : readOnly,
					name : 'text',
					allowBlank : false
				}, {
					name : 'id',
					hidden : true
				}, {
					name : 'bigType',
					hidden : true,
					value : 'Connector.json'
				}, {
					xtype : 'textarea',
					fieldLabel : '配置描述',
					readOnly : readOnly,
					name : 'description',
					height : 60,
					allowBlank : true
				}, win_form_jdbcGrid]
			});
	if (record) {
		attrData = createSpringBeanOrConnectorConfig(record.raw.smallType,
				null, win_form, attrData, true)
		win_form.getForm().setValues({
					text : record.raw['text'],
					id : record.raw['id'],
					description : record.raw['description'],
					smallType : record.raw['smallType']
				});
		if (attrData != null) {
			var obj = {}
			var data = Ext.JSON.decode(attrData);
			for (var length = 0; length < data.length; length++) {
				var attrname = data[length].name;
				obj[attrname] = record.raw[attrname];
			}
			win_form.getForm().setValues(obj);
			if ('Jdbc' == record.raw.smallType) {
				if (record.raw['queries'] != null
						&& '' != record.raw['queries']) {
					win_form_jdbcGrid.store.add(record.raw['queries']);
				}
			}
		}
	}

	var win = Ext.create('Ext.Window', {
				title : '创建和更新公共配置[连接器]',
				width : 800 * bokedee_width,
				height : 450 * bokedee_height,
				draggable : false,
				autoScroll : true,
				resizable : false,
				modal : true,
				buttons : win_buttons,
				items : [win_form]
			});

	win.show();
}

/**
 * 创建和更新公共配置[DataSource]的Window
 */
function windowSaveOrUpdateDataSource(record, readOnly) {
	var dbcp = 'org.apache.commons.dbcp.BasicDataSource';
	var xa = 'org.enhydra.jdbc.standard.StandardXADataSource';
	function win_buttons_do(head) {
		var smallType = getCmp('smallType').value;
		var dataBaseType = win_form.getValues().dataBaseType;
		var driverClassName = win_form.getValues().driverClassName;
		var url = win_form.getValues().url;
		var username = win_form.getValues().username;
		var password = win_form.getValues().password;
		var validationQuery = win_form.getValues().validationQuery;
		var testOnBorrow = win_form.getValues().testOnBorrow;
		var testOnReturn = win_form.getValues().testOnReturn;
		var logAbandoned = win_form.getValues().logAbandoned;
		var removeAbandoned = win_form.getValues().removeAbandoned;
		var initialSize = win_form.getValues().initialSize;
		var maxActive = win_form.getValues().maxActive;
		var minIdle = win_form.getValues().minIdle;
		var maxIdle = win_form.getValues().maxIdle;
		var removeAbandonedTimeout = win_form.getValues().removeAbandonedTimeout;
		var maxWait = win_form.getValues().maxWait;
		var timeBetweenEvictionRunsMillis = win_form.getValues().timeBetweenEvictionRunsMillis;
		var numTestsPerEvictionRun = win_form.getValues().numTestsPerEvictionRun;
		var minEvictableIdleTimeMillis = win_form.getValues().minEvictableIdleTimeMillis;
		
		if (driverClassName == '' || driverClassName.indexOf(' ') > -1) {
			Ext.Msg.alert('提示', '驱动类名不可以为空');
			return;
		}
		if (url == '') {
			Ext.Msg.alert('提示', '地址不可以为空');
			return;
		}
		if (username == '' || username.indexOf(' ') > -1) {
			Ext.Msg.alert('提示', '用户名不可以为空');
			return;
		}
		if (password == '' || password.indexOf(' ') > -1) {
			Ext.Msg.alert('提示', '密码不可以为空');
			return;
		}
		if ('true' == testOnBorrow) {
			if (null == validationQuery || '' == validationQuery.Trim()) {
				Ext.Msg.alert('提示', '你设置了[取出验证]为“是”,请设置验证语句');
				return;
			}
		}
		if ('true' == testOnReturn) {
			if (null == validationQuery || '' == validationQuery.Trim()) {
				Ext.Msg.alert('提示', '你设置了[放回验证]为“是”,请设置验证语句');
				return;
			}
		}
		if (win_form.getValues().smallType == dbcp) {
			if (initialSize == '' || initialSize.indexOf(' ') > -1) {
				Ext.Msg.alert('提示', '初始化连接数不可以为空');
				return;
			}
			if (maxActive == '' || maxActive.indexOf(' ') > -1) {
				Ext.Msg.alert('提示', '最大连接数不可以为空');
				return;
			}
			if (maxWait == '' || maxWait.indexOf(' ') > -1) {
				Ext.Msg.alert('提示', '最大等待时间不可以为空');
				return;
			}
		}

		var actionType;
		if (record) {
			actionType = 'updatePdDataSource';
		} else {
			actionType = 'savePdDataSource';
		}

		Ext.Ajax.request({
					url : 'interfaceInfoSaveController.do',
					params : {
						head : head,
						actionType : actionType,
						smallType : smallType,
						dataBaseType : dataBaseType,
						driverClassName : driverClassName,
						url : url,
						username : username,
						password : password,
						validationQuery : validationQuery,
						testOnBorrow : testOnBorrow,
						testOnReturn : testOnReturn,
						logAbandoned : logAbandoned,
						removeAbandoned : removeAbandoned,
						initialSize : initialSize,
						maxActive : maxActive,
						minIdle : minIdle,
						maxIdle : maxIdle,
						removeAbandonedTimeout : removeAbandonedTimeout,
						maxWait : maxWait,
						timeBetweenEvictionRunsMillis : timeBetweenEvictionRunsMillis,
						numTestsPerEvictionRun : numTestsPerEvictionRun,
						minEvictableIdleTimeMillis : minEvictableIdleTimeMillis
					},
					success : function() {
						// Ext.Msg.alert('保存结果', '保存成功');
						Ext.bokedee.msg('保存信息', 1000,'保存成功');
						getCmp('center_publicDeploy').store.removeAll();
						getCmp('center_publicDeploy').store.load();
						win.close();
					},
					failure : function(response) {
						Ext.Msg.alert('提示', '保存失败', response.responseText);
					}
				});
	}

	var win_buttons;

	if (readOnly == true) {
		win_buttons = [{
					text : '关闭',
					handler : function() {
						win.close();
					}
				}];
	} else {
		win_buttons = [{
			text : '测试连接',
			handler : function() {
				var driver = win_form.getValues().driverClassName;
				var url = win_form.getValues().url;
				var username = win_form.getValues().username;
				var password = win_form.getValues().password;
				if (driver == '' || driver.indexOf(' ') > -1) {
					Ext.Msg.alert('提示', '驱动类名不可以为空');
					return;
				}
				if (url == '') {
					Ext.Msg.alert('提示', '地址不可以为空');
					return;
				}
				if (username == '' || username.indexOf(' ') > -1) {
					Ext.Msg.alert('提示', '用户名不可以为空');
					return;
				}
				if (password == '' || password.indexOf(' ') > -1) {
					Ext.Msg.alert('提示', '密码不可以为空');
					return;
				}
				bodyLoadingMask.show();// 锁屏
				Ext.Ajax.request({
					url : 'interfaceInfoSaveController.do?actionType=testDsConnection',
					params : {
						driver : driver,
						url : url,
						username : username,
						password : password
					},
					success : function(response) {
						bodyLoadingMask.hide();
						if ('success' == response.responseText) {
							Ext.Msg.alert('连接成功', '有效数据连接');
						} else {
							Ext.Msg.alert('连接失败', response.responseText);
						}
					},
					failure : function(response) {
						bodyLoadingMask.hide();
						Ext.Msg.alert('连接失败', response.responseText);
					}
				});
			}
		}, {
			text : '确定',
			id : 'textid',
			handler : function() {
				var form_text = win_form.getValues().text;
				var form_type = win_form.getValues().bigType;
				var form_description = win_form.getValues().description;
				var form_dataBaseType = win_form.getValues().dataBaseType;
				if (form_text == '') {
					Ext.Msg.alert('提示', '配置名称不能为空');
					return;
				}
				if (form_dataBaseType == '请选择数据库类型') {
					/*
					 * Ext.Msg.alert('提示','请选择数据库类型'); return;
					 */
				}
				if (form_text.indexOf('*') > -1 || form_text.indexOf(' ') > -1) {
					Ext.Msg.alert('提示', '配置名称中不能含有[*]或者空格');
					return;
				}
				var headObj = {
					text : form_text,
					bigType : form_type,
					description : form_description,
					id : win_form.getValues().id
				};
				var head = Ext.encode(headObj);
				win_buttons_do(head);
			}
		}, {
			text : '取消',
			handler : function() {
				win.close();
			}
		}];
	}

	var typeMsgOracle = '如果使用的是Oracle数据库，且不是10g的话需要把WEB-INF/lib下的jar包替换为对应版本';
	var typeMsgDB2 = '如果使用的是DB2数据库，请把所需jar包放到WEB-INF/lib下';
	var sqlserverDriver = 'net.sourceforge.jtds.jdbc.Driver';
	var oracleDriver = 'oracle.jdbc.driver.OracleDriver';
	var db2Driver = 'COM.ibm.db2.jdbc.net.DB2Driver';
	var accessDriver = 'sun.jdbc.odbc.JdbcOdbcDriver';
	var sqlserverURL = 'jdbc:jtds:sqlserver://[host]:[port]/[databasename]';
	var oracleURL = 'jdbc:oracle:thin:@<server>[:<1521>]:<database_name>';
	var db2URL = 'jdbc:db2://[ip]:[port]/[databasename]';
	var accessURL = 'jdbc:odbc:driver={Microsoft Access Driver (*.mdb, *.accdb)};DBQ=C:/access.accdb';
	var oracleValidateSql = 'select 1 from dual';
	var sqlserverValidateSql = 'select 1';
	var db2ValidateSql = 'values current date';
	function databaseTypeSelect(type) {
		if ('oracle' == type) {
			Ext.bkmsg.msg(changeColorToRed('注意'), typeMsgOracle, 15000);
			win_form.getForm().setValues({
						driverClassName : oracleDriver,
						url : oracleURL,
						validationQuery : oracleValidateSql
					});
		} else if ('sqlserver' == type) {
			win_form.getForm().setValues({
						driverClassName : sqlserverDriver,
						url : sqlserverURL,
						validationQuery : sqlserverValidateSql
					});
		} else if ('db2' == type) {
			Ext.bkmsg.msg(changeColorToRed('注意'), typeMsgDB2, 15000);
			win_form.getForm().setValues({
						driverClassName : db2Driver,
						url : db2URL,
						validationQuery : db2ValidateSql
					});
		} else if ('access' == type) {
			Ext.bkmsg.msg(changeColorToRed('注意'),
					'地址中[C:/access.accdb]是数据库实际位置路径,根据情况更换（盘符必须大写）', 15000);
			win_form.getForm().setValues({
						driverClassName : accessDriver,
						url : accessURL,
						validationQuery : ''
					});
		} else if ('other' == type) {
			win_form.getForm().setValues({
						driverClassName : '',
						url : '',
						validationQuery : ''
					});
		}
	}

	var win_form = Ext.create('Ext.form.Panel', {
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
				items : [{
							fieldLabel : '数据源类型'+needToFill,
							xtype : 'combobox',
							editable : false,
							readOnly : readOnly,
							id : 'smallType',
							name : 'smallType',
							store : Ext.create('Ext.data.Store', {
										model : 'Combox',
										data : [{
													value : dbcp,
													displayField : 'DBCP数据源'
												}, {
													value : xa,
													displayField : 'XA数据源'
												}]
									}),
							displayField : 'displayField',
							valueField : 'value',
							queryMode : 'local',
							allowBlank : false,
							value : dbcp,
							width : 778,
							listeners : {
								select : function(c, r) {
									win.dataSourceType = r[0].raw;
									if (r[0].data.value == dbcp) {
										getCmp('win_dbcp').show();
									} else {
										getCmp('win_dbcp').hide();
									}
								}
							}
						}, {
							fieldLabel : '数据库类型'+needToFill,
							xtype : 'combobox',
							editable : false,
							readOnly : readOnly,
							name : 'dataBaseType',
							store : Ext.create('Ext.data.Store', {
										model : 'Combox',
										data : [{
													value : 'oracle',
													displayField : 'Oracle'
												}, {
													value : 'sqlserver',
													displayField : 'SQLServer'
												}, {
													value : 'db2',
													displayField : 'DB2'
												}, {
													value : 'access',
													displayField : 'Access'
												}, {
													value : 'other',
													displayField : '其他'
												}]
									}),
							displayField : 'displayField',
							valueField : 'value',
							queryMode : 'local',
							allowBlank : false,
							value : '请选择数据库类型',
							width : 778,
							listeners : {
								select : function(c, r) {
									databaseTypeSelect(r[0].data.value);
								}
							}
						}, {
							fieldLabel : '配置名称'+needToFill,
							name : 'text',
							readOnly : readOnly,
							allowBlank : false
						}, {
							name : 'bigType',
							hidden : true,
							value : 'DataSource.json'
						}, {
							name : 'id',
							hidden : true
						}, {
//							xtype : 'textarea',
							fieldLabel : '配置描述',
							readOnly : readOnly,
							name : 'description',
							allowBlank : true
						}, {
							fieldLabel : '驱动类名'+needToFill,
							name : 'driverClassName',
							readOnly : readOnly,
							allowBlank : false
						}, {
							fieldLabel : '地址'+needToFill,
							readOnly : readOnly,
							name : 'url',
							allowBlank : false
						}, {
							fieldLabel : '用户名'+needToFill,
							name : 'username',
							readOnly : readOnly,
							allowBlank : false
						}, {
							fieldLabel : '密码'+needToFill,
							name : 'password',
							readOnly : readOnly,
							allowBlank : false
						}, {
							fieldLabel : '验证语句',
							name : 'validationQuery',
							readOnly : readOnly
						}, {
							fieldLabel : '取出验证',
							xtype : 'combobox',
							readOnly : readOnly,
							editable : false,
							name : 'testOnBorrow',
							store : Ext.create('Ext.data.Store', {
										fields : ['value', 'displayField'],
										data : [{
													value : 'true',
													displayField : '是'
												}, {
													value : 'false',
													displayField : '否'
												}]
									}),
							displayField : 'displayField',
							valueField : 'value',
							queryMode : 'local',
							allowBlank : false,
							width : 777,
							value : 'true'
						}, {
							fieldLabel : '放回验证',
							xtype : 'combobox',
							readOnly : readOnly,
							editable : false,
							name : 'testOnReturn',
							store : Ext.create('Ext.data.Store', {
										fields : ['value', 'displayField'],
										data : [{
													value : 'true',
													displayField : '是'
												}, {
													value : 'false',
													displayField : '否'
												}]
									}),
							displayField : 'displayField',
							valueField : 'value',
							queryMode : 'local',
							allowBlank : false,
							width : 777,
							value : 'false'
						}, {
							xtype : 'fieldcontainer',
							id : 'win_dbcp',
							labelWidth : 100,
							items : [{
										xtype : 'numberfield',
										fieldLabel : '初始化连接数',
										name : 'initialSize',
										readOnly : readOnly,
										minValue : 0,
										width : 765,
										value : 3
									}, {
										xtype : 'numberfield',
										fieldLabel : '最大连接数',
										name : 'maxActive',
										readOnly : readOnly,
										minValue : 0,
										width : 765,
										value : 10
									},{
										xtype : 'numberfield',
										fieldLabel : '最小空闲连接',
										name : 'minIdle',
										readOnly : readOnly,
										width : 765,
										value : 0
									},{
										xtype : 'numberfield',
										fieldLabel : '最大空闲连接',
										name : 'maxIdle',
										readOnly : readOnly,
										width : 765,
										value : 0
									},{
										xtype : 'numberfield',
										fieldLabel : '最大等待时间',
										name : 'maxWait',
										minValue : 0,
										readOnly : readOnly,
										width : 765,
										value : 5000,
										step : 1000
									},{
										fieldLabel : '连接被泄露时是否打印',
										xtype : 'combobox',
										readOnly : readOnly,
										editable : false,
										name : 'logAbandoned',
										store : Ext.create('Ext.data.Store', {
													fields : ['value', 'displayField'],
													data : [{
																value : 'true',
																displayField : '是'
															}, {
																value : 'false',
																displayField : '否'
															}]
												}),
										displayField : 'displayField',
										valueField : 'value',
										queryMode : 'local',
										allowBlank : false,
										width : 765,
										value : 'true'
									}, {
										fieldLabel : '是否自动回收超时连接',
										xtype : 'combobox',
										readOnly : readOnly,
										editable : false,
										name : 'removeAbandoned',
										store : Ext.create('Ext.data.Store', {
													fields : ['value', 'displayField'],
													data : [{
																value : 'true',
																displayField : '是'
															}, {
																value : 'false',
																displayField : '否'
															}]
												}),
										displayField : 'displayField',
										valueField : 'value',
										queryMode : 'local',
										allowBlank : false,
										width : 765,
										value : 'true',
										listeners : {
											select : function(c, r) {
												if (r[0].data.value == true) {
													getCmp('removeAbandonedTimeout').show();
												} else {
													getCmp('removeAbandonedTimeout').hide();
												}
											}
										}
									},{
										xtype : 'numberfield',
										fieldLabel : '超时时间',
										name : 'removeAbandonedTimeout',
										id : 'removeAbandonedTimeout',
										minValue : 0,
										readOnly : readOnly,
										width : 765,
										value : 1000,
										step : 1000
									},{
										xtype : 'numberfield',
										fieldLabel : '空闲连接回收期间休眠的时间值',
										name : 'timeBetweenEvictionRunsMillis',
										minValue : 0,
										readOnly : readOnly,
										width : 765,
										value : 5000,
										step : 1000
									},{
										xtype : 'numberfield',
										fieldLabel : '每次回收(如果有)运行时检查的连接数量',
										name : 'numTestsPerEvictionRun',
										minValue : 0,
										readOnly : readOnly,
										width : 765,
										value : 10
									},{
										xtype : 'numberfield',
										fieldLabel : '连接在池中保持空闲而不被回收的最小时间值',
										name : 'minEvictableIdleTimeMillis',
										minValue : 0,
										readOnly : readOnly,
										width : 765,
										value : 5000,
										step : 1000
									}]
						}]
			});
	if (record) {
		var smallTypeCombobox = getCmp('smallType');
		for (var i = 0; i < smallTypeCombobox.store.getCount(); i++) {
			if (smallTypeCombobox.store.getAt(i).data.value == record.data['smallType']) {
				smallTypeCombobox.select(smallTypeCombobox.store.getAt(i));
			}
		}
		win_form.getForm().setValues({
					text : record.data['text'],
					id : record.data['id'],
					description : record.data['description'],
					driverClassName : record.raw['driverClassName'],
					url : record.raw['url'],
					username : record.raw['username'],
					password : record.raw['password'],
					validationQuery : record.raw['validationQuery'],
					testOnBorrow : record.raw['testOnBorrow'],
					testOnReturn : record.raw['testOnReturn']
				});
		if (record.data.smallType == dbcp) {
			getCmp('win_dbcp').show();
			win_form.getForm().setValues({
				initialSize : record.raw['initialSize'],
				maxActive : record.raw['maxActive'],
				maxWait : record.raw['maxWait'],
				maxIdle : record.raw['maxIdle'],
				minIdle : record.raw['minIdle'],
				removeAbandoned : record.raw['removeAbandoned'],
				removeAbandonedTimeout : record.raw['removeAbandonedTimeout'],
				logAbandoned : record.raw['logAbandoned'],
				minEvictableIdleTimeMillis : record.raw['minEvictableIdleTimeMillis'],
				numTestsPerEvictionRun : record.raw['numTestsPerEvictionRun'],
				timeBetweenEvictionRunsMillis : record.raw['timeBetweenEvictionRunsMillis'],				
				dataBaseType : record.raw['dataBaseType'] == null
						? '请选择数据库类型'
						: record.raw['dataBaseType']
			});
		} else {

			getCmp('win_dbcp').hide();
			win_form.getForm().setValues({
				dataBaseType : record.raw['dataBaseType'] == null
						? '请选择数据库类型'
						: record.raw['dataBaseType'],
				initialSize : 3,
				maxActive : 10,
				maxWait : 5000
			});
		}
	}

	var win = Ext.create('Ext.Window', {
				title : '创建和更新公共配置[数据源]',
				width : 800 * bokedee_width,
				height : 500 * bokedee_height,
				draggable : false,
				autoScroll : true,
				resizable : false,
				modal : true,
				buttons : win_buttons,
				items : [win_form]
			});
	win.show();
}

/**
 * 创建或更新SpringBean
 */
function windowSaveOrUpdateSpringBean(record, readOnly) {
	function win_buttons_doSuccess() {
		getCmp('center_publicDeploy').store.removeAll();
		getCmp('center_publicDeploy').store.load();
		// Ext.Msg.alert('保存结果', '保存成功');
		Ext.bokedee.msg('保存信息', 1000,'保存成功');
		win.close();
	}

	function win_buttons_do(head, smallType) {
		if (!win_form.getForm().isValid()) {
			Ext.Msg.alert('提示', '有必填项为空');
			return;
		}
		if (record) {
			actionType = 'updateSpringBean';
		} else {
			actionType = 'saveSpringBean';
		}
		var springBeanData = {};
		if (attrData != null) {
			var data = Ext.JSON.decode(attrData);
			for (var length = 0; length < data.length; length++) {
				var attrname = data[length].name;
				springBeanData[attrname] = win_form.getValues()[attrname];
			}
		}
		Ext.Ajax.request({
					url : 'interfaceInfoSaveController.do',
					params : {
						actionType : actionType,
						smallType : smallType,
						head : head,
						data : Ext.encode(springBeanData)
					},
					success : function(response) {
						var result = response.responseText;
						if ('success' == result) {
							win_buttons_doSuccess();
						} else {
							Ext.Msg.alert('出错了', result);
						}
					}
				});
	}
	var win_buttons;

	if (readOnly == true) {
		win_buttons = [{
					text : '关闭',
					handler : function() {
						win.close();
					}
				}];
	} else {
		win_buttons = [{
			text : '确定',
			id : 'textid',
			handler : function() {
				var form_text = win_form.getValues().text;
				var form_description = win_form.getValues().description;
				var form_smallType = win_form.getValues().smallType;
				var form_type = win_form.getValues().bigType;
				if (form_text.indexOf('*') > -1 || form_text.indexOf(' ') > -1) {
					Ext.Msg.alert('提示', '名称中不能含有[*]或者空格');
					return;
				}
				var headObj = {
					text : form_text,
					bigType : form_type,
					description : form_description,
					id : win_form.getValues().id
				};
				var head = Ext.encode(headObj);
				win_buttons_do(head, form_smallType);
			}
		}, {
			text : '取消',
			handler : function() {
				win.close();
			}
		}];
	}

	var win_form_fdBean = 'interfaceInfoFindController.do?actionType=getSpringBeansOrConnector';
	// 只是Combobox的值
	var springBeandata = ajaxSyncCall(win_form_fdBean, 'value=true', null);

	var beanStore = Ext.create('Ext.data.Store', {
				fields : ['text', 'type'],
				data : Ext.JSON.decode(springBeandata),
				autoLoad : true
			});
	var attrData;
	var win_form = Ext.create('Ext.form.Panel', {
				width : '100%',
				height : '100%',
				bodyPadding : 5,
				border : 0,
				url : 'interfaceInfoSaveController.do',
				method : 'post',
				layout : 'anchor',
				defaults : {
					anchor : '100%'
				},
				defaultType : 'textfield',
				items : [{
					xtype : 'combobox',
					fieldLabel : 'Bean类型'+needToFill,
					readOnly : readOnly,
					editable : false,
					name : 'smallType',
					store : beanStore,
					displayField : 'text',
					valueField : 'type',
					queryMode : 'local',
					allowBlank : false,
					emptyText : "请选择",
					listeners : {
						change : function(field, newValue, oldValue) {
							attrData = createSpringBeanOrConnectorConfig(
									newValue, oldValue, win_form, attrData,
									true);
						}
					}
				}, {
					fieldLabel : 'Bean名称'+needToFill,
					name : 'text',
					readOnly : readOnly,
					allowBlank : false
				}, {
					name : 'id',
					hidden : true
				}, {
					name : 'bigType',
					hidden : true,
					value : 'SpringBean.json'
				}, {
					xtype : 'textarea',
					fieldLabel : '描述信息',
					readOnly : readOnly,
					name : 'description'
				}]
			});

	if (record) {
		attrData = createSpringBeanOrConnectorConfig(record.raw.smallType,
				null, win_form, attrData, true)
		win_form.getForm().setValues({
					text : record.raw['text'],
					id : record.raw['id'],
					description : record.raw['description'],
					smallType : record.raw['smallType']
				});
		if (attrData != null) {
			var obj = {}
			var data = Ext.JSON.decode(attrData);
			for (var length = 0; length < data.length; length++) {
				var attrname = data[length].name;
				obj[attrname] = record.raw[attrname];
			}
			win_form.getForm().setValues(obj);
		}
	}

	var win = Ext.create('Ext.Window', {
				title : '创建和更新SpringBean',
				width : 800 * bokedee_width,
				height : 450 * bokedee_height,
				draggable : false,
				resizable : false,
				modal : true,
				items : win_form,
				buttons : win_buttons
			});
	win.show();
}

/**
 * 查看公共配置Transformer
 * 
 * @param {Object}
 *            record
 */
function windowGGPZTransformer(record) {

	var win_buttons = [{
				text : '关闭',
				handler : function() {
					win.close();
				}
			}];

	var win_form = Ext.create('Ext.form.Panel', {
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
				items : [{
							fieldLabel : '配置名称',
							name : 'text',
							readOnly : true,
							allowBlank : false
						}, {
							fieldLabel : '类型',
							name : 'smallType',
							readOnly : true
						}, {
							fieldLabel : 'ID',
							name : 'id',
							readOnly : true
						}, {
							xtype : 'textarea',
							fieldLabel : '配置描述',
							name : 'description',
							allowBlank : true,
							readOnly : true
						}, {
							fieldLabel : 'Java类名',
							name : 'className',
							allowBlank : false,
							readOnly : true
						}, {
							fieldLabel : '例子',
							name : 'forExample',
							readOnly : true
						}]
			});

	win_form.getForm().setValues({
				text : record.data['text'],
				id : record.data['id'],
				description : record.data['description'],
				className : record.data['className'],
				category : record.data['category'],
				smallType : record.data['smallType'],
				forExample : record.data['forExample']
			});

	var win = Ext.create('Ext.Window', {
				title : '公共配置[Transformer]',
				width : 800 * bokedee_width,
				height : 450 * bokedee_height,
				draggable : false,
				autoScroll : true,
				resizable : false,
				modal : true,
				buttons : win_buttons,
				items : [win_form]
			});
	win.show();
}
/**
 * 新增或更新webServiceMapping
 * 
 * @param {Object}
 *            record
 */
function windowAddOrUpdateServiceMapping(record) {

	win_buttons = [{
		text : '确定',
		handler : function() {
			var form_key = win_form.getValues().key;
			var form_description = win_form.getValues().description;
			var form_interfaces = win_form.getValues().interfaces;
			var form_services = win_form.getValues().services;
			if (record == null) {// 新增
				if (form_key == '' || form_key.indexOf('*') > -1
						|| form_key.indexOf(' ') > -1) {
					Ext.Msg.alert('提示', '名称中不能含有[*]或者空格');
					return;
				}
				var store = Ext.getCmp('center_publicDeploy').store;
				var count = store.getCount();
				for (var i = 0; i < count; i++) {
					if (form_key == store.getAt(i).data.key) {
						Ext.Msg.alert('提示', '该名称已存在');
						return;
					}
				}
			}
			if (form_interfaces == '请选择接口' || form_interfaces == '') {
				Ext.Msg.alert('提示', '请选择接口');
				return;
			}
			if (form_services == '请选择服务' || form_services == '') {
				Ext.Msg.alert('提示', '请选择服务');
				return;
			}
			var data = {
				key : form_key,
				interfaces : form_interfaces,
				services : form_services,
				description : form_description
			};
			var head = Ext.encode(data);
			Ext.Ajax.request({
						url : 'interfaceInfoSaveController.do',
						params : {
							actionType : 'saveOrUpdateWSAMapping',
							text : head,
							isAdd : record == null ? true : false
						},
						success : function(response) {
							if ('success' == response.responseText) {
								win.close();
								Ext.Msg.alert('提示', '修改成功');
								getCmp('center_publicDeploy').store.load();
							} else {
								Ext.Msg.alert('提示', '修改失败：'
												+ response.responseText);
							}
						}
					});
		}
	}, {
		text : '取消',
		handler : function() {
			win.close();
		}
	}];

	var interfaceComStore_url = 'interfaceInfoFindController.do?actionType=findWebServiceInterfaceStore&type=http,vm';

	var serviceComStore_url = 'interfaceInfoFindController.do?actionType=findWebServiceServiceStore&type=http,vm';

	var win_form = Ext.create('Ext.form.Panel', {
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
		items : [{
					fieldLabel : '配置名称'+needToFill,
					name : 'key',
					allowBlank : false,
					emptyText : '名称一旦添加，确定后将不能修改,如果需要修改可以删除后再新增',
					readOnly : record != null ? true : false
				}, {
					xtype : 'fieldcontainer',
					fieldLabel : '配置服务'+needToFill,
					layout : 'hbox',
					defaultType : 'combobox',
					items : [{
						xtype : 'combobox',
						id : 'interfaces',
						name : 'interfaces',
						flex : 1,
						value : '请选择接口',
						store : Ext.create('Ext.data.Store', {
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
									if (record != null) {
										Ext.Ajax.request({
											url : serviceComStore_url,
											params : {
												interfaceId : record.data.interfaces
											},
											success : function(response) {
												Ext.getCmp('services').store
														.removeAll();
												Ext.getCmp('services')
														.setValue('请选择服务');
												var result = response.responseText;
												var j = Ext.decode(result);
												Ext.getCmp('services').store
														.add(j.root);
												getCmp('interfaces')
														.select(record.data.interfaces);
												getCmp('services')
														.select(record.data.services);
											}
										})
									}
								}
							},
							autoLoad : true
						}),
						listeners : {
							select : function(newValue) {
								Ext.Ajax.request({
											url : serviceComStore_url,
											params : {
												interfaceId : newValue.value
											},
											success : function(response) {
												Ext.getCmp('services').store
														.removeAll();
												Ext.getCmp('services')
														.setValue('请选择服务');
												var result = response.responseText;
												var j = Ext.decode(result);
												Ext.getCmp('services').store
														.add(j.root);
											}
										})
							}
						},
						editable : false,
						displayField : 'displayField',
						valueField : 'value',
						queryMode : 'local'
					}, {
						xtype : 'combobox',
						id : 'services',
						name : 'services',
						flex : 1,
						value : '请选择服务',
						store : Ext.create('Ext.data.Store', {
									model : 'Combox'
								}),
						editable : false,
						displayField : 'displayField',
						valueField : 'value',
						queryMode : 'local'
					}]
				}, {
					xtype : 'textarea',
					fieldLabel : '配置描述',
					name : 'description',
					allowBlank : true
				}]
	});

	if (record != null) {
		win_form.getForm().setValues({
					key : record.data['key'],
					description : record.data['description']
				});
	}
	var win = Ext.create('Ext.Window', {
				title : '公共配置[Web服务映射]',
				width : 500 * bokedee_width,
				height : 300 * bokedee_height,
				draggable : false,
				autoScroll : true,
				resizable : false,
				modal : true,
				buttons : win_buttons,
				items : [win_form]
			});
	win.show();
}
/**
 * 新增或更新servletMapping
 */
function windowAddOrUpdateServletMapping(record) {

	win_buttons = [{
		text : '确定',
		handler : function() {
			var form_id = win_form.getValues().id;
			var form_key = win_form.getValues().key;
			var form_description = win_form.getValues().description;
			var form_interfaces = win_form.getValues().interfaces;
			var form_services = win_form.getValues().services;
			var form_interfacesName = Ext.getCmp('interfaces').rawValue;
			var form_servicesName = Ext.getCmp('services').rawValue;
			var form_isuseresponsemodel = win_form.getValues().isuseresponsemodel;
			var form_iscrypto = win_form.getValues().iscrypto;
			var form_usecommonkey = win_form.getValues().usecommonkey;
			var form_deskey = win_form.getValues().deskey;
			var form_rsapublickey = win_form.getValues().rsapublickey;
			var form_rsaprivatekey = win_form.getValues().rsaprivatekey;
			if (form_key == '' || form_key.indexOf('*') > -1
					|| form_key.indexOf(' ') > -1) {
				Ext.Msg.alert('提示', '名称中不能含有[*]或者空格');
				return;
			}
			var store = Ext.getCmp('center_publicDeploy').store;
			var count = store.getCount();
			for (var i = 0; i < count; i++) {
				if (form_key == store.getAt(i).data.key
						&& form_id != store.getAt(i).data.id) {
					Ext.Msg.alert('提示', '该名称已存在');
					return;
				}
			}
			if (form_interfaces == '请选择接口' || form_interfaces == '') {
				Ext.Msg.alert('提示', '请选择接口');
				return;
			}
			if (form_services == '请选择服务' || form_services == '') {
				Ext.Msg.alert('提示', '请选择服务');
				return;
			}
			var data = {
				id : form_id,
				key : form_key,
				interfaces : form_interfaces,
				services : form_services,
				interfacesName : form_interfacesName,
				servicesName : form_servicesName,
				description : form_description,
				isuseresponsemodel : form_isuseresponsemodel,
				iscrypto : form_iscrypto,
				usecommonkey : form_usecommonkey,
				deskey : form_deskey,
				rsapublickey : form_rsapublickey,
				rsaprivatekey : form_rsaprivatekey
			};
			var head = Ext.encode(data);
			bodyLoadingMask.show();
			Ext.Ajax.request({
						url : 'interfaceInfoSaveController.do',
						params : {
							actionType : 'saveOrUpdateSAMapping',
							text : head
						},
						success : function(response) {
							bodyLoadingMask.hide();
							if ('success' == response.responseText) {
								win.close();
								Ext.Msg.alert('提示', '操作成功');
								getCmp('center_publicDeploy').store.load();
							} else {
								Ext.Msg.alert('提示', '操作失败：'
												+ response.responseText);
							}
						},
						failure : function(response) {
							bodyLoadingMask.hide();
							Ext.Msg
									.alert('提示', '操作失败：'
													+ response.responseText);
						}
					});
		}
	}, {
		text : '取消',
		handler : function() {
			win.close();
		}
	}];

	var interfaceComStore_url = 'interfaceInfoFindController.do?actionType=findWebServiceInterfaceStore&type=vm';

	var serviceComStore_url = 'interfaceInfoFindController.do?actionType=findWebServiceServiceStore&type=vm';

	var win_form = Ext.create('Ext.form.Panel', {
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
		items : [{
					name : 'id',
					allowBlank : true,
					hidden : true
				}, {
					fieldLabel : '配置名称'+needToFill,
					name : 'key',
					allowBlank : false
				}, {
					xtype : 'fieldcontainer',
					fieldLabel : '配置服务'+needToFill,
					layout : 'hbox',
					defaultType : 'combobox',
					items : [{
						xtype : 'combobox',
						id : 'interfaces',
						name : 'interfaces',
						flex : 1,
						value : '请选择接口',
						store : Ext.create('Ext.data.Store', {
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
									if (record != null) {
										Ext.Ajax.request({
											url : serviceComStore_url,
											params : {
												interfaceId : record.data.interfaces
											},
											success : function(response) {
												Ext.getCmp('services').store
														.removeAll();
												Ext.getCmp('services')
														.setValue('请选择服务');
												var result = response.responseText;
												var j = Ext.decode(result);
												Ext.getCmp('services').store
														.add(j.root);
												getCmp('interfaces')
														.select(record.data.interfaces);
												getCmp('services')
														.select(record.data.services);
											}
										})
									}
								}
							},
							autoLoad : true
						}),
						listeners : {
							select : function(newValue) {
								Ext.Ajax.request({
											url : serviceComStore_url,
											params : {
												interfaceId : newValue.value
											},
											success : function(response) {
												Ext.getCmp('services').store
														.removeAll();
												Ext.getCmp('services')
														.setValue('请选择服务');
												var result = response.responseText;
												var j = Ext.decode(result);
												Ext.getCmp('services').store
														.add(j.root);
											}
										})
							}
						},
						editable : false,
						displayField : 'displayField',
						valueField : 'value',
						queryMode : 'local'
					}, {
						xtype : 'combobox',
						id : 'services',
						name : 'services',
						flex : 1,
						value : '请选择服务',
						store : Ext.create('Ext.data.Store', {
									model : 'Combox'
								}),
						editable : false,
						displayField : 'displayField',
						valueField : 'value',
						queryMode : 'local'
					}]
				}, {
					xtype : 'textarea',
					fieldLabel : '配置描述',
					name : 'description',
					height : 40,
					allowBlank : true
				}, {
					fieldLabel : '启用标准返回'+needToFill,
					xtype : 'combobox',
					name : 'isuseresponsemodel',
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
				}, {
					fieldLabel : '加密方式'+needToFill,
					name : 'CRYPTO',
					xtype : 'fieldcontainer',
					layout : {
						type : 'hbox'
					},
					items : [{
						xtype : 'combobox',
						name : 'iscrypto',
						store : Ext.create('Ext.data.Store', {
									model : 'SimpleCombox',
									data : [{
												value : '',
												displayField : '不加密'
											}, {
												value : 'des',
												displayField : 'DES对称加密'
											}, {
												value : 'rsa',
												displayField : 'RSA非对称加密'
											}]
								}),
						listeners : {
							change : function(combox, newValue, oldValue, eOpts) {
								win_form.getForm().setValues({
											deskey : '',
											rsapublickey : '',
											rsaprivatekey : '',
											usecommonkey : 'true'
										})
								getCmp('buttonkey').hide();
								getCmp('usecommonkey').hide();
								getCmp('deskey').hide();
								getCmp('rsaprivatekey').hide();
								getCmp('rsapublickey').hide();
								if (newValue == '') {
									getCmp('usecommonkey').hide();
								} else {
									getCmp('usecommonkey').show();
								};
							}
						},
						editable : false,
						displayField : 'displayField',
						valueField : 'value',
						queryMode : 'local',
						value : ''
					}, {
						fieldLabel : '使用公共密钥',
						xtype : 'combobox',
						name : 'usecommonkey',
						margins : '0 0 0 10',
						hidden : true,
						id : 'usecommonkey',
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
						listeners : {
							change : function(combox, newValue, oldValue, eOpts) {
								win_form.getForm().setValues({
											deskey : '',
											rsapublickey : '',
											rsaprivatekey : ''
										});
								if (newValue == 'true') {
									getCmp('buttonkey').hide();
									getCmp('deskey').hide();
									getCmp('rsaprivatekey').hide();
									getCmp('rsapublickey').hide();
								} else {
									getCmp('buttonkey').show();
									var iscrypto = win_form.getValues().iscrypto;
									if (iscrypto == 'des') {
										getCmp('deskey').show();
										getCmp('rsaprivatekey').hide();
										getCmp('rsapublickey').hide();
									} else {
										getCmp('deskey').hide();
										getCmp('rsaprivatekey').show();
										getCmp('rsapublickey').show();
									}
								}
							}
						},
						editable : false,
						displayField : 'displayField',
						valueField : 'value',
						queryMode : 'local',
						value : 'true'
					}, {
						xtype : 'button',
						margins : '0 0 0 10',
						text : '获取独立密钥',
						id : 'buttonkey',
						hidden : true,
						handler : function() {
							var form_iscrypto = win_form.getValues().iscrypto;
							var form_usecommonkey = win_form.getValues().usecommonkey;
							bodyLoadingMask.show();
							Ext.Ajax.request({
								url : 'interfaceInfoFindController.do?actionType=getServletMappingKey',
								params : {
									key : form_iscrypto,
									value : form_usecommonkey
								},
								success : function(response) {
									bodyLoadingMask.hide();
									var result = response.responseText;
									if (result) {
										if (form_iscrypto == 'des') {
											win_form.getForm().setValues({
														deskey : result
													})
										} else {
											var rsa = Ext.decode(result);
											win_form.getForm().setValues({
														rsapublickey : rsa[0],
														rsaprivatekey : rsa[1]
													})
										}
									} else {
										Ext.Msg.alert('失败', "获取失败");
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
					xtype : 'textarea',
					fieldLabel : '独立的DES密钥',
					hidden : true,
					name : 'deskey',
					id : 'deskey',
					allowBlank : true
				}, {
					xtype : 'textarea',
					fieldLabel : '独立的RSA私钥',
					hidden : true,
					height : 175,
					name : 'rsaprivatekey',
					id : 'rsaprivatekey',
					allowBlank : true
				}, {
					xtype : 'textarea',
					fieldLabel : '独立的RSA公钥',
					hidden : true,
					name : 'rsapublickey',
					id : 'rsapublickey',
					allowBlank : true
				}]
	});

	if (record != null) {
		win_form.getForm().setValues({
					id : record.data['id'],
					key : record.data['key'],
					description : record.data['description'],
					isuseresponsemodel : record.data['isuseresponsemodel'],
					iscrypto : record.data['iscrypto'],
					usecommonkey : record.data['usecommonkey'],
					deskey : record.data['deskey'],
					rsapublickey : record.data['rsapublickey'],
					rsaprivatekey : record.data['rsaprivatekey']
				});
	}
	var win = Ext.create('Ext.Window', {
				title : '公共配置[Servlet映射]',
				width : 800 * bokedee_width,
				height : 500 * bokedee_height,
				draggable : false,
				autoScroll : true,
				resizable : false,
				modal : true,
				buttons : win_buttons,
				items : [win_form]
			});
	win.show();
}
/**
 * 重新生成公共密钥
 */
function windowUpdateSAMappingPublicKey(record) {
	win_buttons = [{
		text : '重新生成公共密钥',
		handler : function() {
			bodyLoadingMask.show();
			Ext.Ajax.request({
						url : 'interfaceInfoSaveController.do',
						params : {
							actionType : 'updateSAMappingPublicKey',
							id : win_form.getValues().id
						},
						success : function(response) {
							bodyLoadingMask.hide();
							if ('success' == response.responseText) {
								win.close();
								Ext.Msg.alert('提示', '更新成功');
								getCmp('center_publicDeploy').store.load();
							} else {
								Ext.Msg.alert('提示', '更新失败：'
												+ response.responseText);
							}
						},
						failure : function(response) {
							bodyLoadingMask.hide();
							Ext.Msg
									.alert('提示', '更新失败：'
													+ response.responseText);
						}
					});
		}
	}, {
		text : '取消',
		handler : function() {
			win.close();
		}
	}];

	var win_form = Ext.create('Ext.form.Panel', {
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
		items : [{
					name : 'id',
					allowBlank : true,
					hidden : true
				}, {
					fieldLabel : '配置名称',
					name : 'key',
					allowBlank : false
				}, {
					xtype : 'textarea',
					fieldLabel : '配置描述',
					name : 'description',
					height : 40,
					allowBlank : true
				}, {
					xtype : 'fieldcontainer',
					layout : {
						type : 'hbox'
					},
					items : [{
						xtype : 'button',
						text : '更新公共密钥',
						id : 'buttonkey',
						hidden : true,
						handler : function() {
							bodyLoadingMask.show();
							Ext.Ajax.request({
								url : 'interfaceInfoFindController.do?actionType=getServletMappingKey',
								success : function(response) {
									bodyLoadingMask.hide();
									var result = response.responseText;
									if (result) {
										if (form_iscrypto == 'des') {
											win_form.getForm().setValues({
														deskey : result
													})
										} else {
											var rsa = Ext.decode(result);
											win_form.getForm().setValues({
														rsapublickey : rsa[0],
														rsaprivatekey : rsa[1]
													})
										}
									} else {
										Ext.Msg.alert('失败', "获取失败");
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
					xtype : 'textarea',
					fieldLabel : '公共的DES密钥',
					name : 'deskey',
					id : 'deskey',
					allowBlank : true
				}, {
					xtype : 'textarea',
					fieldLabel : '公共的RSA私钥',
					height : 175,
					name : 'rsaprivatekey',
					id : 'rsaprivatekey',
					allowBlank : true
				}, {
					xtype : 'textarea',
					fieldLabel : '公共的RSA公钥',
					name : 'rsapublickey',
					id : 'rsapublickey',
					allowBlank : true
				}]
	});

	if (record != null) {
		win_form.getForm().setValues({
					id : record.data['id'],
					key : record.data['key'],
					description : record.data['description'],
					deskey : record.data['deskey'],
					rsapublickey : record.data['rsapublickey'],
					rsaprivatekey : record.data['rsaprivatekey']
				});
	}
	var win = Ext.create('Ext.Window', {
				title : '公共配置[Servlet映射公共密钥]',
				width : 800 * bokedee_width,
				height : 500 * bokedee_height,
				draggable : false,
				autoScroll : true,
				resizable : false,
				modal : true,
				buttons : win_buttons,
				items : [win_form]
			});
	win.show();
}
/**
 * 新增或更新VmFileImport
 */
function windowAddOrUpdateVmFileImport(record) {

	win_buttons = [{
		text : '确定',
		handler : function() {
			var form_id = win_form.getValues().id;
			var form_key = win_form.getValues().key;
			var form_description = win_form.getValues().description;
			var form_fileName = win_form.getValues().fileName;
			var form_fileType = Ext.getCmp('fileType').rawValue;
			var form_verification = win_form.getValues().verification;
			var form_interfaces = win_form.getValues().interfaces;
			var form_services = win_form.getValues().services;
			// var form_interfacesName = Ext.getCmp('interfaces').rawValue;
			// var form_servicesName = Ext.getCmp('services').rawValue;
			if (form_key == '' || form_key.indexOf('*') > -1
					|| form_key.indexOf(' ') > -1) {
				Ext.Msg.alert('提示', '名称中不能含有[*]或者空格');
				return;
			}
			if (form_interfaces == '请选择接口' || form_interfaces == '') {
				Ext.Msg.alert('提示', '请选择接口');
				return;
			}
			if (form_services == '请选择服务' || form_services == '') {
				Ext.Msg.alert('提示', '请选择服务');
				return;
			}
			// 判断名称是否 已存在 以及服务是否已经配置
			var store = Ext.getCmp('center_publicDeploy').store;
			var count = store.getCount();
			for (var i = 0; i < count; i++) {
				if (form_key == store.getAt(i).data.key
						&& form_id != store.getAt(i).data.id) {
					Ext.Msg.alert('提示', '该名称已存在');
					return;
				}
				if (form_services == store.getAt(i).data.services
						&& form_id != store.getAt(i).data.id) {
					Ext.Msg.alert('提示', '该服务的配置已存在');
					return;
				}
			}
			if (!isRigthName(form_fileName)) {
				Ext.Msg.alert('提示', '文件参数名称中不能含有中文字符、空格等特殊字符');
				return;
			}
			if (form_fileType == '' || form_fileType.indexOf('*') > -1) {
				Ext.Msg.alert('提示', '文件类型后缀名中不能含有[*]、汉字或者空格');
				return;
			}

			var configData = Ext.getCmp('win_form_grid_config').store;
			// 保存前验证参数名， 文件参数名称 控制中文和特殊字符
			// 参数名 和文件参数名等不能重复
			count = configData.getCount();
			var configKey;
			var configKey2;
			for (var i = 0; i < count; i++) {
				configKey = configData.getAt(i).data.key;
				if (!isRigthName(configKey) || configKey == form_fileName) {
					Ext.Msg.alert('提示', '参数名[' + configKey
									+ ']不能和文件参数名称相同或含有中文字符、空格等特殊字符');
					return;
				}
				for (var x = 0; x < count; x++) {
					configKey2 = configData.getAt(x).data.key;
					if (i != x && configKey == configKey2) {
						Ext.Msg.alert('提示', '参数名[' + configKey + ']重复');
						return;
					}
				}
			}
			var data = {
				id : form_id,
				key : form_key,
				interfaces : form_interfaces,
				services : form_services,
				description : form_description,
				fileName : form_fileName,
				fileType : form_fileType,
				verification : form_verification,
				data : storeToObj(configData)
			};
			var head = Ext.encode(data);
			bodyLoadingMask.show();
			Ext.Ajax.request({
						url : 'interfaceInfoSaveController.do',
						params : {
							actionType : 'saveOrUpdateVmFileImport',
							text : head
						},
						success : function(response) {
							bodyLoadingMask.hide();
							if ('success' == response.responseText) {
								win.close();
								Ext.Msg.alert('提示', '操作成功');
								getCmp('center_publicDeploy').store.load();
							} else {
								Ext.Msg.alert('提示', '操作失败：'
												+ response.responseText);
							}
						},
						failure : function(response) {
							bodyLoadingMask.hide();
							Ext.Msg
									.alert('提示', '操作失败：'
													+ response.responseText);
						}
					});
		}
	}, {
		text : '取消',
		handler : function() {
			win.close();
		}
	}];

	var interfaceComStore_url = 'interfaceInfoFindController.do?actionType=findWebServiceInterfaceStore&type=vm&fileImport=true';
	var difInterfaceConStrore_url = 'interfaceInfoFindController.do?actionType=findDiffWebServiceInterfaceStore&type=vm,http&fileImport=true';

	var serviceComStore_url = 'interfaceInfoFindController.do?actionType=findWebServiceServiceStore&type=vm&fileImport=true';
	var difServiceComStore_url = 'interfaceInfoFindController.do?actionType=findDiffWebServiceServiceStore&type=vm,http&fileImport=true';
	

	var win_form_grid_store = Ext.create('Ext.data.Store', {
				fields : ['displayName', 'key', 'value', 'allowBlank'],
				data : record ? record.data.data : [],
				autoLoad : false,
				listeners : {
					load : function(me) {
					}
				}
			});
	var win_form_grid_pluginCellEdit = Ext.create(
			'Ext.grid.plugin.CellEditing', {
				clicksToEdit : 1
			});
	var win_form_grid_item = [{
				text : '新增',
				icon : 'images/add.png',
				scale : 'small',
				width : 50,
				handler : function() {
					win_form_grid.store.add([{
								displayName : '',
								key : '',
								value : '',
								allowBlank : 'true'
							}]);
				}
			}, {
				text : '删除',
				scale : 'small',
				icon : 'images/shanchu.png',
				width : 50,
				handler : function() {
					if (win_form_grid.selModel.selected.length > 0) {
						win_form_grid.store.remove(win_form_grid.selModel
								.getSelection());
					}
				}
			}];

	var win_form_grid = Ext.create('Ext.grid.Panel', {
				title : '参数配置',
				store : win_form_grid_store,
				id : 'win_form_grid_config',
				tbar : {
					items : win_form_grid_item
				},
				selModel : Ext.create('Ext.selection.CheckboxModel', {
							mode : 'MULTI',
							checkOnly : true
						}),
				columns : [{
							header : '显示名称',
							dataIndex : 'displayName',
							sortable : false,
							menuDisabled : true,
							flex : 3,
							field : 'textfield'
						}, {
							header : '参数名',
							dataIndex : 'key',
							sortable : false,
							menuDisabled : true,
							flex : 3,
							field : 'textfield'
						}, {
							header : '默认值',
							dataIndex : 'value',
							sortable : false,
							menuDisabled : true,
							flex : 4,
							field : 'textfield'
						}, {
							header : '可以为空',
							dataIndex : 'allowBlank',
							sortable : false,
							menuDisabled : true,
							flex : 2,
							renderer : function(value) {
								if (value == "true") {
									return "是"
								} else {
									return "否"
								}
							},
							field : {
								xtype : 'combobox',
								editable : false,
								name : 'allowBlank',
								store : Ext.create('Ext.data.Store', {
											fields : ['value', 'displayField'],
											data : [{
														value : 'true',
														displayField : '是'
													}, {
														value : 'false',
														displayField : '否'
													}]
										}),
								displayField : 'displayField',
								valueField : 'value',
								queryMode : 'local',
								value : 'true',
								allowBlank : true
							}
						}],
				plugins : [win_form_grid_pluginCellEdit],
				height : 300
			});
	var win_form = Ext.create('Ext.form.Panel', {
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
		items : [{
					name : 'id',
					allowBlank : true,
					hidden : true
				}, {
					xtype : 'fieldcontainer',
					layout : 'hbox',
					width : '100%',
					fieldLabel : '配置名称'+needToFill,
					items : [{
								xtype : 'textfield',
								name : 'key',
								flex : 4
							}, {
								fieldLabel : '是否需要登录验证'+needToFill,
								name : 'verification',
								id : 'verification',
								margins : '0 0 0 10',
								labelWidth:120,
								value : 'false',
								allowBlank : false,
								xtype : 'combobox',
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
								value : 'false',
								flex : 1.5
							}]
				}, {
					xtype : 'fieldcontainer',
					fieldLabel : '配置服务'+needToFill,
					layout : 'hbox',
					defaultType : 'combobox',
					items : [{
						xtype : 'combobox',
						id : 'interfaces',
						name : 'interfaces',
						flex : 1,
						value : '请选择接口',
						store : Ext.create('Ext.data.Store', {
							model : 'Combox',
							proxy : {
								type : 'ajax',
								url : difInterfaceConStrore_url,
								reader : {
									type : 'json',
									root : 'root'
								}
							},
							listeners : {
								load : function(response) {
									if (record != null) {
										Ext.Ajax.request({
											url : difServiceComStore_url,
											params : {
												interfaceId : record.data.interfaces
											},
											success : function(response) {
												Ext.getCmp('services').store
														.removeAll();
												Ext.getCmp('services')
														.setValue('请选择服务');
												var result = response.responseText;
												var j = Ext.decode(result);
												Ext.getCmp('services').store
														.add(j.root);
												getCmp('interfaces')
														.select(record.data.interfaces);
												getCmp('services')
														.select(record.data.services);
											}
										})
									}
								}
							},
							autoLoad : true
						}),
						listeners : {
							select : function(newValue) {
								Ext.Ajax.request({
											url : difServiceComStore_url,
											params : {
												interfaceId : newValue.value
											},
											success : function(response) {
												Ext.getCmp('services').store
														.removeAll();
												Ext.getCmp('services')
														.setValue('请选择服务');
												var result = response.responseText;
												var j = Ext.decode(result);
												Ext.getCmp('services').store
														.add(j.root);
											}
										})
							}
						},
						editable : false,
						displayField : 'displayField',
						valueField : 'value',
						queryMode : 'local'
					}, {
						xtype : 'combobox',
						id : 'services',
						name : 'services',
						flex : 1,
						value : '请选择服务',
						store : Ext.create('Ext.data.Store', {
									model : 'Combox'
								}),
						editable : false,
						displayField : 'displayField',
						valueField : 'value',
						queryMode : 'local'
					}]
				}, {
					xtype : 'textarea',
					fieldLabel : '配置描述',
					name : 'description',
					height : 40,
					allowBlank : true
				}, {
					xtype : 'fieldcontainer',
					layout : 'hbox',
					width : '100%',
					fieldLabel : '文件参数名称'+needToFill,
					items : [{
								name : 'fileName',
								value : 'interfaceFile',
								xtype : 'textfield',
								emptyText : '不能以数字开头、包含中文或包含下划线',
								flex : 2
							}, {
								fieldLabel : '文件类型后缀名'+needToFill,
								name : 'fileType',
								id : 'fileType',
								margins : '0 0 0 10',
								value : 'xls,xlsx',
								allowBlank : false,
								multiSelect : true,
								xtype : 'combobox',
								store : ['xml', 'xls', 'xlsx'],
								editable : true,
								flex : 2
							}]
				}, win_form_grid]
	});

	if (record != null) {
		win_form.getForm().setValues({
					id : record.data['id'],
					key : record.data['key'],
					description : record.data['description'],
					fileName : record.data['fileName'],
					fileType : record.data['fileType'],
					verification : record.data['verification']
				});
	}
	var win = Ext.create('Ext.Window', {
				title : '公共配置[文件导入设置]',
				width : 800 * bokedee_width,
				height : 520 * bokedee_height,
				draggable : false,
				autoScroll : true,
				resizable : false,
				modal : true,
				buttons : win_buttons,
				items : [win_form]
			});
	win.show();
}