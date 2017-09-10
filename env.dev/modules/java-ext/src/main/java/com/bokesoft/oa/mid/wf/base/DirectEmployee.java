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
	 * 直接人员ID
	 */
	private Long operatorID;

	/**
	 * 直接人员ID
	 * 
	 * @return 直接人员ID
	 */
	public Long getOperatorID() {
		return operatorID;
	}

	/**
	 * 直接人员ID
	 * 
	 * @param operatorID
	 *            直接人员ID
	 */
	public void setOperatorID(Long operatorID) {
		this.operatorID = operatorID;
	}

	/**
	 * 直接人员
	 */
	private Operator operator;

	/**
	 * 直接人员
	 * 
	 * @return 直接人员
	 * @throws Throwable
	 */
	public Operator getOperator() throws Throwable {
		if (operator == null) {
			if (operatorID > 0) {
				operator = getContext().getOperatorMap().get(operatorID);
			}
		}
		return operator;
	}

	/**
	 * 直接人员
	 * 
	 * @param operator
	 *            直接人员
	 */
	public void setOperator(Operator operator) {
		this.operator = operator;
		setOperatorID(operator.getOID());
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
		setOperatorID(dt.getLong("DirectEmpID"));
	}
}
