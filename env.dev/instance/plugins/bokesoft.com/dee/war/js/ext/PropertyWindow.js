/**
 * 复杂属性的Map<String,List<String>>
 */
function map_kString_vListString(fieldName, label) {

	var win_buttons = [{
				text : '确定',
				handler : function() {
					if (validatemslsIsTheSameOrIsNull(win_grid_store)) {
						return false;
					}
					var rp = getCmp('right_propertyGrid');
					var count = win_grid_store.getCount();
					for (var i = 0; i < count; i++) {
						if (!win.gridValue[win_grid_store.getAt(i).data.key]) {
							alert('[' + win_grid_store.getAt(i).data.key
									+ ']尚未赋值');
							return;
						}
					}
					var temp = false;
					for (var i in win.gridValue) {
						temp = true;
					}
					if (temp == true) {
						rp.setProperty(fieldName, Ext.encode(win.gridValue));
						// 点击确定后直接保存
						Ext.getCmp('saveRightProperties').handler();
					}
					else
						rp.setProperty(fieldName, '点此编辑');
					win.close();
				}
			}, {
				text : '取消',
				handler : function() {
					win.close();
				}
			}];

	function win_gridEdit(g) {
		function win_Value_btn() {
			record.data.value = win_Value_form.getValues().propertyValue;
			win_grid_store.removeAt(index);
			win_grid_store.insert(index, record)
			win_Value.close();
		}

		function win_buttons_msg(type) {
			if ('yes' == type) {
				var msls = getCmp('map_kString_vListString').gridValue;
				var mslsStore = getCmp('msls').store;
				for (var i = 0; i < mslsStore.getCount(); i++) {
					if (g == mslsStore.getAt(i).data.key) {
						mslsStore.removeAt(i);
						delete msls[g];
					}
				}
				win.close();
			}
		}
		var win_buttons = [{
			text : '确定',
			handler : function() {
				var count = win_grid_store.getCount();
				if (count != 0) {
					for (var i = 0; i < count; i++) {
						if ('' == win_grid_store.getAt(i).data.value) {
							alert('数据中有空值!');
							return;
						}
					}
					var msls = getCmp('map_kString_vListString').gridValue;
					msls[g] = storeToObj(win_grid_store);
					win.close();
				} else {
					Ext.Msg.show({
								title : '删除',
								msg : '你删除了[' + g + ']下面的所有数据，点击确定后[' + g
										+ ']将会被删除!',
								buttons : Ext.Msg.YESNO,
								fn : function(type) {
									win_buttons_msg(type);
								}
							})
				}
			}
		}, {
			text : '取消',
			handler : function() {
				win.close();
			}
		}];

		function win_gridEdit(record, index) {
			function win_Value_btn() {
				record.data.value = win_Value_form.getValues().propertyValue;
				win_grid_store.removeAt(index);
				win_grid_store.insert(index, record)
				win_Value.close();
			}
			var win_Value_form = Ext.create('Ext.form.Panel', {
						border : 0,
						items : [{
									xtype : 'textarea',
									name : 'propertyValue',
									width : 788,
									height : 382,
									value : record.data.value
								}]
					});
			var win_Value = Ext.create('Ext.Window', {
						title : '值',
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

		var win_grid_CheckboxModel = Ext.create('Ext.selection.CheckboxModel',
				{
					mode : 'SINGLE',
					listeners : {
						select : function(m, record, index) {
							win_grid._record = record;
							win_grid._index = index;
						}
					}
				});
		var vj = [];
		var v = getCmp('map_kString_vListString').gridValue[g];
		if (v != null && [] != v) {
			vj = v;
		}
		var win_grid_store = Ext.create('Ext.data.Store', {
					model : 'Value',
					data : vj,
					autoLoad : false
				});
		var win_grid_item = [{
					text : '新增',
					icon : 'images/add.png',
					scale : 'small',
					width : 50,
					handler : function() {
						var r = Ext.ModelManager.create({
									value : ''
								}, 'Value');
						win_grid_store.insert(win_grid_store.getCount(), r);
						var row = win_grid_store.getCount() - 1;
						win_grid_pluginCellEdit.startEditByPosition({
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
							win_grid_item_btnDelHandler();
						}
					}
				}, {
					text : '编辑值',
					scale : 'small',
					icon : 'images/xiugai.png',
					width : 80,
					handler : function() {
						var record = win_grid._record, index;
						if (record != null) {
							index = win_grid._index;
							win_gridEdit(record, index);
						}
					}
				}];

		var gridIndex;

		function win_grid_item_btnDelHandler() {
			Ext.Msg.show({
						title : '删除',
						msg : win_grid_store.getAt(gridIndex).data.value,
						buttons : Ext.Msg.YESNO,
						fn : function(type) {
							if ('yes' == type) {
								win_grid_store.removeAt(gridIndex);
								gridIndex = undefined;
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

		var win_grid_pluginCellEdit = Ext.create('Ext.grid.plugin.CellEditing',
				{
					clicksToEdit : 1,
					listeners : {
						beforeedit : function(record) {
							gridIndex = record.rowIdx;
						}
					}
				});

		var win_grid = Ext.create('Ext.grid.Panel', {
					autoScroll : true,
					firstCheck : true,
					selModel : win_grid_CheckboxModel,
					store : win_grid_store,
					tbar : {
						items : win_grid_item
					},
					columns : [{
								header : '值',
								dataIndex : 'value',
								flex : 78,
								field : 'textfield'
							}],
					plugins : [win_grid_pluginCellEdit],
					height : 386 * bokedee_height
				});

		var win = Ext.create('Ext.Window', {
					title : g,
					width : 800 * bokedee_width,
					height : 450 * bokedee_height,
					draggable : false,
					autoScroll : true,
					resizable : false,
					modal : true,
					buttons : win_buttons,
					items : [win_grid]
				});

		win.show();
	}

	var win_grid_CheckboxModel = Ext.create('Ext.selection.CheckboxModel', {
				mode : 'SINGLE',
				listeners : {
					select : function(m, record, index) {
						win_grid._record = record;
						win_grid._index = index;
					},
					beforedeselect : function(m, record, index) {
						var k = record.data.key;
						var count = win_grid_store.getCount();
						for (var i = 0; i < count; i++) {
							if (k == win_grid_store.getAt(i).data.key) {
								if (index != i) {
									alert('键不可以相同：[' + k + ']');
									return false;
								}
							}
						}
					}
				}
			});
	var vj = [];
	var gridValue = Object();
	var v = getCmp('right_propertyGrid').getSource()[fieldName];
	if (v != null && v != '点此编辑' && v != '') {
		v = Ext.decode(v);
		gridValue = v;
		var x = 0;
		for (var i in v) {
			vj[x] = Object();
			vj[x].key = i;
			vj[x].value = 'Value';
			x++;
		}
	}
	var win_grid_store = Ext.create('Ext.data.Store', {
				model : 'KeyValue',
				data : vj,
				autoLoad : false
			});
	var win_grid_item = [{
				text : '新增',
				icon : 'images/add.png',
				scale : 'small',
				width : 50,
				handler : function() {
					var count = win_grid_store.getCount();
					for (var i = 0; i < count; i++) {
						if ('键' == win_grid_store.getAt(i).data.key) {
							alert('键不可以是用默认值[Key],添加前请更改键的值');
							return;
						}
					}
					var r = Ext.ModelManager.create({
								key : '',
								value : '点此编辑'
							}, 'KeyValue');
					win_grid_store.insert(win_grid_store.getCount(), r);
					var row = win_grid_store.getCount() - 1;
					win_grid_pluginCellEdit.startEditByPosition({
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
						win_grid_item_btnDelHandler();
					}
				}
			}, {
				text : '编辑值',
				scale : 'small',
				icon : 'images/xiugai.png',
				width : 80,
				handler : function() {
					var record = win_grid._record, index;
					if (record != null) {
						index = win_grid._index;
						if (!validatemslsIsTheSameOrIsNull(win_grid_store)) {
							win_gridEdit(record.data.key);
						}
					}
				}
			}];

	var gridIndex;

	function win_grid_item_btnDelHandler() {
		Ext.Msg.show({
					title : '删除',
					msg : win_grid_store.getAt(gridIndex).data.key,
					buttons : Ext.Msg.YESNO,
					fn : function(type) {
						if ('yes' == type) {
							var k = win_grid_store.getAt(gridIndex).data.key;
							delete win.gridValue[k];
							win_grid_store.removeAt(gridIndex);
							gridIndex = undefined;
						}
					}
				})
	}

	var win_grid_pluginCellEdit = Ext.create('Ext.grid.plugin.CellEditing', {
				clicksToEdit : 1,
				listeners : {
					beforeedit : function(record) {
						gridIndex = record.rowIdx;
					}
				}
			});

	var win_grid = Ext.create('Ext.grid.Panel', {
		autoScroll : true,
		firstCheck : true,
		id : 'msls',
		selModel : win_grid_CheckboxModel,
		store : win_grid_store,
		tbar : {
			items : win_grid_item
		},
		columns : [{
					header : '键',
					dataIndex : 'key',
					flex : 22,
					field : 'textfield',
					listeners : {
						click : function(view, record) {
							var xx = 'sss';
						},
						change : function(a, b, c, d) {
							alert(a);

						}
					}
				}, {
					header : '值',
					dataIndex : 'value',
					flex : 78,
					field : 'textfield',
					readOnly : true,
					listeners : {
						click : function(a, b, c, d) {
							if (!validatemslsIsTheSameOrIsNull(win_grid_store)) {
								win_gridEdit(win_grid_store.getAt(c).data.key);
							} else {
								return false;
							}
						}
					}
				}],
		plugins : [win_grid_pluginCellEdit],
		height : 386
	});

	var win = Ext.create('Ext.Window', {
				title : label,
				id : 'map_kString_vListString',
				width : 800 * bokedee_width,
				height : 450 * bokedee_height,
				gridValue : gridValue,
				draggable : false,
				autoScroll : true,
				resizable : false,
				modal : true,
				buttons : win_buttons,
				items : [win_grid]
			});

	win.show();
}

/**
 * 复杂属性的Map<String,String>
 */
function map_kString_vString(fieldName, label) {

	var win_buttons = [{
				text : '确定',
				handler : function() {
					if (validatemssIsTheSameOrIsNull(win_grid_store)) {
						return false;
					}
					var rp = getCmp('right_propertyGrid');
					if (win_grid_store.getCount() != 0) {
						rp.setProperty(fieldName, storeToJSON(win_grid_store));
						// 点击确定按钮直接保存
						Ext.getCmp('saveRightProperties').handler();
					} else {
						rp.setProperty(fieldName, '点此编辑');
					}
					win.close();
				}
			}, {
				text : '取消',
				handler : function() {
					win.close();
				}
			}];

	function win_gridEdit(record, index) {
		function win_Value_btn() {
			record.data.value = win_Value_form.getValues().propertyValue;
			win_grid_store.removeAt(index);
			win_grid_store.insert(index, record)
			win_Value.close();
		}
		var win_Value_form = Ext.create('Ext.form.Panel', {
					border : 0,
					items : [{
								xtype : 'textarea',
								name : 'propertyValue',
								width : 788,
								height : 382,
								value : record.data.value
							}]
				});
		var win_Value = Ext.create('Ext.Window', {
					title : record.data.key,
					width : 800 * bokedee_width,
					height : 450 * bokedee_height,
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
	if (v != null && v != '点此编辑' && '' != v)
		vj = Ext.decode(v);
	var win_grid_store = Ext.create('Ext.data.Store', {
				model : 'KeyValue',
				data : vj,
				autoLoad : false
			});
	var win_grid_item = [{
				text : '新增',
				icon : 'images/add.png',
				scale : 'small',
				width : 50,
				handler : function() {
					var r = Ext.ModelManager.create({
								key : '',
								value : ''
							}, 'KeyValue');
					win_grid_store.insert(win_grid_store.getCount(), r);
					var row = win_grid_store.getCount() - 1;
					win_grid_pluginCellEdit.startEditByPosition({
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
						win_grid_item_btnDelHandler();
					}
				}
			}, {
				text : '编辑值',
				scale : 'small',
				icon : 'images/xiugai.png',
				width : 80,
				handler : function() {
					var record = win_grid._record, index;
					if (record != null) {
						index = win_grid._index;
						win_gridEdit(record, index);
					}
				}
			}];

	var gridIndex;

	function win_grid_item_btnDelHandler() {
		Ext.Msg.show({
					title : '删除',
					msg : win_grid_store.getAt(gridIndex).data.key,
					buttons : Ext.Msg.YESNO,
					fn : function(type) {
						if ('yes' == type) {
							win_grid_store.removeAt(gridIndex);
							gridIndex = undefined;
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

	var win_grid_pluginCellEdit = Ext.create('Ext.grid.plugin.CellEditing', {
				clicksToEdit : 1,
				listeners : {
					beforeedit : function(record) {
						gridIndex = record.rowIdx;
					}
				}
			});

	var win_grid = Ext.create('Ext.grid.Panel', {
				autoScroll : true,
				firstCheck : true,
				selModel : win_grid_CheckboxModel,
				store : win_grid_store,
				tbar : {
					items : win_grid_item
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
							field : 'textfield'
						}],
				plugins : [win_grid_pluginCellEdit],
				height : 386 * bokedee_height
			});

	var win = Ext.create('Ext.Window', {
				title : label,
				width : 800 * bokedee_width,
				height : 450 * bokedee_height,
				draggable : false,
				autoScroll : true,
				resizable : false,
				modal : true,
				buttons : win_buttons,
				items : [win_grid]
			});

	win.show();
}

/**
 * 复杂属性的List<String>
 */
function listString(fieldName, label) {

	var win_buttons = [{
				text : '确定',
				handler : function() {
					if (validatelsIsTheSameOrIsNull(win_grid_store)) {
						return false;
					}
					var rp = getCmp('right_propertyGrid');
					if (win_grid_store.getCount() == 0)
						rp.setProperty(fieldName, '点此编辑');
					else {
						rp.setProperty(fieldName, storeToJSON(win_grid_store));
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
			}];

	function win_gridEdit(record, index) {
		function win_Value_btn() {
			record.data.value = win_Value_form.getValues().propertyValue;
			win_grid_store.removeAt(index);
			win_grid_store.insert(index, record)
			win_Value.close();
		}
		var win_Value_form = Ext.create('Ext.form.Panel', {
					border : 0,
					items : [{
								xtype : 'textarea',
								name : 'propertyValue',
								width : 788,
								height : 382,
								value : record.data.value
							}]
				});
		var win_Value = Ext.create('Ext.Window', {
					title : record.data.key,
					width : 800 * bokedee_width,
					height : 450 * bokedee_height,
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
	if (v != null && v != '点此编辑' && '' != v)
		vj = Ext.decode(v);
	var win_grid_store = Ext.create('Ext.data.Store', {
				model : 'Value',
				data : vj,
				autoLoad : false
			});
	var win_grid_item = [{
				text : '新增',
				icon : 'images/add.png',
				scale : 'small',
				width : 50,
				handler : function() {
					var r = Ext.ModelManager.create({
								value : ''
							}, 'Value');
					win_grid_store.insert(win_grid_store.getCount(), r);
					var row = win_grid_store.getCount() - 1;
					win_grid_pluginCellEdit.startEditByPosition({
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
						win_grid_item_btnDelHandler();
					}
				}
			}, {
				text : '编辑值',
				scale : 'small',
				icon : 'images/xiugai.png',
				width : 80,
				handler : function() {
					var record = win_grid._record, index;
					if (record != null) {
						index = win_grid._index;
						win_gridEdit(record, index);
					}
				}
			}];

	var gridIndex;

	function win_grid_item_btnDelHandler() {
		Ext.Msg.show({
					title : '删除',
					msg : win_grid_store.getAt(gridIndex).data.value,
					buttons : Ext.Msg.YESNO,
					fn : function(type) {
						if ('yes' == type) {
							win_grid_store.removeAt(gridIndex);
							gridIndex = undefined;
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

	var win_grid_pluginCellEdit = Ext.create('Ext.grid.plugin.CellEditing', {
				clicksToEdit : 1,
				listeners : {
					beforeedit : function(record) {
						gridIndex = record.rowIdx;
					}
				}
			});

	var win_grid = Ext.create('Ext.grid.Panel', {
				autoScroll : true,
				firstCheck : true,
				selModel : win_grid_CheckboxModel,
				store : win_grid_store,
				tbar : {
					items : win_grid_item
				},
				columns : [{
							header : '值',
							dataIndex : 'value',
							flex : 78,
							field : 'textfield'
						}],
				plugins : [win_grid_pluginCellEdit],
				height : 386 * bokedee_height
			});

	var win = Ext.create('Ext.Window', {
				title : label,
				width : 800 * bokedee_width,
				height : 450 * bokedee_height,
				draggable : false,
				autoScroll : true,
				resizable : false,
				modal : true,
				buttons : win_buttons,
				items : [win_grid]
			});

	win.show();
}

/**
 * 复杂属性的Map<String,List<String>>
 */
function map_kString_vListTextarea(fieldName, label) {

	var win_buttons = [{
				text : '确定',
				handler : function() {
					if (validatemslsIsTheSameOrIsNull(win_grid_store)) {
						return false;
					}
					var rp = getCmp('right_propertyGrid');
					var count = win_grid_store.getCount();
					for (var i = 0; i < count; i++) {
						if (!win.gridValue[win_grid_store.getAt(i).data.key]) {
							alert('[' + win_grid_store.getAt(i).data.key
									+ ']尚未赋值');
							return;
						}
					}
					var temp = false;
					for (var i in win.gridValue) {
						temp = true;
					}
					if (temp == true) {
						rp.setProperty(fieldName, Ext.encode(win.gridValue));
						// 点击确定按钮直接保存
						Ext.getCmp('saveRightProperties').handler();
					}
					else
						rp.setProperty(fieldName, '点此编辑');
					win.close();
				}
			}, {
				text : '取消',
				handler : function() {
					win.close();
				}
			}];

	function win_gridEdit(g) {
		function win_Value_btn() {
			record.data.value = win_Value_form.getValues().propertyValue;
			win_grid_store.removeAt(index);
			win_grid_store.insert(index, record)
			win_Value.close();
		}

		function win_buttons_msg(type) {
			if ('yes' == type) {
				var msls = getCmp('map_kString_vListString').gridValue;
				var mslsStore = getCmp('msls').store;
				for (var i = 0; i < mslsStore.getCount(); i++) {
					if (g == mslsStore.getAt(i).data.key) {
						mslsStore.removeAt(i);
						delete msls[g];
					}
				}
				win.close();
			}
		}
		var win_buttons = [{
			text : '确定',
			handler : function() {
				var count = win_grid_store.getCount();
				if (count != 0) {
					for (var i = 0; i < count; i++) {
						if ('' == win_grid_store.getAt(i).data.value) {
							alert('数据中有空值!');
							return;
						}
					}
					var msls = getCmp('map_kString_vListString').gridValue;
					msls[g] = storeToObj(win_grid_store);
					win.close();
				} else {
					Ext.Msg.show({
								title : '删除',
								msg : '你删除了[' + g + ']下面的所有数据，点击确定后[' + g
										+ ']将会被删除!',
								buttons : Ext.Msg.YESNO,
								fn : function(type) {
									win_buttons_msg(type);
								}
							})
				}
			}
		}, {
			text : '取消',
			handler : function() {
				win.close();
			}
		}];

		function win_gridEdit(record, index) {
			function win_Value_btn() {
				record.data.value = win_Value_form.getValues().propertyValue;
				win_grid_store.removeAt(index);
				win_grid_store.insert(index, record)
				win_Value.close();
			}
			var win_Value_form = Ext.create('Ext.form.Panel', {
						border : 0,
						items : [{
									xtype : 'textarea',
									name : 'propertyValue',
									width : 788,
									height : 382,
									value : record.data.value
								}]
					});
			var win_Value = Ext.create('Ext.Window', {
						title : '值',
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

		var win_grid_CheckboxModel = Ext.create('Ext.selection.CheckboxModel',
				{
					mode : 'SINGLE',
					listeners : {
						select : function(m, record, index) {
							win_grid._record = record;
							win_grid._index = index;
						}
					}
				});
		var vj = [];
		var v = getCmp('map_kString_vListString').gridValue[g];
		if (v != null && [] != v) {
			vj = v;
		}
		var win_grid_store = Ext.create('Ext.data.Store', {
					model : 'Value',
					data : vj,
					autoLoad : false
				});
		var win_grid_item = [{
					text : '新增',
					icon : 'images/add.png',
					scale : 'small',
					width : 50,
					handler : function() {
						var r = Ext.ModelManager.create({
									value : ''
								}, 'Value');
						win_grid_store.insert(win_grid_store.getCount(), r);
						var row = win_grid_store.getCount() - 1;
						win_grid_pluginCellEdit.startEditByPosition({
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
							win_grid_item_btnDelHandler();
						}
					}
				}, {
					text : '编辑值',
					scale : 'small',
					icon : 'images/xiugai.png',
					width : 80,
					handler : function() {
						var record = win_grid._record, index;
						if (record != null) {
							index = win_grid._index;
							win_gridEdit(record, index);
						}
					}
				}];

		var gridIndex;

		function win_grid_item_btnDelHandler() {
			Ext.Msg.show({
						title : '删除',
						msg : win_grid_store.getAt(gridIndex).data.value,
						buttons : Ext.Msg.YESNO,
						fn : function(type) {
							if ('yes' == type) {
								win_grid_store.removeAt(gridIndex);
								gridIndex = undefined;
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

		var win_grid_pluginCellEdit = Ext.create('Ext.grid.plugin.CellEditing',
				{
					clicksToEdit : 1,
					listeners : {
						beforeedit : function(record) {
							gridIndex = record.rowIdx;
						}
					}
				});

		var win_grid = Ext.create('Ext.grid.Panel', {
					autoScroll : true,
					firstCheck : true,
					selModel : win_grid_CheckboxModel,
					store : win_grid_store,
					tbar : {
						items : win_grid_item
					},
					columns : [{
								header : '值',
								dataIndex : 'value',
								flex : 78,
								field : 'textarea'
							}],
					plugins : [win_grid_pluginCellEdit],
					height : 386 * bokedee_height
				});

		var win = Ext.create('Ext.Window', {
					title : g,
					width : 800 * bokedee_width,
					height : 450 * bokedee_height,
					draggable : false,
					autoScroll : true,
					resizable : false,
					modal : true,
					buttons : win_buttons,
					items : [win_grid]
				});

		win.show();
	}

	var win_grid_CheckboxModel = Ext.create('Ext.selection.CheckboxModel', {
				mode : 'SINGLE',
				listeners : {
					select : function(m, record, index) {
						win_grid._record = record;
						win_grid._index = index;
					},
					beforedeselect : function(m, record, index) {
						var k = record.data.key;
						var count = win_grid_store.getCount();
						for (var i = 0; i < count; i++) {
							if (k == win_grid_store.getAt(i).data.key) {
								if (index != i) {
									alert('键不可以相同：[' + k + ']');
									return false;
								}
							}
						}
					}
				}
			});
	var vj = [];
	var gridValue = Object();
	var v = getCmp('right_propertyGrid').getSource()[fieldName];
	if (v != null && v != '点此编辑' && v != '') {
		v = Ext.decode(v);
		gridValue = v;
		var x = 0;
		for (var i in v) {
			vj[x] = Object();
			vj[x].key = i;
			vj[x].value = 'Value';
			x++;
		}
	}
	var win_grid_store = Ext.create('Ext.data.Store', {
				model : 'KeyValue',
				data : vj,
				autoLoad : false
			});
	var win_grid_item = [{
				text : '新增',
				icon : 'images/add.png',
				scale : 'small',
				width : 50,
				handler : function() {
					var count = win_grid_store.getCount();
					for (var i = 0; i < count; i++) {
						if ('键' == win_grid_store.getAt(i).data.key) {
							alert('键不可以是用默认值[Key],添加前请更改键的值');
							return;
						}
					}
					var r = Ext.ModelManager.create({
								key : '',
								value : '点此编辑'
							}, 'KeyValue');
					win_grid_store.insert(win_grid_store.getCount(), r);
					var row = win_grid_store.getCount() - 1;
					win_grid_pluginCellEdit.startEditByPosition({
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
						win_grid_item_btnDelHandler();
					}
				}
			}, {
				text : '编辑值',
				scale : 'small',
				icon : 'images/xiugai.png',
				width : 80,
				handler : function() {
					var record = win_grid._record, index;
					if (record != null) {
						index = win_grid._index;
						if (!validatemslsIsTheSameOrIsNull(win_grid_store)) {
							win_gridEdit(record.data.key);
						}
					}
				}
			}];

	var gridIndex;

	function win_grid_item_btnDelHandler() {
		Ext.Msg.show({
					title : '删除',
					msg : win_grid_store.getAt(gridIndex).data.key,
					buttons : Ext.Msg.YESNO,
					fn : function(type) {
						if ('yes' == type) {
							var k = win_grid_store.getAt(gridIndex).data.key;
							delete win.gridValue[k];
							win_grid_store.removeAt(gridIndex);
							gridIndex = undefined;
						}
					}
				})
	}

	var win_grid_pluginCellEdit = Ext.create('Ext.grid.plugin.CellEditing', {
				clicksToEdit : 1,
				listeners : {
					beforeedit : function(record) {
						gridIndex = record.rowIdx;
					}
				}
			});

	var win_grid = Ext.create('Ext.grid.Panel', {
		autoScroll : true,
		firstCheck : true,
		id : 'msls',
		selModel : win_grid_CheckboxModel,
		store : win_grid_store,
		tbar : {
			items : win_grid_item
		},
		columns : [{
					header : '键',
					dataIndex : 'key',
					flex : 22,
					field : 'textfield',
					listeners : {
						click : function(view, record) {
							var xx = 'sss';
						},
						change : function(a, b, c, d) {
							alert(a);

						}
					}
				}, {
					header : '值',
					dataIndex : 'value',
					flex : 78,
					field : 'textarea',
					readOnly : true,
					listeners : {
						click : function(a, b, c, d) {
							if (!validatemslsIsTheSameOrIsNull(win_grid_store)) {
								win_gridEdit(win_grid_store.getAt(c).data.key);
							} else {
								return false;
							}
						}
					}
				}],
		plugins : [win_grid_pluginCellEdit],
		height : 386 * bokedee_height
	});

	var win = Ext.create('Ext.Window', {
				title : label,
				id : 'map_kString_vListString',
				width : 800 * bokedee_width,
				height : 450 * bokedee_height,
				gridValue : gridValue,
				draggable : false,
				autoScroll : true,
				resizable : false,
				modal : true,
				buttons : win_buttons,
				items : [win_grid]
			});

	win.show();
}

/**
 * 复杂属性的Map<String,String>
 */
function map_kString_vTextarea(fieldName, label) {

	var win_buttons = [{
				text : '确定',
				handler : function() {
					if (validatemssIsTheSameOrIsNull(win_grid_store)) {
						return false;
					}
					var rp = getCmp('right_propertyGrid');
					if (win_grid_store.getCount() != 0) {
						rp.setProperty(fieldName, storeToJSON(win_grid_store));
						// 点击确定按钮直接保存
						Ext.getCmp('saveRightProperties').handler();
					} else {
						rp.setProperty(fieldName, '点此编辑');
					}
					win.close();
				}
			}, {
				text : '取消',
				handler : function() {
					win.close();
				}
			}];

	function win_gridEdit(record, index) {
		function win_Value_btn() {
			record.data.value = win_Value_form.getValues().propertyValue;
			win_grid_store.removeAt(index);
			win_grid_store.insert(index, record)
			win_Value.close();
		}
		var win_Value_form = Ext.create('Ext.form.Panel', {
					border : 0,
					items : [{
								xtype : 'textarea',
								name : 'propertyValue',
								width : 788,
								height : 382,
								value : record.data.value
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
	if (v != null && v != '点此编辑' && '' != v)
		vj = Ext.decode(v);
	var win_grid_store = Ext.create('Ext.data.Store', {
				model : 'KeyValue',
				data : vj,
				autoLoad : false
			});
	var win_grid_item = [{
				text : '新增',
				icon : 'images/add.png',
				scale : 'small',
				width : 50,
				handler : function() {
					var r = Ext.ModelManager.create({
								key : '',
								value : ''
							}, 'KeyValue');
					win_grid_store.insert(win_grid_store.getCount(), r);
					var row = win_grid_store.getCount() - 1;
					win_grid_pluginCellEdit.startEditByPosition({
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
						win_grid_item_btnDelHandler();
					}
				}
			}, {
				text : '编辑值',
				scale : 'small',
				icon : 'images/xiugai.png',
				width : 80,
				handler : function() {
					var record = win_grid._record, index;
					if (record != null) {
						index = win_grid._index;
						win_gridEdit(record, index);
					}
				}
			}];

	var gridIndex;

	function win_grid_item_btnDelHandler() {
		Ext.Msg.show({
					title : '删除',
					msg : win_grid_store.getAt(gridIndex).data.key,
					buttons : Ext.Msg.YESNO,
					fn : function(type) {
						if ('yes' == type) {
							win_grid_store.removeAt(gridIndex);
							gridIndex = undefined;
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

	var win_grid_pluginCellEdit = Ext.create('Ext.grid.plugin.CellEditing', {
				clicksToEdit : 1,
				listeners : {
					beforeedit : function(record) {
						gridIndex = record.rowIdx;
					}
				}
			});

	var win_grid = Ext.create('Ext.grid.Panel', {
				autoScroll : true,
				firstCheck : true,
				selModel : win_grid_CheckboxModel,
				store : win_grid_store,
				tbar : {
					items : win_grid_item
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
				plugins : [win_grid_pluginCellEdit],
				height : 386 * bokedee_height
			});

	var win = Ext.create('Ext.Window', {
				title : label,
				width : 800 * bokedee_width,
				height : 450 * bokedee_height,
				draggable : false,
				autoScroll : true,
				resizable : false,
				modal : true,
				buttons : win_buttons,
				items : [win_grid]
			});

	win.show();
}

/**
 * 复杂属性的List<String>
 */
function listTextarea(fieldName, label) {

	var win_buttons = [{
				text : '确定',
				handler : function() {
					if (validatelsIsTheSameOrIsNull(win_grid_store)) {
						return false;
					}
					var rp = getCmp('right_propertyGrid');
					if (win_grid_store.getCount() == 0)
						rp.setProperty(fieldName, '点此编辑');
					else {
						rp.setProperty(fieldName, storeToJSON(win_grid_store));
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
			}];

	function win_gridEdit(record, index) {
		function win_Value_btn() {
			record.data.value = win_Value_form.getValues().propertyValue;
			win_grid_store.removeAt(index);
			win_grid_store.insert(index, record)
			win_Value.close();
		}
		var win_Value_form = Ext.create('Ext.form.Panel', {
					border : 0,
					items : [{
								xtype : 'textarea',
								name : 'propertyValue',
								width : 788,
								height : 382,
								value : record.data.value
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
	if (v != null && v != '点此编辑' && '' != v)
		vj = Ext.decode(v);
	var win_grid_store = Ext.create('Ext.data.Store', {
				model : 'Value',
				data : vj,
				autoLoad : false
			});
	var win_grid_item = [{
				text : '新增',
				icon : 'images/add.png',
				scale : 'small',
				width : 50,
				handler : function() {
					var r = Ext.ModelManager.create({
								value : ''
							}, 'Value');
					win_grid_store.insert(win_grid_store.getCount(), r);
					var row = win_grid_store.getCount() - 1;
					win_grid_pluginCellEdit.startEditByPosition({
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
						win_grid_item_btnDelHandler();
					}
				}
			}, {
				text : '编辑值',
				scale : 'small',
				icon : 'images/xiugai.png',
				width : 80,
				handler : function() {
					var record = win_grid._record, index;
					if (record != null) {
						index = win_grid._index;
						win_gridEdit(record, index);
					}
				}
			}];

	var gridIndex;

	function win_grid_item_btnDelHandler() {
		Ext.Msg.show({
					title : '删除',
					msg : win_grid_store.getAt(gridIndex).data.value,
					buttons : Ext.Msg.YESNO,
					fn : function(type) {
						if ('yes' == type) {
							win_grid_store.removeAt(gridIndex);
							gridIndex = undefined;
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

	var win_grid_pluginCellEdit = Ext.create('Ext.grid.plugin.CellEditing', {
				clicksToEdit : 1,
				listeners : {
					beforeedit : function(record) {
						gridIndex = record.rowIdx;
					}
				}
			});

	var win_grid = Ext.create('Ext.grid.Panel', {
				autoScroll : true,
				firstCheck : true,
				selModel : win_grid_CheckboxModel,
				store : win_grid_store,
				tbar : {
					items : win_grid_item
				},
				columns : [{
							header : '值',
							dataIndex : 'value',
							flex : 78,
							field : 'textarea'
						}],
				plugins : [win_grid_pluginCellEdit],
				height : 386 * bokedee_height
			});

	var win = Ext.create('Ext.Window', {
				title : label,
				width : 800 * bokedee_width,
				height : 450 * bokedee_height,
				draggable : false,
				autoScroll : true,
				resizable : false,
				modal : true,
				buttons : win_buttons,
				items : [win_grid]
			});

	win.show();
}

/**
 * 右边面板的文本区域
 */
function bigString(fieldName, label) {

	var win_buttons = [{
		text : '确定',
		handler : function() {
			if (win_form.getValues().bigString.trim() == '') {
				getCmp('right_propertyGrid').setProperty(fieldName, '点此编辑');
			} else {
				getCmp('right_propertyGrid').setProperty(fieldName,
						win_form.getValues().bigString);
				// 点击确定按钮直接保存
				Ext.getCmp('saveRightProperties').handler();
			}
			win.close();
		}
	}, {
		text : '取消',
		handler : function() {
			getCmp('right_propertyGrid').setProperty(fieldName, win.oldValue);
			if (win_form.getValues().bigString.trim() == '') {
				getCmp('right_propertyGrid').setProperty(fieldName, '点此编辑');
			}
			win.close();
		}
	}];

	var win_form = Ext.create('Ext.form.Panel', {
				width : '100%',
				height : '100%',
				bodyPadding : 0,
				autoScroll : true,
				resizable : false,
				draggable : false,
				margins : '0 0 0 0',
				border : 0,
				method : 'post',
				layout : 'anchor',
				defaults : {
					anchor : '100%'
				},
				defaultType : 'textfield',
				items : [Ext.create('Ext.form.Panel', {
							border : 0,
							items : [{
										xtype : 'textarea',
										name : 'bigString',
										width : 788,
										height : 382
									}]
						})]
			});

	var win = Ext.create('Ext.Window', {
				title : label,
				width : 800 * bokedee_width,
				height : 450 * bokedee_height,
				draggable : false,
				autoScroll : true,
				resizable : false,
				modal : true,
				buttons : win_buttons,
				items : [win_form]
			});

	var v = getCmp('right_propertyGrid').getSource()[fieldName];
	if (v != null && v != '点此编辑' && '' != v) {
		win_form.getForm().setValues({
					bigString : v
				});
		win.oldValue = v;
	}
	win.show();
}

function bigStringSmooks(fieldName, label) {

	var smooksCsvConfig;

	var win_buttons = [{
				text : '格式化',
				handler : function() {
					changeToLogin();
					var url = 'interfaceInfoFindController.do?actionType=formatString';
					if (win_form.getValues().bigString.trim() != '') {
						changeToLogin();
						Ext.Ajax.request({
									url : url,
									params : {
										type : 'xml',
										text : win_form.getValues().bigString
									},
									success : function(response) {
										win_form.getForm().setValues({
													bigString : response.responseText
												});
									}

								});
					}
				}
			}, {
				text : '确定',
				handler : function() {
					if (win_form.getValues().bigString.trim() == '') {
						getCmp('right_propertyGrid').setProperty(fieldName,
								'点此编辑');
					} else {
						getCmp('right_propertyGrid').setProperty(fieldName,
								win_form.getValues().bigString);
						// 点击确定按钮直接保存
						Ext.getCmp('saveRightProperties').handler();
					}
					win.close();
				}
			}, {
				text : '取消',
				handler : function() {
					getCmp('right_propertyGrid').setProperty(fieldName,
							win.oldValue);
					win.close();
				}
			}];
	var win_form = Ext.create('Ext.form.Panel', {
				width : '100%',
				height : 254,
				bodyPadding : 0,
				autoScroll : true,
				border : 0,
				method : 'post',
				layout : 'anchor',
				defaults : {
					anchor : '100%'
				},
				items : [{
							xtype : 'textarea',
							name : 'bigString',
							width : '100%',
							height : 249
						}]
			});

	var textAreaXMLData = '<textarea wrap="off" style="width:524px;height:210px;"id="XMLData"  readonly="readonly"></textarea>';
	var textAreaSmooksConfig = '<textarea wrap="off" style="width:524px;height:210px;" id="smooksConfig"  readonly="readonly"></textarea>';
	var textAreaSmooksCsvConfig = '<textarea wrap="off" style="width:524px;height:210px;" id="smooksCsvConfig"  readonly="readonly"></textarea>';

	var win = Ext.create('Ext.Window', {
		title : label,
		autoScroll : true,
		resizable : false,
		draggable : false,
		modal : true,
		width : 1100 * bokedee_width,
		height : 600 * bokedee_height,
		bodyPadding : 5,
		buttons : win_buttons,
		items : [{
			xtype : 'tabpanel',
			autoRender : true,
			items : [{
						title : 'XMlExample',
						layout : 'column',
						items : [Ext.create('Ext.form.Panel', {
											width : '50%',
											height : 240,
											title : 'XML数据',
											html : textAreaXMLData
										}), Ext.create('Ext.form.Panel', {
											width : '50%',
											height : 240,
											title : 'Smooks配置',
											html : textAreaSmooksConfig
										})]
					}, {
						title : 'CsvExample',
						layout : 'column',
						autoRender : true,
						listeners : {
							show : function(tab) {
								win_form.currentActive = tab;
								$('smooksCsvConfig').value = smooksCsvConfig;
							}
						},
						items : [Ext.create('Ext.grid.Panel', {
											width : '50%',
											height : 240,
											sortableColumns : false,
											columnLines : true,
											title : '用Excel打开的csv数据',
											border : 1,
											columns : [{
														header : '',
														dataIndex : 'rowId',
														flex : 1
													}, {
														header : 'A',
														dataIndex : 'A',
														flex : 2
													}, {
														header : 'B',
														dataIndex : 'B',
														flex : 2
													}, {
														header : 'C',
														dataIndex : 'C',
														flex : 2
													}, {
														header : 'D',
														dataIndex : 'D',
														flex : 2
													}],
											store : Ext.create(
													'Ext.data.Store', {
														model : 'ExcelExample',
														data : [{
																	rowId : 1,
																	A : '货主名称',
																	B : '货主编码',
																	C : '货主简称',
																	D : '所属组织机构编码'
																}, {
																	rowId : 2,
																	A : '上海博科资讯',
																	B : 'boke',
																	C : '博科',
																	D : 'DEFAULT_ORG'
																}, {
																	rowId : 3,
																	A : '上海移动',
																	B : 'move',
																	C : '移动',
																	D : 'DEFAULT_ORG'
																}]
													})
										}), Ext.create('Ext.form.Panel', {
											width : '50%',
											height : 240,
											title : 'Csv的Smooks配置',
											html : textAreaSmooksCsvConfig
										})]
					}]
		}, win_form]
	});

	var v = getCmp('right_propertyGrid').getSource()[fieldName];
	if (v != null && v != '点此编辑' && '' != v) {
		win_form.getForm().setValues({
					bigString : v
				});
		win.oldValue = v;
	}
	win.show();
	changeToLogin();
	Ext.Ajax.request({
				url : 'interfaceInfoFindController.do?actionType=findExample',
				params : {
					type : 'example_smooks.json'
				},
				success : function(response) {
					var result = Ext.decode(response.responseText);
					xx = result;
					$('XMLData').value = result.XMLData;
					$('smooksConfig').value = result.smooksConfig;
					smooksCsvConfig = result.smooksCsvConfig;
				}
			});
}

function bigStringExcel(fieldName, label) {

	changeToLogin();
	Ext.Ajax.request({
				url : 'interfaceInfoFindController.do?actionType=findExample',
				params : {
					type : 'example_excel.json'
				},
				success : function(response) {
					var result = Ext.decode(response.responseText);
					$('XlsConfig').value = result.workbook;
				}
			});

	var win_buttons = [{
				text : '格式化',
				handler : function() {
					var url = 'interfaceInfoFindController.do?actionType=formatString';
					if (win_form.getValues().bigString.trim() != '') {
						changeToLogin();
						Ext.Ajax.request({
									url : url,
									params : {
										type : 'xml',
										text : win_form.getValues().bigString
									},
									success : function(response) {
										win_form.getForm().setValues({
													bigString : response.responseText
												});
									}

								});
					}
				}
			}, {
				text : '确定',
				handler : function() {
					if (win_form.getValues().bigString.trim() == '') {
						getCmp('right_propertyGrid').setProperty(fieldName,
								'点此编辑');
					} else {
						getCmp('right_propertyGrid').setProperty(fieldName,
								win_form.getValues().bigString);
						// 点击确定按钮直接保存
						Ext.getCmp('saveRightProperties').handler();
					}
					win.close();
				}
			}, {
				text : '取消',
				handler : function() {
					getCmp('right_propertyGrid').setProperty(fieldName,
							win.oldValue);
					win.close();
				}
			}];
	var win_form = Ext.create('Ext.form.Panel', {
				width : '100%',
				height : 254,
				bodyPadding : 0,
				autoScroll : true,
				resizable : false,
				draggable : false,
				border : 0,
				method : 'post',
				layout : 'anchor',
				defaults : {
					anchor : '100%'
				},
				items : [{
							xtype : 'textarea',
							name : 'bigString',
							width : '100%',
							height : 249
						}]
			});

	var textAreaXlsConfig = '<textarea wrap="off" style="width:524px;height:210px;"id="XlsConfig"  readonly="readonly"></textarea>';

	var win = Ext.create('Ext.Window', {
		title : label,
		autoScroll : true,
		resizable : false,
		modal : true,
		width : 1100 * bokedee_width,
		height : 600 * bokedee_height,
		bodyPadding : 5,
		buttons : win_buttons,
		items : [{
					xtype : 'fieldset',
					title : 'Example',
					layout : 'column',
					items : [Ext.create('Ext.grid.Panel', {
										width : 527,
										height : 240,
										sortableColumns : false,
										columnLines : true,
										title : '仿Excel表格',
										border : 1,
										columns : [{
													header : '',
													dataIndex : 'rowId',
													flex : 1
												}, {
													header : 'A',
													dataIndex : 'A',
													flex : 2
												}, {
													header : 'B',
													dataIndex : 'B',
													flex : 2
												}, {
													header : 'C',
													dataIndex : 'C',
													flex : 2
												}, {
													header : 'D',
													dataIndex : 'D',
													flex : 2
												}],
										store : Ext.create('Ext.data.Store', {
													model : 'ExcelExample',
													data : [{
																rowId : 1,
																A : '货主名称',
																B : '货主编码',
																C : '货主简称',
																D : '所属组织机构编码'
															}, {
																rowId : 2,
																A : '上海博科资讯',
																B : 'boke',
																C : '博科',
																D : 'DEFAULT_ORG'
															}, {
																rowId : 3,
																A : '上海移动',
																B : 'move',
																C : '移动',
																D : 'DEFAULT_ORG'
															}]
												})
									}), Ext.create('Ext.form.Panel', {
										width : 527,
										height : 240,
										title : 'WorkBook配置',
										border : 1,
										html : textAreaXlsConfig
									})]
				}, win_form]
	});

	var v = getCmp('right_propertyGrid').getSource()[fieldName];
	if (v != null && v != '点此编辑' && '' != v) {
		win_form.getForm().setValues({
					bigString : v
				});
		win.oldValue = v;
	}
	win.show();
}

function bigStringFreemarker(fieldName, label) {
	changeToLogin();
	Ext.Ajax.request({
				url : 'interfaceInfoFindController.do?actionType=findExample',
				params : {
					type : 'example_freemarker.json'
				},
				success : function(response) {
					var result = Ext.decode(response.responseText);
					$('fmSource').value = result.fmSource;
					$('fmTemplate').value = result.fmTemplate;
					$('fmOutput').value = result.fmOutput;
				}
			});

	var win_buttons = [{
		text : '确定',
		handler : function() {
			if (win_form.getValues().bigString.trim() == '') {
				getCmp('right_propertyGrid').setProperty(fieldName, '点此编辑');
			} else {
				getCmp('right_propertyGrid').setProperty(fieldName,
						win_form.getValues().bigString);
				// 点击确定按钮直接保存
				Ext.getCmp('saveRightProperties').handler();
			}
			win.close();
		}
	}, {
		text : '取消',
		handler : function() {
			if (win.oldValue == '' || win.oldValue == undefined) {
				getCmp('right_propertyGrid').setProperty(fieldName, '点此编辑');
			} else {
				getCmp('right_propertyGrid').setProperty(fieldName,
						win.oldValue);
			}
			win.close();
		}
	}];
	var win_form = Ext.create('Ext.form.Panel', {
				width : '100%',
				height : 254,
				bodyPadding : 0,
				autoScroll : true,
				resizable : false,
				draggable : false,
				border : 0,
				method : 'post',
				layout : 'anchor',
				defaults : {
					anchor : '100%'
				},
				items : [{
							xtype : 'textarea',
							name : 'bigString',
							width : '100%',
							height : 249
						}]
			});

	var textAreaSource = '<textarea wrap="off" style="width:348px;height:210px;"id="fmSource"  readonly="readonly"></textarea>';
	var textAreaTemplate = '<textarea wrap="off" style="width:348px;height:210px;"id="fmTemplate"  readonly="readonly"></textarea>';
	var textAreaOutput = '<textarea wrap="off" style="width:348px;height:210px;"id="fmOutput"  readonly="readonly"></textarea>';

	var win = Ext.create('Ext.Window', {
				title : label,
				autoScroll : true,
				resizable : false,
				modal : true,
				width : 1100 * bokedee_width,
				height : 600 * bokedee_height,
				bodyPadding : 5,
				buttons : win_buttons,
				items : [{
							xtype : 'fieldset',
							title : 'Example',
							layout : 'column',
							items : [Ext.create('Ext.form.Panel', {
												width : 351,
												height : 240,
												title : '数据结构',
												border : 1,
												html : textAreaSource
											}), Ext.create('Ext.form.Panel', {
												width : 351,
												height : 240,
												title : 'Freemarker配置',
												border : 1,
												html : textAreaTemplate
											}), Ext.create('Ext.form.Panel', {
												width : 351,
												height : 240,
												title : '输出结果',
												border : 1,
												html : textAreaOutput
											})]
						}, win_form]
			});

	var v = getCmp('right_propertyGrid').getSource()[fieldName];
	if (v != null && v != '点此编辑' && '' != v) {
		win_form.getForm().setValues({
					bigString : v
				});
		win.oldValue = v;
	}
	win.show();
}

function bigStringScript(fieldName, label) {
	changeToLogin();
	Ext.Ajax.request({
				url : 'interfaceInfoFindController.do?actionType=findExample',
				params : {
					type : 'example_script.json'
				},
				success : function(response) {
					var result = Ext.decode(response.responseText);
					$('explains').value = result.explains;
				}
			});

	var win_buttons = [{
		text : '格式化',
		handler : function() {
			if (win_form.getValues().bigString.trim() == '') {

			} else {
				var formatedString = js_beautify(win_form.getValues().bigString);

				win_form.getForm().setValues({
							bigString : formatedString
						});
				// win.oldValue = formatedString;
				// win_form.getValues().bigString = formatedString;
			}
		}
	}, {
		text : '确定',
		handler : function() {
			if (win_form.getValues().bigString.trim() == '') {
				getCmp('right_propertyGrid').setProperty(fieldName, '点此编辑');
			} else {
				getCmp('right_propertyGrid').setProperty(fieldName,
						win_form.getValues().bigString);
				// 点击确定按钮直接保存
				Ext.getCmp('saveRightProperties').handler();
			}
			win.close();
		}
	}, {
		text : '取消',
		handler : function() {
			if (win.oldValue == '' || win.oldValue == undefined) {
				getCmp('right_propertyGrid').setProperty(fieldName, '点此编辑');
			} else {
				getCmp('right_propertyGrid').setProperty(fieldName,
						win.oldValue);
			}
			win.close();
		}
	}];
	var win_form = Ext.create('Ext.form.Panel', {
				width : '100%',
				height : 340,
				bodyPadding : 0,
				autoScroll : false,
				border : 0,
				method : 'post',
				layout : 'anchor',
				defaults : {
					anchor : '100%'
				},
				items : [{
							xtype : 'textarea',
							name : 'bigString',
							width : '100%',
							height : '100%'
						}]
			});

	var textAreaexplains = '<textarea wrap="off" style="width:1052px;height:120px;"id="explains"  readonly="readonly"></textarea>';

	var win = Ext.create('Ext.Window', {
				title : label,
				autoScroll : true,
				resizable : false,
				draggable : false,
				modal : true,
				width : 1100 * bokedee_width,
				height : 600 * bokedee_height,
				bodyPadding : 5,
				buttons : win_buttons,
				items : [{
							xtype : 'fieldset',
							title : 'Example',
							layout : 'column',
							items : [Ext.create('Ext.form.Panel', {
										width : 1055,
										height : 150,
										title : '示例',
										border : 1,
										html : textAreaexplains
									})]
						}, win_form]
			});

	var v = getCmp('right_propertyGrid').getSource()[fieldName];
	if (v != null && v != '点此编辑' && '' != v) {
		win_form.getForm().setValues({
					bigString : v
				});
		win.oldValue = v;
	}
	win.show();
}

function bigStringScriptWithDS(fieldName, label) {
	changeToLogin();
	Ext.Ajax.request({
				url : 'interfaceInfoFindController.do?actionType=findExample',
				params : {
					type : 'example_scriptWithDS.json'
				},
				success : function(response) {
					var result = Ext.decode(response.responseText);
					$('explains').value = result.explains;
				}
			});

	var win_buttons = [{
		text : '格式化',
		handler : function() {
			if (win_form.getValues().bigString.trim() == '') {

			} else {
				var formatedString = js_beautify(win_form.getValues().bigString);

				win_form.getForm().setValues({
							bigString : formatedString
						});
				// win.oldValue = formatedString;
				// win_form.getValues().bigString = formatedString;
			}
		}
	}, {
		text : '确定',
		handler : function() {
			if (win_form.getValues().bigString.trim() == '') {
				getCmp('right_propertyGrid').setProperty(fieldName, '点此编辑');
			} else {
				getCmp('right_propertyGrid').setProperty(fieldName,
						win_form.getValues().bigString);
				// 点击确定按钮直接保存
				Ext.getCmp('saveRightProperties').handler();
			}
			win.close();
		}
	}, {
		text : '取消',
		handler : function() {
			if (win.oldValue == '' || win.oldValue == undefined) {
				getCmp('right_propertyGrid').setProperty(fieldName, '点此编辑');
			} else {
				getCmp('right_propertyGrid').setProperty(fieldName,
						win.oldValue);
			}
			win.close();
		}
	}];
	var win_form = Ext.create('Ext.form.Panel', {
				width : '100%',
				height : 340,
				bodyPadding : 0,
				autoScroll : false,
				border : 0,
				method : 'post',
				layout : 'anchor',
				defaults : {
					anchor : '100%'
				},
				items : [{
							xtype : 'textarea',
							name : 'bigString',
							width : '100%',
							height : '100%'
						}]
			});

	var textAreaexplains = '<textarea wrap="off" style="width:1052px;height:120px;"id="explains"  readonly="readonly"></textarea>';

	var win = Ext.create('Ext.Window', {
				title : label,
				autoScroll : true,
				resizable : false,
				draggable : false,
				modal : true,
				width : 1100 * bokedee_width,
				height : 600 * bokedee_height,
				bodyPadding : 5,
				buttons : win_buttons,
				items : [{
							xtype : 'fieldset',
							title : 'Example',
							layout : 'column',
							items : [Ext.create('Ext.form.Panel', {
										width : 1055,
										height : 150,
										title : '示例',
										border : 1,
										html : textAreaexplains
									})]
						}, win_form]
			});

	var v = getCmp('right_propertyGrid').getSource()[fieldName];
	if (v != null && v != '点此编辑' && '' != v) {
		win_form.getForm().setValues({
					bigString : v
				});
		win.oldValue = v;
	}
	win.show();
}

function bigStringJs(fieldName, label) {

	var win_buttons = [{
		text : '格式化',
		handler : function() {
			if (win_form.getValues().bigString.trim() == '') {

			} else {
				var formatedString = js_beautify(win_form.getValues().bigString);

				win_form.getForm().setValues({
							bigString : formatedString
						});
				// win.oldValue = formatedString;
				// win_form.getValues().bigString = formatedString;
			}
		}
	}, {
		text : '确定',
		handler : function() {
			if (win_form.getValues().bigString.trim() == '') {
				getCmp('right_propertyGrid').setProperty(fieldName, '点此编辑');
			} else {
				getCmp('right_propertyGrid').setProperty(fieldName,
						win_form.getValues().bigString);
				// 点击确定按钮直接保存
				Ext.getCmp('saveRightProperties').handler();
			}
			win.close();
		}
	}, {
		text : '取消',
		handler : function() {
			if (win.oldValue == '' || win.oldValue == undefined) {
				getCmp('right_propertyGrid').setProperty(fieldName, '点此编辑');
			} else {
				getCmp('right_propertyGrid').setProperty(fieldName,
						win.oldValue);
			}
			win.close();
		}
	}];

	var win_form = Ext.create('Ext.form.Panel', {
				width : '100%',
				height : '100%',
				bodyPadding : 0,
				autoScroll : true,
				margins : '0 0 0 0',
				border : 0,
				method : 'post',
				layout : 'anchor',
				defaults : {
					anchor : '100%'
				},
				defaultType : 'textfield',
				items : [Ext.create('Ext.form.Panel', {
							border : 0,
							items : [{
										xtype : 'textarea',
										name : 'bigString',
										width : 788,
										height : 382
									}]
						})]
			});

	var win = Ext.create('Ext.Window', {
				title : label,
				width : 800 * bokedee_width,
				height : 450 * bokedee_height,
				draggable : false,
				autoScroll : true,
				resizable : false,
				modal : true,
				buttons : win_buttons,
				items : [win_form]
			});

	var v = getCmp('right_propertyGrid').getSource()[fieldName];
	if (v != null && v != '点此编辑' && '' != v) {
		win_form.getForm().setValues({
					bigString : v
				});
		win.oldValue = v;
	}
	win.show();
}

function bigStringJsWithExample(fieldName, label) {
	changeToLogin();
	Ext.Ajax.request({
				url : 'interfaceInfoFindController.do?actionType=findExample',
				params : {
					type : 'example_MsgJsScript.json'
				},
				success : function(response) {
					var result = Ext.decode(response.responseText);
					$('explains').value = result.explains;
				}
			});
	var win_buttons = [{
		text : '格式化',
		handler : function() {
			if (win_form.getValues().bigString.trim() == '') {

			} else {
				var formatedString = js_beautify(win_form.getValues().bigString);

				win_form.getForm().setValues({
							bigString : formatedString
						});
				// win.oldValue = formatedString;
				// win_form.getValues().bigString = formatedString;
			}
		}
	}, {
		text : '确定',
		handler : function() {
			if (win_form.getValues().bigString.trim() == '') {
				getCmp('right_propertyGrid').setProperty(fieldName, '点此编辑');
			} else {
				getCmp('right_propertyGrid').setProperty(fieldName,
						win_form.getValues().bigString);
				// 点击确定按钮直接保存
				Ext.getCmp('saveRightProperties').handler();
			}
			win.close();
		}
	}, {
		text : '取消',
		handler : function() {
			if (win.oldValue == '' || win.oldValue == undefined) {
				getCmp('right_propertyGrid').setProperty(fieldName, '点此编辑');
			} else {
				getCmp('right_propertyGrid').setProperty(fieldName,
						win.oldValue);
			}
			win.close();
		}
	}];

	var win_form = Ext.create('Ext.form.Panel', {
				width : '100%',
				height : 340,
				bodyPadding : 0,
				autoScroll : false,
				border : 0,
				method : 'post',
				layout : 'anchor',
				defaults : {
					anchor : '100%'
				},
				items : [{
							xtype : 'textarea',
							name : 'bigString',
							width : '100%',
							height : '100%'
						}]
			});

	var textAreaexplains = '<textarea wrap="off" style="width:1052px;height:120px;"id="explains"  readonly="readonly"></textarea>';

	var win = Ext.create('Ext.Window', {
				title : label,
				autoScroll : true,
				resizable : false,
				draggable : false,
				modal : true,
				width : 1100 * bokedee_width,
				height : 600 * bokedee_height,
				bodyPadding : 5,
				buttons : win_buttons,
				items : [{
							xtype : 'fieldset',
							title : 'Example',
							layout : 'column',
							items : [Ext.create('Ext.form.Panel', {
										width : 1055,
										height : 150,
										title : '示例',
										border : 1,
										html : textAreaexplains
									})]
						}, win_form]
			});

	var v = getCmp('right_propertyGrid').getSource()[fieldName];
	if (v != null && v != '点此编辑' && '' != v) {
		win_form.getForm().setValues({
					bigString : v
				});
		win.oldValue = v;
	}
	win.show();

}

function bigStringJsWithDSWithExample(fieldName, label) {
	changeToLogin();
	Ext.Ajax.request({
				url : 'interfaceInfoFindController.do?actionType=findExample',
				params : {
					type : 'example_MsgJsScriptWithDS.json'
				},
				success : function(response) {
					var result = Ext.decode(response.responseText);
					$('explains').value = result.explains;
				}
			});
	var win_buttons = [{
		text : '格式化',
		handler : function() {
			if (win_form.getValues().bigString.trim() == '') {

			} else {
				var formatedString = js_beautify(win_form.getValues().bigString);

				win_form.getForm().setValues({
							bigString : formatedString
						});
				// win.oldValue = formatedString;
				// win_form.getValues().bigString = formatedString;
			}
		}
	}, {
		text : '确定',
		handler : function() {
			if (win_form.getValues().bigString.trim() == '') {
				getCmp('right_propertyGrid').setProperty(fieldName, '点此编辑');
			} else {
				getCmp('right_propertyGrid').setProperty(fieldName,
						win_form.getValues().bigString);
				// 点击确定按钮直接保存
				Ext.getCmp('saveRightProperties').handler();
			}
			win.close();
		}
	}, {
		text : '取消',
		handler : function() {
			if (win.oldValue == '' || win.oldValue == undefined) {
				getCmp('right_propertyGrid').setProperty(fieldName, '点此编辑');
			} else {
				getCmp('right_propertyGrid').setProperty(fieldName,
						win.oldValue);
			}
			win.close();
		}
	}];

	var win_form = Ext.create('Ext.form.Panel', {
				width : '100%',
				height : 340,
				bodyPadding : 0,
				autoScroll : false,
				border : 0,
				method : 'post',
				layout : 'anchor',
				defaults : {
					anchor : '100%'
				},
				items : [{
							xtype : 'textarea',
							name : 'bigString',
							width : '100%',
							height : '100%'
						}]
			});

	var textAreaexplains = '<textarea wrap="off" style="width:1052px;height:120px;"id="explains"  readonly="readonly"></textarea>';

	var win = Ext.create('Ext.Window', {
				title : label,
				autoScroll : true,
				resizable : false,
				draggable : false,
				modal : true,
				width : 1100 * bokedee_width,
				height : 600 * bokedee_height,
				bodyPadding : 5,
				buttons : win_buttons,
				items : [{
							xtype : 'fieldset',
							title : 'Example',
							layout : 'column',
							items : [Ext.create('Ext.form.Panel', {
										width : 1055,
										height : 150,
										title : '示例',
										border : 1,
										html : textAreaexplains
									})]
						}, win_form]
			});

	var v = getCmp('right_propertyGrid').getSource()[fieldName];
	if (v != null && v != '点此编辑' && '' != v) {
		win_form.getForm().setValues({
					bigString : v
				});
		win.oldValue = v;
	}
	win.show();

}

/**
 * outbound axis
 * 
 * @param {Object}
 *            f
 * @return {TypeName}
 */
function windowAxis(fieldName, label) {
	var delIndex;

	function win_form_grid_item_btnDelHandler() {
		Ext.Msg.show({
					title : '删除参数',
					msg : win_form_grid_store.getAt(delIndex).data.parameter,
					buttons : Ext.Msg.YESNO,
					fn : function(type) {
						if ('yes' == type) {
							win_form_grid_store.removeAt(delIndex);
							delIndex = undefined;
						}
					}
				})
	}

	var win_form_grid_item = [{
				text : '新增',
				icon : 'images/add.png',
				scale : 'small',
				width : 50,
				handler : function() {
					var r = Ext.ModelManager.create({
								parameter : '',
								type : '',
								mode : ''
							}, 'SoapMethod');
					win_form_grid_store.insert(win_form_grid_store.getCount(),
							r);
					var row = win_form_grid_store.getCount() - 1;
					win_form_grid_pluginCellEdit.startEditByPosition({
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
					if (delIndex != null) {
						win_form_grid_item_btnDelHandler();
					}
				}
			}];

	var win_form_grid_pluginCellEdit = Ext.create(
			'Ext.grid.plugin.CellEditing', {
				clicksToEdit : 1,
				listeners : {
					beforeedit : function(record) {
						delIndex = record.rowIdx;
					}
				}
			});

	var vjj = [];
	var vj;
	var v = getCmp('right_propertyGrid').getSource()[fieldName];
	if (v != null && v != '点此编辑' && '' != v) {
		vj = Ext.decode(v);
		if (vj.parameter) {
			vjj = vj.parameter;
		}
	}

	var win_form_grid_store = Ext.create('Ext.data.Store', {
				model : 'SoapMethod',
				data : vjj,
				autoLoad : false
			});

	var win_form_grid = Ext.create('Ext.grid.Panel', {
				title : 'Parameter',
				store : win_form_grid_store,
				tbar : {
					items : win_form_grid_item
				},
				columns : [{
							header : '参数名称',
							dataIndex : 'parameter',
							flex : 2,
							field : 'textfield'
						}, {
							header : '类型',
							dataIndex : 'type',
							flex : 1,
							field : 'textfield'
						}, {
							header : '方式',
							dataIndex : 'mode',
							flex : 1,
							field : 'textfield'
						}],
				plugins : [win_form_grid_pluginCellEdit],
				height : 295
			});

	var win_form_address = 'qname{http://webservice.mid.myerp.bokesoft.com:unsafeInvokeService}';

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
							fieldLabel : 'soap_method',
							name : 'soap_method',
							allowBlank : false,
							value : ''
						}, {
							fieldLabel : 'soap_returnType',
							name : 'soap_returnType',
							allowBlank : false,
							value : ''
						}, win_form_grid]
			});

	if (vj)
		win_form.getForm().setValues({
					soap_method : vj.soap_method,
					soap_returnType : vj.soap_returnType
				});
	var win_buttons = [{
		text : '确定',
		handler : function() {
			var form_soap_method = win_form.getValues().soap_method;
			var form_soap_returnType = win_form.getValues().soap_returnType;
			if (validateWinAxisStore(win_form_grid_store))
				return;
			if (form_soap_returnType == ''
					|| form_soap_returnType.indexOf(' ') > -1) {
				Ext.Msg.alert('提示', '返回类型不能为空');
				return;
			}
			if (form_soap_method == '' || form_soap_method.indexOf(' ') > -1) {
				Ext.Msg.alert('提示', '返回方法不能为空');
				return;
			}
			if (validateSoapMethodIsTheSameOrIsNull(win_form_grid_store)) {
				return;
			}
			var temp = {
				soap_method : form_soap_method,
				soap_returnType : form_soap_returnType,
				parameter : storeToObj(win_form_grid_store)
			};
			var rp = getCmp('right_propertyGrid');
			rp.setProperty(fieldName, Ext.encode(temp));
			
			// 点击确定按钮直接保存
			Ext.getCmp('saveRightProperties').handler();
			
			win.close();
		}
	}, {
		text : '取消',
		handler : function() {
			win.close();
		}
	}];
	var win = Ext.create('Ext.Window', {
				title : label,
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
 * 用tree编辑smooks配置
 * 
 * @param {Object}
 *            fieldName
 * @param {Object}
 *            label
 */
function bigStringSimpleSmooks(fieldName, label) {
	var win_buttons = [{
		text : '确定',
		handler : function() {
			// 验证store
			if (validateSimpleSmooksSameOrIsNull(getCmp('gridTree').store)) {
				return false;
			}
			// getSmooksXml
			var gridJson = Ext.encode(storeToObj(getCmp('gridTree').store));
			var getSmooksurl = 'interfaceInfoFindController.do?actionType=getSmooksXml';
			var xmlData = getCmp('win_form_model').form.getValues().xml;
			if (xmlData == '' || xmlData.trim().length == 0) {
				Ext.Msg.alert('提示', '模版没有数据');
				return;
			}
			alert("确定");
			var data = {
				xml : xmlData,
				grid : gridJson,
				smooks : ajaxSyncCall(getSmooksurl, 'data=' + gridJson, null)
			}

			var result = Ext.JSON.encode(data);
			getCmp('right_propertyGrid').setProperty(fieldName, result);
			
			// 点击确定按钮直接保存
			Ext.getCmp('saveRightProperties').handler();
			
			win.close();
		}
	}, {
		text : '取消',
		handler : function() {
			getCmp('right_propertyGrid').setProperty(fieldName,
					getCmp('right_propertyGrid').getSource()[fieldName]);
			win.close();
		}
	}];
	var win_buttons_Smooks = [{
				text : '格式化',
				handler : function() {
					var url = 'interfaceInfoFindController.do?actionType=formatString';
					var winS = this.ownerCt.ownerCt.form;
					if (winS.getValues() != '') {// xml 模版
						changeToLogin();
						Ext.Ajax.request({
									url : url,
									params : {
										type : 'xml',
										text : winS.getValues()
									},
									success : function(response) {
										winS.setValues({
													xml : response.responseText
												});
									}

								});
					}
				}
			}, {
				text : '解析',
				handler : function() {
					bodyLoadingMask.show();
					var xmlData = this.ownerCt.ownerCt.form.getValues().xml;
					if (xmlData == '') {
						bodyLoadingMask.hide();
						Ext.Msg.alert('提示', '解析失败:没有数据');
						return;
					}
					var getTreeurl = 'interfaceInfoFindController.do?actionType=getTreeStore';
					changeToLogin();
					Ext.Ajax.request({
								url : getTreeurl,
								params : {
									data : xmlData
								},
								success : function(response) {
									bodyLoadingMask.hide();
									var treestore = response.responseText;
									if (treestore.search('parseXMLError') > -1) {
										Ext.Msg
												.alert('提示', '解析失败:'
																+ treestore);
										return;
									}
									var oldData = Ext.getCmp('gridTree').store;
									var newItem = reLoadSmooks(Ext.JSON
											.encode(Ext.JSON.decode(treestore).children));
									win.remove(gridTree);
									// 加入原来的配置的值
									var length = oldData.data.length;
									if (length > 0) {
										Ext.getCmp('gridTree').store
												.add(oldData.data.items);
									}
									win.add(newItem);
									Ext.Msg.alert('提示', '解析成功');
								},
								failure : function(response) {
									bodyLoadingMask.hide();
									Ext.Msg.alert('提示', '操作失败');
									return;
								}

							});
				}
			}];

	var win_form_model = Ext.create('Ext.form.Panel', {
				height : '40%',
				title : '数据模版',
				id : 'win_form_model',
				buttons : win_buttons_Smooks,
				bodyPadding : 5,
				border : 0,
				layout : 'anchor',
				defaults : {
					anchor : '100%'
				},
				defaultType : 'textarea',
				items : [{
							width : '100%',
							height : '100%',
							name : 'xml'
						}]
			});
	var gridTree = reLoadSmooks([]);
	var win = Ext.create('Ext.Window', {
				title : label,
				resizable : false,
				draggable : false,
				modal : true,
				width : 900 * bokedee_width,
				height : 600 * bokedee_height,
				bodyPadding : 5,
				buttons : win_buttons,
				items : [win_form_model, gridTree]
			});

	var v = getCmp('right_propertyGrid').getSource()[fieldName];
	if (v != null && v != '点此编辑' && '' != v) {
		var datas = Ext.JSON.decode(v);
		getCmp('win_form_model').form.setValues({// xml模版
			xml : datas.xml
		});

		var getTreeurl = 'interfaceInfoFindController.do?actionType=getTreeStore';
		changeToLogin();
		Ext.Ajax.request({
					url : getTreeurl,
					params : {
						data : datas.xml
					},
					success : function(response) {
						var treestore = response.responseText;
						var newItem = reLoadSmooks(Ext.JSON.encode(Ext.JSON
								.decode(treestore).children));
						win.remove(gridTree);
						win.add(newItem);
						// 节点配置的值
						var length = Ext.JSON.decode(Ext.JSON.decode(v).grid).length;
						if (length > 0) {
							for (var i = 0; i < length; i++) {
								Ext.getCmp('gridTree').store.add(Ext.JSON
										.decode(Ext.JSON.decode(v).grid)[i])
							};
						}
						win.oldValue = v;
					},
					failure : function(response) {
						Ext.Msg.alert('提示', '操作失败');
					}

				});
	}
	win.show();
}
function reLoadSmooks(gridTree_store) {
	var complexTbar = [{
				text : '添加',
				scale : 'small',
				icon : 'images/add.png',
				width : 50,
				handler : function() {
					Ext.getStore('gridTreeStore').add([{
								"beanId" : "",
								"class" : "请选择",
								"createOnElement" : "请选择",
								"format" : ""
							}]);
				}
			}, {
				text : '删除',
				scale : 'small',
				icon : 'images/shanchu.png',
				width : 50,
				handler : function() {
					if (gridTree.selModel.selected.length > 0) {
						gridTree.store.remove(gridTree.selModel.getSelection());
					} else {
						Ext.Msg.alert('提示', '请选择一个！');
					}
				}
			}, {
				text : '清空',
				scale : 'small',
				icon : 'images/shanchu.png',
				width : 50,
				handler : function() {
					gridTree.store.removeAll();
				}
			}, {
				text : '自动生成每个节点',
				scale : 'small',
				width : 110,
				loadMask : true,
				handler : function() {
					var xmlData = getCmp('win_form_model').items.items[0].rawValue;
					createTreeNodes(xmlData);

				}
			}, {
				text : '日期格式例子',
				scale : 'small',
				width : 100,
				handler : function() {
					Ext.Msg
							.alert(
									'日期格式',
									'yyyy/MM/dd HH:mm:ss如 \'2002/01/01 17:55:00\'<br>yyyy-MM-dd HH:mm:ss如 \'2002-01-01 17:55:00\' <br>EEE, d MMM yyyy HH:mm:ss Z如Wed, 4 Jul 2001 12:08:56 -0700<br>yyyy-MM-dd\'T\'HH:mm:ss.SSSZ如2001-07-04T12:08:56.235-0700<br>h:mm a如12:08 PM<br>EEE, MMM d,yy如Wed, Jul 4,01')
				}
			}];
	var win_form_grid_pluginCellEdit = Ext.create(
			'Ext.grid.plugin.CellEditing', {
				clicksToEdit : 1,
				listeners : {
					beforeedit : function(record) {
						gridTreeIndex = record.rowIdx;
					},
					edit : function(editor, e, eOpts) {
						if (e.field == "beanId" && e.value.length != 0
								&& !isNaN(e.value.substring(0, 1))) {
							Ext.Msg.alert('提示', '映射名称不能以数字开头！');
							e.record.data[e.field] = null;
						}
					}
				}
			});
	var checkboxModel = Ext.create('Ext.selection.CheckboxModel', {
				mode : 'SINGEL',
				listeners : {
					select : function(m, record, index) {
						gridTree.record = record;
						gridTree.index = index;
					}
				}
			});
	var gridTree = Ext.create('Ext.grid.Panel', {
				id : 'gridTree',
				title : '节点属性配置',
				height : '60%',
				width : '100%',
				loadMask : true,
				bodyPadding : 5,
				autoScroll : true,
				tbar : complexTbar,
				store : Ext.create('Ext.data.Store', {
							storeId : 'gridTreeStore',
							model : 'gridTreeModel',
							data : [],
							autoLoad : true
						}),
				selModel : checkboxModel,
				columns : [{
							header : '节点',
							dataIndex : 'createOnElement',
							id : 'gridTreeStore',
							flex : 2,
							editor : {
								xtype : 'comboboxtree',
								editable : false,
								Comstore : gridTree_store
							}
						}, {
							header : '类型',
							dataIndex : 'class',
							flex : 0.8,
							field : {
								xtype : 'combobox',
								editable : false,
								name : 'class',
								store : Ext.create('Ext.data.Store', {
											model : 'Combox',
											autoLoad : true,
											data : [{
														value : 'String',
														displayField : 'String'
													}, {
														value : 'Map',
														displayField : 'Map'
													}, {
														value : 'List',
														displayField : 'List'
													}, {
														value : 'Date',
														displayField : 'Date'
													}, {
														value : 'SqlTimeStamp',
														displayField : 'SqlTimeStamp'
													}, {
														value : 'Boolean',
														displayField : 'Boolean'
													}, {
														value : 'Long',
														displayField : 'Long'
													}, {
														value : 'Integer',
														displayField : 'Integer'
													}, {
														value : 'Double',
														displayField : 'Double'
													}]
										}),
								displayField : 'displayField',
								valueField : 'value',
								queryMode : 'local',
								value : '请选择'
							}
						}, {
							header : '映射名称',
							dataIndex : 'beanId',
							flex : 1,
							field : 'textfield'
						}, {
							header : '日期格式',
							dataIndex : 'format',
							flex : 1,
							field : 'textfield'
						}],
				plugins : [win_form_grid_pluginCellEdit]
			});
	return gridTree;
}
function createTreeNodes(xmlData) {
	bodyLoadingMask.show();
	if (xmlData != "") {
		var getTreeNodesurl = 'interfaceInfoFindController.do?actionType=getTreeNodes';
		changeToLogin();
		Ext.Ajax.request({
			url : getTreeNodesurl,
			params : {
				data : xmlData
			},
			success : function(response) {
				var treestore = response.responseText;
				if (treestore.search('parseXMLError') > -1) {
					bodyLoadingMask.hide();
					Ext.Msg.alert('提示', '解析失败:' + treestore);
					return;
				}
				Ext.getCmp('gridTree').store.removeAll();
				var data = Ext.JSON.decode(treestore);
				var length = data.length;
				for (var i = 0; i < length; i++) {
					Ext.getCmp('gridTree').store.add([{
						"beanId" : data[i].substr(data[i].lastIndexOf('/') + 1),
						"class" : "String",
						"createOnElement" : data[i],
						"format" : ""
					}])
				}
				bodyLoadingMask.hide();
				Ext.Msg.alert('提示', '生成成功');
			},
			failure : function(response) {
				bodyLoadingMask.hide();
				Ext.Msg.alert('提示', '操作失败');
				return;
			}

		});
	} else {
		bodyLoadingMask.hide();
		Ext.Msg.alert('提示', '没有数据');
		return;
	}
}
/**
 * 配置excel
 */
function map_Excel_config(fieldName, label) {
	var win_buttonsURL = 'interfaceExchangeCenterController.do?actionType=addExchange';

	var win_buttons = [{
		text : '确定',
		handler : function() {
			// Object {index: "1", name: "", title: "test", end: "end"}
			var form_index = win_form.getValues().index;
			var form_name = win_form.getValues().name;
			var form_title = win_form.getValues().title;
			var form_startLine = win_form.getValues().startLine;
			var form_endConditions = win_form.getValues().endConditions;
			if (form_index.length == 0 && form_name.length == 0) {
				Ext.Msg.alert('提示', 'workSheet的名字和索引必须填一个！');
				return;
			}
			var excelConfig = {
				index : form_index,
				name : form_name
			}
			if (Ext.getStore('cellList_store').data.length != 0) {
				// 验证store
				if (validateExcelConfigSameOrIsNull(Ext
								.getStore('cellList_store'), true)) {
					return false;
				} else {
					excelConfig.cell = storeToObj(Ext
							.getStore('cellList_store'));
				}
			}
			if (Ext.getStore('loopList_store').data.length != 0) {
				if (form_startLine == '') {
					Ext.Msg.alert('提示', '起始行不能为空');
					return;
				}
				// 验证store
				if (validateExcelConfigSameOrIsNull(Ext
								.getStore('loopList_store'), false)) {
					return false;
				} else {
					var loop = {
						title : form_title,
						startLine : form_startLine,
						endConditions : form_endConditions
					}
					excelConfig.loop = loop;
					excelConfig.loop.list = storeToObj(Ext
							.getStore('loopList_store'));
				}
			}
			getCmp('right_propertyGrid').setProperty(fieldName,
					Ext.encode(excelConfig));
			
			// 点击确定按钮直接保存
			Ext.getCmp('saveRightProperties').handler();
			
			win.close();
		}
	}, {
		text : '取消',
		handler : function() {
			getCmp('right_propertyGrid').setProperty(fieldName,
					getCmp('right_propertyGrid').getSource()[fieldName]);
			win.close();
		}
	}];

	var win_form_grid_CheckboxModel1 = Ext.create(
			'Ext.selection.CheckboxModel', {
				mode : 'MULTI',
				checkOnly : true
			});

	var win_form_grid_CheckboxModel2 = Ext.create(
			'Ext.selection.CheckboxModel', {
				mode : 'MULTI',
				checkOnly : true
			});
	var celltbar = [{
				text : '添加',
				scale : 'small',
				icon : 'images/add.png',
				width : 50,
				handler : function() {
					Ext.getStore('cellList_store').add([{
								'row' : '',
								'col' : '',
								'mapping' : '',
								'type' : 'String',
								'isnull' : true
							}]);

				}
			}, {
				text : '删除',
				scale : 'small',
				icon : 'images/shanchu.png',
				width : 50,
				handler : function() {
					if (getCmp('win_cellform_grid').selModel.selected.length > 0) {
						Ext.getStore('cellList_store')
								.remove(getCmp('win_cellform_grid').selModel
										.getSelection());
					}
				}
			}];
	var looptbar = [{
				text : '添加',
				scale : 'small',
				icon : 'images/add.png',
				width : 50,
				handler : function() {
					Ext.getStore('loopList_store').add([{
								'col' : '',
								'mapping' : '',
								'type' : 'String',
								'isnull' : true
							}]);

				}
			}, {
				text : '删除',
				scale : 'small',
				icon : 'images/shanchu.png',
				width : 50,
				handler : function() {
					if (getCmp('win_form_grid_loop').selModel.selected.length > 0) {
						Ext.getStore('loopList_store')
								.remove(getCmp('win_form_grid_loop').selModel
										.getSelection());
					}
				}
			}];
	// cell
	var cellList_store = Ext.create('Ext.data.Store', {
				storeId : 'cellList_store',
				model : 'excelConfigModel',
				data : [],
				autoLoad : true
			});
	var loopList_store = Ext.create('Ext.data.Store', {
				storeId : 'loopList_store',
				model : 'excelConfigModel',
				data : [],
				autoLoad : true
			});
	var win_form_grid_pluginCellEdit = Ext.create(
			'Ext.grid.plugin.CellEditing', {
				clicksToEdit : 1,
				listeners : {
					beforeedit : function(record) {
					},
					edit : function(editor, e, eOpts) {
						if (e.field == "mapping" && e.value.length != 0
								&& !isNaN(e.value.substring(0, 1))) {
							Ext.Msg.alert('提示', '不能以数字开头！');
							e.record.data[e.field] = null;
						}
					}
				}
			});
	var win_form_grid_pluginCellEdit2 = Ext.create(
			'Ext.grid.plugin.CellEditing', {
				clicksToEdit : 1,
				listeners : {
					beforeedit : function(record) {
					},
					edit : function(editor, e, eOpts) {
						if (e.field == "mapping" && e.value.length != 0
								&& !isNaN(e.value.substring(0, 1))) {
							Ext.Msg.alert('提示', '不能以数字开头！');
							e.record.data[e.field] = null;
						}
					}
				}
			});
	var win_cellform_grid = Ext.create('Ext.grid.Panel', {
				title : '单元格',
				id : 'win_cellform_grid',
				store : cellList_store,
				width : '100%',
				tbar : celltbar,
				selModel : win_form_grid_CheckboxModel1,
				columns : [{
							header : '行',
							dataIndex : 'row',
							flex : 0.5,
							field : {
								xtype : 'numberfield',
								minValue : 1
							}
						}, {
							header : '列',
							dataIndex : 'col',
							flex : 0.5,
							field : {
								xtype : 'combobox',
								store : ['A', 'B', 'C', 'D', 'E', 'F', 'G',
										'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O',
										'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W',
										'X', 'Y', 'Z']
							}
						}, {
							header : 'Mapping',
							dataIndex : 'mapping',
							flex : 1,
							field : 'textfield'
						}, {
							header : 'type',
							dataIndex : 'type',
							flex : 0.5,
							field : {
								xtype : 'combobox',
								name : 'class',
								store : Ext.create('Ext.data.Store', {
											model : 'Combox',
											data : [{
														value : 'String',
														displayField : 'String'
													}, {
														value : 'Date',
														displayField : 'Date'
													}, {
														value : 'Boolean',
														displayField : 'Boolean'
													}, {
														value : 'Long',
														displayField : 'Long'
													}, {
														value : 'Integer',
														displayField : 'Integer'
													}, {
														value : 'Double',
														displayField : 'Double'
													}]
										}),
								editable : false,
								displayField : 'displayField',
								valueField : 'value',
								queryMode : 'local',
								allowBlank : false,
								value : 'String'
							}
						}, {
							header : '是否可为空',
							dataIndex : 'isnull',
							flex : 0.5,
							field : {
								xtype : 'combobox',
								name : 'class',
								store : Ext.create('Ext.data.Store', {
											model : 'Combox',
											data : [{
														value : true,
														displayField : true
													}, {
														value : false,
														displayField : false
													}]
										}),
								editable : false,
								displayField : 'displayField',
								valueField : 'value',
								queryMode : 'local',
								value : true
							}
						}],
				plugins : [win_form_grid_pluginCellEdit],
				listeners : {
					activate : function(tab) {
						win_form.currentActive = tab;
					}
				},
				height : 335
			});
	// Loop
	var win_form_grid_loop = Ext.create('Ext.grid.Panel', {
				id : 'win_form_grid_loop',
				width : '100%',
				height : 260,
				store : loopList_store,
				selModel : win_form_grid_CheckboxModel2,
				tbar : looptbar,
				columns : [{
					header : '列',
					dataIndex : 'col',
					flex : 0.5,
					field : {
						xtype : 'combobox',
						store : ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I',
								'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R',
								'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']
					}
				}, {
					header : 'Mapping',
					dataIndex : 'mapping',
					flex : 1,
					field : 'textfield'
				}, {
					header : 'type',
					dataIndex : 'type',
					flex : 0.5,
					field : {
						xtype : 'combobox',
						name : 'class',
						store : Ext.create('Ext.data.Store', {
									model : 'Combox',
									data : [{
												value : 'String',
												displayField : 'String'
											}, {
												value : 'Date',
												displayField : 'Date'
											}, {
												value : 'Boolean',
												displayField : 'Boolean'
											}, {
												value : 'Long',
												displayField : 'Long'
											}, {
												value : 'Integer',
												displayField : 'Integer'
											}, {
												value : 'Double',
												displayField : 'Double'
											}]
								}),
						editable : false,
						displayField : 'displayField',
						valueField : 'value',
						queryMode : 'local',
						allowBlank : false,
						value : 'String'
					}
				}, {
					header : '是否可为空',
					dataIndex : 'isnull',
					flex : 0.5,
					field : {
						xtype : 'combobox',
						editable : false,
						name : 'class',
						store : Ext.create('Ext.data.Store', {
									model : 'Combox',
									data : [{
												value : false,
												displayField : false
											}, {
												value : true,
												displayField : true
											}]
								}),
						displayField : 'displayField',
						valueField : 'value',
						queryMode : 'local',
						value : true
					}
				}],
				plugins : [win_form_grid_pluginCellEdit2],
				listeners : {
					activate : function(tab) {
						win_form.currentActive = tab;
					}
				}
			});
	var win_loopform_grid = Ext.create('Ext.form.Panel', {
		title : '行循环',
		width : '100%',
		height : 335,
		border : 0,
		bodyPadding : 5,
		autoScroll : true,
		layout : 'anchor',
		defaults : {
			anchor : '100%'
		},
		defaultType : 'textfield',
		items : [{
					xtype : 'fieldcontainer',
					layout : 'hbox',
					defaultType : 'textfield',
					items : [{
								fieldLabel : '标题行',
								labelWidth : 50,
								size : 10,
								name : 'title',
								xtype : 'numberfield',
								minValue : 1
							}, {
								fieldLabel : '&nbsp&nbsp&nbsp&nbsp&nbsp起始行',
								labelWidth : 70,
								size : 10,
								name : 'startLine',
								xtype : 'numberfield',
								minValue : 1
							}]
				}, win_form_grid_loop, {
					fieldLabel : '结束条件',
					emptyText : '不填时是整行为空结束，或填等式条件：列名=* 如A=test,B=null有多个等式条件用\',\'隔开',
					width : 200,
					labelWidth : 60,
					name : 'endConditions'
				}]
	});
	var win_form = Ext.create('Ext.form.Panel', {
		width : '100%',
		height : 415,
		id : 'win_form_excelconfig',
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
			xtype : 'fieldcontainer',
			fieldLabel : 'Sheet',
			labelWidth : 40,
			layout : 'column',
			defaultType : 'textfield',
			items : [{
						name : 'index',
						emptyText : 'index',
						fieldLabel : '索引（优先）',
						labelWidth : 80,
						size : 10,
						xtype : 'numberfield',
						minValue : 1
					}, {
						name : 'name',
						fieldLabel : '&nbsp&nbsp&nbsp&nbsp&nbsp或&nbsp&nbsp&nbsp&nbsp&nbspSheet名字',
						labelWidth : 120,
						emptyText : 'name'
					}]
		}, {
			xtype : 'tabpanel',
			items : [win_loopform_grid, win_cellform_grid]
		}]
	});
	var win = Ext.create('Ext.Window', {
				title : 'Excel配置',
				width : 800 * bokedee_width,
				height : 475 * bokedee_height,
				layout : 'absolute',
				draggable : false,
				bodyStyle : 'background:#ffffff;',
				resizable : false,
				modal : true,
				buttons : win_buttons,
				items : [win_form]
			});

	var v = getCmp('right_propertyGrid').getSource()[fieldName];
	if (v != null && v != '点此编辑' && '' != v) {
		var datas = Ext.JSON.decode(v);
		getCmp('win_form_excelconfig').form.setValues({
					index : datas.index,
					name : datas.name
				});
		if (datas.hasOwnProperty('loop')) {// 如果有loop类型
			getCmp('win_form_excelconfig').form.setValues({
						title : datas.loop.title,
						startLine : datas.loop.startLine,
						endConditions : datas.loop.endConditions
					});
			var length = datas.loop.list.length;
			for (var i = 0; i < length; i++) {
				Ext.getStore('loopList_store').add((datas.loop.list)[i])
			};
		}
		if (datas.hasOwnProperty('cell')) {// 如果有cell类型
			var length = datas.cell.length;
			for (var i = 0; i < length; i++) {
				Ext.getStore('cellList_store').add((datas.cell)[i])
			};
		}
	}
	win.show();

}
/**
 * 配置多sheet的Excel
 */
function map_Excel_mutilSheet_config(fieldName, label) {
	var win_buttonsURL = 'interfaceExchangeCenterController.do?actionType=addExchange';

	var win_buttons = [{
		text : '确定',
		handler : function() {
			
			var tabPanel = getCmp('win_tabPanel');
			var allExcelConfig = "{";
			for(var i=0; i<tabPanel.items.length; i++){
				var panel = tabPanel.items.get(i);
				var form = panel.items.get(0);
				var form_index = form.getValues().index;
				var form_name = form.getValues().name;
				var form_title = form.getValues().title;
				var form_startLine = form.getValues().startLine;
				var form_endConditions = form.getValues().endConditions;
				
				if (form_index.length == 0 && form_name.length == 0) {
					Ext.Msg.alert('提示', '第'+ (i+1) +'个workSheet的名字和索引必须填一个！');
					return;
				}
				var excelConfig = {
					index : form_index,
					name : form_name
				}
				//存储单元格中的数据
				var cellListStore = form.items.get(1).items.get(1).store;
				if (cellListStore.data.length != 0) {
					// 验证cell_store
					if (validateExcelConfigSameOrIsNull(cellListStore, true)) {
						return false;
					} else {
						excelConfig.cell = storeToObj(cellListStore);
					}
				}
				
				//存储行循环中的数据
				var loopform_grid = form.items.get(1).items.get(0);
				var loopListStore = loopform_grid.items.get(1).store;
				if(loopListStore.data.length != 0){
					if (form_startLine == '') {
						Ext.Msg.alert('提示', '第'+(i+1)+'的起始行不能为空');
						return;
					}
					// 验证loop_store
					if (validateExcelConfigSameOrIsNull(loopListStore, false)) {
						return false;
					} else {
						var loop = {
							title : form_title,
							startLine : form_startLine,
							endConditions : form_endConditions
						}
						excelConfig.loop = loop;
						excelConfig.loop.list = storeToObj(loopListStore);
					}
				}
				if(form_index.length > 0){
					var key = "index_" + form_index + ":";
					allExcelConfig += key;
				}else{
					var key = "name_" + form_name + ":";
					allExcelConfig += key;
				}
				allExcelConfig += Ext.encode(excelConfig);
				if(i < tabPanel.items.length-1){
					allExcelConfig += ',';
				}
			}
			allExcelConfig += '}';
			getCmp('right_propertyGrid').setProperty(fieldName,
					allExcelConfig);
			// 点击确定按钮直接保存
			Ext.getCmp('saveRightProperties').handler();
			win.close();
		}
	}, {
		text : '取消',
		handler : function() {
			getCmp('right_propertyGrid').setProperty(fieldName,
					getCmp('right_propertyGrid').getSource()[fieldName]);
			win.close();
		}
	}];	
	var win_tabPanel = Ext.create('Ext.tab.Panel',{
		width : '100%',
		height : 415,
		id : 'win_tabPanel',
		items : [
					Ext.create('Ext.panel.Panel',{
						title : 'sheet',
						width : '100%',
						height : 415,
						items : [
							this.win_form()
						]
					})
				]
	});
	var win = Ext.create('Ext.Window', {
				title : 'Excel配置',
				width : 800 * bokedee_width,
				height : 500 * bokedee_height,
				layout : 'absolute',
				tbar : [{
					text : '添加',
					scale : 'small',
					icon : 'images/add.png',
					width : 50,
					handler : function() {
							var tab = Ext.getCmp('win_tabPanel');
							//alert(tab.items.length);
							var panel = win_panel();
							tab.add(panel).show();
						}
				}],
				draggable : false,
				bodyStyle : 'background:#ffffff;',
				resizable : false,
				modal : true,
				buttons : win_buttons,
				items : [win_tabPanel]
			});
	var v = getCmp('right_propertyGrid').getSource()[fieldName];
	if (v != null && v != '点此编辑' && '' != v) {
		var datas = Ext.JSON.decode(v);
		var tabPanel = getCmp('win_tabPanel');
		var z=0;
		for(var key in datas){
			if(z==0){
				z++;
				continue;
			}
			var panel = this.win_panel();
			tabPanel.add(panel);
		}
		
		var i=0;
		for(var key in datas){
			var panel = tabPanel.items.get(i);
			var form = panel.items.get(0);
			form.form.setValues({
				index : datas[key].index,
				name : datas[key].name
				});
			// 如果有loop类型
			if(datas[key].hasOwnProperty('loop')){
				form.form.setValues({
					title : datas[key].loop.title,
					startLine : datas[key].loop.startLine,
					endConditions : datas[key].loop.endConditions
				});
				var length = datas[key].loop.list.length;
				for(var j=0; j<length; j++){
					var loopform_grid = form.items.get(1).items.get(0);
					var loopListStore = loopform_grid.items.get(1).store;
					loopListStore.add((datas[key].loop.list)[j]);
				}
			}
			// 如果有cell类型
			if (datas[key].hasOwnProperty('cell')) {// 如果有cell类型
				var length = datas[key].cell.length;
				for (var j = 0; j < length; j++) {
					var cellListStore = form.items.get(1).items.get(1).store;
					cellListStore.add((datas[key].cell)[j]);
				}
			}
			i++;
		}
		
	}
	win.show();
}


//创建一个panel
function win_panel(){
	var win_panel = Ext.create('Ext.panel.Panel',{
			title : 'sheet',
			width : '100%',
			height : 415,
			closable : true,
			items : [
						this.win_form()
					]
				
		});
	return win_panel;
}
//创建一个form
function win_form(){
	var win_form = Ext.create('Ext.form.Panel', {
			width : '100%',
			height : 415,
			//id : 'win_form_excelconfig',
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
				xtype : 'fieldcontainer',
				fieldLabel : 'Sheet',
				labelWidth : 40,
				layout : 'column',
				defaultType : 'textfield',
				items : [{
							name : 'index',
							emptyText : 'index',
							fieldLabel : '索引（优先）',
							labelWidth : 80,
							size : 10,
							xtype : 'numberfield',
							minValue : 1
						}, {
							name : 'name',
							fieldLabel : '&nbsp&nbsp&nbsp&nbsp&nbsp或&nbsp&nbsp&nbsp&nbsp&nbspSheet名字',
							labelWidth : 120,
							emptyText : 'name'
						}]
				},
				{
					xtype : 'tabpanel',
					//items : [win_loopform_grid, win_cellform_grid]
					items : [
						this.win_loopform_grid(),
						this.win_cellform_grid()
					]
				}
				]
			});
	return win_form;
}
function win_cellform_grid(){
	var cellList_store = this.cellList_store();
	var celltbar = this.celltbar(cellList_store);
	
	var win_cellform_grid = Ext.create('Ext.grid.Panel', {
				title : '单元格',
		//YT    id : 'win_cellform_grid',
				store : cellList_store,
				width : '100%',
				tbar : celltbar,
				selModel : this.win_form_grid_CheckboxModel1(),
				columns : [{
							header : '行',
							dataIndex : 'row',
							flex : 0.5,
							field : {
								xtype : 'numberfield',
								minValue : 1
							}
						}, {
							header : '列',
							dataIndex : 'col',
							flex : 0.5,
							field : {
								xtype : 'combobox',
								store : ['A', 'B', 'C', 'D', 'E', 'F', 'G',
										'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O',
										'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W',
										'X', 'Y', 'Z']
							}
						}, {
							header : 'Mapping',
							dataIndex : 'mapping',
							flex : 1,
							field : 'textfield'
						}, {
							header : 'type',
							dataIndex : 'type',
							flex : 0.5,
							field : {
								xtype : 'combobox',
								name : 'class',
								store : Ext.create('Ext.data.Store', {
											model : 'Combox',
											data : [{
														value : 'String',
														displayField : 'String'
													}, {
														value : 'Date',
														displayField : 'Date'
													}, {
														value : 'Boolean',
														displayField : 'Boolean'
													}, {
														value : 'Long',
														displayField : 'Long'
													}, {
														value : 'Integer',
														displayField : 'Integer'
													}, {
														value : 'Double',
														displayField : 'Double'
													}]
										}),
								editable : false,
								displayField : 'displayField',
								valueField : 'value',
								queryMode : 'local',
								allowBlank : false,
								value : 'String'
							}
						}, {
							header : '是否可为空',
							dataIndex : 'isnull',
							flex : 0.5,
							field : {
								xtype : 'combobox',
								name : 'class',
								store : Ext.create('Ext.data.Store', {
											model : 'Combox',
											data : [{
														value : true,
														displayField : true
													}, {
														value : false,
														displayField : false
													}]
										}),
								editable : false,
								displayField : 'displayField',
								valueField : 'value',
								queryMode : 'local',
								value : true
							}
						}],
				plugins : [this.win_form_grid_pluginCellEdit()],
				listeners : {
					activate : function(tab) {
						win_form.currentActive = tab;
					}
				},
				height : 335
			});
	return win_cellform_grid;
}
function win_loopform_grid(){
	var win_loopform_grid = Ext.create('Ext.form.Panel', {
			title : '行循环',
			width : '100%',
			height : 335,
			border : 0,
			bodyPadding : 5,
			autoScroll : true,
			layout : 'anchor',
			defaults : {
				anchor : '100%'
			},
			defaultType : 'textfield',
			items : [{
						xtype : 'fieldcontainer',
						layout : 'hbox',
						defaultType : 'textfield',
						items : [{
									fieldLabel : '标题行',
									labelWidth : 50,
									size : 10,
									name : 'title',
									xtype : 'numberfield',
									minValue : 1
								}, {
									fieldLabel : '&nbsp&nbsp&nbsp&nbsp&nbsp起始行',
									labelWidth : 70,
									size : 10,
									name : 'startLine',
									xtype : 'numberfield',
									minValue : 1
								}]
					},
					this.win_form_grid_loop(), 
					{
						fieldLabel : '结束条件',
						emptyText : '不填时是整行为空结束，或填等式条件：列名=* 如A=test,B=null有多个等式条件用\',\'隔开',
						width : 200,
						labelWidth : 60,
						name : 'endConditions'
					}]
		});
	return win_loopform_grid;
}
function win_form_grid_loop(){
	// Loop
	var loopList_store = this.loopList_store();
	var looptbar = this.looptbar(loopList_store);
	var win_form_grid_loop = Ext.create('Ext.grid.Panel', {
				//id : 'win_form_grid_loop',
				width : '100%',
				height : 260,
				store : loopList_store,
				selModel : this.win_form_grid_CheckboxModel2(),
				tbar : looptbar,
				columns : [{
					header : '列',
					dataIndex : 'col',
					flex : 0.5,
					field : {
						xtype : 'combobox',
						store : ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I',
								'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R',
								'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']
					}
				}, {
					header : 'Mapping',
					dataIndex : 'mapping',
					flex : 1,
					field : 'textfield'
				}, {
					header : 'type',
					dataIndex : 'type',
					flex : 0.5,
					field : {
						xtype : 'combobox',
						name : 'class',
						store : Ext.create('Ext.data.Store', {
									model : 'Combox',
									data : [{
												value : 'String',
												displayField : 'String'
											}, {
												value : 'Date',
												displayField : 'Date'
											}, {
												value : 'Boolean',
												displayField : 'Boolean'
											}, {
												value : 'Long',
												displayField : 'Long'
											}, {
												value : 'Integer',
												displayField : 'Integer'
											}, {
												value : 'Double',
												displayField : 'Double'
											}]
								}),
						editable : false,
						displayField : 'displayField',
						valueField : 'value',
						queryMode : 'local',
						allowBlank : false,
						value : 'String'
					}
				}, {
					header : '是否可为空',
					dataIndex : 'isnull',
					flex : 0.5,
					field : {
						xtype : 'combobox',
						editable : false,
						name : 'class',
						store : Ext.create('Ext.data.Store', {
									model : 'Combox',
									data : [{
												value : false,
												displayField : false
											}, {
												value : true,
												displayField : true
											}]
								}),
						displayField : 'displayField',
						valueField : 'value',
						queryMode : 'local',
						value : true
					}
				}],
				plugins : [this.win_form_grid_pluginCellEdit2()],
				listeners : {
					activate : function(tab) {
						win_form.currentActive = tab;
					}
				}
			});
	return win_form_grid_loop;
}






// cell
function cellList_store(){
	var cellList_store = Ext.create('Ext.data.Store', {
				//storeId : 'cellList_store',
				model : 'excelConfigModel',
				data : [],
				autoLoad : true
			});
	return cellList_store;
}
function loopList_store(){
	var loopList_store = Ext.create('Ext.data.Store', {
				//storeId : 'loopList_store',
				model : 'excelConfigModel',
				data : [],
				autoLoad : true
			});
	return loopList_store;
}
	

function win_form_grid_pluginCellEdit(){
	var win_form_grid_pluginCellEdit = Ext.create(
				'Ext.grid.plugin.CellEditing', {
					clicksToEdit : 1,
					listeners : {
						beforeedit : function(record) {
						},
						edit : function(editor, e, eOpts) {
							if (e.field == "mapping" && e.value.length != 0
									&& !isNaN(e.value.substring(0, 1))) {
								Ext.Msg.alert('提示', '不能以数字开头！');
								e.record.data[e.field] = null;
							}
						}
					}
				});
	return win_form_grid_pluginCellEdit;
}
function win_form_grid_pluginCellEdit2(){
	var win_form_grid_pluginCellEdit2 = Ext.create(
			'Ext.grid.plugin.CellEditing', {
				clicksToEdit : 1,
				listeners : {
					beforeedit : function(record) {
					},
					edit : function(editor, e, eOpts) {
						if (e.field == "mapping" && e.value.length != 0
								&& !isNaN(e.value.substring(0, 1))) {
							Ext.Msg.alert('提示', '不能以数字开头！');
							e.record.data[e.field] = null;
						}
					}
				}
			});
	return win_form_grid_pluginCellEdit2;
}


function win_form_grid_CheckboxModel1(){
	var win_form_grid_CheckboxModel1 = Ext.create(
				'Ext.selection.CheckboxModel', {
					mode : 'MULTI',
					checkOnly : true
				});
	return win_form_grid_CheckboxModel1;
}

function win_form_grid_CheckboxModel2(){
	var win_form_grid_CheckboxModel2 = Ext.create(
			'Ext.selection.CheckboxModel', {
				mode : 'MULTI',
				checkOnly : true
			});
	return win_form_grid_CheckboxModel2;
}




function celltbar(cellList_store){
	//var cellList_store = this.cellList_store();
	var celltbar = [{
				text : '添加',
				scale : 'small',
				icon : 'images/add.png',
				//store : cellList_store,
				width : 50,
				handler : function() {
					//不知道成不成
					//alert(cellList_store.model);
					cellList_store.add([{
								'row' : '',
								'col' : '',
								'mapping' : '',
								'type' : 'String',
								'isnull' : true
							}]);
					//alert("count-->"+cellList_store.getCount());
				}
			}, {
				text : '删除',
				scale : 'small',
				icon : 'images/shanchu.png',
				width : 50,
				handler : function() {
					var win_cellform_grid = this.ownerCt.ownerCt;
					
					if (win_cellform_grid.selModel.selected.length > 0) {
						cellList_store
								.remove(win_cellform_grid.selModel
										.getSelection());
					}
				}
			}];
	return celltbar;
}
//创建循环行的工具栏
function looptbar(loopList_store){
	//var loopList_store = this.loopList_store();
	var looptbar = [{
				text : '添加',
				scale : 'small',
				icon : 'images/add.png',
				width : 50,
				handler : function() {
					loopList_store.add([{
								'col' : '',
								'mapping' : '',
								'type' : 'String',
								'isnull' : true
							}]);
					

				}
			}, {
				text : '删除',
				scale : 'small',
				icon : 'images/shanchu.png',
				width : 50,
				handler : function() {
					var win_form_grid_loop = this.ownerCt.ownerCt;
					if (win_form_grid_loop.selModel.selected.length > 0) {
						loopList_store
								.remove(win_form_grid_loop.selModel
										.getSelection());
					}
				}
				
			}];
	return looptbar;
}


/**
 * 复杂属性的Map<ComboboxString,String> 用于FixFieldsAdd(设置字段的固定值)的窗口
 */
function map_kComboboxString_vString(fieldName, label) {

	var win_buttons = [{
				text : '确定',
				handler : function() {
					if (validatemssIsTheSameOrIsNull(win_grid_store)) {
						return false;
					}
					var rp = getCmp('right_propertyGrid');
					if (win_grid_store.getCount() != 0) {
						rp.setProperty(fieldName, storeToJSON(win_grid_store));
						// 点击确定按钮直接保存
						Ext.getCmp('saveRightProperties').handler();
					} else {
						rp.setProperty(fieldName, '点此编辑');
					}
					win.close();
				}
			}, {
				text : '取消',
				handler : function() {
					win.close();
				}
			}];

	function win_gridEdit(record, index) {
		function win_Value_btn() {
			record.data.value = win_Value_form.getValues().propertyValue;
			win_grid_store.removeAt(index);
			win_grid_store.insert(index, record)
			win_Value.close();
		}
		var win_Value_form = Ext.create('Ext.form.Panel', {
					border : 0,
					items : [{
								xtype : 'textarea',
								name : 'propertyValue',
								width : 788,
								height : 382,
								value : record.data.value
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
	if (v != null && v != '点此编辑' && '' != v)
		vj = Ext.decode(v);
	var win_grid_store = Ext.create('Ext.data.Store', {
				model : 'KeyValue',
				data : vj,
				autoLoad : false
			});
	var win_grid_item = [{
				text : '新增',
				icon : 'images/add.png',
				scale : 'small',
				width : 50,
				handler : function() {
					var r = Ext.ModelManager.create({
								key : '',
								value : ''
							}, 'KeyValue');
					win_grid_store.insert(win_grid_store.getCount(), r);
					var row = win_grid_store.getCount() - 1;
					win_grid_pluginCellEdit.startEditByPosition({
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
						var delkey = win_grid_store.getAt(gridIndex).data.key;
						if (delkey == 'mule.adapter.thing-name'
								|| delkey == 'mule.data.import.table-name'
								) {
							Ext.Msg
									.alert(
											'删除失败',
											'mule.adapter.thing-name和mule.data.import.table-name必须存在！！！');
						} else {
							win_grid_item_btnDelHandler();
						}
					}
				}
			}, {
				text : '编辑值',
				scale : 'small',
				icon : 'images/xiugai.png',
				width : 80,
				handler : function() {
					var record = win_grid._record, index;
					if (record != null) {
						index = win_grid._index;
						win_gridEdit(record, index);
					}
				}
			}];

	var gridIndex;

	function win_grid_item_btnDelHandler() {
		Ext.Msg.show({
					title : '删除',
					msg : win_grid_store.getAt(gridIndex).data.key,
					buttons : Ext.Msg.YESNO,
					fn : function(type) {
						if ('yes' == type) {
							win_grid_store.removeAt(gridIndex);
							gridIndex = undefined;
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

	var win_grid_pluginCellEdit = Ext.create('Ext.grid.plugin.CellEditing', {
				clicksToEdit : 1,
				listeners : {
					beforeedit : function(record) {
						gridIndex = record.rowIdx;
					}
				}
			});

	var win_grid = Ext.create('Ext.grid.Panel', {
				autoScroll : true,
				firstCheck : true,
				selModel : win_grid_CheckboxModel,
				store : win_grid_store,
				tbar : {
					items : win_grid_item
				},
				columns : [{
					header : '键',
					dataIndex : 'key',
					flex : 4,
					sortable : false,
					menuDisabled : true,
					field : {
						xtype : 'combobox',
						name : 'key',
						store : ['mule.adapter.thing-name',
								'mule.data.import.table-name',
								'mule.adapter.op-plan',
								'mule.adapter.id-fields',
								'mule.adapter.auto-delete-unknown-detail']
					}
				}, {
					header : '值',
					dataIndex : 'value',
					sortable : false,
					menuDisabled : true,
					flex : 6,
					field : 'textfield'
				}],
				plugins : [win_grid_pluginCellEdit],
				height : 386
			});

	var win = Ext.create('Ext.Window', {
				title : label,
				width : 800 * bokedee_width,
				height : 450 * bokedee_height,
				draggable : false,
				autoScroll : true,
				resizable : false,
				modal : true,
				buttons : win_buttons,
				items : [win_grid]
			});

	win.show();
}