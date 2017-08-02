package com.bokesoft.oa.mid.wf.base;

import com.bokesoft.oa.base.DtlBase;
import com.bokesoft.oa.base.OAContext;
import com.bokesoft.yigo.struct.datatable.DataTable;

/**
 * 直接人员明细
 * 
 * @author zhoukaihe
 *
 */
public class DirectEmployee extends DtlBase<SelRule> {

	/**
	 * 直接人员
	 */
	private Long operator;

	/**
	 * 直接人员
	 * 
	 * @return 直接人员
	 */
	public Long getOperator() {
		return operator;
	}

	/**
	 * 直接人员
	 * 
	 * @param operator
	 *            直接人员
	 */
	public void setOperator(Long operator) {
		this.operator = operator;
	}

	/**
	 * 构造直接人员明细对象
	 * 
	 * @param context
	 *            OA上下文
	 * @param selRule
	 *            选择规则
	 */
	public DirectEmployee(OAContext context, SelRule selRule) {
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
		super.loadData(dt);
		setOperator(dt.getLong("DirectEmpID"));
	}
}
