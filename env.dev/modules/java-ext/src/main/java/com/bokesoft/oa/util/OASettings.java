package com.bokesoft.oa.util;

import java.io.File;

import com.bokesoft.oa.config.Configuration;
import com.bokesoft.oa.config.Settings;
import com.bokesoft.yes.mid.base.CoreSetting;

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
	public static final String SYSTEM_SET_KEY = "SystemSet";
	/**
	 * 系统消息功能的标识
	 */
	public static final String SYSTEM_MESSAGE_KEY = "SystemMessage";

	/**
	 * 获得参数配置
	 * 
	 * @return 参数配置
	 * @throws Throwable
	 */
	public static Configuration getConfiguration() throws Throwable {
		return Configuration.getConfiguration(OA_MODULE_KEY);
	}

	/**
	 * 获得系统消息的参数设置对象
	 * 
	 * @return 系统消息的参数设置对象
	 * @throws Throwable
	 */
	public static Settings getSystemSet() throws Throwable {
		return getConfiguration().getMap(SYSTEM_SET_KEY);
	}

	/**
	 * 获得模板路径
	 * 
	 * @return 模板路径
	 * @throws Throwable
	 */
	public static String getWebUrl() throws Throwable {
		String webUrl = "";
		Settings settings = getSystemSet();
		if (settings.containsProperty("WebUrl")) {
			webUrl = settings.getProperty("WebUrl");
		}
		return webUrl;
	}

	/**
	 * 获得系统设置的参数设置对象
	 * 
	 * @return 系统消息的参数设置对象
	 * @throws Throwable
	 */
	public static Settings getSystemMessage() throws Throwable {
		return getConfiguration().getMap(SYSTEM_MESSAGE_KEY);
	}

	/**
	 * 获得系统消息的消息类型
	 * 
	 * @return 系统消息的消息类型
	 * @throws Throwable
	 */
	public static Settings getSystemMessageType() throws Throwable {
		return getSystemMessage().getMap("MessageType");
	}

	/**
	 * 获得模板路径
	 * 
	 * @return 模板路径
	 * @throws Throwable
	 */
	public static String getTemplatePath() throws Throwable {
		String solutionPath = CoreSetting.getInstance().getSolutionPath();
		Settings settings = getSystemMessageType();
		String templatePath = settings.getMap("Email").getProperty("TemplatePath");
		templatePath = solutionPath + File.separator + templatePath;
		return templatePath;
	}
}
