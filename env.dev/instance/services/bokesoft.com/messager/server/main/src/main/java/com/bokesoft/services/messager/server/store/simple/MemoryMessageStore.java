package com.bokesoft.services.messager.server.store.simple;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.CopyOnWriteArrayList;

import com.bokesoft.services.messager.server.impl.utils.MsgUtils;
import com.bokesoft.services.messager.server.model.Message;
import com.bokesoft.services.messager.server.store.IMessageStore;

public class MemoryMessageStore implements IMessageStore {
	private static final List<Message> messageStore = new CopyOnWriteArrayList<Message>();

	@Override
	public void save(Message message) {
		messageStore.add(message);
	}

	@Override
	public List<Message> findNewMessage(String receiver) {
		List<Message> messages = new ArrayList<Message>();
		for(Message m: messageStore){
			if ( m.getReadTimestamp()<=0 && ( null==receiver||receiver.equals(m.getReceiver()) ) ){
				messages.add(m);
			}
		}
		return messages;
	}
	
	@Override
	public List<Message> findHistory(String sender, String receiver, Long fromTime, Long toTime, Integer limits, String keywords) {
		List<Message> messages = new ArrayList<Message>();
		
		int size = messageStore.size();
		if (null!=limits && limits < 0){
			for (int i=size-1; i>=0; i--){	//limits 小于 0 的情况下，查找历史时是倒序查找的
				if (processOneMessage(i, messages, sender, receiver, fromTime, toTime, limits, keywords)){
					break;
				}
			}
		}else{
			for (int i=0; i<size; i++){
				if (processOneMessage(i, messages, sender, receiver, fromTime, toTime, limits, keywords)){
					break;
				}
			}
		}
		return messages;
	}

	private boolean processOneMessage(int index, List<Message> messages,
			String sender, String receiver, Long fromTime, Long toTime, Integer limits, String keywords){
		if (null!=limits){
			limits = Math.abs(limits);
		}
		
		Message m = messageStore.get(index);

		if (null!=sender && !sender.equals(m.getSender())){
			return false;
		}
		if (null!=receiver && !receiver.equals(m.getReceiver())){
			return false;
		}
		if (null!=fromTime && fromTime > m.getTimestamp()){
			return false;
		}
		if (null!=toTime && toTime < m.getTimestamp()){
			return false;
		}
		if (null!=limits && messages.size()>=limits){
			return true;	//到达最大记录数就停止继续搜索
		}
		if (MsgUtils.matchKeywords(m, keywords)){
			messages.add(m);
		}
		return false;
	}
}
