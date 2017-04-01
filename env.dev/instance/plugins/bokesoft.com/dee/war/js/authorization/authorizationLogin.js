LoginPanel = function() {
    var win, f;
    var validateCode = {
		xtype : 'fieldcontainer',
		layout : 'hbox',
		items : [{
					width : 220,
					height : 22,
					xtype : 'textfield',
					id : 'code',
                    name : 'code',
                    fieldLabel : '验证码',
				},{  
                    xtype : 'panel',  
                    html : '<a href="javascript:void(0);"><img id="codeimage" src="validateCodeServlet" onclick="refreshCode()"/></a>',  
                    height : 22,
                    width : 100,
                    margins : '0 0 0 30',
                }]
	}
    var buildForm = function() {
        f = new Ext.form.FormPanel( {
            defaultType : 'textfield',
            id : 'loginForm',
            labelAlign : 'right',
            labelWidth : 100,
            labelPad : 0,
            frame : true,
            width : 500,
            defaults : {
            width : 350
            },
            items : [ {
            		id : 'username',
                    name : 'username',
                    fieldLabel : '用户名'
                },{
                	id : 'password',
                    name : 'password',
                    fieldLabel : '密码',
                    inputType: 'password'
                },validateCode]
        });
    };
    var buildWin = function() {
        win = new Ext.Window( {
            title : '登录',
            layout : 'column',
            closable:false,
            draggable : false,
			resizable : false,
            bodyStyle : 'overflow-x:hidden; overflow-y:hidden',
            defaults : {
                border : false
            },
            items : {
                columnWidth : 1,
                items : f
            },
            buttons : [ {
                    text : '登录',
                    handler : login
                },{
                    text : '重置',
                    handler : reset
                }, {
                    text : '注册帐号',
                    handler : link
                }]
        });
    };
    
    var login = function(){
    			var username = Ext.getCmp('username').value;
    			var password = Ext.getCmp('password').value;
    			var code = Ext.getCmp('code').value;
    			if (null == username || '' == username) {
				Ext.Msg.alert('提示', '用户名不能为空！！！');
				return;
				}
    			if (null == password || '' == password) {
				Ext.Msg.alert('提示', '密码不能为空！！！');
				return;
				}
    			if (null == code || '' == code) {
				Ext.Msg.alert('提示', '验证码不能为空！！！');
				return;
				}
    			var o = Ext.getCmp('loginForm').getForm().submit({  
                                            url:'authorizationRegistrationController.do?actionType=loginAuthorizationUser', 
//                                            waitMsg : '正在进行登陆验证,请稍后...', 
                                            method : 'post',
                                            params : {
    											code : code,
                                            },
                                            success: function(form, action) {
                                                window.open('AuthorizationIndex.jsp','_self');
                                            },  
                                            failure: function(form, action) {  
                                            	var result = Ext.decode(action.response.responseText);
                                            	Ext.Msg.alert('失败', result.data);
                                            	Ext.getCmp("code").setValue('');
                                            	refreshCode();
                                            }  
                                        });
    };

    var reset = function() {
        f.form.reset();
    };
    
    var link = function() {
        window.open('AuthorizationUserRegistration.jsp', '_self')
    };
    
    return {
        init : function() {
            Ext.QuickTips.init();
            Ext.form.Field.prototype.msgTarget = 'side';
            buildForm();
            buildWin();
            win.show();
        }
    }
}();

function refreshCode(){
	var image = document.getElementById("codeimage");
	image.src = "validateCodeServlet?time = " + new Date();
}
// 当当前页面DOM加载完毕后,在LoginPanel作用域内执行LoginPanel.init.
Ext.onReady(LoginPanel.init, LoginPanel);