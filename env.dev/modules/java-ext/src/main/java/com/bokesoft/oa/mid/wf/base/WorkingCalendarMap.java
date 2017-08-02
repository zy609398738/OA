package com.bokesoft.oa.mid.wf.base;

import com.bokesoft.oa.base.BaseMap;
import com.bokesoft.oa.base.OAContext;
import com.bokesoft.yigo.mid.connection.IDBManager;
import com.bokesoft.yigo.struct.datatable.DataTable;

/**
 * 工作日历集合
 * 
 * @author minjian
 *
 */
public class WorkingCalendarMap extends BaseMap<Long, WorkingCalendar> {
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	/**
	 * 构造工作日历集合集合对象
	 * 
	 * @param context
	 *            OA上下文对象
	 */
	public WorkingCalendarMap(OAContext context) {
		super(context);
	}

	/**
	 * 获得工作日历集合
	 * 
	 * @param oid
	 *            工作日历集合标识
	 * @return 工作日历集合
	 * @throws Throwable
	 */
	public WorkingCalendar get(Long oid) throws Throwable {
		if (oid <= 0) {
			return null;
		}
		WorkingCalendar obj = super.get(oid);
		if (obj == null) {
			String headSql = "select * from OA_WorkingCalendar_H where OID>0 and oid=?";
			IDBManager dbm = getContext().getContext().getDBManager();
			DataTable headDt = dbm.execPrepareQuery(headSql, oid);
			headDt.beforeFirst();
			while (headDt.next()) {
				obj = new WorkingCalendar(getContext());
				obj.loadData(headDt);
				super.put(oid, obj);
			}
		}
		return obj;
	}

	/**
	 * 获得所有工作日历集合
	 * 
	 * @return 工作日历集合
	 * @throws Throwable
	 */
	public WorkingCalendarMap getAll() throws Throwable {
		String headSql = "select * from OA_WorkingCalendar_H where OID>0";
		IDBManager dbm = getContext().getContext().getDBManager();
		DataTable headDt = dbm.execPrepareQuery(headSql);
		headDt.beforeFirst();
		while (headDt.next()) {
			WorkingCalendar obj = new WorkingCalendar(getContext());
			obj.loadData(headDt);
			super.put(obj.getOID(), obj);
		}
		return this;
	}
}
