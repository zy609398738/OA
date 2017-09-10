package com.bokesoft.oa.mid.wf.base;

import com.bokesoft.oa.base.HeadBase;
import com.bokesoft.oa.base.OAContext;
import com.bokesoft.yes.common.util.StringUtil;
import com.bokesoft.yigo.common.util.TypeConvertor;
import com.bokesoft.yigo.struct.datatable.DataTable;

/**
 * 下一步参与者
 * 
 * @author zhoukaihe
 *
 */
public class NextParticipator extends HeadBase {
	/**
	 * 流程单据Key
	 */
	private String workflowBillKey;

	/**
	 * 流程单据Key
	 * 
	 * @return 流程单据Key
	 */
	public String getWorkflowBillKey() {
		return workflowBillKey;
	}

	/**
	 * 流程单据Key
	 * 
	 * @param workflowBillKey
	 *            流程单据Key
	 */
	public void setWorkflowBillKey(String workflowBillKey) {
		this.workflowBillKey = workflowBillKey;
	}

	/**
	 * 流程Key
	 */
	private String WorkflowKey;

	/**
	 * 流程Key
	 * 
	 * @return 流程Key
	 */
	public String getWorkflowKey() {
		return WorkflowKey;
	}

	/**
	 * 流程Key
	 * 
	 * @param workflowKey
	 *            流程Key
	 */
	public void setWorkflowKey(String workflowKey) {
		WorkflowKey = workflowKey;
	}

	/**
	 * 流程节点
	 */
	private String node;

	/**
	 * 流程节点
	 * 
	 * @return 流程节点
	 */
	public String getNode() {
		return node;
	}

	/**
	 * 流程节点
	 * 
	 * @param node
	 *            流程节点
	 */
	public void setNode(String node) {
		this.node = node;
	}

	/**
	 * 工作项标识
	 */
	private long workitemID;

	/**
	 * 工作项标识
	 * 
	 * @return 工作项标识
	 */
	public long getWorkitemID() {
		return workitemID;
	}

	/**
	 * 工作项标识
	 * 
	 * @param workitemID
	 *            工作项标识
	 */
	public void setWorkitemID(long workitemID) {
		this.workitemID = workitemID;
	}

	/**
	 * 流程单据ID
	 */
	private Long WorkflowOID;

	/**
	 * 流程单据ID
	 * 
	 * @return 流程单据ID
	 */
	public Long getWorkflowOID() {
		return WorkflowOID;
	}

	/**
	 * 流程单据ID
	 * 
	 * @param workflowOID
	 *            流程单据ID
	 */
	public void setWorkflowOID(Long workflowOID) {
		WorkflowOID = workflowOID;
	}

	/**
	 * 操作员ID
	 */
	private Long operatorID;

	/**
	 * 操作员ID
	 * 
	 * @return 操作员ID
	 */
	public Long getOperatorID() {
		return operatorID;
	}

	/**
	 * 操作员ID
	 * 
	 * @param operatorID
	 *            操作员ID
	 */
	public void setOperatorID(Long operatorID) {
		this.operatorID = operatorID;
	}

	/**
	 * 操作员
	 */
	private Operator operator;

	/**
	 * 操作员
	 * 
	 * @return 操作员
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
	 * 操作员
	 * 
	 * @param operator
	 *            操作员
	 */
	public void setOperator(Operator operator) {
		this.operator = operator;
		setOperatorID(operator.getOID());
	}

	/**
	 * 参与者ID
	 */
	private Long participatorID;

	/**
	 * 参与者ID
	 * 
	 * @return 参与者ID
	 */
	public Long getParticipatorID() {
		return participatorID;
	}

	/**
	 * 参与者ID
	 * 
	 * @param participatorID
	 *            参与者ID
	 */
	public void setParticipatorID(Long participatorID) {
		this.participatorID = participatorID;
	}

	/**
	 * 参与者
	 */
	private Operator participator;

	/**
	 * 参与者
	 * 
	 * @return 参与者
	 * @throws Throwable
	 */
	public Operator getParticipator() throws Throwable {
		if (participator == null) {
			if (participatorID > 0) {
				participator = getContext().getOperatorMap().get(participatorID);
			}
		}
		return participator;
	}

	/**
	 * 参与者
	 * 
	 * @param participator
	 *            参与者
	 */
	public void setParticipator(Operator participator) {
		this.participator = participator;
	}

	/**
	 * 构造操作员对象
	 * 
	 * @param context
	 *            OA上下文
	 */
	public NextParticipator(OAContext context) {
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
		setOperatorID(dt.getLong("OperatorID"));
		setParticipatorID(dt.getLong("ParticipatorID"));
		setWorkflowBillKey(dt.getString("WorkflowBillKey"));
		setWorkflowOID(dt.getLong("WorkflowOID"));
		setWorkflowKey(dt.getString("WorkflowKey"));
		setNode(TypeConvertor.toString(dt.getLong("NodeID")));
	}

	/**
	 * 获得下一步参与者选择的Key
	 * 
	 * @return 下一步参与者选择的Key
	 */
	public String getSelectKey() {
		return getSelectKey(getWorkflowBillKey(), getWorkflowOID(), getWorkflowKey(), getWorkitemID());
	}

	/**
	 * 获得下一步参与者选择的Key
	 * 
	 * @param workflowBillKey
	 *            流程单据Key
	 * @param workflowOID
	 *            流程单据ID
	 * @param workflowKey
	 *            流程Key
	 * @param nodeId
	 *            流程节点
	 * @return 操作员选择的Key
	 */
	public static String getSelectKey(String workflowBillKey, Long workflowOID, String workflowKey, Long workitemID) {
		StringBuffer sb = new StringBuffer();
		sb.append(workflowBillKey);
		sb.append(":");
		sb.append(workflowOID);
		sb.append(":");
		sb.append(workflowKey);
		sb.append(":");
		sb.append(workitemID);
		String key = sb.toString();
		return key;
	}

	/**
	 * 获得下一步参与者选择的Sql查询条件
	 * 
	 * @param workflowBillKey
	 *            流程单据Key
	 * @param workflowOID
	 *            流程单据ID
	 * @param workflowKey
	 *            流程Key
	 * @param nodeId
	 *            流程节点
	 * @return 下一步参与者选择的Sql查询条件
	 */
	public static String getSqlWhere(String workflowBillKey, Long workflowOID, String workflowKey, Long workitemID) {
		StringBuffer sb = new StringBuffer();
		if (!StringUtil.isBlankOrNull(workflowBillKey)) {
			sb.append(" and WorkflowBillKey='");
			sb.append(workflowBillKey);
			sb.append("'");
		}
		if (workflowOID > 0) {
			sb.append(" and WorkflowOID=");
			sb.append(workflowOID);
		}
		if (!StringUtil.isBlankOrNull(workflowKey)) {
			sb.append(" and WorkflowKey='");
			sb.append(workflowKey);
			sb.append("'");
		}
		if (workitemID > 0) {
			sb.append(" and WorkitemID=");
			sb.append(workitemID);
		}
		String key = sb.toString();
		if (!StringUtil.isBlankOrNull(key)) {
			key = key.substring(4);
		}
		return key;
	}

	/**
	 * 重载
	 */
	public String toString() {
		String str = "";
		try {
			str = "，操作员：" + getOperator() + "，参与者：" + getParticipator();
		} catch (Throwable e) {
			e.printStackTrace();
		}
		return super.toString() + str + "，流程单据Key：" + getWorkflowBillKey() + "，流程单据ID：" + getWorkflowOID() + "，流程Key："
				+ getWorkflowKey() + ",流程节点：" + getNode();
	}
}
