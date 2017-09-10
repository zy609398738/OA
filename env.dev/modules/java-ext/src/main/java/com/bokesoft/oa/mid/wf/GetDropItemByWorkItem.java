package com.bokesoft.oa.mid.wf;

import java.util.ArrayList;

import com.bokesoft.oa.base.OAContext;
import com.bokesoft.oa.mid.wf.base.BPMInstance;
import com.bokesoft.oa.mid.wf.base.OperatorSel;
import com.bokesoft.oa.mid.wf.base.Workflow;
import com.bokesoft.oa.mid.wf.base.WorkflowDesigneDtl;
import com.bokesoft.oa.mid.wf.base.WorkflowTypeDtl;
import com.bokesoft.oa.mid.wf.base.WorkitemInf;
import com.bokesoft.yes.bpm.engine.common.BPMContext;
import com.bokesoft.yes.bpm.service.cmd.GetNextNodeParticipatorCmd;
import com.bokesoft.yes.common.util.StringUtil;
import com.bokesoft.yigo.common.util.TypeConvertor;
import com.bokesoft.yigo.mid.base.DefaultContext;
import com.bokesoft.yigo.mid.service.IExtService;
import com.bokesoft.yigo.struct.datatable.DataTable;
import com.bokesoft.yigo.struct.usrpara.Paras;

/**
 * 根据流程项目获得流程的参与者下拉字符串
 *
 */
public class GetDropItemByWorkItem implements IExtService {

	@Override
	public Object doCmd(DefaultContext paramDefaultContext, ArrayList<Object> paramArrayList) throws Throwable {
		return getDropItemByWorkItem(paramDefaultContext, TypeConvertor.toLong(paramArrayList.get(0)),
				TypeConvertor.toString(paramArrayList.get(1)), TypeConvertor.toLong(paramArrayList.get(2)),
				TypeConvertor.toString(paramArrayList.get(3)), TypeConvertor.toLong(paramArrayList.get(4)));
	}

	/**
	 * 根据流程项目获得流程的参与者下拉字符串
	 * 
	 * @param context
	 *            上下文对象
	 * @param workItemID
	 *            流程工作项
	 * @param formKey
	 *            流程单据Key
	 * @param workflowTypeDtlID
	 *            流程类别明细ID
	 * @param operatorSelKey
	 *            人员选择字段的Key
	 * @param billOid
	 *            当前单据明细ID
	 * @return 参与者下拉字符串
	 */
	public String getDropItemByWorkItem(DefaultContext context, Long workItemID, String formKey, Long workflowTypeDtlID,
			String operatorSelKey, Long billOid) throws Throwable {
		String ids = "";
		// 将流程类别明细ID设置到上下文对象的参数集合中，以便后面获取流程类别明细对象时调用
		Paras paras = context.getParas();
		if (paras == null) {
			paras = context.ensureParas();
		}
		paras.put(Workflow.WorkflowTypeDtlID, workflowTypeDtlID);
		DataTable participatorDt = getNextNodeParticipator(context, workItemID, formKey, workflowTypeDtlID,
				operatorSelKey, billOid);
		if (participatorDt == null || participatorDt.size() <= 0) {
			return ids;
		}

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

	/**
	 * 根据当前审批节点获得下一个审批节点的参与者
	 * 
	 * @param context
	 *            上下文对象
	 * @param workItemID
	 *            流程工作项
	 * @param formKey
	 *            流程单据Key
	 * @param workflowTypeDtlID
	 *            流程类别明细ID
	 * @param operatorSelKey
	 *            人员选择字段的Key
	 * @param billOid
	 *            当前单据明细ID
	 * @return 下一个审批节点的参与者
	 * @throws Throwable
	 */
	public static DataTable getNextNodeParticipator(DefaultContext context, Long workItemID, String formKey,
			Long workflowTypeDtlID, String operatorSelKey, Long billOid) throws Throwable {
		OAContext oaContext = new OAContext(context);
		WorkitemInf workitemInf = oaContext.getWorkitemInfMap().get(workItemID);
		if (workitemInf == null) {
			return null;
		}
		BPMInstance bPMInstance = workitemInf.getHeadBase();

		GetNextNodeParticipatorCmd cmd = new GetNextNodeParticipatorCmd(context, workItemID,
				bPMInstance.getProcesskey());
		DataTable dt = null;
		BPMContext bpmc = new BPMContext(context);
		try {
			dt = (DataTable) cmd.doCmd(bpmc);
		} catch (Throwable e) {
			// TODO 作为临时措施，暂时处理错误，后面等平台改正
			e.printStackTrace();
			try {
				Integer nodeID = bpmc.getActiveNodeID();
				String pkKey = bPMInstance.getProcesskey();
				WorkflowTypeDtl workflowTypeDt = oaContext.getWorkflowTypeDtlMap().get(context.getFormKey(), pkKey,
						workflowTypeDtlID);
				WorkflowDesigneDtl workflowDesigneDtl = workflowTypeDt.getWorkflowDesigneDtl(nodeID.toString());
				if (workflowDesigneDtl == null) {
					return null;
				}
				if (StringUtil.isBlankOrNull(operatorSelKey)) {
					operatorSelKey = "AuditPerOID";
				}
				OperatorSel operatorSel = workflowDesigneDtl.getOperatorSelMap().get(operatorSelKey);
				if (operatorSel == null) {
					return null;
				}
				String participatorIDs = operatorSel.getParticipatorIDs(billOid, ",");
				String participatorSql = "Select OID,Name From sys_operator o where OID in(" + participatorIDs
						+ ") order by Code";
				dt = context.getDBManager().execQuery(participatorSql);
			} catch (Throwable e1) {
				// TODO 作为临时措施，暂时处理错误，后面等平台改正
				e.printStackTrace();
			}

		}
		return dt;
	}
}
