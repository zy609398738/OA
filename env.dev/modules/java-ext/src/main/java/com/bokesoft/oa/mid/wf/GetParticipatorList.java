package com.bokesoft.oa.mid.wf;

import java.util.ArrayList;

import com.bokesoft.yes.common.util.StringUtil;
import com.bokesoft.yigo.common.util.TypeConvertor;
import com.bokesoft.yigo.mid.base.DefaultContext;
import com.bokesoft.yigo.mid.connection.IDBManager;
import com.bokesoft.yigo.mid.service.IExtService;
import com.bokesoft.yigo.struct.datatable.DataTable;

/**
 * 获得当前流程的参与者列表
 *
 */
public class GetParticipatorList implements IExtService {

	@Override
	public Object doCmd(DefaultContext paramDefaultContext, ArrayList<Object> paramArrayList) throws Throwable {
		if (paramArrayList.size() <= 2) {
			return getParticipatorList(paramDefaultContext, TypeConvertor.toLong(paramArrayList.get(0)),
					TypeConvertor.toString(paramArrayList.get(1)), null,null);
		} else if(paramArrayList.size() ==3){
			return getParticipatorList(paramDefaultContext, TypeConvertor.toLong(paramArrayList.get(0)),
					TypeConvertor.toString(paramArrayList.get(1)), TypeConvertor.toLong(paramArrayList.get(2)),null);
		}else{
			return getParticipatorList(paramDefaultContext, TypeConvertor.toLong(paramArrayList.get(0)),
					TypeConvertor.toString(paramArrayList.get(1)), TypeConvertor.toLong(paramArrayList.get(2)),
					TypeConvertor.toString(paramArrayList.get(3)));
		}
	}

	/**
	 * 获得当前流程的参与者列表
	 * 
	 * @param context
	 *            中间层对象
	 * @param workItemID
	 *            流程工作项
	 * @param formKey
	 *            流程单据Key
	 * @param workflowTypeDtlID
	 *            流程类别明细ID
	 * @return 参与者列表
	 */
	public static String getParticipatorList(DefaultContext context, Long workItemID, String formKey, Long workflowTypeDtlID,String sept)
			throws Throwable {
		IDBManager dbm = context.getDBManager();
		String wfSql = "select nodeID,InstanceID from bpm_workiteminfo w where w.workItemID=?";
		DataTable wfDt = dbm.execPrepareQuery(wfSql, workItemID);
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
		DataTable dt = context.getDBManager().execPrepareQuery(sql, pkKey, nextNodeID, "OA_Workflow", workflowOID);
		if (dt.size() <= 0) {
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
		DataTable participatorDt = context.getDBManager().execQuery(participatorSql);
		String ids = "";
		participatorDt.beforeFirst();
		while (participatorDt.next()) {
			String optId = TypeConvertor.toString(participatorDt.getObject("OID"));
			if(StringUtil.isBlankOrNull(sept)){
				ids = ids + "," + optId;
			}else{
				ids = ids + sept + optId;
			}
		}
		if (ids.length() > 0) {
			ids = ids.substring(1);
		}

		return ids;
	}

}
