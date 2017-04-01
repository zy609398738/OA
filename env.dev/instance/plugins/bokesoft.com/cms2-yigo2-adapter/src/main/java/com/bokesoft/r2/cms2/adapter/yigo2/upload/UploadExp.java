package com.bokesoft.r2.cms2.adapter.yigo2.upload;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.apache.commons.fileupload.FileItem;

import com.bokesoft.cms2.core.ctx.CmsRequestContext;
import com.bokesoft.yes.common.util.StringUtil;

public class UploadExp {
	
		
	private static CmsRequestContext getContext() {
		CmsRequestContext ctx = CmsRequestContext.getThreadInstance();
		return ctx;
	}
	
	/**
	 * 上传文件的准备工作,主要将formFieLd的参数设置上下文的Attribute中,将List<FileItem>存在上下文的Attribute中
	 * 同时限制上传文件的大小
	 * @param maxSizeStr 上传文件的大小限制  
	 */
	public static void PrepareUpload(String maxSizeStr) throws Throwable{
		Long maxSize = Long.parseLong(maxSizeStr);
		UploadUtil.prepareUpload(getContext(), maxSize);
	}
	
	public static List<FileItem> GetUploadFileItem(){
		return GetUploadFileItem("");
	}
	
	/**
	 * 获取上下文中Attribute缓存的List<FileItem>
	 * @param fieldName 对于是否为相应的 fieldName做匹配
	 * @return
	 */
	public static List<FileItem> GetUploadFileItem(String fieldName){
		@SuppressWarnings("unchecked")
		List<FileItem> fileItems = (List<FileItem>) getContext().getAttribute(UploadUtil.class.getName()+"_FileItems");
		List<FileItem> result = new ArrayList<FileItem>();
		for(FileItem fileItem:fileItems){
			if(!fileItem.isFormField()){
				if(StringUtil.isBlankOrNull(fieldName)){
					result.add(fileItem);
				}else{
					if(fieldName.equals(fileItem.getFieldName())){
						result.add(fileItem);
					}
				}
			}
		}
		return result;
	}
	
	/**
	 * 获取Yigo2配置的根目录
	 * @return
	 */
	public static String GetYigoRootUploadPath(){
		String rootPath = UploadUtil.getYigoDefaultRootPath();
		return rootPath;
	}
	
	/**
	 * 根据日期型,设置日期型相对目录
	 * @param entityId
	 * @param storageArea
	 * @return
	 */
	public static String GetDateStorePath(String entityId, String storageArea ){
		String path = "";
		path += UploadUtil.FILE_SEPARATOR + storageArea;
		path += UploadUtil.FILE_SEPARATOR + new SimpleDateFormat("yyyy/MM/dd").format(new Date());
		path += UploadUtil.FILE_SEPARATOR + entityId;
		return  path;
	}
	
	/**
	 * 根据entityId,设置hash型相对目录
	 * @param entityId
	 * @param storageArea
	 * @return
	 */
	public static String GetHashStorePath(String entityId, String storageArea ){
		String path = "";
		path += UploadUtil.FILE_SEPARATOR + storageArea;
		for(int i = 0; i < entityId.length(); i = i+2){
			if(i==entityId.length()-1){
				String tempStr = entityId.substring(entityId.length()-1, entityId.length());
				path += tempStr + UploadUtil.FILE_SEPARATOR;
			}else{
				String tempStr = entityId.substring(i, i+2);
				path += tempStr + UploadUtil.FILE_SEPARATOR;
			}
		}
		if (path.endsWith(UploadUtil.FILE_SEPARATOR)){
			path = path.substring(0, path.lastIndexOf(UploadUtil.FILE_SEPARATOR));
		}
		return path ;		
	}
	
	/**
	 * 设置原始目录
	 * @param entityId
	 * @param storageArea
	 * @return
	 */
	public static String GetPlainStorePath(String entityId, String storageArea ){
		String path = "";
		path += UploadUtil.FILE_SEPARATOR + storageArea;
		path += UploadUtil.FILE_SEPARATOR + entityId;
		return path;		
	}
	
	/**
	 * 文件上传
	 * 处理每个文件时调用的公式，其中可以使用cms.UploadExp.FileItem()获取一个上传文件对象
	 * @param storageType 存储方式: date、hash、plain
	 *    	-- date 按照 /yyyy/MM/dd/[entityId]/[文件名] 存储文件
	 *  	-- hash 按照 /[entityId 两位两位切分为多级目录]/[文件名] 存储文件
	 *  	-- plain 按照 /[entityId]/[文件名] 存储文件
	 * @throws Throwable 
	 */	
	public static List<UploadResult> SaveUploadFile(List<FileItem> fileItems,
			String rootpath,String relatedPath) throws Throwable {
		List<UploadResult> result = new ArrayList<UploadResult>();
		for(FileItem fileItem:fileItems){
			UploadResult upFile = UploadUtil.defaultStoreFileItem(fileItem,rootpath,relatedPath);
			result.add(upFile);
		}
		return result;
	}
	
}