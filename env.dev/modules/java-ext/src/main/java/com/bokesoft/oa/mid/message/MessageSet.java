package com.bokesoft.oa.mid.message;

import com.bokesoft.oa.base.DicBase;
import com.bokesoft.oa.base.OAContext;
import com.bokesoft.yigo.struct.datatable.DataTable;

/**
 * 消息设置
 * 
 * @author chenbiao
 *
 */
public class MessageSet extends DicBase {
	/**
	 * 默认
	 */
	private int isDefault;

	/**
	 * 默认
	 * 
	 * @return 默认
	 */
	public int getIsDefault() {
		return isDefault;
	}

	/**
	 * 默认
	 * 
	 * @param isDefault
	 *            默认
	 */
	public void setIsDefault(int isDefault) {
		this.isDefault = isDefault;
	}

	/**
	 * 消息设置设置明细集合
	 */
	private MessageSetDtlMap messageSetDtlMap;

	/**
	 * 消息设置设置明细集合
	 * 
	 * @return 消息设置设置明细集合
	 * @throws Throwable
	 */
	public MessageSetDtlMap getMessageSetDtlMap() throws Throwable {
		if (messageSetDtlMap == null) {
			messageSetDtlMap = new MessageSetDtlMap(getContext(), this);
			Long oid = getOID();
			if (oid > 0) {
				String dtlSql = "select * from OA_MessageSet_D where OID>0 and SOID=? order by Sequence";
				DataTable dtlDt = getContext().getContext().getDBManager().execPrepareQuery(dtlSql, oid);
				messageSetDtlMap.loadData(dtlDt);
			}
		}
		return messageSetDtlMap;
	}

	/**
	 * 消息设置设置明细集合
	 * 
	 * @param messageSetDtlMap
	 *            消息设置设置明细集合
	 */
	public void setMessageSetDtlMap(MessageSetDtlMap messageSetDtlMap) {
		this.messageSetDtlMap = messageSetDtlMap;
	}

	/**
	 * 构造消息设置对象
	 * 
	 * @param context
	 *            上下文对象
	 */
	public MessageSet(OAContext context) {
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
		setOID(dt.getLong("OID"));
		setCode(dt.getString("Code"));
		setName(dt.getString("Name"));
		setIsDefault(dt.getInt("IsDefault"));
	}

	/**
	 * 载入数据
	 * 
	 * @param headDt
	 *            头表数据集
	 * @param DtlDt
	 *            明细数据集
	 * @throws Throwable
	 */
	public void loadData(DataTable headDt, DataTable dtlDt) throws Throwable {
		loadData(headDt);
		getMessageSetDtlMap().loadData(dtlDt);
	}
}
