LoginPanel = function() {
  
    var win, f;
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
            		id : 'appkey',
                    name : 'appkey',
                    fieldLabel : '输入appkey'
                },{
            		id : 'redirecturl',
                    name : 'redirecturl',
                    fieldLabel : '输入回调地址'
                }]
        });
    };
    var buildWin = function() {
        win = new Ext.Window( {
            title : '登录',
            layout : 'column',
            bodyStyle : 'overflow-x:hidden; overflow-y:hidden',
            defaults : {
                border : false
            },
            items : {
                columnWidth : 1,
                items : f
            },
            buttons : [{
                    text : '登录到应用',
                    handler : link
                }]
        });
    };
    var link = function() {
    	var appkey = Ext.getCmp('appkey').value;
    	var redirecturl = Ext.getCmp('redirecturl').value;
        window.open('Authorization.jsp?response_type=code&client_id='+ appkey +'&redirect_uri='+redirecturl, '_self')
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
// 当当前页面DOM加载完毕后,在LoginPanel作用域内执行LoginPanel.init.
Ext.onReady(LoginPanel.init, LoginPanel);