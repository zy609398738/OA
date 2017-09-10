package com.bokesoft.oa.base;

/**
 * 配置基础
 * 
 * @author minjian
 *
 */
public abstract class ABase {
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
	 * 构造配置基础对象
	 * 
	 * @param context
	 *            上下文对象
	 */
	public ABase(OAContext context) {
		setContext(context);
	}
}
