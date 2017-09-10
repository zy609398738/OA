/**
 * 定义ServiceModel
 */
Ext.define('Service', {
			extend : 'Ext.data.Model',
			fields : [{
						name : 'description',
						type : 'string'
					}, {
						name : 'id',
						type : 'string'
					}, {
						name : 'parentId',
						type : 'string'
					}, {
						name : 'text',
						type : 'string'
					}, {
						name : 'recordMpLog',
						type : 'string'
					}, {
						name : 'fileImport',
						type : 'string'
					}, {
						name : 'enable',
						type : 'string'
					}]
		});
/**
 * 定义InterfaceModel
 */
Ext.define('Interface', {
			extend : 'Ext.data.Model',
			fields : [{
						name : 'autoRun',
						type : 'string'
					}, {
						name : 'description',
						type : 'string'
					}, {
						name : 'id',
						type : 'string'
					}, {
						name : 'responseTime',
						type : 'string'
					}, {
						name : 'text',
						type : 'string'
					}, {
						name : 'startIndex',
						type : 'string'
					}, {
						name : 'oldPort',
						type : 'string'
					}, {
						name : 'changePort',
						type : 'string'
					}]
		});

/**
 * 定义InterfaceModel
 */
Ext.define('InterfaceBuild', {
			extend : 'Ext.data.Model',
			fields : [{
						name : 'autoRun',
						type : 'string'
					}, {
						name : 'description',
						type : 'string'
					}, {
						name : 'id',
						type : 'string'
					}, {
						name : 'responseTime',
						type : 'string'
					}, {
						name : 'text',
						type : 'string'
					}, {
						name : 'isAlreadyBuild'
					}]
		});
/**
 * 定义MessageProcessor
 */
Ext.define('MessageProcessor', {
			extend : 'Ext.data.Model',
			fields : [{
						name : 'className',
						type : 'string'
					}, {
						name : 'description',
						type : 'string'
					}, {
						name : 'flowMode',
						type : 'string'
					}, {
						name : 'id',
						type : 'string'
					}, {
						name : 'isRef',
						type : 'boolean'
					}, {
						name : 'javaClass',
						type : 'string'
					}, {
						name : 'bigType',
						type : 'string'
					}, {
						name : 'text',
						type : 'string'
					}, {
						name : 'smallType',
						type : 'string'
					}, {
						name : 'enable',
						type : 'string'
					}, {
						name : 'simpleMpLog',
						type : 'string'
					}]
		})
/**
 * 定义ComboBox
 */
Ext.define('Combox', {
			extend : 'Ext.data.Model',
			fields : [{
						name : 'displayField',
						type : 'string'
					}, {
						name : 'id',
						type : 'string'
					}, {
						name : 'type',
						type : 'string'
					}, {
						name : 'value'
					}, {
						name : 'text',
						type : 'string'
					}]
		})
/**
 * 定义ComboBoxMessageprocessor
 */
Ext.define('ComboBoxMessageprocessor', {
			extend : 'Ext.data.Model',
			fields : [{
						name : 'displayField',
						type : 'string'
					}, {
						name : 'className',
						type : 'string'
					}, {
						name : 'description',
						type : 'string'
					}, {
						name : 'value',
						type : 'string'
					}, {
						name : 'smallType',
						type : 'string'
					}]
		})
		
Ext.define('ComboBoxWsServicesInfo', {
			extend : 'Ext.data.Model',
			fields : [{
						name : 'displayField',
						type : 'string'
					}, {
						name : 'value',
						type : 'string'
					}]
		})	
			
/**
 * 定义PublicDeploy
 */
Ext.define('PublicDeploy', {
			extend : 'Ext.data.Model',
			fields : [{
						name : 'className',
						type : 'string'
					}, {
						name : 'driverClassName',
						type : 'string'
					}, {
						name : 'description',
						type : 'string'
					}, {
						name : 'forExample',
						type : 'string'
					}, {
						name : 'id',
						type : 'string'
					}, {
						name : 'text',
						type : 'string'
					}, {
						name : 'bigType',
						type : 'string'
					}, {
						name : 'smallType',
						type : 'string'
					}, {
						name : 'key',
						type : 'string'
					}, {
						name : 'value',
						type : 'string'
					}, {
						name : 'isSystem',
						type : 'string'
					}]
		})
/**
 * 定义KeyValue
 */
Ext.define('KeyValue', {
			extend : 'Ext.data.Model',
			fields : [{
						name : 'key',
						type : 'string'
					}, {
						name : 'value',
						type : 'string'
					}]
		})
		
/**
 * 定义FiveField
 */
Ext.define('FiveField', {
			extend : 'Ext.data.Model',
			fields : [{
						name : 'one',
						type : 'string'
					}, {
						name : 'two',
						type : 'string'
					}, {
						name : 'three',
						type : 'string'
					}, {
						name : 'four',
						type : 'string'
					}, {
						name : 'five',
						type : 'string'
					}]
		})
/**
 * 定义Value
 */
Ext.define('Value', {
			extend : 'Ext.data.Model',
			fields : [{
						name : 'value',
						type : 'string'
					}]
		})
/**
 * 定义SQLValue
 */
Ext.define('SQLValue', {
			extend : 'Ext.data.Model',
			fields : [{
						name : 'key',
						type : 'string'
					},{
						name : 'sql',
						type : 'string'
					}]
		})
/**
 * 定义Soap-Method
 */
Ext.define('SoapMethod', {
			extend : 'Ext.data.Model',
			fields : [{
						name : 'mode',
						type : 'string'
					}, {
						name : 'parameter',
						type : 'string'
					}, {
						name : 'type',
						type : 'string'
					}]
		})
/**
 * 定义SimpleCombox
 */
Ext.define('SimpleCombox', {
			extend : 'Ext.data.Model',
			fields : [{
						name : 'displayField',
						type : 'string'
					}, {
						name : 'value',
						type : 'string'
					}]
		})
/**
 * 定义logManngerPanel
 */
Ext.define('logManngerPanel', {
			extend : 'Ext.data.Model',
			fields : [{
						name : 'text',
						type : 'string'
					}, {
						name : 'date',
						type : 'string'
					}, {
						name : 'time',
						type : 'string'
					}, {
						name : 'fileName',
						type : 'string'
					}]
		})
		
Ext.define('idxlogInfoPanel', {
			extend : 'Ext.data.Model',
			fields : [{
						name : 'interfaceName',
						type : 'string'
					}, {
						name : 'serviceName',
						type : 'string'
					}, {
						name : 'date',
						type : 'string'
					}, {
						name : 'errors',
						type : 'string'
					}]
		})		
		
Ext.define('interfaceRunningPanel', {
			extend : 'Ext.data.Model',
			fields : [{
						name : 'text',
						type : 'string'
					}, {
						name : 'autoRun',
						type : 'string'
					}, {
						name : 'runMode',
						type : 'string'
					}, {
						name : 'mode',
						type : 'string'
					}]
		})			

/**
 * 定义globalSource
 */
Ext.define('globalSource', {
			extend : 'Ext.data.Model',
			fields : [{
						name : 'key',
						type : 'string'
					}, {
						name : 'value',
						type : 'string'
					}, {
						name : 'description',
						type : 'string'
					}, {
						name : 'interfaces',
						type : 'string'
					}, {
						name : 'services',
						type : 'string'
					}, {
						name : 'interfacesName',
						type : 'string'
					}, {
						name : 'servicesName',
						type : 'string'
					}]
		})

/**
 * 定义InterfaceManager
 */
Ext.define('InterfaceManager', {
			extend : 'Ext.data.Model',
			fields : [{
						name : 'autoRun',
						type : 'string'
					}, {
						name : 'description',
						type : 'string'
					}, {
						name : 'id',
						type : 'string'
					}, {
						name : 'mode',
						type : 'string'
					}, {
						name : 'text',
						type : 'string'
					}, {
						name : 'runMode',
						type : 'string'
					}, {
						name : 'createDateTime',
						type : 'string'
					}]
		});

/**
 * 定义debugLogDetail
 */
Ext.define('debugLogDetail', {
			extend : 'Ext.data.Model',
			fields : [{
						name : 'Payload_Content',
						type : 'string'
					}, {
						name : 'bkUniqueId',
						type : 'string'
					}, {
						name : 'id',
						type : 'string'
					}, {
						name : 'Inbound_Property',
						type : 'object'
					}, {
						name : 'Invocation_Property',
						type : 'object'
					}, {
						name : 'isnormal',
						type : 'string'
					}, {
						name : 'Outbound_Property',
						type : 'object'
					}, {
						name : 'Process_DateTime',
						type : 'string'
					}, {
						name : 'serviceName',
						type : 'string'
					}, {
						name : 'Transformer_Name',
						type : 'string'
					}, {
						name : 'Payload_Type',
						type : 'string'
					}, {
						name : 'Session_Property',
						type : 'object'
					}]
		});
/**
 * 定义Synchggpz
 */
Ext.define('Synchggpz', {
			extend : 'Ext.data.Model',
			fields : [{
						name : 'description',
						type : 'string'
					}, {
						name : 'id',
						type : 'string'
					}, {
						name : 'text',
						type : 'string'
					}, {
						name : 'smallType',
						type : 'string'
					}, {
						name : 'bigType',
						type : 'string'
					}]
		})
/**
 * 定义SynchInterface
 */
Ext.define('SynchInterface', {
			extend : 'Ext.data.Model',
			fields : [{
						name : 'description',
						type : 'string'
					}, {
						name : 'parentId',
						type : 'string'
					}, {
						name : 'text',
						type : 'string'
					}, {
						name : 'interfaceName',
						type : 'string'
					}, {
						name : 'id',
						type : 'string'
					}, {
						name : 'autoRun',
						type : 'string'
					}, {
						name : 'interfaceDescription',
						type : 'string'
					}, {
						name : 'responseTime',
						type : 'string'
					}]
		})
/**
 * 定义SynchCombobox
 */
Ext.define('SynchCombobox', {
			extend : 'Ext.data.Model',
			fields : [{
						name : 'displayField',
						type : 'string'
					}, {
						name : 'value',
						type : 'string'
					}, {
						name : 'type',
						type : 'string'
					}]
		});

/**
 * 定义SynchProperty
 */
Ext.define('SynchProperty', {
			extend : 'Ext.data.Model',
			fields : [{
						name : 'description',
						type : 'string'
					}, {
						name : 'id',
						type : 'string'
					}, {
						name : 'key',
						type : 'string'
					}, {
						name : 'value',
						type : 'string'
					}]
		})
/**
 * 定义ExcelExample
 */
Ext.define('ExcelExample', {
			extend : 'Ext.data.Model',
			fields : [{
						name : 'rowId',
						type : 'string'
					}, {
						name : 'A',
						type : 'string'
					}, {
						name : 'B',
						type : 'string'
					}, {
						name : 'C',
						type : 'string'
					}, {
						name : 'D',
						type : 'string'
					}]
		})

/**
 * 定义operator
 */
Ext.define('operator', {
			extend : 'Ext.data.Model',
			fields : [{
						name : 'id',
						type : 'string'
					}, {
						name : 'username',
						type : 'string'
					}, {
						name : 'updateDate'
					}, {
						name : 'createDate'
					}, {
						name : 'roles'
					}, {
						name : 'loginname',
						type : 'string'
					}, {
						name : 'description',
						type : 'string'
					}, {
						name : 'isAdmin'
					}]
		})

/**
 * 定义role
 */
Ext.define('role', {
			extend : 'Ext.data.Model',
			fields : [{
						name : 'id',
						type : 'string'
					}, {
						name : 'rolename',
						type : 'string'
					}, {
						name : 'permission'
					}, {
						name : 'updateDate'
					}, {
						name : 'createDate'
					}, {
						name : 'description',
						type : 'string'
					}]
		})
/**
 * 定义交换代码
 */
Ext.define('Exchange', {
			extend : 'Ext.data.Model',
			fields : [{
						name : 'id',
						type : 'string'
					}, {
						name : 'code',
						type : 'string'
					}, {
						name : 'name',
						type : 'string'
					}, {
						name : 'password',
						type : 'string'
					}, {
						name : 'isadmin',
						type : 'int'
					}, {
						name : 'exstate',
						type : 'int'
					}, {
						name : 'modifytime',
						type : 'string'
					}, {
						name : 'createtime',
						type : 'string'
					}, {
						name : 'UUID',
						type : 'string'
					}, {
						name : 'type',
						type : 'string'
					}, {
						name : 'msg',
						type : 'string'
					}]
		});
/**
 * 定义交换组群
 */
Ext.define('ExchangeGroup', {
			extend : 'Ext.data.Model',
			fields : [{
						name : 'id',
						type : 'string'
					}, {
						name : 'code',
						type : 'string'
					}, {
						name : 'name',
						type : 'string'
					}, {
						name : 'password',
						type : 'string'
					}, {
						name : 'exstate',
						type : 'int'
					}, {
						name : 'modifytime',
						type : 'string'
					}, {
						name : 'createtime',
						type : 'string'
					}, {
						name : 'UUID',
						type : 'string'
					}, {
						name : 'type',
						type : 'string'
					}, {
						name : 'msg',
						type : 'string'
					}]
		});
/**
 * 定义交换中心ActionType
 */
Ext.define('ExchangeActionType', {
			extend : 'Ext.data.Model',
			fields : [{
						name : 'id',
						type : 'string'
					}, {
						name : 'description',
						type : 'string'
					}, {
						name : 'actiontype',
						type : 'string'
					}, {
						name : 'createtime',
						type : 'string'
					}, {
						name : 'msg',
						type : 'string'
					}, {
						name : 'type',
						type : 'string'
					}]
		});
/**
 * 定义交换中心Event
 */
Ext.define('ExchangeEvent', {
			extend : 'Ext.data.Model',
			fields : [{
						name : 'id',
						type : 'string'
					}, {
						name : 'eventid',
						type : 'string'
					}, {
						name : 'ssource',
						type : 'string'
					}, {
						name : 'rtarget',
						type : 'string'
					}, {
						name : 'createtime',
						type : 'string'
					}, {
						name : 'expiretime',
						type : 'string'
					}, {
						name : 'copytime',
						type : 'string'
					}, {
						name : 'actiontype',
						type : 'string'
					}, {
						name : 'bizdata2',
						type : 'string'
					}, {
						name : 'type',
						type : 'string'
					}, {
						name : 'msg',
						type : 'string'
					}]
		});
/**
 * 定时任务
 */
Ext.define('TimingTask', {
			extend : 'Ext.data.Model',
			fields : [{
						name : 'id',
						type : 'string'
					}, {
						name : 'taskname',
						type : 'string'
					}, {
						name : 'desc',
						type : 'string'
					}, {
						name : 'interfaces',
						type : 'string'
					}, {
						name : 'service',
						type : 'string'
					}, {
						name : 'createtime',
						type : 'string'
					}, {
						name : 'modifytime',
						type : 'string'
					}, {
						name : 'jobtype',
						type : 'string'
					}, {
						name : 'tasktype',
						type : 'string'
					}, {
						name : 'enable',
						type : 'string'
					}, {
						name : 'mode',
						type : 'string'
					}, {
						name : 'isSystem',
						type : 'string'
					}]
		});
/**
 * 同步定时任务
 */
Ext.define('SynchTimingTask', {
			extend : 'Ext.data.Model',
			fields : [{
						name : 'id',
						type : 'string'
					}, {
						name : 'taskname',
						type : 'string'
					}, {
						name : 'desc',
						type : 'string'
					}]
		});
/**
 * simple
 */
Ext.define('Timingsimple', {
			extend : 'Ext.data.Model',
			fields : [{
						name : 'id',
						type : 'string'
					}, {
						name : 'starttime',
						type : 'string'
					}, {
						name : 'intervaltime',
						type : 'string'
					}, {
						name : 'runtimes',
						type : 'string'
					}, {
						name : 'endtime',
						type : 'string'
					}]
		});
/**
 * complex
 */
Ext.define('Timingcomplex', {
			extend : 'Ext.data.Model',
			fields : [{
						name : 'id',
						type : 'string'
					}, {
						name : 'seconds',
						type : 'string'
					}, {
						name : 'minutes',
						type : 'string'
					}, {
						name : 'hours',
						type : 'string'
					}, {
						name : 'days',
						type : 'string'
					}, {
						name : 'months',
						type : 'string'
					}, {
						name : 'weeks',
						type : 'string'
					}, {
						name : 'year',
						type : 'string'
					}, {
						name : 'crons',
						type : 'string',
						editor : false
					}]
		});
/**
 * timingtasklog {"endtime":"2013-01-24 09:36:57 057","starttime":"2013-01-24
 * 09:36:57
 * 057","jobtype":"InvokeVmInboundStatefulJob","interfaceName":"1","timingTaskId":"818188973c6a1c99013c6a32c1db012c","isSuccess":true,"taskName":"3","serviceName":"1"}
 */
Ext.define('TimingLog', {
			extend : 'Ext.data.Model',
			fields : [{
						name : 'endtime',
						type : 'string'
					}, {
						name : 'starttime',
						type : 'string'
					}, {
						name : 'jobtype',
						type : 'string'
					}, {
						name : 'interfaceName',
						type : 'string'
					}, {
						name : 'timingTaskId',
						type : 'string'
					}, {
						name : 'isSuccess',
						type : 'string'
					}, {
						name : 'taskName',
						type : 'string'
					}, {
						name : 'serviceName',
						type : 'string'
					}, {
						name : 'msg',
						type : 'string'
					}]
		});
/**
 * gridTreeModel
 */
Ext.define('gridTreeModel', {
			extend : 'Ext.data.Model',
			fields : [{
						name : 'beanId',
						type : 'string'
					}, {
						name : 'class',
						type : 'string'
					}, {
						name : 'createOnElement',
						type : 'string'
					}, {
						name : 'format',
						type : 'string'
					}]
		});
/**
 * excel config
 */
Ext.define('excelConfigModel', {
			extend : 'Ext.data.Model',
			fields : [{
						name : 'row',
						type : 'string'
					}, {
						name : 'col',
						type : 'string'
					}, {
						name : 'mapping',
						type : 'string'
					}, {
						name : 'type',
						type : 'string'
					}, {
						name : 'isnull',
						type : 'string'
					}]
		});
/**
 * DispatchEditModel
 */
Ext.define('DispatchEditModel', {
			extend : 'Ext.data.Model',
			fields : [{
						name : 'expression',
						type : 'string'
					}, {
						name : 'name',
						type : 'string'
					}, {
						name : 'value',
						type : 'string'
					}, {
						name : 'interfaces',
						type : 'string'
					}, {
						name : 'services',
						type : 'string'
					}, {
						name : 'interfacesName',
						type : 'string'
					}, {
						name : 'servicesName',
						type : 'string'
					}]
		});

/**
 * SQLModel
 */
Ext.define('SQLModel', {
			extend : 'Ext.data.Model',
			fields : [{
						name : 'name',
						type : 'string'
					},{
						name : 'expression',
						type : 'string'
					}, {
						name : 'symbol',
						type : 'string'
					}, {
						name : 'value',
						type : 'string'
					}, {
						name : 'keys',
						type : 'string'
					}, {
						name : 'sqls',
						type : 'string'
					}]
		});
/**
 * 数据模版
 */
Ext.define('dataTemplate', {
			extend : 'Ext.data.Model',
			fields : [{
						name : 'displayField',
						type : 'string'
					}, {
						name : 'value'
					}, {
						name : 'quantity',
						type : 'string'
					}]
		})
/**
 * 数据模版属性
 */
Ext.define('dataTemplateConfig', {
			extend : 'Ext.data.Model',
			fields : [{
						name : 'id',
						type : 'string'
					}, {
						name : 'name',
						type : 'string'
					}, {
						name : 'description',
						type : 'string'
					}, {
						name : 'data',
						type : 'string'
					}]
		})
/**
 * 自定义模版的MessageProcessor
 */
Ext.define('TemplateMessageProcessor', {
			extend : 'Ext.data.Model',
			fields : [{
						name : 'id',
						type : 'string'
					}, {
						name : 'bigType',
						type : 'string'
					}, {
						name : 'text',
						type : 'string'
					}, {
						name : 'smallType',
						type : 'string'
					}]
		})
/**
 * yigo配置
 */
Ext.define('YigoConfig', {
			extend : 'Ext.data.Model',
			fields : [{
						name : 'id',
						type : 'string'
					}, {
						name : 'text',
						type : 'string'
					}, {
						name : 'type',
						type : 'string'
					}, {
						name : 'description',
						type : 'string'
					}, {
						name : 'modifytime',
						type : 'string'
					}, {
						name : 'interfaces',
						type : 'string'
					}]
		});
/**
 * 定义ServletMapping
 */
Ext.define('ServletMapping', {
			extend : 'Ext.data.Model',
			fields : [{
						name : 'key',
						type : 'string'
					}, {
						name : 'id',
						type : 'string'
					}, {
						name : 'description',
						type : 'string'
					}, {
						name : 'interfaces',
						type : 'string'
					}, {
						name : 'services',
						type : 'string'
					}, {
						name : 'interfacesName',
						type : 'string'
					}, {
						name : 'servicesName',
						type : 'string'
					}, {
						name : 'isuseresponsemodel',
						type : 'string'
					}, {
						name : 'iscrypto',
						type : 'string'
					}, {
						name : 'usecommonkey',
						type : 'string'
					}, {
						name : 'deskey',
						type : 'string'
					}, {
						name : 'rsapublickey',
						type : 'string'
					}, {
						name : 'rsaprivatekey',
						type : 'string'
					}]
		})
/**
 * 定义VmFileImport
 */
Ext.define('VmFileImport', {
			extend : 'Ext.data.Model',
			fields : [{
						name : 'key',
						type : 'string'
					}, {
						name : 'id',
						type : 'string'
					}, {
						name : 'description',
						type : 'string'
					}, {
						name : 'fileName',
						type : 'string'
					}, {
						name : 'fileType',
						type : 'string'
					}, {
						name : 'verification',
						type : 'string'
					}, {
						name : 'interfaces',
						type : 'string'
					}, {
						name : 'services',
						type : 'string'
					}, {
						name : 'interfacesName',
						type : 'string'
					}, {
						name : 'servicesName',
						type : 'string'
					}, {
						name : 'data',
						type : 'List'
					}]
		});
/**
 * 定义DownloadFileInformation
 */
Ext.define('DownloadFileInformation', {
			extend : 'Ext.data.Model',
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
/**
 * 定义ws和http测试model
 */
Ext.define('LogConfig', {
			extend : 'Ext.data.Model',
			fields : [{
						name : 'uuid',
						type : 'String'
					},{
						name : 'testTime',
						type : 'String'
					}, {
						name : 'port',
						type : 'string'
					},  {
						name : 'wsserviceName',
						type : 'string'
					}, {
						name : 'wsMethodName',
						type : 'string'
					}, {
						name : 'ipAddress',
						type : 'string'
					}, {
						name : 'isPersistence',
						type : 'string'
					}, {
						name : 'httpRequestMethod',
						type : 'string'
					}, {
						name : 'centerRequestEncoding',
						type : 'string'
					}, {
						name : 'centerHttpIpAddress',
						type : 'string'
					}]
		});