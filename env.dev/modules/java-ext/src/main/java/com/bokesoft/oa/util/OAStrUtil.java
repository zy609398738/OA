package com.bokesoft.oa.util;

import java.util.ArrayList;
import java.util.List;

import com.bokesoft.yes.common.struct.StringHashMap;
import com.bokesoft.yes.mid.cmd.i18n.GetLocaleStringCmd;
import com.bokesoft.yigo.common.util.TypeConvertor;
import com.bokesoft.yigo.mid.base.DefaultContext;

/**
 * 字符串工具
 * 
 * @author minjian
 *
 */
public class OAStrUtil {
	/**
	 * 根据字符串获取整形值的列表
	 * 
	 * @param str
	 *            整形值字符串，默认以","分隔
	 * @return 整形值的列表
	 */
	public static List<Integer> getIntegerListByStr(String str) {
		return getIntegerListByStr(str, ",");
	}

	/**
	 * 根据字符串获取整形值的列表
	 * 
	 * @param str
	 *            整形值字符串
	 * @param regex
	 *            分隔符
	 * @return 整形值的列表
	 */
	public static List<Integer> getIntegerListByStr(String str, String regex) {
		String[] strArray = str.split(regex);
		List<Integer> list = new ArrayList<Integer>();
		for (String value : strArray) {
			list.add(TypeConvertor.toInteger(value));
		}
		return list;
	}

	/**
	 * 本地化字符串
	 * 
	 * @param context
	 *            上下文对象
	 * @param group
	 *            本地化组标识
	 * @param key
	 *            本地化字符串标识
	 * @return 本地化字符串
	 * @throws Throwable
	 */
	public static String localeString(DefaultContext context, String group, String key) throws Throwable {
		return localeString(context, group, key, context.getFormKey(), "");

	}

	/**
	 * 本地化字符串
	 * 
	 * @param context
	 *            上下文对象
	 * @param group
	 *            本地化组标识
	 * @param key
	 *            本地化字符串标识
	 * @param formKey
	 *            表单的Key
	 * @return 本地化字符串
	 * @throws Throwable
	 */
	public static String localeString(DefaultContext context, String group, String key, String formKey)
			throws Throwable {
		return localeString(context, group, key, formKey, "");

	}

	/**
	 * 本地化字符串
	 * 
	 * @param context
	 *            上下文对象
	 * @param group
	 *            本地化组标识
	 * @param key
	 *            本地化字符串标识
	 * @param formKey
	 *            表单的Key
	 * @param paras
	 *            本地化字符串参数，json格式，例：{0},{1},{2}
	 * @return 本地化字符串
	 * @throws Throwable
	 */
	public static String localeString(DefaultContext context, String group, String key, String formKey, String paras)
			throws Throwable {
		GetLocaleStringCmd getLocaleStringCmd = new GetLocaleStringCmd();
		StringHashMap<Object> strMap = new StringHashMap<Object>();
		strMap.put("group", group);
		strMap.put("key", key);
		strMap.put("formKey", formKey);
		strMap.put("paras", paras);
		getLocaleStringCmd.dealArguments(context, strMap);
		String str = (String) getLocaleStringCmd.doCmd(context);
		return str;

	}
}
