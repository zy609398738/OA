package com.bokesoft.oa.base;

import java.util.LinkedHashMap;

/**
 * 配置基础集合
 * 
 * @author chenbiao
 * @param <K>
 * @param <V>
 *
 */
public class BaseMap<K, V> extends LinkedHashMap<K, V> {
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
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
	 * 构造基础集合对象
	 * 
	 * @param context
	 *            上下文对象
	 */
	public BaseMap(OAContext context) {
		super();
		setContext(context);
	}

}
