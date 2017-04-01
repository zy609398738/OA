/**
 * 右面板
 * 
 */
function right_pg(j, pI) {

	var chongzhi = {
		text : '重置',
		icon : 'ExtJS4/shared/icons/fam/table_refresh.png',
		handler : function() {
			p_reset();
		}
	}

	function p_reset() {
		var c = getCmp('center_service');
		var record = c.p_sel_record;
		var IRecord = c.IRecord;
		var SRecord = c.SRecord;
		var u = 'interfaceInfoFindController.do?actionType=findTransformerPG';
		if (right.hide) {
			right.removeAll();
			Ext.Ajax.request( {
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
					right.add(right_pg(j, pI));
					right.expand();
					right.show();
					var ciphertext = Ext.encode(p.source);
					ciphertext = MD5(ciphertext);
					getCmp('center_service').ciphertext = ciphertext;
				}
			});
		}
	}

	var p = Ext.create('Ext.grid.PropertyGrid', {
		id : 'right_propertyGrid',
		border : 0,
		height : '100%',
		source : j.s,
		dirty : false,
		sortableColumns : false,
		pI : pI,
		newChange : 0,
		editShow : false,
		lockable : false,
		customEditors : j.c,
		propertyNames : j.pn,
		columnSort : false,
		tbar : {
			items : [ {
				text : '保存',
				id : 'saveRightProperties',
				icon : 'images/baocun.png',
				hidden : isHiddenFromPermission('interface_config',
						'findInterfaceStore', 'savePropertyGrid'),
				handler : function() {
					var source = p.getSource();
					var customEditor = p.customEditors;
					// 提交保存的时候需要保存的是 combo的ID值
				for ( var i in p.comboxFlag) {
					var comboboxStore = p.comboxFlag[i];
					for ( var j = 0; j < comboboxStore.getCount(); j++) {
						if (comboboxStore.getAt(j).data.text == source[i]) {
							source[i] = comboboxStore.getAt(j).data.id
							break;
						}
					}
				}
				var str = Ext.encode(source);
				Ext.Ajax.request( {
					url : 'interfaceInfoSaveController.do',
					params : {
						actionType : 'saveOrUpdatePropertyGrid',
						text : pI,
						attr : str
					},
					success : function(response) {
						var ciphertext = Ext.encode(p.source);
						ciphertext = MD5(ciphertext);
						getCmp('center_service').ciphertext = ciphertext;
						//Ext.Msg.alert('提示', response.responseText);
						if ('success' == response.responseText) {
							Ext.bokedee.msg('保存提示', 1000,response.responseText);
						} else {
							Ext.Msg.alert('提示', response.responseText);
						}
					}
				});
			}
			} ]
		},
		listeners : {
			beforepropertychange : function(source, recordId, value, oldValue) {
				if (p.comboxFlag[recordId]) {
					var record = this.getStore().getById(recordId);
					var cmbBrandEdit = p.comboxFlag[recordId];
					this.suspendEvents();
					if ('' == value) {
						return false;
					}

					// 处理当选择的label名称类似 自动选择的情况 传进来的 value 为 text 值 并不上ID的值
			if (cmbBrandEdit.find('id', value) == -1) {
				record.set("value", cmbBrandEdit.getAt(
						cmbBrandEdit.find('text', value)).get('text'));
			} else {
				record.set("value", cmbBrandEdit.getAt(
						cmbBrandEdit.find('id', value)).get('text'));
			}
			record.commit();
			this.resumeEvents();
			return false;
		}
	},
	itemclick : function() {
	}
		}
	});
	p.comboxFlag = Object();
	p.cascadeFlag = Object();
	for ( var i in p.customEditors) {
		if ('combobox' == p.customEditors[i].xtype) {
			p.comboxFlag[i] = p.customEditors[i].store;
			if (p.customEditors[i].cascadeComboId) {
				p.cascadeFlag[i] = p.customEditors[i].cascadeComboId;
			} else {
				p.cascadeFlag[i] = p.customEditors[i].id;
			}
		}
	}

	p.getView().on(
			'render',
			function(view) {
				view.tip = Ext.create('Ext.tip.ToolTip', {
					target : view.el,
					delegate : view.itemSelector,
					trackMouse : true,
					renderTo : Ext.getBody(),
					style : {
						background:'#FFFF90'
					},
					listeners : {
						beforeshow : function updateTipBody(tip) {
							tip.update(j.pn[view.getRecord(tip.triggerElement)
									.get('name')]);
						}
					}
				});
			});
	return p;
};

/**
 * 用来显示Messageprocessor的title
 * @return {TypeName} 
 */
function rightShell() {
	var p = Ext.create('Ext.Panel', {
		width : '100%',
		height : '100%',
		split : true
	});
	return p;

};

/**
 * 右边主面板
 */
var right = Ext.create('Ext.Panel', {
	region : 'east',
	width : 260,
	title : '流程节点属性',
	id : 'right',
	collapsible : true,
	split : true,
	collapsed : false,
	hidden : true,
	listeners : {
		hide : function() {
			this.removeAll();
		}
	}
});