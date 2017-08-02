package com.bokesoft.oa.mid.wf.base;

import java.util.LinkedHashMap;

import com.bokesoft.oa.base.DtlBaseMap;
import com.bokesoft.oa.base.OAContext;
import com.bokesoft.yigo.meta.bpm.process.MetaProcess;
import com.bokesoft.yigo.meta.bpm.process.node.MetaNode;
import com.bokesoft.yigo.mid.connection.IDBManager;
import com.bokesoft.yigo.struct.datatable.DataTable;

/**
 * 流程设计明细集合
 * 
 * @author zhoukaihe
 *
 */
public class WorkflowDesigneDtlMap extends DtlBaseMap<Long, WorkflowDesigneDtl, WorkflowDesigne> {
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	/**
	 * 按照关键字符串存放的流程设计明细集合
	 */
	private LinkedHashMap<String, WorkflowDesigneDtl> workflowDesigneDtlMap;

	/**
	 * 按照关键字符串存放的流程设计明细集合
	 * 
	 * @return 按照关键字符串存放的流程设计明细集合
	 */
	public LinkedHashMap<String, WorkflowDesigneDtl> getWorkflowDesigneDtlMap() {
		if (workflowDesigneDtlMap == null) {
			workflowDesigneDtlMap = new LinkedHashMap<String, WorkflowDesigneDtl>();
		}
		return workflowDesigneDtlMap;
	}

	/**
	 * 按照关键字符串存放的流程设计明细集合
	 * 
	 * @param workflowDesigneDtlMap
	 *            按照关键字符串存放的流程设计明细集合
	 */
	public void setWorkflowDesigneDtlMap(LinkedHashMap<String, WorkflowDesigneDtl> workflowDesigneDtlMap) {
		this.workflowDesigneDtlMap = workflowDesigneDtlMap;
	}

	/**
	 * 构造流程设计明细集合对象
	 * 
	 * @param context
	 *            OA上下文对象
	 * @param workflowDesigne
	 *            流程设计
	 */
	public WorkflowDesigneDtlMap(OAContext context, WorkflowDesigne workflowDesigne) {
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
		dt.beforeFirst();
		while (dt.next()) {
			WorkflowDesigneDtl dtl = new WorkflowDesigneDtl(getContext(), getHeadBase());
			dtl.loadData(dt);
			put(dtl.getOID(), dtl);
			String key = dtl.getAuditNode();
			getWorkflowDesigneDtlMap().put(key, dtl);
		}
	}

	/**
	 * 获得流程设计对象
	 * 
	 * @param oid
	 *            流程设计对象标识
	 * @return 流程设计对象
	 * @throws Throwable
	 */
	public WorkflowDesigneDtl get(Long oid) throws Throwable {
		WorkflowDesigneDtl obj = super.get(oid);
		if (obj == null) {
			OAContext context = getContext();
			IDBManager dbm = context.getContext().getDBManager();
			String dtlSql = "select * from OA_WorkflowDesigneDtl_D where OID=? and OID>0";
			DataTable dtlDt = dbm.execPrepareQuery(dtlSql, oid);
			checkWorkflowDesigneDt(dtlDt);
			if (dtlDt.size() > 0) {
				obj = new WorkflowDesigneDtl(context, getHeadBase());
				obj.loadData(dtlDt);
				super.put(oid, obj);
				String key = obj.getAuditNode();
				getWorkflowDesigneDtlMap().put(key, obj);
			}
		}
		return obj;
	}

	/**
	 * 获得流程设计对象
	 * 
	 * @param workflowKey
	 *            流程标识
	 * @param workflowVersion
	 *            流程版本
	 * @param tag1
	 *            标签1
	 * @param tag2
	 *            标签2
	 * @param tag3
	 *            标签3
	 * @param tag4
	 *            标签4
	 * @return 流程设计对象
	 * @throws Throwable
	 */
	public WorkflowDesigneDtl get(String auditNode) throws Throwable {
		LinkedHashMap<String, WorkflowDesigneDtl> workflowDesigneDtlMap = getWorkflowDesigneDtlMap();
		WorkflowDesigneDtl obj = workflowDesigneDtlMap.get(auditNode);
		if (obj == null) {
			OAContext context = getContext();
			IDBManager dbm = context.getContext().getDBManager();
			WorkflowDesigne workflowDesigne = getHeadBase();
			String dtlSql = "select * from OA_WorkflowDesigne_D where SOID=? and auditNode=?";
			DataTable dtlDt = dbm.execPrepareQuery(dtlSql, workflowDesigne.getOID(), auditNode);
			checkWorkflowDesigneDt(dtlDt);
			if (dtlDt.size() > 0) {
				obj = new WorkflowDesigneDtl(context, getHeadBase());
				obj.loadData(dtlDt);
				super.put(obj.getOID(), obj);
				workflowDesigneDtlMap.put(auditNode, obj);
			}
		}
		return obj;
	}

	/**
	 * 检查流程设计数据
	 * 
	 * @param dtlDt
	 *            流程设计数据
	 * @throws Throwable
	 */
	public void checkWorkflowDesigneDt(DataTable dtlDt) throws Throwable {
		OAContext context = getContext();
		MetaProcess metaProcess = context.getMetaProcess();
		MetaNode metaNode = context.getMetaNode();
		if (metaProcess != null && metaNode != null) {
			if (dtlDt.size() <= 0) {
				throw new Error("流程“" + metaProcess.getCaption() + "”的流程节点“" + metaNode.getCaption()
						+ "”，没有在流程设计中找到对应的节点设置，请修正。");
			} else if (dtlDt.size() > 1) {
				throw new Error("流程“" + metaProcess.getCaption() + "”的流程节点“" + metaNode.getCaption()
						+ "”，在流程设计中找到多个节点设置，只能一个，请修正。");
			}
		}
	}

	/**
	 * 获得前一流程设计明细
	 * 
	 * @param workitemID
	 *            工作项标识
	 * @return 前一流程设计明细
	 * @throws Throwable
	 */
	public WorkflowDesigneDtl getPreNode(Long workitemID) throws Throwable {
		WorkitemInf workitemInf = getContext().getWorkitemInfMap().get(workitemID);
		if (workitemInf == null) {
			return null;
		}
		WorkitemInf parentworkitemInf = workitemInf.getParentWorkitem();
		if (parentworkitemInf == null) {
			return null;
		}
		Integer nodeID = parentworkitemInf.getNodeID();
		if (nodeID == null) {
			return null;
		}
		WorkflowDesigneDtl preNode = get(nodeID.toString());
		return preNode;
	}
}
