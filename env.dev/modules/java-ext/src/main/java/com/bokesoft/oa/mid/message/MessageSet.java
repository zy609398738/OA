package com.bokesoft.oa.mid.message;

import com.bokesoft.oa.base.DicBase;
import com.bokesoft.yigo.mid.base.DefaultContext;
import com.bokesoft.yigo.mid.connection.IDBManager;
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
	private MessageSetDtlMap messageSetDtlMap = new MessageSetDtlMap(getContext());

	/**
	 * 消息设置设置明细集合
	 * 
	 * @return 消息设置设置明细集合
	 */
	public MessageSetDtlMap getMessageSetDtlMap() {
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
	 *            中间层对象
	 */
	public MessageSet(DefaultContext context) {
		super(context);
	}

	/**
	 * 载入数据
	 * 
	 * @param dt
	 *            头表数据集
	 * @throws Throwable
	 */
	public void loadData(Long oid) throws Throwable {
		IDBManager dbm = getContext().getDBManager();
		String headSql = "select * from OA_MessageSet_H where OID=?";
		DataTable headDt = dbm.execPrepareQuery(headSql, oid);
		String dtlSql = "select * from OA_MessageSet_D where SOID=?";
		DataTable dtlDt = dbm.execPrepareQuery(dtlSql, oid);
		loadData(headDt, dtlDt);
	}

	/**
	 * 载入数据
	 * 
	 * @param dt
	 *            头表数据集
	 * @throws Throwable
	 */
	public void loadData(DataTable dt) throws Throwable {
		setOid(dt.getLong("OID"));
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
