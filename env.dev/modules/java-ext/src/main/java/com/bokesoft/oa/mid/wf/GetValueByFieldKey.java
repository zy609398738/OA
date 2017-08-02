package com.bokesoft.oa.mid.wf;

import java.util.ArrayList;

import com.bokesoft.oa.base.OAContext;
import com.bokesoft.oa.mid.wf.base.BPMInstance;
import com.bokesoft.oa.mid.wf.base.OperatorSel;
import com.bokesoft.oa.mid.wf.base.WorkitemInf;
import com.bokesoft.oa.mid.wf.base.WorkflowDesigneDtl;
import com.bokesoft.oa.mid.wf.base.WorkflowTypeDtl;
import com.bokesoft.yes.common.util.StringUtil;
import com.bokesoft.yigo.common.util.TypeConvertor;
import com.bokesoft.yigo.mid.base.DefaultContext;
import com.bokesoft.yigo.mid.service.IExtService;
import com.bokesoft.yigo.struct.datatable.DataTable;

/**
 * 根据字段标识获得流程设计中当前节点的对应人员
 *
 */
public class GetValueByFieldKey implements IExtService {

	@Override
	public Object doCmd(DefaultContext paramDefaultContext, ArrayList<Object> paramArrayList) throws Throwable {
		return getValueByFieldKey(paramDefaultContext, TypeConvertor.toLong(paramArrayList.get(0)),
				TypeConvertor.toString(paramArrayList.get(1)), TypeConvertor.toLong(paramArrayList.get(2)),
				TypeConvertor.toString(paramArrayList.get(3)), TypeConvertor.toLong(paramArrayList.get(4)));
	}

	/**
	 * 根据字段标识获得流程设计中当前节点的对应人员
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
	public String getValueByFieldKey(DefaultContext context, Long workItemID, String formKey, Long workflowTypeDtlID,
			String operatorSelKey, Long billOid) throws Throwable {
		String ids = "";
		OAContext oaContext = new OAContext(context);
		WorkitemInf workitemInf = oaContext.getWorkitemInfMap().get(workItemID);
		if (workitemInf == null) {
			return ids;
		}
		BPMInstance bPMInstance = workitemInf.getHeadBase();
		String pkKey = bPMInstance.getProcesskey();
		Integer nodeID = workitemInf.getNodeID();

		WorkflowTypeDtl workflowTypeDt = oaContext.getWorkflowTypeDtlMap().get(formKey, pkKey, workflowTypeDtlID);
		if (workflowTypeDt == null) {
			return ids;
		}

		WorkflowDesigneDtl curNode = workflowTypeDt.getWorkflowDesigneDtl(nodeID.toString());
		if (curNode == null) {
			return ids;
		}
		if (StringUtil.isBlankOrNull(operatorSelKey)) {
			operatorSelKey = "SendOptOID";
		}
		OperatorSel sendOptSel = curNode.getOperatorSelMap().get(operatorSelKey);
		if (sendOptSel == null) {
			return ids;
		}
		String participatorIDs = sendOptSel.getParticipatorIDs(billOid, ",");
		String participatorSql = "Select OID,Name From sys_operator o where OID in(" + participatorIDs
				+ ") order by Code";
		DataTable participatorDt = context.getDBManager().execQuery(participatorSql);
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
