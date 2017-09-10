<%@ page language="java" import="java.util.*" pageEncoding="utf-8"%>
<%
	String path = request.getContextPath();
	String basePath = request.getScheme() + "://"
			+ request.getServerName() + ":" + request.getServerPort()
			+ path + "/";
%>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
<head>
<base href="<%=basePath%>">

<title>HL7 Schemas</title>

<meta http-equiv="pragma" content="no-cache">
<meta http-equiv="cache-control" content="no-cache">
<meta http-equiv="expires" content="0">
<meta http-equiv="keywords" content="keyword1,keyword2,keyword3">
<meta http-equiv="description" content="This is my page">
<!--
	<link rel="stylesheet" type="text/css" href="styles.css">
	-->
<link rel="stylesheet" type="text/css" href="css/hl7.css">
<script type="text/javascript" src="js/jquery-1.8.3.min.js"></script>
<script type="text/javascript">
	function GetUrlParms() {
		var args = new Object();
		var query = location.search.substring(1);//获取查询串   
		var pairs = query.split("&");//在&号处断开   
		for ( var i = 0; i < pairs.length; i++) {
			var pos = pairs[i].indexOf('=');//查找name=value   
			if (pos == -1)
				continue;//如果没有找到就跳过   
			var argname = pairs[i].substring(0, pos);//提取name   
			var value = pairs[i].substring(pos + 1);//提取value   
			args[argname] = unescape(value);//存为属性   
		}
		return args;
	}
	
	$(document).ready(
		function(){
			var args = new Object();
			args = GetUrlParms();
			//如果要查找参数key:
			if (args["hkey"] != undefined) {
				//如果要查找参数key:
					var version = args["version"];
					var hkey = args["hkey"];
					$.getJSON("interfaceHl7InfoController.do?version="+version+"&actionType=ct&hkey="+hkey,
									function(data){
										var schema;
										//相当于if...else if...else if判断语句
										schema=((version=="21")&&(schema="2.1"))||((version=="22")&&(schema="2.2"))||
										((version=="23")&&(schema="2.3"))||((version=="231")&&(schema="2.3.1"))||
										((version=="24")&&(schema="2.4"))||((version=="25")&&(schema="2.5"))||
										((version=="251")&&(schema="2.5.1"))||((version=="26")&&(schema="2.6"))||
										((version == "27")&&(schema = "2.7"))||((version=="271")&&(schema="2.7.1"))||
										((version=="ITK")&&(schema="ITK"));					
										$("#d1").append("<a href='hl7.jsp?version="+schema+"'>"+schema+"</a>");
										$("#d2").append(data.name);
										$("#d3").append(data.description+"("+data.chinese_desc+")");
										if(data.tabletype=="1"){
											$("#d4").append(data.tabletype+"(用户)");
										}else if(data.tabletype=="2"){
											$("#d4").append(data.tabletype+"(HL7)");
										}else if(data.tabletype=="0"){
											$("#d4").append(data.tabletype+"(未知)");
										}else if(data.tabletype=="4"){
											$("#d4").append(data.tabletype+"(不再使用)");
										}else if(data.tabletype=="5"){
											$("#d4").append(data.tabletype+"(以替换)");
										}else if(data.tabletype=="6"){
											$("#d4").append(data.tabletype+"(用户组、国民已定义)");
										}else if(data.tabletype=="3"){
											$("#d4").append(data.tabletype+"(HL7和用户)");
										}
										//alert(data.description);
										$.each(data.Enumerate,function(i,item){
											var newRow = document.getElementById("table").insertRow(i+1);
											newRow.insertCell(0).innerHTML = item.value;
											newRow.insertCell(1).innerHTML = item.description;
											newRow.insertCell(2).innerHTML = item.chinese_desc;
										});
										$("#table tr:even").addClass("even");
										$("#table tr:odd").addClass("odd");
										$("td").css("padding-left","10px");
										$("td").css("padding-right","10px");
								});
			}
			
		}
	);
</script>
</head>

<body style="background-color: white;">
	<div style="margin: 5px;">
		<div id="d1" style="font-size: 20px;font-style: italic;">Schema 类别:</div>
		<div id="d2" style="font-size: 20px;font-style: italic;">代码表:</div>
		<div id="d3" style="font-size: 20px;font-style: italic;">描述:</div>
		<div id="d4" style="font-size: 20px;font-style: italic;">类型:</div>
		<div>
			<table id="table" width=auto border="0" cellspacing="2"
				cellpadding="2" style="text-align: center;border: 2px solid #f1f0e7;">
				<tr style="color:#3b84bc;font-weight: bold;">
					<td>代码</td>
					<td>意义</td>
					<td>中文描述</td>
				</tr>
			</table>
		</div>
	</div>
</body>
</html>
