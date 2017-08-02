package com.bokesoft.services.messager.server.ws;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.Timer;
import java.util.TimerTask;

import org.apache.log4j.Logger;
import org.eclipse.jetty.websocket.api.Session;

import com.alibaba.fastjson.JSON;
import com.bokesoft.services.messager.config.MessagerConfig;
import com.bokesoft.services.messager.server.impl.ConnectedSessionMgr;
import com.bokesoft.services.messager.server.impl.utils.MsgUtils;
import com.bokesoft.services.messager.server.impl.utils.SessionUtils;
import com.bokesoft.services.messager.server.model.ConnectedSessionBaseInfo;
import com.bokesoft.services.messager.server.model.Message;
import com.bokesoft.services.messager.server.model.MyActiveConnectData;
import com.bokesoft.services.messager.server.store.IMessageStore;

public class MessageTimerTask {
	private static final Logger log = Logger.getLogger(MessageTimerTask.class);
	
	public static void start(){
		Timer timer = new Timer();
		timer.schedule(new TimerTask() {
			@Override
			public void run() {
				try {
					doMessageExchange();
				} catch (Throwable e) {
					log.error("Send message error.", e);
				}
			}
		}, 1000 /*1 seconds*/, 1000/*1 second*/);
	}

	/**
	 * 将存储的消息, 以及其他服务器端消息发送到其接收方
	 * @throws IOException 
	 */
	private static void doMessageExchange() throws IOException {
		IMessageStore ms = MessagerConfig.getMessageStoreInstance();
		//获得所有需要通知 MyActiveConnectData 已发生改变的客户端(userCode)
		Set<String> notifyPeers = ConnectedSessionMgr.readConnDataNotifyCache();
		//获得所有没有发送的新消息
		List<Message> msgs = ms.findNewMessage(null);
		MsgUtils.sortAsc(msgs);
		//处理待发送的消息
		for (Message msg: msgs){
			String receiver = msg.getReceiver();
			String sender = msg.getSender();
			//此处 receiver/sender 正好相反, 因为要把消息主动推送给 receiver, 就需要查找 receiver 发起的连接到 sender 的会话
			Map<String, Session> sessions = ConnectedSessionMgr.getConnectedSessions4SendReplyingMessage(receiver, sender);
			if (sessions.size()>0){
				List<String> sessionIds = new ArrayList<String>(sessions.keySet());
				
				//如果 receiver 正好存在需要附加 MyActiveConnectData 的情况, 就附加在当前消息上一起发出
				if (notifyPeers.contains(receiver)){
					attachMyActiveConnectData(sessionIds, msg, receiver);
					notifyPeers.remove(receiver);
				}

				//发送消息
				String msgText = JSON.toJSONString(msg);
				log.info("Send message from '"+sender+"' to '"+receiver+"': "+msgText);
				for (String id: sessionIds){
					Session session = sessions.get(id);
					session.getRemote().sendString(msgText);
				}
				//记录消息的读取时间并保存
				msg.setReadTimestamp(System.currentTimeMillis());
				ms.save(msg);
			}
		}
		//处理没有待发送消息的需要通知 MyActiveConnectData 已发生改变的客户端
		for (String peerId: notifyPeers){
			//查找可以发送消息回客户端的所有符合条件的会话
			Map<String, Session> sessions = ConnectedSessionMgr.getConnectedSessions4SendMessage(peerId);
			if (sessions.size()>0){
				List<String> sessionIds = new ArrayList<String>(sessions.keySet());
				//构造附加 MyActiveConnectData 的 BLANK 消息
				Message blankMsg = new Message(Message.MSG_TYPE_BLANK, peerId, peerId);
				attachMyActiveConnectData(sessionIds, blankMsg, peerId);
				//发送消息
				String msgText = JSON.toJSONString(blankMsg);
				log.info("Send BLANK message(with MyActiveConnectData) to '"+peerId+"': "+msgText);
				for (String id: sessionIds){
					Session session = sessions.get(id);
					session.getRemote().sendString(msgText);
				}
			}
		}
	}
	
	private static void attachMyActiveConnectData(List<String> sessionIds, Message msg, String receivePeerId){
		for (String sessionId: sessionIds){
			ConnectedSessionBaseInfo si = ConnectedSessionMgr.getConnectedSessionInfoById(sessionId);
			if (null!=si){
				MyActiveConnectData activeConnData = SessionUtils.buildAllSesssionsData(si);
				log.info("Attach MyActiveConnectData to ["+msg.getType()+"] message for receiver: '"+receivePeerId+" ...");
				msg.getAttachments().add(activeConnData);
				
				ConnectedSessionMgr.unmark4ConnDataNotify(receivePeerId);
				return;
			}
		}
	}
}
