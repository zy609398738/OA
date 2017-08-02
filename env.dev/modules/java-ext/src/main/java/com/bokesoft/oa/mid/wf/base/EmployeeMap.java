package com.bokesoft.oa.mid.wf.base;

import com.bokesoft.oa.base.BaseMap;
import com.bokesoft.oa.base.OAContext;
import com.bokesoft.yigo.mid.connection.IDBManager;
import com.bokesoft.yigo.struct.datatable.DataTable;

/**
 * 人员集合
 * 
 * @author zhoukaihe
 *
 */
public class EmployeeMap extends BaseMap<Long, Employee> {
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	/**
	 * 构造人员集合对象
	 * 
	 * @param context
	 *            OA上下文
	 */
	public EmployeeMap(OAContext context) {
		super(context);
	}

	/**
	 * 获得业务来源集合
	 * 
	 * @param oid
	 *            业务来源集合标识
	 * @return 业务来源集合
	 * @throws Throwable
	 */
	public Employee get(Long oid) throws Throwable {
		if (oid <= 0) {
			return null;
		}
		Employee obj = super.get(oid);
		if (obj == null) {
			String headSql = "select * from OA_Employee_H where OID>0 and OID=?";
			IDBManager dbm = getContext().getContext().getDBManager();
			DataTable headDt = dbm.execPrepareQuery(headSql, oid);
			headDt.beforeFirst();
			while (headDt.next()) {
				obj = new Employee(getContext());
				obj.loadData(headDt);
				super.put(oid, obj);
			}
		}
		return obj;
	}
}
