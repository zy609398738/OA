package com.bokesoft.oa.config;

import java.util.List;

import com.bokesoft.oa.base.ABase;
import com.bokesoft.oa.base.OAContext;
import com.bokesoft.oa.util.Variable;
import com.bokesoft.yes.common.util.StringUtil;

/**
 * 参数配置
 * 
 * @author minjian
 * 
 */
public class Configuration extends ABase {
	/**
	 * 在全局缓冲集合里存放参数配置对象的Key
	 */
	public final static String CONFIGURATION = "Configuration_Settings";
	/**
	 * 在全局缓冲集合里存放参数配置所在模块的Key
	 */
	public final static String MODULE_KEY = "Module_Key";
	/**
	 * 根节点的设置对象
	 */
	private Settings rootSettings;

	/**
	 * 根节点的设置对象
	 * 
	 * @return 根节点的设置对象
	 */
	public Settings getRootSettings() {
		return rootSettings;
	}

	/**
	 * 根节点的设置对象
	 * 
	 * @param rootSettings
	 *            根节点的设置对象
	 */
	public void setRootSettings(Settings rootSettings) {
		this.rootSettings = rootSettings;
	}

	/**
	 * 构造参数配置对象
	 * 
	 * @param context
	 *            上下文对象
	 * @param settings
	 *            参数设置对象
	 * @throws Throwable
	 */
	protected Configuration(OAContext context, Settings settings) throws Throwable {
		super(context);
		rootSettings = settings;
	}

	/**
	 * 获得参数配置对象
	 * 
	 * @param context
	 *            上下文对象
	 * @return 参数配置对象
	 * @throws Throwable
	 */
	public static Configuration getConfiguration(OAContext context) throws Throwable {
		return getConfiguration(context, Variable.get(MODULE_KEY).toString());
	}

	/**
	 * 获得参数配置对象
	 * 
	 * @param context
	 *            上下文对象
	 * @param moduleKey
	 *            模块标识
	 * @return 参数配置对象
	 * @throws Throwable
	 */
	public static Configuration getConfiguration(OAContext context, String moduleKey) throws Throwable {
		String key = CONFIGURATION + "_" + moduleKey;
		Configuration configuration = null;
		if (Variable.containsKey(key)) {
			configuration = (Configuration) Variable.get(key);
			// 如果是调试状态，清空原设置，重新载入参数设置
			if (configuration.getIsDebug()) {
				clearConfiguration(moduleKey);
				configuration = null;
			}
		}
		if (configuration == null) {
			Settings settings = new Settings(context);
			settings.loadConfig(moduleKey);
			configuration = new Configuration(context, settings);
			Variable.put(key, configuration);
			Variable.put(MODULE_KEY, moduleKey);
		}
		return configuration;
	}

	/**
	 * 清空参数配置对象
	 * 
	 * @param moduleKey
	 *            模块标识
	 * @throws Throwable
	 */
	public static void clearConfiguration(String moduleKey) throws Throwable {
		String key = CONFIGURATION + "_" + moduleKey;
		if (Variable.containsKey(key)) {
			Variable.remove(key);
		}
	}

	/**
	 * 清空参数配置对象
	 * 
	 * @throws Throwable
	 */
	public static void clearConfiguration() throws Throwable {
		clearConfiguration(Variable.get(MODULE_KEY).toString());
	}

	/**
	 * 获取属性
	 * 
	 * @param name
	 *            属性名称
	 * @return 属性值
	 */
	public String getProperty(String name) {
		return rootSettings.getProperty(name);
	}

	/**
	 * 获取映射对象
	 * 
	 * @param name
	 *            映射对象名称
	 * @return 映射对象
	 */
	public Settings getMap(String name) {
		return rootSettings.getMap(name);
	}

	/**
	 * 获取列表对象
	 * 
	 * @param name
	 *            列表对象名称
	 * @return 列表对象
	 */
	public List<String> getValueList(String name) {
		return rootSettings.getValueList(name);
	}

	/**
	 * 获取映射列表对象
	 * 
	 * @param name
	 *            映射列表对象名称
	 * @return 映射列表对象
	 */
	public List<Settings> getMapList(String name) {
		return rootSettings.getMapList(name);
	}

	/**
	 * 根据路劲获得参数设置
	 * 
	 * @param paths
	 *            参数设置的元素路径，以“|”分隔
	 */
	public Settings getSettingsByPaths(String paths) {
		String[] pathArray = StringUtil.split(paths, "|");
		Settings settings = rootSettings;
		for (String path : pathArray) {
			settings = settings.getMap(path);
		}
		return settings;
	}

	/**
	 * 获取是否调试状态
	 * 
	 * @return 是否调试状态
	 */
	public Boolean getIsDebug() {
		return rootSettings.getIsDebug();
	}
}
