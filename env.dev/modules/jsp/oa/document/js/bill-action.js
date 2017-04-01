void function(Ext, jq){
    var onWorkspaceContentLoad = function(){
        var $workspace = jq('#workspace'),
            $h1 = $workspace.find('h1'),
            extPanelId = $workspace.find('.x-panel:first').attr('id');
        if (extPanelId && $h1.onlyOne()) {
            jq(extPanelId).height($workspace.innerHeight() - 6 - $h1.outerHeight(true));
        }
		var wsHeight = Math.max(jq(window).innerHeight() - $workspace.offset().top - jq('#bottom').outerHeight(true), jq('#aside_left').innerHeight());
			jq('#workspace .doc-list').height(wsHeight-6-$h1.outerHeight(true));
        jq.triggerOfDefaultElementIn($workspace)();
    };
	
    var backTo = function(url) {
        return function(){
            //Ext.destroyLegacyComponents();
            jq('#workspace').load(url.addUrlParam({
                    w : jq('#workspace').innerWidth() - 6,
                    h : jq('#workspace').innerHeight() - 6
                }), onWorkspaceContentLoad);
        }
    };

    var backToIndex = function(){
        //Ext.destroyLegacyComponents();
        location.href = "index.jsp";
    };

    var backwards = {
        //'': backToIndex,
        'todolist': backTo('document_forme.jsp?workflowtype=1'), // 待办 
		'toReadList': backTo('workflow_forread.jsp?readtype=0&wftype=1'), // 待阅
        'DoneList': backTo('document_forme.jsp?workflowtype=3'), // 已办
		'HasReadList': backTo('workflow_forread.jsp?readtype=1&wftype=1'), // 已阅
		'FinishedList': backTo('document_forme.jsp?workflowtype=4'), // 结束
		'FromMeList': backTo('document_forme.jsp?workflowtype=5'), // 我发起
		'DraftList': backTo('document_forme.jsp?workflowtype=6'), // 草稿
		'rejectList': backTo('document_forme.jsp?workflowtype=2')
    };

    window.goBackSpecial = function(dest){
        if (dest) {
            /^\/?index\.jsp&/i.test(dest) ? backToIndex() : backTo(dest)();
        } else {
			var back;
			if ( backwards[jq('#ws_content').data('backward')] == undefined ) {
				back = backToIndex;
			} else {
				back = backwards[jq('#ws_content').data('backward')];
			}
            back && back();
        }
    };

}(window.Ext, window.jQuery);