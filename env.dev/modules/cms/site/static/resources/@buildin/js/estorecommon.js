(function(global){
	var urlTokens = [];
	/**
	 * 提交 json 数据到服务器并在请求成功返回后执行回调；
	 * <ul>
	 *  <li>依赖：jQuery</li>
	 * </ul>
	 * 页面加载效果：如果有class="estoreCommon-loading"的元素，函数执行时就会将其显示
	 * 		e.g. <div id="waiting-layer" class="estoreCommon-loading txt_center" style="position:fixed;width:100%;height:100%;bottom:0;top:0;left:0;top:0;z-index:999;background:#fff;opacity: 0.5;display:none">
	 *				<img src="/static/images/loading.gif" style="position:relative;top:50%;"/>
	 *			</div>
	 * @param url 规定把请求发送到哪个 URL
	 * @param data 规定连同请求发送到服务器的数据(json格式)
	 * @param successCallback 请求成功时执行的回调函数
	 */
	var postJson = function(url, dataObj, successCallback){
		if (urlTokens.indexOf(url) > -1) {
			return;
		} else {
			urlTokens.push(url);
		}
		//页面加载效果
		var loadingSelector = ".estoreCommon-loading";
		var $loadingSelector = $(loadingSelector);
		if($loadingSelector.size()) $loadingSelector.show();
		$.ajax({
			type: 'POST',
			url: url,
			data: dataObj,
			dataType: "json",
			success: function(json){
				urlTokens.pop(url);
				successCallback(json);
				if($loadingSelector.size()) $loadingSelector.hide();
			},
			error: function(xhr/*XMLHttpRequest对象*/, err/*错误信息*/, errStatus/*（可选）捕获的异常对象*/){
				urlTokens.pop(url);
				if($loadingSelector.size()) $loadingSelector.hide();
				var msg = "数据访问错误";
				//检查请求被取消的情况并保持沉默
				if (xhr){
					if (0==xhr.status && "rejected"==xhr.state()){
						return;
					}
				}
				
				//处理和显示错误
				var fail;			
				if ( xhr && xhr.status && xhr.status>=400 ){
					var status = xhr.status;
					var statusText = xhr.statusText;
					msg += "("+status+"/"+statusText+")";
					var respObj = xhr.responseJSON;
					if (respObj){
						fail = msg + "\n\n" + JSON.stringify(respObj, null, 4);
					}
					var respTxt = xhr.responseText;
					if (respTxt){
						fail = msg + "\n\n" + respTxt;
						try{
							//处理 CMS 后台抛出的错误对象(com.bokesoft.cms.core.acl.ErrorMessage)
							var errObj = JSON.parse(respTxt);
							var errMsg = errObj.message;
							if (errMsg){
								if (errMsg.indexOf("ACLException: ")==0){
									//如果以 ACLException 开头, 那么就说明是权限错误
									msg = "权限错误: " + errMsg.substr("ACLException: ".length);
								}else{
									msg += "\n"+errMsg;
								}
							}
						}catch(ex){
							//Ignore it
						}
					}
				}else{
					if (err) {
						msg += "("+err+")";
					}
					if (errStatus) {
						msg += ": " + errStatus;
					}
					fail = msg;
				}
				
				alert(msg);
				throw fail;
			}
		});
	};

	/**
	 * 与后台 PagingSearchResult 对象配合实现的分页显示数据功能；
	 * <ul>
	 *  <li>依赖：jQuery、lodash、jQuery-Paging</li>
	 * </ul>
	 * @param options 分页显示参数
	 * <ul>
	 *  <li>pager：用于显示分页组件的页面元素选择器, 与 selectorGroup 其一必填</li>
	 *  <li>render：用于显示数据的页面元素选择器, 与 selectorGroup 其一必填</li>
	 *  <li>tmpl：用于存放 lodash 模板的页面元素选择器, 与 selectorGroup 其一必填</li>
	 *  <li>selectorGroup：用于统一定义 -pager、-render、-tmpl 3 个选择器, 与 pager/render/tmpl 其一必填</li>
	 *  <li>format：分页组件的显示样式, 可选，默认为 '[< ncnnn! >]' </li>
	 *  <li>pagingData：分页查询数据对象，包含 totalCount、pageNo、pageSize 以及 data 等属性，可选</li>
	 *  <li>dataCallback：在多页跳转时由 Pager 回调的获取数据代码，必填，包含两个参数:
	 *   <ul>
	 *    <li>pageNo: 跳转到的页码(从0开始)</li>
	 *    <li>callback: 传入当前页 分页查询结果数据对象 的回调，供 pager 刷新数据显示</li>
	 *   </ul>
	 *  </li>
	 *  <li>afterRender：模板渲染完成事件，一般用于对模板进行事件绑定, this 对象为 render 页面元素选择器，可选</li>
	 * </ul>
	 */
	var pagingShow = function(options){
		//基本选项
		if (options.selectorGroup){
			if (! options.pager) options.pager=options.selectorGroup+"-pager";
			if (! options.render) options.render=options.selectorGroup+"-render";
			if (! options.tmpl) options.tmpl=options.selectorGroup+"-tmpl";
		}
		var pagerSelector = options.pager;
		var renderSelector = options.render;
		var tmplSelector = options.tmpl;
		//跳转页数
		var gotoSelector = options.goToPage || "";
		//
		var needRender = (options.needRender===false)?false:true;
		//默认页数
		var defaultPage = options.defaultPageNo || 1;
		//显示格式
		var pagerFormat = options.format || '[< ncnnn >]';
		//获取数据方法
		var dataCallback = options.dataCallback || function(){};	//参数 pageNo, pageSize, function(pagingData){}
		//初始数据及分页选项
		var firstPagingData = options.pagingData;
		//与显示相关的页面元素
		var $pager = $(pagerSelector);
		var $render = $(renderSelector);
		var $tmpl = $(tmplSelector);
		var $gotoSelector = $(gotoSelector);
		
		//模板
		var tmplCache = _.template($tmpl.html());
		var afterRender = options.afterRender;
		var renderTmpl = function(data){
			$render.find("*").unbind();	//unbind 所有模板内容的事件
			$render.empty();
			$render.append(tmplCache({items:data}));
			if($gotoSelector.size() && $pager.html().indexOf($gotoSelector.html()) < 0){
				$pager.append($gotoSelector.html());
			}
			if (afterRender){
				afterRender.call($render);
			}
		}
		//分页
		var createPager = function($pager, firstPagingData, pagerFormat, dataCallback){
			//FIXME: 暂时只能把初始数据记录到 pager 节点上
			$pager.data("firstPagingData", firstPagingData);
			//数据刷新的回调
			var dataReceiver = function(pagingData,setpage){
				renderTmpl(pagingData.data);
				var pager = this;
				pager.setNumber(pagingData.totalRecords);
				pager.setOptions({perpage:pagingData.pageSize});
				if(true === setpage) pager.setPage(pagingData.pageNo+1);
			};
			var totalRecords = firstPagingData.totalRecords;
			var pageSize = firstPagingData.pageSize;
			var x = $pager.paging(totalRecords, {
			    format: pagerFormat, 
			    perpage: pageSize,
			    lapping: 0, 
			    page: firstPagingData.pageNo+1,
			    onSelect: function (page,self,paging) {
			    	//var pager = $(this).paging(); //pager对象
			    	var pager = paging;
			        var firstPagingData = $pager.data("firstPagingData");
			        if (firstPagingData){
			        	$pager.data("firstPagingData", null);
			        	dataReceiver.call(pager, firstPagingData,true);
			        }
			        else if(needRender){
			        	var pageNo = page-1;
			        	var callback = dataReceiver;
			        	dataCallback.call(pager, pageNo, callback);
			        }
			        else {
			        	dataCallback.call({},page-1);
			        }
			    },
			    onFormat: function (type) {
			    	var render = function(txt, active, isCurrent ,classStr){
						var pagerClass="pager-active";
						if(classStr){
							pagerClass=pagerClass+" "+classStr;
						}
			    		if (active){
			    			return '<a class="'+pagerClass+'" href="javascript:void(0)">' + txt + '</a>';
			    		}else{
			    			if(isCurrent) return '<span class="'+pagerClass+' cur-page">'+txt+'</span>'
			    			else return '<span class="'+pagerClass+'">'+txt+'</span>'
			    		}
			    	}
			        switch (type) {
				        case 'block': // n and c
				        	if(this.value > this.pages) return "";
				            return render(this.value, (this.active)&&(this.value!=this.page), true,type+"-page");
				        case 'next': // >
				            return render(">", this.active,false,type+"-page");
				        case 'prev': // <
				            return render("<", this.active,false,type+"-page");
				        case 'first': // [
				            return render("|<", this.active,false,type+"-page");
				        case 'last': // ]
				            return render(">|", this.active,false,type+"-page");
				        case 'left':
						case 'right':
							if (!this.active) return '';
							return render(this.value, this.active,false,type+"-page");
				        case "leap":
							if (this.active)
								return render("   ", this.active,false,type+"-page");
							return "";
						case 'fill':
							if (this.active)
								return render("共"+this.pages+"页",false,false,type+"-page");
							return "";
			        }
			    }
			});		
		};
		if (firstPagingData){
			createPager($pager, firstPagingData, pagerFormat, dataCallback);
		}else{
			dataCallback.call({}/*获取初始数据时this为空对象*/, defaultPage-1, function(pagingData){
				createPager($pager, pagingData, pagerFormat, dataCallback);
			});
		}
	};

	/**
	  *检测flash插件是否存在，用于使用上传控件的页面弹出提醒
	  */
	var checkFlash = function(){
		var isIE = (navigator.appVersion.indexOf("MSIE") >= 0);
	    var hasFlash = true;
	 
	    if(isIE) {
	        try{
	            var objFlash = new ActiveXObject("ShockwaveFlash.ShockwaveFlash");
	        } catch(e) {	
	            hasFlash = false;
	        }
	    } else {
	        if(!navigator.plugins["Shockwave Flash"]) {
	            hasFlash = false;
	        }
	    }
	    return hasFlash;
	}
	
	var imageUpload = function(divID,autoStart,type,filelistflag){
	    $(divID).Uploader({autoStart:autoStart,type:type,filelistflag:filelistflag});
	}
	//Export
	if (! global.estoreCommon){
        global.estoreCommon = {
        	mountPoint: {},		//用于页面内容片断的调用入口挂接
			postJson: postJson,
			pagingShow: pagingShow,
			checkFlash: checkFlash,
			imageUpload:imageUpload
        };
    }	
})(window);