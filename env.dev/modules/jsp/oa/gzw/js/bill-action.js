void function(Ext, _){
    if (!Ext || !_) return;

    Ext.destroyLegacyComponents = function(){
        window.__PortalBillContainer && _.each(window.__PortalBillContainer, function(){
            try {
                Ext.destroy(this);
            } catch(e){}
        });
    };

    var onWorkspaceContentLoad = function(){
        var $workspace = _('#workspace'),
            $h1 = $workspace.find('h1'),
            extPanelId = $workspace.find('.x-panel:first').attr('id');
        if (extPanelId && $h1.onlyOne()) {
            Ext.getCmp(extPanelId).setHeight($workspace.innerHeight() - 6 - $h1.outerHeight(true));
        }
		wsHeight = Math.max(_(window).innerHeight() - $workspace.offset().top - _('#bottom').outerHeight(true), _('#aside_left').innerHeight());
			_('#workspace .doc-list').height(wsHeight-6-$h1.outerHeight(true));
        _.triggerOfDefaultElementIn($workspace)();
    };
	
    var backTo = function(url) {
        return function(){
            Ext.destroyLegacyComponents();
            _('#workspace').load(url.addUrlParam({
                    w : _('#workspace').innerWidth() - 6,
                    h : _('#workspace').innerHeight() - 6
                }), onWorkspaceContentLoad);
        }
    };

    var backToIndex = function(){
        Ext.destroyLegacyComponents();
        location.href = "index.jsp";
    };

    var backwards = {
        //'': backToIndex,
        'todolist': backTo('documents_todo.jsp'), // 待办 
		'toReadList': backTo('documents_toread.jsp'), // 待阅
        'DoneList': backTo('documents_done.jsp'), // 已办
		'HasReadList': backTo('documents_hasRead.jsp'), // 已阅
		'FinishedList': backTo('documents_finished.jsp'), // 结束
		'FromMeList': backTo('documents_from_me.jsp'), // 我发起
		'DraftList': backTo('documents_draft.jsp'), // 草稿
		'rejectList': backTo('documents_reject.jsp')
    };

    window.goBackSpecial = function(dest){
        if (dest) {
            /^\/?index\.jsp&/i.test(dest) ? backToIndex() : backTo(dest)();
        } else {
			var back;
			if ( backwards[_('#ws_content').data('backward')] == undefined ) {
				back = backToIndex;
			} else {
				back = backwards[_('#ws_content').data('backward')];
			}
            back && back();
        }
    };

}(window.Ext, window.jQuery);