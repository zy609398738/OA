package com.bokesoft.services.messager.server.model.base;

/**
 * 基本的消息附加数据结构
 */
public abstract class AttachmentBase {
	private final String dataType = this.getClass().getSimpleName();

	public final String getDataType() {
		return dataType;
	}
}
