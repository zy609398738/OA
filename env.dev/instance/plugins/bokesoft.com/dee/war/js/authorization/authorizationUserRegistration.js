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
                    inputType : 'password',
                },{
                	id : 'repassword',
                    name : 'repassword',
                    fieldLabel : '确认密码',
                    inputType: 'password'
                },{
                	id : 'name',
                    name : 'name',
                    fieldLabel : '名称',
                },{
                	id : 'description',
                    name : 'description',
                    fieldLabel : '描述',
                    xtype:'textarea'
                },validateCode]
        });
    };
    var buildWin = function() {
        win = new Ext.Window( {
            title : '注册',
            layout : 'column',
            closeable:false,
            bodyStyle : 'overflow-x:hidden; overflow-y:hidden',
            defaults : {
                border : false
            },
            items : {
                columnWidth : 1,
                items : f
            },
            buttons : [ {
                    text : '注册',
                    handler : userregister
                },{
                    text : '重置',
                    handler : reset
                },{
                    text : '返回',
                    handler : function(){
            			window.open('AuthorizationLogin.jsp', '_self');
               			}
                }]
        });
    };
    var userregister = function(){
    			var username = Ext.getCmp('username').value;
    			var password = Ext.getCmp('password').value;
    			var repassword = Ext.getCmp('repassword').value;
    			var name = Ext.getCmp('name').value;
    			var description = Ext.getCmp('description').value;
    			var code = Ext.getCmp('code').value;
    			if (null == username || '' == username) {
				Ext.Msg.alert('提示', '用户名不能为空！！！');
				return;
				}
    			if (null == password || '' == password) {
				Ext.Msg.alert('提示', '密码不能为空！！！');
				return;
				}
    			if (password.length<6) {
				Ext.Msg.alert('提示', '密码至少需要6位！');
				return;
				}
    			if (repassword != password) {
				Ext.Msg.alert('提示', '两次输入的密码不相同！！！');
				return;
				}
    			if (null == repassword || '' == repassword) {
				Ext.Msg.alert('提示', '请再次输入密码！！！');
				return;
				}
    			if (null == code || '' == code) {
				Ext.Msg.alert('提示', '验证码不能为空！！！');
				return;
				}
				Ext.Ajax.request({
					url : 'authorizationRegistrationController.do?actionType=authorizationUserRegistration',
					params : {
								username : username,
								password : password,
								name : name,
								description : description,
								code : code
							 },
					success : function(response) {
						var result = Ext.decode(response.responseText);
						if(result.result == true){
							alert('注册成功！');
							window.open('AuthorizationLogin.jsp', '_self');
						}else{
							Ext.Msg.alert('失败', result.data);
							Ext.getCmp("code").setValue('');
                            refreshCode();
						}
					},
					failure : function(response) {
						Ext.Msg.alert('失败', response.responseText);
					}
					});
    };
    
    var reset = function() {
        f.form.reset();
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