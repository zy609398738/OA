/**
 * 中间面板的接口Grid
 */
function center_interface() {
	var p_tbar_items = [{
		text : '新建',
		scale : 'small',
		hidden : isHiddenFromPermission('interface_config',
				'findInterfaceStore', 'saveInterface'),
		width : 50,
		styleHtmlCls : 'btnFont_size_24',
		icon : 'images/add.png',
		handler : function() {
			windowSaveOrUpdateInterface(null);
		}
	}, {
		text : '修改',
		scale : 'small',
		hidden : isHiddenFromPermission('interface_config',
				'findInterfaceStore', 'updateInterface'),
		icon : 'images/xiugai.png',
		width : 50,
		styleHtmlCls : 'btnFont_size_24',
		handler : function() {
			if (p.p_sel_record != null) {
				var t1 = p_store.getAt(p.p_sel_index).data.text;
				if (t1 != p.p_sel_record.data.text)
					return;
				windowSaveOrUpdateInterface(p.p_sel_record);
			}
		}
	}, {
		text : '删除',
		scale : 'small',
		hidden : isHiddenFromPermission('interface_config',
				'findInterfaceStore', 'delInterface'),
		icon : 'images/shanchu.png',
		width : 50,
		handler : function() {
			if (p.p_sel_record != null) {
				deleteInterface(p.p_sel_record);
			}
		}
	}, {
		text : '复制接口',
		scale : 'small',
		hidden : isHiddenFromPermission('interface_config',
				'findInterfaceStore', 'copyInterface'),
		icon : 'images/fuzhijiekou.png',
		width : 80,
		handler : function() {
			if (p.p_sel_record != null) {
				windowCopyInterface(p.p_sel_record);
			}
		}
	}, {
		text : '复制服务',
		scale : 'small',
		hidden : isHiddenFromPermission('interface_config',
				'findInterfaceStore', 'copyService'),
		icon : 'images/fuzhifuwu.png',
		width : 80,
		handler : function() {
			if (p.p_sel_record != null) {
				windowCopyService(p.p_sel_record);
			}
		}
	}];

	/**
	 * 中间面板Grid的选择列
	 */
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

	/**
	 * 中间接口面板的Store
	 */
	var p_store_u = 'interfaceInfoFindController.do?actionType=findInterfaceStore';
	var p_store = new Ext.data.Store({
				model : 'Interface',
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

	var tit = '接口配置';
	tit = changeColorToRed(tit);
	var p = Ext.create('Ext.grid.Panel', {
				border : 0,
				id : 'center_interface',
				height : '100%',
				width : '100%',
				// header : Ext.create('Ext.panel.Header',{
				// style : 'background:#CCC'
				//			
				// }),
				viewConfig : {
					loadMask : false
				},
				title : tit,
				selModel : p_CheckboxModel,
				tbar : {
					items : p_tbar_items
				},
				columns : [{
							xtype : 'rownumberer',
							width : 30,
							sortable : false,
							menuDisabled : true,
							text : '序号'
						},{
							header : '接口名称',
							sortable : false,
							menuDisabled : true,
							dataIndex : 'text',
							flex : 2
						}, {
							header : '启动方式',
							sortable : false,
							menuDisabled : true,
							dataIndex : 'autoRun',
							flex : 1,
							renderer : function(value) {
								if (value == 'true')
									return '自动';
								else
									return '手动';
							}
						}, {
							header : '启动序号',
							sortable : false,
							menuDisabled : true,
							dataIndex : 'startIndex',
							flex : 1
						}, {
							header : '接口描述',
							sortable : false,
							menuDisabled : true,
							dataIndex : 'description',
							flex : 7
						}],
				store : p_store,
				listeners : {
					itemclick : function(grid, rowIndex) {

					},
					itemdblclick : function(view, record, item, index, event) {
						if (isHiddenFromPermission('interface_config',
								'findInterfaceStore', 'updateInterface') == false) {
							windowSaveOrUpdateInterface(record);
						}
					}
				}
			})
	return p;
};

/**
 * 中间面板服务的界面
 */
function center_service(IRecord, SRecord) {
	var t;
	if (IRecord != null) {
		t = '接口配置　:　[' + IRecord.data['text'] + ']　>>　[' + SRecord.data['text']
				+ ']';
	} else {
		t = "welcome";
	}
	t = changeColorToRed(t);
	/**
	 * 对grid进行分组
	 */
	var groupingFeature = Ext.create('Ext.grid.feature.Grouping', {
				// hideGroupedHeader : true,
				/**
				 * groupHeaderTpl : '{name}+{[values.rows[0]]}+{[name == false ?
				 * "异常流程" : "正常流程"]}'
				 */
				groupHeaderTpl : '{name}'
			});
	var pI;
	function p_CheckboxModel_select(m, record, index) {
		p.p_sel_record = record;
		p.p_sel_model = m.getSelection()[0];
		p.p_sel_index = index;
		var u = 'interfaceInfoFindController.do?actionType=findTransformerPG';
		if (right.hide) {
			right.removeAll();
			Ext.Ajax.request({
						url : u,
						params : {
							processorId : record.data['id'],
							interfaceId : IRecord.data['id'],
							serviceId : SRecord.data['id']
						},
						success : function(response) {
							var j = Ext.decode(response.responseText);
							var p = {
								interfaceId : IRecord.data['id'],
								serviceId : SRecord.data['id'],
								processorId : record.data['id'],
								flowMode : record.data['flowMode']
							};
							pI = Ext.encode(p);
							var tempPanel = rightShell();
							tempPanel.add(right_pg(j, pI));
							tempPanel.title = '流程节点 [ ' + record.data['text']
									+ ' ]';
							right.add(tempPanel);
							var rp = getCmp('right_propertyGrid');
							var ciphertext = Ext.encode(rp.source);
							ciphertext = MD5(ciphertext);
							getCmp('center_service').ciphertext = ciphertext;
							right.expand();
							right.show();
						}
					});
		}
	}

	function p_CheckboxModel_beforeSelectFN(v, r, index, type) {
		if ('yes' == type) {
			var rp = getCmp('right_propertyGrid');
			var source = rp.getSource();
			for (var i in source) {
				if ((source[i] + '').indexOf('请选择') > -1) {
					Ext.Msg.alert('提示', source[i]);
					return false;
				}
			}
			var customEditor = rp.customEditors;

			// 提交保存的时候需要保存的是 combo的ID值
			for (var i in rp.comboxFlag) {
				var comboboxStore = rp.comboxFlag[i];
				for (var j = 0; j < comboboxStore.getCount(); j++) {
					if (comboboxStore.getAt(j).data.text == source[i]) {
						source[i] = comboboxStore.getAt(j).data.id
						break;
					}
				}
			}
			var str = Ext.encode(source);
			Ext.Ajax.request({
						url : 'interfaceInfoSaveController.do',
						params : {
							actionType : 'saveOrUpdatePropertyGrid',
							text : rp.pI,
							attr : str
						},
						success : function(response) {
							p.s = false;
							Ext.Msg.alert('提示', response.responseText);
							v.select(index);
						}
					});
		} else if ('no' == type) {
			p.s = false;
			v.select(index);
		} else {
			p.s = true;
			return false;
		}
	}

	function p_CheckboxModel_beforeSelect(v, r, i) {
		if (p.s) {
			var j = getCmp('right_propertyGrid');
			var ciphertext;
			if (j)
				ciphertext = Ext.encode(j.source);
			ciphertext = MD5(ciphertext);
			if (ciphertext != p.ciphertext) {
				Ext.Msg.show({
							title : '确认离开吗',
							msg : 'Transformer属性内容被更改，是否保存?',
							buttons : Ext.Msg.YESNOCANCEL,
							fn : function(type) {
								p_CheckboxModel_beforeSelectFN(v, r, i, type);
							}
						})
			} else {
				p.s = false;
				v.select(i);
			}
			return false;
		} else {
			p.s = true;
		}
		return true;
	}

	/**
	 * 中间面板Grid的选择列
	 */
	var p_CheckboxModel = Ext.create('Ext.selection.CheckboxModel', {
				id : 'service_cbm',
				mode : 'SINGLE',
				listeners : {
					select : function(m, record, index) {
						p_CheckboxModel_select(m, record, index);
					},
					beforeselect : function(v, r, i) {
						return p_CheckboxModel_beforeSelect(v, r, i);
					}
				}
			});

	function p_tbar_items_mU() {
		Ext.Ajax.request({
					url : 'interfaceInfoSaveController.do',
					params : {
						actionType : 'upTransformerItem',
						interfaceId : IRecord.data['id'],
						serviceId : SRecord.data['id'],
						processorId : p.p_sel_record.data['id'],
						type : p.p_sel_record.data['flowMode']
					},
					success : function(response) {
						if ('success' == response.responseText) {
							var index = storeUpItem(
									getCmp('center_service').store,
									p.p_sel_index);
							p_CheckboxModel.select(index);
						} else {
							Ext.Msg.alert('提示', '移动失败');
						}
					},
					failure : function(response) {
						Ext.Msg.alert('提示', '移动失败：' + response.responseText);
					}
				});
	}

	function p_tbar_items_mD() {
		Ext.Ajax.request({
					url : 'interfaceInfoSaveController.do',
					params : {
						actionType : 'downTransformerItem',
						interfaceId : IRecord.data['id'],
						serviceId : SRecord.data['id'],
						processorId : p.p_sel_record.data['id'],
						type : p.p_sel_record.data['flowMode']
					},
					success : function(response) {
						if ('success' == response.responseText) {
							var index = storeDownItem(
									getCmp('center_service').store,
									p.p_sel_index);
							p_CheckboxModel.select(index);
						} else {
							Ext.Msg.alert('提示', '移动失败');
						}
					},
					failure : function(response) {
						Ext.Msg.alert('提示', '移动失败：' + response.responseText);
					}

				});
	}
	var p_tbar_items = [{
		text : '新增',
		scale : 'small',
		hidden : isHiddenFromPermission('interface_config',
				'findInterfaceStore', 'saveProcessor'),
		icon : 'images/add.png',
		width : 50,
		handler : function() {
			windowSaveOrUpdateMessageProcessor(IRecord.data['id'],
					SRecord.data['id'], null, p_store);
		}
	}, {
		text : '修改',
		scale : 'small',
		hidden : isHiddenFromPermission('interface_config',
				'findInterfaceStore', 'updateProcessor'),
		icon : 'images/xiugai.png',
		width : 50,
		handler : function() {
			if (p.p_sel_record != null) {
				windowSaveOrUpdateMessageProcessor(IRecord.data['id'],
						SRecord.data['id'], p.p_sel_record, null);
			}

		}
	}, {
		text : '删除',
		scale : 'small',
		hidden : isHiddenFromPermission('interface_config',
				'findInterfaceStore', 'delProcessor'),
		icon : 'images/shanchu.png',
		width : 50,
		handler : function() {
			if (p.p_sel_record != null) {
				deleteProcessor(IRecord.data['id'], SRecord.data['id'],
						p.p_sel_record);
			}
		}
	}, {
		text : '上移',
		scale : 'small',
		hidden : isHiddenFromPermission('interface_config',
				'findInterfaceStore', 'upTransformerItem'),
		icon : 'images/shangyi.png',
		width : 50,
		handler : function() {
			if (p.p_sel_record != null) {
				if ('inbound' == p.p_sel_record.data.bigType)
					return;
				p_tbar_items_mU();
			}
		}
	}, {
		text : '下移',
		scale : 'small',
		hidden : isHiddenFromPermission('interface_config',
				'findInterfaceStore', 'downTransformerItem'),
		icon : 'images/xiayi.png',
		width : 50,
		handler : function() {
			if (p.p_sel_record != null) {
				if ('inbound' == p.p_sel_record.data.bigType) {
					Ext.Msg.alert('提示', 'Inbound只可以在第一个');
					return;
				}
				p_tbar_items_mD();
			}
		}
	}, {
		text : '复制流程节点',
		scale : 'small',
		hidden : isHiddenFromPermission('interface_config',
				'findInterfaceStore', 'copyMessageprocessor'),
		icon : 'images/fuzhiliuchengjiedian.png',
		width : 100,
		handler : function() {
			if (p.p_sel_record != null) {
				if (p.p_sel_record.data['isRef'] == true) {
					Ext.Msg.alert('提示', '公共配置无需要复制，可以直接引用');
					return;
				}
				var messageprocessorInfo = {
					interfaceId : IRecord.data['id'],
					serviceId : SRecord.data['id'],
					processorId : p.p_sel_record.data['id'],
					flowMode : p.p_sel_record.data['flowMode'],
					text : p.p_sel_record.data['text']
				};
				windowCopyMessageprocessor(messageprocessorInfo);
			}
		}
	}];

	var p_store_u = 'interfaceInfoFindController.do?actionType=findTransformer&interfaceId='
			+ IRecord.data['id'] + "&serviceId=" + SRecord.data['id']

	function p_store_load(me) {
		if (!O.isInbound)
			O.isInbound = Object();
		if (!O.isInbound[IRecord.data.text])
			O.isInbound[IRecord.data.text] = Object();
		if (me.getCount() > 0) {
			if ('inbound' == me.getAt(0).data.bigType) {
				O.isInbound[IRecord.data.text][SRecord.data.text] = true;
			} else {
				O.isInbound[IRecord.data.text][SRecord.data.text] = false;
			}
		} else {
			O.isInbound[IRecord.data.text][SRecord.data.text] = false
		}
		right.hide();
	}

	var p_store = Ext.create('Ext.data.Store', {
				model : 'MessageProcessor',
				groupField : 'flowMode',
				sorters : {
					property : 'flowMode',
					direction : 'DESC'
				},
				proxy : {
					type : 'ajax',
					url : p_store_u
				},
				autoLoad : true,
				listeners : {
					load : function(me) {
						p_store_load(me);
						bodyLoadingMask.hide();
					}
				}
			});
	var p = Ext.create('Ext.grid.Panel', {
				id : 'center_service',
				title : t,
				border : 0,
				height : '100%',
				width : '100%',
				IRecord : IRecord,
				SRecord : SRecord,
				viewConfig : {
					loadMask : false,
					forceFit : true,
					getRowClass : function(record, rowIndex, rowParams, store) {
						var cls;
						if (record.data.enable == 'false') {
							cls = 'enable-false-background-row';
						}
						return cls;
					}
				},
				sortableColumns : false,
				selModel : p_CheckboxModel,
				features : [groupingFeature],
				tbar : {
					items : p_tbar_items
				},
				columns : [{
							header : '名称',
							dataIndex : 'text',
							sortable : false,
							menuDisabled : true,
							flex : 2.5
						}, {
							header : '类型',
							dataIndex : 'smallType',
							menuDisabled : true,
							flex : 2.5
						}, {
							header : '类别',
							dataIndex : 'bigType',
							sortable : false,
							menuDisabled : true,
							flex : 1.6
						}, {
							header : '是否启用',
							dataIndex : 'enable',
							sortable : false,
							menuDisabled : true,
							flex : 0.7,
							renderer : function(value) {
								if (value == 'false')
									return '否';
								else
									return '是';
							}
						}, {
							header : '记录日志',
							dataIndex : 'simpleMpLog',
							sortable : false,
							menuDisabled : true,
							flex : 0.7,
							renderer : function(value) {
								if (value == 'true')
									return '是';
								else
									return '否';
							}
						}, {
							header : '描述',
							dataIndex : 'description',
							menuDisabled : true,
							flex : 5
						}],
				store : p_store,
				listeners : {
					itemclick : function(grid, rowIndex) {
					},
					itemdblclick : function(view, record, item, index, event) {
						if (isHiddenFromPermission('interface_config',
								'findInterfaceStore', 'updateProcessor') == false) {
							windowSaveOrUpdateMessageProcessor(
									IRecord.data['id'], SRecord.data['id'],
									p.p_sel_record, null);
						}
					}
				}
			});
	return p;
};