// 简报搜索
(function($) {
function pagination(opts) {
	opts = $.extend({
		num_edge_entries : 2,
		link_to:"javascript:;",
		prev_text:"上一页",
		next_text:"下一页",
		callback : gotoPage
	}, opts);
	$("#paginationCt").pagination(opts.items_count, opts);
}

function gotoPage(currpage) {
	doQuery({
		currpage : currpage
	});
}

function doQuery(opts) {
	var q = $('#search_txt').val();
	q = q.replace(/[\+|\-|\&|\||\!|\(|\)|\{|\}|\[|\]|\^|\~|\*|\?|\:|\\]/gi, ' ')
			.replace(/^AND$/gi, ' ').replace(/^NOT$/gi, ' ').replace(/^OR$/gi, ' '); // + - & | ! ( ) { } [ ] ^ ~ * ? : \  AND OR NOT
	if(!q) return;
	
	opts = $.extend({
		currpage : 0,
		pagesize : 12,
		q : '(metaKey:briefReport) AND (content:'+q.replace(/\s/g, ' OR content:')+' OR attachments:'+q.replace(/\s/g, ' OR attachments:')+')'
	}, opts);
	// suppose MAP_Request is here
	var _xml=MAP_Request.getRfcXml('WebSearch', Ext.util.JSON.encode(opts));
	
	MAP_Request.ajaxRfc(null,_xml,true,function(result){
		search_callback(result);
	});
}

function search_callback(result) {
	var list = $('#result_list');
	list.empty();
	
	var resp = eval('['+result+']')[0];
	if(resp.success != true) {
		return;
	}
	pagination({
		items_per_page : resp.pagesize,
		current_page : resp.currpage,
		items_count : resp.numFound
	});
	
	var docs = resp.docs;
	$.each(docs, function(i) {
		var doc = docs[i];
		var tr = $('<tr></tr>').addClass('even').appendTo(list);
		$('<td></td>').html(doc.REPORTNUM).appendTo(tr);
		var titleLink = $('<a></a>').html(doc.TITLE).addClass('ws-load').attr('href', 'documents_detail.jsp?BILLID='+doc.billid+'&billKey='+doc.metaKey+'&rt=brief');
		var titleEl = $('<td></td>').addClass('caption td_title').appendTo(tr);
		titleLink.appendTo(titleEl);
		
		$('<td></td>').html(doc.DEPARTMENT_DISPLAY).appendTo(tr);
		$('<td></td>').html(Date.parseDate(doc.BILLDATE, 'Ymd:His').format('Y-m-d')).appendTo(tr);
	});
}

$(document).ready(function(){
	var ef = function(/*jQuery.Event*/evt) {
		var txt = $('#search_txt').val();
		if(!txt) return;
		
		doQuery();
	};
	
	$('#search_btn').click(ef);
	$('#search_txt').keypress(function(e){
		if(e.keyCode == 13) {
			ef(e);
		}
	});
});

})(window.jQuery);