package com.bokesoft.oa.base;

import com.bokesoft.yigo.mid.base.DefaultContext;

/**
 * 头表基础
 * 
 * @author chenbiao
 *
 */
public class HeadBase extends Base{
	/**
	 * 头表标识
	 */
	private String key;

	/**
	 * 头表标识
	 * 
	 * @return 头表标识
	 */
	public String getKey() {
		return key;
	}

	/**
	 * 头表标识
	 * 
	 * @param key
	 *            头表标识
	 */
	public void setKey(String key) {
		this.key = key;
	}

	/**
	 * 头表名称
	 */
	private String caption;

	/**
	 * 头表名称
	 * 
	 * @return 头表名称
	 */
	public String getCaption() {
		return caption;
	}

	/**
	 * 头表名称
	 * 
	 * @param caption
	 *            头表名称
	 */
	public void setCaption(String caption) {
		this.caption = caption;
	}

	/**
	 * 构造头表基础对象
	 * 
	 * @param context
	 *            中间层对象
	 */
	public HeadBase(DefaultContext context) {
		super(context);
	}
}
