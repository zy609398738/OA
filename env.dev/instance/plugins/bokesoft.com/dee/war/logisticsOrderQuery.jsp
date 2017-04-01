<html>
<%@ page import="com.bokesoft.dee.web.util.HttpUtils"%>
<%@ page import="java.util.*"%>
<%@ page import="java.lang.*"%><html>
<%@ page contentType="text/html; charset=utf-8"%>
<%@ page import="com.bokesoft.dee.web.util.HttpUtils"%>
<%@ page import="java.util.*"%>
<%@ page import="java.lang.*"%>
<%@ page import="com.bokesoft.dee.mule.util.log.XpathFindBusinessData"%>
	
	<head>
		<meta http-equiv="content-type" content="text/html; charset=UTF-8" />
		<meta name="viewport" content="width=device-width,initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no" />
		<title>查询物流</title>
		<style type="text/css">  
			.input{  
			   border-color:#FF0000;  
			   border-style:solid;  
			}
			.table{
			  width:60%;
			  border-collapse:collapse;
			  border:1px solid #ABCDE8;
			}
			.intable{
			  width:100%;
			  border-collapse:collapse;
			  border:1px solid #ABCDE8;
			}
			.tableth{
			  font-size:1.1em;
			  text-align:center;
			  padding-top:5px;
			  background-color:#ABCDE8;
			  color:#ffffff;
			  padding:3px 7px 2px 7px;
			}
			.tabletr{
			  color:#000000;
			  background-color:#ECF5FF;
			  border:1px solid #ABCDE8;
			}
			.tabletd{
			  font-size:1em;
			  border:1px solid #ABCDE8;
			}
		</style>
		<script type="text/javascript">
			//解析xml字符串
			loadXML = function(xmlString){
				var xmlDoc=null;
				//判断浏览器的类型
				//支持IE浏览器 
				if(!window.DOMParser && window.ActiveXObject){   //window.DOMParser 判断是否是非ie浏览器
					var xmlDomVersions = ['MSXML.2.DOMDocument.6.0','MSXML.2.DOMDocument.3.0','Microsoft.XMLDOM'];
					for(var i=0;i<xmlDomVersions.length;i++){
						try{
							xmlDoc = new ActiveXObject(xmlDomVersions[i]);
							xmlDoc.async = false;
							xmlDoc.loadXML(xmlString); //loadXML方法载入xml字符串
							break;
						}catch(e){
						}
					}
				}
				//支持Mozilla浏览器
				else if(window.DOMParser && document.implementation && document.implementation.createDocument){
					try{
						/* DOMParser 对象解析 XML 文本并返回一个 XML Document 对象。
						 * 要使用 DOMParser，使用不带参数的构造函数来实例化它，然后调用其 parseFromString() 方法
						 * parseFromString(text, contentType) 参数text:要解析的 XML 标记 参数contentType文本的内容类型
						 * 可能是 "text/xml" 、"application/xml" 或 "application/xhtml+xml" 中的一个。注意，不支持 "text/html"。
						 */
						domParser = new  DOMParser();
						xmlDoc = domParser.parseFromString(xmlString, 'text/xml');
					}catch(e){
					}
				}
				else{
					return null;
				}

				return xmlDoc;
			}
		
		
			
			var XMLHttpReq;  
			function createXMLHttpRequest() {  
    			try {  
        			XMLHttpReq = new ActiveXObject("Msxml2.XMLHTTP");//IE高版本创建XMLHTTP  
    			}catch(E) {  
       				try {  
            			XMLHttpReq = new ActiveXObject("Microsoft.XMLHTTP");//IE低版本创建XMLHTTP  
        			}catch(E){  
            		XMLHttpReq = new XMLHttpRequest();//兼容非IE浏览器，直接创建XMLHTTP对象  
					}  
				}
			}
    		function sendAjaxRequest(url) {  
			    createXMLHttpRequest();                           //创建XMLHttpRequest对象  
			    XMLHttpReq.open("post", url, true);  
			    XMLHttpReq.onreadystatechange = processResponse; //指定响应函数  
				//setTimeout();
			    XMLHttpReq.send(null);  
			}
			
			//创建物流信息跟踪的表格行并插入数据
			function createRows(rows){
				var table = document.getElementById("resultTable");
				var rowSize = table.rows.length;
				for(var j=3; j<rowSize; rowSize--){
					table.deleteRow(j);
					
				}
				for(var i=0; i<rows.length; i++){
					
					var newRow = table.insertRow(i+3);
					newRow.setAttribute("class","tabletr");
					var newCell = newRow.insertCell(0);
					newCell.innerHTML = rows[i]["dealTime"]; //单元格内的内容
					newCell.setAttribute("class","tabletd");
					//newCell.setAttribute("align","right");
					newCell = newRow.insertCell(1);
					newCell.innerHTML = rows[i]["dealInfo"]; //单元格内的内容
					newCell.setAttribute("class","tabletd");
					//newCell.setAttribute("align","right");
					newCell = newRow.insertCell(2);
					newCell.innerHTML = rows[i]["operator"]; //单元格内的内容
					newCell.setAttribute("class","tabletd");
					//newCell.setAttribute("align","right");
				}
			}
			
			//ajax请求,回显数据.
			function processResponse() {  
    			if (XMLHttpReq.readyState == 4) {  
        			if (XMLHttpReq.status == 200) {  
            			var text = XMLHttpReq.responseText; 
						
						var xmlDoc=loadXML(text);
						var  elements = xmlDoc.getElementsByTagName("responseBody");
						text = elements[0].firstChild.nodeValue;
						textObj = eval('('+text+')') ;
						
						var result = document.getElementById("result");
						createRows(textObj);
						result.style.display = "block";
        			}  
    			}  
			}
			//提交
			function go(){
				var url = "httpService?action=logisticsOrder"
				var requestBody = document.getElementById("requestBody");
				if(requestBody!=null || requestBody!=""){
					url += "&requestBody=" + requestBody;
				}
				sendAjaxRequest(url);
			
			}     
		</script>
	</head>
	
	<body style="font-size: 10px">
		<div align="center">
			<FORM action="" method="post" enctype="multipart/form-data"
				name="form1">
				<table class="table">
					<tr class="tabletr">
						<th colspan="2" class="tableth">查询物流</th>
					</tr>
					<tr>
						<td align="right" width="20%" class="tabletd">
							<div align="right" style="font-size: 11pt">
								单据编号：
							</div>
						</td>
						<td width="80%" class="tabletd">
							<input type="text" name="requestBody" id="requestBody" style="width: 100%" />
						</td>
					</tr>
					<tr class="table">
						<td valign="top">
							&nbsp;
						</td>
						<td align="right" width="25%" class="tabletd">
							<input type="button" onclick="go();" value="提交" />
						</td>
					</tr>
				</table>
				<div id="result" style="overflow-x:auto;overflow-y:auto;height:80%;width:60%;display:none">
				<table class="intable" id="resultTable" style="table-layout:fixed;font-size:14px;">
					<tr class="tabletr">
						<td width="20%"></td>
						<td width="60%"></td>
						<td width="20%"></td>
					</tr>
					<tr class="tabletr">
						<th colspan="3" class="tableth" style="font-size:20px;">订单跟踪</th>
					</tr>
					<tr class="tabletr" style="font-weight: bold">
						<td colspan="" class="tabletd">处理时间</td>
						<td colspan="" class="tabletd" >处理信息</td>
						<td colspan="" class="tabletd">操作人</td>
					</tr>
					
				</table>
				</div>
			</FORM>
		</div>
	</body>
</html>