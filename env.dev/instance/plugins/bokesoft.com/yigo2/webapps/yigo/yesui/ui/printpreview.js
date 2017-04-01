(function () {
	YIUI.PrintURLs = {};
	YIUI.Print = {
		print: function(url, formKey) {
			var iframe = $("iframe[id='print_" + formKey + "']", document.body);
			if(iframe.length == 0) {
				iframe = $("<iframe src='"+url+"' style='display:none;'></iframe>").attr("id", "print_" + formKey);
	   			iframe.appendTo($(document.body));
			}
   			var win = iframe[0].contentWindow;
   			if(!YIUI.PrintURLs[formKey]) {
   				YIUI.PrintURLs[formKey] = [];
   			}
   			YIUI.PrintURLs[formKey].push(url);
   			win.print();
		},
		del: function(formKey) {
			var urls = YIUI.PrintURLs[formKey];
			if(urls && urls.length > 0) {
				var paras = {};
				paras.service = "PrintService";
				paras.cmd = "DeletePDF";
				paras.names = $.toJSON(urls);
				Svr.Request.getSyncData(Svr.SvrMgr.ServletURL, paras);
				urls = [];
			}
		},
		delAll: function() {
			for(var key in YIUI.PrintURLs) {
		        YIUI.Print.del(key);
			}
		}
	};
    YIUI.PrintPreview = function (opts) {
    	var el = $("<div/>");
    	var url = opts.url;
    	var target = opts.target;
    	var formKey = opts.formKey;
    	var Return = {
			init: function() {
	   			if(!YIUI.PrintURLs[formKey]) {
	   				YIUI.PrintURLs[formKey] = [];
	   			}
	   			YIUI.PrintURLs[formKey].push(url);
	   			
				if(target == "self") {
					el.modalDialog(null, {title: "预览", showClose: false, width: "80%", height: "80%"});
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