package com.bokesoft.oa.mid.wf.base;

import com.bokesoft.oa.base.BaseMap;
import com.bokesoft.oa.base.OAContext;
import com.bokesoft.yigo.mid.connection.IDBManager;
import com.bokesoft.yigo.struct.datatable.DataTable;

/**
 * 流程类别集合
 * 
 * @author zhoukaihe
 *
 */
public class WorkflowTypeMap extends BaseMap<Long, WorkflowType> {
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	/**
	 * 构造流程类别集合对象
	 * 
	 * @param context
	 *            OA上下文对象
	 */
	public WorkflowTypeMap(OAContext context) {
		super(context);
	}

	/**
	 * 获得流程类别对象
	 * 
	 * @param oid
	 *            流程类别对象标识
	 * @return 流程类别对象
	 * @throws Throwable
	 */
	public WorkflowType get(Long oid) throws Throwable {
		if (oid <= 0) {
			return null;
		}
		WorkflowType obj = super.get(oid);
		if (obj == null) {
			String headSql = "select * from OA_WorkflowType_H where OID>0 and OID=?";
			IDBManager dbm = getContext().getContext().getDBManager();
			DataTable headDt = dbm.execPrepareQuery(headSql, oid);
			headDt.beforeFirst();
			while (headDt.next()) {
				obj = new WorkflowType(getContext());
				obj.loadData(headDt);
				super.put(oid, obj);
			}
		}
		return obj;
	}
}
