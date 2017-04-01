package com.bokesoft.services.messager.server.model;

import java.util.ArrayList;
import java.util.List;

import com.bokesoft.services.messager.server.model.base.AttachmentBase;

/**
 * 用于存储的消息内容定义
 */
public class Message {
	/** 普通的文本消息(HTML) */
	public static final String MSG_TYPE_TEXT = "TEXT";
	/** 传送图片 */
	public static final String MSG_TYPE_IMAGE = "IMAGE";
	/** 传送文件 */
	public static final String MSG_TYPE_FILE = "FILE";
	/** 空消息, 一般用于 PING 等 KeepAlive 的场合 */
	public static final String MSG_TYPE_BLANK = "BLANK";

	/** 消息的类型 */
	private String type;
	/** 消息的产生时间 */
	private long timestamp;
	/** 消息的发送方 */
	private String sender;
	/** 消息的接收方 */
	private String receiver;
	
	/** 消息的发送方名称(快照) */
	private String senderName;
	/** 消息的接收方名称(快照) */
	private String receiverName;
	
	/** 消息数据 */
	private Object data;

	/** 附加信息 */
	private List<AttachmentBase> attachments = new ArrayList<AttachmentBase>();
	
	/** 读取时间, 小于等于 0 代表未读 */
	private long readTimestamp = -1L;
	
	/** 是否为黑名单消息 */
	private boolean blocked = false;
	
	/** 消息存储的 ID, 主要是供存储层对已存在消息进行修改, 默认为空, 一般情况下由存储层负责处理 */
	private String storeId;

	protected Message(){
		//Empty constructor just for JSON parsing
	}

	/**
	 * 初始化消息对象
	 * @param type
	 * @param sender
	 * @param receiver
	 */
	public Message(String type, String sender, String receiver){
		this(type, sender, receiver, System.currentTimeMillis());
	}

	/**
	 * 初始化消息对象(指定对象的产生时间, 一般用于从存储数据读取的情况)
	 * @param type
	 * @param sender
	 * @param receiver
	 * @param timestamp
	 */
	public Message(String type, String sender, String receiver, long timestamp){
		this.type = type;
		this.timestamp = timestamp;
		this.sender = sender;
		this.receiver = receiver;
	}
	
	public String getType() {
		return type;
	}

	public long getTimestamp() {
		return timestamp;
	}

	public String getSender() {
		return sender;
	}

	public String getReceiver() {
		return receiver;
	}

	public Object getData() {
		return data;
	}
	public void setData(Object data) {
		this.data = data;
	}

	public List<AttachmentBase> getAttachments() {
		return attachments;
	}

	public long getReadTimestamp() {
		return readTimestamp;
	}
	public void setReadTimestamp(long readTimestamp) {
		this.readTimestamp = readTimestamp;
	}

	public boolean isBlocked() {
		return blocked;
	}

	public void setBlocked(boolean blocked) {
		this.blocked = blocked;
	}

	public String getStoreId() {
		return storeId;
	}
	public void setStoreId(String storeId) {
		this.storeId = storeId;
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
