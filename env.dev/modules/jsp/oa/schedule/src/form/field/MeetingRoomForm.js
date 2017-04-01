Ext.define('Ext.calendar.form.field.MeetingRoomForm', {
	extend: 'Ext.Container',
	
	initComponent: function () {
		var me = this;
		var img_reg = /[^\s]*\.(jpg|gif|png|bmp)/i;
		var SERVER = /^\/(\w+)\/?/.exec(decodeURI(location.pathname))[1];
		var SERVER_URL = [location.protocol, '//', location.host, '/', SERVER].join('');
		
		me.add_form = Ext.create('Ext.form.Panel', {
            id: 'add_form',
            bodyPadding: 5,
			collapsible: true,
            frame: true,
            border: false,
            baseCls: 'x-plain',
			enctype: 'multipart/form-data',  
			fileUpload : true, 
			buttonAlign: 'center',
            fieldDefaults: {
                labelAlign: 'right',
                labelWidth: 130
            },
			items: [{
				xtype: 'container',
				anchor: '100%',
				layout: 'hbox',
				items:[{
					xtype: 'container',
					flex: 1,
					layout: 'anchor',
					items: [{
						xtype:'textfield',
						fieldLabel: '日程类别',
						readOnly: me._type == 'room' ? true : false,
						allowBlank: false,
						id: 'typename',
						name:'typename',
						anchor:'90%'
					}, {
						xtype: 'textarea',
						fieldLabel: '日程类别描述',
						readOnly: me._type == 'room' ? true : false,
						id: 'typerece',
						name: 'typerece',
						anchor: '90%'
					}]
				}]
			}],
			buttons: [{
                text: '提交',
				hidden: me._type == 'room' ? true : false,
                handler: function () {
					var form = Ext.getCmp('add_form').getForm();
					Ext.getCmp('menuinfo').store.load();
					if (!form.isValid()) {
                        return;
                    }
					form.submit({
						method: 'POST',
						waitMsg: '请稍等,数据正在保存中...', //form表单蒙版通过waitMsg设置
						success: function (form, action) {
							if(action.result.success){
								Ext.MessageBox.alert('提示', action.result.msg);
								Ext.getCmp('menuinfo').store.load();
								Ext.getCmp('meetingroom_grid').getStore().load();
								Ext.getCmp('mywin').close();
							}
						},
						failure: function (form, action) {
							Ext.MessageBox.alert('提示', '添加失败!');
						}
					});
				}
			}, {
				text: '取消',
				hidden: me._type == 'room' ? true : false,
				handler: function(){
					this.up('window').close();
				}
			}]
			});
		
		Ext.apply(this, {
            width: '100%',
            resizable: false,
            baseCls: 'x-plain',
            items: [me.add_form]
        });		
        me.callParent(arguments);
	}
})