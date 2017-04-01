Ext.define('Ext.calendar.form.field.MeetingForm', {
	extend: 'Ext.Container',
	requires: [
        'Ext.calendar.form.field.DateRange',
        'Ext.calendar.form.field.ReminderCombo',
        'Ext.calendar.data.EventMappings',
        'Ext.calendar.form.field.CalendarCombo',
        'Ext.calendar.data.MeetingTypeStore',
        'Ext.calendar.form.field.MeetingType',
		'Ext.calendar.form.field.StaffField',
		'Ext.calendar.data.RoomStore',
		'Ext.calendar.form.field.RoomCombo'
    ],
	
	initComponent: function () {
		var me = this;
		
		me.titleField = new Ext.form.Text({
            fieldLabel: '会议主题',
            name: 'title',
            emptyText: '会议主题',
            allowBlank: false,
            anchor: '90%'
        });
        me.createnameField = new Ext.form.Text({
			id: 'Createname',
            fieldLabel: '创建人',
            name: 'createname',
            emptyText: '创建人',
            allowBlank: false,
            anchor: '50%' 
        });
        me.dateRangeField = new Ext.calendar.form.field.DateRange({
            fieldLabel: '开会时间',
            singleLine: false,
			name:'startdt',
            anchor: '90%'
        });
        me.meetingroomField = new Ext.calendar.form.field.RoomCombo({
			id: 'roomcombo',
            fieldLabel: '开会地点',
            name: 'meetingroom',
            allowBlank: false,
            anchor: '50%'
        });
        me.moderatorField = new Ext.calendar.form.field.StaffField({
            fieldLabel: '会议主持人',
            name: 'moderator',
            emptyText: '会议主持人',
          //  allowBlank: false,
            anchor: '50%'
        });
        me.typeField = new Ext.calendar.form.field.MeetingType({
            fieldLabel: '会议类型',
            name: 'meetingtype',
            emptyText: '会议类型',
            allowBlank: false,
            anchor: '50%'
        });
        me.createdeptField = new Ext.form.Text({
            fieldLabel: '创建部门',
            name: 'createdept',
            emptyText: '创建部门',
            allowBlank: false,
            anchor: '50%'
        });
        me.createdateField = new Ext.form.field.Date({
            fieldLabel: '创建时间',
            value: new Date(),
            name: 'createdate',
            emptyText: '创建时间',
            anchor: '50%'
        });
        me.reminderField = new Ext.calendar.form.field.ReminderCombo({
            fieldLabel: '提醒时间',
            name: 'remider',
            emptyText: '提醒时间',
            allowBlank: false,
            anchor: '50%'
        });
        me.meetingreceField = new Ext.form.Text({
			id:'meetingrece',
            fieldLabel: '会议资源',
            name: 'meetingrece',
            emptyText: '会议资源',
            allowBlank: false,
            anchor: '50%'
        });
        me.recorderField = new Ext.calendar.form.field.StaffField({
            fieldLabel: '会议纪要录入人员',
            name: 'recorder',
            emptyText: '会议纪要录入人员',
           // allowBlank: false,
            anchor: '50%'
        });
        me.notesField = new Ext.form.TextArea({
            fieldLabel: 'Notes',
            name: Ext.calendar.data.EventMappings.Notes.name,
            grow: true,
            growMax: 150,
            anchor: '100%'
        });
        me.locationField = new Ext.form.Text({
            fieldLabel: 'Location',
            name: Ext.calendar.data.EventMappings.Location.name,
            anchor: '100%'
        });
        me.urlField = new Ext.form.Text({
            fieldLabel: 'Web Link',
            name: Ext.calendar.data.EventMappings.Url.name,
            anchor: '100%'
        });
        me.repTypeField = new Ext.form.CheckboxGroup({
        	fieldLabel: '提醒方式',
            columns: 10,
            defaultType: 'checkboxfield',
            anchor: '100%',
            items: [{
            	boxLabel: '邮件提醒',
                inputValue: '1',
                id: 'ReminderType1'
            }, {
                boxLabel: '短信提醒',
                inputValue: '2',
                id: 'ReminderType2'
            }, {
                boxLabel: '待办提醒',
                inputValue: '3',
                id: 'ReminderType3'
            }, {
                boxLabel: 'OA小助手',
                inputValue: '4',
                id: 'ReminderType4'
            }]
        });

        var leftFields = [me.titleField, me.createnameField, me.dateRangeField, me.meetingroomField, me.moderatorField], 
            rightFields = [me.typeField, me.createdeptField, me.createdateField, me.reminderField, me.meetingreceField, me.recorderField];
			
		me.add_form = Ext.create('Ext.form.Panel', {
            id: 'add_form',
			collapsible: true,
            frame: true,
            baseCls: 'x-plain',
			fieldDefaults: {
				msgTarget: 'side',
				labelWidth: 65
			},
			bodyStyle: 'background:transparent;padding:20px 20px 10px;',
			border: false,
			buttonAlign: 'center',
			autoHeight: true,
			items: [{
				xtype: 'container',
				anchor: '100%',
				layout: 'hbox',
				items: [{
					xtype: 'container',
					flex: 1,
					layout: 'anchor',
					items: leftFields
				},{
					xtype: 'container',
					flex: 1,
					layout: 'anchor',
					items: rightFields
				}]
			}, me.repTypeField, {
				xtype: 'staffield',
				fieldLabel: '参会人员',
				name: 'participants',
				emptyText: '参会人员',
				anchor: '100%'
			}, {
				xtype: 'textarea',
				name: 'matter',
				fieldLabel: '会议内容',
				height: 200,
				anchor: '100%'
			}],
			buttons: [{
                text: '提交',
				hidden: me._type == 'room' ? true : false,
                handler: function () {
					var form = Ext.getCmp('add_form').getForm();
					if (!form.isValid()) {
                        return;
                    }
					form.submit({
						method: 'POST',
						waitMsg: '请稍等,数据正在保存中...', //form表单蒙版通过waitMsg设置
						success: function (form, action) {
							if(action.result.success){
								Ext.MessageBox.alert('提示', action.result.msg);
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
					me.up('window').close();
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