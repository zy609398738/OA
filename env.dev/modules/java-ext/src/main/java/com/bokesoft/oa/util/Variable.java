package com.bokesoft.oa.util;

import java.util.LinkedHashMap;

/**
 * yigo2.0没有存放全局变量的地方，这里用来存放静态变量的集合
 * 
 * @author minjian
 *
 */
public class Variable {
	/**
	 * 变量的集合
	 */
	private final static LinkedHashMap<String, Object> VariableMap = new LinkedHashMap<String, Object>();

	/**
	 * 获得变量的集合
	 * 
	 * @return 变量的集合
	 */
	public static LinkedHashMap<String, Object> getVariablemap() {
		return VariableMap;
	}

	/**
	 * 是否存在变量
	 * 
	 * @param key
	 *            变量的标识
	 * @return 存在变量返回true,否则返回false
	 */
	public static boolean containsKey(String key) {
		return VariableMap.containsKey(key);
	}

	/**
	 * 获得变量
	 * 
	 * @param key
	 *            变量的标识
	 * @return 获得的变量
	 */
	public static Object get(String key) {
		return VariableMap.get(key);
	}

	/**
	 * 提交变量
	 * 
	 * @param key
	 *            变量的标识
	 * @param value
	 *            提交的变量
	 * @return 提交的变量
	 */
	public static Object put(String key, Object value) {
		return VariableMap.put(key, value);
	}

	/**
	 * 删除变量
	 * 
	 * @param key
	 *            变量的标识
	 * @return 删除的变量
	 */
	public static Object remove(String key) {
		return VariableMap.remove(key);
	}
}
