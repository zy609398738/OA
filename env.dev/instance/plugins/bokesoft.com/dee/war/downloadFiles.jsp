<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%@ page import="com.bokesoft.dee.web.data.access.FileDeployDataAccess"%>
<%@ page import="com.bokesoft.dee.web.util.JspFileDownload"%>
<%@ page import="com.bokesoft.dee.web.deploy.constant.DeployConstant"%>
<%
	request.setCharacterEncoding("UTF-8");
	FileDeployDataAccess dataAccess=new FileDeployDataAccess();
	String fileType=request.getParameter("FileType");//获得文件类型
	String filePath=request.getParameter("FilePath");//获得相对路径
	if(fileType==null||fileType.length()<=0){
		return ;
	}
	else{
		//获得DownloadSource.json
		List<Map<String, Object>> list=dataAccess.findPublicDeployList(DeployConstant.PublicDeploy_DOWNLOADSOURCE);
		for(int i=0;i<list.size();i++){
			Map m=list.get(i);
			String type=m.get("FileType").toString();//资源类型
			if(!fileType.equals(type)){
				continue ;
			}
			
			String Verification=m.get("Verification").toString();//资源验证
			String Masterfiledirectory=m.get("Masterfiledirectory").toString();//主目录
			String Theworkingdirectory=m.get("Theworkingdirectory").toString();//临时目录
			String allFilePath=Masterfiledirectory+"/"+filePath;//获得文件绝对路径

			if(Verification.equalsIgnoreCase("yes")){//需要验证
				session.setAttribute("Masterfiledirectory",Masterfiledirectory);
				session.setAttribute("Theworkingdirectory",Theworkingdirectory);
				response.sendRedirect("loginDownload.jsp");
				break ;
			}
			else{
				if(filePath==null||filePath.length()<=0){
					session.setAttribute("Masterfiledirectory",Masterfiledirectory);
					session.setAttribute("Theworkingdirectory",Theworkingdirectory);
					response.sendRedirect("downloadShow.jsp");
					break ;
				}
				else{
					java.io.File file=new java.io.File(allFilePath);
					if(!file.exists()){
						return ;
					}
					else{
						if(file.isFile()){
							String filename=file.getName();
							JspFileDownload jfd = new JspFileDownload();
							jfd.setResponse(response);
							jfd.setDownType(0);
							jfd.setDisFileName(filename);
							jfd.setDownFileName(allFilePath);
							out.print(jfd.process());
							break ;
						}
						else{
						    String[] fileNames=new String[1];
						    fileNames[0]=filePath;
						    JspFileDownload jfd = new JspFileDownload();
							jfd.setResponse(response);
							jfd.setDownType(1);
							jfd.setDisFileName("DownloadFile.zip");
							jfd.setZipFileNames(fileNames);
							jfd.setZipFilePath(Theworkingdirectory);
						    out.print(jfd.process());
							break ;
						}
					}
				}
				
			}
		}
	}
%>