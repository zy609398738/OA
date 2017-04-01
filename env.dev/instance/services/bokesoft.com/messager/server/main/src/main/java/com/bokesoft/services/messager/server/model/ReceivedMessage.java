package com.bokesoft.services.messager.server.model;

/**
 * 从客户端接收的消息
 */
public class ReceivedMessage {
	/** 消息的类型 */
	private String type;
	/** 消息数据 */
	private Object data;
	/** 消息的发送方名称(快照) */
	private String senderName;
	/** 消息的接收方名称(快照) */
	private String receiverName;
	
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
	
	public String getSenderName() {
		return senderName;
	}
	public void setSenderName(String senderName) {
		this.senderName = senderName;
	}

	public String getReceiverName() {
		return receiverName;
	}
	public void setReceiverName(String receiverName) {
		this.receiverName = receiverName;
	}
}
