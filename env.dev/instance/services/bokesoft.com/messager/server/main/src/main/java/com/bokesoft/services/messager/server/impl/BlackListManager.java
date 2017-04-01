package com.bokesoft.services.messager.server.impl;

import java.util.HashSet;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

public class BlackListManager {
	
	/**
	 * 存储整个系统的黑名单, 结构为 Map[userCode, Set[blockedUserCode]]
	 */
	private static Map<String,Set<String>> blackLisCache = new ConcurrentHashMap<String,Set<String>>();
	
	/**
	 * 更新系统黑名单, 支持一次更新多个用户的黑名单
	 * @param blacklist 多个用户的黑名单数据, 格式同 {@link #blackLisCache}
	 */
	public static void update(Map<String,Set<String>> blacklist){
		for(String userCode : blacklist.keySet()){
			Set<String> blockedUsers = blacklist.get(userCode);
			blackLisCache.put(userCode, new HashSet<String>(blockedUsers));
		}
	}
	
	/**
	 * 清除所有的黑名单记录, 一般用于重新设置全部用户的黑名单的场合
	 */
	public static void reset(){
		blackLisCache.clear();
	}
	
	/**
	 * 假设把 receiver 列入黑名单，那么 sender 可以发消息，而 receiver 不能给 sender 发消息
	 * @param sender
	 * @param receiver
	 * @return
	 */
	public static boolean shouldBlock(String sender, String receiver) {
		if(blackLisCache.get(receiver) != null && blackLisCache.get(receiver).contains(sender)){
			return true;
		}
		return false;
	}
	
}
	