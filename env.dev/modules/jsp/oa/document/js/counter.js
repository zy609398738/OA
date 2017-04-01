void function(_) {
	//alert(MAP_Request.appendURL);
    var MAP_COUNTER_URL = {
            'to-do': MAP_C_SERVER_URL 
			+ '/rfc.do?__webCall=1&__out=1&__exp=wf.WorkFlowAction.GetDoReadCount(GetCuroperator(),%7Btodolist%7D,%7B and wftype=2%7D)&noAlert=1',
            'to-read': MAP_C_SERVER_URL 
			+ '/rfc.do?__webCall=1&__out=1&__exp=wf.WorkFlowAction.GetDoReadCount(GetCuroperator(),%7Btoreadlist%7D,%7B and wftype=2%7D)&noAlert=1',
			'reject' : MAP_C_SERVER_URL 
			+ '/rfc.do?__webCall=1&__out=1&__exp=wf.WorkFlowAction.GetDoReadCount(GetCuroperator(),%7Brejectlist%7D,%7B and wftype=2%7D)&noAlert=1',
			'done' : MAP_C_SERVER_URL 
			+ '/rfc.do?__webCall=1&__out=1&__exp=wf.WorkFlowAction.GetDoReadCount(GetCuroperator(),%7Bdonelist%7D,%7B and wftype=2%7D)&noAlert=1',
			'did' : MAP_C_SERVER_URL 
			+ '/rfc.do?__webCall=1&__out=1&__exp=wf.WorkFlowAction.GetDoReadCount(GetCuroperator(),%7Bdidlist%7D,%7B and wftype=2%7D)&noAlert=1'
        },
		
        normalInterval = 6e5,
        errorInterval = 6e5,  // 非200返回，则延长请求间隔，至10分钟。
        maxWait = errorInterval / normalInterval;

    var timeoutHandle = null;

    _.startCounter = function () {
        timeoutHandle && clearTimeout(timeoutHandle);
        var loadQueue = [];
        for (var k in MAP_COUNTER_URL){
            if (MAP_COUNTER_URL.hasOwnProperty(k) && MAP_COUNTER_URL[k]) {
                (function(){
                    var $counter = _('.counter.' + k);
                    if (!$counter.exists()) return;
                    var ajaxWait = $counter.data('ajax-wait');
                    if (typeof ajaxWait === 'number' && ajaxWait < maxWait) {
                        $counter.data('ajax-wait', ajaxWait + 1);
                        return;
                    }

                    loadQueue.push(_.ajax(MAP_COUNTER_URL[k], {
                        dataType: 'text',
                        cache : false, // IE下缓存
                        success: function(text){
                            $counter.html(text).removeData('ajax-wait');
                        },
                        error: function(xhr) {
                            $counter.html('-').data('ajax-wait', 0);
                        }
                    }));
                })();
            }
        }
        _.when.apply(null, loadQueue).always(function(){
            //timeoutHandle = window.setTimeout(_.startCounter, normalInterval); // 开发者注释这句即可屏蔽自动刷新
        });
    };

    window.doCounter=function () {
        _.startCounter();
    };
	doCounter();
}(window.jQuery);
