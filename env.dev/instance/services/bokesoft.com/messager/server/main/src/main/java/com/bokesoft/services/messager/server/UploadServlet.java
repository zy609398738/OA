package com.bokesoft.services.messager.server;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.net.URLDecoder;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.Part;

import org.apache.log4j.Logger;

import com.alibaba.fastjson.JSON;
import com.bokesoft.services.messager.config.MessagerConfig;

import jodd.datetime.JDateTime;
import jodd.io.FileUtil;
import jodd.io.StreamUtil;

public class UploadServlet extends HttpServlet{
	private static final long serialVersionUID = 20160824L;
	
	/** 上传文件的存储目录, 统一放在 {@link MessagerConfig#getDataPath()} 目录下 */
	private static final String UPLOAD_FOLDER = "upload";
	
	/** 用作样板的 UUID, 主要用于方便进行长度判断 */
	private static final String SAMPLE_UUID = UUID.randomUUID().toString();
	
	private static final Logger log = Logger.getLogger(UploadServlet.class);

	@Override
	protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
		String uri = req.getRequestURI();
		String cPath = req.getContextPath();
		String sPath = req.getServletPath();
		String filePath = uri.substring((cPath+sPath).length()+1);
		
		File uploadPath = new File(MessagerConfig.getDataPath(), UPLOAD_FOLDER);
		File file = new File(uploadPath.getCanonicalFile() + "/" + filePath);
		
		String fileName = file.getName();
		String decodedName = URLDecoder.decode(fileName, "UTF-8");
		file = new File(file.getParentFile(), decodedName);
		//去掉文件名前面的 UUID
		if (fileName.indexOf(".")==(SAMPLE_UUID.length())){
			fileName = fileName.substring(SAMPLE_UUID.length()+1);
		}
		resp.setHeader("Content-disposition", "attachment;filename=" + fileName);
		
		InputStream in = null;
		try{
			in = new FileInputStream(file);
			StreamUtil.copy(in, resp.getOutputStream());
		}finally{
			if (null!=in) in.close();
		}
	}

	@Override
	protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
		try {
			_doPost(req, resp);
		} catch (Exception e) {
			log.error(e.getMessage(), e);
			resp.setStatus(500);
			String errorText = e.getMessage();
			if (errorText.startsWith("Multipart Mime part") && errorText.endsWith("exceeds max filesize")){
				errorText = "上传文件大小超过限制(200兆)";
			}
			resp.getWriter().println(errorText);
		}
	}
	private void _doPost(HttpServletRequest req, HttpServletResponse resp) throws IOException, ServletException {
		resp.setCharacterEncoding("UTF-8");
		resp.setContentType("text/plain;charset=UTF-8");

		for (Part part : req.getParts()) {
			final String fileName = getFileName(part);
			if (null==fileName){
				continue;
			}
			String fileStoreName = UUID.randomUUID().toString()+"."+fileName;
			
			//计算存储文件的目录
			File uploadPath = new File(MessagerConfig.getDataPath(), UPLOAD_FOLDER);
			JDateTime now = new JDateTime();
			File storePath = new File(uploadPath, "" + now.getYear());
			storePath = new File(storePath, now.getMonth()>9?""+now.getMonth():"0"+now.getMonth());
			storePath = new File(storePath, now.getDay()>9?""+now.getDay():"0"+now.getDay());
			storePath.mkdirs();
			//计算存储文件名
			File storeFile = new File(storePath, fileStoreName);
			//保存文件
			InputStream in = part.getInputStream();
			FileUtil.writeStream(storeFile, in);
			
			//只保存第一个 part, 然后就返回了
			String relStorePath = storeFile.getCanonicalPath().substring(uploadPath.getCanonicalPath().length()+1);
			relStorePath = relStorePath.replace("\\", "/");
			Map<String, String> result = new HashMap<String, String>();
			result.put("url", relStorePath);
			result.put("fileName", fileName);
			String json = JSON.toJSONString(result);
			resp.getWriter().println(json);
			return;
        }
		
		//如果在 for 循环中没有 return, 说明没有上传文件
		throw new RuntimeException("数据提交错误 - 找不到上传的文件内容");
	}
	private String getFileName(final Part part) {
	    final String partHeader = part.getHeader("content-disposition");
	    log.debug("Part Header = '"+partHeader+"'");
	    for (String content : part.getHeader("content-disposition").split(";")) {
	        if (content.trim().startsWith("filename")) {
	            return content.substring(
	                    content.indexOf('=') + 1).trim().replace("\"", "");
	        }
	    }
	    return null;
	}
}
