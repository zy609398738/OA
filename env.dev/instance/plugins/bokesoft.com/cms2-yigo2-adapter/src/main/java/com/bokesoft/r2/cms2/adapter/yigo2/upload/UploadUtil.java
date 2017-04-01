package com.bokesoft.r2.cms2.adapter.yigo2.upload;

import java.io.File;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import javax.servlet.http.HttpServletRequest;

import org.apache.commons.fileupload.FileItem;
import org.apache.commons.fileupload.disk.DiskFileItemFactory;
import org.apache.commons.fileupload.servlet.ServletFileUpload;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.bokesoft.cms2.basetools.util.Misc;
import com.bokesoft.cms2.core.ctx.CmsRequestContext;
import com.bokesoft.yes.mid.base.CoreSetting;

public class UploadUtil {
	public static final String FILE_SEPARATOR = "/";
	//private final String FILEITEM_IN_REQCTX = UploadController.class.getName() + "_FILEITEM_IN_REQCTX";
	private static Logger log = LoggerFactory.getLogger(UploadUtil.class);
	
	/**
	 * 文件上传后，将上传的文件集合List<FileItem>存放在CmsRequestContext的attribute中
	 * @param ctx 上下文对象
	 * @throws Throwable 
	 */
	public static void prepareUpload(CmsRequestContext ctx, Long maxSize) throws Throwable{
		HttpServletRequest request = ctx.getRequest();
		ServletFileUpload fu = createDiskUpload(maxSize);
		try {
			List<FileItem> files = fu.parseRequest(request);			
			ctx.setAttribute(UploadUtil.class.getName()+"_FileItems", files);
			for (FileItem fi : files) {
				if (fi.isFormField()) {
					log.info(">>>Get Fast-Upload Date Param:"+fi.getFieldName()+",Vlaue:"+fi.getString("UTF-8"));
					ctx.setAttribute(fi.getFieldName(),fi.getString("UTF-8"));
				}
			}
		} catch (Exception e) {
			Misc.throwRuntime(e);
		}
	}
	
	/**
	 * 创建一个 ServletFileUpload对象,并且设置文件大小限制
	 * @param maxSize 文件最大限制
	 */
	private static ServletFileUpload createDiskUpload(Long maxSize) {
		DiskFileItemFactory factory = new DiskFileItemFactory();
		ServletFileUpload fu = new ServletFileUpload(factory);
		// 设置中文编码
		fu.setHeaderEncoding("UTF-8");
		// 例如设置最大文件尺寸大小 4M 4194304
		fu.setSizeMax(maxSize);
		return fu;
	}
	
	/**
	 * 生成默认的rootPath的方法  
	 * @param rootPath 根路径
	 * @param ctx 上下文对象
	 * @return
	 */
	public static String getYigoDefaultRootPath() {
		String yigoCfgPath = CoreSetting.getInstance().getSolutionPath();
		String rootPath = yigoCfgPath + "/Data/";
		return rootPath;
	}
		
	/**
	 * 默认机制处理上传文件
	 * @param fileItem 上传的文件
	 * @param rootPath 根路径
	 * @param relationPath 相对路径
	 * @throws Throwable
	 */
	public static UploadResult defaultStoreFileItem(FileItem fileItem,
			String rootPath,String relationPath) throws Throwable{			
		String uploadFilePath = rootPath + FILE_SEPARATOR  +  relationPath;		
		File filepath=new File(uploadFilePath);
		if(!filepath.exists()){//判断上传路径是否存在，不存在就创建
			filepath.mkdirs();
		}	
		try {
			String fileName = fileItem.getName();
				if (fileName != null) {
				// 在这里可以记录用户和文件信息
				String fullPath = uploadFilePath + FILE_SEPARATOR	+ fileName;
				log.info(">>>Get Fast-Upload Store Path:"+fullPath);
				fileItem.write(new File(fullPath));
				fileItem.getOutputStream().flush();
				UploadResult cmsupFile = new UploadResult(fileName,relationPath);
				cmsupFile.setFileSize(fileItem.getSize());
				String viewUrl = "";
				if(_isImage(fileName)){
					viewUrl = "/a/cms2-yigo2-adapter/cms/view-yigo-file/"+relationPath + FILE_SEPARATOR	+ fileName;
				}
				String downloadUrl = "/a/cms2-yigo2-adapter/cms/download-yigo-file/"+relationPath + FILE_SEPARATOR	+ fileName;
				cmsupFile.setViewUrl(viewUrl);
				cmsupFile.setDownloadUrl(downloadUrl);
				fileItem.delete();// 删除临时文件
				return cmsupFile;
			}
		} catch (Exception e) {
			Misc.throwRuntime(e);
		}
		return null;
	}
	
	/**
	 * 根据文件名判断是否为图片型文件
	 * @param fileName 文件名 
	 *
	 */
	private static boolean _isImage(String fileName){
		String imgFilter = "\\.(bmp|gif|jpeg|jpg|png|svg|tiff|tif|icon|ico)$";
		Pattern pattern = Pattern.compile(imgFilter);
		Matcher matcher = pattern.matcher(fileName);
		if (matcher.find()){
			return true;
		}else{
			return false;
		}
	}
}
