package com.bokesoft.services.messager.server.ws;

import java.util.List;
import java.util.Timer;
import java.util.TimerTask;

import org.apache.log4j.Logger;
import org.eclipse.jetty.websocket.api.Session;

import com.alibaba.fastjson.JSON;
import com.bokesoft.services.messager.config.MessagerConfig;
import com.bokesoft.services.messager.server.impl.ConnectedSessionMgr;
import com.bokesoft.services.messager.server.impl.utils.MsgUtils;
import com.bokesoft.services.messager.server.model.Message;
import com.bokesoft.services.messager.server.store.IMessageStore;

public class MessageTimerTask {
	private static final Logger log = Logger.getLogger(MessageTimerTask.class);
	
	public static void start(){
		Timer timer = new Timer();
		timer.schedule(new TimerTask() {
			@Override
			public void run() {
				IMessageStore ms = MessagerConfig.getMessageStoreInstance();
				List<Message> msgs = ms.findNewMessage(null);
				MsgUtils.sortDesc(msgs);
				for (Message msg: msgs){
					String receiver = msg.getReceiver();
					String sender = msg.getSender();
					try {
						//此处 receiver/sender 正好相反, 因为要把消息主动推送给 receiver, 就需要查找 receiver 发起的连接到 sender 的会话
						List<Session> sessions = ConnectedSessionMgr.getConnectedSessions4Reply(receiver, sender);
						if (sessions.size()>0){
							String text = JSON.toJSONString(msg);
							log.info("Send message from '"+sender+"' to '"+receiver+"': "+text);
							for(Session session: sessions){
								session.getRemote().sendString(text);
							}
							msg.setReadTimestamp(System.currentTimeMillis());
							ms.save(msg);
						}
					} catch (Throwable e) {
						log.error("Send message from '"+sender+"' to '"+receiver+"' error.", e);
					}
				}
			}
		}, 1000 /*1 seconds*/, 1000/*1 second*/);
	}
}
