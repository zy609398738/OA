//会议类型
Ext.define("Ext.calendar.form.field.MeetingType", {
    extend: 'Ext.form.field.ComboBox',
    requires: [
        'Ext.calendar.data.MeetingTypeStore'
    ],
    alias: 'widget.meeetingType',
    store: Ext.create('Ext.calendar.data.MeetingTypeStore'),
    queryMode: 'local',
    displayField: 'dsc',
    valueField: 'id'
});
