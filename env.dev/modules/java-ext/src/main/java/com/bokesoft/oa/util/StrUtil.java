package com.bokesoft.oa.util;

import java.util.ArrayList;
import java.util.List;

import com.bokesoft.yigo.common.util.TypeConvertor;

/**
 * 字符串工具
 * 
 * @author minjian
 *
 */
public class StrUtil {
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
}
