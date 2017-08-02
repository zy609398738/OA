package com.bokesoft.oa.mid.wf.base;

import com.bokesoft.oa.base.BaseMap;
import com.bokesoft.oa.base.OAContext;
import com.bokesoft.yigo.mid.connection.IDBManager;
import com.bokesoft.yigo.struct.datatable.DataTable;

/**
 * 职务集合
 * 
 * @author zhoukaihe
 *
 */
public class DutyMap extends BaseMap<Long, Duty> {
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	/**
	 * 构造职务集合对象
	 * 
	 * @param context
	 *            OA上下文
	 */
	public DutyMap(OAContext context) {
		super(context);
	}

	/**
	 * 获得职务
	 * 
	 * @param oid
	 *            职务标识
	 * @return 职务
	 * @throws Throwable
	 */
	public Duty get(Long oid) throws Throwable {
		if (oid <= 0) {
			return null;
		}
		Duty obj = super.get(oid);
		if (obj == null) {
			String headSql = "select * from OA_Duty_H where OID>0 and oid=?";
			IDBManager dbm = getContext().getContext().getDBManager();
			DataTable headDt = dbm.execPrepareQuery(headSql, oid);
			headDt.beforeFirst();
			while (headDt.next()) {
				obj = new Duty(getContext());
				obj.loadData(headDt);
				super.put(oid, obj);
			}
		}
		return obj;
	}
}
