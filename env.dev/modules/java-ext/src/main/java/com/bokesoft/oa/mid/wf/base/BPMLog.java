package com.bokesoft.oa.mid.wf.base;

import com.bokesoft.oa.base.DtlBase;
import com.bokesoft.oa.base.OAContext;
import com.bokesoft.yigo.struct.datatable.DataTable;

/**
 * 审批日志
 * 
 * @author minjian
 *
 */
public class BPMLog extends DtlBase<WorkitemInf> {
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
	 * 工作项状态
	 */
	private int workitemstate;

	/**
	 * 工作项状态
	 * 
	 * @return 工作项状态
	 */
	public int getWorkitemstate() {
		return workitemstate;
	}

	/**
	 * 工作项状态
	 * 
	 * @param workitemstate
	 *            工作项状态
	 */
	public void setWorkitemstate(int workitemstate) {
		this.workitemstate = workitemstate;
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
	 * 加签意见
	 */
	private String launchInfo;

	/**
	 * 加签意见
	 * 
	 * @return 加签意见
	 */
	public String getLaunchInfo() {
		return launchInfo;
	}

	/**
	 * 加签意见
	 * 
	 * @param launchInfo
	 *            加签意见
	 */
	public void setLaunchInfo(String launchInfo) {
		this.launchInfo = launchInfo;
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
	 *            工作项提交人
	 */
	public void setOperator(Operator operator) {
		this.operator = operator;
		setOperatorID(operator.getOID());
	}

	/**
	 * 构造审批日志对象
	 * 
	 * @param context
	 *            OA上下文
	 * @param workitemInf
	 *            工作项信息
	 */
	public BPMLog(OAContext context, WorkitemInf workitemInf) {
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
		setLaunchInfo(dt.getString("LaunchInfo"));
		setOperatorID(dt.getLong("OperatorID"));
	}

	/**
	 * 重载，输出标识ID
	 */
	public String toString() {
		String str = "";
		try {
			Operator operator = getOperator();
			if (operator != null) {
				str = "，工作项提交人代码：" + operator.getCode() + "，工作项提交人名称：" + operator.getName();
			}
		} catch (Throwable e) {
			e.printStackTrace();
		}
		return super.toString() + "，工作项名称：" + getWorkitemName() + "，审批意见：" + getUserInfo() + str;
	}
}
