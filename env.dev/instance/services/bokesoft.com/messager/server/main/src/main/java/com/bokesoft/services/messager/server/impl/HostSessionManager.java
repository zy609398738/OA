package com.bokesoft.services.messager.server.impl;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import org.apache.commons.lang3.StringUtils;

import com.bokesoft.services.messager.config.MessagerConfig;

public class HostSessionManager {
	private static final String DEV_MODE_TEST_TOKEN_PREFIX = "dev-mode-test-token:";
	
	/**
	 * 系统中所有用户的 token ~ userCode 对应关系, 格式为 Map[token, userCode]
	 */
	private static Map<String,String> userSessionCache = new ConcurrentHashMap<String,String>();
	
	/**
	 * 记录 token 与 userCode 的对应关系
	 * @param token
	 * @param userCode
	 */
	public static void rememberToken(String token, String userCode){
		userSessionCache.put(token, userCode);
	}

	/**
	 * 移除 token
	 * @param token
	 */
	public static void removeToken(String token){
		userSessionCache.remove(token);
	}
	
	/**
	 * 获取某个 token 对应的 userCode
	 * @param token
	 * @return
	 */
	public static String getUserCodeByToken(String token){
		if(StringUtils.isNotBlank(token)){
			if (MessagerConfig.isDevMode() && token.startsWith(DEV_MODE_TEST_TOKEN_PREFIX)){
				//为了测试方便(某些时候没有Host服务器提供 token), 在开发模式下允许通过简单的方式生成测试用的 token, 其中直接包含测试信息
				return token.substring(DEV_MODE_TEST_TOKEN_PREFIX.length());
			}
			
			return userSessionCache.get(token);
		}else{
			return null;
		}
	}
	
}
