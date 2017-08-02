package com.bokesoft.oa.mid.wf.base;

import com.bokesoft.oa.base.DicBase;
import com.bokesoft.oa.base.OAContext;
import com.bokesoft.yigo.struct.datatable.DataTable;

/**
 * 流程定义
 * 
 * @author minjian
 *
 */
public class Workflow extends DicBase {
	/**
	 * 流程类别明细标识Key
	 */
	public static final String WorkflowTypeDtlID = "WorkflowTypeDtlID";
	/**
	 * 流程设置Key
	 */
	public static final String WorkflowSetKey = "OA_WorkflowSet";
	/**
	 * 流程关联
	 */
	private String workflowRelevance;

	/**
	 * 流程关联
	 * 
	 * @return 流程关联
	 */
	public String getWorkflowRelevance() {
		return workflowRelevance;
	}

	/**
	 * 流程关联
	 * 
	 * @param workflowRelevance
	 *            流程关联
	 */
	public void setWorkflowRelevance(String workflowRelevance) {
		this.workflowRelevance = workflowRelevance;
	}

	/**
	 * 关联的流程设计ID
	 */
	private Long relevanceWorkflowDesigneID;

	/**
	 * 关联的流程设计ID
	 * 
	 * @return 关联的流程设计ID
	 */
	public Long getRelevanceWorkflowDesigneID() {
		return relevanceWorkflowDesigneID;
	}

	/**
	 * 关联的流程设计ID
	 * 
	 * @param relevanceWorkflowDesigneID
	 *            关联的流程设计ID
	 */
	public void setRelevanceWorkflowDesigneID(Long relevanceWorkflowDesigneID) {
		this.relevanceWorkflowDesigneID = relevanceWorkflowDesigneID;
	}

	/**
	 * 关联的流程设计
	 */
	private WorkflowDesigne relevanceWorkflowDesigne;

	/**
	 * 关联的流程设计
	 * 
	 * @return 关联的流程设计
	 * @throws Throwable
	 */
	public WorkflowDesigne getRelevanceWorkflowDesigne() throws Throwable {
		if (relevanceWorkflowDesigneID <= 0) {
			return relevanceWorkflowDesigne;
		}
		if (relevanceWorkflowDesigne == null) {
			relevanceWorkflowDesigne = getContext().getWorkflowDesigneMap().get(relevanceWorkflowDesigneID);
			relevanceWorkflowDesigne.setWorkflow(this);
		}
		return relevanceWorkflowDesigne;
	}

	/**
	 * 关联的流程设计
	 * 
	 * @param relevanceWorkflowDesigne
	 *            关联的流程设计
	 */
	public void setRelevanceWorkflowDesigne(WorkflowDesigne relevanceWorkflowDesigne) {
		this.relevanceWorkflowDesigne = relevanceWorkflowDesigne;
		setRelevanceWorkflowDesigneID(relevanceWorkflowDesigne.getOID());
	}

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
				if (workflowDesigne != null) {
					workflowDesigne.setWorkflow(this);
				}
			}
			// 如果当前流程设计未找到，取关联的流程设计
			if (workflowDesigne == null) {
				workflowDesigne = getRelevanceWorkflowDesigne();
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
		setWorkflowDesigneID(workflowDesigne.getOID());
	}

	/**
	 * 流程类别明细
	 */
	private WorkflowTypeDtl workflowTypeDtl;

	/**
	 * 流程类别明细
	 * 
	 * @return 流程类别明细
	 */
	public WorkflowTypeDtl getWorkflowTypeDtl() {
		return workflowTypeDtl;
	}

	/**
	 * 流程类别明细
	 * 
	 * @param workflowTypeDtl
	 *            流程类别明细
	 */
	public void setWorkflowTypeDtl(WorkflowTypeDtl workflowTypeDtl) {
		this.workflowTypeDtl = workflowTypeDtl;
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
		setWorkflowRelevance(dt.getString("WorkflowRelevance"));
		setWorkflowKey(dt.getString("WorkflowKey"));
		setWorkflowName(dt.getString("WorkflowName"));
		setWorkflowVersion(dt.getInt("WorkflowVersion"));
		setRelevanceWorkflowDesigneID(dt.getLong("WorkflowRelevanceID"));
		setWorkflowDesigneID(dt.getLong("WorkflowDesigneID"));
	}

	/**
	 * 构造流程定义对象
	 * 
	 * @param context
	 *            OA上下文对象
	 */
	public Workflow(OAContext context) {
		super(context);
	}

	/**
	 * 重载
	 */
	public String toString() {
		String workflowDesigneBillNo = "";
		String relevanceWorkflowDesigneBillNo = "";
		try {
			workflowDesigneBillNo = getWorkflowDesigne().getBillNo();
			relevanceWorkflowDesigneBillNo = getRelevanceWorkflowDesigne().getBillNo();
		} catch (Throwable e) {
			e.printStackTrace();
		}

		return super.toString() + "，流程关联：" + getWorkflowRelevance() + "，流程设计：" + workflowDesigneBillNo + "，关联的流程设计："
				+ relevanceWorkflowDesigneBillNo + "，流程标识：" + getWorkflowKey() + "，流程名称：" + getWorkflowName() + "，流程版本："
				+ getWorkflowVersion();
	}
}
