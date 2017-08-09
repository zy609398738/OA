package com.bokesoft.oa.mid.wf.base;

import com.bokesoft.oa.base.BillDtlBase;
import com.bokesoft.oa.base.OAContext;
import com.bokesoft.oa.mid.message.MessageSet;
import com.bokesoft.yes.common.util.StringUtil;
import com.bokesoft.yigo.struct.datatable.DataTable;

/**
 * 操作选择明细
 * 
 * @author minjian
 *
 */
public class OperationSelDtl extends BillDtlBase<OperationSel> {
	/**
	 * 审批操作ID
	 */
	private Long operationID;

	/**
	 * 审批操作ID
	 * 
	 * @return 审批操作ID
	 */
	public Long getOperationID() {
		return operationID;
	}

	/**
	 * 审批操作ID
	 * 
	 * @param operationID
	 *            审批操作
	 */
	public void setOperationID(Long operationID) {
		this.operationID = operationID;
	}

	/**
	 * 审批操作
	 */
	private Operation operation;

	/**
	 * 审批操作
	 * 
	 * @return 审批操作
	 * @throws Throwable
	 */
	public Operation getOperation() throws Throwable {
		if (operation == null && operationID > 0) {
			operation = getContext().getOperationMap().get(operationID);
		}
		return operation;
	}

	/**
	 * 审批操作
	 * 
	 * @param operation
	 *            审批操作
	 */
	public void setOperation(Operation operation) {
		this.operation = operation;
		setOperationID(operation.getOID());
	}

	/**
	 * 审批操作名称
	 */
	private String name;

	/**
	 * 审批操作名称
	 * 
	 * @return 审批操作名称
	 */
	public String getName() {
		if (StringUtil.isBlankOrNull(name)) {
			name = operation.getName();
		}
		return name;
	}

	/**
	 * 审批操作名称
	 * 
	 * @param name
	 *            审批操作名称
	 */
	public void setName(String name) {
		this.name = name;
	}

	/**
	 * 密码确认
	 */
	private Integer confirmPassword;

	/**
	 * 密码确认
	 * 
	 * @return 密码确认
	 */
	public Integer getConfirmPassword() {
		return confirmPassword;
	}

	/**
	 * 密码确认
	 * 
	 * @param confirmPassword
	 *            密码确认
	 */
	public void setConfirmPassword(Integer confirmPassword) {
		this.confirmPassword = confirmPassword;
	}

	/**
	 * 是否填写意见
	 */
	private int opinion;

	/**
	 * 是否填写意见
	 * 
	 * @return 是否填写意见
	 */
	public int getOpinion() {
		return opinion;
	}

	/**
	 * 是否填写意见
	 * 
	 * @param opinion
	 *            是否填写意见
	 */
	public void setOpinion(int opinion) {
		this.opinion = opinion;
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
				messageSet = getHeadBase().getMessageSet();
				if (messageSet == null) {
					Operation operation = getOperation();
					if (operation != null) {
						return operation.getMessageSet();
					}
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
	 * 抄送人员选择ID
	 */
	private Long ccOptSelID;

	/**
	 * 抄送人员选择ID
	 * 
	 * @return 抄送人员选择ID
	 */
	public Long getCcOptSelID() {
		return ccOptSelID;
	}

	/**
	 * 抄送人员选择ID
	 * 
	 * @param ccOptSelID
	 *            抄送人员选择ID
	 */
	public void setCcOptSelID(Long ccOptSelID) {
		this.ccOptSelID = ccOptSelID;
	}

	/**
	 * 抄送人员选择
	 */
	private OperatorSel ccOptSel;

	/**
	 * 抄送人员选择
	 * 
	 * @return 抄送人员选择
	 * @throws Throwable
	 */
	public OperatorSel getCcOptSel() throws Throwable {
		if (ccOptSel == null) {
			if (ccOptSelID > 0) {
				ccOptSel = getContext().getOperatorSelMap().get(ccOptSelID);
			}
			// 如果当前抄送人员选择为空，到当前操作选择对象所属的流程设计明细中获取上级抄送人员选择对象
			if (ccOptSel == null || ccOptSel.getOperatorSelDtlMap().size() <= 0) {
				WorkflowDesigneDtl workflowDesigneDtl = getHeadBase().getWorkflowDesigneDtl();
				if (workflowDesigneDtl != null) {
					ccOptSel = workflowDesigneDtl.getCarbonCopyPerSel();
				}
			}
		}
		return ccOptSel;
	}

	/**
	 * 抄送人员选择
	 * 
	 * @param ccOptSel
	 *            抄送人员选择
	 */
	public void setCcOptSel(OperatorSel ccOptSel) {
		this.ccOptSel = ccOptSel;
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
		// 如果为空，取所在节点的邮件模板
		if (emailTemp == null) {
			emailTemp = getHeadBase().getWorkflowDesigneDtl().getEmailTemp();
			// 如果为空，取所在操作的邮件模板
			if (emailTemp == null) {
				emailTemp = getOperation().getEmailTemp();
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
	 * 构造操作选择明细对象
	 * 
	 * @param context
	 *            OA上下文
	 * @param operationSel
	 *            造操作选择
	 */
	public OperationSelDtl(OAContext context, OperationSel operationSel) {
		super(context, operationSel);
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
		setOperationID(dt.getLong("OptID"));
		setName(dt.getString("name"));
		setConfirmPassword(dt.getInt("confirmPassword"));
		setOpinion(dt.getInt("opinion"));
		setMessageSetID(dt.getLong("MessageSetID"));
		setEmailTemp(dt.getString("EmailTemp"));
		setCcOptSelID(dt.getLong("CCOptSelOID"));
	}
}
