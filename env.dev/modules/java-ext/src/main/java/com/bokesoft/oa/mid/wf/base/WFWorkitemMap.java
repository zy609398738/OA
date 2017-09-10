package com.bokesoft.oa.mid.wf.base;

import com.bokesoft.oa.base.DtlBaseMap;
import com.bokesoft.oa.base.OAContext;
import com.bokesoft.yigo.mid.connection.IDBManager;
import com.bokesoft.yigo.struct.datatable.DataTable;

/**
 * 流程工作项集合
 * 
 * @author minjian
 *
 */
public class WFWorkitemMap extends DtlBaseMap<Long, WFWorkitem, WorkitemInf> {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	/**
	 * 构造流程工作项集合对象
	 * 
	 * @param context
	 *            OA上下文
	 * @param workitemInf
	 *            工作项信息
	 */
	public WFWorkitemMap(OAContext context, WorkitemInf workitemInf) {
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
			WFWorkitem dtl = new WFWorkitem(getContext(), getHeadBase());
			dtl.loadData(dt);
			put(dtl.getOID(), dtl);
		}
	}

	/**
	 * 获得流程工作项
	 * 
	 * @param oid
	 *            流程工作项标识
	 * @return 流程工作项
	 * @throws Throwable
	 */
	public WFWorkitem get(Long oid) throws Throwable {
		WFWorkitem obj = super.get(oid);
		if (obj == null) {
			OAContext context = getContext();
			IDBManager dbm = context.getContext().getDBManager();
			String dtlSql = "select * from WF_Workitem where WorkitemID=? and WorkitemID>0";
			DataTable dtlDt = dbm.execPrepareQuery(dtlSql, oid);
			if (dtlDt.size() > 0) {
				obj = new WFWorkitem(context, getHeadBase());
				obj.loadData(dtlDt);
				super.put(oid, obj);
			}
		}
		return obj;
	}
}
