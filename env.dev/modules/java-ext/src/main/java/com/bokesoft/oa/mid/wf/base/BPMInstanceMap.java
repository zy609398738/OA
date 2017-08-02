package com.bokesoft.oa.mid.wf.base;

import com.bokesoft.oa.base.BaseMap;
import com.bokesoft.oa.base.OAContext;
import com.bokesoft.yigo.mid.connection.IDBManager;
import com.bokesoft.yigo.struct.datatable.DataTable;

/**
 * 流程实例集合
 * 
 * @author zhoukaihe
 *
 */
public class BPMInstanceMap extends BaseMap<Long, BPMInstance> {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	/**
	 * 构造流程实例集合对象
	 * 
	 * @param context
	 *            OA上下文
	 */
	public BPMInstanceMap(OAContext context) {
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
			BPMInstance dtl = new BPMInstance(getContext());
			dtl.loadData(dt);
			put(dtl.getOID(), dtl);
		}
	}

	/**
	 * 获得流程实例
	 * 
	 * @param oid
	 *            流程实例标识
	 * @return 流程实例
	 * @throws Throwable
	 */
	public BPMInstance get(Long oid) throws Throwable {
		BPMInstance obj = super.get(oid);
		if (obj == null) {
			OAContext context = getContext();
			IDBManager dbm = context.getContext().getDBManager();
			String dtlSql = "select * from bpm_instance where InstanceID=? and InstanceID>0";
			DataTable dtlDt = dbm.execPrepareQuery(dtlSql, oid);
			if (dtlDt.size() > 0) {
				obj = new BPMInstance(context);
				obj.loadData(dtlDt);
				super.put(oid, obj);
			}
		}
		return obj;
	}
}
