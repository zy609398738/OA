package com.bokesoft.oa.mid.wf;

import java.util.Date;

import com.bokesoft.oa.base.OAContext;
import com.bokesoft.oa.mid.message.Message;
import com.bokesoft.oa.mid.message.MessageSet;
import com.bokesoft.oa.mid.message.SendMessage;
import com.bokesoft.oa.mid.wf.base.OperatorSel;
import com.bokesoft.oa.mid.wf.base.OperatorSelDtlMap;
import com.bokesoft.oa.mid.wf.base.WorkflowDesigneDtl;
import com.bokesoft.oa.mid.wf.base.WorkflowTypeDtl;
import com.bokesoft.oa.mid.wf.base.WorkitemInf;
import com.bokesoft.yes.bpm.engine.common.BPMContext;
import com.bokesoft.yes.bpm.workitem.Workitem;
import com.bokesoft.yigo.bpm.dev.IBPMNodeAction;
import com.bokesoft.yigo.bpm.dev.Spoon;
import com.bokesoft.yigo.meta.bpm.process.MetaProcess;
import com.bokesoft.yigo.meta.bpm.process.node.MetaServiceTask;
import com.bokesoft.yigo.meta.dataobject.MetaDataObject;
import com.bokesoft.yigo.struct.datatable.DataTable;
import com.bokesoft.yigo.struct.document.Document;

public class BPMNodeEmail implements IBPMNodeAction {

	@Override
	public void doAction(BPMContext context, MetaProcess process, MetaServiceTask serviceTask, Spoon spoon)
			throws Throwable {
		OAContext oaContext = new OAContext(context);
		Document doc = context.getDocument();
		String formKey = context.getFormKey();
		String processKey = process.getKey();
		Long oid = context.getOID();
		Integer nodeID = serviceTask.getID();
		Long instanceID = context.getActiveBPMInstance().getInstanceID();
		Workitem workitem = context.getUpdateWorkitem();
		Long workitemID = -1L;
		if (workitem == null) {
			workitemID = -1L;
		} else {
			workitemID = workitem.getWorkItemID();
		}
		WorkflowTypeDtl workflowTypeDtl = oaContext.getWorkflowTypeDtlMap().getWorkflowTypeDtl(formKey, processKey,
				oid);
		WorkflowDesigneDtl workflowDesigneDtl = workflowTypeDtl.getWorkflowDesigne().getWorkflowDesigneDtlMap()
				.get(nodeID.toString());
		OperatorSel emailOpt = workflowDesigneDtl.getCarbonCopyPerSel();
		
		if (emailOpt == null) {
			return;
		}
		OperatorSelDtlMap operatorSelDtlMap = emailOpt.getOperatorSelDtlMap();
		if (operatorSelDtlMap.size()==0) {
			return;
		}
		Long preWorkitemID = GetParentWorkitemID.getParentWorkitemID(context, workitemID);
		WorkitemInf workitemInf = null;
		String operationName = "";
		if (preWorkitemID > 0) {
			workitemInf = oaContext.getWorkitemInfMap().get(preWorkitemID);
			operationName = workitemInf.getBPMLog().getWorkitemName();
		} else if (workitemID > 0) {
			workitemInf = oaContext.getWorkitemInfMap().get(workitemID);
			operationName = workitemInf.getBPMLog().getWorkitemName();
		} else {
			operationName = "提交（Commit）";
		}
		MessageSet messageSet = emailOpt.getMessageSet();
		String sendFormula = emailOpt.getSendFormula();
		String emailTemp = emailOpt.getEmailTemp();
		String emailType = emailOpt.getEmailType();
		// 如果发送方式为空，找指定操作发送方式
		if (messageSet == null) {
			throw new Error("当前节点未设置发送方式，请重新选择发送方式");
		}

		MetaDataObject mdo = doc.getMetaDataObject();
		String mainTableKey = mdo.getMainTableKey();
		DataTable srcDt = doc.get(mainTableKey);
		String topic = "";
		if (srcDt != null && srcDt.getMetaData().constains("Topic")) {
			topic = srcDt.getString("Topic");
		} else {
			topic = srcDt.getString("NO");
		}
		String billNO = srcDt.getString("NO");
		Long userID = context.getUserID();
		String copyUserIDs = "";
		if (emailOpt != null && emailOpt.getOperatorSelDtlMap().size() > 0) {
			copyUserIDs = emailOpt.getParticipatorIDs(oid, ",");
		}
		Long dataOID = context.applyNewOID();
		String insertSql = "insert into OA_InstanceEmailMark (OID,SOID,InstanceID,WorkitemID,operatorIDs,formkey,billoid,emailtype,nodeid,inserttime) values (?,?,?,?,?,?,?,?,?,?)";
		context.getDBManager().execPrepareUpdate(insertSql, dataOID, dataOID, instanceID, workitemID, copyUserIDs,
				formKey, oid, emailType,nodeID,new Date());
		Message message = new Message(oaContext, false, false, new Date(), userID, topic, operationName, copyUserIDs,
				"", messageSet, formKey, billNO, oid);
		message.setSendFormula(sendFormula);
		message.setEmailTemp(emailTemp);
		if (workitemID > 0) {
			WorkitemInf workiteminfo = oaContext.getWorkitemInfMap().get(workitemID);
			message.setWorkitemInf(workiteminfo);
		}
		if (preWorkitemID > 0) {
			message.setPreWorkitemInf(oaContext.getWorkitemInfMap().get(preWorkitemID));
			Long preOperatorID = -1L;
			String sql1 = "select operatorid from wf_workitem where workitemid = ? and nodeid =?";
			DataTable parentWidDt = context.getDBManager().execPrepareQuery(sql1, preWorkitemID,nodeID);
			
			if (parentWidDt.size() > 0) {
				parentWidDt.first();
				preOperatorID = parentWidDt.getLong("operatorid");
				message.setPreOperator(oaContext.getOperatorMap().get(preOperatorID));
			}
		}
		SendMessage.sendMessage(oaContext, message);
	}
}
