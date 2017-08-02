package com.bokesoft.oa.mid.wf.base;

import java.util.LinkedHashMap;

import com.bokesoft.oa.base.BillDtlBase;
import com.bokesoft.oa.base.OAContext;
import com.bokesoft.oa.mid.message.MessageSet;
import com.bokesoft.yigo.struct.datatable.DataTable;

/**
 * 流程设计明细
 * 
 * @author zhoukaihe
 *
 */
public class WorkflowDesigneDtl extends BillDtlBase<WorkflowDesigne> {
	/**
	 * 审批节点ID
	 */
	private String auditNode;

	/**
	 * 审批节点ID
	 * 
	 * @return 审批节点ID
	 * @throws Throwable
	 */
	public String getAuditNode() throws Throwable {
		return auditNode;
	}

	/**
	 * 审批节点ID
	 * 
	 * @param auditNode
	 *            审批节点ID
	 */
	public void setAuditNode(String auditNode) {
		this.auditNode = auditNode;
	}

	/**
	 * 流程节点属性
	 */
	private Long nodePropertyID;

	/**
	 * 流程节点属性
	 * 
	 * @return 流程节点属性
	 */
	public Long getNodePropertyID() {
		return nodePropertyID;
	}

	/**
	 * 流程节点属性
	 * 
	 * @param nodePropertyID
	 *            流程节点属性
	 */
	public void setNodePropertyID(Long nodePropertyID) {
		this.nodePropertyID = nodePropertyID;
	}

	/**
	 * 流程节点属性
	 */
	private NodeProperty nodeProperty;

	/**
	 * 流程节点属性
	 * 
	 * @return 流程节点属性
	 * @throws Throwable
	 */
	public NodeProperty getNodeProperty() throws Throwable {
		if (nodeProperty == null) {
			if (nodePropertyID > 0) {
				nodeProperty = getContext().getNodePropertyMap().get(nodePropertyID, this);
			}
			if (nodeProperty == null) {
				// 取对应流程设置中的数据
				WorkflowDesigneDtl workflowDesigneDtl = getWorkflowDesigneDtl();
				if (workflowDesigneDtl != null) {
					nodeProperty = workflowDesigneDtl.getNodeProperty();
				}
			}
			if (nodeProperty == null) {
				nodeProperty = new NodeProperty(getContext(), this);
			}
			if (nodeProperty != null) {
				nodeProperty.setWorkflowDesigneDtl(this);
			}
		}
		return nodeProperty;
	}

	/**
	 * 流程节点属性
	 * 
	 * @param nodeProperty
	 *            流程节点属性
	 */
	public void setNodeProperty(NodeProperty nodeProperty) {
		this.nodeProperty = nodeProperty;
	}

	/**
	 * 序号
	 */
	private int Sequence;

	/**
	 * 序号
	 * 
	 * @return 序号
	 */
	public int getSequence() {
		return Sequence;
	}

	/**
	 * 序号
	 * 
	 * @param sequence
	 *            序号
	 */
	public void setSequence(int sequence) {
		Sequence = sequence;
	}

	/**
	 * 审批操作选择ID
	 */
	private Long auditOptSelID;

	/**
	 * 审批操作选择ID
	 * 
	 * @return 审批操作选择ID
	 */
	public Long getAuditOptSelID() {
		return auditOptSelID;
	}

	/**
	 * 审批操作选择ID
	 * 
	 * @param auditOptSelID
	 *            审批操作选择ID
	 */
	public void setAuditOptSelID(Long auditOptSelID) {
		this.auditOptSelID = auditOptSelID;
	}

	/**
	 * 审批操作选择
	 */
	private OperationSel auditOptSel;

	/**
	 * 审批操作选择
	 * 
	 * @return 审批操作选择
	 * @throws Throwable
	 */
	public OperationSel getAuditOptSel() throws Throwable {
		if (auditOptSel == null) {
			if (auditOptSelID > 0) {
				auditOptSel = getContext().getOperationSelMap().get(auditOptSelID);
			}
			if (auditOptSel == null) {
				// 取对应流程设置中的数据
				WorkflowDesigneDtl workflowDesigneDtl = getWorkflowDesigneDtl();
				if (workflowDesigneDtl != null) {
					auditOptSel = workflowDesigneDtl.getAuditOptSel();
				}
			}
			if (auditOptSel != null) {
				auditOptSel.setWorkflowDesigneDtl(this);
			}
		}
		return auditOptSel;
	}

	/**
	 * 审批操作选择
	 * 
	 * @param auditOptSel
	 *            审批操作选择
	 */
	public void setAuditOptSel(OperationSel auditOptSel) {
		this.auditOptSel = auditOptSel;
		setAuditOptSelID(auditOptSel.getOID());
	}

	/**
	 * 审批人员选择ID
	 */
	private Long auditPerSelID;

	/**
	 * 审批人员选择ID
	 * 
	 * @return 审批人员选择ID
	 */
	public Long getAuditPerSelID() {
		return auditPerSelID;
	}

	/**
	 * 审批人员选择ID
	 * 
	 * @param auditPerSelID
	 *            审批人员选择ID
	 */
	public void setAuditPerSelID(Long auditPerSelID) {
		this.auditPerSelID = auditPerSelID;
	}

	/**
	 * 审批人员选择
	 */
	private OperatorSel auditPerSel;

	/**
	 * 审批人员选择
	 * 
	 * @return 审批人员选择
	 * @throws Throwable
	 */
	public OperatorSel getAuditPerSel() throws Throwable {
		if (auditPerSel == null) {
			if (auditPerSelID > 0) {
				setAuditPerSel(getContext().getOperatorSelMap().get(auditPerSelID));
			}
			if (auditPerSel == null) {
				// 取对应流程设置中的数据
				WorkflowDesigneDtl workflowDesigneDtl = getWorkflowDesigneDtl();
				if (workflowDesigneDtl != null) {
					setAuditPerSel(workflowDesigneDtl.getAuditPerSel());
				}
			}
			if (auditPerSel != null) {
				auditPerSel.setWorkflowDesigneDtl(this);
			}
		}
		return auditPerSel;
	}

	/**
	 * 审批人员选择
	 * 
	 * @param auditPerSel
	 *            审批人员选择
	 * @throws Throwable
	 */
	public void setAuditPerSel(OperatorSel auditPerSel) {
		this.auditPerSel = auditPerSel;
		getOperatorSelMap().put("AuditPerOID", auditPerSel);
	}

	/**
	 * 获得上级流程设计明细
	 * 
	 * @return 上级流程设计明细
	 * @throws Throwable
	 */
	public WorkflowDesigneDtl getWorkflowDesigneDtl() throws Throwable {
		return getWorkflowDesigneDtl(getAuditNode());
	}

	/**
	 * 获得上级流程设计明细
	 * 
	 * @param node
	 *            审批节点标识
	 * @return 上级流程设计明细
	 * @throws Throwable
	 */
	public WorkflowDesigneDtl getWorkflowDesigneDtl(String node) throws Throwable {
		WorkflowTypeDtl workflowTypeDtl = getHeadBase().getWorkflowTypeDtl();
		if (workflowTypeDtl == null) {
			return null;
		}
		return workflowTypeDtl.getWorkflow().getWorkflowDesigne().getWorkflowDesigneDtlMap().get(node);
	}

	/**
	 * 传阅人员选择ID
	 */
	private Long sendPerSelID;

	/**
	 * 传阅人员选择ID
	 * 
	 * @return 传阅人员选择ID
	 */
	public Long getSendPerSelID() {
		return sendPerSelID;
	}

	/**
	 * 传阅人员选择ID
	 * 
	 * @param sendPerSelID
	 *            传阅人员选择ID
	 */
	public void setSendPerSelID(Long sendPerSelID) {
		this.sendPerSelID = sendPerSelID;
	}

	/**
	 * 传阅人员选择
	 */
	private OperatorSel sendPerSel;

	/**
	 * 传阅人员选择
	 * 
	 * @return 传阅人员选择
	 * @throws Throwable
	 */
	public OperatorSel getSendPerSel() throws Throwable {
		if (sendPerSel == null) {
			if (sendPerSelID > 0) {
				setSendPerSel(getContext().getOperatorSelMap().get(sendPerSelID));
			}
			if (sendPerSel == null) {
				// 取对应流程设置中的数据
				WorkflowDesigneDtl workflowDesigneDtl = getWorkflowDesigneDtl();
				if (workflowDesigneDtl != null) {
					setSendPerSel(workflowDesigneDtl.getSendPerSel());
				}
			}
			if (sendPerSel != null) {
				sendPerSel.setWorkflowDesigneDtl(this);
			}
		}
		return sendPerSel;
	}

	/**
	 * 传阅人员选择
	 * 
	 * @param sendPerSel
	 *            传阅人员选择
	 */
	public void setSendPerSel(OperatorSel sendPerSel) {
		this.sendPerSel = sendPerSel;
		getOperatorSelMap().put("SendOptOID", sendPerSel);
	}

	/**
	 * 监控人员选择ID
	 */
	private Long monitoringPerSelID;

	/**
	 * 监控人员选择ID
	 * 
	 * @return 监控人员选择ID
	 */
	public Long getMonitoringPerSelID() {
		return monitoringPerSelID;
	}

	/**
	 * 监控人员选择ID
	 * 
	 * @param monitoringPerSelID
	 *            监控人员选择ID
	 */
	public void setMonitoringPerSelID(Long monitoringPerSelID) {
		this.monitoringPerSelID = monitoringPerSelID;
	}

	/**
	 * 监控人员选择
	 */
	private OperatorSel monitoringPerSel;

	/**
	 * 监控人员选择
	 * 
	 * @return 监控人员选择
	 * @throws Throwable
	 */
	public OperatorSel getMonitoringPerSel() throws Throwable {
		if (monitoringPerSel == null) {
			if (monitoringPerSelID > 0) {
				setMonitoringPerSel(getContext().getOperatorSelMap().get(monitoringPerSelID));
			}
			if (monitoringPerSel == null) {
				// 取对应流程设置中的数据
				WorkflowDesigneDtl workflowDesigneDtl = getWorkflowDesigneDtl();
				if (workflowDesigneDtl != null) {
					setMonitoringPerSel(workflowDesigneDtl.getMonitoringPerSel());
				}
			}
			if (monitoringPerSel == null) {
				monitoringPerSel.setWorkflowDesigneDtl(this);
			}
		}
		return monitoringPerSel;
	}

	/**
	 * 监控人员选择
	 * 
	 * @param monitoringPerSel
	 *            监控人员选择
	 */
	public void setMonitoringPerSel(OperatorSel monitoringPerSel) {
		this.monitoringPerSel = monitoringPerSel;
		getOperatorSelMap().put("MonitoringOptOID", monitoringPerSel);
	}

	/**
	 * 抄送人员选择ID
	 */
	private Long carbonCopyPerSelID;

	/**
	 * 抄送人员选择ID
	 * 
	 * @return 抄送人员选择ID
	 */
	public Long getCarbonCopyPerSelID() {
		return carbonCopyPerSelID;
	}

	/**
	 * 抄送人员选择ID
	 * 
	 * @param carbonCopyPerSelID
	 *            抄送人员选择ID
	 */
	public void setCarbonCopyPerSelID(Long carbonCopyPerSelID) {
		this.carbonCopyPerSelID = carbonCopyPerSelID;
	}

	/**
	 * 抄送人员选择
	 */
	private OperatorSel carbonCopyPerSel;

	/**
	 * 抄送人员选择
	 * 
	 * @return 抄送人员选择
	 * @throws Throwable
	 */
	public OperatorSel getCarbonCopyPerSel() throws Throwable {
		if (carbonCopyPerSel == null) {
			if (carbonCopyPerSelID > 0) {
				setCarbonCopyPerSel(getContext().getOperatorSelMap().get(carbonCopyPerSelID));
			}
			if (carbonCopyPerSel == null) {
				// 取对应流程设置中的数据
				WorkflowDesigneDtl workflowDesigneDtl = getWorkflowDesigneDtl();
				if (workflowDesigneDtl != null) {
					setCarbonCopyPerSel(workflowDesigneDtl.getCarbonCopyPerSel());
				}
			}
			if (carbonCopyPerSel != null) {
				carbonCopyPerSel.setWorkflowDesigneDtl(this);
			}
		}
		return carbonCopyPerSel;
	}

	/**
	 * 抄送人员选择
	 * 
	 * @param carbonCopyPerSel
	 *            抄送人员选择
	 */
	public void setCarbonCopyPerSel(OperatorSel carbonCopyPerSel) {
		this.carbonCopyPerSel = carbonCopyPerSel;
		getOperatorSelMap().put("CarbonCopyOptOID", carbonCopyPerSel);
	}

	/**
	 * 消息设置ID
	 */
	private Long messageSetID;

	/**
	 * 消息设置ID
	 */
	public Long getMessageSetID() {
		return messageSetID;
	}

	/**
	 * 消息设置ID
	 * 
	 * @param messageSetID
	 */
	public void setMessageSetID(Long messageSetID) {
		this.messageSetID = messageSetID;
	}

	/**
	 * 消息设置
	 */
	private MessageSet messageSet;

	/**
	 * 消息设置
	 * 
	 * @return 消息设置
	 * @throws Throwable
	 */
	public MessageSet getMessageSet() throws Throwable {
		if (messageSet == null) {
			if (messageSetID > 0) {
				messageSet = getContext().getMessageSetMap().get(messageSetID);
			}
		}
		return messageSet;
	}

	/**
	 * 消息设置
	 * 
	 * @param messageSet
	 *            消息设置
	 */
	public void setMessageSet(MessageSet messageSet) {
		this.messageSet = messageSet;
		setMessageSetID(messageSet.getOID());
	}

	/**
	 * 人员选择集合
	 */
	private LinkedHashMap<String, OperatorSel> operatorSelMap;

	/**
	 * 人员选择集合
	 * 
	 * @return 人员选择集合
	 * @throws Throwable
	 */
	public LinkedHashMap<String, OperatorSel> getOperatorSelMap() {
		if (operatorSelMap == null) {
			operatorSelMap = new LinkedHashMap<String, OperatorSel>();
		}
		return operatorSelMap;
	}

	/**
	 * 人员选择集合
	 * 
	 * @param operatorSelMap
	 *            人员选择集合
	 */
	public void setOperatorSelMap(LinkedHashMap<String, OperatorSel> operatorSelMap) {
		this.operatorSelMap = operatorSelMap;
	}

	/**
	 * 权限选择ID
	 */
	private Long rightSelID;

	/**
	 * 限选择ID
	 * 
	 * @return 限选择ID
	 */
	public Long getRightSelID() {
		return rightSelID;
	}

	/**
	 * 限选择ID
	 * 
	 * @param rightSelID
	 *            限选择ID
	 */
	public void setRightSelID(Long rightSelID) {
		this.rightSelID = rightSelID;
	}

	/**
	 * 权限选择
	 */
	private RightSel rightSel;

	/**
	 * 权限选择
	 * 
	 * @return 权限选择
	 * @throws Throwable
	 */
	public RightSel getRightSel() throws Throwable {
		if (rightSel == null) {
			if (rightSelID > 0) {
				rightSel = getContext().getRightSelMap().get(rightSelID);
				if (rightSel != null) {
					rightSel.setWorkflowDesigneDtl(this);
				}
			}
			if (rightSel == null
					|| (rightSel.getRightSelFieldMap().size() <= 0 && rightSel.getRightSelOperationMap().size() <= 0)) {
				WorkflowTypeDtl workflowTypeDtl = getHeadBase().getWorkflowTypeDtl();
				if (workflowTypeDtl == null) {
					workflowTypeDtl = getHeadBase().getWorkflow().getWorkflowTypeDtl();
				}
				if (workflowTypeDtl != null) {
					rightSel = workflowTypeDtl.getRightSel();
				}
			}
		}
		return rightSel;
	}

	/**
	 * 权限选择
	 * 
	 * @param rightSel
	 *            权限选择
	 */
	public void setRightSel(RightSel rightSel) {
		this.rightSel = rightSel;
		setRightSelID(rightSel.getOID());
	}

	/**
	 * 邮件模板
	 */
	private String emailTemp;

	/**
	 * 邮件模板
	 * 
	 * @return 邮件模板
	 */
	public String getEmailTemp() {
		return emailTemp;
	}

	/**
	 * 邮件模板
	 * 
	 * @param emailTemp
	 *            邮件模板
	 */
	public void setEmailTemp(String emailTemp) {
		this.emailTemp = emailTemp;
	}

	/**
	 * 构造流程设计明细对象
	 * 
	 * @param context
	 *            OA上下文对象
	 */
	public WorkflowDesigneDtl(OAContext context, WorkflowDesigne workflowDesigne) {
		super(context, workflowDesigne);
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
		setSequence(dt.getInt("Sequence"));
		setAuditNode(dt.getString("AuditNode"));
		setAuditPerSelID(dt.getLong("AuditPerOID"));
		setAuditOptSelID(dt.getLong("AuditOptOID"));
		setSendPerSelID(dt.getLong("SendOptOID"));
		setMonitoringPerSelID(dt.getLong("MonitoringOptOID"));
		setCarbonCopyPerSelID(dt.getLong("CarbonCopyOptOID"));
		setMessageSetID(dt.getLong("MessageSetID"));
		setEmailTemp(dt.getString("EmailTemp"));
		setRightSelID(dt.getLong("RightSelOID"));
		setNodePropertyID(dt.getLong("NodePropertyOID"));
	}
}
