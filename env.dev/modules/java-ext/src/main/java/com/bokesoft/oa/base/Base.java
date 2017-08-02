package com.bokesoft.oa.base;

/**
 * 配置基础
 * 
 * @author chenbiao
 *
 */
public class Base {
	/**
	 * 上下文对象
	 */
	private OAContext context;

	/**
	 * 上下文对象
	 * 
	 * @return 上下文对象
	 */
	public OAContext getContext() {
		return context;
	}

	/**
	 * 上下文对象
	 * 
	 * @param context
	 *            上下文对象
	 */
	public void setContext(OAContext context) {
		this.context = context;
	}

	/**
	 * 唯一标识
	 */
	private Long oid = 0L;

	/**
	 * 唯一标识
	 * 
	 * @return 唯一标识
	 */
	public Long getOID() {
		return oid;
	}

	/**
	 * 唯一标识
	 * 
	 * @param oid
	 *            唯一标识
	 */
	public void setOID(Long oid) {
		this.oid = oid;
	}

	/**
	 * 构造配置基础对象
	 * 
	 * @param context
	 *            上下文对象
	 */
	public Base(OAContext context) {
		setContext(context);
	}

	/**
	 * 重载，输出标识ID
	 */
	public String toString() {
		return "标识ID：" + oid.toString();
	}
}
