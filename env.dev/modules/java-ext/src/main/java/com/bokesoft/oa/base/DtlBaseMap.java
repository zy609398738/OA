package com.bokesoft.oa.base;

import com.bokesoft.yigo.struct.datatable.DataTable;

/**
 * 明细基础集合
 * 
 * @author chenbiao
 * @param <K>
 * @param <V>
 *
 */
public class DtlBaseMap<K, V, H> extends BaseMap<K, V> {
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	/**
	 * 头表
	 */
	private H headBase;

	/**
	 * 头表
	 * 
	 * @return 头表
	 */
	public H getHeadBase() {
		return headBase;
	}

	/**
	 * 头表
	 * 
	 * @param headBase
	 *            头表
	 */
	public void setHeadBase(H headBase) {
		this.headBase = headBase;
	}

	/**
	 * 构造明细基础集合对象
	 * 
	 * @param context
	 *            上下文对象
	 */
	public DtlBaseMap(OAContext context, H headBase) {
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
	@SuppressWarnings("unchecked")
	public void loadData(DataTable dt) throws Throwable {
		dt.beforeFirst();
		while (dt.next()) {
			DtlBase<H> dtl = new DtlBase<H>(getContext(), getHeadBase());
			K oid = (K) dtl.getOID();
			put(oid, (V) dtl);
		}
	}
}
