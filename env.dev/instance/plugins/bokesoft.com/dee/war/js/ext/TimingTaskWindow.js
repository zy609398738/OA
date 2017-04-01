/**
 * 选择新增类型
 */
function chooseTask() {
	var win_buttons = [{
				text : '确定',
				handler : function() {
					var task = win_form.getValues().tasktype;
					var taskshow = win_form.items.items[0].rawValue;
					var job = win_form.getValues().jobtype;
					if (job == '请选择') {
						Ext.Msg.alert('提示', '请选择任务类型！');
						return;
					}
					if (task == '请选择') {
						Ext.Msg.alert('提示', '请选择触发类型！');
						return;
					}
					windowaddTimingTask(job, task, null, null);
					win.close();
				}
			}, {
				text : '取消',
				handler : function() {
					win.close();
				}
			}];
	var timingTask_JobTypeCombox;
	if (Ext.data.StoreManager.containsKey('timingTask_JobTypeCombox')) {
		timingTask_JobTypeCombox = Ext.data.StoreManager
				.get('timingTask_JobTypeCombox');
	} else {
		timingTask_JobTypeCombox = Ext.create('Ext.data.Store', {
			fields : ['displayField', 'value', 'needservice'],
			storeId : 'timingTask_JobTypeCombox',
			proxy : {
				type : 'ajax',
				url : 'interfaceTimingTaskController.do?actionType=getJobTypeCombox',
				reader : {
					type : 'json'
				}

			},
			autoLoad : true
		});
	}
	var win_form = Ext.create('Ext.form.Panel', {
				width : '100%',
				height : 400 * bokedee_height,
				x : 0,
				y : 0,
				bodyPadding : 5,
				margins : '20 0 0 5',
				border : 0,
				method : 'post',
				layout : 'anchor',
				defaults : {
					anchor : '100%'
				},
				defaultType : 'textfield',
				items : [{
							xtype : 'combobox',
							fieldLabel : '任务类型'+needToFill,
							editable : false,
							name : 'jobtype',
							store : timingTask_JobTypeCombox,
							displayField : 'displayField',
							valueField : 'value',
							queryMode : 'local',
							value : '请选择',
							dataIndex : 'jobtype'
						}, {
							fieldLabel : '触发类型'+needToFill,
							xtype : 'combobox',
							editable : false,
							name : 'tasktype',
							store : Ext.create('Ext.data.Store', {
										model : 'Combox',
										data : [{
													value : true,
													displayField : '简单'
												}, {
													value : false,
													displayField : '复杂'
												}]
									}),
							displayField : 'displayField',
							valueField : 'value',
							queryMode : 'local',
							value : '请选择'
						}]
			});
	var win = Ext.create('Ext.Window', {
				title : '请选择类型',
				width : 400 * bokedee_width,
				height : 210 * bokedee_height,
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
 * 新增或修改定时任务
 */
function windowaddTimingTask(job, task, record, mode) {
	var needservice = true;
	var timingTask_JobTypeCombox = Ext.data.StoreManager
			.get('timingTask_JobTypeCombox');
	for (var i = 0; i < timingTask_JobTypeCombox.getCount(); i++) {
		var obj = timingTask_JobTypeCombox.getAt(i).data;
		if (obj.value == job) {
			needservice = obj.needservice;
			break;
		}
	}
	var win_buttonsURL = 'interfaceTimingTaskController.do?actionType=addTimingTask';
	var win_buttons = [{
		text : '确定',
		handler : function() {
			if (record && record.isSystem == true) {
				Ext.Msg.alert('提示', '系统定时任务不能修改，只能查看！');
				return;
			};
			if (record && mode == 'true') {
				Ext.Msg.alert('提示', '任务启用状态不能修改，只能查看！');
				return;
			};
			var form_id = win_form.getValues().id;
			var form_taskname = win_form.getValues().taskname;
			var form_desc = win_form.getValues().desc;
			var form_interfaces = win_form.getValues().interfaces;
			var form_service = win_form.getValues().service;
			var form_enable = win_form.getValues().enable;
			var store = null;// 任务的数据集
			if (form_taskname.length == 0) {
				Ext.Msg.alert('提示', '任务名称必须填写！');
				return;
			} else {// 确定名字的唯一性
				var url = 'interfaceTimingTaskController.do?actionType=isOnlyOne&id='
						+ form_id;
				// 此处两次的js encodeuri 是为后台使用 URLdecode, encode 为utf8
				var response = ajaxSyncCall(url, 'taskname=' + encodeURI(encodeURI(form_taskname)), null);
				if ("success" != response) {
					Ext.Msg.alert('提示', '任务名称已存在');
					return;
				};
			}
			if (needservice) {// 需要接口和服务的定时任务
				if (form_interfaces == '请选择接口') {
					Ext.Msg.alert('提示', '请选择接口！');
					return;
				}
				if (form_service == '请选择服务') {
					Ext.Msg.alert('提示', '请选择服务！');
					return;
				}
			} else {
				form_service = "";
				form_interfaces = "";
			}
			if (task == true) {// 简单触发
				store = getCmp('simpleTask').getForm().getValues();
				if (store.starttime >= store.endtime) {
					Ext.Msg.alert('提示', '开始时间不能大于或等于结束时间');
					return;
				}
				if (store.runtimes > 2147483647 || store.runtimes < -1) {
					Ext.Msg.alert('提示', '执行次数不能大于最大值2147483647或小于-1');
					return;
				}
			} else {// 复杂触发
				var data = getCmp('complexTask').store.data;
				if (data.length == 0) {// 不能没有表达式
					Ext.Msg.alert('提示', '至少需要一个定时任务');
					return;
				} else {// 有数据时 验证
					for (var i = 0; i < data.length; i++) {
						var detail = data.items[i].data;
						if (!(isRigthCron(detail.seconds))) {
							Ext.Msg.alert('提示', '秒输入格式有误:只能输入数字 - / , * ?');
							return;
						}
						if (!(isRigthCron(detail.minutes))) {
							Ext.Msg.alert('提示', '分输入格式有误:只能输入数字 - / , * ?');
							return;
						}
						if (!(isRigthCron(detail.hours))) {
							Ext.Msg.alert('提示', '小时输入格式有误:只能输入数字 - / , * ?');
							return;
						}
						if (!(isRigthCron(detail.days))) {
							Ext.Msg.alert('提示', '日输入格式有误:只能输入数字 - / , * ?');
							return;
						}
						if (!(isRigthCron(detail.months))) {
							Ext.Msg.alert('提示', '月输入格式有误:只能输入数字 - / , * ?');
							return;
						}
						if (!(isRigthCron(detail.weeks))) {
							Ext.Msg.alert('提示', '周输入格式有误:只能输入数字 - / , * ?');
							return;
						}
						if (!(isRigthCron(detail.year))) {
							Ext.Msg.alert('提示', '年输入格式有误:只能输入数字 - / , * ?');
							return;
						}
						if (!(isRigthCron(detail.seconds))) {
							Ext.Msg.alert('提示', '输入格式有误:只能输入数字 - / , * ?');
							return;
						}
						if ((detail.days == '?' && detail.weeks == '?')
								|| detail.days == '*' && detail.weeks == '*') {
							Ext.Msg.alert('提示', '输入格式有误：一个月中周和日不能同时为*或?');
							return;
						}
						detail.crons = detail.seconds + ' ' + detail.minutes
								+ ' ' + detail.hours + ' ' + detail.days + ' '
								+ detail.months + ' ' + detail.weeks + ' '
								+ detail.year;
						var response = checkCrons(detail.crons);
						if ("success" != response) {
							Ext.Msg.alert('提示', '输入格式有误:' + response);
							return;
						};
					}
				}
				store = storeToObj(getCmp('complexTask').store)
			}
			var timingtask;
			if (record) {
				timingtask = {
					id : form_id,
					taskname : form_taskname,
					desc : form_desc,
					jobtype : job,
					tasktype : task,
					interfaces : form_interfaces,
					service : form_service,
					enable : form_enable,
					createtime : record.createtime,
					task : store
				};
			} else {
				timingtask = {
					id : form_id,
					taskname : form_taskname,
					desc : form_desc,
					jobtype : job,
					tasktype : task,
					interfaces : form_interfaces,
					service : form_service,
					enable : form_enable,
					task : store
				};
			};
			Ext.Ajax.request({
						url : win_buttonsURL,
						params : {
							timingtaskJson : Ext.encode(timingtask)
						},
						success : function(response) {
							var msg = '新增';
							if (win_form.getValues().id.length != 0) {
								msg = '修改';
							};
							if ('success' == response.responseText) {
								if (getCmp("winHelp")) {
									getCmp("winHelp").close();
								};
								win.close();
								Ext.Msg.alert('提示', msg + '成功');
								getCmp('taskList').store.load();
							} else {
								Ext.Msg.alert('提示', msg + '失败：'
												+ response.responseText);
							}
						}
					});

		}
	}, {
		text : '取消',
		handler : function() {
			if (getCmp("winHelp")) {
				getCmp("winHelp").close();
			};
			win.close();
		}
	}];

	var win_form_grid_CheckboxModel = Ext.create('Ext.selection.CheckboxModel',
			{
				mode : 'MULTI',
				checkOnly : true
			});
	var simpleTask = Ext.create('Ext.form.Panel', {
				id : 'simpleTask',
				width : '100%',
				height : 400 * bokedee_height,
				hidden : true,
				margins : '20 0 0 5',
				border : 0,
				method : 'post',
				layout : 'anchor',
				defaults : {
					anchor : '100%'
				},
				defaultType : 'textfield',
				items : [{
							xtype : 'datetimefield',
							format : 'Y-m-d H:i:s',
							fieldLabel : '开始时间',
							dataIndex : 'starttime',
							emptyText : '不选择时默认启用时就启动',
							editable : false,
							name : 'starttime'
						}, {
							fieldLabel : '间隔时间(秒)'+needToFill,
							name : 'intervaltime',
							dataIndex : 'intervaltime',
							xtype : 'numberfield',
							hideTrigger : true,
							minValue : 1
						}, {
							fieldLabel : '重复次数'+needToFill,
							name : 'runtimes',
							dataIndex : 'runtimes',
							xtype : 'numberfield',
							emptyText : '-1代表无数次',
							hideTrigger : true,
							minValue : -1
						}, {
							xtype : 'datetimefield',
							format : 'Y-m-d H:i:s',
							fieldLabel : '结束时间',
							dataIndex : 'endtime',
							editable : true,
							name : 'endtime'

						}]
			});
	var complexTbar = [{
				text : '添加',
				scale : 'small',
				icon : 'images/add.png',
				width : 50,
				handler : function() {
					Ext.getStore('Timingcomplex').add([{
								"crons" : "",
								"days" : "*",
								"seconds" : "*",
								"hours" : "*",
								"year" : "*",
								"minutes" : "*",
								"months" : "*",
								"weeks" : "?"
							}]);
				}
			}, {
				text : '删除',
				scale : 'small',
				icon : 'images/shanchu.png',
				width : 50,
				handler : function() {
					if (complexTask.selModel.selected.length > 0) {
						complexTask.store.remove(complexTask.selModel
								.getSelection());
					} else {
						Ext.Msg.alert('提示', '请选择一个！');
					}
				}
			}, {
				text : '提示和例子',
				scale : 'small',
				// icon : 'images/shanchu.png',
				width : 70,
				handler : function() {
					winHelp();
				}
			}];
	var checkboxModel = Ext.create('Ext.selection.CheckboxModel', {
				mode : 'SINGEL',
				listeners : {
					select : function(m, record, index) {
						complexTask.record = record;
						complexTask.index = index;
					}
				}
			});
	var win_form_grid_pluginCellEdit = Ext.create(
			'Ext.grid.plugin.CellEditing', {
				clicksToEdit : 1,
				listeners : {
					beforeedit : function(record) {
						serviceUpdateIndex = record.rowIdx;
					}
				}
			});
	var complexTask = Ext.create('Ext.grid.Panel', {
				title : '任务明细[至少一个]',
				id : 'complexTask',
				tbar : complexTbar,
				store : Ext.create('Ext.data.Store', {
							storeId : 'Timingcomplex',
							model : 'Timingcomplex',
							data : [{
										"crons" : "",
										"days" : "*",
										"seconds" : "*",
										"hours" : "*",
										"year" : "*",
										"minutes" : "*",
										"months" : "*",
										"weeks" : "?"
									}],
							autoLoad : true
						}),
				selModel : checkboxModel,
				hidden : true,
				width : '100%',
				columns : [{
							xtype : 'rownumberer',
							width : 30,
							sortable : false
						}, {
							header : '表达式',
							dataIndex : 'crons',
							width : 230
						}, {
							header : '秒',
							dataIndex : 'seconds',
							field : 'textfield',
							width : 70
						}, {
							header : '分',
							dataIndex : 'minutes',
							field : 'textfield',
							width : 100
						}, {
							header : '时',
							dataIndex : 'hours',
							field : 'textfield',
							width : 130
						}, {
							header : '日',
							dataIndex : 'days',
							field : 'textfield',
							width : 130
						}, {
							header : '月',
							dataIndex : 'months',
							field : 'textfield',
							width : 70
						}, {
							header : '周',
							dataIndex : 'weeks',
							field : 'textfield',
							width : 70
						}, {
							header : '年',
							dataIndex : 'year',
							field : 'textfield',
							width : 70
						}],
				plugins : [win_form_grid_pluginCellEdit],
				height : 275 * bokedee_height
			});
	var InterfaceComboboxURL = 'interfaceTimingTaskController.do?actionType=findVMInterfaceCombobox';
	var ServiceComboboxURL = 'interfaceTimingTaskController.do?actionType=findVMServiceCombobox';
	var win_form = Ext.create('Ext.form.Panel', {
		width : '100%',
		height : 400 * bokedee_height,
		bodyPadding : 5,
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
					hidden : true,
					allowBlank : false
				}, {
					fieldLabel : '任务名称'+needToFill,
					name : 'taskname',
					emptyText : '必须填写,不能重名',
					allowBlank : false
				}, {
					fieldLabel : '任务描述',
					name : 'desc'
				}, {
					xtype : 'fieldcontainer',
					fieldLabel : '执行服务'+needToFill,
					disabled : !needservice,
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
								url : InterfaceComboboxURL,
								reader : {
									type : 'json',
									root : 'root'
								}
							},
							listeners : {
								load : function(response) {
									if (record) {
										Ext.Ajax.request({
											url : ServiceComboboxURL,
											params : {
												interfaceId : record.interfaces
											},
											success : function(response) {
												Ext.getCmp('service').store
														.removeAll();
												Ext.getCmp('service')
														.setValue('请选择服务');
												var result = response.responseText;
												var j = Ext.decode(result);
												Ext.getCmp('service').store
														.add(j.root);
												getCmp('interfaces')
														.select(record.interfaces);
												getCmp('service')
														.select(record.service);
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
									url : ServiceComboboxURL,
									params : {
										interfaceId : newValue.value
									},
									success : function(response) {
										Ext.getCmp('service').store.removeAll();
										Ext.getCmp('service').setValue('请选择服务');
										var result = response.responseText;
										var j = Ext.decode(result);
										Ext.getCmp('service').store.add(j.root);
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
						id : 'service',
						name : 'service',
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
					fieldLabel : '启动方式',
					xtype : 'combobox',
					id : 'enable',
					name : 'enable',
					editable : false,
					store : Ext.create('Ext.data.Store', {
								model : 'Combox',
								data : [{
											value : true,
											displayField : '手动启动'
										}, {
											value : false,
											displayField : '自动启动'
										}]
							}),
					editable : false,
					displayField : 'displayField',
					valueField : 'value',
					queryMode : 'local',
					value : true
				}, simpleTask, complexTask]
	});
	if (record) {
		var data = record;
		win_form.getForm().setValues({
					desc : data.desc,
					id : data.id,
					jobtype : data.jobtype,
					taskname : data.taskname
				});
		// getCmp('interfaces').select(data.interfaces);
		getCmp('enable').select(data.enable);
		if (task) {
			win_form.getForm().setValues({
						starttime : data.task.starttime,
						intervaltime : data.task.intervaltime,
						runtimes : data.task.runtimes,
						endtime : data.task.endtime
					})
		} else {
			var length = data.task.length;
			Ext.getCmp('complexTask').store.removeAt(0);
			for (var i = 0; i < length; i++) {
				Ext.getCmp('complexTask').store.add(data.task[i])
			}
		}
	};
	var win = Ext.create('Ext.Window', {
				title : '新增或修改定时任务',
				width : 800 * bokedee_width,
				height : 450 * bokedee_height,
				layout : 'absolute',
				draggable : false,
				bodyStyle : 'background:#ffffff;',
				resizable : false,
				modal : true,
				buttons : win_buttons,
				items : [win_form],
				listeners : {
					beforeshow : function() {
						if (task == true) {
							getCmp('simpleTask').show();
						} else {
							getCmp('complexTask').show();
						}
					}
				}
			});
	win.show();
}
/**
 * 确定前 验证输入表达式的正确性
 * 
 * @param {Object}
 *            crons
 */
function checkCrons(cron) {
	var url = 'interfaceTimingTaskController.do?actionType=isRightCron&crons='
			+ cron;
	return ajaxSyncCall(url, null, null);
}
function isRigthCron(s) {
	var patrn = /([0-9]|[-*?\/])$/; // 表达式只能输入数字 - / , *
	if (!patrn.exec(s))
		return false
	return true
}
/**
 * 提示窗口
 * 
 */
function winHelp() {
	var id = 'winHelp';
	if (getCmp(id)) {
		getCmp(id).show();
		return;
	};
	var winHelp = Ext.create('Ext.Window', {
		title : '提示和例子窗口',
		id : id,
		width : 600 * bokedee_width,
		height : 450 * bokedee_height,
		bodyStyle : 'background:#ffffff;',
		// x:1085,
		// y:110,
		bodyStyle : 'background:#ffffff;',
		html : '1. 除表达式外都必须填写（表达式保存后自动生成）<br> '
				+ '2. 只能输入<b style="color:red; font-size:12px;">0-9</b>数字和 <b style="color:red; font-size:12px;">- , / * ?</b> 五种符号 <br>'
				+ '3. 分秒0-59,小时0-23,日1-31,月1-12,周1-7（1表示周日 2表示周一,依次类推）,年（一般用*或年份如2013）<br>'
				+ '4. （以秒为例） <b style="color:red; font-size:12px;">-</b>表示区间 如1-4秒   <b style="color:red; font-size:12px;">,</b>表示枚举 如1,2,3,4   <b style="color:red; font-size:12px;">/</b>表示递增 如 1-4/2 意为从1秒开始 每隔两秒一次（实际为1,3）  <b style="color:red; font-size:12px;">*</b>表示每一秒  <b style="color:red; font-size:12px;">?</b>表示不确定 但只能用于 日和周 而且不能同时为?或同时*<br>'
				+ '<table border="1" width=100%>'
				+ '<tr><td>秒</td><td>分</td><td>时</td><td>日</td><td>月</td><td>周</td><td>年</td></tr>'
				+ '<tr><td>0</td><td>1-20,30-59</td><td>2,3,21,23</td><td>?</td><td>*</td><td>7,1</td><td>*</td></tr>'
				+ '<tr><td>10</td><td>*</td><td>0-23/3</td><td>1-15/3</td><td>1/2</td><td>?</td><td>2013</td></tr>'
				+ '</table><br> '
				+ '第一个表示：在每年每月的每个周六和周日的2点、3点、21点、23点的1-20分和30-59的第0秒执行<br>'
				+ '第二个表示：在2013年从1月开始每隔两个月，每月的1号开始到15号的每隔三天，每天0-23点每隔三个小时，每一分钟的第10秒开始执行'
	});
	winHelp.show();
}