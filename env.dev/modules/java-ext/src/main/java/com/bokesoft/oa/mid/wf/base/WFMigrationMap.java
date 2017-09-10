package com.bokesoft.oa.mid.wf.base;

import com.bokesoft.oa.base.BaseMap;
import com.bokesoft.oa.base.OAContext;
import com.bokesoft.yigo.mid.connection.IDBManager;
import com.bokesoft.yigo.struct.datatable.DataTable;

/**
 * 流程迁移集合
 * 
 * @author chenbiao
 *
 */
public class WFMigrationMap extends BaseMap<Long, WFMigration> {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	/**
	 * 构造流程迁移集合对象
	 * 
	 * @param context
	 *            OA上下文
	 * @param workitemInf
	 *            工作项信息
	 */
	public WFMigrationMap(OAContext context) {
		super(context);
	}

	/**
	 * 载入数据
	 * 
	 * @param dt
	 *            明细数据集
	 * @throws Throwable
	 */
	public void loadData(DataTable dt) throws Throwable {
		dt.beforeFirst();
		while (dt.next()) {
			WFMigration dtl = new WFMigration(getContext());
			dtl.loadData(dt);
			put(dtl.getOID(), dtl);
		}
	}

	/**
	 * 获得流程迁移
	 * 
	 * @param billOID
	 *            流程迁移单据ID
	 * @return 流程迁移
	 * @throws Throwable
	 */
	public WFMigration get(Long billOID) throws Throwable {
		WFMigration obj = super.get(billOID);
		if (obj == null) {
			OAContext context = getContext();
			IDBManager dbm = context.getContext().getDBManager();
			String dtlSql = "select * from bpm_migration where BillOID=?";
			DataTable dtlDt = dbm.execPrepareQuery(dtlSql, billOID);
			if (dtlDt.size() > 0) {
				obj = new WFMigration(context);
				obj.loadData(dtlDt);
				super.put(billOID, obj);
			}
		}
		return obj;
	}
}
