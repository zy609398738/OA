<%@page import="com.bokesoft.dee.web.hl7.util.Msss"%>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="utf-8"%>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
  <head>
    
    <title>Document Structure</title>
    
	<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />  
	<meta http-equiv="pragma" content="no-cache">
	<meta http-equiv="cache-control" content="no-cache">
	<meta http-equiv="expires" content="0">
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
			if (args["ms"] != undefined) {
				//如果要查找参数key:
					var version = args["version"];
					var ms = args["ms"];
					//console.info(ms+version);
					var schema;
					//相当于if...else if...else if判断语句
					schema=((version=="21")&&(schema="2.1"))||((version=="22")&&(schema="2.2"))||
					((version=="23")&&(schema="2.3"))||((version=="231")&&(schema="2.3.1"))||
					((version=="24")&&(schema="2.4"))||((version=="25")&&(schema="2.5"))||
					((version=="251")&&(schema="2.5.1"))||((version=="26")&&(schema="2.6"))||
					((version == "27")&&(schema = "2.7"))||((version=="271")&&(schema="2.7.1"))||
					((version=="ITK")&&(schema="ITK"));
					$("#d1").append("<a href='hl7.jsp?version="+schema+"'>"+schema+"</a>");
					$("#d2").append(ms);
					var str=ms.split("_",3);
					//console.info(str[0]);
					if(version=="ITK"){
						$("#d3").append(schema+":"+ms+" xsi:schemaLocation='urn:hl7-org:v2xml "+ms+".xsd'");
						
					}else{
						$.getJSON("interfaceHl7InfoController.do?version="+ version+ "&actionType=mg&hkey="+str[0],
								function(data){
									if(data==null){
										$("#d3").append(schema+":"+ms);
									}else{
										$("#d3").append(schema+":"+ms+" "+data.description+"("+data.chinese_desc+")");
									}
						});
						$.getJSON("interfaceHl7InfoController.do?version="+ version+ "&actionType=me&hkey="+str[1],
								function(data){
									if(data==null){
										$("#d3").append("");
									}else{
										$("#d3").append(" - "+data.description+"("+data.chinese_desc+")");
									}
						});
					}
					//$("#d3").append(schema+":"+ms+" "+des);
					//$("#d4").load("http://localhost:8000/BokeDee/testHl7.jsp?ms="+ms+"&version="+version);
			}
	});
</script>
  </head>
  <% 
		String ms = request.getParameter("ms");
		String version = request.getParameter("version");
		String t = Msss.findSsDescBk(version, ms);
  %>
  <body style="background-color: white;">
    <div style="margin: 5px;">
		<div id="d1" style="font-size: 20px;font-style: italic;">Schema 类别:</div>
		<div id="d2" style="font-size: 20px;font-style: italic;">消息结构:</div>
		<div style="font-size: 20px;font-style: italic;">&nbsp;</div>
		<div id="d3" style="font-size: 20px;"></div>
		<div>
		<%= t%>
		</div>
	</div>
  </body>
</html>
