package com.bokesoft.oa.base;

import java.util.LinkedHashMap;

import com.bokesoft.yigo.mid.base.DefaultContext;

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
	 * 构造基础集合对象
	 * 
	 * @param context
	 *            中间层对象
	 */
	public BaseMap(DefaultContext context) {
		super();
		setContext(context);
	}

}
