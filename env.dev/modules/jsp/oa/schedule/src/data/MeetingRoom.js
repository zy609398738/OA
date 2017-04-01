Ext.define('Ext.calendar.data.MeetingRoom', {
        extend: 'Ext.data.Model',
        fields: [{
			name: 'id',
			type: 'string'
		}, {
			name: 'typename',
			type: 'string'
		}, {
			name: 'typerece',
			type: 'string'
		}],
        idProperty: 'id'
    });