package com.bokesoft.services.messager.server.ws;

import java.io.IOException;
import java.util.Map;

import org.apache.log4j.Logger;
import org.eclipse.jetty.websocket.api.Session;
import org.eclipse.jetty.websocket.api.WebSocketListener;

import com.alibaba.fastjson.JSON;
import com.bokesoft.services.messager.config.MessagerConfig;
import com.bokesoft.services.messager.server.impl.BlackListManager;
import com.bokesoft.services.messager.server.impl.ConnectedSessionMgr;
import com.bokesoft.services.messager.server.impl.HostSessionManager;
import com.bokesoft.services.messager.server.impl.MessageRecordManager;
import com.bokesoft.services.messager.server.impl.utils.SessionUtils;
import com.bokesoft.services.messager.server.model.ConnectedSessionBaseInfo;
import com.bokesoft.services.messager.server.model.RecentHistory;
import com.bokesoft.services.messager.server.model.Message;
import com.bokesoft.services.messager.server.model.MyActiveConnectData;
import com.bokesoft.services.messager.server.model.ReceivedMessage;
import com.bokesoft.services.messager.server.model.ReconnectData;
import com.bokesoft.services.messager.server.store.IMessageStore;
import com.bokesoft.services.messager.zz.Misc;

public class MessagerSocket implements WebSocketListener {
	private static final Logger log = Logger.getLogger(MessagerSocket.class);

	/** 通过 WebSocket Attachment 返回的最近历史数据的条数限制 */
	private static final int RECENT_HISTORY_LIMITS = 100;
	/** WebSocket 会话的超时时间为 15 分钟 */
	private static final int SESSION_IDLE_TIMEOUT_MS = 15*60*1000;

	private ConnectedSessionBaseInfo sessionInfo;
	private IMessageStore messageStoreInstance = MessagerConfig.getMessageStoreInstance();
	
	@Override
	public void onWebSocketConnect(Session session) {
		session.setIdleTimeout(SESSION_IDLE_TIMEOUT_MS);
		
		sessionInfo = SessionUtils.buildConnectionInfo(session);
		log.info(sessionInfo+" connected.");
		
		ConnectedSessionMgr.rememberConnectedSession(sessionInfo, session);
		
		if(isValidSession(sessionInfo)){
			//返回与 fromUser 相关的近期会话历史信息
			responseMessage(session, buildHistoryData());
			//计算当前用户连接会影响其他哪些用户的 MyActiveConnectData 状态信息
			SessionUtils.markNotifyClientPeerIds(sessionInfo);
		}else{
			//返回提醒 fromUser 重新建立会话连接的信息
			responseMessage(session, buildReconnectData());
			session.close();
		}
		
	}
	
	private void responseMessage(Session session, Message m){
		try {
			session.getRemote().sendString(Misc.$json(m));
		} catch (IOException e) {
			Misc.$throw(e);
		}
	}

	private Message buildMyActiveConnectData() {
		Message tm = new Message(Message.MSG_TYPE_BLANK, sessionInfo.getReceiver(), sessionInfo.getSender());
		MyActiveConnectData mas = SessionUtils.buildAllSesssionsData(sessionInfo);
		tm.getAttachments().add(mas);
		return tm;
	}
	
	private Message buildReconnectData() {
		Message tm = new Message(Message.MSG_TYPE_BLANK, sessionInfo.getReceiver(), sessionInfo.getSender());
		ReconnectData rcd = new ReconnectData();
		tm.getAttachments().add(rcd);
		return tm;
	}

	private Message buildHistoryData(){
		Message tm = new Message(Message.MSG_TYPE_BLANK, sessionInfo.getReceiver(), sessionInfo.getSender());
		RecentHistory hd = SessionUtils.buildHistoryData(sessionInfo, RECENT_HISTORY_LIMITS);
		tm.getAttachments().add(hd);
		return tm;
	}
	
	
	@Override
	public void onWebSocketError(Throwable cause) {
		onWebSocketClose(-1, cause.getMessage());
	}

	@Override
	public void onWebSocketBinary(byte[] payload, int offset, int len) {
		throw new UnsupportedOperationException("目前不支持二进制数据的传输");
	}

	@Override
	public void onWebSocketText(String message) {
		log.debug(sessionInfo+" send message: "+message);
		Session ses = ConnectedSessionMgr.getConnectedSessionById(sessionInfo.getId());
		
		if(!isValidSession(sessionInfo) && null!=ses && ses.isOpen()){
			//如果用户信息失效, 强制客户端重新连接
			responseMessage(ses, buildReconnectData());
			ses.close();
			return;
		}
		//message 字符串应该符合 TextMessage 类的结构
		ReceivedMessage tm = JSON.parseObject(message, ReceivedMessage.class);
		//按照不同的类型进行处理
		switch (tm.getType()) {
		case Message.MSG_TYPE_TEXT:
		case Message.MSG_TYPE_IMAGE:
		case Message.MSG_TYPE_FILE:
			if (!sessionInfo.isSelfConnection()){
				String sender = this.sessionInfo.getSender();
				String receiver = this.sessionInfo.getReceiver();
				
				Message m = new Message(tm.getType(), sender, receiver);
				if(BlackListManager.shouldBlock(sender, receiver)){
					//检查并设置因黑名单而被 block 的消息标记
					m.setBlocked(true);
				}
				m.setData(tm.getData());
				m.setSenderName(tm.getSenderName());
				m.setReceiverName(tm.getReceiverName());
				MessageRecordManager.saveLastMessage(m);
				messageStoreInstance.save(m);
				//需要提醒 消息接收方 更新 MyActiveConnectData 信息(如果对方也正在和当前sender聊天中, 那么就不需要标记这个提醒了)
				Map<String, Session> sessions = ConnectedSessionMgr.getConnectedSessions4SendReplyingMessage(receiver, sender);
				if(sessions.size()<=0){
					ConnectedSessionMgr.mark4ConnDataNotify(receiver);
				}
			}
			break;
		case Message.MSG_TYPE_BLANK:
			//响应来自客户端的 Ping
			if (null!=ses && ses.isOpen()){
				Message pingback = buildMyActiveConnectData();
				
				try {
					ses.getRemote().sendString(Misc.$json(pingback));
				} catch (IOException e) {
					Misc.$throw(e);
				}
			}
			break;
		default:
			break;
		}
	}

	@Override
	public void onWebSocketClose(int statusCode, String reason) {
		Session ses = ConnectedSessionMgr.getConnectedSessionById(sessionInfo.getId());
		ConnectedSessionMgr.removeClosedSession(sessionInfo);
		if (ses.isOpen()){
			ses.close();
		}
		log.info(sessionInfo+" closed: status="+statusCode+", reason="+reason);

		//计算当前用户连接会影响其他哪些用户的 MyActiveConnectData 状态信息
		SessionUtils.markNotifyClientPeerIds(sessionInfo);
	}

	private static boolean isValidSession(ConnectedSessionBaseInfo sessionInfo){
		String userCode = HostSessionManager.getUserCodeByToken(sessionInfo.getToken());
		if(userCode != null && userCode.equals(sessionInfo.getSender())){			
			return true;
		}else{
			return false;
		}
	}

}
