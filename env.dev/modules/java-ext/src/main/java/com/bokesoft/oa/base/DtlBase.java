package com.bokesoft.oa.base;

import com.bokesoft.yigo.struct.datatable.DataTable;

/**
 * 明细基础
 * 
 * @author chenbiao
 *
 */
public class DtlBase<H> extends Base {
	/**
	 * 父对象
	 */
	private H headBase;

	/**
	 * 父对象
	 * 
	 * @return 父对象
	 * @throws Throwable 
	 */
	public H getHeadBase() throws Throwable {
		return headBase;
	}

	/**
	 * 父对象
	 * 
	 * @param headBase
	 *            父对象
	 */
	public void setHeadBase(H headBase) {
		this.headBase = headBase;
	}

	/**
	 * 构造明细基础对象
	 * 
	 * @param context
	 *            上下文对象
	 */
	public DtlBase(OAContext context, H headBase) {
		super(context);
		setHeadBase(headBase);
	}

	/**
	 * 载入数据
	 * 
	 * @param dt
	 *            明细数据集
	 * @throws Throwable
	 */
	public void loadData(DataTable dt) throws Throwable {
		setOID(dt.getLong("OID"));
	}
}
