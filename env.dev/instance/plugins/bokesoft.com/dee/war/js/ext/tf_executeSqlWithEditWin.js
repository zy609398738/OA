function executeSqlWithEdit(fieldName, label) {

	var win_buttons = [ {
		text : '确定',
		handler : function() {
					if (validatelsIsTheSameOrIsNull(win_grid_store)) {
						return false;
					}
					//win_grid_store中keys值发生变化后，更新sqls的值
					for(var i=0;i<win_grid_store.getCount();i++){
						win_grid_store.getAt(i).data.sqls='';
						var keys=win_grid_store.getAt(i).data.keys.split(',');
						for(var j=0;j<keys.length;j++){
							for(var k=0;k<win_grid_store_bottom.getCount();k++){
								if(keys[j]==win_grid_store_bottom.getAt(k).data.key){
									win_grid_store.getAt(i).data.sqls+=win_grid_store_bottom.getAt(k).data.sql+';bokedee;';
								}
							}
						}
						win_grid_store.getAt(i).data.sqls=win_grid_store.getAt(i).data.sqls.substring(0,win_grid_store.getAt(i).data.sqls.length-9)
					}

					var rp = getCmp('right_propertyGrid');
					if (win_grid_store.getCount() == 0&&win_grid_store_bottom.getCount()==0)
						rp.setProperty(fieldName, '点此编辑');
					else {
						rp.setProperty(fieldName, storeToJSON2(win_grid_store,win_grid_store_bottom));
						// 点击确定按钮直接保存
						Ext.getCmp('saveRightProperties').handler();
					}
					win.close();
		}
	}, {
		text : '取消',
		handler : function() {
			win.close();
		}
	} ];

	function win_gridEdit(record, index) {
		function win_Value_btn() {
			record.data.value = win_Value_form.getValues().propertyValue;
			win_grid_store.removeAt(index);
			win_grid_store.insert(index, record)
			win_Value.close();
		}
		var win_Value_form = Ext.create('Ext.form.Panel', {
			border : 0,
			items : [ {
				xtype : 'textarea',
				name : 'propertyValue',
				width : 788,
				height : 382,
				value : record.data.value
			} ]
		});
		var win_Value = Ext.create('Ext.Window', {
			title : record.data.key,
			width : 800,
			height : 450,
			draggable : false,
			autoScroll : true,
			resizable : false,
			modal : true,
			buttons : [ {
				text : '确定',
				handler : function() {
					win_Value_btn();
				}
			}, {
				text : '取消',
				handler : function() {
					win_Value.close();
				}
			} ],
			items : [ win_Value_form ]
		}).show();
	}

	var win_grid_CheckboxModel = Ext.create('Ext.selection.CheckboxModel', {
		mode : 'SINGLE',
		listeners : {
			select : function(m, record, index) {
				win_grid._record = record;
				win_grid._index = index;
			}
		}
	});
	var vj = [];
	var v = getCmp('right_propertyGrid').getSource()[fieldName];
	if (v != null && v != '点此编辑' && '' != v) {
		vj = Ext.decode(v);
	}
	else
		vj=[{"g1":[],"g2":[]}];
	var win_grid_store = Ext.create('Ext.data.Store', {
		model : 'SQLModel',
		data : vj[0].g1,
		autoLoad : false,
		remoteSort: false
	});
	var win_grid_item = [ {
		text : '新增',
		icon : 'images/add.png',
		scale : 'small',
		width : 50,
		handler : function() {
			windowEditDispatch();
		}
	}, {
		text : '删除',
		scale : 'small',
		icon : 'images/shanchu.png',
		width : 50,
		handler : function() {
			if (win_grid._index != null) {
				win_grid_item_btnDelHandler(win_grid._index);
			}
		}
	}, {
		text : '修改',
		scale : 'small',
		icon : 'images/xiugai.png',
		width : 50,
		handler : function() {
			var record = win_grid._record;
			if (record != null) {
				windowEditDispatch(record, win_grid._index);
			}
		}
	}, {
			title:label,
			text : '(按条件选择需要的sql语句)'
	} ];

	function win_grid_item_btnDelHandler(gridIndex) {
		Ext.Msg.show( {
			title : '删除',
			msg : '确定删除：' + win_grid_store.getAt(gridIndex).data.name,
			buttons : Ext.Msg.YESNO,
			fn : function(type) {
				if ('yes' == type) {
					win_grid_store.removeAt(gridIndex);
					gridIndex = undefined;
				}
			}
		})
	}
	var win_grid = Ext.create('Ext.grid.Panel', {
		id : 'dispatchEditGrid',
		autoScroll : true,
		selModel : win_grid_CheckboxModel,
		store : win_grid_store, 
		tbar : {
			items : win_grid_item
		},
		columns : [ {
			header : '名称',
			dataIndex : 'name',
			flex : 2
		}, {
			header : '表达式',
			dataIndex : 'expression',
			flex : 2
		}, {
			header : '符号',
			dataIndex : 'symbol',
			flex : 2
		},{
			header : '值',
			dataIndex : 'value',
			flex : 2
		}, {
			header : 'SQL语句',
			dataIndex : 'keys',
			flex : 2
		}],
		height : 193,
		listeners : {
			itemdblclick : function(view, record, item, index, event) {
				windowEditDispatch(record, win_grid._index);
			}
		}
	});

	
	function win_gridEdit_bottom(record, index) {
		function win_Value_btn() {
			record.data.sql = win_Value_form.getValues().propertyValue;
			win_grid_store_bottom.removeAt(index);
			win_grid_store_bottom.insert(index, record)
			win_Value.close();
		}
		var win_Value_form = Ext.create('Ext.form.Panel', {
					border : 0,
					items : [{
								xtype : 'textarea',
								name : 'propertyValue',
								width : 788,
								height : 382,
								value : record.data.sql
							}]
				});
		var win_Value = Ext.create('Ext.Window', {
					title : record.data.key,
					width : 800,
					height : 450,
					draggable : false,
					autoScroll : true,
					resizable : false,
					modal : true,
					buttons : [{
								text : '确定',
								handler : function() {
									win_Value_btn();
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

	var win_grid_CheckboxModel_bottom = Ext.create('Ext.selection.CheckboxModel', {
				mode : 'SINGLE',
				listeners : {
					select : function(m, record, index) {
						win_grid_bottom._record = record;
						win_grid_bottom._index = index;
					}
				}
			});
	var vj_bottom = [];
	var v_bottom = getCmp('right_propertyGrid').getSource()[fieldName];
	if (v_bottom != null && v_bottom != '点此编辑' && '' != v_bottom)
		vj_bottom = Ext.decode(v_bottom);
	else
		vj_bottom=[{"g1":[],"g2":[]}];
	var win_grid_store_bottom = Ext.create('Ext.data.Store', {
				model : 'SQLValue',
				data : vj_bottom[0].g2,
				autoLoad : false
			});
	var win_grid_item_bottom = [{
				text : '新增',
				icon : 'images/add.png',
				scale : 'small',
				width : 50,
				handler : function() {
					var r = Ext.ModelManager.create({
								sql : ''
							}, 'SQLValue');
					win_grid_store_bottom.insert(win_grid_store_bottom.getCount(), r);
					var row = win_grid_store_bottom.getCount() - 1;
					win_grid_pluginCellEdit_bottom.startEditByPosition({
								row : row,
								column : 0
							});
				}
			}, {
				text : '删除',
				scale : 'small',
				icon : 'images/shanchu.png',
				width : 50,
				handler : function() {
					if (gridIndex != null) {
						win_grid_item_btnDelHandler_bottom();
					}
				}
			}, {
				text : '编辑值',
				scale : 'small',
				icon : 'images/xiugai.png',
				width : 80,
				handler : function() {
					var record = win_grid_bottom._record, index;
					if (record != null) {
						index = win_grid_bottom._index;
						win_gridEdit_bottom(record, index);
					}
				}
			}, {
				title:label,
				text : '(添加sql语句)'
			}];

	var gridIndex;

	function win_grid_item_btnDelHandler_bottom() {
		Ext.Msg.show({
					title : '删除',
					msg : '确认删除：'+win_grid_store_bottom.getAt(gridIndex).data.key,
					buttons : Ext.Msg.YESNO,
					fn : function(type) {
						//win_grid_store_bottom中的key删除后，win_grid_store的keys中对应的值也删除掉
						var dkey=win_grid_store_bottom.getAt(gridIndex).data.key;
						for(var i=0;i<win_grid_store.getCount();i++){
							var keys=win_grid_store.getAt(i).data.keys.split(',');
							for(var j=0;j<keys.length;j++){
								if(keys[j]==dkey){
									keys.splice(j,1);
									j--;
								}
							}
							win_grid_store.getAt(i).data.keys='';
							for(var k=0;k<keys.length;k++){
								win_grid_store.getAt(i).data.keys+=keys[k]+',';
							}
							win_grid_store.getAt(i).data.keys=win_grid_store.getAt(i).data.keys.substring(0,win_grid_store.getAt(i).data.keys.length-1)
						}
						for(var m=0;m<win_grid_store.getCount();m++){
							
							var name = win_grid_store.getAt(m).data.name;
							var expression = win_grid_store.getAt(m).data.expression;
							var symbol=win_grid_store.getAt(m).data.symbol;
							var value =win_grid_store.getAt(m).data.value;
							var keys = win_grid_store.getAt(m).data.keys;

							var data = {
								name : name,
								expression: expression,
								symbol:symbol,
								value :value,
								keys :keys
							};
							win_grid_store.removeAt(m);
							Ext.getCmp('dispatchEditGrid').store.insert(m,data);
						}
						if ('yes' == type) {
							win_grid_store_bottom.removeAt(gridIndex);
							gridIndex = undefined;
						}
						
					}
				})
	}

	var win_grid_pluginCellEdit_bottom = Ext.create('Ext.grid.plugin.CellEditing', {
				clicksToEdit : 1,
				listeners : {
					beforeedit : function(record) {
						gridIndex = record.rowIdx;
					}
				}
			});

	var win_grid_bottom = Ext.create('Ext.grid.Panel', {
				id:'addsql',
				autoScroll : true,
				firstCheck : true,
				selModel : win_grid_CheckboxModel_bottom,
				store : win_grid_store_bottom,
				tbar : {
					items : win_grid_item_bottom
				},
				columns : [{
							header : '名称',
							dataIndex : 'key',
							flex : 39,
							field : 'textarea'
						},{
							header : '值',
							dataIndex : 'sql',
							flex : 78,
							field : 'textarea'
						}],
				plugins : [win_grid_pluginCellEdit_bottom],
				height : 193
			});

	var win = Ext.create('Ext.Window', {
		title : label,
		width : 800,
		height : 450,
		draggable : false,
		autoScroll : true,
		resizable : false,
		modal : true,
		buttons : win_buttons,
		items : [ win_grid,win_grid_bottom ]
	});

	win.show();

}
function windowEditDispatch(record, index) {

	win_buttons =[ {
		text : '确定',
		handler : function() {
			var form_name = win_form.getValues().name;
			var form_expression = win_form.getValues().expression;
			var form_symbol=win_form.getValues().symbol;
			var form_value = win_form.getValues().value;
			var form_keys = win_form.getValues().keys;

			if (form_name=='') {
				Ext.Msg.alert('提示', '名称不能为空！！！');
				return;
			}
			if (form_expression=='') {
				Ext.Msg.alert('提示', '表达式不能为空！！！');
				return;
			}
			if (form_value=='') {
				Ext.Msg.alert('提示', '值不能为空！！！');
				return;
			}
			if (form_keys.length == 0) {
				Ext.Msg.alert('提示', 'SQL语句不能为空！！！');
				return;
			}

			var store=Ext.getCmp('dispatchEditGrid').store;
			var count = store.getCount();
			if(record==null){//新增
				for ( var i = 0; i < count; i++) {
					if(form_name==store.getAt(i).data.name){
						Ext.Msg.alert('提示','该名称已存在');
						return;
					}
				}
			}else{//修改移除后再新增
				store.removeAt(index);
			}
			var data = {
				name : form_name,
				expression: form_expression,
				symbol:form_symbol,
				value : form_value,
				keys : form_keys
			};
			Ext.getCmp('dispatchEditGrid').store.add(data);
			win.close();
		}
	}, {
		text : '取消',
		handler : function() {
			win.close();
		}
	} ];
	
	var sqlstore=Ext.getCmp('addsql').store;
	var data=[];
	for(var i=0;i<sqlstore.getCount();i++){
		var r=sqlstore.getAt(i).get('key');
		var mdata={};
		mdata.displayField=r;
		mdata.value=r;
		data.push(mdata);
	}

	var newstore=Ext.create('Ext.data.Store', {
											model : 'Combox',
											data : data
											});

	var win_form = Ext.create('Ext.form.Panel',
					{
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
						items : [
								{
									fieldLabel : '名称',
									name : 'name',
									allowBlank : false
								},
								{
									fieldLabel : '表达式',
									name : 'expression',
									allowBlank : false
								},
								{
									fieldLabel : '符号',
									xtype : 'combobox',
									name : 'symbol',
									allowBlank : false,
									editable : false,
									store:['>','=','<'],
									value:'='
								},
								{
									fieldLabel : '值',
									name : 'value',
									allowBlank : false
								},
								{
									fieldLabel : 'SQL语句',
									xtype : 'combobox',
									name : 'keys',
									multiSelect:'true',
									allowBlank : false,
									store:newstore,
									editable : false,
									displayField : 'displayField',
									valueField : 'value',
									queryMode : 'local'
								}]
					});

	if(record!=null){
		win_form.getForm().setValues( {
			name : record.data['name'],
			expression : record.data['expression'],
			symbol:record.data['symbol'],
			value : record.data['value'],
			keys : record.data['keys']
		});
	}
	var win = Ext.create('Ext.Window', {
		title : '添加',
		width : 500,
		height : 300,
		draggable : false,
		autoScroll : true,
		resizable : false,
		modal : true,
		buttons : win_buttons,
		items : [ win_form ]
	});
	win.show();
}