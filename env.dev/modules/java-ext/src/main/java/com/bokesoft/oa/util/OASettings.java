package com.bokesoft.oa.util;

import java.io.File;

import com.bokesoft.oa.base.OAContext;
import com.bokesoft.oa.config.Configuration;
import com.bokesoft.oa.config.Settings;
import com.bokesoft.oa.mid.wf.base.Operation;
import com.bokesoft.yes.mid.base.CoreSetting;
import com.bokesoft.yigo.mid.base.DefaultContext;

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
	private static final String OA_PROJECT_KEY = "OA";
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
	 * @param context
	 *            上下文对象
	 * @return 参数配置
	 * @throws Throwable
	 */
	public static Configuration getConfiguration(DefaultContext context) throws Throwable {
		OAContext oaContext = new OAContext(context);
		return getConfiguration(oaContext);
	}

	public static String getProjectKey() {
		return OA_PROJECT_KEY;
	}

	/**
	 * 获得参数配置
	 * 
	 * @param context
	 *            上下文对象
	 * @return 参数配置
	 * @throws Throwable
	 */
	public static Configuration getConfiguration(OAContext context) throws Throwable {
		return Configuration.getConfiguration(context, OA_PROJECT_KEY);
	}

	/**
	 * 获得系统消息的参数设置对象
	 * 
	 * @param context
	 *            上下文对象
	 * @return 系统消息的参数设置对象
	 * @throws Throwable
	 */
	public static Settings getSystemSet(OAContext context) throws Throwable {
		return getConfiguration(context).getMap(SYSTEM_SET_KEY);
	}

	/**
	 * 获得模板路径
	 * 
	 * @param context
	 *            上下文对象
	 * @return 模板路径
	 * @throws Throwable
	 */
	public static String getWebUrl(OAContext context) throws Throwable {
		String webUrl = "";
		Settings settings = getSystemSet(context);
		if (settings.containsProperty("WebUrl")) {
			webUrl = settings.getProperty("WebUrl");
		}
		return webUrl;
	}

	/**
	 * 获得系统设置的参数设置对象
	 * 
	 * @param context
	 *            上下文对象
	 * @return 系统消息的参数设置对象
	 * @throws Throwable
	 */
	public static Settings getSystemMessage(OAContext context) throws Throwable {
		return getConfiguration(context).getMap(SYSTEM_MESSAGE_KEY);
	}

	/**
	 * 获得系统消息的消息类型
	 * 
	 * @param context
	 *            上下文对象
	 * @return 系统消息的消息类型
	 * @throws Throwable
	 */
	public static Settings getSystemMessageType(OAContext context) throws Throwable {
		return getSystemMessage(context).getMap("MessageType");
	}

	/**
	 * 获得模板路径
	 * 
	 * @param context
	 *            上下文对象
	 * @param nativeplace
	 *            国籍
	 * @return 模板路径
	 * @throws Throwable
	 */
	public static String getTemplatePath(OAContext context, String nativeplace) throws Throwable {
		String solutionPath = CoreSetting.getInstance().getSolutionPath();
		Settings settings = getSystemMessageType(context);
		String templatePath = settings.getMap("Email").getProperty("TemplatePath");
		templatePath = solutionPath + File.separator + templatePath;
		String templateRealPath = templatePath + File.separator + nativeplace;
		File file = new File(templateRealPath);
		if (!file.exists() && !file.isDirectory()) {
			String defNativeplace = OASettings.getSystemMessageType(context).getMap("Email").getProperty("Nativeplace");
			templateRealPath = templatePath + File.separator + defNativeplace;
		}
		return templateRealPath;
	}

	/**
	 * 获得国籍
	 * 
	 * @param context
	 *            上下文
	 * @return 国籍
	 * @throws Throwable
	 */
	public static String getNativeplaceByOperator(DefaultContext context) throws Throwable {
		long operatorID = context.getUserID();
		OAContext oaContext = new OAContext(context);
		long empID = oaContext.getOperatorMap().get(operatorID).getEmployeeID();
		if (empID <= 0) {
			return "";
		} else {
			String nativeplace = oaContext.getEmployeeMap().get(empID).getNativeplace();
			return nativeplace;
		}
	}

	/**
	 * 获得流程启动操作对象
	 * 
	 * @param context
	 *            上下文对象
	 * @return 流程启动操作对象
	 * @throws Throwable
	 */
	public static Operation getBPMOperation(OAContext context) throws Throwable {
		String bpmOperationKey = getSystemSet(context).getProperty("BPMOperationKey");
		return context.getOperationMap().get(bpmOperationKey);
	}
}
