package com.bokesoft.oa.mid.wf;

import java.util.ArrayList;

import com.bokesoft.yigo.common.util.TypeConvertor;
import com.bokesoft.yigo.mid.base.DefaultContext;
import com.bokesoft.yigo.mid.connection.IDBManager;
import com.bokesoft.yigo.mid.service.IExtService;
import com.bokesoft.yigo.struct.datatable.DataTable;

/**
 * 根据流程项目获得流程的参与者下拉字符串
 *
 */
public class GetDropItemByWorkItem implements IExtService {

	@Override
	public Object doCmd(DefaultContext paramDefaultContext, ArrayList<Object> paramArrayList) throws Throwable {
		if (paramArrayList.size() <= 2) {
			return getDropItemByWorkItem(paramDefaultContext, TypeConvertor.toLong(paramArrayList.get(0)),
					TypeConvertor.toString(paramArrayList.get(1)), null);
		} else {
			return getDropItemByWorkItem(paramDefaultContext, TypeConvertor.toLong(paramArrayList.get(0)),
					TypeConvertor.toString(paramArrayList.get(1)), TypeConvertor.toLong(paramArrayList.get(2)));
		}
	}

	/**
	 * 根据流程项目获得流程的参与者下拉字符串
	 * 
	 * @param context
	 *            中间层对象
	 * @param workItemID
	 *            流程工作项
	 * @param formKey
	 *            流程单据Key
	 * @param workflowTypeDtlID
	 *            流程类别明细ID
	 * @return 参与者下拉字符串
	 */
	public String getDropItemByWorkItem(DefaultContext context, Long workItemID, String formKey, Long workflowTypeDtlID)
			throws Throwable {
		IDBManager dbm = context.getDBManager();
		String wfSql = "select nodeID,InstanceID from bpm_workiteminfo w where w.workItemID=?";
		DataTable wfDt = dbm.execPrepareQuery(wfSql, workItemID);
		if (wfDt.size() <= 0) {
			return "";
		}
		int nodeID = wfDt.getInt("nodeID");
		Long pdKey = wfDt.getLong("InstanceID");
		String pkSql = "select Processkey from bpm_instance i where i.instanceID=?";
		DataTable pkDt = dbm.execPrepareQuery(pkSql, pdKey);
		String pkKey = pkDt.getString("Processkey");

		DataTable workflowTypeDt = OaWfTemplate.getWorkflowTypeDtl(context, formKey, workflowTypeDtlID);
		if (workflowTypeDt.size() <= 0) {
			return null;
		}
		Long workflowOID = workflowTypeDt.getLong("WorkflowID");

		Integer nextNodeID = OaWfTemplate.getNextNodeID(context, pkKey, nodeID, workflowOID);
		if (nextNodeID < 0) {
			return "";
		}
		
		String sql = "select h.BillKey,h.OID from OA_WorkflowDesigne_H h join OA_WorkflowDesigne_D d on h.oid=d.soid where h.oid>0 and h.status=100 and WorkflowKey=? and AuditNode=? and tag1=? and tag2=?";
		DataTable dt = context.getDBManager().execPrepareQuery(sql, pkKey, nextNodeID, "OA_Workflow",workflowOID);
		if(dt.size()<=0){
			sql = "select h.BillKey,h.OID from OA_WorkflowDesigne_H h join OA_WorkflowDesigne_D d on h.oid=d.soid where h.oid>0 and h.status=100 and WorkflowKey=? and AuditNode=? and tag1=?";
			dt = context.getDBManager().execPrepareQuery(sql, pkKey, nextNodeID, "OA_WorkflowSet");
		}
		if (dt.size() <= 0) {
			return "";
		} else if (dt.size() > 1) {
			return "";
		}
		String billKey = dt.getString("BillKey");
		long oid = dt.getLong("OID");
		GetParticipatorSql getParticipatorSql = new GetParticipatorSql();
		getParticipatorSql.setContext(context);
		String participatorSql = getParticipatorSql.getParticipatorSql(billKey, oid, pkKey,
				TypeConvertor.toString(nextNodeID));
		if (participatorSql.length() <= 0) {
			return "";
		}
		participatorSql = "Select OID,Name From sys_operator o where Exists(" + participatorSql
				+ " and o.OID=sys_operator.OID) order by convert(name using gbk) asc";
		DataTable participatorDt = context.getDBManager().execQuery(participatorSql);
		String ids = "";
		participatorDt.beforeFirst();
		while (participatorDt.next()) {
			String id = TypeConvertor.toString(participatorDt.getObject("OID"));
			String name = TypeConvertor.toString(participatorDt.getObject("Name"));
			ids = ids + ";" + id + "," + name;
		}
		if (ids.length() > 0) {
			ids = ids.substring(1);
		}
		return ids;
	}

}
