/**
 * 创建公共的combox
 * @param {Object} comboStoreName
 * @param {Object} storeJson
 * @param {Object} selectedValue
 * @param {Object} AttrName
 * @param {Object} loacalComboId
 * @param {Object} cascadeComboId
 * @return {TypeName} 
 */
function CreateCombox(comboStoreName, storeJson, selectedValue, AttrName,
		loacalComboId, cascadeComboId) {
	
	var c = Ext.create('Ext.form.ComboBox', {
		editable : false,
		displayField : "text",
		valueField : "id",
		value : selectedValue,
		queryMode : "local",
		autoSelect : false,
		allowBlank : false
	});

	if ('comboxBoolean' == comboStoreName) {
		c.store = comboxBoolean;
	} else if ('comboxHttpMethod' == comboStoreName) {
		c.store = comboxHttpMethod;
	} else if ('comboxHttpContentType' == comboStoreName) {
		c.store = comboxHttpContentType;
	} else if ('comboxTranscationType' == comboStoreName) {
		c.store = comboxTranscationType;
	} else if ('comboExchangeType' == comboStoreName) {
		c.store = comboExchangeType;
	}else if ('comboxProLanguage' == comboStoreName) {
		c.store = comboxProLanguage;
	}else if ('comboxScopeType' == comboStoreName) {
		c.store = comboxScopeType;
	}else if ('comboxStringStreamByteType' == comboStoreName) {
		c.store = comboxStringStreamByteType;
	}else if ('comboxExcelType' == comboStoreName) {
		c.store = comboxExcelType;
	}else {
		if (loacalComboId) {
			c.id = loacalComboId;
		}
		if (cascadeComboId) {
			c.cascadeComboId = cascadeComboId;
			c.AttrName = AttrName;
			c
					.addListener(
							'select',
							function(com, record) {
								var id = com.getValue();
								getCmp('right_propertyGrid').comboxFlag[com.AttrName] = com.store;
								Ext.Ajax
										.request( {
											url : 'interfaceInfoFindController.do',
											params : {
												actionType : 'findJdbcQuery',
												id : id
											},
											success : function(response) {
												var rpg = getCmp('right_propertyGrid');
												var ComboxJDBCQueryStore;
												var ssj;
												for ( var j in rpg.cascadeFlag) {
													if (rpg.cascadeFlag[j] == com.cascadeComboId
															&& j != com.AttrName) {
														ComboxJDBCQueryStore = rpg.comboxFlag[j];
														ssj = j;
													}
												}
												ComboxJDBCQueryStore
														.removeAll();
												var result = response.responseText;
												var j = Ext.decode(result);
												ComboxJDBCQueryStore
														.add(j.root);
												rpg
														.setProperty(
																ssj,
																ComboxJDBCQueryStore
																		.getAt(0).data.text);
											},
											failure : function() {
												Ext.Msg.alert('出错了',
														response.responseText);
											}
										});
							})
		} else {
			c
					.addListener(
							'select',
							function(com, record) {
								getCmp('right_propertyGrid').comboxFlag[com.AttrName] = com.store;
							})
		}
		if(storeJson){
			var jsonObj = Ext.decode(storeJson);
			c.store = Ext.create("Ext.data.Store", {
				model : 'Combox',
				data : [],
				proxy : {
					type : 'memory',
					reader : {
						type : 'json',
						root : 'items'
					}
				}
			});
			c.store.add(jsonObj.items);
		}
	}
	return c;
}
/**
 * 通用的级联方法
 * @param {Object} storeJson
 * @param {Object} selectedValue
 * @param {Object} AttrName
 * @param {Object} loacalComboId
 * @param {Object} cascadeComboId
 * @param {Object} CascadeType
 * @return {TypeName} 
 */
function CreateCascadeCombox(storeJson, selectedValue,
		AttrName, loacalComboId, cascadeComboId, cascadeType) {

	var c = Ext.create('Ext.form.ComboBox', {
		editable : false,
		displayField : "text",
		valueField : "id",
		value : selectedValue,
		queryMode : "local",
		autoSelect : false,
		allowBlank : false
	});
	if (loacalComboId) {
		c.id = loacalComboId;
	}
	if (cascadeComboId) {
		c.cascadeComboId = cascadeComboId;
		c.AttrName = AttrName;
		c.addListener('select', function(com, record) {
			var id = com.getValue();
			getCmp('right_propertyGrid').comboxFlag[com.AttrName] = com.store;
			Ext.Ajax.request( {
				url : 'interfaceInfoFindController.do',
				params : {
					actionType : AttrName,//用级联的
					id : id,
					type : cascadeType
				},
				success : function(response) {
					var rpg = getCmp('right_propertyGrid');
					var ComboxStore;
					var ssj;
					for ( var j in rpg.cascadeFlag) {
						if (rpg.cascadeFlag[j] == com.cascadeComboId
								&& j != com.AttrName) {
							ComboxStore = rpg.comboxFlag[j];
							ssj = j;
						}
					}
					ComboxStore.removeAll();
					var result = response.responseText;
					var j = Ext.decode(result);
					ComboxStore.add(j.root);
					rpg.setProperty(ssj,
							ComboxStore.getAt(0).data.text);
				},
				failure : function(response) {
					Ext.Msg.alert('出错了', response.responseText);
				}
			});
		})
	} else {
		c.addListener('select', function(com, record) {
			getCmp('right_propertyGrid').comboxFlag[com.AttrName] = com.store;
		})
	}
	var jsonObj = Ext.decode(storeJson);
	c.store = Ext.create("Ext.data.Store", {
		model : 'Combox',
		data : [],
		proxy : {
			type : 'memory',
			reader : {
				type : 'json',
				root : 'items'
			}
		}
	});
	c.store.add(jsonObj.items);
	return c;
}