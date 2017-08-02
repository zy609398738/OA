package com.bokesoft.services.messager.server.impl;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

import com.bokesoft.services.messager.config.MessagerConfig;
import com.bokesoft.services.messager.server.impl.utils.MsgUtils;
import com.bokesoft.services.messager.server.model.Message;
import com.bokesoft.services.messager.server.model.MyActiveConnectData.SessionStat;
import com.bokesoft.services.messager.server.store.IMessageStore;

public class MessageRecordManager {
	
	public final static int MAX_SESSION_LIST_SIZE = 10;

	/**
	 * 记录每个用户与对方通话的最后一条消息(包括发送的消息和接收的消息), 格式 Map[userCode, Map[otherSide, Message]]
	 */
	private static Map<String, Map<String, Message>> lastMsgCache = new ConcurrentHashMap<String, Map<String, Message>>();

	/**
	 * 记录和别人历史聊天记录
	 */
	private static Map<String, Message> myHistory = new ConcurrentHashMap<String, Message>();
	
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
	
	/**
	 * 补充必要的历史会话信息
	 * @param myself
	 * @param sessions
	 */
	public static void appendHistorySession(String myself, List<SessionStat> sessions){
		if(sessions == null ){
			sessions = new ArrayList<SessionStat>();
		}
		if(sessions.size() >= MAX_SESSION_LIST_SIZE){
			return;
		}
		Set<String> existsOthers = new HashSet<String>();
		for(SessionStat s: sessions){
			existsOthers.add(s.getCode());
		}	
		Map<String, Message> myHis = lastMsgCache.get(myself);
		if(myHis == null){
			initHistory(myself);
			myHis = lastMsgCache.get(myself);
			if(myHis == null){
				return;
			}
		}
		myHistory = myHis;
		List<SessionStat> appends = new ArrayList<SessionStat>();
		List<String> otherCodes = new ArrayList<String>();
		otherCodes = new ArrayList<String>(myHistory.keySet());
		Collections.sort(otherCodes,new Comparator<String>(){
			@Override
			public int compare(String o1, String o2) {
				return new Long(myHistory.get(o2).getTimestamp()).compareTo(new Long(myHistory.get(o1).getTimestamp()));
			}
		});	
		for(int i=0;i<otherCodes.size();i++){
			if(!existsOthers.contains(otherCodes.get(i))){
				SessionStat stat = new SessionStat(otherCodes.get(i), SessionStat.REMIND, 0);
				appends.add(stat);
			}
			if(appends.size() == MAX_SESSION_LIST_SIZE-sessions.size()){
				break;
			}
		}
		sessions.addAll(appends);
	}
	
	private synchronized static void initHistory(String myCode){
		Map<String, Message> myHist = new ConcurrentHashMap<String, Message>();
		long toTime = System.currentTimeMillis();
		long fromTime = (toTime-10*24*60*60*1000);    //默认提供给客户端的历史数据限制在 10 天之内
		IMessageStore store = MessagerConfig.getMessageStoreInstance();				
		List<Message> sentMsgs = store.findHistory(myCode, null, fromTime, toTime, null, null);
		List<Message> recvMsgs = store.findHistory(null, myCode, fromTime, toTime, null, null);
		List<Message> historyMsgs = new ArrayList<Message>();		
		for (Message message : recvMsgs) {
			if(message.getReadTimestamp()>0){
				historyMsgs.add(message);
			}
		}
		historyMsgs.addAll(sentMsgs);
		MsgUtils.sortAsc(historyMsgs);
		for(Message message : historyMsgs){
			if(!message.getReceiver().equals(myCode)){
				myHist.put(message.getReceiver(), message);
			}
		}
		lastMsgCache.put(myCode, myHist);
	}
}
