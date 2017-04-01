void function(_){

    _(function(){
        _('#changepwd-trigger').click(function(/*jQuery.Event*/evt){
        	var prepwd = _('#pre-pwd').val();
            var pwd = _('#changepwd-pwd').val();
            var repeatpwd = _('#changepwd-repeatpwd').val();
            if (pwd != repeatpwd) {
                _('#changepwd-msg').html('<span style="color:red">提示： 密码不一致,请重新输入！</span>');
            } else {
                _.post(
                    MAP_C_SERVER_URL + '/rfc.do?__webCall=1&__out=1&__exp=changepwd({'+prepwd+'},{'+repeatpwd+'})',
                    function (_resJson) {
                        if (true === _resJson) {
                            _('#changepwd-msg').html('<span style="color:green;">提示： 密码修改成功！</span>');
                        } else {
                        	_('#changepwd-msg').html('<span style="color:red;">提示：原密码有错误，请重新输入！</span>');
                        	_('#pre-pwd').val('');
                        	_('#pre-pwd').focus();
                        }
                    }, 'json'
                );
            }
            return evt.preventDefault() && false;
        });
    });
}(window.jQuery);