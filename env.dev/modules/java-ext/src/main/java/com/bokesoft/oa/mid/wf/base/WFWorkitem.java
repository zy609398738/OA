package com.bokesoft.oa.mid.wf.base;

import com.bokesoft.oa.base.DtlBase;
import com.bokesoft.oa.base.OAContext;
import com.bokesoft.yigo.struct.datatable.DataTable;

/**
 * 流程工作项
 * 
 * @author minjian
 *
 */
public class WFWorkitem extends DtlBase<WorkitemInf> {
	/**
	 * 工作项名称
	 */
	private String workitemName;

	/**
	 * 工作项名称
	 * 
	 * @return 工作项名称
	 */
	public String getWorkitemName() {
		return workitemName;
	}

	/**
	 * 工作项名称
	 * 
	 * @param workitemName
	 *            工作项名称
	 */
	public void setWorkitemName(String workitemName) {
		this.workitemName = workitemName;
	}

	/**
	 * 审批意见
	 */
	private String userInfo;

	/**
	 * 审批意见
	 * 
	 * @return 审批意见
	 */
	public String getUserInfo() {
		return userInfo;
	}

	/**
	 * 审批意见
	 * 
	 * @param userInfo
	 *            审批意见
	 */
	public void setUserInfo(String userInfo) {
		this.userInfo = userInfo;
	}

	/**
	 * 工作项提交人ID
	 */
	private long operatorID;

	/**
	 * 工作项提交人ID
	 * 
	 * @return 工作项提交人ID
	 */
	public long getOperatorID() {
		return operatorID;
	}

	/**
	 * 工作项提交人ID
	 * 
	 * @param operatorID
	 *            工作项提交人ID
	 */
	public void setOperatorID(long operatorID) {
		this.operatorID = operatorID;
	}

	/**
	 * 工作项提交人
	 */
	private Operator operator;

	/**
	 * 工作项提交人
	 * 
	 * @return 工作项提交人
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
	 * 工作项提交人
	 * 
	 * @param operator
	 *           工作项提交人
	 */
	public void setOperator(Operator operator) {
		this.operator = operator;
		setOperatorID(operator.getOID());
	}
	
	/**
	 * 构造流程工作项对象
	 * 
	 * @param context
	 *            OA上下文
	 * @param workitemInf
	 *            工作项信息
	 */
	public WFWorkitem(OAContext context, WorkitemInf workitemInf) {
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
		setOID(dt.getLong("WorkitemID"));
		setWorkitemName(dt.getString("WorkitemName"));
		setUserInfo(dt.getString("UserInfo"));
		setOperatorID(dt.getLong("OperatorID"));
	}
}
