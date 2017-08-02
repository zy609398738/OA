YIUI.DialogHandler = (function () {
    var Return = {
		doOnClick: function (formID, formula, opt, callback) {
			var form = YIUI.FormStack.getForm(formID);
	        if(callback){
	        	try {	
		        	callback(opt);
				} catch (e) {
					if(formula) {
						try {
							var cxt = new View.Context(form);
							form.eval(formula, cxt);
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
