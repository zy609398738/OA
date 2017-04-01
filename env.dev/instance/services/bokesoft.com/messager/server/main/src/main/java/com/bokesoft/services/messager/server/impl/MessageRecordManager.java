package com.bokesoft.services.messager.server.impl;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import com.bokesoft.services.messager.server.model.Message;

public class MessageRecordManager {

	/**
	 * 记录每个用户与对方通话的最后一条消息(包括发送的消息和接收的消息), 格式 Map[userCode, Map[otherSide, Message]]
	 */
	private static Map<String, Map<String, Message>> lastMsgCache = new ConcurrentHashMap<String, Map<String, Message>>();
	
	/**
	 * 记录最后收发的消息
	 * @param msg
	 */
	public static void saveLastMessage(Message msg) {
		if(msg.isBlocked()) return;   //被屏蔽的黑名单消息不保存最后记录
		
		String sender = msg.getSender();
		String receiver = msg.getReceiver();
		
		Map<String, Message> senderMap = lastMsgCache.get(receiver);
		if(null == senderMap){
			senderMap = new ConcurrentHashMap<String, Message>();
			lastMsgCache.put(receiver, senderMap);
		}
		senderMap.put(sender, msg);
		
		Map<String, Message> receiverMap = lastMsgCache.get(sender);
		if(null == receiverMap){
			receiverMap = new ConcurrentHashMap<String, Message>();
			lastMsgCache.put(sender, receiverMap);
		}
		receiverMap.put(receiver, msg);
	}
	
	/**
	 * 获得 sender 发送给 receiver 的最后一条消息
	 * @param sender
	 * @param receiver
	 * @return
	 */
	public static Message getLastMessage(String sender, String receiver) {
		Map<String, Message> receiverMap = lastMsgCache.get(sender);
		if(null != receiverMap){
			return receiverMap.get(receiver);
		}
		return null;
	}
}
