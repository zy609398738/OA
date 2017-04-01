(function($){
	var $search_txt=$('#search_txt');
	var $workspace = $('#workspace');
	$search_txt.keypress(function(/*jQuery.Event*/e){
		if(e.keyCode == 13) {
			var txt = $('#search_txt').val();
			$workspace.load('search.jsp?q=' + encodeURIComponent(txt));
		}
	});
	
	
	$('#search_btn').click(function(/*jQuery.Event*/evt) {
		var txt = $search_txt.val();
		$workspace.load('search.jsp?q=' + encodeURIComponent(txt));
	});
	
	$('#advanced_search_btn').click(function(/*jQuery.Event*/evt) {
		$workspace.load('advanced_search.jsp');
	});
})(window.jQuery);