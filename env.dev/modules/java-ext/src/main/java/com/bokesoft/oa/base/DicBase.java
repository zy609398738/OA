package com.bokesoft.oa.base;

import com.bokesoft.yigo.mid.base.DefaultContext;

/**
 * 字典基础
 * 
 * @author chenbiao
 *
 */
public class DicBase extends HeadBase {
	/**
	 * 代码
	 */
	private String code;

	/**
	 * 代码
	 * 
	 * @return 代码
	 */
	public String getCode() {
		return code;
	}

	/**
	 * 代码
	 * 
	 * @param code
	 *            代码
	 */
	public void setCode(String code) {
		this.code = code;
	}

	/**
	 * 名称
	 */
	private String name;

	/**
	 * 名称
	 * 
	 * @return 名称
	 */
	public String getName() {
		return name;
	}

	/**
	 * 名称
	 * 
	 * @param name
	 *            名称
	 */
	public void setName(String name) {
		this.name = name;
	}

	/**
	 * 
	 * @param context
	 */
	public DicBase(DefaultContext context) {
		super(context);
	}

}
