Ext.define('Ext.calendar.data.Calendars', {
    statics: {
        getData: function(){
            return {
                "calendars":[{
                    "id" : 1,
                    "title" : "我发起的"
                },{
                    "id" : 2,
                    "title" : "我参与的"
                },{
                    "id" : 3,
                    "title": "共享我的"
                },{
					"id" : 4,
					"title" : "过期的"
				},{
					"id" : 5,
					"title" : "正在审批的"
				}]
            };    
        }
    }
});