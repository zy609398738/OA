//<![CDATA[
$(function(){
	(function(){
		var curr = 0;
		$("#banner-show-Nav .trigger").each(function(i){
			$(this).click(function(){
				curr = i;
				$("#banner-show ul li").eq(i).fadeIn("slow").siblings("ul li").hide();
				$(this).siblings(".trigger").removeClass("imgSelected").end().addClass("imgSelected");
				return false;
			});
		});
		
		var pg = function(flag){
			//flag:true��ʾǰ���� false��ʾ��
			if (flag) {
				if (curr == 0) {
					todo = 1;
				} else {
					todo = (curr - 1) % 4;
				}
			} else {
				todo = (curr + 1) % 4;
			}
			$("#banner-show-Nav .trigger").eq(todo).click();
		};
		
		//ǰ��
		$("#prev").click(function(){
			pg(true);
			return false;
		});
		
		//��
		$("#next").click(function(){
			pg(false);
			return false;
		});
		
		//�Զ���
		var timer = setInterval(function(){
			todo = (curr + 1) % 4;
			$("#banner-show-Nav .trigger").eq(todo).click();
		},10000);
		
		//�����ͣ�ڴ�������ʱֹͣ�Զ���
		$("#banner-show-Nav a").hover(function(){
				clearInterval(timer);
			},
			function(){
				timer = setInterval(function(){
					todo = (curr + 1) % 4;
					$("#banner-show-Nav .trigger").eq(todo).click();
				},9000);			
			}
		);
	})();
});
//]]>


