package com.bokesoft.oa.mid.wf.base;

import com.bokesoft.oa.base.BillBase;
import com.bokesoft.oa.base.OAContext;
import com.bokesoft.yes.common.util.StringUtil;
import com.bokesoft.yigo.struct.datatable.DataTable;

/**
 * 流程设置
 * 
 * @author minjian
 *
 */
public class WorkflowSet extends BillBase {
	/**
	 * 流程标识
	 */
	private String workflowKey;

	/**
	 * 流程标识
	 * 
	 * @return 流程标识
	 */
	public String getWorkflowKey() {
		return workflowKey;
	}

	/**
	 * 流程标识
	 * 
	 * @param workflowKey
	 *            流程标识
	 */
	public void setWorkflowKey(String workflowKey) {
		this.workflowKey = workflowKey;
	}

	/**
	 * 流程名称
	 */
	private String workflowName;

	/**
	 * 流程名称
	 * 
	 * @return 流程名称
	 */
	public String getWorkflowName() {
		return workflowName;
	}

	/**
	 * 流程名称
	 * 
	 * @param workflowName
	 *            流程名称
	 */
	public void setWorkflowName(String workflowName) {
		this.workflowName = workflowName;
	}

	/**
	 * 流程版本
	 */
	private Integer workflowVersion;

	/**
	 * 流程版本
	 * 
	 * @return 流程版本
	 */
	public Integer getWorkflowVersion() {
		return workflowVersion;
	}

	/**
	 * 流程版本
	 * 
	 * @param workflowVersion
	 *            流程版本
	 */
	public void setWorkflowVersion(Integer workflowVersion) {
		this.workflowVersion = workflowVersion;
	}

	/**
	 * 流程状态
	 */
	private Integer workflowState;

	/**
	 * 流程状态
	 * 
	 * @return 流程状态
	 */
	public Integer getWorkflowState() {
		return workflowState;
	}

	/**
	 * 流程状态
	 * 
	 * @param workflowState
	 *            流程状态
	 */
	public void setWorkflowState(Integer workflowState) {
		this.workflowState = workflowState;
	}

	/**
	 * 构造流程设置对象
	 * 
	 * @param context
	 *            OA上下文对象
	 */
	public WorkflowSet(OAContext context) {
		super(context);
	}

	/**
	 * 载入数据
	 * 
	 * @param dt
	 *            头表数据集
	 * @throws Throwable
	 */
	public void loadData(DataTable dt) throws Throwable {
		super.loadData(dt);
		setWorkflowKey(dt.getString("WorkflowKey"));
		setWorkflowName(dt.getString("WorkflowName"));
		setWorkflowVersion(dt.getInt("WorkflowVersion"));
		setWorkflowState(dt.getInt("WorkflowState"));
	}

	/**
	 * 获得流程设置的Key
	 * 
	 * @return 流程设置的Key
	 */
	public String getSelectKey() {
		return getSelectKey(getWorkflowKey(), getWorkflowName(), getWorkflowVersion(), getWorkflowState());
	}

	/**
	 * 获得流程设置的Key
	 * 
	 * @param workflowKey
	 *            流程标识
	 * @param workflowName
	 *            流程名称
	 * @param workflowVersion
	 *            流程版本
	 * @param workflowState
	 *            流程状态
	 * @return 流程设置的Key
	 */
	public static String getSelectKey(String workflowKey, String workflowName, Integer workflowVersion,
			Integer workflowState) {
		StringBuffer sb = new StringBuffer();
		sb.append(workflowKey);
		sb.append(":");
		sb.append(workflowName);
		sb.append(":");
		sb.append(workflowVersion);
		sb.append(":");
		sb.append(workflowState);
		sb.append(":");
		String key = sb.toString();
		return key;
	}

	/**
	 * 获得流程设置的Sql查询条件
	 * 
	 * @param workflowKey
	 *            流程标识
	 * @param workflowName
	 *            流程名称
	 * @param workflowVersion
	 *            流程版本
	 * @param workflowState
	 *            流程状态
	 * @return 流程设置的Sql查询条件
	 */
	public static String getSqlWhere(String workflowKey, String workflowName, Integer workflowVersion,
			Integer workflowState) {
		StringBuffer sb = new StringBuffer();
		if (!StringUtil.isBlankOrNull(workflowKey)) {
			sb.append(" and WorkflowKey='");
			sb.append(workflowKey);
			sb.append("'");
		}
		if (!StringUtil.isBlankOrNull(workflowName)) {
			sb.append(" and WorkflowName='");
			sb.append(workflowName);
			sb.append("'");
		}
		if (workflowVersion > 0) {
			sb.append(" and WorkflowVersion=");
			sb.append(workflowVersion);
		}
		if (workflowState > 0) {
			sb.append(" and WorkflowState=");
			sb.append(workflowState);
		}
		String key = sb.toString();
		if (!StringUtil.isBlankOrNull(key)) {
			key = key.substring(4);
		}
		return key;
	}

	/**
	 * 获得流程设置的Key
	 * 
	 * @param headDt
	 *            数据集
	 * @return 流程设置的Key
	 */
	public static String getDesigneKey(DataTable headDt) {
		return getSelectKey(headDt.getString("WorkflowKey"), headDt.getString("WorkflowName"),
				headDt.getInt("WorkflowVersion"), headDt.getInt("WorkflowState"));
	}

	/**
	 * 重载
	 */
	public String toString() {
		return super.toString() + "，流程标识：" + getWorkflowKey() + "，流程名称：" + getWorkflowName() + "，流程版本："
				+ getWorkflowVersion() + "，流程状态：" + getWorkflowState();
	}
}
