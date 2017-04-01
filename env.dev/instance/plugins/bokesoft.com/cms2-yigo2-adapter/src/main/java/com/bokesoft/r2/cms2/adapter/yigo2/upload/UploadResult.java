package com.bokesoft.r2.cms2.adapter.yigo2.upload;

import java.io.Serializable;

public class UploadResult implements Serializable{
	private static final long serialVersionUID = 201612201151L;
	private String fileName;
	private long fileSize;
	private String filePath;
	private String viewUrl;
	private String downloadUrl;	
	
	public String getFileName() {
		return fileName;
	}

	public void setFileName(String fileName) {
		this.fileName = fileName;
	}

	public long getFileSize() {
		return fileSize;
	}

	public void setFileSize(long fileSize) {
		this.fileSize = fileSize;
	}

	public String getFilePath() {
		return filePath;
	}

	public void setFilePath(String filePath) {
		this.filePath = filePath;
	}

	public String getViewUrl() {
		return viewUrl;
	}

	public void setViewUrl(String viewUrl) {
		this.viewUrl = viewUrl;
	}
	
	public String getDownloadUrl() {
		return downloadUrl;
	}

	public void setDownloadUrl(String downloadUrl) {
		this.downloadUrl = downloadUrl;
	}

	public UploadResult(){
		//init
	}
	
	public UploadResult(String fileName,String filePath){
		this.fileName = fileName;
		this.filePath = filePath;
	}
}
