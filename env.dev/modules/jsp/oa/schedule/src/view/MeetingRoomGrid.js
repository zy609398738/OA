Ext.define('Ext.calendar.view.MeetingRoomGrid', {
	extend: 'Ext.Container',
	requires: ['Ext.calendar.util.CustomPaging',
			   'Ext.calendar.data.MeetingRoom', 
			   'Ext.calendar.data.MeetingRoomStore',
			   'Ext.calendar.form.field.MeetingRoomForm'],
			   
	initComponent: function () {
		var me, limit;
        (me = this, limit = 10);
		
		var store = Ext.create('Ext.calendar.data.MeetingRoomStore',{
			pageSize: limit
		});
	
		me.meetingroom_grid = Ext.create('Ext.grid.Panel', {
            id: 'meetingroom_grid',
            height: Ext.getBody().getViewSize().height - 42,
            frame: true,
            forceFit: true,
            stripeRows: true,
            store: store,
			columns: [
			{
				xtype: 'rownumberer',
				header: '序号',
				width: 15
			}, {
                header: '日程类别',
                dataIndex: 'typename'
            }, {
                header: '类别描述',
                dataIndex: 'typerece',
                width: 170
            }],
            tbar: Ext.create('Ext.toolbar.Toolbar', {
                items: [{
                    text: '添加',
                    id: 'addBtn',
                    name: 'addBtn',
                    cls: 'x-btn-text-icon',
                    handler: function () {
                    	var add_form = new Ext.calendar.form.field.MeetingRoomForm();
                    	var win = Ext.create('Ext.window.Window', {
                    		id: 'mywin',
						    width: 900,
						    layout: 'fit',
							title: '添加日程类别',
						    resizable: false,
						    modal: true,
						    items: [add_form]
                    	}).show();
						var form = Ext.getCmp('add_form').getForm();
						form.url = '/Yigo/addType.action';
                    }
					
                }, {
					text: '删除',
					id: 'delBtn',
					name: 'delBtn',
					cls: 'x-btn-text-icon',
					handler: function(){
						var record = Ext.getCmp('meetingroom_grid').getSelectionModel().getSelection();// 获取当前grid的选中项
						if (record.length != 0){ // 如果选中多个则把id拼接成为一个字符串					
							var id = record[0].data.id;
							Ext.Msg.confirm('确认删除', '你确定删除该条记录？', function(btn) {
								if (btn == 'yes') {
									Ext.Ajax.request({
										url : '/Yigo/deleType.action',//删除的url
										params : {
											id : id
										},
										success : function() {
											Ext.Msg.alert('信息框', '删除成功！',function() {
												Ext.getCmp('meetingroom_grid').getStore().load();
											})
										},
										failure : function() {
											Ext.Msg.show({
												title : '错误提示',
												msg : '删除时发生错误!',
												buttons : Ext.Msg.OK,
												icon : Ext.Msg.INFO
											});
										}
									});
								}
							});
						}
					}
				}]
            }),
			dockedItems: new Ext.calendar.util.CustomPaging({
                dock: 'bottom',
                store: store,
                displayInfo: true
            }),
			listeners: {
				'itemdblclick': function (grid, record) {
					var add_form = new Ext.calendar.form.field.MeetingRoomForm();
					var win = Ext.create('Ext.window.Window', {
						id: 'mywin',
						width: 900,
						layout: 'fit',
						title: '修改日程类别',
						items: [add_form]
					}).show();
					var form = Ext.getCmp('add_form').getForm();
					form.url = '/Yigo/updateType.action?id=' + record.get('id');
					form.loadRecord(record);
				},
				'cellclick': function(grid, rowIndex, columnIndex, e) {   
					if(columnIndex == 4){
						var rec = e.data;
						var panel = Ext.getCmp('newPage');
						if (panel) {
							panel.destroy();
						}
						panel = {
							title: rec.room,
							id: 'newPage',
							alias: 'widget.newpage',
							items: [Ext.create('Ext.calendar.view.RoomDetail', {_id: rec.id})],
							closable: true
						}
						var main = Ext.getCmp("content-panel");
						var p = main.add(panel);
						main.setActiveTab(p);
					}
				}
			}
		});
		
		Ext.apply(this, {
            width: '100%',
            resizable: false,
            baseCls: 'x-plain',
            items: [me.meetingroom_grid]
        });

        me.callParent(arguments);
	}
});