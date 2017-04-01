//<![CDATA[
void function(_) {
_(function(){
	(function(){
		var curr = 0;
		_("#jsNav .trigger").each(function(i){
			_(this).click(function(){
				curr = i;
				_("#js ul li").eq(i).fadeIn("slow").siblings("ul li").hide();
				_(this).siblings(".trigger").removeClass("imgSelected").end().addClass("imgSelected");
				return false;
			});
		});
		
		var pg = function(flag){
			//flag:true表示前翻， false表示后翻
			if (flag) {
				if (curr == 0) {
					todo = 5;
				} else {
					todo = (curr - 1) % 6;
				}
			} else {
				todo = (curr + 1) % 6;
			}
			_("#jsNav .trigger").eq(todo).click();
		};
		
		//前翻
		_("#prev").click(function(){
			pg(true);
			return false;
		});
		
		//后翻
		_("#next").click(function(){
			pg(false);
			return false;
		});
		
		//自动翻
		var timer = setInterval(function(){
			todo = (curr + 1) % 6;
			_("#jsNav .trigger").eq(todo).click();
		},5000);
		
		//鼠标悬停在触发器上时停止自动翻
		_("#jsNav a").hover(function(){
				clearInterval(timer);
			},
			function(){
				timer = setInterval(function(){
					todo = (curr + 1) % 6;
					_("#jsNav .trigger").eq(todo).click();
				},3000);
			}
		);
	})();
});

}(window.jQuery);
//]]>


