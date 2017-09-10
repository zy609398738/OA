package com.bokesoft.oa.mid.wf.base;

import com.bokesoft.oa.base.DtlBase;
import com.bokesoft.oa.base.OAContext;
import com.bokesoft.oa.mid.message.MessageSet;
import com.bokesoft.oa.util.OASettings;
import com.bokesoft.yigo.struct.datatable.DataTable;

/**
 * 流程类别明细
 * 
 * @author minjian
 *
 */
public class WorkflowTypeDtl extends DtlBase<WorkflowType> {

	/**
	 * 头表
	 * 
	 * @return 头表
	 * @throws Throwable
	 */
	public WorkflowType getHeadBase() throws Throwable {
		WorkflowType workflowType = super.getHeadBase();
		if (workflowType == null) {
			Long soid = getSoid();
			if (soid != null && soid > 0) {
				setHeadBase(workflowType = getContext().getWorkflowTypeMap().get(soid));
			}
		}
		return super.getHeadBase();
	}

	/**
	 * 关联表单标识
	 */
	private String billKey;

	/**
	 * 关联表单标识
	 * 
	 * @return 关联表单标识
	 */
	public String getBillKey() {
		return billKey;
	}

	/**
	 * 关联表单标识
	 * 
	 * @param billKey
	 *            关联表单标识
	 */
	public void setBillKey(String billKey) {
		this.billKey = billKey;
	}

	/**
	 * 表单名称
	 */
	private String billName;

	/**
	 * 表单名称
	 * 
	 * @return 表单名称
	 */
	public String getBillName() {
		return billName;
	}

	/**
	 * 表单名称
	 * 
	 * @param billName
	 *            表单名称
	 */
	public void setBillName(String billName) {
		this.billName = billName;
	}

	/**
	 * 流程定义ID
	 */
	private Long WorkflowID;

	/**
	 * 流程定义ID
	 * 
	 * @return 流程定义ID
	 */
	public Long getWorkflowID() {
		return WorkflowID;
	}

	/**
	 * 流程定义ID
	 * 
	 * @param workflowID
	 *            流程定义ID
	 */
	public void setWorkflowID(Long workflowID) {
		WorkflowID = workflowID;
	}

	/**
	 * 流程定义
	 */
	private Workflow workflow;

	/**
	 * 获得流程设计明细
	 * 
	 * @param nodeKey
	 *            流程节点的标识
	 * @return 流程定义
	 * @throws Throwable
	 */
	public WorkflowDesigneDtl getWorkflowDesigneDtl(String nodeKey) throws Throwable {
		return getWorkflowDesigne().getWorkflowDesigneDtlMap().get(nodeKey);
	}

	/**
	 * 流程定义
	 * 
	 * @return 流程定义
	 * @throws Throwable
	 */
	public Workflow getWorkflow() throws Throwable {
		if (WorkflowID <= 0) {
			return workflow;
		}
		if (workflow == null) {
			workflow = getContext().getWorkflowMap().get(WorkflowID);
			workflow.setWorkflowTypeDtl(this);
		}
		return workflow;
	}

	/**
	 * 流程定义
	 * 
	 * @param workflow
	 *            流程定义
	 */
	public void setWorkflow(Workflow workflow) {
		this.workflow = workflow;
		setWorkflowID(workflow.getOID());
	}

	/**
	 * 启动操作名称
	 */
	private String startCaption;

	/**
	 * 启动操作名称
	 * 
	 * @return 启动操作名称
	 */
	public String getStartCaption() {
		return startCaption;
	}

	/**
	 * 启动操作名称
	 * 
	 * @param startCaption
	 *            启动操作名称
	 */
	public void setStartCaption(String startCaption) {
		this.startCaption = startCaption;
	}

	/**
	 * 启动操作
	 */
	private String startAction;

	/**
	 * 启动操作
	 * 
	 * @return 启动操作
	 */
	public String getStartAction() {
		return startAction;
	}

	/**
	 * 启动操作
	 * 
	 * @param startAction
	 *            启动操作
	 */
	public void setStartAction(String startAction) {
		this.startAction = startAction;
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
		if (rightSelID <= 0) {
			return rightSel;
		}
		if (rightSel == null) {
			rightSel = getContext().getRightSelMap().get(rightSelID);
			rightSel.setWorkflowTypeDtl(this);
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
			if (messageSet == null) {
				Operation operation = OASettings.getBPMOperation(getContext());
				if (operation != null) {
					return operation.getMessageSet();
				}
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
	 * 邮件模板
	 */
	private String emailTemp;

	/**
	 * 邮件模板
	 * 
	 * @return 邮件模板
	 * @throws Throwable
	 */
	public String getEmailTemp() throws Throwable {
		// 如果为空，取所在操作的邮件模板
		if (emailTemp == null) {
			Operation operation = OASettings.getBPMOperation(getContext());
			if (operation != null) {
				emailTemp = operation.getEmailTemp();
			}
		}
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
	 * 发送条件
	 */
	private String sendFormula;

	/**
	 * 发送条件
	 * 
	 * @return 发送条件
	 * @throws Throwable
	 */
	public String getSendFormula() throws Throwable {
		// 如果为空，取所在操作的发送条件
		if (sendFormula == null) {
			Operation operation = OASettings.getBPMOperation(getContext());
			if (operation != null) {
				sendFormula = operation.getSendFormula();
			}
		}
		return sendFormula;
	}

	/**
	 * 发送条件
	 * 
	 * @param sendFormula
	 *            发送条件
	 */
	public void setSendFormula(String sendFormula) {
		this.sendFormula = sendFormula;
	}

	/**
	 * 流程设计ID
	 */
	private Long workflowDesigneID;

	/**
	 * 流程设计ID
	 * 
	 * @return 流程设计ID
	 */
	public Long getWorkflowDesigneID() {
		return workflowDesigneID;
	}

	/**
	 * 流程设计ID
	 * 
	 * @param workflowDesigneID
	 *            流程设计ID
	 */
	public void setWorkflowDesigneID(Long workflowDesigneID) {
		this.workflowDesigneID = workflowDesigneID;
	}

	/**
	 * 流程设计
	 */
	private WorkflowDesigne workflowDesigne;

	/**
	 * 流程设计
	 * 
	 * @return 流程设计
	 * @throws Throwable
	 */
	public WorkflowDesigne getWorkflowDesigne() throws Throwable {
		if (workflowDesigne == null) {
			if (workflowDesigneID > 0) {
				workflowDesigne = getContext().getWorkflowDesigneMap().get(workflowDesigneID);
				workflowDesigne.setWorkflowTypeDtl(this);
			}
			if (workflowDesigne == null) {
				workflowDesigne = getWorkflow().getWorkflowDesigne();
			}
		}
		return workflowDesigne;
	}

	/**
	 * 流程设计
	 * 
	 * @param workflowDesigne
	 *            流程设计
	 */
	public void setWorkflowDesigne(WorkflowDesigne workflowDesigne) {
		this.workflowDesigne = workflowDesigne;
	}

	/**
	 * 构造流程类别明细对象
	 * 
	 * @param context
	 *            OA上下文对象
	 * @param workflowType
	 *            流程类别
	 */
	public WorkflowTypeDtl(OAContext context, WorkflowType workflowType) {
		super(context, workflowType);
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
		setBillKey(dt.getString("BillKey"));
		setBillName(dt.getString("BillName"));
		setWorkflowID(dt.getLong("WorkflowID"));
		setStartAction(dt.getString("StartAction"));
		setStartCaption(dt.getString("StartCaption"));
		setRightSelID(dt.getLong("RightSelOID"));
		setWorkflowDesigneID(dt.getLong("WorkflowDesigneID"));
		setMessageSetID(dt.getLong("MessageSetID"));
		setEmailTemp(dt.getString("EmailTemp"));
		setSendFormula(dt.getString("SendFormula"));
	}

	/**
	 * 重载
	 */
	public String toString() {
		String workflowName = "";
		try {
			workflowName = getWorkflow().getName();
		} catch (Throwable e) {
			e.printStackTrace();
		}
		return super.toString() + "，关联表单标识：" + getBillKey() + "，表单名称：" + getBillName() + "，流程定义：" + workflowName
				+ "，启动操作：" + getStartAction() + "，启动操作名称：" + getStartCaption();
	}
}
