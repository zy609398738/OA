<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" isELIgnored="false"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>

<label class="radio"><input type="radio" name="dateScope" value="1"/>全部</label>
<label class="radio"><input type="radio" name="dateScope" value="2"/>最近一周</label>
<label class="radio"><input type="radio" name="dateScope" value="3"/>今天</label>
<select name="searchType" class="filter-select" onchange=changeType(this)>
	<!--<option value="1">流程编号</option>-->
	<option value="2">主题</option>
	<option value="3">处理人</option>
	<option value="4">流程名称</option>
</select>
<input type="text" class="filter_txt" id="search_ID" name="searchText" value="请输入关键字…"/>
<input class="filter-btn" type="button" value="搜索" onclick="mySubmit()"/>


<script language="JavaScript" type="text/javascript">
   function addListener(element,e,fn){
        if(element.addEventListener){
             element.addEventListener(e,fn,false);
         } else {
             element.attachEvent("on" + e,fn);
          }
   }
   var search_ID = document.getElementById("search_ID");
   addListener(search_ID,"click",function(){
		if(search_ID.value == "请输入关键字…"){
			search_ID.value = "";
		}
   })
   addListener(search_ID,"blur",function(){
	   if(search_ID.value == ""){
			search_ID.value = "请输入关键字…";
	   }
    
   })
   
</script>