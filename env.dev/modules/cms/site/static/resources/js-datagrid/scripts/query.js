 function queryResult(dNo, dDiv) {
	    var deliveryRowNo;
		var div;
		if(dNo){
			deliveryRowNo = dNo;
		}else{
			deliveryRowNo = 3;
		}
		if(dDiv){
			div = dDiv;
		}else{
			div = ".newsarea";
		}
		var keyword = $("#keyword").val();
		var selectKey = $("#selectKey").val();
		if (keyword != "" && keyword !="请输入关键字")
		{
			htmlobj=$.ajax({
				type: "post",
				url: document.location.href,
				data:{"deliveryRowNo": deliveryRowNo, "keyword":keyword, "selectKey": selectKey, "nav": "搜索:"+ keyword,"typecode":$("#param_typecode").val()},
				dataType:'html',
				async:false,
				success:function(result){
					$(div).html(result);
				}
			});
		}else{
			alert("请输入关键字!");
		}
	}	
	
	
	$(function () {
		$("#keyword").bind("keydown", function (e) {
			var key = e.which;
			if (key == 13) {
				queryResult();
			}
		});
	});
		 