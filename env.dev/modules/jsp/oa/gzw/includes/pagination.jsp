<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib uri="/WEB-INF/map-html.tld" prefix="yigo" %>
<div id="paginationCt" class="block page_dot txt_right clearfix">
    <yigo:exp exp="WebGetPara(WebGetAttribute({x-paramName-page}))+1" var="currentPage" />
    <yigo:exp exp="WebGetPageCount(1)" var="pageCount" />
    <div class="item_all">共<yigo:out exp="Format(GetAllCount(1),{#})"/>条</div>
    <div class="page_all">
    </div>

    <ul class="list-pagination"
        data-container="<yigo:out var="x-container" />"
        data-current-url="<yigo:out var="x-requestURI"/>"
        data-param-page="<yigo:out var="x-paramName-page" />"
        data-current-page="<yigo:out var="currentPage" />"
        data-page-count="<yigo:out var="pageCount" />"
            >
        <li>
            <a class="pagination pg-first<yigo:out exp="if(WebGetAttribute(currentPage)>1,{},{ disabled})" />">首页</a>
        </li>
        <li>
            <a class="pagination pg-prev<yigo:out exp="if(WebGetAttribute(currentPage)>1,{},{ disabled})" />">上一页</a>
        </li>
		<li id="page"></li>
        <li>
            <a class="pagination pg-next<yigo:out exp="if(WebGetAttribute(currentPage)<WebGetAttribute(pageCount),{},{ disabled})" />">下一页</a>
        </li>
        <li>
            <a class="pagination pg-last<yigo:out exp="if(WebGetAttribute(currentPage)<WebGetAttribute(pageCount),{},{ disabled})" />">末页 </WebGetAttribute></a>
        </li>
		<li>共<yigo:out exp="Format(WebGetAttribute(pageCount),{#})" /> 页</li>
	 </ul>
	 
     <div id="perPageSize" class="perPageSize"></div>
</div>
<script type="text/javascript">
	var pageSizeName = "documentPageSize";
	
	$(document).ready(function(){
		var container = $(".list-pagination").attr("data-container");
		var url = $(".list-pagination").attr("data-current-url");
		var paramPage = $(".list-pagination").attr("data-param-page");
		var currentPage = $(".list-pagination").attr("data-current-page");
		var pageCount = $(".list-pagination").attr("data-page-count");

		var pagesize = getCookie(pageSizeName);
		if(pagesize==null) 
		{
			pagesize = 10;
		}
		var maxButtons = 9;
		var perPageSize = [5,10,20,50];
		
		//var selfPageCount = parseInt(Math.ceil(pageCount / pagesize));
		var selfIndex = parseInt(currentPage);
		if(selfIndex > pageCount){
			selfIndex = pageCount;
		}
		if(selfIndex < 1){
			selfIndex = 1;
		}
	
		var selfStart = Math.max(1, selfIndex - parseInt(maxButtons/2));
		var selfEnd = Math.min(pageCount, selfStart + maxButtons - 1);
		selfStart = Math.max(1, selfEnd- maxButtons + 1);
		
		var str="";		
		for(var i=selfStart; i<=selfEnd; i++){
			if(i == currentPage){
				str += '<span class="on">' + i + "</span>";
			}else{
				str += '<a href="javascript:selectPage('+i+')"><span>' + i + '</span></a>';
			}
			str += '&nbsp;';
		}	
		$("#page").html(str);
		
		
		str="";
		str +='<div class="howItems"><span>每页</span>';
		str +='<select onchange="changePageSize(this.value)">'
		for(var i=0; i<perPageSize.length; i++){
		if(perPageSize[i] == pagesize)
			str +='<option value ="'+ perPageSize[i] + '" selected=true>'+ perPageSize[i] +'</option>';
		else
			str +='<option value ="'+ perPageSize[i] + '">'+ perPageSize[i] +'</option>';
		}
		str +='</select>'
		str +='<span>条</span></div>';
		
		str += '</div><!-- /.pagerView -->\n';
		$("#perPageSize").html(str);
		
	});
		
    void function(_){
		_(function(){
            _('<yigo:out var="x-container"/> .list-pagination').pagination();
        });
    }(window.jQuery);
	
	function changePageSize(n){
		addCookie(pageSizeName,n,1000);
		window.location.reload();  
	}
	
	function selectPage(i){
		window.location.href = window.location.pathname+"?currentPage="+i;
	}
	
	function addCookie(objName,objValue,objHours){//添加cookie
		var str = objName + "=" + escape(objValue);
		if(objHours > 0){//为0时不设定过期时间，浏览器关闭时cookie自动消失
		var date = new Date();
		var ms = objHours*3600*1000;
		date.setTime(date.getTime() + ms);
		str += "; expires=" + date.toGMTString();
		}
		document.cookie = str;
	}
	
	function getCookie(name) {
		var prefix = name + "="
		var start = document.cookie.indexOf(prefix)

		if (start == -1) {
			return null;
		}

		var end = document.cookie.indexOf(";", start + prefix.length)
		if (end == -1) {
			end = document.cookie.length;
		}

		var value = document.cookie.substring(start + prefix.length, end)
		return unescape(value);
	}
</script>