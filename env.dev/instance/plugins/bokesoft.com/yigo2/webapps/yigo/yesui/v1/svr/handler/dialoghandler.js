YIUI.DialogHandler = (function () {
    var Return = {
		doOnClick: function (control, opt) {
	        var callback = control.getEvent(opt);
	        var excp = control.excp;

	        control.dialog.close();
	        if(callback){
	        	try {	
		        	callback(opt);
				} catch (e) {
					if(excp) {
						try {
							var form = control.getOwner();
							form.eval(excp, {form: form});
						} catch (t) {
						}
					}
					$.error(e.message);
				}
	        }
	    }

    };
    Return = $.extend({}, YIUI.Handler, Return);
    return Return;
})();
