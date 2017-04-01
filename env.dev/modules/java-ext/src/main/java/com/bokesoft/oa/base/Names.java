package com.bokesoft.oa.base;

import java.util.ArrayList;
import java.util.List;

/**
 * name字符串
 * 
 * @author chenbiao
 *
 */
public class Names {
	/**
	 * name字符串
	 */
	private String names = "";

	/**
	 * name字符串
	 * 
	 * @return name字符串
	 */
	public String getNames() {
		return names;
	}

	/**
	 * name字符串
	 * 
	 * @param names
	 *            name字符串
	 */
	public void setNames(String names) {
		this.names = names;
		String[] nameArray = names.split(",");
		for (String name : nameArray) {
			nameList.add(name);
		}
	}

	/**
	 * name列表
	 */
	private List<String> nameList = new ArrayList<String>();

	/**
	 * name列表
	 * 
	 * @return name列表
	 */
	public List<String> getNameList() {
		return nameList;
	}

	/**
	 * name列表
	 * 
	 * @param nameList
	 *            name列表
	 */
	public void setNameList(List<String> nameList) {
		this.nameList = nameList;
		StringBuffer sb = new StringBuffer();
		for (String name : nameList) {
			sb.append("," + name);
		}
		names = sb.toString();
		if (names.length() > 0) {
			names = names.substring(1);
		}
	}

	/**
	 * 添加Name字符串
	 * 
	 */
	public void addName(String name) {
		if (names.length() <= 0) {
			names = name;
		} else {
			names = names + "," + name;
		}
		nameList.add(name);
	}

	/**
	 * 删除Name字符串
	 * 
	 */
	public void removeName(String name) {
		nameList.remove(name);
		StringBuffer sb = new StringBuffer();
		for (String nameStr : nameList) {
			sb.append("," + nameStr);
		}
		names = sb.toString();
	}

	/**
	 * 是否存在Name字符串
	 * 
	 * @param name
	 *            Name字符串
	 * @return 存在Name字符串返回true，否则返回false
	 */
	public Boolean containsName(String name) {
		return nameList.contains(name);
	}

	/**
	 * 构造Name字符串
	 */
	public Names() {
		setNames(names);
	}

	/**
	 * 构造Name字符串
	 * 
	 * @param names
	 *            name字符串
	 */
	public Names(String names) {
		setNames(names);
	}

	/**
	 * 构造Name字符串
	 * 
	 * @param nameList
	 *            name列表
	 */
	public Names(List<String> nameList) {
		setNameList(nameList);
	}
}
