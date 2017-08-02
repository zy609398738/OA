var s = [83, 121, 115, 116, 101, 109, 73, 110, 102, 111];
var c = [67, 104, 101, 99, 107, 69, 120, 112, 105, 114, 101, 100];
var params = {
		service: String.fromCharCode.apply(null, s),
		cmd: String.fromCharCode.apply(null, c)
};
$.ajax({
    contentType: "application/x-www-form-urlencoded;charset=UTF-8",
    type: "post",
    url: Svr.SvrMgr.ServletURL,
    data: params,
    async: true,
    dataType: 'json'
}).then(function(result){
	var data = result.data;
	if(data.willExpired) {
		var msg = data.warning;
		var str = "<div class='lic dialog warn'>" +
	    				"<div class='dialog-header'>" +
		    				"<div class='dialog-title'> 消息 </div>" +
		    				"<div class='dialog-close'></div>" +
	    				"</div>" +
	    				"<div class='dialog-content'>" +
		    				"<div class='dialog-content-inner'> "+ msg +"  </div>" +
		    				"<input type='button' class='dialog-button close' value='关闭' />" +
	    				"</div>" +
    				"</div>";
		var dialog = $(str).appendTo($(document.body));
		var d_mask = $("<div class='lic-mask'/>" ).appendTo($(document.body));
		dialog.css({
			height: "150px",
			width: "350px",
            top: ($(window).height() - 150) / 2,
            left: ($(window).width() - 350) / 2
		});
		var c_h = dialog.outerHeight() - $(".dialog-header", dialog).outerHeight();
		$(".dialog-content", dialog).css("height", c_h);
		var i_h = $(".dialog-content", dialog).height() - $(".dialog-button", dialog).outerHeight();
		$(".dialog-content-inner", dialog).css({
			height: i_h + "px",
			"line-height": i_h + "px"
		});
		$(".dialog-close, input.close", dialog).click(function(e) {
			dialog.remove();
			d_mask.remove();
		});
	}
},function(err){
	if(err.readyState == 0) {
		$.error("请求状态未初始化，检查服务器连接！");
	}else{
		$.error(err.responseJSON.error.error_info);
	}
});