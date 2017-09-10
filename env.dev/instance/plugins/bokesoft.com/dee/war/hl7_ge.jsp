<%@ page language="java" import="java.util.*" pageEncoding="utf-8"%>
<%
String path = request.getContextPath();
String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
%>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
  <head>
    <base href="<%=basePath%>">
    
    <title>HL7 MessageGroupEvent</title>
    
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
			if (args["ge"] != undefined) {
				//如果要查找参数key:
					var version = args["version"];
					var ge = args["ge"];
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
					$("#d2").append(ge);
					$.getJSON("interfaceHl7InfoController.do?version="+ version+ "&actionType=allmt",
							function(data) {
								var arr1=new Array();
								var arr2=new Array();
								var arr3=new Array();
								for(var i=0;i<data.length;i++){
									if(data[i].returntype!=null){
										var returntype=data[i].returntype;
										for(var j=0;j<data.length;j++){
											var structure=data[j].structure;
											if(returntype==structure){
												//console.info(returntype);
												arr1.push(returntype);//所有有消息结构的返回类型
											}
											
										}
									}
								}
								for(var i=0;i<data.length;i++){
									if(data[i].returntype!=null){
										arr2.push(data[i].returntype);//所有的返回类型
									}
								}
								
								for(var i=0;i<data.length;i++){
									arr3.push(data[i].structure);//所有的消息类型
								}
								//删除arr3中的重复元素
								var new_arr3=[];
								for(var i=0;i<arr3.length;i++){
									var item=arr3[i];
									if($.inArray(item,new_arr3)==-1){
										new_arr3.push(item);
									}
								}
								/* for(var i=0;i<arr1.length;i++){
									console.info(arr1[i]);
								} */
								//console.info(arr1.length);
								//console.info(arr2.length);
								//console.info(arr3.length);
								for(var i=0;i<arr1.length;i++){
									//console.info(arr2[i]);
									for(var j=0;j<arr2.length;j++){
										if(arr2[j]==arr1[i]){
											//console.info(arr1[j]);
											arr2.splice($.inArray(arr1[i],arr2),1);//所有没有消息结构的返回类型
										}
									}
								}
								//删除arr1中的重复值
								var new_arr1=[];
								for(var i=0;i<arr1.length;i++){
									var item=arr1[i];
									if($.inArray(item,new_arr1)==-1){
										new_arr1.push(item);
									}
								}
								/* console.info(arr2.length);
								console.info(new_arr3.length);
								console.info(new_arr1.length);
								
								console.info(new_arr3.length);
								console.info(new_arr1.length);
								for(var i=0;i<new_arr3.length;i++){
									console.info(new_arr3[i]);
								} */
								
								
								for(var i=0;i<new_arr1.length;i++){
									if(new_arr1[i]==ge){
										$("#td1").append("<a href='hl7_ms.jsp?ms="+ge+"&version="+version+"'>"+ge+"</a>");
									}
								}
								for(var i=0;i<arr2.length;i++){
									var str1=ge.substring(0,3);
									//console.info(str[0]);
									if(arr2[i]==ge){
										if(str1=="ACK"){
											if($("#td1").text()=="ACK"){
												$("#td1").text("");
												$("#td1").append("<a href='hl7_ms.jsp?ms=ACK&version="+version+"'>"+"ACK"+"</a>");
											}else{
												$("#td1").append("<a href='hl7_ms.jsp?ms=ACK&version="+version+"'>"+"ACK"+"</a>");
											}
											//console.info($("#td1").text());
										}else if(ge=="MFR_M02"){
											$("#td1").append("<a href='hl7_ms.jsp?ms=MFR_M01&version="+version+"'>"+"MFR_M01"+"</a>");
										}else if(ge=="MFR_M03"){
											$("#td1").append("<a href='hl7_ms.jsp?ms=MFR_M01&version="+version+"'>"+"MFR_M01"+"</a>");
										}else if(ge=="MFR_M08"){
											$("#td1").append("<a href='hl7_ms.jsp?ms=MFR_M01&version="+version+"'>"+"MFR_M01"+"</a>");
										}else if(ge=="MFR_M09"){
											$("#td1").append("<a href='hl7_ms.jsp?ms=MFR_M01&version="+version+"'>"+"MFR_M01"+"</a>");
										}else if(ge=="MFR_M10"){
											$("#td1").append("<a href='hl7_ms.jsp?ms=MFR_M01&version="+version+"'>"+"MFR_M01"+"</a>");
										}else if(ge=="MFR_M11"){
											$("#td1").append("<a href='hl7_ms.jsp?ms=MFR_M01&version="+version+"'>"+"MFR_M01"+"</a>");
										}else if(ge=="MFR_M12"){
											$("#td1").append("<a href='hl7_ms.jsp?ms=MFR_M01&version="+version+"'>"+"MFR_M01"+"</a>");
										}else if(ge=="MFR_M13"){
											$("#td1").append("<a href='hl7_ms.jsp?ms=MFR_M01&version="+version+"'>"+"MFR_M01"+"</a>");
										}else if(ge=="MFR_M14"){
											$("#td1").append("<a href='hl7_ms.jsp?ms=MFR_M01&version="+version+"'>"+"MFR_M01"+"</a>");
										}else if(ge=="MFK_M02"){
											$("#td1").append("<a href='hl7_ms.jsp?ms=MFK_M01&version="+version+"'>"+"MFK_M01"+"</a>");
										}else if(ge=="MFK_M03"){
											$("#td1").append("<a href='hl7_ms.jsp?ms=MFK_M01&version="+version+"'>"+"MFK_M01"+"</a>");
										}else if(ge=="MFK_M06"){
											$("#td1").append("<a href='hl7_ms.jsp?ms=MFK_M01&version="+version+"'>"+"MFK_M01"+"</a>");
										}else if(ge=="MFK_M07"){
											$("#td1").append("<a href='hl7_ms.jsp?ms=MFK_M01&version="+version+"'>"+"MFK_M01"+"</a>");
										}else if(ge=="MFK_M08"){
											$("#td1").append("<a href='hl7_ms.jsp?ms=MFK_M01&version="+version+"'>"+"MFK_M01"+"</a>");
										}else if(ge=="MFK_M09"){
											$("#td1").append("<a href='hl7_ms.jsp?ms=MFK_M01&version="+version+"'>"+"MFK_M01"+"</a>");
										}else if(ge=="MFK_M10"){
											$("#td1").append("<a href='hl7_ms.jsp?ms=MFK_M01&version="+version+"'>"+"MFK_M01"+"</a>");
										}else if(ge=="MFK_M11"){
											$("#td1").append("<a href='hl7_ms.jsp?ms=MFK_M01&version="+version+"'>"+"MFK_M01"+"</a>");
										}else{
											for(var j=0;j<new_arr3.length;j++){
												var str2=new_arr3[j].substring(0,3);
												if(str1==str2){
													//console.info(new_arr3[j]);
													$("#td1").append("<a href='hl7_ms.jsp?ms="+new_arr3[j]+"&version="+version+"'>"+new_arr3[j]+"</a>");
												}
											}
										}
									}
								}
								
									
					});
					//$("#td1").append("<a href='http://localhost:8000/MenuDemo/ms.jsp?ms="+ge+"&version="+version+"'>"+ge+"</a>");
					//console.info(str[0]);
					var str=ge.split("_",3);
					if(version=="ITK"){
						$.getJSON("interfaceHl7InfoController.do?version="+ version+ "&actionType=mg&hkey="+str[0],
								function(data){
									$("#d3").append(schema+":"+ge+" xsi:schemaLocation='urn:hl7-org:v2xml "+ge+".xsd'");
						});
					}else{
						
						$.getJSON("interfaceHl7InfoController.do?version="+ version+ "&actionType=mg&hkey="+str[0],
								function(data){
									if(data==null){
										$("#d3").append(schema+":"+ge);
									}else{
										$("#d3").append(schema+":"+ge+" "+data.description+"("+data.chinese_desc+")");
									}
						});
						$.getJSON("interfaceHl7InfoController.do?version="+ version+ "&actionType=me&hkey="+str[1],
								function(data){
										$("#d3").append(" - "+data.description+"("+data.chinese_desc+")");
						});
					}
					//$("#d3").append(schema+":"+ms+" "+des);
			}
	});
</script>
  </head>
  
  <body style="background-color: white;">
    <div style="margin: 5px;">
		<div id="d1" style="font-size: 20px;font-style: italic;">Schema 类别:</div>
		<div id="d2" style="font-size: 20px;font-style: italic;">消息结构:</div>
		<div style="font-size: 20px;font-style: italic;">&nbsp;</div>
		<div id="d3" style="font-size: 20px;"></div>
		<div>
			<table width=auto border="0" cellspacing="2"
				cellpadding="2" style="text-align: center;border: 2px solid #f1f0e7;">
				<tr>
					<td>消息结构</td>
					<td id="td1"></td>
				</tr>
				<tr style="background-color: #f6f5f3;">
					<td>返回消息类型</td>
					<td>(无)</td>
				</tr>
			</table>
		</div>
	</div>
  </body>
</html>
