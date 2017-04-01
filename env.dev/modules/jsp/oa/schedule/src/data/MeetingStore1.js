Ext.define('Ext.calendar.data.MeetingStore1', {
	extend: 'Ext.data.Store',
	model: 'Ext.calendar.data.Meeting',
	pageSize: 5,
	autoLoad : true,
	proxy : {
		type : 'ajax',
		url : '/Yigo/CalendarList.action',
		reader: {
            type: 'json',
            root : 'root',
            totalProperty: 'totalProperty'
        }
	},
	sorters: [{
		property: 'id',
		direction: 'DESC'
	}]
});
