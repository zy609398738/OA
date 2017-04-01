var MAP_C_SERVICE = MAP_C_SERVICE || (function() {
    var matches = /^\/(\w+)\/?/.exec(decodeURI(location.pathname));
    return (matches && matches[1]) ? matches[1] : null;
})();

var MAP_C_SERVER_URL = MAP_C_SERVER_URL || (location.protocol + '//' + location.host + '/' + MAP_C_SERVICE);

void function(_, Ext) {
    _(function(){
		var $workspace = _('#workspace');
		// 显示正在加载样式
		var $loadMask = _('#loading-mask').removeAttr('id');
        _('body').ajaxSend(function(/*jQuery.Event*/evt, /*XMLHttpRequest*/xhr, /*Object*/options){
            var opts = options || {};
            if (!('target' in opts) || !opts.target){
                return;
            }
            _(opts.target).html('').append($loadMask.show());
        }).ajaxComplete(function(/*jQuery.Event*/evt, /*XMLHttpRequest*/xhr, /*Object*/options){
            $loadMask.hide();
        });
		
		// EXTJS 组件销毁
		var destroyCmp = function( cmp ){
			try {
				(Ext.destroy2 || Ext.destroy)(cmp);
			} catch(e){}
		}
		
		
		
		// workspace-load
		var loadWorkspaceContentByLink = function(/*jQuery.Event*/evt){
            //Ext.destroyLegacyComponents();

            $workspace.load(_(this).attr('href').addUrlParam({
                w : $workspace.innerWidth() - 6,
                h : $workspace.innerHeight() - 6
            }));

            return evt.preventDefault() && false;
        };
		
		// invalidate empty link
        _('a[href=#], a[href=""]').off('click',function(/*jQuery.Event*/evt){
            return evt.preventDefault() && false;
        });
		
		 // 向 workspace 容器 ajax加载内容的链接
        _('.ws-load[href]').on('click', loadWorkspaceContentByLink);

    });
}(window.jQuery, window.Ext);
