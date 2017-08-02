package com.bokesoft.oa.base;

import com.bokesoft.yigo.struct.datatable.DataTable;

/**
 * 字典基础
 * 
 * @author chenbiao
 *
 */
public abstract class DicBase extends HeadBase {
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
	public DicBase(OAContext context) {
		super(context);
	}

	/**
	 * 载入数据
	 * 
	 * @param dt
	 *            头表数据集
	 * @throws Throwable
	 */
	public void loadData(DataTable dt) throws Throwable {
		super.loadData(dt);
		setCode(dt.getString("Code"));
		setName(dt.getString("Name"));
	}

	/**
	 * 重载
	 */
	public String toString() {
		return super.toString() + "，代码：" + getCode() + "，名称：" + getName();
	}
}
