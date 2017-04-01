<%@page import="com.bokesoft.dee.web.util.JspFileDownload"%>
<%
    
    request.setCharacterEncoding("UTF-8");
    String url=session.getAttribute("key").toString();
    String Theworkingdirectory=session.getAttribute("Theworkingdirectory").toString();
    String[] fileNames=url.split(">");
    JspFileDownload jfd = new JspFileDownload();
	jfd.setResponse(response);
	jfd.setDownType(1);
	jfd.setDisFileName("DownloadFile_" + session.getId() + ".zip");
	jfd.setZipFileNames(fileNames);
	jfd.setZipFilePath(Theworkingdirectory);
        out.print(jfd.process());
	
%>