/**
 * 欢迎面板
 */
function center_welcome() {
	var title = changeColorToRed('Welcome');

	var p_columns = [{
				xtype : 'rownumberer',
				width : 35,
				text : '序号',
				menuDisabled : true,
				sortable : false
			}, {
				header : '接口名称',
				sortable : false,
				menuDisabled : true,
				dataIndex : 'interfaceName',
				flex : 1
			}, {
				header : '服务名称',
				sortable : false,
				menuDisabled : true,
				dataIndex : 'serviceName',
				flex : 1
			}, {
				header : '日期',
				sortable : false,
				menuDisabled : true,
				dataIndex : 'date',
				flex : 0.45

			}, {
				header : '错误数量',
				sortable : false,
				menuDisabled : true,
				dataIndex : 'errors',
				flex : 0.35
			}, {
				header : '查看详情',
				dataIndex : 'description',
				sortable : false,
				menuDisabled : true,
				flex : 0.4,
				renderer : function(value, metaData, record) {
					var data=record.raw;
					return "<a style=\"width:80px;height:22px;\" href=\"javascript:void(changePanel(center_runtimeLog("+"'"+data.date+"&"+data.interfaceId+"&"+data.serviceId+"'"+")))\" >查看详情</a>";
				}
			}];

	var inter_columns = [{
				xtype : 'rownumberer',
				width : 35,
				text : '序号',
				menuDisabled : true,
				sortable : false
			}, {
				header : '接口名称',
				sortable : false,
				menuDisabled : true,
				dataIndex : 'text',
				flex : 1
			}, {
				header : '启动方式',
				sortable : false,
				menuDisabled : true,
				dataIndex : 'autoRun',
				flex : 0.5,
				renderer : function(value) {
					if (value == 'true')
						return '自动';
					else
						return '手动';
				}
			}, {
				header : '运行模式',
				sortable : false,
				menuDisabled : true,
				dataIndex : 'runMode',
				flex : 0.45

			}, {
				header : '当前状态',
				sortable : false,
				menuDisabled : true,
				dataIndex : 'mode',
				flex : 0.35,
				renderer : function(value, metaData, record) {
					if ('fail' != record.data.mode) {
						if ('start' == record.data.mode) {
							return '未启动';
						} else {
							return '<font style=\"color:blue\">运行中...</font>';
						}
					}
					return '<font style=\"color:red\">加载失败</font>';
				}
			}];

	var p_store_u = 'interfaceLogManagerController.do?actionType=findIdxErrLog';
	var inter_store_u = 'interfaceRunManagerController.do?actionType=justLoadInterRun';

	var p_store = new Ext.data.Store({
				model : 'idxlogInfoPanel',
				proxy : {
					type : 'ajax',
					url : p_store_u
				},
				autoLoad : true,
				listeners : {
					load : function(me) {
						bodyLoadingMask.hide();
					}
				}
			});

	var inter_store = new Ext.data.Store({
				model : 'interfaceRunningPanel',
				proxy : {
					type : 'ajax',
					url : inter_store_u
				},
				autoLoad : true,
				listeners : {
					load : function(me) {
						bodyLoadingMask.hide();
					}
				}
			});

	var tbar_items = ['天数：', {
				xtype : 'numberfield',
				name : 'days',
				id : 'days',
				value : 1,
				size : 15,
				minValue : 1,
				maxValue : 30,
				editable : false
			}, {
				text : '查询',
				scale : 'small',
				width : 50,
				styleHtmlCls : 'btnFont_size_24',
				icon : 'images/chaxun.png',
				handler : function() {
					p_store.load({
								url : p_store_u,
								params : {
									days : getCmp('days').rawValue
								}
							});
				}
			}]

	var idxlogInfo = Ext.create('Ext.grid.Panel', {
				border : 1,
				id : 'indexlogInfo',
				width : '80%',
				flex : 1,
				title : '运行异常日志',
				tbar : {
					items : tbar_items
				},
				loadMask : true,
				sortableColumns : false,
				columns : p_columns,
				store : p_store
			});

	var interRunningInfo = Ext.create('Ext.grid.Panel', {
				border : 1,
				margins : '10 0 0 0',
				id : 'interfaceRunningInfo',
				width : '80%',
				flex : 1,
				title : '当前接口运行状态',
				loadMask : true,
				sortableColumns : false,
				columns : inter_columns,
				store : inter_store
			});

	var p = Ext.create('Ext.Panel', {
				id : 'center_welcome',
				title : title,
				border : 1,
				height : '100%',
				width : '100%',
				layout : {
					type : 'hbox',
					align : 'stretch'
				},
				items : [Ext.create('Ext.Component', {
									height : '100%',
									flex : 1,
									autoEl : {
										html : "<div class='welcome'>欢 迎 使 用</div>"
									}
								}), {
							xtype : 'container',
							layout : {
								type : 'vbox',
								align : 'stretch'
							},
							flex : 1.5,
							margins : '10 20 10 0',
							width : '100%',
							items : [idxlogInfo, interRunningInfo]
						}]
			});
	return p;
}

/**
 * 父面板，用于承载其他面板，切换面板时使用
 */
var center = Ext.create('Ext.Panel', {
			region : 'center',
			animate : true,
			id : 'center',
			collapsible : false,
			border : 1
		});

// tbar {}, '-',{ } 这里会出现分割线
