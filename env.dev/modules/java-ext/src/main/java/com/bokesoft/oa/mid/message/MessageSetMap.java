package com.bokesoft.oa.mid.message;

import com.bokesoft.oa.base.BaseMap;
import com.bokesoft.oa.base.OAContext;
import com.bokesoft.yigo.mid.connection.IDBManager;
import com.bokesoft.yigo.struct.datatable.DataTable;

/**
 * 消息设置集合
 * 
 * @author minjian
 *
 */
public class MessageSetMap extends BaseMap<Long, MessageSet> {
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	/**
	 * 构造消息设置集合对象
	 * 
	 * @param context
	 *            OA上下文
	 */
	public MessageSetMap(OAContext context) {
		super(context);
	}

	/**
	 * 获得消息设置
	 * 
	 * @param oid
	 *            消息设置标识
	 * @return 消息设置
	 * @throws Throwable
	 */
	public MessageSet get(Long oid) throws Throwable {
		if (oid <= 0) {
			return null;
		}
		MessageSet obj = super.get(oid);
		if (obj == null) {
			String headSql = "select * from OA_MessageSet_H where OID>0 and OID=?";
			IDBManager dbm = getContext().getContext().getDBManager();
			DataTable headDt = dbm.execPrepareQuery(headSql, oid);
			headDt.beforeFirst();
			while (headDt.next()) {
				obj = new MessageSet(getContext());
				obj.loadData(headDt);
				super.put(oid, obj);
			}
		}
		return obj;
	}
}
