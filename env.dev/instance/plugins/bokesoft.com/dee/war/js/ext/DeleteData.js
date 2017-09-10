/**
 * 在修改接口时删除服务的request
 * @param {Object} store
 * @param {Object} index
 * @param {Object} r
 */
function delServicesWhenUpdateInterfaceR(store, index, r) {
	var record = store.getAt(index);
	Ext.Ajax
			.request( {
				url : 'interfaceInfoSaveController.do',
				params : {
					actionType : 'delService',
					serviceId : record.data.id,
					interfaceId : r.data.id
				},
				success : function(response) {
					if ('success' == response.responseText) {
						store.removeAt(index);
						var left_accordion_jkpz_tree = getCmp('left_accordion_jkpz_tree');
						var left_accordion_jkpz_tree_store = left_accordion_jkpz_tree.store;
						left_accordion_jkpz_tree_store.getRootNode()
								.removeAll();
						left_accordion_jkpz_tree_store.load();
						Ext.Msg.alert('删除成功', '删除成功');
					} else {
						Ext.Msg.alert('删除失败', response.responseText);
					}
				},
				failure : function(response) {
					Ext.Msg.alert('删除失败', response.responseText);
				}
			});
}

/**
 * 在修改接口时删除服务
 * @return {TypeName} 
 */
function delServicesWhenUpdateInterface(store, index, r) {
	Ext.Msg.show( {
		title : '删除服务',
		msg : store.getAt(index).data.text,
		buttons : Ext.Msg.YESNO,
		fn : function(type) {
			if ('yes' == type) {
				delServicesWhenUpdateInterfaceR(store, index, r);
			}
		}
	})
}

/**
 * 删除Transformer的request
 * @param {Object} Iid
 * @param {Object} Sid
 * @param {Object} r
 */
function deleteProcessorR(Iid, Sid, r) {
	Ext.Ajax.request( {
		url : 'interfaceInfoSaveController.do',
		params : {
			actionType : 'delProcessor',
			serviceId : Sid,
			interfaceId : Iid,
			processorId : r.data['id']
		},
		success : function(response) {
			if ('success' == response.responseText) {
				getCmp('center_service').store.removeAll();
				getCmp('center_service').store.load();
				getCmp('center_service').p_sel_record = null;
				getCmp('center_service').s = false;
				Ext.Msg.alert('删除成功', '删除成功');
			} else {
				Ext.Msg.alert('删除失败', response.responseText);
			}
		},
		failure : function(response) {
			Ext.Msg.alert('删除失败', response.responseText);
		}
	});
}

/**
 * 删除Transformer
 * @param {Object} Iid
 * @param {Object} Sid
 * @param {Object} r
 */
function deleteProcessor(Iid, Sid, r) {
	Ext.Msg.show( {
		title : '删除提示',
		msg : '确实要删除 [' + r.data.smallType + '] >> [' + r.data.text + '] 吗',
		buttons : Ext.Msg.YESNO,
		fn : function(t) {
			if ('yes' == t) {
				deleteProcessorR(Iid, Sid, r);
			}
		}
	});
}

/**
 * 删除公共配置的request
 * 
 * @param {Object} r
 */
function deletePublicDeployR(r) {
	Ext.Ajax.request( {
		url : 'interfaceInfoSaveController.do',
		params : {
			actionType : 'delPublicDeploy',
			id : r.data['id'],
			type : r.data.bigType
		},
		success : function(response) {
			if ('success' == response.responseText) {
				getCmp('center_publicDeploy').store.removeAll();
				getCmp('center_publicDeploy').store.load();
				getCmp('center_publicDeploy').p_sel_record = null;
				right.hide();
				Ext.Msg.alert('删除成功', '删除成功');
			} else {
				Ext.Msg.alert('删除失败', response.responseText);
			}
		},
		failure : function(response) {
			Ext.Msg.alert('删除失败', response.responseText);
		}
	});
}

/**
 * 删除公共配置
 * 
 * @param {Object} r
 */
function deletePublicDeploy(r) {
	var type;
	var t = r.data.bigType;
	if ('Connector.json' == t) {
		type = "Connector";
	} else if ('SpringBean.json' == t) {
		type = "SpringBean";
	} else if ('DataSource.json' == t) {
		type = "DataSource";
	}
	Ext.Msg.show( {
		title : '删除提示',
		msg : '确实要删除[ ' + type + ' ] >> [ ' + r.data.text + ' ] 吗',
		buttons : Ext.Msg.YESNO,
		fn : function(t) {
			if ('yes' == t) {
				deletePublicDeployR(r, type);
			}
		}
	});
}

/**
 * 删除接口信息的request
 * @param {Object} store
 * @param {Object} oldData
 * @param {Object} newData
 */
function deleteInterfaceRequest(record) {
	Ext.Ajax
			.request( {
				url : 'interfaceInfoSaveController.do',
				params : {
					actionType : 'delInterface',
					interfaceId : record.data.id
				},
				success : function(response) {
					if ('success' == response.responseText) {
						getCmp('center_interface').store.removeAll();
						getCmp('center_interface').store.load();
						var left_accordion_jkpz_tree = getCmp('left_accordion_jkpz_tree');
						var left_accordion_jkpz_tree_store = left_accordion_jkpz_tree.store;
						left_accordion_jkpz_tree_store.getRootNode()
								.removeAll();
						getCmp('center_interface').p_sel_record = null;
						left_accordion_jkpz_tree_store.load();
						Ext.Msg.alert('删除结果', '删除成功');
					} else {
						Ext.Msg.alert('提示', response.responseText);
					}
				},
				failure : function() {
					Ext.Msg.alert('提示', '删除失败');
				}
			});
}

/**
 * 删除接口信息
 * @param {Object} store
 * @param {Object} oldData
 * @param {Object} newData
 */
function deleteInterface(record) {
	Ext.Msg.show( {
		title : '删除',
		msg : '你确定要删除接口：[' + record.data.text + ']吗?',
		buttons : Ext.Msg.YESNO,
		fn : function(type) {
			if ('yes' == type) {
				deleteInterfaceRequest(record);
			}
		}
	});
}
/**
 * 删除日志信息的request
 */
function deleteLogRequest(logType, data, interfaceName, id, index) {
	var array = new Array();
	for ( var i = 0; i < data.length; i++) {
		var row = data[i];
		array.push(row.data);
	}
	Ext.Ajax.request( {
		url : 'interfaceLogManagerController.do',
		params : {
			actionType : 'deleteLog',
			logType : logType,
			text : Ext.encode(array),
			interfaceName : interfaceName
		},
		success : function(response) {
			if ('success' == response.responseText) {
				Ext.Msg.alert('提示', '删除成功');
				getCmp(id).getStore().remove(index);
			} else {
				Ext.Msg.alert('提示', '删除失败');
			}
		},
		failure : function() {
			Ext.Msg.alert('提示', '删除失败');
		}
	});
}

/**
 * 批量删除日志信息
 */
function deleteLogs(logType, datas, interfaceName, id, indexs) {
	Ext.Msg.show( {
		title : '删除',
		msg : '你确定要删除所选的日志文件吗?',
		buttons : Ext.Msg.YESNO,
		fn : function(type) {
			if ('yes' == type) {
				deleteLogRequest(logType, datas, interfaceName, id,indexs);
			}
		}
	});
}

function deletePermissionRequest(id, type, index) {
	Ext.Ajax.request( {
		url : 'interfacePermissionManagerController.do',
		params : {
			actionType : 'deletePermission',
			id : id,
			type : type
		},
		success : function(response) {
			if ('success' == response.responseText) {
				Ext.Msg.alert('提示', '删除成功');
				if ('operator' == type) {
					getCmp('center_operatorList').store.removeAt(index);
				} else if ('role' == type) {
					getCmp('center_roleList1').store.removeAt(index);
					getCmp('center_roleManager').remove(1);
				}
			} else {
				Ext.Msg.alert('提示', '删除失败');
			}
		},
		failure : function() {
			Ext.Msg.alert('提示', '删除失败');
		}
	});
}
/**
 * 删除用户
 * @param {Object} record
 * @param {Object} type1
 *  @param {Object} index
 */
function deletePermission(record, type1, index) {
	var name;
	if ('operator' == type1) {
		name = record.data.loginname;
	} else if ('role' == type1) {
		name = record.data.rolename;
	}
	Ext.Msg.show( {
		title : '删除',
		msg : '你确定要删除用户：' + name + '?',
		buttons : Ext.Msg.YESNO,
		fn : function(type) {
			if ('yes' == type) {
				deletePermissionRequest(record.data.id, type1, index);
			}
		}
	});
}

function deleteBuildConfigRequest(interfaceListJson) {
	Ext.Ajax.request( {
		url : 'interfaceManageController.do',
		params : {
			actionType : 'build_del',
			interfaceList : interfaceListJson
		},
		success : function(response) {
			if ('success' == response.responseText) {
				Ext.Msg.alert('提示', '删除成功');
				getCmp('center_buildXML').store.load();
			} else {
				Ext.Msg.alert('提示', '删除失败');
			}
		},
		failure : function() {
			Ext.Msg.alert('提示', '删除失败');
		}
	});
}
/**
 * 删除以生成的xml文件
 *  @param {Object} interfaceListJson
 */
function deleteBuildConfig(interfaceListJson) {
	Ext.Msg.show( {
		title : '删除',
		msg : '确实要删除已生成的配置文件吗?',
		buttons : Ext.Msg.YESNO,
		fn : function(type) {
			if ('yes' == type) {
				deleteBuildConfigRequest(interfaceListJson);
			}
		}
	});
}

/**
 *删除交换中心 
 */
function deleteExchange(id,index) {
	Ext.Msg.show( {
		title : '删除',
		msg : '你确定要删除?',
		buttons : Ext.Msg.YESNO,
		fn : function(type) {
			if ('yes' == type) {
				deleteExchangeRequest(id,index);
			}
		}
	});
}
function deleteExchangeRequest(id,index) {
	Ext.Ajax.request( {
		url : 'interfaceExchangeCenterController.do',
		params : {
			actionType : 'deleteExchange',
			id : id
		},
		success : function(response) {
			if ('success' == response.responseText) {
				getCmp('exchangeList').store.removeAt(index);
				Ext.Msg.alert('提示', '删除成功');
			} else {
				Ext.Msg.alert('提示', '删除失败');
			}
		},
		failure : function() {
			Ext.Msg.alert('提示', '删除失败');
		}
	});
}

/**
*删除交换组群
*/
function deleteExchangeGroup(id,index) {
	Ext.Msg.show( {
		title : '删除',
		msg : '你确定要删除?',
		buttons : Ext.Msg.YESNO,
		fn : function(type) {
			if ('yes' == type) {
				deleteExchangeGroupRequest(id,index);
			}
		}
	});
}
function deleteExchangeGroupRequest(id,index) {
	Ext.Ajax.request( {
		url : 'interfaceExchangeCenterController.do',
		params : {
			actionType : 'deleteExchangeGroup',
			id : id
		},
		success : function(response) {
			if ('success' == response.responseText) {
				getCmp('exchangeListGroup').store.removeAt(index);
				Ext.Msg.alert('提示', '删除成功');
			} else {
				Ext.Msg.alert('提示', '删除失败');
			}
		},
		failure : function() {
			Ext.Msg.alert('提示', '删除失败');
		}
	});
}
/**
*删除ActionType
*/
function deleteExchangeActionType(id,index) {
	Ext.Msg.show( {
		title : '删除',
		msg : '你确定要删除?',
		buttons : Ext.Msg.YESNO,
		fn : function(type) {
			if ('yes' == type) {
				deleteExchangeActionTypeRequest(id,index);
			}
		}
	});
}
function deleteExchangeActionTypeRequest(id,index) {
	Ext.Ajax.request( {
		url : 'interfaceExchangeCenterController.do',
		params : {
			actionType : 'deleteExchangeActionType',
			id : id
		},
		success : function(response) {
			if ('success' == response.responseText) {
				getCmp('exchangeActionType').store.removeAt(index);
				Ext.Msg.alert('提示', '删除成功');
			} else {
				Ext.Msg.alert('提示','删除失败:'+ response.responseText);
			}
		},
		failure : function() {
			Ext.Msg.alert('提示', '删除失败');
		}
	});
}
/**
*删除接收事件
*/
function deleteExchangeEvent(id,index) {
	Ext.Msg.show( {
		title : '删除',
		msg : '你确定要删除?',
		buttons : Ext.Msg.YESNO,
		fn : function(type) {
			if ('yes' == type) {
				deleteExchangeEventRequest(id,index);
			}
		}
	});
}
function deleteExchangeEventRequest(id,index) {
	Ext.Ajax.request( {
		url : 'interfaceExchangeCenterController.do',
		params : {
			actionType : 'deleteExchangeEventOrCopy',
			id : id,
			data:true
		},
		success : function(response) {
			if ('success' == response.responseText) {
				getCmp('exchangeEvent').store.removeAt(index);
				Ext.Msg.alert('提示', '删除成功');
			} else {
				Ext.Msg.alert('提示', '删除失败');
			}
		},
		failure : function() {
			Ext.Msg.alert('提示', '删除失败');
		}
	});
}
/**
*删除备份查询
*/
function deleteExchangeCopy(id,index) {
	Ext.Msg.show( {
		title : '删除',
		msg : '你确定要删除?',
		buttons : Ext.Msg.YESNO,
		fn : function(type) {
			if ('yes' == type) {
				deleteExchangeCopyRequest(id,index);
			}
		}
	});
}
function deleteExchangeCopyRequest(id,index) {
	Ext.Ajax.request( {
		url : 'interfaceExchangeCenterController.do',
		params : {
			actionType : 'deleteExchangeEventOrCopy',
			id : id,
			data:false
		},
		success : function(response) {
			if ('success' == response.responseText) {
				getCmp('exchangeCopy').store.removeAt(index);
				Ext.Msg.alert('提示', '删除成功');
			} else {
				Ext.Msg.alert('提示', '删除失败');
			}
		},
		failure : function() {
			Ext.Msg.alert('提示', '删除失败');
		}
	});
}
/**
*删除定时任务
*/
function deleteTimingTask(id,index) {
	Ext.Msg.show( {
		title : '删除',
		msg : '你确定要删除?',
		buttons : Ext.Msg.YESNO,
		fn : function(type) {
			if ('yes' == type) {
				deleteTimingTaskRequest(id,index);
			}
		}
	});
}
function deleteTimingTaskRequest(id,index) {
	Ext.Ajax.request( {
		url : 'interfaceTimingTaskController.do',
		params : {
			actionType : 'deleteTimingTask',
			id : id
		},
		success : function(response) {
			if ('success' == response.responseText) {
				getCmp('taskList').store.removeAt(index);
				Ext.Msg.alert('提示', '删除成功');
			} else {
				Ext.Msg.alert('提示', '删除失败');
			}
		},
		failure : function() {
			Ext.Msg.alert('提示', '删除失败');
		}
	});
}
/**
*删除定时任务
*/
function deleteTimingTaskLog(array,index) {
	Ext.Msg.show( {
		title : '删除',
		msg : '你确定要删除?',
		buttons : Ext.Msg.YESNO,
		fn : function(type) {
			if ('yes' == type) {
				Ext.Ajax.request( {
							url : 'interfaceLogManagerController.do',
							params : {
								actionType : 'deleteTimingTaskLog',
								logPath : Ext.encode(array)
							},
							success : function(response) {
								if ('success' == response.responseText) {
									Ext.Msg.alert('提示', '删除成功');
									getCmp('headPanelTimingTask').store.remove(index);
								} else {
									Ext.Msg.alert('提示', '删除失败');
								}
							},
							failure : function() {
								Ext.Msg.alert('提示', '删除失败');
							}
						});
			}
		}
	});
}
/**
*删除webservicemapping
*/
function deleteWebServiceMapping(key,index) {
	Ext.Msg.show( {
		title : '删除',
		msg : '你确定要删除?',
		buttons : Ext.Msg.YESNO,
		fn : function(type) {
			if ('yes' == type) {
				Ext.Ajax.request( {
							url : 'interfaceInfoSaveController.do',
							params : {
								actionType : 'deleteWebserviceMapping',
								key : key
							},
							success : function(response) {
								if ('success' == response.responseText) {
									getCmp('center_publicDeploy').store.removeAt(index);
									Ext.Msg.alert('提示', '删除成功');
								} else {
									Ext.Msg.alert('提示', '删除失败');
								}
							},
							failure : function() {
								Ext.Msg.alert('提示', '删除失败');
							}
						});
			}
		}
	});
}
/**
*删除webservicemapping
*/

function deleteServletMapping(id,index) {
	Ext.Msg.show( {
		title : '删除',
		msg : '你确定要删除?',
		buttons : Ext.Msg.YESNO,
		fn : function(type) {
			if ('yes' == type) {
				bodyLoadingMask.show();
				Ext.Ajax.request( {
							url : 'interfaceInfoSaveController.do',
							params : {
								actionType : 'deleteSAMapping',
								id : id
							},
							success : function(response) {
								bodyLoadingMask.hide();
								if ('success' == response.responseText) {
									getCmp('center_publicDeploy').store.removeAt(index);
									Ext.Msg.alert('提示', '删除成功');
								} else {
									Ext.Msg.alert('提示', '删除失败');
								}
							},
							failure : function() {
								bodyLoadingMask.hide();
								Ext.Msg.alert('提示', '删除失败');
							}
						});
			}
		}
	});
}

/**
*删除vmFileImport
*/
function deleteVmFileImport(id,index) {
	Ext.Msg.show( {
		title : '删除',
		msg : '你确定要删除?',
		buttons : Ext.Msg.YESNO,
		fn : function(type) {
			if ('yes' == type) {
				bodyLoadingMask.show();
				Ext.Ajax.request( {
							url : 'interfaceInfoSaveController.do',
							params : {
								actionType : 'delPublicDeploy',
								type:'VmFileImport.json',
								id : id
							},
							success : function(response) {
								bodyLoadingMask.hide();
								if ('success' == response.responseText) {
									getCmp('center_publicDeploy').store.removeAt(index);
									Ext.Msg.alert('提示', '删除成功');
								} else {
									Ext.Msg.alert('提示', '删除失败');
								}
							},
							failure : function() {
								bodyLoadingMask.hide();
								Ext.Msg.alert('提示', '删除失败');
							}
						});
			}
		}
	});
}