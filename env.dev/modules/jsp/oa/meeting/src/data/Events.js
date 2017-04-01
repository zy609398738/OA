Ext.define('Ext.calendar.data.Events', {
    statics: {
        getData : function() {
			makeDate = function(d) {

					var date = new Date();
					if (d.indexOf(' ') != -1) {
						var day = d.split(' ')[0];
						var time = d.split(' ')[1];
						if (day.length >0 && day.indexOf('-') != -1) {
							var year = day.split('-')[0];
							var month = day.split('-')[1];
							var td = day.split('-')[2];
							date.setYear(year);
							date.setMonth(month - 1);
							date.setDate(td);
						}
						if (time.length > 0 && time.indexOf(':')!=-1) {
							var hour = time.split(':')[0];
							var minute = time.split(':')[1];
							date.setHours(hour);
							date.setMinutes(minute);
						}
					} else {
						if (d.indexOf('-') != -1) {
							var year = d.split('-')[0];
							var month = d.split('-')[1];
							var td = d.split('-')[2];
							date.setYear(year);
							date.setMonth(month - 1);
							date.setDate(td);
						}
					}
					return date;
	
			};
			var responseText;
			return Ext.Ajax.request({  
				async: false,
                url : '/yigo/meeting/meetingquery.action',  
                method : 'POST',  
                success : function(response) {
					responseText = response.responseText;
                },  
                failure : function() {  
                    Ext.Msg.alert("提示", "方法调用失败");  
                } 
			});
            return responseText;
        }
    }
});
