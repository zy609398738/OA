Ext.Loader.setConfig({
			enabled : true
		});
Ext.require(['Ext.grid.*', 'Ext.data.*', 'Ext.util.*',
		'Ext.grid.PagingScroller']);
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
Ext.onReady(function() {
	bodyLoadingMask = new Ext.LoadMask(Ext.getBody(), {
		msg : "正在操作,请稍后...",
		msgCls : 'z-index:10000;'
	});
	
	var menucenter = Ext.create('Ext.Panel', {
				region : 'center',
				id : 'menucenter',
				collapsible : false,
				border : 1
			});
	var left_tree = Ext.create('Ext.tree.Panel', {
				id : 'left_tree',
				rootVisible : false,
				frame : false,
				useArrows : true,
				loadMask : true,
				border : 0,
				height : '100%',
				root : {
					expanded : true,
					children : [{
								text : '日志查询',
								leaf : true
							}, {
								text : '日志删除',
								leaf : true
							}]
				},
				listeners : {
					itemclick : function(view, record) {
						menucenter.removeAll();
						var p
							if ('日志查询' == record.raw.text) {
								p = centerdslogmanagerpanel();
							} else if (('日志删除' == record.raw.text)) {
								p = centerdeletedslogmanagerpanel();
							}
						menucenter.add(p);
					}
				}
			});
	var index_viewPort = Ext.create('Ext.container.Viewport', {
				layout : 'border',
				margins : '5 0 0 5',
				renderTo : Ext.getBody(),
				items : [{
							xtype : 'panel',
							title : '主菜单',
							region : 'west',
							id : 'menu',
							border : 1,
							width : '10%',
							layout : 'fit',
							items : [left_tree]
						}, menucenter]
			})
});

function centerdeletedslogmanagerpanel() {
	var interfaceComboboxURL = 'interfaceInfoFindController.do?actionType=findInterfaceCombobox';
	var serviceComboboxURL = 'interfaceInfoFindController.do?actionType=findServiceCombobox';
	var interfaceCombobox = {
		xtype : 'combobox',
		fieldLabel : '接口',
		width : 350,
		labelWidth : 60,
		id : 'interfaceCombobox',
		name : 'interfaceCombobox',
		emptyText : '请选择接口',
		store : Ext.create('Ext.data.Store', {
					fields : ['displayField', 'value', 'description'],
					proxy : {
						type : 'ajax',
						url : interfaceComboboxURL,
						reader : {
							type : 'json',
							root : 'root'
						}
					},
					autoLoad : true
				}),
		editable : false,
		displayField : 'description',
		valueField : 'value',
		queryMode : 'local',
		listeners : {
			select : function(combobox, record) {
				Ext.Ajax.request({
							url : serviceComboboxURL,
							params : {
								interfaceId : record[0].data.value
							},
							success : function(response) {
								serviceCombobox_store.removeAll();
								var result = response.responseText;
								var j = Ext.decode(result);
								serviceCombobox_store.add(j.root);
								Ext.getCmp('serviceCombobox').setValue('');
							}
						})
			}
		}
	};

	var serviceCombobox_store = new Ext.data.Store({
				fields : ['displayField', 'value'],
				autoLoad : false
			});
	var serviceCombobox = {
		xtype : 'combobox',
		fieldLabel : '服务',
		width : 350,
		labelWidth : 60,
		id : 'serviceCombobox',
		name : 'serviceCombobox',
		emptyText : '请选择服务',
		store : serviceCombobox_store,
		editable : false,
		displayField : 'description',
		valueField : 'value',
		queryMode : 'local'
	};
	var win_form = Ext.create('Ext.form.Panel', {
				title : '选择删除条件',
				// id : 'interfaceStatus_panel_del',
				width : '100%',
				margins : '5 0 0 5',
				height : '30%',
				frame : true,
				defaults : {
					split : true
				},
				border : 1,
				method : 'post',
				layout : {
					type : 'table',
					columns : 2
				},
				defaultType : 'textfield',
				items : [interfaceCombobox, serviceCombobox, {
							xtype : 'datefield',
							fieldLabel : '开始时间',
							labelWidth : 60,
							name : 'startDate',
							id : 'startDate',
							value : new Date(),
							format : 'Y-m-d',
							maxValue : new Date(),
							width : 350,
							endDateField : 'endDate',
							editable : false
						}, {
							xtype : 'datefield',
							labelWidth : 60,
							fieldLabel : '结束时间',
							format : 'Y-m-d',
							width : 350,
							id : 'endDate',
							name : 'endDate',
							value : new Date(),
							// maxValue:new Date(),
							startDateField : 'startDate',
							editable : false
						}, {
							xtype : 'fieldset',
							defaultType : 'radio',
							width : 350,
							id : 'radiotype2',
							layout : 'hbox',
							items : [{
										checked : true,
										boxLabel : '全部',
										name : 'radiocheck',
										inputValue : '-1'
									}, {
										boxLabel : '成功',
										name : 'radiocheck',
										inputValue : '1'
									}, {
										boxLabel : '失败',
										name : 'radiocheck',
										inputValue : '0'
									}]
						}, {
							xtype : 'toolbar',
							dock : 'bottom',
							ui : 'footer',
							items : [{
										text : '删除',
										xtype : 'button',
										icon : 'images/shanchu.png',
										handler : function() {
											deleteDbLog()
										}
									}]
						}]
			});
	var interfaceStatus_panel_del = Ext.create('Ext.panel.Panel', {
				id : 'interfaceStatus_panel_del',
				width : '100%',
				margins : '5 0 0 5',
				height : '100%',
				frame : true,
				defaults : {
					split : true
				},
				items : [win_form]
			});

	return interfaceStatus_panel_del;
}

function deleteDbLog() {
	var interfacename = Ext.getCmp('interfaceCombobox').value;
	var servicename = Ext.getCmp('serviceCombobox').value;
	var startDate = Ext.getCmp('startDate').rawValue;
	var endDate = Ext.getCmp('endDate').rawValue;

	if (startDate - endDate > 0) {
		Ext.Msg.alert('提示', '开始时间不能大于结束时间');
		return;
	}

	Ext.Msg.show({
		title : '确认删除',
		msg : '确定删除符合条件的日志信息吗？',
		buttons : Ext.Msg.YESNO,
		fn : function(type) {
			if ('yes' == type) {
				bodyLoadingMask.show();
				Ext.Ajax.request({
					url : 'interfaceIndexController.do?actionType=deleteIndex',
					params : {
						interfaceId : interfacename,
						serviceId : servicename,
						startDate : startDate,
						endDate : endDate
					},
					success : function(response) {
						bodyLoadingMask.hide();
						var result = Ext.decode(response.responseText);
						if (result.result) {
							//Ext.getStore('logDelStore').loadRawData(
							//		result, false);
							Ext.Msg.alert('删除成功', 'sucess');
						} else {
							Ext.Msg.alert('删除失败', result.data);
						}
					},
					failure : function(response) {
						bodyLoadingMask.hide();
						var result = Ext.decode(response.responseText);
						Ext.Msg.alert('删除失败', result.data);
					}

				});
			}
		}
	})

}