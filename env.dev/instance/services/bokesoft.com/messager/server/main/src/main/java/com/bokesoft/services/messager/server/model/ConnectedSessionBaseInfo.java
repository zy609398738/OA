package com.bokesoft.services.messager.server.model;

/**
 * 一个已连接的 WebSocket 会话的基本信息
 */
public class ConnectedSessionBaseInfo {
	private String id;
	private String sender;
	private String receiver;
	private String token;

	public String getId() {
		return id;
	}
	public void setId(String id) {
		this.id = id;
	}
	public String getSender() {
		return sender;
	}
	public void setSender(String fromUser) {
		this.sender = fromUser;
	}
	public String getReceiver() {
		return receiver;
	}
	public void setReceiver(String toUser) {
		this.receiver = toUser;
	}
	public String getToken() {
		return token;
	}
	public void setToken(String token) {
		this.token = token;
	}

	/**
	 * 判断当前 WebSocket 连接是否是 "SelfConnection"(自己 到 自己 的连接), 通常这种连接主要用于获取后台的信息。
	 * SelfConnection 通常不会被存储, 也不会用于活动用户等的统计.
	 * @return
	 */
	public boolean isSelfConnection(){
		return this.sender.equals(this.receiver);
	}
	
	@Override
	public String toString() {
		StringBuilder builder = new StringBuilder();
		builder.append("Session ").append(id).append(" [");
		if (sender != null) {
			builder.append("from ");
			builder.append(sender);
			builder.append(", ");
		}
		if (receiver != null) {
			builder.append("to ");
			builder.append(receiver);
		}
		builder.append("]");
		return builder.toString();
	}
}
