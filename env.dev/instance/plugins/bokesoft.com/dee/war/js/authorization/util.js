function changeToLogin() {
	Ext.Ajax.request({
					url : 'authorizationRegistrationController.do?actionType=ifSessionTimeOut',
					success : function(response) {
						//bodyLoadingMask.hide();
						var result = Ext.decode(response.responseText);
						if(result.sessionTimeOut == true){
							alert("登录超时， 请重新登录");
							window.location = "AuthorizationLogin.jsp";
							return;
						}
					}
				});
}

function changePanel(panel) {
	changeToLogin();
	center.removeAll();
	center.add(panel);
}

function doMenuClick(record) {
	var menuId = record.data.id;
	if ('userInfo' == menuId) {
		changePanel(authorizationuserpanel());
		Ext.Ajax.request( {
		url : 'authorizationRegistrationController.do?actionType=getGrade',
		success : function(response) {
			var result = Ext.decode(response.responseText);
			if (result.result == true) {
				var grade = result.data;
				if (grade >= 2) {
					Ext.getCmp('changeUserInfo').setVisible(true);
					Ext.getCmp('changePassword').setVisible(true);
				}
				if (grade == 5) {
					Ext.getCmp('addUser').setVisible(true);
					Ext.getCmp('changeUserInfo').setVisible(true);
					Ext.getCmp('changePassword').setVisible(true);
					Ext.getCmp('resetPassword').setVisible(true);
					Ext.getCmp('changeGrade').setVisible(true);
					Ext.getCmp('deleteUser').setVisible(true);
					Ext.getCmp('appSearch').setVisible(true);
				}
			} else {
				Ext.Msg.alert('失败', result.data);
			}
		},
		failure : function(response) {
			Ext.Msg.alert('失败', result.data);
		}
		});
	}else if('personalRegistrationApp' == menuId) {
		changePanel(authorizationregistrationapppanel());
		Ext.Ajax.request( {
			url : 'authorizationRegistrationController.do?actionType=getGrade',
			success : function(response) {
				var result = Ext.decode(response.responseText);
				if (result.result == true) {
					var grade = result.data;
					if (grade >= 3) {
						Ext.getCmp('addApp').setVisible(true);
						Ext.getCmp('updateApp').setVisible(true);
						Ext.getCmp('deleteApp').setVisible(true);
						Ext.getCmp('appAuthorizationUser').setVisible(true);
					}
				} else {
					Ext.Msg.alert('失败', result.data);
				}
			},
			failure : function(response) {
				Ext.Msg.alert('失败', result.data);
			}
		});
	}else if('personalAuthorizationApp' == menuId) {
		changePanel(authorizationapppanel());
		Ext.Ajax.request({
					url : 'authorizationRegistrationController.do?actionType=getGrade',
					success : function(response) {
						var result = Ext.decode(response.responseText);
						if(result.result == true){
							var grade = result.data;
							if(grade >= 4){
								Ext.getCmp('deleteAccesstoken').setVisible(true);
//								Ext.getCmp('cleanExpiredAccesstoken').setVisible(true);
							}
						}else{
							Ext.Msg.alert('失败', result.data);
						}
					},
					failure : function(response) {
						Ext.Msg.alert('失败', result.data);
					}
				});
	}else if('adminRegistrationApp' == menuId) {
		changePanel(registrationappsearchpanel());
	}else if('adminAuthorizationApp' == menuId) {
		changePanel(authorizationappsearchpanel());
	}
}

function convertTreeStoreToData(root) {
	var childNodes = root.childNodes;
	var children = [];
	function getData(node) {
		var data = {
			checked : node.data.checked,
			leaf : node.data.leaf,
			text : node.data.text,
			id : node.data.id,
			key : node.raw.key,
			actionType : node.raw.actionType
		}
		var childNodes1 = node.childNodes;
		if (childNodes1.length > 0) {
			data.children = [];
			for (var i in childNodes1) {
				data.children[i] = getData(childNodes1[i]);
			}
		}
		return data;
	}

	for (var i in childNodes) {
		children[i] = getData(childNodes[i]);
	}
	return children;
}