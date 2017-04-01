<%@ page import="com.bokesoft.dee.mule.config.ConfigResources,
				 org.mule.config.ConfigResource,
				 org.mule.api.MuleContext,
				 org.mule.context.DefaultMuleContextFactory,
				 org.mule.config.spring.SpringXmlConfigurationBuilder,
				 com.bokesoft.dee.mule.config.MuleContextManage,
				 java.util.Map,
				 java.util.Iterator,
				 java.net.URLEncoder,
				 java.net.URLDecoder,
				 java.util.Collection,
				 org.mule.model.seda.SedaService,
				 java.util.List"%>
<%@ page language="java" contentType="text/html; charset=UTF-8" %>
<jsp:directive.page import="java.io.InputStream"/>
<jsp:directive.page import="java.util.Properties"/>
<jsp:directive.page import="java.io.FileInputStream"/>
<jsp:directive.page import="org.mule.construct.SimpleFlowConstruct"/>


<%
	String userName = request.getParameter("user");
	String password = request.getParameter("pass");
	Properties prop = new Properties();
	ClassLoader cl = this.getClass().getClassLoader();
	InputStream is = cl.getResourceAsStream("config.properties");
	prop.load(is);
	if (((String)prop.get("username")).equalsIgnoreCase(userName) && 
		((String)prop.get("password")).equalsIgnoreCase(password)) {
		response.sendRedirect("downloadShow.jsp");	
	}
	else{
		response.sendRedirect("loginDownload.jsp");
	}
 %>
