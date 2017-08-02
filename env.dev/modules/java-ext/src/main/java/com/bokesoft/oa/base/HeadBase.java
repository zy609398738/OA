package com.bokesoft.oa.base;

import com.bokesoft.yes.common.util.StringUtil;
import com.bokesoft.yigo.mid.connection.IDBManager;
import com.bokesoft.yigo.struct.datatable.DataTable;

/**
 * 头表基础
 * 
 * @author chenbiao
 *
 */
public abstract class HeadBase extends Base {
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
	 *            上下文对象
	 */
	public HeadBase(OAContext context) {
		super(context);
		setKey("");
		setCaption("");
	}

	/**
	 * 载入数据
	 * 
	 * @param headSql
	 *            头表Sql
	 * @throws Throwable
	 */
	public void loadData(Long oid, String headSql) throws Throwable {
		IDBManager dbm = getContext().getContext().getDBManager();
		DataTable headDt = dbm.execPrepareQuery(headSql, oid);
		loadData(headDt);
	}

	/**
	 * 载入数据
	 * 
	 * @param dt
	 *            头表数据集
	 * @throws Throwable
	 */
	public void loadData(DataTable dt) throws Throwable {
		setOID(dt.getLong("OID"));
		if (dt.getMetaData().constains("Billkey")) {
			String billKey = dt.getString("Billkey");
			setKey(billKey);
			if (!StringUtil.isBlankOrNull(billKey)) {
				String caption = getContext().getContext().getVE().getMetaFactory().getMetaForm(billKey).getCaption();
				setCaption(caption);
			}
		}
	}

	/**
	 * 重载
	 */
	public String toString() {
		return super.toString() + "，单据标识：" + getKey() + "，单据名称：" + getCaption();
	}

}
