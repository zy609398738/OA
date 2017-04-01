<%@ page
	import="com.bokesoft.dee.mule.config.ConfigResources,org.mule.config.ConfigResource,org.mule.api.MuleContext,org.mule.context.DefaultMuleContextFactory,org.mule.config.spring.SpringXmlConfigurationBuilder,com.bokesoft.dee.mule.config.MuleContextManage,java.util.Map,java.util.Iterator,java.net.URLEncoder,java.net.URLDecoder,java.util.Collection,org.mule.model.seda.SedaService,java.util.List"%>
<%@ page language="java" contentType="text/html; charset=UTF-8"%>
<jsp:directive.page import="java.io.InputStream" />
<jsp:directive.page import="java.util.Properties" />
<jsp:directive.page import="java.io.FileInputStream" />
<jsp:directive.page import="org.mule.construct.SimpleFlowConstruct" />

<html>
	<head>
		<script type="text/javascript" src="js/jquery-1.2.3.js"></script>
		<script type="text/javascript" src="js/jquery.tablesorter.js"></script>
		<link href="css/style.css" rel="stylesheet" type="text/css" />

		<script language="javascript" type="text/javascript">
$(document).ready(function(){
    $("#serviceTable").tablesorter();
    $(".tablesorter tbody tr:even").addClass("even"); 
    $(".tablesorter tbody tr:odd").addClass("odd"); 
});
</script>

		<%
			String userName = request.getParameter("user");
			String password = request.getParameter("pass");
			Properties prop = new Properties();
			ClassLoader cl = this.getClass().getClassLoader();
			InputStream is = cl.getResourceAsStream("config.properties");
			prop.load(is);
			if (((String) prop.get("username")).equalsIgnoreCase(userName)
					&& ((String) prop.get("password"))
							.equalsIgnoreCase(password)) {
				session.setAttribute("userInfo", prop.get("username"));
			}
			String userInfo = (String) session.getAttribute("userInfo");
			if (userInfo == null)
				response.sendRedirect("login.jsp");
		%>

		<title>DEE - 服务管理</title>
	</head>
	<body>
		<div align="center" style="margin: 0px">
			<h3>
				数据交换服务管理
			</h3>
		</div>
		<table cellspacing="1" border="0" class="tablesorter"
			id="serviceTable">
			<thead id="newthead">
				<TR>
					<TH width="25%" align="center">
						模块名称
					</TH>
					<TH width="55%" align="center">
						服务列表
					</TH>
					<TH width="10%" align="center">
						运行状态
					</TH>
					<TH width="10%" align="center">
						操作
					</TH>
				</TR>
			</thead>
			<tbody>
				<%
					String action = request.getParameter("action");
					String configKey = request.getParameter("key");
					MuleContextManage mcm = MuleContextManage.getInstance();
					if (configKey != null) {
						configKey = URLDecoder.decode(configKey, "UTF-8");
					}
					if ("start".equalsIgnoreCase(action)) {
						mcm.start(configKey);
					} else if ("stop".equalsIgnoreCase(action)) {
						mcm.stop(configKey);
					} else if ("reload".equalsIgnoreCase(action)) {
						//mcm.reloadMuleContext(configKey);
					} else if ("reloadAll".equalsIgnoreCase(action)) {
						mcm.reloadAllMuleContext();
					} else if ("loadNew".equalsIgnoreCase(action)) {
						mcm.loadNewMuleContext();
					}
					if (action != null || configKey != null) {
						if (session != null && session.getAttribute("userInfo") != null)
							response.sendRedirect(request.getContextPath()
									+ "/manageService.jsp");
						else
							response.sendRedirect("login.jsp");
					}
					Map ctm = mcm.getFolderContextMap();
					Iterator it = ctm.keySet().iterator();
					while (it.hasNext()) {
						String key = (String) it.next();
						MuleContext mc = (MuleContext) ctm.get(key);
						String encodeKey = URLEncoder.encode(URLEncoder.encode(key,
								"UTF-8"), "UTF-8");
						Collection services = mcm.lookUpServices(key);
						String serviceName = "";
						if (services != null && !services.isEmpty()) {
							for (int i = 0; i < services.size(); i++) {
								if (((List) services).get(i) instanceof SedaService) {
									SedaService sedaService = (SedaService) ((List) services)
											.get(i);
									serviceName += " <br/> " + sedaService.getName();
								} else if (((List) services).get(i) instanceof SimpleFlowConstruct) {
									SimpleFlowConstruct sfc = (SimpleFlowConstruct) ((List) services)
											.get(i);
									serviceName += " <br/> " + sfc.getName();
								}

							}
						}
						if (mc.isStarted()) {
				%>
				<tr>
					<td><%=key%></td>
					<td><%=serviceName%></td>
					<td align="center">
						已启动
					</td>
					<td align="center">
						<a href="manageService.jsp?action=stop&key=<%=encodeKey%>">Stop</a>
					</td>
				</tr>
				<%
					} else {
				%>
				<tr>
					<td><%=key%></td>
					<td><%=serviceName%></td>
					<td align="center" style="color: #AAAAAA">
						<i>未启动</i>
					</td>
					<td align="center">
						<a href="manageService.jsp?action=start&key=<%=encodeKey%>">Start</a>
					</td>
				</tr>
				<%
					}
					}
				%>
			</tbody>
		</table>
		<hr size="1" />
		<table width="100%">
			<tr>
				<td align="right">
					<a href="manageService.jsp?action=reloadAll">ReloadAll</a> |
					<a href="manageService.jsp?action=loadNew">Refresh</a>
				</td>
			</tr>
		</table>
		<p />
	</body>
</html>
