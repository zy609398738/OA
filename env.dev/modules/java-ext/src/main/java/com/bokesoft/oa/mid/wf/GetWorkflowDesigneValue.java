package com.bokesoft.oa.mid.wf;

import java.util.ArrayList;

import com.bokesoft.yigo.common.util.TypeConvertor;
import com.bokesoft.yigo.mid.base.DefaultContext;
import com.bokesoft.yigo.mid.connection.IDBManager;
import com.bokesoft.yigo.mid.service.IExtService;
import com.bokesoft.yigo.struct.datatable.DataTable;

/**
 * 获得流程设计的指定字段值
 * 
 * @author zhkh
 *
 */
public class GetWorkflowDesigneValue implements IExtService {
	@Override
	public Object doCmd(DefaultContext paramDefaultContext, ArrayList<Object> paramArrayList) throws Throwable {
		if (paramArrayList.size() <= 2) {
			return getWorkflowDesigneValue(paramDefaultContext, TypeConvertor.toLong(paramArrayList.get(0)),
					TypeConvertor.toString(paramArrayList.get(1)), null);
		} else {
			return getWorkflowDesigneValue(paramDefaultContext, TypeConvertor.toLong(paramArrayList.get(0)),
					TypeConvertor.toString(paramArrayList.get(1)), TypeConvertor.toLong(paramArrayList.get(2)));
		}
	}

	/**
	 * 获得流程设计的指定字段值 x
	 * 
	 * @param context
	 *            中间层对象
	 * @param workItemID
	 *            流程工作项
	 * @param formKey
	 *            流程单据Key
	 * @param workflowTypeDtlID
	 *            流程类别明细ID
	 * @return 流程设计的指定字段值
	 * @throws Throwable
	 */
	public Object getWorkflowDesigneValue(DefaultContext context, Long workItemID, String formKey,
			Long workflowTypeDtlID) throws Throwable {
		IDBManager dbm = context.getDBManager();
		String wfSql = "select nodeID,InstanceID from bpm_workiteminfo w where w.workItemID=?";
		DataTable wfDt = context.getDBManager().execPrepareQuery(wfSql, workItemID);
		Long pdKey = wfDt.getLong("InstanceID");
		int nodeID = wfDt.getInt("nodeID");
		String pkSql = "select Processkey from bpm_instance i where i.instanceID=?";
		DataTable pkDt = context.getDBManager().execPrepareQuery(pkSql, pdKey);
		String pkKey = pkDt.getString("Processkey");

		DataTable workflowTypeDt = OaWfTemplate.getWorkflowTypeDtl(context, formKey, workflowTypeDtlID);
		if (workflowTypeDt.size() <= 0) {
			return null;
		}
		Long workflowOID = workflowTypeDt.getLong("WorkflowID");

		String sql = "select SetNextPer from OA_WorkflowDesigne_H h join OA_WorkflowDesigne_D d on h.oid=d.soid where h.oid>0 and h.status=100 and WorkflowKey=? and AuditNode=? and tag1=? and tag2=?";
		DataTable dt = dbm.execPrepareQuery(sql, pkKey, nodeID, "OA_Workflow", workflowOID);
		if (dt.size() <= 0) {
			sql = "select SetNextPer from OA_WorkflowDesigne_H h join OA_WorkflowDesigne_D d on h.oid=d.soid where h.oid>0 and h.status=100 and WorkflowKey=? and AuditNode=? and tag1=?";
			dt = dbm.execPrepareQuery(sql, pkKey, nodeID, "OA_WorkflowSet");
		}

		int value = dt.getInt("SetNextPer");
		return value;
	}
}
