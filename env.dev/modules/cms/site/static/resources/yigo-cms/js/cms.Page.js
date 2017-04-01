if (! window.cms){
    window.cms = {};
}
cms.Page = {};

(function(jQuery){
    // Detect jQuery ...
    if (!jQuery){
        alert("cms.Page depends on jQuery!");
        return;
    }
    var $ = jQuery;

    
    var popupSequence = 0;  //用于产生不重复的弹出对话框序号，从而支持在一个页面产生多个弹出对话框
    var popupZIndex = 9000;    //第一层弹出对话框的 z-index
    /**
     * 使用从服务器端获取的内容替换当前页面的某个区域
     *  selector: CSS 选择符, 用于指定一个待刷新的区域(注意：该节点本身并不会被替换掉)；
     *  handlePage: ajax 后台处理程序(url)；
     *  parameter: url 的条件参数, JSON 格式；
     *  callback: 回调函数, 定义为 function(htmlText), 可选;
     */
    var replaceRegion = function(selector, handlePage, parameter, callback){
        $.ajax({
            type:"POST",
            async: true,        //异步
            contentType:"application/x-www-form-urlencoded; charset=UTF-8", //发送至服务器的数据类型, 这个是默认值
            url:handlePage,     //要访问的后台地址，如："/demo/popup.page"
            data:parameter,     //要发送给后端的数据(json格式),如:{block:"static?staticFile=cms:/buildin/login.html", pageNo=30}
            dataType:'text',    //服务器返回的数据类型
            success:function(htmlText){    
                $(selector).html(htmlText);
                if (callback){
                    callback.apply(window, [htmlText]);
                }
            },
            error:function(XMLHttpRequest, textStatus, errorThrown) {
                alert("页面请求失败！\r\n\r\nHttp状态码："+XMLHttpRequest.status);   //弹出错误信息
            }
        });
    }

    /**
     * 弹出指定大小的对话框区域, 返回可用于显示区域的 selector 字符串
     *  popupWidth: 弹出层宽；
     *  popupHeight: 弹出层高；
     *  callback: 回调函数, 定义为 function(dialogObject);
     */
    var popupDialog = function(popupWidth, popupHeight, callback){
        popupSequence = popupSequence + 1;
        var popupContentId = "popupContent_" + popupSequence;
        var grayLayerId = "grayLayer_" + popupSequence;
        var popupLayerId = "popupLayer_" + popupSequence;
        
        var str = "<div class='grayLayer' id='"+grayLayerId+"' style='z-index:"+popupZIndex+"'></div>"
                + "<div class='popupLayer' id='"+popupLayerId+"' style='z-index:"+(popupZIndex+1)+"'>"
                + "    <a class='close'></a>"
                + "    <div class='popupContent' id='"+popupContentId+"'></div>"
                + "</div>"; //在页面body后面添加html片段
        $("body").append(str);
        popupZIndex = popupZIndex+2;    //一次弹出消耗两个 z-index, 分别对应 grayLayer 和 popupLayer
        
        var popupLayerObj = $("#" + popupLayerId);
        popupLayerObj.width(popupWidth);
        popupLayerObj.height(popupHeight);    

        var resetPositon = function(){
            var difHeight = $(window).height()-popupHeight, popupLayerTop = (difHeight <= 0)?0 : difHeight/2;    
            popupLayerObj.css({top:popupLayerTop, marginLeft:0-popupWidth/2});//将弹出层居中显示        
        }
        var popupLayer_close = function(){//关闭弹出窗口即移除 body后面添加的html代码
            $("#"+grayLayerId).remove("#"+grayLayerId);
            $("#"+popupLayerId).remove("#"+popupLayerId);
            popupZIndex = popupZIndex - 2;
        }

        resetPositon();//设置弹出层位置
        
        callback.apply(window, [{contentSelector: "#"+popupContentId, close: popupLayer_close}]);
        
        $(window).resize(function(){
            resetPositon();
        })//自适应浏览器窗口大小        
        
        $("#"+popupLayerId+" a.close").click(function(){//点击关闭按钮关闭弹出层
            popupLayer_close();
        })
    }

    //Export cms.Page
    cms.Page.replaceRegion = replaceRegion;
    cms.Page.popupDialog = popupDialog;
	







	
	var photosShowSequence = 0;  //用于产生不重复的图片轮换容器序号，从而支持在一个页面产生多个图片轮换"flash"
    /**
     * 在指定容器内生成图片轮换"flash"
     *  elementId: 指定容器
     *  photoInfo: 图片信息 json数据，类：[{ url: "images/photo1.jpg",url_min: "images/photo1_min.jpg",desc: "这是1图片的标题"}](url:大图路径；url_min缩略图路径；desc:图片说明文字)
     */	
	var photosShow = function(elementId,photoInfo){
		var photoInfoLength = photoInfo.length;//图片信息json的长度，即图片个数
		if(photoInfo=="null"||photoInfoLength==0){
			$(elementId).hide();//当图片信息为空时，图片轮换容器隐藏
			return;
		}
		photosShowSequence += 1;
		var mainAreaId = "mainArea_"+photosShowSequence,//图片展示区id
			minPhotoListId = "minPhotoList_"+photosShowSequence;//缩略图滚动区id
			
		var str_minImg = "";//缩略图滚动区html片段
		$.each(photoInfo,function(infoIndex,info){//缩略图滚动区html片段：遍历json数据，将缩略图用li的方式全部加载到缩略图滚动区
			 infoIndex += 1;//infoIndex是从0开始，故加1
			str_minImg += "<li><span class='imgs'><img src='"
					   + info['url_min']+"' title='点击查看第"
					   + infoIndex+"张图片'></span><span class='titles'>"
					   + infoIndex+"<em>/"+photoInfoLength+"</em></span></li>"
		});					
		var str = "<div class='mainArea' id='"+mainAreaId+"'>"//整个“flash”容器内的html片段
				+ "<img class='currentImg' src=''/>"
				+ "<a title='向前' class='photo-left' href='javascript:void(0)'></a>"
				+ "<a title='向后' class='photo-right' href='javascript:void(0)'></a>"
				+ "<p class='title'><span></span></p></div>"
				+ "<div class='minPhotoList' id='"+minPhotoListId+"'>"
				+ "<div class='photo-List'><ul>"+str_minImg+"</ul></div>"
				+ "<a title='向前' class='photo-Up' href='javascript:void(0)'></a>"
				+ "<a title='向后' class='photo-Down' href='javascript:void(0)'></a>"
				+ "</div>"
		$(elementId).append(str);	
		
		var index=0;//当前显示第几张图，0开始
		var potoListLeft=0;/*缩略图区ul的left值，实现滚动*/
		var liWidth = $("#"+minPhotoListId+" li").eq(0).outerWidth();/*缩略图区li的宽度*/
		var liAreaWidth = $("#"+minPhotoListId+" .photo-List").width();/*缩略图区域的总宽度*/
		var liNum = liAreaWidth/liWidth;/*缩略图区域能容下图片的个数*/	
		
		var displayImg = function(index){//显示当前index图
			$("#"+mainAreaId+" .currentImg").attr('src',photoInfo[index].url);
			if(photoInfo[index].desc){//当图片说明文字为空时，隐藏说明文字透明条
				$("#"+mainAreaId+" .title").show();
				$("#"+mainAreaId+" .title span").html(photoInfo[index].desc);
			}
			else{
				$("#"+mainAreaId+" .title").hide();
			}
			$("#"+minPhotoListId+" li").removeClass("photo-Select").eq(index).addClass("photo-Select");	
		}	
		var scroll_left = function(){//向左滚动
			if(photoInfoLength<=liNum&&index==0){//当图片个数小于缩略图区域能容下图片的个数，且当前是第一张图，则禁止左滚动
				return;
			}
			else if(photoInfoLength>liNum&&index==0){	
				index = photoInfoLength-1;
				potoListLeft = liWidth*(photoInfoLength-liNum);
			}
			else if(index>liNum-1){
				index--;
				potoListLeft -= liWidth;
			}
			else{
				index--;
			}
			displayImg(index);
			$("#"+minPhotoListId+" ul").css("left",-potoListLeft);			
		}
		var scroll_right = function(){//向右滚动
			if(photoInfoLength==1&&index==0){//当只有一张图时，禁止右滚动
				return;
			}		
			else if(index >= photoInfoLength-1){
				index = 0;
				potoListLeft = 0;				
			}
			else if(index>=liNum-1){
				index++;
				potoListLeft += liWidth;			
			}
			else{
				index++;
			}
			displayImg(index);	
			$("#"+minPhotoListId+" ul").css("left",-potoListLeft);			
		}	
		displayImg(0);//init初始化 显示第1张图
		$("#"+mainAreaId+" a.photo-left,#"+minPhotoListId+" a.photo-Up").click(function(){//向左按钮
			scroll_left();
		});
		$("#"+mainAreaId+" a.photo-right,#"+minPhotoListId+" a.photo-Down").click(function(){//向右按钮
			scroll_right();
		});	
		$("#"+minPhotoListId+" li").click(function(){//缩略图按钮
			index = $(this).index();
			displayImg(index);
		});		
	}

    cms.Page.photosShow = photosShow;
})(window.jQuery);
