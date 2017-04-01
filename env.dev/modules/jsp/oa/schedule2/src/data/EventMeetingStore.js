Ext.define('Ext.calendar.data.EventMeetingStore', {
	extend: 'Ext.data.Store',
	model: 'Ext.calendar.data.EventMeeting',
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
		property: 'CalendarId',
		direction: 'DESC'
	}],
	listeners :{   
	    'beforeload' :{   
	        fn : function(thiz,options){  
	            Ext.apply(thiz.proxy.extraParams, Ext.getCmp('search_form').form.getValues());    
	        }   
	    }   
	}
});
