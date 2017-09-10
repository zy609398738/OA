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

<title>HL7 Schema SegmentStructure</title>

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

	$(document).ready(function() {
		var args = new Object();
		args = GetUrlParms();
		//如果要查找参数key:
		if (args["hkey"] != undefined) {
			//如果要查找参数key:
			var version = args["version"];
			var hkey = args["hkey"];
			$.getJSON("interfaceHl7InfoController.do?version="+ version+ "&actionType=ss&hkey="+ hkey,function(data) {
				var schema;
				//相当于if...else if...else if判断语句
				schema=((version=="21")&&(schema="2.1"))||((version=="22")&&(schema="2.2"))||
				((version=="23")&&(schema="2.3"))||((version=="231")&&(schema="2.3.1"))||
				((version=="24")&&(schema="2.4"))||((version=="25")&&(schema="2.5"))||
				((version=="251")&&(schema="2.5.1"))||((version=="26")&&(schema="2.6"))||
				((version == "27")&&(schema = "2.7"))||((version=="271")&&(schema="2.7.1"))||
				((version=="ITK")&&(schema="ITK"));
				if(data.description==null){
					data.description="";
				}
				$("#d1").append(schema+":"+data.name+" "+data.description+"("+data.chinese_desc+")");
				//alert(data.description);
				$.each(data.SegmentSubStructure,function(i,item) {
					var newRow = document.getElementById("table").insertRow(i + 1);
					newRow.insertCell(0).innerHTML = item.piece;
					newRow.insertCell(1).innerHTML = item.description;
					
					//去除所有非字母字符
					var description=item.description;
					description=description.replace(/[^a-z|^A-Z]/g,"");
					newRow.insertCell(2).innerHTML =description;
					
					if(item.datatype==null){
						newRow.insertCell(3).innerHTML ="";
					}else{
						newRow.insertCell(3).innerHTML ="<a href='hl7_dt.jsp?version="+version+"&hkey="+item.datatype+"&piece="+item.piece+"&description="+description+"&dt="+hkey+"'>"+item.datatype+"</a>";
					}
					if(item.symbol==null){
						newRow.insertCell(4).innerHTML ="";
					}else{
						if(item.symbol=="!"){
							newRow.insertCell(4).innerHTML = item.symbol+"(exactly one required)";
						}else if(item.symbol=="+"){
							newRow.insertCell(4).innerHTML = item.symbol+"(one or more)";
						}else if(item.symbol=="*"){
							newRow.insertCell(4).innerHTML = item.symbol+"(zero or more)";
						}else if(item.symbol=="?"){
							newRow.insertCell(4).innerHTML = item.symbol+"(conditional)";
						}else{
							newRow.insertCell(4).innerHTML = item.symbol+"(conditional)";
						}
					}
					if(item.repeatcount==null){
						newRow.insertCell(5).innerHTML ="";
					}else{
						newRow.insertCell(5).innerHTML = item.repeatcount;
					}
					if(item.min_length==null){
						newRow.insertCell(6).innerHTML ="";
					}else{
						newRow.insertCell(6).innerHTML = item.min_length;
					}
					if(item.max_length==null){
						newRow.insertCell(7).innerHTML ="";
					}else{
						newRow.insertCell(7).innerHTML = item.max_length;
					}
					if(item.required==null){
						newRow.insertCell(8).innerHTML = "";
					}else{
						newRow.insertCell(8).innerHTML = item.required;
					}
					newRow.insertCell(9).innerHTML = item.ifrepeating;
					if(item.codetable==null){
						newRow.insertCell(10).innerHTML = "";
					}else{
						newRow.insertCell(10).innerHTML ="<a href='hl7_ct.jsp?version="+version+"&hkey="+item.codetable+"'>"+item.codetable+"</a>";
					}
					newRow.insertCell(11).innerHTML = item.chinese_desc;
				});
				$("#table tr:even").addClass("even");
				$("#table tr:odd").addClass("odd");
				$("td").css("padding-left","10px");
				$("td").css("padding-right","10px");
			});
		}
	});
</script>
</head>

<body style="background-color: white;">
	<div style="margin: 5px;">
		<div id="d1" style="font-size: 20px;"></div>
		<div>
			<table id="table" width=auto border="0" cellspacing="2"
				cellpadding="2" style="text-align: center;border: 2px solid #f1f0e7;">
				<tr style="color:#3b84bc;font-weight: bold;">
					<td>字段</td>
					<td>描述</td>
					<td>属性名称</td>
					<td>数据结构</td>
					<td>符号</td>
					<td>重复计数</td>
					<td>最小长度</td>
					<td>最大长度</td>
					<td>必须</td>
					<td>重复</td>
					<td style="width:30px">代码表</td>
					<td>中文描述</td>
				</tr>
			</table>
		</div>
	</div>
</body>
</html>
