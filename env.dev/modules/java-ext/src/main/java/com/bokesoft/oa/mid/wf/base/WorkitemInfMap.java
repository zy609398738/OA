package com.bokesoft.oa.mid.wf.base;

import com.bokesoft.oa.base.DtlBaseMap;
import com.bokesoft.oa.base.OAContext;
import com.bokesoft.yigo.mid.connection.IDBManager;
import com.bokesoft.yigo.struct.datatable.DataTable;

/**
 * 工作项信息集合
 * 
 * @author zhoukaihe
 *
 */
public class WorkitemInfMap extends DtlBaseMap<Long, WorkitemInf, BPMInstance> {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	/**
	 * 构造工作项信息集合对象
	 * 
	 * @param context
	 *            OA上下文
	 * @param bPMInstance
	 *            流程实例
	 */
	public WorkitemInfMap(OAContext context, BPMInstance bPMInstance) {
		super(context, bPMInstance);
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
			WorkitemInf dtl = new WorkitemInf(getContext(), getHeadBase());
			dtl.loadData(dt);
			put(dtl.getOID(), dtl);
		}
	}

	/**
	 * 获得工作项信息
	 * 
	 * @param oid
	 *            工作项信息标识
	 * @return 工作项信息
	 * @throws Throwable
	 */
	public WorkitemInf get(Long oid) throws Throwable {
		if (oid == null || oid <= 0) {
			return null;
		}
		WorkitemInf obj = super.get(oid);
		if (obj == null) {
			OAContext context = getContext();
			IDBManager dbm = context.getContext().getDBManager();
			String dtlSql = "select * from bpm_workiteminfo where WorkItemID>0 and WorkItemID=?";
			DataTable dtlDt = dbm.execPrepareQuery(dtlSql, oid);
			if (dtlDt.size() > 0) {
				obj = new WorkitemInf(context, getHeadBase());
				obj.loadData(dtlDt);
				super.put(oid, obj);
			}
		}
		return obj;
	}
}
