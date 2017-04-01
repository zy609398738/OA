package com.bokesoft.services.messager.server.model;

/**
 * 从客户端接收的消息
 */
public class ReceivedMessage {
	/** 消息的类型 */
	private String type;
	/** 消息数据 */
	private Object data;
	
	public String getType() {
		return type;
	}
	public void setType(String type) {
		this.type = type;
	}
	public Object getData() {
		return data;
	}
	public void setData(Object data) {
		this.data = data;
	}

	/**
	 * 适用于 文件/图片 消息的数据格式
	 */
	public static class FileData{
		/**
		 * 消息内容的图标(URL);
		 * @deprecated 这个字段的内容更多是基于 Web IM 来考虑的, 已不建议使用, IM 客户端应该根据 {@link #fileName} 的后缀来确定显示的图标.
		 */
		private String fileIcon;
		/** 消息内容的文件名 */
		private String fileName;
		/** 消息内容的下载地址 */
		private String fileUrl;

		public String getFileUrl() {
			return fileUrl;
		}
		public void setFileUrl(String fileUrl) {
			this.fileUrl = fileUrl;
		}

		public String getFileName() {
			return fileName;
		}
		public void setFileName(String fileName) {
			this.fileName = fileName;
		}
	}
}
