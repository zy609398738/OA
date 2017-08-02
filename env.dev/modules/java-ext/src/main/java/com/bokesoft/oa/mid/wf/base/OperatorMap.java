package com.bokesoft.oa.mid.wf.base;

import com.bokesoft.oa.base.BaseMap;
import com.bokesoft.oa.base.OAContext;
import com.bokesoft.yigo.mid.connection.IDBManager;
import com.bokesoft.yigo.struct.datatable.DataTable;

/**
 * 操作员集合
 * 
 * @author zhoukaihe
 *
 */
public class OperatorMap extends BaseMap<Long, Operator> {
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	/**
	 * 构造操作员集合
	 * 
	 * @param context
	 *            OA上下文
	 */
	public OperatorMap(OAContext context) {
		super(context);
	}

	/**
	 * 操作员
	 * 
	 * @param oid
	 * @return
	 * @throws Throwable
	 */
	public Operator get(Long oid) throws Throwable {
		if (oid <= 0) {
			return null;
		}
		Operator obj = super.get(oid);
		if (obj == null) {
			String headSql = "select * from SYS_Operator where OID>0 and oid=?";
			IDBManager dbm = getContext().getContext().getDBManager();
			DataTable headDt = dbm.execPrepareQuery(headSql, oid);
			headDt.beforeFirst();
			while (headDt.next()) {
				obj = new Operator(getContext());
				obj.loadData(headDt);
				super.put(oid, obj);
			}
		}
		return obj;
	}
}
