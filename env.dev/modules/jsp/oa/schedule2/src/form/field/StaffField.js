Ext.define('Ext.calendar.form.field.StaffField', {
	extend: 'Ext.form.field.Trigger',
	alias: 'widget.staffield',
	multiselect : false,
	initComponent : function() {
		this.callParent(arguments);
	},
	onTriggerClick : function() {
		var me = this;
		var win = new Ext.window.Window({
			id : 'ext-meeting-multiselect',
			title : '选择人员',
			modal : true,
			width : 1000,
			closable: true,
			resizable : false,
			html : '<iframe src="../../oa-utils/select.jsp?electname='+this.name+'" width="1000" height="500" />'
		});

		win.show();
	},
	setValue : function(val, rawvalue) {
		if(this.multiselect) {
			if(!val) {
				val	= [];
			}
			if(Ext.isString(val)) {
				if(val.indexOf(',') == 0) {
					val = val.substring(1);
				}
				val = val.split(',');
			}
		}
		
		this.value = val;
		this.rawvalue = rawvalue;
		//Ext.ux.StaffField.superclass.setRawValue.call(this, this.rawvalue);
	},
	getValue : function() {
		return this.value;
	}
});