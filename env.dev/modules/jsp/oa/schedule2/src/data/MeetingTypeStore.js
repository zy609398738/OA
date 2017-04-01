//会议类型
Ext.define('Ext.calendar.data.MeetingTypeStore', {
    extend: 'Ext.data.Store',
    fields: ['id', 'dsc'],
    data: [{
        'id': 'A',
        'dsc': '全体大会'
    }, {
        'id': 'B',
        'dsc': '研讨会'
    }, {
        'id': 'C',
        'dsc': '座谈会'
    }, {
        'id': 'D',
        'dsc': '月度会议'
    }, {
        'id': 'E',
        'dsc': '讲座'
    },{
        'id': 'F',
        'dsc': '部门会议'
    },{
        'id': 'G',
        'dsc': '周例会'
    },{
        'id': 'H',
        'dsc': '年度大会'
    }]
});
