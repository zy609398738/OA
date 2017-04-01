<html>
<%@ page contentType="text/html; charset=utf-8" %>
<%@ page import="com.bokesoft.dee.web.util.HttpUtils"%>
<%@ page import="java.util.*"%>
<%@ page import="java.lang.*"%>
<%
	Object webTitle = null;
	Object tableTitle = null;
	Object action = null;
	List<Map> parlist = null;
	Map detailObject = null;
	List responseList = null;
	Object fileParName = null;
	List xyyzdzd = new ArrayList();
	String[] fileTypes = null;

	webTitle = session.getAttribute("webTitle");
	if(null == webTitle)
			webTitle = "文件上传";
	tableTitle = session.getAttribute("tableTitle");
	if(null == tableTitle)
			tableTitle = "上传列表";
	action = session.getAttribute("action");
	parlist = (List<Map>)session.getAttribute("parlist");
	detailObject = (Map)session.getAttribute("detailObject");
	responseList = (List)session.getAttribute("responseList");
	fileParName = session.getAttribute("fileName");
	if(detailObject!=null){
		String fileType = (String)detailObject.get("fileType");
		if(null != fileType){
			String[] fts = fileType.split(",");
			int ftslength = fts.length;
		    fileTypes = new String[ftslength*3];
			int ftsl = 0;
			for(int i = 0;i < ftslength;i++){
				String ftsit = fts[i].trim();
				fileTypes[ftsl++] = ftsit.toLowerCase();
				fileTypes[ftsl++] = ftsit.toUpperCase();
				fileTypes[ftsl++] = ftsit;
			}
		}
		if(detailObject.get("data")!=null){
			List data = (List)detailObject.get("data");
			int size = data.size();
			for(int i = 0;i < size;i++){
				Map m = (Map)data.get(i);
				boolean ab = Boolean.valueOf((String)m.get("allowBlank"));
				if(!ab){
					xyyzdzd.add(m.get("key"));
					xyyzdzd.add(m.get("displayName"));
				}
			}
		}
		xyyzdzd.add(detailObject.get("fileName"));
		xyyzdzd.add("上传文件");
	}
	
	//if(session.getAttribute("userInfo") != null){
	//	session.removeAttribute("action");
	//}
	if(session.getAttribute("userInfo") != null || "false".equals(session.getAttribute("verification"))){
		session.removeAttribute("param");
		session.removeAttribute("action");
	}
	//上传列表显示是否需要认证，默认是认证的，改成false就是关闭认证
	String listloginflag = "true";
	
	//保留所有用户参数
	Map pm = request.getParameterMap();
	Set<Map.Entry> set = pm.entrySet();
	int canshusize = set.size();
	String path = "";
	int jishu = 1;
	for (Map.Entry me : set) {
		if(jishu == 1)
			path = "&" + path;
		if("action".equals((String)me.getKey()) || "services".equals((String)me.getKey())){
			jishu++;	
			continue;
		}
		path = path + me.getKey() + "=" + ((String[])me.getValue())[0];
		if(jishu < canshusize)
			path = path + "&";
		jishu++;
	}
	if(!path.contains("="))
		path = "";
	String qingqiudizhi = "./fileUpload?action=upload" + path;
	
%>

	<head>
		<meta http-equiv="content-type" content="text/html; charset=UTF-8" />
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
		
			var _bkErrMsg = "<%=session.getAttribute("msg")%>";
			var userInfo = "<%=session.getAttribute("userInfo")%>";
			var verification = "<%=session.getAttribute("verification")%>";
			var listloginflag = "<%=listloginflag%>";
			var action = "<%=action%>";
			if('null' != _bkErrMsg || 'null' == userInfo){
				if('null' != _bkErrMsg){
					alert(_bkErrMsg);
				}
				if('false' == verification){
				//donothing
				} else {
					if('list' == action && 'false' == listloginflag){
						//donothing
					} else 
						location.href = 'loginDesign.jsp?forwardurl=fileUpload';
				}
			}
			
			function invokeExport(){
				if(document.getElementById("jieguodiv") == null)
					alert("请先点击提交按钮！");
				else
					window.location.href="./fileUpload?action=export";
			}
		
			function wktx(id){ 
				var value= document.getElementById(id).value;  
				var object= document.getElementById(id);  
				if(value==null||value==''){  
					object.setAttribute("class","input");  
				}else{  
					object.setAttribute("class","");  
				}
			}

			function wktjjc(){
				var yzkz = new Array();
				<%	
				if(xyyzdzd.size() != 0){
					int size = xyyzdzd.size();
					for(int i = 0;i < size;i++){
						out.println("yzkz[" + i + "]=\""+xyyzdzd.get(i)+"\";");
					}
				}
				%>
				var size = yzkz.length;
				for(var i = 0;i < size;i = i + 2){
					var value= document.getElementById(yzkz[i]).value;
					var object= document.getElementById(yzkz[i]);
					if(value==null||value==''){ 
						object.setAttribute("class","input");
						alert(yzkz[i+1]+"不能为空!"); 
						return false;
					}
				}

				var yzwjlx = new Array();
				<%	
				if(null != fileTypes){
					int size = fileTypes.length;
					for(int i = 0;i < size;i++){
						out.println("yzwjlx[" + i + "]=\""+fileTypes[i]+"\";");
					}
				}
				%>

				var size1 = yzwjlx.length;
				var value1= document.getElementById(yzkz[size - 2]).value;
				var object1= document.getElementById(yzkz[size - 2]);
				if(size1 > 0){
				for(var i = 0;i < size1;i++){
					if(value.indexOf("."+yzwjlx[i]) != -1){
						//提交锁屏
				        loading();
						return true;
					}
				}
				object1.setAttribute("class","input");
				alert("所选择的文件类型不正确，必须是["+yzwjlx+"]!"); 
				return false;
				}
			}

			var MsgBox_ID=""; 

			function modeAlert(msgID){
				var value= document.getElementById(msgID).value;
				document.getElementById("nrly").value = value;

				var bgObj=document.createElement("div");  
				bgObj.setAttribute('id','bgModeAlertDiv');  
				document.body.appendChild(bgObj);  
				show_bgDiv();  
				MsgBox_ID="xsk";
				show_msgDiv();  
			}  

			function closeAlert(){  
				var msgObj=document.getElementById(MsgBox_ID);  
				var bgObj=document.getElementById("bgModeAlertDiv");  
				msgObj.style.display="none";  
				document.body.removeChild(bgObj);  
				MsgBox_ID="";  
			}  

			window.onresize=function(){  
				if (MsgBox_ID.length>0){  
					show_bgDiv();  
					show_msgDiv();  
				}  
			}  

			window.onscroll=function(){  
				if (MsgBox_ID.length>0){  
					show_bgDiv();  
					show_msgDiv();  
				}  
			}  

			function show_msgDiv(){  
				var msgObj   = document.getElementById(MsgBox_ID);  
				msgObj.style.display  = "block";  
				var msgWidth = msgObj.scrollWidth;  
				var msgHeight= msgObj.scrollHeight;  
				var bgTop=myScrollTop();  
				var bgLeft=myScrollLeft();  
				var bgWidth=myClientWidth();  
				var bgHeight=myClientHeight();  
				var msgTop=bgTop+Math.round((bgHeight-msgHeight)/4);  
				var msgLeft=bgLeft+Math.round((bgWidth-msgWidth)/2);  
				msgObj.style.position = "absolute";  
				msgObj.style.top      = msgTop+"px";  
				msgObj.style.left     = msgLeft+"px";  
				msgObj.style.zIndex   = "10001";  

			}  

			function show_bgDiv(){  
				var bgObj=document.getElementById("bgModeAlertDiv");  
				var bgWidth=myClientWidth();  
				var bgHeight=myClientHeight();  
				var bgTop=myScrollTop();  
				var bgLeft=myScrollLeft();  
				bgObj.style.position   = "absolute";  
				bgObj.style.top        = bgTop+"px";  
				bgObj.style.left       = bgLeft+"px";  
				bgObj.style.width      = "100%";  
				bgObj.style.height     = "100%";  
				bgObj.style.zIndex     = "10000";  
				bgObj.style.background = "#777";  
				bgObj.style.filter     = "progid:DXImageTransform.Microsoft.Alpha(style=0,opacity=60,finishOpacity=60);";  
				bgObj.style.opacity    = "0.6";  
			}  

			function myScrollTop(){  
				var n=window.pageYOffset   
				|| document.documentElement.scrollTop   
				|| document.body.scrollTop || 0;  
				return n;  
			}  

			function myScrollLeft(){  
				var n=window.pageXOffset   
				|| document.documentElement.scrollLeft   
				|| document.body.scrollLeft || 0;  
				return n;  
			}  

			function myClientWidth(){  
				var n=document.documentElement.clientWidth   
				|| document.body.clientWidth || 0;  
				return n;  
			}  

			function myClientHeight(){  
				var n=document.documentElement.clientHeight   
				|| document.body.clientHeight || 0;  
				return n;  
			}

			function loading()
			{
				var msgw,msgh,bordercolor;
				msgw=150;
				msgh=40;
				titleheight=25 
				bordercolor="#336699";
				titlecolor="#99CCFF";
				var sWidth,sHeight;
				sWidth=document.body.offsetWidth;
				sHeight=screen.height;
				var bgObj=document.createElement("div");
				bgObj.setAttribute('id','bgDiv');
				bgObj.style.position="absolute";
				bgObj.style.top="0";
				bgObj.style.background="#777";
				bgObj.style.filter="progid:DXImageTransform.Microsoft.Alpha(style=3,opacity=25,finishOpacity=75";
				bgObj.style.opacity="0.6";
				bgObj.style.left="0";
				bgObj.style.width=sWidth + "px";
				bgObj.style.height=sHeight + "px";
				bgObj.style.zIndex = "10000";
				document.body.appendChild(bgObj);
				var msgObj=document.createElement('div');
				msgObj.setAttribute("id","msgDiv");
				msgObj.setAttribute("align","center");
				msgObj.style.background="white";
				msgObj.style.border="1px solid " + bordercolor;
				msgObj.style.position = "absolute";
				msgObj.style.left = sWidth/2-75 + "px";
				msgObj.style.top = sHeight/2-100 +"px";
				msgObj.style.font="12px/1.6em Verdana, Geneva, Arial, Helvetica, sans-serif";
				//msgObj.style.marginLeft = "-225px" ;
				//msgObj.style.marginTop = -75+document.documentElement.scrollTop+"px";
				msgObj.style.width = msgw+"px";
				msgObj.style.height = msgh+"px";
				msgObj.style.textAlign = "center";
				msgObj.style.lineHeight ="25px";
				msgObj.style.zIndex = "10001";

				document.body.appendChild(msgObj);
				var tableObj = document.getElementById("loadingtable");
				tableObj.setAttribute("style","");
				document.getElementById("msgDiv").appendChild(tableObj);
			} 
		</script>	
		<title><%=webTitle%></title>
	</head>

	<body style="font-size: 10px">
		<div align="center">
			<%if (null == action){%>
			<table width="648" border="0" cellspacing="0">
				<tr>
					<td border="0" colspan="2" height="80" align="center">参数不正确</td>
				</tr>
			</table>
			<%} else if ("list" == action){%>
			<table class="table">
				<tr>
					<th class="tableth"><%=tableTitle%></th>
				</tr>
				<%
					if(null != parlist){
						int size = parlist.size();
						for(int i = 0;i < size;i++){
							Map m = parlist.get(i);
							Object name = m.get("name");
							Object sid = m.get("services");
							if(i%2 == 0)
								out.println("<tr>");
							else
								out.println("<tr class=\"tabletr\">");
							out.println("<td>");
							out.println("<a href=\"./fileUpload?action=detail&services=" + sid + "\" >" + name + "</a>");
							out.println("</td>");
							out.println("</tr>");
						}
					}
				%>
			</table>
			<%} else if ("detail" == action){%>
			<FORM action="<%=qingqiudizhi%>" method="post" enctype="multipart/form-data"
				name="form1">
				<table class="table">
					<tr>
						<th colspan="2" class="tableth"><%=tableTitle%></th>
					</tr>
					<%
						if(null != detailObject){
							List data = (List)detailObject.get("data");
							int size = 0;
							if(null != data){
								size = data.size();
								for(int i = 0;i < size;i++){
									Map m = (Map)data.get(i);
									Object key = m.get("key");
									Object value = m.get("value");
									Object allowBlank = m.get("allowBlank");
									Object displayName = m.get("displayName");
									if(i%2 == 0)
										out.println("<tr>");
									else
									    out.println("<tr class=\"tabletr\">");
									out.println("<td align=\"right\" width=\"25%\" class=\"tabletd\">");
									out.println("<label for=\""+key+"\">"+displayName+": </label>");
									out.println("</td>");
									out.println("<td width=\"75%\" class=\"tabletd\">");
									if(Boolean.valueOf((String)allowBlank))
										out.println("<input type=\"text\" name=\"" + key + "\" id=\"" + key + "\" value=\"" + value + "\" />");
									else
										out.println("<input type=\"text\" name=\"" + key + "\" id=\"" + key + "\" value=\"" + value + "\" onblur=\"wktx(\'" + key + "\')\"/> *必填");
									out.println("</td>");
									out.println("</tr>");
								}
							}
							if(size%2 == 0)
								out.println("<tr>");
							else
								out.println("<tr class=\"tabletr\">");	
							out.println("<td width=\"25%\" class=\"tabletd\">");
							out.println("<div align=\"right\" >请单击选择文件: </div>");
							out.println("</td>");
							out.println("<td width=\"75%\" class=\"tabletd\">");
							out.println("<input type=\"file\" name=\"" + fileParName + "\" id=\"" + fileParName + "\" />");
							out.println("</td>");
							
							out.println("<tr>");	
							out.println("<td width=\"25%\" class=\"tabletd\"></td>");
							out.println("<td colspan=\"2\" align=\"right\" class=\"tabletd\">");
							out.println("<input type=\"submit\" onclick=\"return wktjjc()\" value=\"提交\" />");
							out.println("<input type=\"button\" onclick=\"invokeExport()\" value=\"导出执行结果\" />");
							out.println("</td>");
							out.println("</tr>");
							
							out.println("<input type=\"hidden\" name=\"services\" value=\"" + detailObject.get("services") + "\" />");
						}
					%>
				</table>
				<% if (null != responseList) {%>
				<div id="jieguodiv" style="overflow-x:auto;overflow-y:auto;height:80%;width:60%;">
				<table class="intable" style="table-layout:fixed;">
					<tr style="background-color:#ABCDE8">
						<td width="25%"/>
						<td />
					</tr>
					<tr>
						<td colspan="2" class="tableth"><%=tableTitle%>执行结果</td></td>
					</tr>
					<%	
						int size = responseList.size();
						for(int i = 0;i < size;i++){
							Object ro = responseList.get(i);
							if(i%2 == 0)
								out.println("<tr>");
							else
								out.println("<tr class=\"tabletr\">");
							if(ro instanceof Map){
								Map mro = (Map)ro;
								String one = (String)mro.get("one");
								String two = (String)mro.get("two");
								two = two == null?"操作成功!":two;
								out.println("<td width=\"25%\" class=\"tabletd\">" + one + "</td>");
								//out.println("<td width=\"75%\" class=\"tabletd\">");
								out.println("<td style=\"overflow:hidden;white-space:nowrap;text-overflow:ellipsis;\" width=\"75%\" class=\"tabletd\" onclick=\"modeAlert('"+i+"')\">" + two + "</td>");
								out.println("<input id=\"" + i + "\" type=\"hidden\"  value=\"" + two + "\" />");
								//out.println("<div align=\"left\" onclick=\"modeAlert('"+i+"')\" style=\"overflow-x:hidden\">" + two + "</div>");
								//out.println("<input id=\"" + i + "\" type=\"text\" readonly=\"readonly\" onclick=\"modeAlert('"+i+"')\" value=\"" + two + "\" style=\"width:100%\" />");
								out.println("</td>");
							} else {
								out.println("<td colspan=\"2\" align=\"center\">");
								out.println(ro);
								out.println("</td>");
							}
							out.println("</tr>");
						}
					%>
				</table>
				</div>
				<%}%>
			</FORM>
			<%}%>
		</div>
		<div id="xsk" style="width:50%;height:50%; background-color:#FFFFFF; border:1px solid #000000; padding:20px; overflow:hidden; display:none;">   
            <textarea id="nrly" rows="3" style="width:100%;height:100%;" ></textarea><br>
			<a href="javascript:closeAlert()">关闭</a>
        </div>
		<table id="loadingtable" style="display:none;border:1px solid #ABCDE8">
		  <tr align="center"> 
			<td height="100%"> 
			 <img src="images/loading.gif"/>
			</td>
			<td height="100%"> 
			 上传进行中...
			</td>
		  </tr>
		</table>
	</body>
</html>