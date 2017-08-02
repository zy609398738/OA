
YIUI.AppDef = (function() {
	var rt = {
			setStatus: function(status) {
				if(status) {
					var org_lbl = $(".navRight label.org_lbl");
					var html_text = "";
					for(var i = 0, len = status.length; i < len; i++) {
						var s = status[i];
						var p = new View.Parser();
						var text = s.caption;
						if(s.formula) {
							try {
								text = p.eval(s.formula) || "";
							} catch (e) {
								text = s.caption;
							}
						}
						html_text += "<p>" + text + "</p>";
					}
					org_lbl.html(html_text);
					this.org_status = status;
				}
			},
			updateStatusInfo: function(key, text) {
				var status = this.org_status;
				if(status) {
					var org_lbl = $(".navRight label.org_lbl");
					var lbl_text = "";
					for(var i = 0, len = status.length; i < len; i++) {
						var s = status[i];
						if(key == s.key) {
							lbl_text += " " + text;
						} else {
							lbl_text += " " + s.text;
						}
					}
					org_lbl.html(lbl_text);
				}
			},
			refreshStatusInfo: function(key) {
				var status = this.org_status;
				if(status) {
					var org_lbl = $(".navRight label.org_lbl");
					var lbl_text = "";
					for(var i = 0, len = status.length; i < len; i++) {
						var s = status[i];
						lbl_text += " " + s.text;
					}
					org_lbl.html(lbl_text);
				}
			}
	};
	return rt;
})();
