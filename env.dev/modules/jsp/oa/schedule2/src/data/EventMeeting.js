Ext.define('Ext.calendar.data.EventMeeting', {
        extend: 'Ext.data.Model',
        fields: [{
			name: 'CalendarId',
			type: 'string'
		}, {
			name: 'Title',
			type: 'string'
		}, {
			name: 'Calendartype',
			type: 'string'
		}, {
			name: 'Createname',
			type: 'string'
		}, {
			name: 'Createdept',
			type: 'string'
		}, {
			name: 'Createdate',
			type: 'string'
		}, {
			name: 'StartDate',
			type: 'string'
		}, {
			name: 'EndDate',
			type: 'string'
		}, {
			name: 'IsAllDay',
			type: 'string'
		}, {
			name: 'Matter',
			type: 'string'
		}],
        idProperty: 'CalendarId'
    });