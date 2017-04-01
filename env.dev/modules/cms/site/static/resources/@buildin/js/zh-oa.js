$(function () {			
	//菜单效果
	var $navli = $('#nav .menu_main').children();
	$navli.hover(
		function () {$(this).addClass('hover');}, 
		function () {$(this).removeClass('hover');}									 
    );
	//$navli.each(function(i){
	//	$(this).addClass("icon" + i);
	//});
	
	
	//滚动新闻
     var $scollingNewsList = $(".system-notice ul");
     var scollingNewsItemHeight = $scollingNewsList.find('li:first').outerHeight(true) , myar = setInterval(AutoScroll, 2000);
      $scollingNewsList.hover(function() { clearInterval(myar); }, function() { myar = setInterval(AutoScroll, 2000) }); //当鼠标放上去的时候，滚动停止，鼠标离开的时候滚动开始，-scollingNewsItemHeight是行高
       function AutoScroll(){
           $scollingNewsList.animate({
                marginTop: -scollingNewsItemHeight+'px'
            }, 500, function() {
                $(this).css({ marginTop: "0px" }).find("li:first").appendTo(this);
            });
        }


    //tab选项卡
	$(".lib-tab .tab-head li").mouseover(function(){  
		var $this = $(this),$tabli = $this.parent().children(),$tabcontent = $this.parent().parent(".tab-head").next(".tab-content").children();
		var index = $tabli.index(this);
		$this.addClass("hover").siblings().removeClass("hover");
		$tabcontent.eq(index).show().siblings().hide();
	}); 

    //tree-menu抽屉特效
	  var $treeItem = $(".tree-menu h6");
      $treeItem.click(function(){
           var $this = $(this) , $hiddenObj = $this.siblings() , $parentObj = $this.parent() , $allparent = $treeItem.parent() , $allhiddenObj = $treeItem.siblings();
		   $allhiddenObj.slideUp();
		   $allparent.removeClass('collapsed').addClass('expanded');
          if($parentObj.hasClass('expanded')){
              $hiddenObj.slideDown();
              $parentObj.removeClass('expanded').addClass('collapsed');
          }
          else{
              $hiddenObj.slideUp();
              $parentObj.removeClass('collapsed').addClass('expanded');
          }
      });
	  
	  //设置内容字体大小
	  $(".fontsize a").click(function(){
		var $this=$(this);
		$this.addClass("hover").siblings().removeClass("hover");
		var setSize= $this.attr("size");
		$(".new-detail-body").attr("class","new-detail-body");
		$(".new-detail-body").addClass('f'+setSize);
	})
	
	//全站右下角 添加 “回到顶部”  按钮
	var PrtScreenWidth=$(window).width();
	(new GoTop()).init({
		pageWidth		:PrtScreenWidth,
		nodeId			:'go-top',
		nodeWidth		:36,
		distanceToBottom	:100,
		hideRegionHeight	:0,
		distanceToPage 		:0,
		path			:'/yigo/_$/resources/@buildin/images/TOP.gif'
		
	});	
	
	//首页右下角 协作应用
	$(".lay-tools").hover(
		function () {$(this).addClass('hover');}, 
		function () {$(this).removeClass('hover');}									 
    );
	
	
	//设置cookie,按钮选中状态,页面皮肤
	var setSkin=function(skinName){
		$("#theme-style").attr("href","/yigo/_$/resources/@buildin/css/theme/"+skinName+".css");//设置页面样式
	}
	//将当前皮肤skinName存到cookie
	var setCookie=function(skinName){
		var expires=new Date();
		expires.setTime(expires.getTime()+24*60*60*365*1000);//1年
		var flag="Skin_Cookie="+skinName;
		var service = /^\/(\w+)\/?/.exec(decodeURI(location.pathname))[1];
		document.cookie=flag+";expires="+expires.toGMTString()+";path=/"+ service + "/";
	}
	//返回用户设置的皮肤样式
	var readCookie=function(){
		var skin=0;
		var mycookie=document.cookie;
		var name="Skin_Cookie";
		var start1=mycookie.indexOf(name+"=");
		if(start1<0){
			skin="theme-Default";//如果没有设置则显示默认样式
		}
		else{
			var start=mycookie.indexOf("=",start1)+1;
			var end=mycookie.indexOf(";",start);
			if(end<0){
				end=mycookie.length;
			}
			var values= unescape(mycookie.substring(start,end));
			if (values!=null)
			{
				skin=values;
			}
		}
		return skin;
}
    setSkin(readCookie());//根据读取cookie返回值设置皮肤样式
	$("#theme-select").change(function(){ //绑定换肤按钮事件
		var selectVal=$(this).val();
		var skinName;
		switch(selectVal)
		{
		case "2":
			skinName="theme-Orange";
			break;
		case "3":
			skinName="theme-Red";
			break;
		default:
			skinName="theme-Default";
		}
		setSkin(skinName);
		setCookie(skinName);
	});//绑定点击事件
	
	//首页每月之星
	function monthStar() {
	var layer = $("#index-month-star");
	var group = layer.find("ul");
	var li;
	var a = layer.find("a");
	var up = a.eq(0);
	var down = a.eq(1);
	var time;
	var conf = function () {
		var c = {};
		li = group.find("li");
		c.showCount = 1;
		c.dataCount = li.length;
		c.liHeight = li.eq(0).height();
		if (c.dataCount >= c.showCount) {
			c.minIndex = c.showCount; 				//最小index值，当达到该值就会跳到终点
			c.maxIndex = c.dataCount + c.showCount; 	//最大index值，当达到该值就会跳到起点
			c.index = c.minIndex; 					//初始index
			c.start = c.index * c.liHeight; 			//初始Y值
		}
		c.moveing = false;
		return c;
	} ();
	
	function up_handler() {
		if (conf.moveing == true) return;
		conf.moveing = true;
		removeAuto();
		conf.index--;
		group.animate({
			scrollTop: conf.index * conf.liHeight
		}, 300, function () {
			if (conf.index == 0) {
				conf.index = conf.maxIndex - conf.showCount;
				group.scrollTop(conf.index * conf.liHeight);
			}
			conf.moveing = false;
			addAuto();
		});
	}
	function down_handler() {
		if (conf.moveing == true) return;
		conf.moveing = true;
		removeAuto();
		conf.index++;
		group.animate({
			scrollTop: conf.index * conf.liHeight
		}, 300, function () {
			if (conf.index == conf.maxIndex) {
				conf.index = conf.minIndex;
				group.scrollTop(conf.start);
			}
			conf.moveing = false;
			addAuto();
		});
	}
	function addAuto() {
		time = window.setInterval(down_handler, 2000);
	}
	function removeAuto() {
		window.clearInterval(time);
		time = null;
	}
	var init = function () {
		if (conf.dataCount < conf.showCount) return;
		for (var i = 0; i < conf.showCount; i++) {
			//为溢出克隆补全
			group.append(li.eq(i).clone()); 						//尾部补全
			group.prepend(li.eq(conf.dataCount - 1 - i).clone()); 	//头部补全
		}
		group.scrollTop(conf.start);
		up.click(up_handler);
		down.click(down_handler);
		addAuto();
	} ();
};
monthStar();


  $(".hasChildren > a").click(function(){
		var ul=$(this).next("ul");
		var Pli=$(this).parent("li");
		var showOrHide=Pli.hasClass("show");
		//$(this).href="javascript:void(0)";
		if(showOrHide){
			Pli.removeClass("show");
			Pli.addClass("hide");
			//ul.hide("slow");
		}
		else{
			Pli.removeClass("hide");
			Pli.addClass("show");
			//ul.show("slow");
		}
		//ul.toggle(1000);
		
		
  });
	  
});	



function formResize(){
	 var bodyHeight = $(window).height(), headerHeight = $("#header").height(),
			navHeight = $("#nav").height(),bottomHeight = $("#bottom").height(),
			eleIframe = bodyHeight-headerHeight-bottomHeight-navHeight-15;
	 $("#main-iframe,#mid .aside-left,#mid .main").height(eleIframe+"px");
	 $("#treeDemo").height(eleIframe-40);
}

//在父界面中打开菜单入口
function openParentEntry(entryPath) {
    var opts = {
        path: entryPath
    };
    parent.openEntry(opts);
}

//在父界面中打开单据界面
function openParentForm(key,id) {
    var args = {
		formKey: key,
		OID: id
	};
    parent.openForm(args);
}

//根据URL在父界面中打开Web界面
function openParentWebForm(url,formCaption) {
    parent.openWebForm(url,formCaption);
}


