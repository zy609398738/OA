package com.bokesoft.oa.mid.wf.base;

import com.bokesoft.oa.base.DtlBaseMap;
import com.bokesoft.oa.base.OAContext;
import com.bokesoft.yigo.struct.datatable.DataTable;

/**
 * 人员明细集合
 * 
 * @author zhoukaihe
 *
 */
public class EmployeeDtlMap extends DtlBaseMap<Long, EmployeeDtl, Employee> {
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	/**
	 * 
	 * @param context
	 *            上下文对象
	 */
	public EmployeeDtlMap(OAContext context, Employee employee) {
		super(context, employee);
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
			EmployeeDtl dtl = new EmployeeDtl(getContext(), getHeadBase());
			dtl.loadData(dt);
			put(dtl.getOID(), dtl);
		}
	}
}
