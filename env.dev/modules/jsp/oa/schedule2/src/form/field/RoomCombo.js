Ext.define("Ext.calendar.form.field.RoomCombo", {
	extend: 'Ext.form.field.ComboBox',
    alias: 'widget.roomcombo',
    store: Ext.create('Ext.calendar.data.RoomStore'),
    labelAlign: 'right',
   // queryMode: 'local',
    typeAhead: true,
    forceSelection: true,
    displayField: 'dsc',
    valueField: 'id',
	listeners: {
		'afterrender': function(thiz){
			thiz.store.load();
		},
        'keydown': function () {
            var id = Ext.getCmp('calendartype').getValue();
			Ext.Ajax.request({
				url : '/Yigo/getTypeDesc.action',
				params : {
					id : id
				},
				success : function (response) {
                    var data = Ext.decode(response.responseText); 
					//Ext.getCmp('typerece').setValue(data.roomdesc);
				},
				failure : function() {
				}
			});
        }
    }
});