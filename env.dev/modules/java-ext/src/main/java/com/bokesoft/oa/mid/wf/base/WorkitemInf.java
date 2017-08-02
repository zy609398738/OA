package com.bokesoft.oa.mid.wf.base;

import com.bokesoft.oa.base.DtlBase;
import com.bokesoft.oa.base.OAContext;
import com.bokesoft.yigo.struct.datatable.DataTable;

/**
 * 工作项信息
 * 
 * @author minjian
 *
 */
public class WorkitemInf extends DtlBase<BPMInstance> {
	/**
	 * 流程实例
	 * 
	 * @return 流程实例
	 * @throws Throwable
	 */
	public BPMInstance getHeadBase() throws Throwable {
		BPMInstance headBase = super.getHeadBase();
		if (instanceID <= 0) {
			return headBase;
		}
		if (headBase == null) {
			headBase = getContext().getBPMInstanceMap().get(instanceID);
			super.setHeadBase(headBase);
		}
		return headBase;
	}

	/**
	 * 流程实例标识
	 */
	private Long instanceID;

	/**
	 * 流程实例标识
	 * 
	 * @return 流程实例标识
	 */
	public Long getInstanceID() {
		return instanceID;
	}

	/**
	 * 流程实例标识
	 * 
	 * @param instanceID
	 *            流程实例标识
	 */
	public void setInstanceID(Long instanceID) {
		this.instanceID = instanceID;
	}

	/**
	 * 流程节点标识
	 */
	private Integer nodeID;

	/**
	 * 流程节点标识
	 * 
	 * @return 流程节点标识
	 */
	public Integer getNodeID() {
		return nodeID;
	}

	/**
	 * 流程节点标识
	 * 
	 * @param nodeID
	 *            流程节点标识
	 */
	public void setNodeID(Integer nodeID) {
		this.nodeID = nodeID;
	}

	/**
	 * 父工作项标识
	 */
	private Long parentWorkitemID;

	/**
	 * 父工作项标识
	 * 
	 * @return 父工作项标识
	 */
	public Long getParentWorkitemID() {
		return parentWorkitemID;
	}

	/**
	 * 父工作项标识
	 * 
	 * @param parentWorkitemID
	 *            父工作项标识
	 */
	public void setParentWorkitemID(Long parentWorkitemID) {
		this.parentWorkitemID = parentWorkitemID;
	}

	/**
	 * 父工作项信息
	 */
	private WorkitemInf parentWorkitem;

	/**
	 * 父工作项信息
	 * 
	 * @return 父工作项信息
	 * @throws Throwable
	 */
	public WorkitemInf getParentWorkitem() throws Throwable {
		if (parentWorkitemID <= 0) {
			return parentWorkitem;
		}
		if (parentWorkitem == null) {
			parentWorkitem = getContext().getWorkitemInfMap().get(parentWorkitemID);
		}
		return parentWorkitem;
	}

	/**
	 * 父工作项信息
	 * 
	 * @param parentWorkitem
	 *            父工作项信息
	 */
	public void setParentWorkitem(WorkitemInf parentWorkitem) {
		this.parentWorkitem = parentWorkitem;
		setParentWorkitemID(parentWorkitem.getOID());
	}

	/**
	 * 流程工作项
	 */
	private WFWorkitem wFWorkitem;

	/**
	 * 流程工作项
	 * 
	 * @return 流程工作项
	 * @throws Throwable
	 */
	public WFWorkitem getWFWorkitem() throws Throwable {
		Long oid = getOID();
		if (wFWorkitem == null && oid > 0) {
			wFWorkitem = getContext().getWFWorkitemMap(this).get(oid);
		}
		return wFWorkitem;
	}

	/**
	 * 流程工作项
	 * 
	 * @param wFWorkitem
	 *            流程工作项
	 */
	public void setWFWorkitem(WFWorkitem wFWorkitem) {
		this.wFWorkitem = wFWorkitem;
	}

	/**
	 * 构造直工作项信息对象
	 * 
	 * @param context
	 *            OA上下文
	 * @param bPMInstance
	 *            流程实例
	 */
	public WorkitemInf(OAContext context, BPMInstance bPMInstance) {
		super(context, bPMInstance);
	}

	/**
	 * 载入数据
	 * 
	 * @param dt
	 *            明细数据集
	 * @throws Throwable
	 */
	public void loadData(DataTable dt) throws Throwable {
		setOID(dt.getLong("WorkItemID"));
		setNodeID(dt.getInt("NodeID"));
		setParentWorkitemID(dt.getLong("ParentWorkitemID"));
		setInstanceID(dt.getLong("InstanceID"));
	}
}
