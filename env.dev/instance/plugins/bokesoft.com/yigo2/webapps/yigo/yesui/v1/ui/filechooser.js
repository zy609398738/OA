(function () {
	YIUI.FileChooser = function(serviceName, cmdName) {
		var Return = {
				init: function() {
					this.$input = $("<input type='file' name='file' data-url='upload' class='opt upbtn' />").appendTo($(document.body)).hide();
				},
				upload: function(options, callback) {
					this.options = options || {};
					this.callback = callback;
					this.$input.click();
				},
				install: function() {
					var self = this;
					this.$input.change(function() {
						var paras = $.extend({
							cmd: cmdName,
							service: serviceName,
							mode: 1
						}, self.options);
						$.ajaxFileUpload({
							url: Svr.SvrMgr.AttachURL,
							secureuri: false,
							fileElement: self.$input,
							data: paras,
							type: "post",
							success: function (data, status, newElement) {
								data = JSON.parse(data);
								if (data.success == false) {
									var error = data.error;
									var showMessage = error.error_info;
									var errorCode = error.error_code;
									if(errorCode != -1){
										errorCode = (parseInt(errorCode,10)>>>0).toString(16).toLocaleUpperCase();
										showMessage = errorCode + "<br/>" + showMessage;
									}
									$.error(showMessage);
								} else {
									if($.isFunction(self.callback)) {
										self.callback(data);
									}
								}
							},
							error: function (data, status, e) {
								alert(e);
							}
						});
					});
				}
		};
		Return.init();
		Return.install();
		return Return;
	};
})();