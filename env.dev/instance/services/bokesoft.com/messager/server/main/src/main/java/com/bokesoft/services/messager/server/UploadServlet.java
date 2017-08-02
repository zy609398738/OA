package com.bokesoft.services.messager.server;

import java.awt.image.BufferedImage;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.net.URLDecoder;
import java.net.URLEncoder;
import java.nio.file.Files;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import javax.imageio.ImageIO;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.Part;

import net.coobird.thumbnailator.Thumbnails;

import org.apache.commons.lang3.StringUtils;
import org.apache.log4j.Logger;
import org.bizobj.jetty.utils.Misc;

import com.alibaba.fastjson.JSON;
import com.bokesoft.services.messager.config.MessagerConfig;
import com.bokesoft.services.messager.server.impl.utils.ServletUtils;

import jodd.datetime.JDateTime;
import jodd.io.FileUtil;
import jodd.io.StreamUtil;

public class UploadServlet extends HttpServlet{
	private static final long serialVersionUID = 20160824L;
	
	/** 上传文件的存储目录, 统一放在 {@link MessagerConfig#getDataPath()} 目录下 */
	private static final String UPLOAD_FOLDER = "upload";
	
	private static final int MAXICON = 200;
	private static final int MAXPREVIEW = 1024;
	
	/** 用作样板的 UUID, 主要用于方便进行长度判断 */
	private static final String SAMPLE_UUID = UUID.randomUUID().toString();
	
	private static final Logger log = Logger.getLogger(UploadServlet.class);

	@Override
	protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {		
		ServletUtils.checkAccessToken(req);		
		String uri = req.getRequestURI();
		String cPath = req.getContextPath();
		String sPath = req.getServletPath();
		String filePath = uri.substring((cPath+sPath).length()+1);
		File uploadPath = new File(MessagerConfig.getDataPath(), UPLOAD_FOLDER);
		File file = new File(uploadPath.getCanonicalFile() + "/" + filePath);
		String fileName = file.getName();
		//因为除了文件名之外相对路径都不会有中文，所以这里只要 decode 文件名就可以了
		String decodedName = URLDecoder.decode(fileName, "UTF-8");
		file = new File(file.getParentFile(), decodedName);
		//去掉文件名前面的 UUID
		if (fileName.indexOf(".")==(SAMPLE_UUID.length())){
			fileName = fileName.substring(SAMPLE_UUID.length()+1);
		}

		try {
	        String mimeType = Files.probeContentType(file.toPath());
	        resp.setContentType(mimeType);
            //inline - 在浏览器中显示内容(图片、PDF、文档等)，其他内容文件将直接被下载
	        resp.setHeader("Content-Disposition", "inline; filename=" + fileName);
	    } catch (IOException ioException) {
	    	//attachment - 浏览器将直接下载文件
			resp.setHeader("Content-disposition", "attachment;filename=" + fileName);
	    }

		String resize = req.getParameter("resize");	
		InputStream in = null;
		try{
			in = new FileInputStream(file);
			if(resize==null||resize.isEmpty()){
				StreamUtil.copy(in, resp.getOutputStream());
				return;
			}
			float size = 1f;
			int max = 0;
			BufferedImage originalImage = ImageIO.read(file);
			int width = originalImage.getWidth();
			int height = originalImage.getHeight();
			if(resize.equals("icon")){
				max = MAXICON;
			}else if(resize.equals("preview")){
				max = MAXPREVIEW;
			}else{
				throw new RuntimeException("无效的 resize 参数值：'"+resize+"'");
			}
			if(max>height && max>width){
				StreamUtil.copy(in, resp.getOutputStream());
				return;
			}
			if(height>width){
				size = (float)max/height;
			}else{
				size = (float)max/width;
			}
			BufferedImage thumbnail = Thumbnails.of(originalImage)
			        .scale(size)
			        .asBufferedImage();
			ImageIO.write(thumbnail, "png",  resp.getOutputStream());
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
		
		ServletUtils.checkAccessToken(req);

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
			relStorePath = relStorePath.replace("\\", "/");	//在 Windows 下路径分隔符是 "\", 需要替换
			relStorePath = encodeFileUrl(relStorePath);	//URL 需要 encode 之后再返回
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
	/**
	 * 对相对路径形式的文件 URL 执行 encode, 但是保留 "/" 以便作为比较自然的 URL
	 * @param relatedUrl
	 * @return
	 */
	private String encodeFileUrl(String relatedUrl){
		String[] parts = relatedUrl.split("\\/");
		List<String> result = new ArrayList<String>();
		
		try {
			for (int i=0; i<parts.length; i++){
				String part = parts[i];
				part = URLEncoder.encode(part, "UTF-8");
				result.add(part);
			}
			return StringUtils.join(result, "/");
		} catch (Exception e) {
			Misc.throwRuntime(e);
			return null;	//Unreachable code
		}
	}
}
