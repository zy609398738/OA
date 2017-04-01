Ext.define('Ext.calendar.view.MeetingGrid', {
	extend: 'Ext.Container',
	requires: ['Ext.calendar.util.CustomPaging', 'Ext.calendar.data.EventMeeting', 'Ext.calendar.data.EventMeetingStore', 'Ext.calendar.form.EventDetails'],
	initComponent: function () {
		var me, limit;
        (me = this, limit = 10);
		
		var store = Ext.create('Ext.calendar.data.EventMeetingStore',{
			pageSize: limit
		});
		
		me.search_form = Ext.create('Ext.form.Panel', {
			id: 'search_form',
			frame: true,
			bodyStyle: 'padding:20px 20px 10px;',
			border: false,
			layout: {
				type: 'table',
				columns: 4
			},
			items: [{
				xtype: 'roomcombo',
				id: 'search_type',
				fieldLabel: '日程类型',
				name: 'Calendartype',
				emptyText: '日程类型',
				allowBlank: false
			}, {
				xtype: 'button',
				text: '查询',
				style: 'margin-left: 30px',
				handler: function(){
					var form = Ext.getCmp('search_form').getForm();
					if(!form.isValid()){
						return;
					}
					Ext.getCmp('pagingTool').moveFirst();
				}
			}]
		});

		var combo_store = Ext.getCmp('search_type').getStore();
		
		me.meeting_grid = Ext.create('Ext.grid.Panel', {
            id: 'meeting_grid',
            frame: true,
            height: Ext.getBody().getViewSize().height - 103,
            forceFit: true,
            stripeRows: true,
            store: store,
			columns: [{
                header: '日程主题',
                dataIndex: 'Title',
                width: 170
            }, {
                header: '日程类型',
                dataIndex: 'Calendartype',
                renderer: function(val) {
         			//循环遍历st中数据里的集合
			     	for (var i = 0; i < combo_store.data.items.length; i++) {
			      		//如果索引相同
			      		if (combo_store.data.items[i].data.id == val) {
			       			//返回数据集合里displayField中的值
			       			return combo_store.data.items[i].data.dsc;
			       		}
			      	}
				}
            },{
                header: '创建人',
                dataIndex: 'Createname'
            }, {
                header: '创建部门',
                dataIndex: 'Createdept'
            }, {
                header: '开始时间',
                dataIndex: 'StartDate'
            }, {
                header: '结束时间',
                dataIndex: 'EndDate'
            }, {
                header: '日程内容',
                dataIndex: 'Matter'
            },{
                header: '是否全天',
                dataIndex: 'IsAllDay',
                renderer: function (value, meta, record) {
                    var allday = record.get('IsAllDay');
					var str = allday == '1' ? '全天' : '非全天';
                    return str;
                }
            }],
			dockedItems: new Ext.calendar.util.CustomPaging({
                dock: 'bottom',
                store: store,
                displayInfo: true
            }),
			/*listeners: {
				'itemdblclick': function (grid, record) {
					var win = Ext.create('Ext.window.Window', {
						id: 'mywin',
						width: 900,
						layout: 'fit',
						title: '修改日程',
						items: [{
							xtype: 'eventeditform',
							id: 'app-calendar-edit'
						}]
					}).show();
					var form = Ext.getCmp('app-calendar-edit');
					form.loadRecord(record);
				}
			}
			*/
		});
		
		Ext.apply(this, {
            width: '100%',
            resizable: false,
            baseCls: 'x-plain',
            items: [me.search_form, me.meeting_grid]
        });

        me.callParent(arguments);
	}
});