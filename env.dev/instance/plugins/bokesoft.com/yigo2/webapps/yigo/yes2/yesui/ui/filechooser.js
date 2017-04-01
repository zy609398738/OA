(function () {
	YIUI.FileChooser = function() {
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
							cmd: "Import",
							service: "PureFileOperate",
							mode: 1
						}, self.options);
						$.ajaxFileUpload({
							url: Svr.SvrMgr.AttachURL,
							secureuri: false,
							fileElement: self.$input,
							data: paras,
							type: "post",
							success: function (data, status, newElement) {
								if($.isFunction(self.callback)) {
									self.callback();
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