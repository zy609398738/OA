Ext.define('Ext.calendar.data.PageStore', {
    extend: 'Ext.data.Store',
    fields: ['id', 'limit'],
    data: [{
        'id': 1,
        'limit': 5
    }, {
        'id': 2,
        'limit': 10
    }, {
        'id': 3,
        'limit': 20
    }, {
        'id': 4,
        'limit': 50
    }, {
        'id': 5,
        'limit': 100
    }, {
        'id': 6,
        'limit': 200
    }]
});