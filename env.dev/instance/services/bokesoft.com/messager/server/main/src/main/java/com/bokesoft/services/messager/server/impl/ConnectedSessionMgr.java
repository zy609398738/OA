package com.bokesoft.services.messager.server.impl;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

import org.apache.commons.lang3.StringUtils;
import org.eclipse.jetty.util.ConcurrentHashSet;
import org.eclipse.jetty.websocket.api.Session;

import com.bokesoft.services.messager.server.model.ConnectedSessionBaseInfo;
import com.bokesoft.services.messager.server.model.MyActiveConnectData;

/**
 * 统一管理所有的 WebSocket 会话
 */
public class ConnectedSessionMgr {
	/** 记录所有连接的 sessionId 的 Session 连接信息 */
	private static Map<String, ConnectedSessionBaseInfo> idConnectInfoTable = new ConcurrentHashMap<String, ConnectedSessionBaseInfo>();
	/** 记录 sessionId 与 WebSocket session 的对应关系 */
	private static Map<String, Session> idSessionTable = new ConcurrentHashMap<String, Session>();
	/** 记录已连接的用户(消息发送方)和 sessionId 的关系 */
	private static Map<String, List<String>> senderSessionIdsTable = new ConcurrentHashMap<String, List<String>>();
	/** 反过来记录 sessionId 与 消息发送方 的关系 */
	private static Map<String, String> idSenderTable = new ConcurrentHashMap<String, String>();
	/** 从消息接收用户角度维护用户和 sessionId 的关系 */
	private static Map<String, List<String>> receiverSessionIdsTable = new ConcurrentHashMap<String, List<String>>();
	/** 反过来记录 sessionId 与 消息接收方 的关系 */
	private static Map<String, String> idReceiverTable = new ConcurrentHashMap<String, String>();
	/** 记录已连接的用户(self-connection)和 sessionId 的关系 */
	private static Map<String, List<String>> selfSessionIdsTable = new ConcurrentHashMap<String, List<String>>();
	/** 反过来记录 sessionId 与 用户(self-connection)的关系 */
	private static Map<String, String> idSelfTable = new ConcurrentHashMap<String, String>();
	/** 记录需要刷新 {@link MyActiveConnectData} 数据的客户端(userCode) */
	private static Set<String> connDataNotifyCache = new ConcurrentHashSet<String>();
	
	/**
	 * 在会话连接时, 记录相关连接数据
	 * @param connInfo
	 * @param session
	 */
	public static void rememberConnectedSession(ConnectedSessionBaseInfo connInfo, Session session){
		String id = connInfo.getId();
		idConnectInfoTable.put(id, connInfo);
		idSessionTable.put(id, session);

		String sender = connInfo.getSender();
		String receiver = connInfo.getReceiver();
		if (!connInfo.isSelfConnection()) {	//对于 SelfConnection, 不需要记录 sender/receiver 的相关关系
			handleRememberSessionTable(id, sender, senderSessionIdsTable, idSenderTable);
			handleRememberSessionTable(id, receiver, receiverSessionIdsTable, idReceiverTable);
		} else {
			handleRememberSessionTable(id, sender, selfSessionIdsTable, idSelfTable);
		}
	}

	private static void handleRememberSessionTable(
			String id, String user, Map<String, List<String>> userSessionIdsTable, Map<String, String> idUserTable) {
		idUserTable.put(id, user);
		
		List<String> ids = userSessionIdsTable.get(user);
		if (null==ids){
			ids = new ArrayList<String>();
			ids.add(id);
			userSessionIdsTable.put(user, ids);
		}else{
			ids.add(0, id);	//最后连接的 id 总是插在最前面
		}
	}
	
	/**
	 * 在连接关闭时, 清除相关的连接信息
	 * @param connInfo
	 */
	public static void removeClosedSession(ConnectedSessionBaseInfo connInfo){
		String id = connInfo.getId();
		String sender = connInfo.getSender();
		String receiver = connInfo.getReceiver();
		
		idSessionTable.remove(id);
		idConnectInfoTable.remove(id);
		idSelfTable.remove(id);
		
		handleRemoveSessionTable(id, sender, senderSessionIdsTable, idSenderTable);
		handleRemoveSessionTable(id, receiver, receiverSessionIdsTable, idReceiverTable);
		handleRemoveSessionTable(id, receiver, selfSessionIdsTable, idSelfTable);
	}

	private static void handleRemoveSessionTable(
			String id, String sender, Map<String, List<String>> userSessionIdsTable, Map<String, String> idUserTable) {
		List<String> ids = userSessionIdsTable.get(sender);
		if (null!=ids){
			ids.remove(id);
		}
		
		idUserTable.remove(id);
	}
	
	/**
	 * 根据 会话 id 获得会话信息
	 * @param id
	 * @return
	 */
	public static ConnectedSessionBaseInfo getConnectedSessionInfoById(String id){
		return idConnectInfoTable.get(id);
	}
	
	/**
	 * 根据 会话 id 获取会话连接
	 * @param id
	 * @return
	 */
	public static Session getConnectedSessionById(String id){
		Session ses = idSessionTable.get(id);
		return ses;
	}
	
	/**
	 * 寻找所有可以发送消息给某个用户的可用 session 信息
	 * @param senderCode 作为消息连接中发送方的 userCode(接收方实际上不会直接与发送方形成 WebSokcet 连接, 而是同样以发送方身份连接到服务器)
	 * @return
	 */
	public static Map<String, Session> getConnectedSessions4SendMessage(String senderCode){
		Map<String, Session> result = new HashMap<String, Session>();
		
		List<String> senderIds = new ArrayList<String>();
		if (isUserConnected(senderCode)){
			//首先到 sender 连接的集合中查找
			List<String> ids = senderSessionIdsTable.get(senderCode);
			if(null!=ids){
				senderIds.addAll(ids);
			}
			//同时考虑符合条件的 self connection 会话连接
			ids = selfSessionIdsTable.get(senderCode);
			if (null!=ids){
				senderIds.addAll(ids);
			}
		}
		for(String sessionId: senderIds){
			fillSessionAndId(result, sessionId);
		}
		
		return result;
	}
	
	/**
	 * 寻找 sender => receiver 的连接, 这个连接({@link Session})正好可以用于 receiver 回复给 sender
	 * @param sender
	 * @param receiver
	 * @return
	 */
	public static Map<String, Session> getConnectedSessions4SendReplyingMessage(String sender, String receiver){
		Map<String, Session> result = new HashMap<String, Session>();
		
		List<String> senderIds = senderSessionIdsTable.get(sender);
		List<String> receiverIds = receiverSessionIdsTable.get(receiver);
		
		if (null!=senderIds && null!=receiverIds){
			for (String id: senderIds){
				if (receiverIds.contains(id)){
					fillSessionAndId(result, id);
				}
			}
		}
		return result;
	}

	private static void fillSessionAndId(Map<String, Session> result, String id) {
		Session ses = getConnectedSessionById(id);
		if (null!=ses && ses.isOpen()){
			result.put(id, ses);
		}
	}
	
	/**
	 * 获得某个 接收方 被哪些 发送方 所连接
	 * @param receiver
	 * @return
	 */
	public static List<String> getConnectedSenders(String receiver){
		return getConnectedOtherSides(receiver, receiverSessionIdsTable, idSenderTable);
	}

	/**
	 * 获得某个 发送方 连接到了哪些 接收方(一般情况下, 只有发送方在多实例访问时, 才会连接到大于1个的接收方)
	 * @param sender
	 * @return
	 */
	public static List<String> getConnectedReceivers(String sender){
		return getConnectedOtherSides(sender, senderSessionIdsTable, idReceiverTable);
	}

	private static List<String> getConnectedOtherSides(
			String selfUserCode, Map<String, List<String>> selfSessionIdsTable, Map<String, String> idOtherSideTable) {
		List<String> result = new ArrayList<String>();
		List<String> ids = selfSessionIdsTable.get(selfUserCode);
		if (null!=ids){
			for (String id: ids){
				String sender = idOtherSideTable.get(id);
				if (null!=sender){
					result.add(sender);
				}
			}
		}
		
		return result;
	}
	
	/**
	 * 判断某个用户是否有会话处于连接状态(包括 self-connection({@link ConnectedSessionBaseInfo#isSelfConnection()}))
	 * @param userCode
	 * @return
	 */
	public static boolean isUserConnected(String userCode){
		if (StringUtils.isBlank(userCode)){
			return false;
		}
		
		for(ConnectedSessionBaseInfo info: idConnectInfoTable.values()){
			if (userCode.equals(info.getSender())){
				return true;
			}
		}
		return false;
	}
	
	/**
	 * 记录 {@link MyActiveConnectData} 已经发生改变的客户端(userCode)
	 * @param userCode
	 */
	public static void mark4ConnDataNotify(String userCode) {
		if (StringUtils.isNotBlank(userCode)){
			connDataNotifyCache.add(userCode);
		}
	}
	
	/**
	 * 清除 {@link MyActiveConnectData} 发生改变的客户端(userCode)的记录
	 * @param userCode
	 */
	public static void unmark4ConnDataNotify(String userCode) {
		if (StringUtils.isNotBlank(userCode)){
			connDataNotifyCache.remove(userCode);
		}
	}
	
	/**
	 * 读取全部需要通知 {@link MyActiveConnectData} 发生改变的客户端(userCode)
	 * @return
	 */
	public synchronized static Set<String> readConnDataNotifyCache(){
		Set<String> dataCopy = new HashSet<String>(connDataNotifyCache);
		return dataCopy;
	}
}
