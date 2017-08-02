package com.bokesoft.oa.mid.wf.base;

import com.bokesoft.oa.base.BaseMap;
import com.bokesoft.oa.base.OAContext;
import com.bokesoft.yigo.mid.connection.IDBManager;
import com.bokesoft.yigo.struct.datatable.DataTable;

/**
 * 工时区间集合
 * 
 * @author minjian
 *
 */
public class WorkingTimeMap extends BaseMap<Long, WorkingTime> {
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	/**
	 * 构造工时区间集合对象
	 * 
	 * @param context
	 *            OA上下文
	 */
	public WorkingTimeMap(OAContext context) {
		super(context);
	}

	/**
	 * 获得工时区间
	 * 
	 * @param oid
	 *            工时区间标识
	 * @return 工时区间
	 * @throws Throwable
	 */
	public WorkingTime get(Long oid) throws Throwable {
		if (oid <= 0) {
			return null;
		}
		WorkingTime obj = super.get(oid);
		if (obj == null) {
			String headSql = "select * from OA_WorkingTime_H where OID>0 and oid=?";
			IDBManager dbm = getContext().getContext().getDBManager();
			DataTable headDt = dbm.execPrepareQuery(headSql, oid);
			headDt.beforeFirst();
			while (headDt.next()) {
				obj = new WorkingTime(getContext());
				obj.loadData(headDt);
				super.put(oid, obj);
			}
		}
		return obj;
	}
}
