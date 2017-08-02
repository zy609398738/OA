package com.bokesoft.oa.mid.wf.base;

import com.bokesoft.oa.base.BaseMap;
import com.bokesoft.oa.base.OAContext;
import com.bokesoft.yigo.mid.connection.IDBManager;
import com.bokesoft.yigo.struct.datatable.DataTable;

/**
 * 部门集合
 * 
 * @author zhoukaihe
 *
 */
public class DepartmentMap extends BaseMap<Long, Department> {
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	/**
	 * 构造部门集合对象
	 * 
	 * @param context
	 *            OA上下文
	 */
	public DepartmentMap(OAContext context) {
		super(context);
	}

	/**
	 * 获得部门
	 * 
	 * @param oid
	 *            部门标识
	 * @return 部门
	 * @throws Throwable
	 */
	public Department get(Long oid) throws Throwable {
		if (oid <= 0) {
			return null;
		}
		Department obj = super.get(oid);
		if (obj == null) {
			String headSql = "select * from OA_Department_H where OID>0 and oid=?";
			IDBManager dbm = getContext().getContext().getDBManager();
			DataTable headDt = dbm.execPrepareQuery(headSql, oid);
			headDt.beforeFirst();
			while (headDt.next()) {
				obj = new Department(getContext());
				obj.loadData(headDt);
				super.put(oid, obj);
			}
		}
		return obj;
	}
}
