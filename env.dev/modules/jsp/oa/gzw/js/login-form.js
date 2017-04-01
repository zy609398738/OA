void function(_){
    _(function(){
        var $loginErrorsIndex = {},
            $loginInfo = _('#login_error .info'),
            $loginErrors = _('#login_error .error').each(function(){
                $loginErrorsIndex[_(this).data('error-type')] = _(this).hide();
            }),
            showLoginError = function(code){
                $loginInfo.hide();
                $loginErrors.hide();
                (code in $loginErrorsIndex) && $loginErrorsIndex[code].show();
                return false;
            };

        var $loginForm = _("#login-form");
        // login ACTION
        var $loginFormFields = $loginForm.ajaxForm({
            dataType: 'json',
            beforeSubmit: function(/*Array*/formData, $form) {
                var valid = $form.find('[name=usercode]').val() ? true : showLoginError('-1');
                if (valid) {
                    $loginFormFields.prop('disabled', true);
                }
                return valid;
            },
            success: function(resp) {
            	if (true === resp) {
                    location.href.indexOf('login.jsp') > 0 && (location.href = 'index.jsp');
                    _.fancybox && _.fancybox.close(true);
                    if (location.href.indexOf('index.jsp') > 0) {
            			location.reload();
            		}
                } else {
                    showLoginError('-2');
                }
                $loginFormFields.prop('disabled', false);
            },
            error: function(resp) {
                $loginFormFields.prop('disabled', false);
                if(resp.responseText == 'online' && confirm("此用户已在线,是否将其踢出以强制登录？")) {
                    var action = $loginForm.attr('action');
                    $loginForm.attr('action', action + (action.indexOf('?') >= 0 ? '&' : '?') + 'force=1')
                              .submit();
                } else {
                    showLoginError('-2');
                }
            }
        })
        .find('input,textarea,select');

        $loginForm.find(':submit').enable();

		 try {
		 	 _('[tabindex=0]').size() > 0 && _('[tabindex=0]').focus();
		 } catch (e) {
		 	
		 }

        _(document).keypress(function(/*jQuery.Event*/evt){
            var code = evt.keyCode || evt.which;
            if(code == 13) {
                _('#login-form').submit();
            }
        });

        _('#pki-login').click(function(/*jQuery.Event*/evt){
            // TODO: PKI数字证书登录
            return evt.preventDefault() && false;
        });

        //登录时获取当前日期
        var d = new Date();
        var string= d.getFullYear()+"年"+ (d.getMonth()+1).toString()+"月"+ d.getDate()+"日";
        $("#date").html(string);

    });
}(window.jQuery);
