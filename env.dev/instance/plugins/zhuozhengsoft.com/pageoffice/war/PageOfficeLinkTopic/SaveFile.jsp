<%@ page language="java" import="java.util.*,com.zhuozhengsoft.pageoffice.*" pageEncoding="gb2312"%>
<%
FileSaver fs=new FileSaver(request,response);
fs.saveToFile(request.getSession().getServletContext().getRealPath("PageOfficeLinkTopic/doc/")+"/"+fs.getFileName());
fs.close();
%>
