package com.bokesoft.oa.mid.wf.base;

import com.bokesoft.oa.base.BaseMap;
import com.bokesoft.oa.base.OAContext;
import com.bokesoft.yigo.mid.connection.IDBManager;
import com.bokesoft.yigo.struct.datatable.DataTable;

/**
 * 人员来源集合
 * 
 * @author zhoukaihe
 *
 */
public class EmployeeSourceMap extends BaseMap<Long, EmployeeSource> {
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	/**
	 * 构造人员来源集合对象
	 * 
	 * @param context
	 *            OA上下文对象
	 */
	public EmployeeSourceMap(OAContext context) {
		super(context);
	}

	/**
	 * 获得人员来源对象
	 * 
	 * @param oid
	 *            人员来源对象标识
	 * @return 流程定义对象
	 * @throws Throwable
	 */
	public EmployeeSource get(Long oid) throws Throwable {
		EmployeeSource obj = super.get(oid);
		if (obj == null) {
			String headSql = "select * from OA_EmployeeSource_H where OID>0 and oid=?";
			IDBManager dbm = getContext().getContext().getDBManager();
			DataTable headDt = dbm.execPrepareQuery(headSql, oid);
			headDt.beforeFirst();
			while (headDt.next()) {
				obj = new EmployeeSource(getContext());
				obj.loadData(headDt);
				super.put(oid, obj);
			}
		}
		return obj;
	}
}
