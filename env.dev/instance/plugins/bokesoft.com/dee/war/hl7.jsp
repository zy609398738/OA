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
	//解析url
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
					function() {
						$(".right ul li").click(
								function() {
									$(this).addClass('hit').siblings().removeClass('hit');
									$('.panes>div:eq(' + $(this).index() + ')').show().siblings().hide();
								});
						$(".t1 tr:not(:first)").bind('mouseover',
								function() {
									$(this).css("cursor", "hand");
								});

						$("#ltable tr:even").addClass("even");
						$("#ltable tr:odd").addClass("odd");
						
						//$(".t1 tr:eq(1) td:eq(0)").text("");

						$(".t1 tr:not(:first)").click(
							function() {
								//单击后第一列的文本变化
								$(".t1 tr:eq(1) td:eq(0)").text("");
								$(".t1 tr:eq(2) td:eq(0)").text("");
								$(".t1 tr:eq(3) td:eq(0)").text("");
								$(".t1 tr:eq(4) td:eq(0)").text("");
								$(".t1 tr:eq(5) td:eq(0)").text("");
								$(".t1 tr:eq(6) td:eq(0)").text("");
								$(".t1 tr:eq(7) td:eq(0)").text("");
								$(".t1 tr:eq(8) td:eq(0)").text("");
								$(".t1 tr:eq(9) td:eq(0)").text("");
								$(".t1 tr:eq(10) td:eq(0)").text("");
								$(".t1 tr:eq(11) td:eq(0)").text("");
								$(this).children("td:eq(0)").text(">>");
								//单击后背景颜色变化
								$(this).css("background","#2f6280").siblings().css("background","");
								//表格内字体颜色变化
								$(this).css("color","#ffffff").siblings().css("color","");
							
								var version = $(this).children("td:eq(1)").text();
								
								$("#a1").empty();
								$("#a2").empty();
								$("#a3").empty();
								$("#a4").empty();
								$("#a5").empty();
								$("#a1").append("类别"+version+"中的HL7消息类型");
								$("#a2").append("类别"+version+"中的HL7文档类型结构");
								$("#a3").append("类别"+version+"中的HL7段结构");
								$("#a4").append("类别"+version+"中的HL7复合与基本数据类型结构");
								$("#a5").append("类别"+version+"中的HL7代码表");
								
								version = version.replace(".", "");
								version = version.replace(".", "");
								$("#table").show();
								$("#table1").show();
								$("#table2").show();
								$("#table3").show();
								$("#table4").show();
								$.getJSON("interfaceHl7InfoController.do?version="+ version+ "&actionType=allmt",
									function(data) {
										$("#table tbody tr:not(:first)").remove();
										for ( var i = 0; i < data.length; i++) {
											var newRow = document.getElementById("table").insertRow(i + 1);
											newRow.insertCell(0).innerHTML = i + 1;
											newRow.insertCell(1).innerHTML = data[i].name;
											newRow.insertCell(2).innerHTML = "<a href='hl7_ms.jsp?ms="+data[i].structure+"&version="+version+"' target='_blank'>"+data[i].structure+"</a>";
											if (data[i].returntype == null) {
												newRow.insertCell(3).innerHTML = "";
											} else {
												newRow.insertCell(3).innerHTML ="<a href='hl7_ge.jsp?ge="+data[i].returntype+"&version="+version+"' target='_blank'>"+ data[i].returntype+"</a>";
											}
										}
										$("#table tr:even").addClass("even");
										$("#table tr:odd").addClass("odd");
								});

								$.getJSON("interfaceHl7InfoController.do?version="+ version+ "&actionType=allms",
									function(data){
										$("#table1 tbody tr:not(:first)").remove();
										for ( var i = 0; i < data.length; i++) {
											var newRow = document.getElementById("table1").insertRow(i + 1);
											newRow.insertCell(0).innerHTML = i + 1;
											newRow.insertCell(1).innerHTML ="<a href='hl7_ms.jsp?ms="+data[i].name+"&version="+version+"' target='_blank'>"+ data[i].name+"</a>";
										}
										$("#table1 tr:even").addClass("even");
										$("#table1 tr:odd").addClass("odd");
								});
								
								$.getJSON("interfaceHl7InfoController.do?version="+ version+ "&actionType=allss",
									function(data){
										$("#table2 tbody tr:not(:first)").remove();
										for ( var i = 0; i < data.length; i++) {
											var newRow = document.getElementById("table2").insertRow(i + 1);
											newRow.insertCell(0).innerHTML = i + 1;
											var name="<a href='hl7_ss.jsp?version="+version+"&hkey="+data[i].name+"' target='_blank'>"+data[i].name+"</a>";
											newRow.insertCell(1).innerHTML = name;
											newRow.insertCell(2).innerHTML = data[i].description;
											newRow.insertCell(3).innerHTML = data[i].chinese_desc;
										}
										$("#table2 tr:even").addClass("even");
										$("#table2 tr:odd").addClass("odd");
								});
								
								$.getJSON("interfaceHl7InfoController.do?version="+ version+ "&actionType=alldt",
									function(data){
										$("#table3 tbody tr:not(:first)").remove();
										for ( var i = 0; i < data.length; i++) {
											var newRow = document.getElementById("table3").insertRow(i + 1);
											newRow.insertCell(0).innerHTML = i + 1;
											var name="<a href='hl7_dt.jsp?version="+version+"&hkey="+data[i].name+"' target='_blank'>"+data[i].name+"</a>";
											newRow.insertCell(1).innerHTML = name;
											if(data[i].description==null){
												newRow.insertCell(2).innerHTML = "";
											}else{
												newRow.insertCell(2).innerHTML = data[i].description;
											}
											if(data[i].chinese_desc==null){
												newRow.insertCell(3).innerHTML ="";
											}else{
												newRow.insertCell(3).innerHTML = data[i].chinese_desc;
											}
										}
										$("#table3 tr:even").addClass("even");
										$("#table3 tr:odd").addClass("odd");
								});
								
								$.getJSON("interfaceHl7InfoController.do?version="+ version+ "&actionType=allct",
									function(data){
										$("#table4 tbody tr:not(:first)").remove();
										for ( var i = 0; i < data.length; i++) {
											var newRow = document.getElementById("table4").insertRow(i + 1);
											newRow.insertCell(0).innerHTML = i + 1;
											var name="<a href='hl7_ct.jsp?version="+version+"&hkey="+data[i].name+"' target='_blank'>"+data[i].name+"</a>";
											newRow.insertCell(1).innerHTML = name;;
											newRow.insertCell(2).innerHTML = data[i].description;
											newRow.insertCell(3).innerHTML = data[i].chinese_desc;
										}
										$("#table4 tr:even").addClass("even");
										$("#table4 tr:odd").addClass("odd");
								});
								
				});
				//$("#tr1").trigger("click");
				//$(".t1 tr:eq(1)").trigger("click");
				
				var args = new Object();
				args = GetUrlParms();
				var version = args["version"];
				//console.info(version);
				if(version=="2.1"){
					$(".t1 tr:eq(1)").trigger("click");
				}else if(version=="2.2"){
					$(".t1 tr:eq(2)").trigger("click");
				}else if(version=="2.3"){
					$(".t1 tr:eq(3)").trigger("click");
				}else if(version=="2.3.1"){
					$(".t1 tr:eq(4)").trigger("click");
				}else if(version=="2.4"){
					$(".t1 tr:eq(5)").trigger("click");
				}else if(version=="2.5"){
					$(".t1 tr:eq(6)").trigger("click");
				}else if(version=="2.5.1"){
					$(".t1 tr:eq(7)").trigger("click");
				}else if(version=="2.6"){
					$(".t1 tr:eq(8)").trigger("click");
				}else if(version=="2.7"){
					$(".t1 tr:eq(9)").trigger("click");
				}else if(version=="2.7.1"){
					$(".t1 tr:eq(10)").trigger("click");
				}else if(version=="ITK"){
					$(".t1 tr:eq(11)").trigger("click");
				}else{
					$(".t1 tr:eq(1)").trigger("click");
				}
	});
</script>
</head>

<body>
	<div>
		<div class="left">
			<table id="ltable" class="t1" width="200" border="0" cellspacing="2"
				cellpadding="2" style="text-align: center;border:2px solid #f1f0e7;">
				<tr style="font-size: 15px;color: #3b84bc">
					<td>&nbsp;</td>
					<td>类别</td>
					<td>JavaDoc</td>
					<td>标准</td>
				</tr>
				<tr>
					<td>&nbsp;&nbsp;</td>
					<td>2.1</td>
					<td><a href="../hl7_javadoc/21/index.html" target="_black">2.1</a></td>
					<td>是</td>
				</tr>
				<tr>
					<td>&nbsp;&nbsp;</td>
					<td>2.2</td>
					<td><a href="../hl7_javadoc/22/index.html" target="_black">2.2</a></td>
					<td>是</td>
				</tr>
				<tr>
					<td>&nbsp;&nbsp;</td>
					<td>2.3</td>
					<td><a href="../hl7_javadoc/23/index.html" target="_black">2.3</a></td>
					<td>是</td>
				</tr>
				<tr>
					<td>&nbsp;</td>
					<td>2.3.1</td>
					<td><a href="../hl7_javadoc/231/index.html" target="_black">2.3.1</a></td>
					<td>是</td>
				</tr>
				<tr>
					<td>&nbsp;&nbsp;</td>
					<td>2.4</td>
					<td><a href="../hl7_javadoc/24/index.html" target="_black">2.4</a></td>
					<td>是</td>
				</tr>
				<tr>
					<td>&nbsp;</td>
					<td>2.5</td>
					<td><a href="../hl7_javadoc/25/index.html" target="_black">2.5</a></td>
					<td>是</td>
				</tr>
				<tr>
					<td>&nbsp;&nbsp;</td>
					<td>2.5.1</td>
					<td><a href="../hl7_javadoc/251/index.html" target="_black">2.5.1</a></td>
					<td>是</td>
				</tr>
				<tr>
					<td>&nbsp;</td>
					<td>2.6</td>
					<td><a href="../hl7_javadoc/26/index.html" target="_black">2.6</a></td>
					<td>是</td>
				</tr>
				<tr>
					<td>&nbsp;&nbsp;</td>
					<td>2.7</td>
					<td>&nbsp;&nbsp;</td>
					<td>是</td>
				</tr>
				<tr>
					<td>&nbsp;</td>
					<td>2.7.1</td>
					<td>&nbsp;</td>
					<td>是</td>
				</tr>
				<tr>
					<td>&nbsp;&nbsp;</td>
					<td>ITK</td>
					<td>&nbsp;&nbsp;</td>
					<td>是</td>
				</tr>
			</table>
		</div>
		<div class="right">
			<ul>
				<li class="hit">消息类型</li>
				<li>DocType结构</li>
				<li>段结构</li>
				<li>数据结构</li>
				<li>代码表</li>
			</ul>
			<div class="panes">
				<div class="pane" style="display:block;">
					<h4 id="a1" style="font-size: 20px;font-weight: lighter;"></h4>
					<br>
					<table id="table" width="780" border="0" cellspacing="2"
						cellpadding="2" style="text-align: center;display: none;border:2px solid #f1f0e7;background-color: #fff;">
						<tr>
							<td style="width: 50px"></td>
							<td>Name</td>
							<td>Structure</td>
							<td>ReturnType</td>
						</tr>
					</table>
				</div>
				<div class="pane">
					<h4 id="a2" style="font-size: 20px;font-weight: lighter;"></h4>
					<br>
					<table id="table1" width="780" border="0" cellspacing="2"
						cellpadding="2" style="text-align: center;display: none;border:2px solid #f1f0e7;background-color: #fff;">
						<tr>
							<td style="width: 50px"></td>
							<td>Name</td>
						</tr>
					</table>
				</div>
				<div class="pane">
					<h4 id="a3" style="font-size: 20px;font-weight: lighter;"></h4>
					<br>
					<table id="table2" width="780" border="0" cellspacing="2"
						cellpadding="2" style="text-align: center;display: none;border:2px solid #f1f0e7;background-color: #fff;">
						<tr>
							<td style="width: 50px"></td>
							<td style="width: 60px">Name</td>
							<td>Description</td>
							<td>Chinese_Desc</td>
						</tr>
					</table>
				</div>
				<div class="pane">
					<h4 id="a4" style="font-size: 20px;font-weight: lighter;"></h4>
					<br>
					<table id="table3" width="780" border="0" cellspacing="2"
						cellpadding="2" style="text-align: center;display: none;border:2px solid #f1f0e7;background-color: #fff;">
						<tr>
							<td style="width: 50px"></td>
							<td style="width: 60px">Name</td>
							<td>Description</td>
							<td>Chinese_Desc</td>
						</tr>
					</table>
				</div>
				<div class="pane">
					<h4 id="a5" style="font-size: 20px;font-weight: lighter;"></h4>
					<br>
					<table id="table4" width="780" border="0" cellspacing="2"
						cellpadding="2" style="text-align: center;display: none;border:2px solid #f1f0e7;background-color: #fff;">
						<tr>
							<td style="width: 50px"></td>
							<td style="width: 60px">Name</td>
							<td>Description</td>
							<td>Chinese_Desc</td>
						</tr>
					</table>
				</div>
			</div>
		</div>
	</div>
</html>
