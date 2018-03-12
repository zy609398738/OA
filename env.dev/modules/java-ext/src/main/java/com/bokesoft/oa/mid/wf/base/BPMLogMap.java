package com.bokesoft.oa.mid.wf.base;

import com.bokesoft.oa.base.DtlBaseMap;
import com.bokesoft.oa.base.OAContext;
import com.bokesoft.yigo.mid.connection.IDBManager;
import com.bokesoft.yigo.struct.datatable.DataTable;

/**
 * 审批日志集合
 * 
 * @author minjian
 *
 */
public class BPMLogMap extends DtlBaseMap<Long, BPMLog, WorkitemInf> {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	/**
	 * 构造审批日志集合对象
	 * 
	 * @param context
	 *            OA上下文
	 * @param workitemInf
	 *            工作项信息
	 */
	public BPMLogMap(OAContext context, WorkitemInf workitemInf) {
		super(context, workitemInf);
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
			BPMLog dtl = new BPMLog(getContext(), getHeadBase());
			dtl.loadData(dt);
			put(dtl.getOID(), dtl);
		}
	}

	/**
	 * 获得审批日志
	 * 
	 * @param oid
	 *            审批日志标识
	 * @return 审批日志
	 * @throws Throwable
	 */
	public BPMLog get(Long oid) throws Throwable {
		BPMLog obj = super.get(oid);
		if (obj == null) {
			OAContext context = getContext();
			IDBManager dbm = context.getContext().getDBManager();
			String dtlSql = "select * from BPM_LOG where WorkitemID=? and WorkitemID>0";
			DataTable dtlDt = dbm.execPrepareQuery(dtlSql, oid);
			if (dtlDt.size() > 0) {
				obj = new BPMLog(context, getHeadBase());
				obj.loadData(dtlDt);
				super.put(oid, obj);
			}
		}
		return obj;
	}
}
