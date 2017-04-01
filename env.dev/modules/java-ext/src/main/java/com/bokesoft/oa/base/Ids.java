package com.bokesoft.oa.base;

import java.util.ArrayList;
import java.util.List;

/**
 * ID字符串
 * 
 * @author chenbiao
 *
 */
public class Ids {
	/**
	 * ID字符串
	 */
	private String ids = "";

	/**
	 * ID字符串
	 * 
	 * @return ID字符串
	 */
	public String getIds() {
		return ids;
	}

	/**
	 * ID字符串
	 * 
	 * @param ids
	 *            ID字符串
	 */
	public void setIds(String ids) {
		this.ids = ids;
		String[] idArray = ids.split(",");
		for (String id : idArray) {
			idList.add(Long.parseLong(id));
		}
	}

	/**
	 * ID列表
	 */
	private List<Long> idList = new ArrayList<Long>();

	/**
	 * ID列表
	 * 
	 * @return ID列表
	 */
	public List<Long> getIdList() {
		return idList;
	}

	/**
	 * ID列表
	 * 
	 * @param idList
	 *            ID列表
	 */
	public void setIdList(List<Long> idList) {
		this.idList = idList;
		StringBuffer sb = new StringBuffer();
		for (Long id : idList) {
			sb.append("," + id);
		}
		ids = sb.toString();
		if (ids.length() > 0) {
			ids = ids.substring(1);
		}
	}

	/**
	 * 构造ID字符串
	 * 
	 * @param ids
	 *            ID字符串
	 */
	public Ids(String ids) {
		setIds(ids);
	}

	/**
	 * 构造ID字符串
	 * 
	 * @param idList
	 *            ID列表
	 */
	public Ids(List<Long> idList) {
		setIdList(idList);
	}
}
