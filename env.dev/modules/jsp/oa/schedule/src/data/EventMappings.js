//@define Ext.calendar.data.EventMappings
/**
 * @class Ext.calendar.data.EventMappings
 * @extends Object
 * A simple object that provides the field definitions for Event records so that they can be easily overridden.
 */
Ext.ns('Ext.calendar.data');

Ext.calendar.data.EventMappings = {
    EventId: {
        name: 'EventId',
        mapping: 'id',
        type: 'int'
    },
    CalendarId: {
        name: 'CalendarId',
        mapping: 'cid',
        type: 'int'
    },
    Title: {
        name: 'Title',
        mapping: 'title',
        type: 'string'
    },
    Type: {
	    name: 'Type',
	    mapping: 'type'
	},
	Calendartype: {
	    name: 'Calendartype',
	    mapping: 'calendartype'
	},
	Createname: {
	    name: 'Createname',
	    mapping: 'createname'
	},
	Createdept: {
	    name: 'Createdept',
	    mapping: 'createdept'
	},
	Createdate: {
	    name: 'Createdate',
	    mapping: 'createdate'
	},
    StartDate: {
        name: 'StartDate',
        mapping: 'startdt',
        type: 'date',
        dateFormat: 'c'
    },
    EndDate: {
        name: 'EndDate',
        mapping: 'enddt',
        type: 'date',
        dateFormat: 'c'
    },
    Meetingroom: {
	    name: 'Meetingroom',
	    mapping: 'meetroom'
	},
	Meetingrece: {
	    name: 'Meetingrece',
	    mapping: 'meetrece'
	},
	Moderator: {
	    name: 'Moderator',
	    mapping: 'moderator'
	},
	Recorder: {
	    name: 'Recorder',
	    mapping: 'recorder'
	},
	Participants: {
	    name: 'Participants',
	    mapping: 'participants '
	},
	Matter: {
	    name: 'Matter',
	    mapping: 'matter'
	},
    Location: {
        name: 'Location',
        mapping: 'loc',
        type: 'string'
    },
    Notes: {
        name: 'Notes',
        mapping: 'notes',
        type: 'string'
    },
    Url: {
        name: 'Url',
        mapping: 'url',
        type: 'string'
    },
    IsAllDay: {
        name: 'IsAllDay',
        mapping: 'ad',
        type: 'boolean'
    },
    Reminder: {
        name: 'Reminder',
        mapping: 'rem',
        type: 'string'
    },
    ReminderType: {
        name: 'ReminderType',
        mapping: 'remtype',
        type: 'string'
    },
    IsNew: {
        name: 'IsNew',
        mapping: 'n',
        type: 'boolean'
    },
    Content: {
        name: 'Content',
        mapping: 'content',
        type: 'string'
    },
    Begin: {
        name: 'Begin',
        mapping: 'begin',
        type: 'string'
    },
    End: {
        name: 'End',
        mapping: 'end',
        type: 'string'
    }
};
