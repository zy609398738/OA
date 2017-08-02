package com.bokesoft.oa.mid.wf.base;

import com.bokesoft.oa.base.BaseMap;
import com.bokesoft.oa.base.OAContext;
import com.bokesoft.yigo.mid.connection.IDBManager;
import com.bokesoft.yigo.struct.datatable.DataTable;

/**
 * 选择规则集合
 * 
 * @author zhoukaihe
 *
 */
public class SelRuleMap extends BaseMap<Long, SelRule> {
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	/**
	 * 构造选择规则集合
	 * 
	 * @param context
	 *            OA上下文
	 */
	public SelRuleMap(OAContext context) {
		super(context);
	}

	/**
	 * 获得选择规则
	 * 
	 * @param oid
	 *            选择规则ID
	 * @return 选择规则
	 * @throws Throwable
	 */
	public SelRule get(Long oid) throws Throwable {
		if (oid <= 0) {
			return null;
		}
		SelRule obj = super.get(oid);
		if (obj == null) {
			String headSql = "select * from OA_SelRule_H where OID>0 and oid=?";
			IDBManager dbm = getContext().getContext().getDBManager();
			DataTable headDt = dbm.execPrepareQuery(headSql, oid);
			headDt.beforeFirst();
			while (headDt.next()) {
				obj = new SelRule(getContext());
				obj.loadData(headDt);
				super.put(oid, obj);
			}
		}
		return obj;
	}
}
