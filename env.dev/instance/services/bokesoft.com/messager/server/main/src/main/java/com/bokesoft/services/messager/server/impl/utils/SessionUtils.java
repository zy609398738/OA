package com.bokesoft.services.messager.server.impl.utils;

import java.net.URI;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.eclipse.jetty.websocket.api.Session;

import com.bokesoft.services.messager.config.MessagerConfig;
import com.bokesoft.services.messager.server.impl.ConnectedSessionMgr;
import com.bokesoft.services.messager.server.impl.MessageRecordManager;
import com.bokesoft.services.messager.server.impl.UserStateManager;
import com.bokesoft.services.messager.server.model.ConnectedSessionBaseInfo;
import com.bokesoft.services.messager.server.model.Message;
import com.bokesoft.services.messager.server.model.MyActiveConnectData;
import com.bokesoft.services.messager.server.model.MyActiveConnectData.SessionStat;
import com.bokesoft.services.messager.server.model.RecentHistory;
import com.bokesoft.services.messager.server.store.IMessageStore;

/**
 * 和 会话 相关的工具方法
 */
public class SessionUtils {
	/**
	 * 通过 session 获得用户的 code
	 * @param session
	 * @return
	 */
	public static ConnectedSessionBaseInfo buildConnectionInfo(Session session){
		//类似 ws://localhost:7778/boke-messager/messager/token/user1/to/user2 这样的 URI
		URI uri = session.getUpgradeRequest().getRequestURI();
		String path = uri.getPath();
		String prefix = "/"+MessagerConfig.getContextPath()+"/messager/";
		ConnectedSessionBaseInfo su = null;
		if (path.startsWith(prefix)){
			String tmp = path.substring(prefix.length());
			String[] users = tmp.split("\\/to\\/");
			String[] strs = users[0].split("\\/");
			if (users.length==2 && strs.length==2){
				su = new ConnectedSessionBaseInfo();
				su.setId(UUID.randomUUID().toString());
				su.setToken(strs[0]);
				su.setSender(strs[1]);
				su.setReceiver(users[1]);
			}
		}
		
		if (null==su){
			throw new RuntimeException("WebSocket 请求路径 '"+path+"' 无效");
		}
		
		return su;
	}
	
	/**
	 * 针对信息的发送方, 计算其当前活动的会话(包括当前连接的会话和含有未读消息的会话)及未读消息信息
	 * @param connInfo
	 * @return
	 */
	public static MyActiveConnectData buildAllSesssionsData(ConnectedSessionBaseInfo connInfo){
		String myself = connInfo.getSender();
		String curOtherSide = connInfo.getReceiver();
		boolean isSelfConn = connInfo.isSelfConnection();
		
		return doBuildAllSesssionsData(myself, curOtherSide, isSelfConn);
	}

	private static MyActiveConnectData doBuildAllSesssionsData(String myself, String curOtherSide, boolean isSelfConn) {
		MyActiveConnectData result = new MyActiveConnectData();
		Map<String, SessionStat> statTable = new HashMap<String, SessionStat>();
		SessionStat stat;
		//第一个应该是当前在连接的对方用户(注意：不包括 SelfConnection)
		if (! isSelfConn){
			stat = new SessionStat(curOtherSide, SessionStat.CONNECTED, 0);
			result.getSessions().add(stat);
			statTable.put(curOtherSide, stat);
		}
		//然后是所有自己连接到的对方用户
		List<String> receivers = ConnectedSessionMgr.getConnectedReceivers(myself);
		for(String receiver: receivers){
			if ( !statTable.containsKey(receiver) ){
				stat = new SessionStat(receiver, SessionStat.CONNECTED, 0);
				result.getSessions().add(stat);
				statTable.put(receiver, stat);
			}
		}
		//然后是所有连接到自己的对方用户
		List<String> senders = ConnectedSessionMgr.getConnectedSenders(myself);
		for(String sender: senders){
			if ( !statTable.containsKey(sender) ){
				stat = new SessionStat(sender, SessionStat.CONNECTED, 0);
				result.getSessions().add(stat);
				statTable.put(sender, stat);
			}
		}
		//最后是所有当前用户未读消息的发送者
		List<Message> newMessages = MessagerConfig.getMessageStoreInstance().findNewMessage(myself);
		MsgUtils.sortDesc(newMessages);
		for (Message msg: newMessages){
			String sender = msg.getSender();
			stat = statTable.get(sender);
			if (null==stat){
				stat = new SessionStat(sender, SessionStat.REMIND, 1);
				result.getSessions().add(stat);
				statTable.put(sender, stat);
			}else{
				stat.addCount(1);
			}
		}
		//计算消息总数
		result.setTotal(newMessages.size());
		//标识当前连接的用户
		if (! isSelfConn){
			result.setCurrentReceiver(curOtherSide);
		}else{
			result.setCurrentReceiver(null);
		}
		
		//补充必要的历史会话信息
		List<SessionStat> list = result.getSessions();
		MessageRecordManager.appendHistorySession(myself, list);
		
		//设置与对方的最后活动会话信息
		for(SessionStat sessionStat : result.getSessions()){
			setLastSessionInfo(myself, sessionStat);
		}
		
		return result;
	}
	
	private static void setLastSessionInfo(String sender, SessionStat sessionStat) {
		String receiver = sessionStat.getCode();
		Message lastMsg = MessageRecordManager.getLastMessage(sender, receiver);
		
		sessionStat.setState(UserStateManager.queryStateByUserCode(receiver));
		if(null != lastMsg){
			sessionStat.setLastMsg(lastMsg);
			sessionStat.setLastTime(lastMsg.getTimestamp());
		}
	}
	
	/**
	 * 构造提供给客户端开始聊天时自动显示的的用户聊天记录历史信息
	 * @param connInfo
	 * @param limits
	 * @return
	 */
	public static RecentHistory buildHistoryData(ConnectedSessionBaseInfo connInfo, int limits){
		RecentHistory result = new RecentHistory();
		String myself = connInfo.getSender();
		String curOtherSide = connInfo.getReceiver();
		long toTime = System.currentTimeMillis();
		long fromTime = (toTime-24*60*60*1000);    //默认提供给客户端的历史数据限制在 1 天之内
		IMessageStore store = MessagerConfig.getMessageStoreInstance();
		List<Message> sentMsgs = store.findHistory(myself, curOtherSide, fromTime, toTime, null, null);
		List<Message> recvMsgs = store.findHistory(curOtherSide, myself, fromTime, toTime, null, null);
		//选取相对于self已读的历史消息(未读的消息会从服务端推送过来,所以不需要在历史里)
		List<Message> historyMsgs=new ArrayList<Message>();
		for (Message message : recvMsgs) {
			if(message.getReadTimestamp()>0){
				historyMsgs.add(message);
			}
		}
		historyMsgs.addAll(sentMsgs);
		MsgUtils.sortAsc(historyMsgs);
		int toIndex = historyMsgs.size();
		int fromIndex = (toIndex<limits)?0:toIndex-limits;
		historyMsgs = historyMsgs.subList(fromIndex, toIndex);		
		result.setMessages(historyMsgs);
		return result;
	}
	
	/**
	 * 根据消息的 发送方 计算需要提醒哪些 消息接收方 更新 MyActiveConnectData 信息
	 * @param connInfo
	 */
	public static void markNotifyClientPeerIds(ConnectedSessionBaseInfo connInfo){
		//获取当前发送方的 MyActiveConnectData 信息 -- 其中包含相关的消息接收方信息
		MyActiveConnectData activeConnData = buildAllSesssionsData(connInfo);
		
		doMarkNotifyClientPeerIds(connInfo.getSender(), activeConnData);
	}

	/**
	 * 根据消息的 发送方 计算需要提醒哪些 消息接收方 更新 MyActiveConnectData 信息
	 * @param senderPeerId
	 */
	public static void markNotifyClientPeerIds(String senderPeerId) {
		//模拟一个 self connection 获得 sender 的 MyActiveConnectData 信息
		MyActiveConnectData activeConnData = doBuildAllSesssionsData(senderPeerId, senderPeerId, true);
		
		doMarkNotifyClientPeerIds(senderPeerId, activeConnData);
	}

	private static void doMarkNotifyClientPeerIds(String senderPeerId, MyActiveConnectData activeConnData) {
		List<SessionStat> sessions = activeConnData.getSessions();
		for(SessionStat session: sessions){
			ConnectedSessionMgr.mark4ConnDataNotify(session.getCode());
		}
		//考虑到当前用户可能有几个实例, 所以同时也要标记“影响自身的 MyActiveConnectData 状态”
		ConnectedSessionMgr.mark4ConnDataNotify(senderPeerId);
	}

}
