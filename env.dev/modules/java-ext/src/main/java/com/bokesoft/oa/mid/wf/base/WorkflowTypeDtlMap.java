package com.bokesoft.oa.mid.wf.base;

import java.util.LinkedHashMap;

import com.bokesoft.oa.base.DtlBaseMap;
import com.bokesoft.oa.base.OAContext;
import com.bokesoft.yes.common.util.StringUtil;
import com.bokesoft.yigo.common.util.TypeConvertor;
import com.bokesoft.yigo.meta.dataobject.MetaDataObject;
import com.bokesoft.yigo.mid.base.DefaultContext;
import com.bokesoft.yigo.mid.connection.IDBManager;
import com.bokesoft.yigo.struct.datatable.DataTable;
import com.bokesoft.yigo.struct.document.Document;

/**
 * 流程类别明细集合
 * 
 * @author zhoukaihe
 *
 */
public class WorkflowTypeDtlMap extends DtlBaseMap<Long, WorkflowTypeDtl, WorkflowType> {
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	/**
	 * 以单据Key为标识存储的流程类别明细集合
	 */
	private LinkedHashMap<String, WorkflowTypeDtl> workflowTypeDtlMap;

	/**
	 * 以单据Key为标识存储的流程类别明细集合
	 * 
	 * @return
	 */
	public LinkedHashMap<String, WorkflowTypeDtl> getWorkflowTypeDtlMap() {
		if (workflowTypeDtlMap == null) {
			workflowTypeDtlMap = new LinkedHashMap<String, WorkflowTypeDtl>();
		}
		return workflowTypeDtlMap;
	}

	/**
	 * 以单据Key为标识存储的流程类别明细集合
	 * 
	 * @param workflowTypeDtlMap
	 */
	public void setWorkflowTypeDtlMap(LinkedHashMap<String, WorkflowTypeDtl> workflowTypeDtlMap) {
		this.workflowTypeDtlMap = workflowTypeDtlMap;
	}

	/**
	 * 构造流程类别明细对象
	 * 
	 * @param context
	 *            OA上下文对象
	 * @param workflowType
	 *            流程类别
	 */
	public WorkflowTypeDtlMap(OAContext context, WorkflowType workflowType) {
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
		dt.beforeFirst();
		while (dt.next()) {
			Long oid = dt.getLong("OID");
			WorkflowTypeDtl dtl = getContext().getWorkflowTypeDtlMap().get(oid);
			if (dtl == null) {
				dtl = new WorkflowTypeDtl(getContext(), getHeadBase());
				dtl.loadData(dt);
			}
			put(dtl.getOID(), dtl);
		}
	}

	/**
	 * 获得流程类别明细
	 * 
	 * @param oid
	 *            流程类别明细标识
	 * @return 流程类别明细
	 * @throws Throwable
	 */
	public WorkflowTypeDtl get(Long oid) throws Throwable {
		WorkflowTypeDtl dtl = super.get(oid);
		if (dtl == null) {
			OAContext context = getContext();
			IDBManager dbm = context.getContext().getDBManager();
			String dtlSql = "select * from OA_WorkflowType_D where OID>0 and oid=?";
			DataTable dtlDt = dbm.execPrepareQuery(dtlSql, oid);
			if (dtlDt.size() > 0) {
				dtl = new WorkflowTypeDtl(context, getHeadBase());
				dtl.loadData(dtlDt);
				put(dtl.getOID(), dtl);
			}
		}
		return dtl;
	}

	/**
	 * 获得流程类别明细
	 * 
	 * @param billKey
	 *            流程类别明细管理单据Key
	 * @return 流程类别明细
	 * @throws Throwable
	 */
	private WorkflowTypeDtl get(String billKey) throws Throwable {
		LinkedHashMap<String, WorkflowTypeDtl> workflowTypeDtlMap = getWorkflowTypeDtlMap();
		WorkflowTypeDtl dtl = workflowTypeDtlMap.get(billKey);
		if (dtl == null) {
			OAContext context = getContext();
			IDBManager dbm = context.getContext().getDBManager();
			String dtlSql = "select d.* from OA_WorkflowType_D d left join OA_WorkflowType_H h on d.soid=h.oid where h.enable=1 and d.BillKey=? order by h.OrderNum,d.OrderNum,d.Sequence";
			DataTable dtlDt = dbm.execPrepareQuery(dtlSql, billKey);
			if (dtlDt.size() <= 0) {
				// 如果未找到流程定义ID，根据配置的别名再去找一下
				billKey = context.getAliasKey(billKey);
				if (!StringUtil.isBlankOrNull(billKey)) {
					dtlDt = dbm.execPrepareQuery(dtlSql, billKey);
				}
			}
			if (dtlDt.size() > 0) {
				dtl = new WorkflowTypeDtl(context, getHeadBase());
				dtl.loadData(dtlDt);
				put(dtl.getOID(), dtl);
				workflowTypeDtlMap.put(billKey, dtl);
			}
		}
		return dtl;
	}

	/**
	 * 获得流程类别明细
	 * 
	 * @param billKey
	 *            流程类别明细管理单据Key
	 * @param workfowKey
	 *            流程Key
	 * @return 流程类别明细
	 * @throws Throwable
	 */
	public WorkflowTypeDtl get(String billKey, String workfowKey) throws Throwable {
		if (StringUtil.isBlankOrNull(workfowKey)) {
			return get(billKey);
		}
		LinkedHashMap<String, WorkflowTypeDtl> workflowTypeDtlMap = getWorkflowTypeDtlMap();
		String dtlKey = billKey + "_" + workfowKey;
		WorkflowTypeDtl dtl = workflowTypeDtlMap.get(dtlKey);
		if (dtl == null) {
			OAContext context = getContext();
			IDBManager dbm = context.getContext().getDBManager();
			String dtlSql = "select d.* from OA_WorkflowType_D d left join OA_WorkflowType_H h on d.soid=h.oid join OA_Workflow_H w on w.oid=d.WorkflowID where h.enable=1 and d.BillKey=? and w.WorkflowKey=? order by h.OrderNum,d.OrderNum,d.Sequence";
			DataTable dtlDt = dbm.execPrepareQuery(dtlSql, billKey, workfowKey);
			if (dtlDt.size() <= 0) {
				// 如果未找到流程定义ID，根据配置的别名再去找一下
				billKey = context.getAliasKey(billKey);
				if (!StringUtil.isBlankOrNull(billKey)) {
					dtlDt = dbm.execPrepareQuery(dtlSql, billKey, workfowKey);
				}
			}
			if (dtlDt.size() > 0) {
				dtl = new WorkflowTypeDtl(context, getHeadBase());
				dtl.loadData(dtlDt);
				put(dtl.getOID(), dtl);
				workflowTypeDtlMap.put(dtlKey, dtl);
			}
		}
		return dtl;
	}

	/**
	 * 获得流程类别明细
	 * 
	 * @param formKey
	 *            单据的key
	 * @param workfowKey
	 *            流程Key
	 * @param workflowTypeDtlID
	 *            流程类别明细ID
	 * @return 流程类别明细数据集
	 * @throws Throwable
	 */
	public WorkflowTypeDtl get(String formKey, String workfowKey, Long workflowTypeDtlID) throws Throwable {
		WorkflowTypeDtlMap workflowTypeDtlMap = getContext().getWorkflowTypeDtlMap();
		WorkflowTypeDtl workflowTypeDtl = null;
		// 如果流程类别明细ID不为空,根据流程类型明细ID获得流程类型的数据集
		if (workflowTypeDtlID != null && workflowTypeDtlID > 0) {
			workflowTypeDtl = workflowTypeDtlMap.get(workflowTypeDtlID);
		} else {
			// 否则，根据单据Key获得流程类型的数据集
			workflowTypeDtl = workflowTypeDtlMap.get(formKey, workfowKey);
		}
		return workflowTypeDtl;
	}

	/**
	 * 获得流程节点属性
	 * 
	 * @param formKey
	 *            单据的key
	 * @param workflowTypeDtlID
	 *            流程类别明细ID
	 * @param workItemID
	 *            流程工作项
	 * @return 流程节点属性
	 * @throws Throwable
	 */
	public NodeProperty getNodeProperty(String formKey, Long workflowTypeDtlID, Long workItemID) throws Throwable {
		WorkflowDesigneDtl workflowDesigneDtl = getWorkflowDesigneDtl(formKey, workflowTypeDtlID, workItemID);
		if (workflowDesigneDtl == null) {
			return null;
		}
		return workflowDesigneDtl.getNodeProperty();
	}

	/**
	 * 获得流程节点属性
	 * 
	 * @param formKey
	 *            单据的key
	 * @param workflowTypeDtlID
	 *            流程类别明细ID
	 * @param workfowKey
	 *            流程Key
	 * @param nodeID
	 *            流程节点
	 * @return 流程节点属性
	 * @throws Throwable
	 */
	public NodeProperty getNodeProperty(String formKey, String workfowKey, Long workflowTypeDtlID, String nodeID)
			throws Throwable {
		WorkflowDesigneDtl workflowDesigneDtl = getWorkflowDesigneDtl(formKey, workfowKey, workflowTypeDtlID, nodeID);
		NodeProperty node = workflowDesigneDtl.getNodeProperty();
		return node;
	}

	/**
	 * 流程设计明细
	 * 
	 * @param formKey
	 *            单据的key
	 * @param workflowTypeDtlID
	 *            流程类别明细ID
	 * @param workfowKey
	 *            流程Key
	 * @param nodeID
	 *            流程节点
	 * @return 流程设计明细
	 * @throws Throwable
	 */
	private WorkflowDesigneDtl getWorkflowDesigneDtl(String formKey, String workfowKey, Long workflowTypeDtlID,
			String nodeID) throws Throwable {
		WorkflowTypeDtl workflowTypeDtl = get(formKey, workfowKey, workflowTypeDtlID);
		if (workflowTypeDtl == null) {
			return null;
		}
		WorkflowDesigneDtl workflowDesigneDtl = workflowTypeDtl.getWorkflowDesigneDtl(nodeID);
		if (workflowDesigneDtl == null) {
			return null;
		}
		return workflowDesigneDtl;
	}

	/**
	 * 流程设计明细
	 * 
	 * @param formKey
	 *            单据的key
	 * @param workflowTypeDtlID
	 *            流程类别明细ID
	 * @param workItemID
	 *            流程工作项
	 * @return 流程设计明细
	 * @throws Throwable
	 */
	public WorkflowDesigneDtl getWorkflowDesigneDtl(String formKey, Long workflowTypeDtlID, Long workItemID)
			throws Throwable {
		WorkitemInf workitemInf = getContext().getWorkitemInfMap().get(workItemID);
		if (workitemInf == null) {
			return null;
		}
		BPMInstance bPMInstance = workitemInf.getHeadBase();
		String pkKey = bPMInstance.getProcesskey();
		Integer nodeID = workitemInf.getNodeID();
		return getWorkflowDesigneDtl(formKey, pkKey, workflowTypeDtlID, nodeID.toString());
	}

	/**
	 * 获得流程类别明细数据集
	 * 
	 * @param formKey
	 *            单据的key
	 * @param workfowKey
	 *            流程Key
	 * @param oid
	 *            当前单据的标识
	 * @return 流程类别明细数据集
	 * @throws Throwable
	 */
	public WorkflowTypeDtl getWorkflowTypeDtl(String formKey, String workfowKey, Long oid) throws Throwable {
		if (oid <= 0) {
			return getWorkflowTypeDtl(formKey, workfowKey);
		}
		DefaultContext context = getContext().getContext();
		String tableName = context.getVE().getMetaFactory().getMetaForm(formKey).getDataSource().getDataObject()
				.getMainTable().getBindingDBTableName();
		String sql = "select " + Workflow.WorkflowTypeDtlID + " from " + tableName + " where oid=?";
		DataTable dt = context.getDBManager().execPrepareQuery(sql, oid);
		WorkflowTypeDtl dtl = null;
		if (dt.size() <= 0) {
			dtl = get(formKey, workfowKey);
		} else {
			dtl = get(dt.getLong(Workflow.WorkflowTypeDtlID));
		}
		return dtl;
	}

	/**
	 * 获得流程类别明细数据集
	 * 
	 * @param formKey
	 *            单据的key
	 * @param workfowKey
	 *            流程Key
	 * @return 流程类别明细数据集
	 * @throws Throwable
	 */
	public WorkflowTypeDtl getWorkflowTypeDtl(String formKey, String workfowKey) throws Throwable {
		OAContext context = getContext();
		// 获得当前单据参数中的流程类别明细ID
		Object paraValue = context.getContext().getPara(Workflow.WorkflowTypeDtlID);
		WorkflowTypeDtl dtl = null;
		// 如果流程类别明细ID不为空,根据流程类型明细ID获得流程类型的数据集
		if (paraValue != null) {
			Long workflowTypeDtlID = TypeConvertor.toLong(paraValue);
			dtl = get(workflowTypeDtlID);
		} else {
			Document doc = context.getContext().getDocument();
			// 如果当期单据对象不存在
			if (doc == null) {
				// 根据单据Key获得流程类型的数据集
				dtl = get(formKey, workfowKey);
			} else {
				MetaDataObject metaDataObject = doc.getMetaDataObject();
				if (metaDataObject == null) {
					metaDataObject = context.getContext().getVE().getMetaFactory().getMetaForm(formKey).getDataSource()
							.getDataObject();
				}
				String mainTableKey = metaDataObject.getMainTableKey();

				DataTable srcDt = doc.get(mainTableKey);
				// 否则，如果主表中存在WorkflowTypeDtlID数据字段，根据WorkflowTypeDtlID数据字段的值获得流程类型的数据集
				if (srcDt != null && srcDt.getMetaData().constains(Workflow.WorkflowTypeDtlID)) {
					long workflowTypeDtlID = TypeConvertor.toLong(srcDt.getObject(Workflow.WorkflowTypeDtlID));
					// 如果主表中存在WorkflowTypeDtlID大于0，根据WorkflowTypeDtlID获得流程类型的数据集
					dtl = get(formKey, workfowKey, workflowTypeDtlID);
				} else {
					// 否则，根据单据Key获得流程类型的数据集
					dtl = get(formKey, workfowKey);
				}
			}
		}
		return dtl;
	}
}
