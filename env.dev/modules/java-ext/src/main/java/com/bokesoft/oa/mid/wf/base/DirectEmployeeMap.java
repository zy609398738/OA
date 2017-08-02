package com.bokesoft.oa.mid.wf.base;

import com.bokesoft.oa.base.DtlBaseMap;
import com.bokesoft.oa.base.OAContext;
import com.bokesoft.yigo.struct.datatable.DataTable;

/**
 * 直接人员明细集合
 * 
 * @author zhoukaihe
 *
 */
public class DirectEmployeeMap extends DtlBaseMap<Long, DirectEmployee, SelRule> {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	/**
	 * 构造直接人员明细集合对象
	 * 
	 * @param context
	 *            OA上下文
	 * @param selRule
	 *            人员选择规则
	 */
	public DirectEmployeeMap(OAContext context, SelRule selRule) {
		super(context, selRule);
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
			DirectEmployee dtl = new DirectEmployee(getContext(), getHeadBase());
			dtl.loadData(dt);
			put(dtl.getOID(), dtl);
		}
	}
}
