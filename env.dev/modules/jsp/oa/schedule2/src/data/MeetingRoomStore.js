Ext.define('Ext.calendar.data.MeetingRoomStore', {
	extend: 'Ext.data.Store',
	model: 'Ext.calendar.data.MeetingRoom',
	pageSize: 5,
	autoLoad : true,
	proxy : {
		type : 'ajax',
		url : '/Yigo/queryType.action',
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
