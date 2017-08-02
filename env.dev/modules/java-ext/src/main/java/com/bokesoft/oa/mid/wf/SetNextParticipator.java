package com.bokesoft.oa.mid.wf;

import java.util.ArrayList;

import com.bokesoft.oa.base.OAContext;
import com.bokesoft.oa.mid.GetValueStrByMutilSel;
import com.bokesoft.oa.mid.wf.base.BPMInstance;
import com.bokesoft.oa.mid.wf.base.WorkitemInf;
import com.bokesoft.yigo.common.util.TypeConvertor;
import com.bokesoft.yigo.mid.base.DefaultContext;
import com.bokesoft.yigo.mid.connection.IDBManager;
import com.bokesoft.yigo.mid.service.IExtService;
import com.bokesoft.yigo.struct.datatable.DataTable;

/**
 * 设置下一步参与者
 * 
 * @author minjian
 * 
 */
public class SetNextParticipator implements IExtService {
	@Override
	public Object doCmd(DefaultContext paramDefaultContext, ArrayList<Object> paramArrayList) throws Throwable {
		return setNextParticipator(paramDefaultContext, TypeConvertor.toString(paramArrayList.get(0)),
				paramArrayList.get(1), TypeConvertor.toString(paramArrayList.get(2)),
				TypeConvertor.toLong(paramArrayList.get(3)), TypeConvertor.toLong(paramArrayList.get(4)),
				TypeConvertor.toLong(paramArrayList.get(5)));
	}

	/**
	 * 设置下一步参与者
	 * 
	 * @param context
	 *            上下文对象
	 * @param tableName
	 *            字典的主表名称
	 * @param dicIds
	 *            字典的OID对象
	 * @param workItemID
	 *            审批项目ID
	 * @param 操作员ID
	 * @return 设置完成返回true
	 * @throws Throwable
	 */
	public static Boolean setNextParticipator(DefaultContext context, String tableName, Object dicIds,
			String workflowBillKey, Long workflowOID, Long workItemID, Long operatorID) throws Throwable {
		String sql = "";
		String ids = GetValueStrByMutilSel.getValueStrByMutilSel(context, dicIds);
		if (ids.length() <= 0) {
			return true;
		}
		OAContext oaContext = new OAContext(context);
		WorkitemInf workitemInf = oaContext.getWorkitemInfMap().get(workItemID);
		if (workitemInf == null) {
			return true;
		}
		BPMInstance bPMInstance = workitemInf.getHeadBase();
		String pkKey = bPMInstance.getProcesskey();
		Integer nodeID = workitemInf.getNodeID();
		// 如果OID字符串为0，表示全选
		if (ids.equalsIgnoreCase("0")) {
			sql = "SELECT OID FROM " + tableName + " WHERE OID>-1 AND STATUS >-1";
		} else {
			sql = "SELECT OID FROM " + tableName + " WHERE OID in(" + ids + ")";
		}
		IDBManager dbm = context.getDBManager();
		String deleteSql = "delete from OA_NextParticipator where WorkflowBillKey=? and WorkflowOID=? and WorkflowKey=? and NodeId=? and WorkitemID=? and OperatorID=?";
		dbm.execPrepareUpdate(deleteSql, workflowBillKey, workflowOID, pkKey, nodeID, workItemID, operatorID);
		DataTable dt = context.getDBManager().execQuery(sql);
		dt.beforeFirst();
		while (dt.next()) {
			Long oid = context.applyNewOID();
			Long participatorID = dt.getLong("OID");
			String insertSql = "insert into OA_NextParticipator (OID,SOID,POID,VERID,DVERID,WorkflowBillKey,WorkflowOID,WorkflowKey,NodeID,WorkitemID,OperatorID,ParticipatorID) values(?,?,null,0,0,?,?,?,?,?,?,?)";
			dbm.execPrepareUpdate(insertSql, oid, oid, workflowBillKey, workflowOID, pkKey, nodeID, workItemID,
					operatorID, participatorID);
		}
		return true;
	}
}
