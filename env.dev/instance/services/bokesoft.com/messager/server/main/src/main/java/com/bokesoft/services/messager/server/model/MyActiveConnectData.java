package com.bokesoft.services.messager.server.model;

import java.util.ArrayList;
import java.util.List;

import com.bokesoft.services.messager.server.model.base.AttachmentBase;

/**
 * 在客户端每次连接时系统返回的当前连接的所有会话信息。
 * —— 当前一共有多少活跃对话(包含未读消息的对话、以及正在进行的对话), 和每个对话的未读消息数量;
 * 返回数据格式: {
 *     total: 999, 				//总的未读消息数量
 *     currentReceiver: "XXXX",	//当前连接的消息接收方
 *     sessions: [{
 *         code: "XXXX",             //用户 code
 *         type: "...",              //提醒类型 - CONNECTED: 在线的对话、REMIND: 其他包含未读消息的对话
 *         count: 999,               //未读消息数量
 *         state: "...",             //用户在线状态
 *         lastMsg: "...",           //用户给当前消息接收方最后发送的消息({@link Message})
 *         lastTime: "..."           //用户与当前消息接收方最后一次聊天的时间
 *     }, ...]
 * }
 */
public class MyActiveConnectData extends AttachmentBase {
	private int total;
	private String currentReceiver;
	private List<SessionStat> sessions = new ArrayList<SessionStat>();
	
	public int getTotal() {
		return total;
	}
	public void setTotal(int total) {
		this.total = total;
	}
	public String getCurrentReceiver() {
		return currentReceiver;
	}
	public void setCurrentReceiver(String currentReceiver) {
		this.currentReceiver = currentReceiver;
	}
	public List<SessionStat> getSessions() {
		return sessions;
	}

	public static class SessionStat {
		public static final String CONNECTED = "CONNECTED";
		public static final String REMIND = "REMIND";

		private String code;
		private String type;
		private int count;
		private String state;
		private Message lastMsg;
		private long lastTime;

		public SessionStat(){
			//Empty constructor just for JSON parsing
		}
		public SessionStat(String code, String type, int count){
			this.code = code;
			this.type = type;
			this.count = count;
		}
		
		public String getCode() {
			return code;
		}
		public String getType() {
			return type;
		}
		public int getCount() {
			return count;
		}

		/** Setter just for JSON parsing */
		public void setCode(String code) {
			this.code = code;
		}
		/** Setter just for JSON parsing */
		public void setCount(int count) {
			this.count = count;
		}
		/** Setter just for JSON parsing */
		public void setType(String type) {
			this.type = type;
		}

		public String getState() {
			return state;
		}
		public void setState(String state) {
			this.state = state;
		}
		public Message getLastMsg() {
			return lastMsg;
		}
		public void setLastMsg(Message lastMsg) {
			this.lastMsg = lastMsg;
		}
		public long getLastTime() {
			return lastTime;
		}
		public void setLastTime(long lastTime) {
			this.lastTime = lastTime;
		}

		public void addCount(int addedCount){
			this.count = this.count + addedCount;
		}
	}
}
