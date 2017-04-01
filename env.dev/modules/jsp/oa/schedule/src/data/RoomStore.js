Ext.define('Ext.calendar.data.RoomStore', {
    extend: 'Ext.data.Store',
    fields: ['id', 'dsc'],
    autoLoad: false,
    proxy: {
		type: 'ajax',
		url: '',//'/Yigo/getTypeCombo.action',
		reader: {
            type: 'json',
            root : 'items'
        },
	    actionMethods: { //设置为post提交
	        read: 'POST'
	    }
	},
	sorters: [{
        property: 'id',
        direction: 'ASC'
    }]
});