<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib uri="/WEB-INF/map-html.tld" prefix="yigo" %>
<yigo:context>
<!DOCTYPE html>
<html>
<head>
<style>
/*pop 新建弹出框  **流程的content */
#pop_creat{
	width:570px;
}
#pop_creat h4{
	font-size:25px;
}
.con_list{
    float: left;
    height: 270px;
    overflow: auto;
    width: 235px;	
}
.con_list li{
	padding-left:30px;
}
.con_list li a{
	color:#666;
	height:35px;
	line-height: 35px;
	display:block;
	text-align:left;
	padding-left: 45px;
	background: url(../images/zh_img.png) 0 0 no-repeat;
	_background: url(../images/zh_img.gif) 0 0 no-repeat;
}
.con_list li.hover{
	background:#d3e0e9;
	font-weight:bold;
}
.con_list .finace a{
	background-position:0 -20px;
}
.con_list .office a{
	background-position:0 -70px;
}
.con_list .hire a{
	background-position:0 -120px;
}
.con_list .other a{
	background-position:0 -170px;
}
.pop .tab-content{
	/*padding-left: 235px;*/
	border-bottom: 1px solid #d3e0e9;
}
.in_cont{
	height:270px;
	border-left: 1px solid #d3e0e9;
	overflow:auto;
	display:none;
}
.in_cont a{
	display:block;
	height:25px;
	line-height:25px;
	text-align:left;
	padding-left:18px;
	color:#666;
}
.in_cont a.hover{
	background:#d3e0e9;
}
.controls-button{
	height:25px;
	background:#eff6fa;
	padding: 10px 0;
}
.controls-button a{
	background: url(images/zh-btns-img.gif) left top no-repeat;
	text-decoration: none;
	position: relative;
	float:right;
	height: 25px;
	line-height: 25px;
	color: #006898;
	margin-right:10px;
}
.controls-button a span{
	padding: 2px 20px;
}
.controls-button a b{
	display: block;
	width: 3px;
	height: 25px;
	position: absolute;
	top: 0;
	right: 0;
	background: url(images/zh-btns-img.gif) -147px -25px no-repeat;
}

controls-button{
	height:25px;
	background:#eff6fa;
	padding: 10px 0;
}
.controls-button a{
	background: url(images/zh-btns-img.gif) left top no-repeat;
	text-decoration: none;
	position: relative;
	float:right;
	height: 25px;
	line-height: 25px;
	color: #006898;
	margin-right:10px;
}
.controls-button a span{
	padding: 2px 20px;
}
.controls-button a b{
	display: block;
	width: 3px;
	height: 25px;
	position: absolute;
	top: 0;
	right: 0;
	background: url(images/zh-btns-img.gif) -147px -25px no-repeat;
}

#pop_creat{
	/*background: url(images/pop_bg.gif) #fff left top repeat-x;*/
}

.pop .tab-content{
	height:270px;
}
</style>
</head>
<body>
<!--新建弹出框  begin-->
<div class="pop" id="pop_creat">
	<b class="close"></b>
	<h4>流程分类</h4>
	<div class="pop_content pt_20 lib-tab">
		<div class="tab-head">
			<ul class="con_list">
				<yigo:exp exp="WebNewObject(WF_WorkflowType)+WebSetFilter({ID !=-1})+LoadObject()"/>
				<yigo:iterator dblocation="1">
					<li class=<yigo:out exp="{}&RowValue(CODE)" /> >
						<a href="#" id = <yigo:out exp="{}&RowValue(ID)" /> >
							<yigo:out exp="{}&RowValue(NAME)" />
						</a>
					</li>
				</yigo:iterator>
			</ul>
		</div>
		<div class="tab-content">
			<%@ include file="documents_create_bill.jsp" %>
		</div>
		<div class="controls-button mt_10">
			<a id="create-cancel" href="javascript:void(0);" class="cancel"><span>取消</span><b></b></a>
			<a id="create-ok" href="javascript:void(0);" class="sure"><span>确定</span><b></b></a>
		</div>
	</div>
</div>
</body>
</html>
</yigo:context>