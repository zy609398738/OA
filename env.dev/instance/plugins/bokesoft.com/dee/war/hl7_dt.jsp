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

<title>HL7 Data Structure</title>

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

	$(document).ready(function(){
		var args = new Object();
		args = GetUrlParms();
		//如果要查找参数key:
		if (args["hkey"] != undefined) {
			//如果要查找参数key:
			var version = args["version"];
			var hkey = args["hkey"];
			var piece=args["piece"];
			var path=args["description"];
			var dt=args["dt"];
			$.getJSON("interfaceHl7InfoController.do?version="+ version+ "&actionType=dt&hkey="+ hkey,function(data) {
				var schema;
				//相当于if...else if...else if语句
				schema=((version=="21")&&(schema="2.1"))||((version=="22")&&(schema="2.2"))||
					((version=="23")&&(schema="2.3"))||((version=="231")&&(schema="2.3.1"))||
					((version=="24")&&(schema="2.4"))||((version=="25")&&(schema="2.5"))||
					((version=="251")&&(schema="2.5.1"))||((version=="26")&&(schema="2.6"))||
					((version == "27")&&(schema = "2.7"))||((version=="271")&&(schema="2.7.1"))||
					((version=="ITK")&&(schema="ITK"));				
				$("#d1").append("<a href='hl7.jsp?version="+schema+"'>"+schema+"</a>");
				if(dt==null){
					$("#dt").append("");
				}else{
					$("#dt").append("段结构："+"<a href='hl7_ss.jsp?version="+version+"&hkey="+dt+"'>"+dt+"</a>");
				}
				if(piece==null){
					$("#piece").append("");
				}else{
					$("#piece").append("字段编号："+piece);
				}
				$("#d2").append(data.name);
				if(path==null){
					$("#path").append("");
				}else{
					$("#path").append("找到此数据结构所遵循的路径："+dt+":"+path);
				}
				if(data.description==null){
					data.description="";
				}
				$("#d3").append(schema+":"+data.name+" "+data.description+"("+data.chinese_desc+")");
				//alert(data.description);
				$.each(data.DataSubType,function(i,item) {
					var newRow = document.getElementById("table").insertRow(i + 1);
					newRow.insertCell(0).innerHTML =item.piece ;
					newRow.insertCell(1).innerHTML = item.description;
					if(item.description=="???????????"){
						newRow.insertCell(2).innerHTML = "UnnamedPiece"+item.piece;
					}else{
						//去除所有非字母字符
						var description=item.description;
						description=description.replace(/[^a-z|^A-Z]/g,"");
						newRow.insertCell(2).innerHTML =description;
					}
					if (item.datatype == null) {
						newRow.insertCell(3).innerHTML = "";
					} else {
						newRow.insertCell(3).innerHTML ="<a href='hl7_dt.jsp?version="+version+"&hkey="+item.datatype+"'>"+item.datatype+"</a>";
					}
					if(item.min_length==null){
						newRow.insertCell(4).innerHTML ="";
					}else{
						newRow.insertCell(4).innerHTML =item.min_length;
					}
					if(item.max_length==null){
						newRow.insertCell(5).innerHTML ="";
					}else{
						newRow.insertCell(5).innerHTML =item.max_length;
					}
					if(item.required==null){
						newRow.insertCell(6).innerHTML ="";
					}else{
						newRow.insertCell(6).innerHTML =item.required;
					}
					if (item.codetable == null) {
						newRow.insertCell(7).innerHTML = "";
					} else {
						newRow.insertCell(7).innerHTML ="<a href='hl7_ct.jsp?version="+version+"&hkey="+item.codetable+"'>"+item.codetable+"</a>";
					}
					newRow.insertCell(8).innerHTML = item.chinese_desc;
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
		<div id="d1" style="font-size: 20px;font-style: italic;">Schema
			类别:</div>
		<div id="dt" style="font-size: 20px;font-style: italic;"></div>
		<div id="piece" style="font-size: 20px;font-style: italic;"></div>
		<div id="d2" style="font-size: 20px;font-style: italic;">数据结构:</div>
		<div style="font-size: 20px;font-style: italic;">&nbsp;</div>
		<div id="path" style="font-size: 20px;font-style: italic;"></div>
		<div id="d3" style="font-size: 20px;"></div>
		<div>
			<table id="table" width=auto border="0" cellspacing="2"
				cellpadding="2" style="text-align: center;border: 2px solid #f1f0e7;">
				<tr style="color:#3b84bc;font-weight: bold;">
					<td>组件</td>
					<td>描述</td>
					<td>属性名称</td>
					<td>数据结构</td>
					<td>最小长度</td>
					<td>最大长度</td>
					<td>必须</td>
					<td>代码表</td>
					<td>中文描述</td>
				</tr>
			</table>
		</div>
	</div>
</body>
</html>
