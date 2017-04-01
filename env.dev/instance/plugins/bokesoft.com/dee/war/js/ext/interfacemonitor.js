Ext.require(['*']);

//整个这段为了支持 IE11
if (Object.hasOwnProperty.call(window, "ActiveXObject") && !window.ActiveXObject) { // is IE11
    Ext.apply(Ext, {
        isIE : false, // cosmetic, since it's false by default for IE11
        isIE11: true,
        ieVersion: 11
    });


    Ext.override(Ext.layout.container.Container, {
        getLayoutTargetSize : function() {
            var target = this.getTarget(),
                ret;


            if (target) {
                ret = target.getViewSize();


                // IE in will sometimes return a width of 0 on the 1st pass of getViewSize.
                // Use getStyleSize to verify the 0 width, the adjustment pass will then work properly
                // with getViewSize
                if ((Ext.isIE || Ext.isIE11) && ret.width == 0){ 
                    ret = target.getStyleSize();
                }


                ret.width -= target.getPadding('lr');
                ret.height -= target.getPadding('tb');
            }
            return ret;
        }
    });
}
////

Ext.onReady(function() {
	// 所有ajax调用默认 超时时间都为 10分钟
	Ext.Ajax.timeout = 600000;
			var p = centerinterfacemonitordslogmanagerpanel();
			Ext.QuickTips.init();
			var index_viewPort = Ext.create('Ext.container.Viewport', {
						layout : 'fit',
						renderTo : Ext.getBody(),
						items : [p]
					});
			var task = {
				run : function() {
					refreshData();
				},
				interval : 3600000
			}
			var runner = new Ext.util.TaskRunner();
			runner.start(task);
		});
var tbar_items = [{
			text : '刷新',
			scale : 'small',
			width : 80,
			icon : 'images/shuaxin.png',
			handler : function() {
				refreshData();
			}
		}];

function refreshData() {
	var interfaceMonitorURL = 'serviceStatusMonitorController.do?actionType=findServiceAllRunningStatus';
	var data = ajaxSyncCall(interfaceMonitorURL);
	var obj = Ext.JSON.decode(data);
	if (obj.result) {
		Ext.getCmp('SimpleConfiggridPanel').store.removeAll();
		Ext.getCmp('SimpleConfiggridPanel').store.add(obj.data);
	} else {
		Ext.Msg.alert('数据加载错误', obj.data);
		return;
	}
}
function centerinterfacemonitordslogmanagerpanel() {
	var title = '接口服务状态监控';
	var store = Ext.create('Ext.data.Store', {
				fields : ['responsetime', 'text', 'lastruntime', 'status',
						'servicename', 'interfacename', 'autorun', 'runtimes',
						'serviceid', 'mode', 'runmode', 'errorruntimes',
						'startindex', 'description', 'totalsize',
						'createdatetime', 'errorlastruntime', 'interfaceid'],
				data : [],
				autoLoad : true
			});

	var SimpleConfiggridPanel = Ext.create('Ext.grid.Panel', {
		title : title,
		id : 'SimpleConfiggridPanel',
		width : '100%',
		margins : '5 0 0 5',
		height : '100%',
		frame : true,
		defaults : {
			split : true
		},
		border : 1,
		method : 'post',
		defaultType : 'textfield',
		tbar : {
			items : tbar_items
		},
		columns : [{
					xtype : 'rownumberer',
					text : '序号',
					sortable : false,
					menuDisabled : true,
					flex : 1
				}, {
					text : '接口名',
					dataIndex : 'interfacename',
					sortable : false,
					menuDisabled : true,
					flex : 3
				}, {
					text : '服务名',
					dataIndex : 'servicename',
					sortable : false,
					menuDisabled : true,
					flex : 3
				}, {
					text : '正常次数',
					dataIndex : 'runtimes',
					sortable : false,
					menuDisabled : true,
					flex : 3,
					renderer : function(value) {
						return '<font style=\"color:blue\">' + value
								+ '</font>';
					}
				}, {
					text : '最后正常时间',
					dataIndex : 'lastruntime',
					sortable : false,
					menuDisabled : true,
					flex : 5,
					renderer : Ext.util.Format.dateRenderer('Y-m-d H:i:s.u')
				}, {
					text : '总传输数据量(kb)',
					dataIndex : 'totalsize',
					sortable : false,
					menuDisabled : true,
					flex : 3,
					renderer : function(value) {
						return '<font style=\"color:blue\">'
								+ (value / 1024).toFixed(3) + '</font>';
					}
				}, {
					text : '异常次数',
					dataIndex : 'errorruntimes',
					sortable : false,
					menuDisabled : true,
					flex : 3,
					renderer : function(value) {
						return '<font style=\"color:red\">' + value + '</font>';
					}
				}, {
					text : '最后异常时间',
					dataIndex : 'errorlastruntime',
					sortable : false,
					menuDisabled : true,
					flex : 5,
					renderer : Ext.util.Format.dateRenderer('Y-m-d H:i:s.u')
				}, {
					text : '是否自动启动',
					dataIndex : 'autorun',
					sortable : false,
					menuDisabled : true,
					flex : 3,
					renderer : function(value) {
						if (value == 'true')
							return '自动';
						else
							return '手动';
					}

				}, {
					text : '当前运行模式',
					dataIndex : 'runmode',
					sortable : false,
					menuDisabled : true,
					flex : 3
				}, {
					text : '运行状态',
					dataIndex : 'mode',
					sortable : false,
					menuDisabled : true,
					flex : 3,
					renderer : function(value, metaData, record) {
						if ('fail' != record.data.mode) {
							if ('start' == record.data.mode) {
								return '未启动';
							} else if ('delete' == record.data.mode) {
								return '接口服务已被删除';
							} else {
								return '<font style=\"color:blue\">运行中...</font>';
							}
						}
						return '<font style=\"color:red\">加载失败</font>';
					}
				}, {
					text : '服务ID',
					dataIndex : 'serviceid',
					sortable : false,
					menuDisabled : true,
					hidden : true
				}, {
					text : '接口ID',
					dataIndex : 'interfaceid',
					sortable : false,
					menuDisabled : true,
					hidden : true
				}],
		store : store,
		listeners : {

	}
	});
	return SimpleConfiggridPanel;

}
function ajaxSyncCall(url, params, method) {
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