(function () {
	YIUI.Print = {
		print: function(url, formID) {
			var iframe = $("iframe[id='print_" + formID + "']", document.body);
            iframe.remove();
		//	if(iframe.length == 0) {
				var iframe = $("<iframe class='print' src='"+url+"' style='display:none;'></iframe>").attr("id", "print_" + formID);
	   			iframe.appendTo($(document.body));
		//	}
   			var win = iframe[0].contentWindow;
   			
   			win.print();
		},
		del: function(formID) {
			var iframe = $("iframe[id='print_" + formID + "']", document.body);
   			iframe.remove();
		},
		delAll: function() {
			$("iframe.print").remove();
		}
	};
    YIUI.PrintPreview = function (opts) {
    	var el = $("<div/>");
    	var url = opts.url;
    	var target = opts.target;
    	var formKey = opts.formKey;
    	var Return = {
			init: function() {
				if(target == "self") {
					el.modalDialog(null, {title: YIUI.I18N.attachment.preview, showClose: false, width: "80%", height: "80%"});
					el.dialogContent().attr("id", "print-ct");
					//PDF预览
					var pdf = new PDFObject({url: url}).embed("print-ct");
					
				} else {
					window.open(url);
				}
			},
			setHeight: function(height) {
				el.css("height", height);
			}
    	};
    	Return.init();
    }
})();