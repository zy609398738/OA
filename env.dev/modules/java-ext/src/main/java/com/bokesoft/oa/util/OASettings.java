package com.bokesoft.oa.util;

import com.bokesoft.oa.config.Configuration;
import com.bokesoft.oa.config.Settings;

/**
 * OA的设置对象
 * 
 * @author minjian
 *
 */
public class OASettings {
	/**
	 * OA模块的标识
	 */
	public static final String OA_MODULE_KEY = "OA";
	/**
	 * 系统消息功能的标识
	 */
	public static final String SYSTEM_MESSAGE_KEY = "SystemMessage";

	/**
	 * 获得系统消息的设置对象
	 * 
	 * @return 系统消息的设置对象
	 * @throws Throwable
	 */
	public static Settings getSystemMessageSettings() throws Throwable {
		return Configuration.getConfiguration(OA_MODULE_KEY).getMap(SYSTEM_MESSAGE_KEY);
	}
	
	/**
	 * 获得系统消息的消息类型
	 * 
	 * @return 系统消息的消息类型
	 * @throws Throwable
	 */
	public static Settings getSystemMessageType() throws Throwable {
		return getSystemMessageSettings().getMap("MessageType");
	}
}
