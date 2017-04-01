Ext.bkmsg = function() {
	var msgCt = null;

	function createBox(t, s) {
		return '<div class="msg"><h3>' + t + '</h3><p>' + s + '</p></div>';
	}

	return {
		msg : function(title, msg, time) {
			if (!msgCt) {
				msgCt = Ext.DomHelper.insertFirst(document.body, {
					id : 'msg-div'
				}, true);
			}
			if (!time) {
				time = 3000;
			}
			var m = Ext.DomHelper.append(msgCt, createBox(title, msg), true);
			m.hide();
			m.on('mouseout', function(a, b, c) {
			});
			m.slideIn('t').ghost("t", {
				delay : time,
				remove : true
			});
		}
	};
}();