package com.bokesoft.oa.mid.wf.base;

import com.bokesoft.oa.base.BaseMap;
import com.bokesoft.oa.base.OAContext;
import com.bokesoft.yigo.mid.connection.IDBManager;
import com.bokesoft.yigo.struct.datatable.DataTable;

/**
 * 业务来源集合
 * 
 * @author zhoukaihe
 *
 */
public class BusinessSourceMap extends BaseMap<Long, BusinessSource> {
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	/**
	 * 构造业务来源集合集合对象
	 * 
	 * @param context
	 *            OA上下文对象
	 */
	public BusinessSourceMap(OAContext context) {
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
	public BusinessSource get(Long oid) throws Throwable {
		if (oid <= 0) {
			return null;
		}
		BusinessSource obj = super.get(oid);
		if (obj == null) {
			String headSql = "select * from OA_BusinessSource_H where OID>0 and oid=?";
			IDBManager dbm = getContext().getContext().getDBManager();
			DataTable headDt = dbm.execPrepareQuery(headSql, oid);
			headDt.beforeFirst();
			while (headDt.next()) {
				obj = new BusinessSource(getContext());
				obj.loadData(headDt);
				super.put(oid, obj);
			}
		}
		return obj;
	}
}
