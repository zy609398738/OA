package com.bokesoft.oa.base;

import com.bokesoft.yigo.mid.base.DefaultContext;

/**
 * 配置基础
 * 
 * @author chenbiao
 *
 */
public class Base {
	/**
	 * 中间层对象
	 */
	private DefaultContext context;

	/**
	 * 中间层对象
	 * 
	 * @return 中间层对象
	 */
	public DefaultContext getContext() {
		return context;
	}

	/**
	 * 中间层对象
	 * 
	 * @param context
	 *            中间层对象
	 */
	public void setContext(DefaultContext context) {
		this.context = context;
	}

	/**
	 * 唯一标识
	 */
	private Long oid=-1L;

	/**
	 * 唯一标识
	 * 
	 * @return 唯一标识
	 */
	public Long getOid() {
		return oid;
	}

	/**
	 * 唯一标识
	 * 
	 * @param oid
	 *            唯一标识
	 */
	public void setOid(Long oid) {
		this.oid = oid;
	}

	/**
	 * 构造配置基础对象
	 * 
	 * @param context
	 *            中间层对象
	 */
	public Base(DefaultContext context) {
		setContext(context);
	}
}
