Ext.define('Ext.calendar.view.MeetingGrid1', {
	extend: 'Ext.Container',
	requires: ['Ext.calendar.view.Paging', 'Ext.calendar.data.Meeting', 'Ext.calendar.data.MeetingStore1'],
	initComponent: function () {
		var me, limit;
        (me = this, limit = 10);
		
		var store = Ext.create('Ext.calendar.data.MeetingStore1',{
			pageSize: limit
		});

		me.meeting_grid = Ext.create('Ext.grid.Panel', {
            id: 'meeting_grid',
            frame: true,
             height: Ext.getBody().getViewSize().height - 40,
            forceFit: true,
            stripeRows: true,
            store: store,
			columns: [{
                header: '会议主题',
                dataIndex: 'title',
                width: 170
            }, {
                header: '创建人',
                dataIndex: 'createname'
            }, {
                header: '创建部门',
                dataIndex: 'createdept'
            }, {
                header: '开始时间',
                dataIndex: 'startdt'
            }, {
                header: '结束时间',
                dataIndex: 'enddt'
            }, {
                header: '是否全天',
                dataIndex: 'ad',
                renderer: function (value, meta, record) {
                    var allday = record.get('ad');
					var str = allday == '1' ? '全天' : '非全天';
                    return str;
                }
            }],
			dockedItems: new Ext.calendar.view.Paging({
                store: store,
                _limit: limit
            }),
			listeners: {
				'itemdblclick': function (grid, record) {
					
				}
			}
		});
		
		Ext.apply(this, {
            width: '100%',
            resizable: false,
            baseCls: 'x-plain',
            items: [me.meeting_grid]
        });

        me.callParent(arguments);
	}
});