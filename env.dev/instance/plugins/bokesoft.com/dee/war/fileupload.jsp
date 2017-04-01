<html>
<%@ page contentType="text/html; charset=utf-8" %>
<%@ page import="com.bokesoft.dee.web.util.HttpUtils"%>
<%@ page import="java.util.*"%>
<%@ page import="java.lang.*"%>
<%
	String err = null;
	Object uploadFileUrl = null;
	Object webTitle = null;
	Object tableTitle = null;
	Object fileParameterName = null;

	Map pm = HttpUtils.parseResquet(request);
	uploadFileUrl = pm.get("uploadFileUrl");
	if(null == uploadFileUrl)
			err = "uploadFileUrl parameter is necessary!";
	webTitle = pm.get("webTitle");
	if(null == webTitle)
			webTitle = "导入文件";
	tableTitle = pm.get("tableTitle");
	if(null == tableTitle)
			tableTitle = "导入文件";
	fileParameterName = pm.get("fileParameterName");
	if(null == fileParameterName)
			fileParameterName = "requestBody";

	
%>
	<head>
		<meta http-equiv="content-type" content="text/html; charset=UTF-8" />
		<title><%=webTitle%></title>
	</head>

	<body style="font-size: 10px">
		<FORM action="<%=uploadFileUrl%>" method="post" enctype="multipart/form-data" name="form1">
			<div align="center">
			<%if (null==err){%>
				<table width="648" border="1" cellspacing="0" borderColor="#6633FF">
					<tr bgcolor="#FFFFFF">
						<td colspan="2" bgcolor="#006699">
							<div align="center" class="STYLE3"><%=tableTitle%></div>
							<%
							Set set = new HashSet(){{add("uploadFileUrl");add("webTitle");add("tableTitle");add("fileParameterName");}};
							Iterator<Map.Entry> it = pm.entrySet().iterator();
							while (it.hasNext()) {
								Map.Entry me = it.next();
								String key = String.valueOf(me.getKey());
								String value = String.valueOf(me.getValue());
								if(!set.contains(key))
									out.println("<input type=\"hidden\" name=\"" + key + "\" value=\"" + value + "\" />");
							}
							%>
						</td>
					</tr>
					<tr>
						<td width="195" valign="top">
							<div align="right" style="font-size: 11pt">请单击选择文件：</div>
						</td>
						<td width="443" valign="top">
							<input type="file" name="<%=fileParameterName%>" style="width:100%" />
						</td>
					</tr>
					<tr>
						<td valign="top">&nbsp;
						</td>
						<td valign="top" align="right">
							<input type="submit" value="上传" />
						</td>
					</tr>
				</table>
			<%} else {%>
				<table width="648" border="0" cellspacing="0">
					<tr>
						<td border="0" colspan="2" height="80" align="center" class="err">
							<%
							  out.print("<b>"+err+"</b>");
							%>
						</td>
					</tr>
				</table>
			<%}%>
			</div>
		</FORM>
	</body>
</html>