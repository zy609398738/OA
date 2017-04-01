void function (_) {

    _(function () {
        _('#set-homepage').click(function(/*jQuery.Event*/evt) {
            if (_.browser.msie) {
                document.body.style.behavior = 'url(#default#homepage)';
                document.body.setHomePage(window.location.href);
            }

            evt.preventDefault();
            return false;
        });

        _('#add-to-favorite').click(function(/*jQuery.Event*/evt) {
            if (window.sidebar) { // Mozilla Firefox
                window.sidebar.addPanel(document.title, location.href, "");
            } else if (_.browser.msie && window.external) { // IE
                window.external.addFavorite(location.href, document.title);
            } else {
                alert('请使用CTRL + D 收藏此地址，谢谢');
            }

            evt.preventDefault();
            return false;
        });
    });
    
//	_('#pki-login').click(function(/*jQuery.Event*/evt){
//			var BASEURL = window.location.href.substring(0,window.location.href.lastIndexOf('/')+1);
//			_.ajax({
//				type : 'post',
//				url : BASEURL + 'login4pki4test.jsp',
//				success: function(result){
//					if (eval(result)) {
//						window.location.href = BASEURL + 'index.jsp';
//					} else {
//						alert('登录异常，请联系管理员');
//					}
//				} 
//			});
//		});
		// PKI 登录
		_('#pki-login').click(function(/*jQuery.Event*/evt){
			var cookies = document.cookie.split(';');
			// TODO 地址暂时写死了
			var PKIURL = 'https://'+window.location.hostname+':8447/Yigo/cqoa/login4pki.jsp';
			_.ajax({
				type : 'post',
				url : PKIURL,
				dataType : 'script',
				success : function(result){
					if (eval(result)) {
					window.location.href = 'http://'+window.location.hostname+':8093/Yigo/cqoa/index.jsp';
					} else {
						alert('登录异常，请联系管理员');
					}
				} 
			});
		});
		
}(window.jQuery);
