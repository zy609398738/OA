package com.bokesoft.services.messager.server.impl;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

public class UserStateManager {

	/**
	 * 记录每个用户的状态设置信息, 格式为 Map[userCode, state]
	 */
	private static Map<String, String> userStateCache = new ConcurrentHashMap<String,String>();
	
	/** 在线, 通过用户是否存在 WebSocket 连接判断 */
	public static final String STATE_ONLINE = "online";
	/** 离线, 通过用户是否存在 WebSocket 连接判断 */
	public static final String STATE_OFFLINE = "offline";
	/** "离开" 状态, 通过客户端设置 */
	public static final String STATE_IDLE = "idle";
	/** "隐身" 状态, 通过客户端设置 */
	public static final String STATE_LURK = "lurk";
	/** "繁忙" 状态, 通过客户端设置 */
	public static final String STATE_BUSY = "busy";
	
	/**
	 * 根据 userCode 查询状态
	 * @param userCode
	 * @return
	 */
	public static String queryStateByUserCode(String userCode){		
		String result;
		if(ConnectedSessionMgr.isUserConnected(userCode)){
			String state = userStateCache.get(userCode);
			result = (state==null?STATE_ONLINE:state);
		}else{
			result = STATE_OFFLINE;
		}
		return result;		
	}
	
	/**
	 * 设置某个用户的状态;
	 * 注意, 只有 {@link #STATE_IDLE}, {@link #STATE_LURK} 和 {@link #STATE_BUSY} 状态需要通过此方法进设置.
	 * @param userCode
	 * @param state
	 */
	public static void setState(String userCode, String state){
		if(STATE_IDLE.equals(state) ||
			STATE_LURK.equals(state) ||
			 STATE_BUSY.equals(state)){
			userStateCache.put(userCode, state);
		}else{
			userStateCache.remove(userCode);
		}
	}
}
