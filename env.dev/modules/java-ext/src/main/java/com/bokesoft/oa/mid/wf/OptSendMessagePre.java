package com.bokesoft.oa.mid.wf;

import java.util.ArrayList;
import java.util.Date;

import com.bokesoft.oa.base.OAContext;
import com.bokesoft.oa.mid.message.Message;
import com.bokesoft.oa.mid.message.MessageSet;
import com.bokesoft.oa.mid.message.SendMessage;
import com.bokesoft.oa.mid.wf.base.BPMInstance;
import com.bokesoft.oa.mid.wf.base.Operation;
import com.bokesoft.oa.mid.wf.base.OperationSel;
import com.bokesoft.oa.mid.wf.base.OperationSelDtl;
import com.bokesoft.oa.mid.wf.base.OperatorSel;
import com.bokesoft.oa.mid.wf.base.WorkflowDesigneDtl;
import com.bokesoft.oa.mid.wf.base.WorkflowTypeDtl;
import com.bokesoft.oa.mid.wf.base.WorkitemInf;
import com.bokesoft.yes.common.util.StringUtil;
import com.bokesoft.yigo.common.util.TypeConvertor;
import com.bokesoft.yigo.meta.dataobject.MetaDataObject;
import com.bokesoft.yigo.mid.base.DefaultContext;
import com.bokesoft.yigo.mid.service.IExtService;
import com.bokesoft.yigo.struct.datatable.DataTable;
import com.bokesoft.yigo.struct.document.Document;

/**
 * 指定前一节点发送消息
 * 
 */
public class OptSendMessagePre implements IExtService {

	@Override
	public Object doCmd(DefaultContext paramDefaultContext, ArrayList<Object> paramArrayList) throws Throwable {
		return optSendMessagePre(paramDefaultContext, TypeConvertor.toString(paramArrayList.get(0)),
				TypeConvertor.toString(paramArrayList.get(1)), TypeConvertor.toLong(paramArrayList.get(2)),
				TypeConvertor.toLong(paramArrayList.get(3)), TypeConvertor.toDate(paramArrayList.get(4)),
				TypeConvertor.toLong(paramArrayList.get(5)), TypeConvertor.toString(paramArrayList.get(6)),
				TypeConvertor.toLong(paramArrayList.get(7)), TypeConvertor.toLong(paramArrayList.get(8)));
	}

	/**
	 * 指定前一节点发送消息
	 * 
	 * @param context
	 *            上下文对象
	 * @param formKey
	 *            表单的key
	 * @param optKey
	 *            审批操作字典的代码标识
	 * @param workItemID
	 *            当前工作项标识的id
	 * @param workflowTypeDtlID
	 *            明细表id
	 * @param ids
	 *            指定发送人员的字符串，以“,”分隔
	 * @param preWorkitemID
	 *            前一个工作项ID
	 * @param preOperatorID
	 *            前一个审批人员ID
	 * @return 不发送返回false,发送成功返回true
	 * @throws Throwable
	 */
	public static Object optSendMessagePre(DefaultContext context, String formKey, String optKey, Long workItemID,
			Long oid, Date time, Long workflowTypeDtlID, String ids, Long preWorkitemID, Long preOperatorID)
					throws Throwable {
		boolean sendMessage = false;
		Document srcDoc = context.getDocument();
		if (optKey == null || oid == null || oid <= 0) {
			return sendMessage;
		}
		OAContext oaContext = new OAContext(context);
		WorkitemInf workitemInf = null;
		if (preWorkitemID > 0) {
			workitemInf = oaContext.getWorkitemInfMap().get(preWorkitemID);
		} else {
			workitemInf = oaContext.getWorkitemInfMap().get(workItemID);
		}
		if (workitemInf == null) {
			return sendMessage;
		}
		BPMInstance bPMInstance = workitemInf.getHeadBase();
		Integer nodeID = workitemInf.getNodeID();
		Long instanceID = bPMInstance.getOID();
		String pkKey = bPMInstance.getProcesskey();
		WorkflowTypeDtl workflowTypeDt = oaContext.getWorkflowTypeDtlMap().get(formKey, pkKey, workflowTypeDtlID);
		WorkflowDesigneDtl workflowDesigneDtl = workflowTypeDt.getWorkflowDesigneDtl(nodeID.toString());
		if (workflowDesigneDtl == null) {
			return sendMessage;
		}
		MessageSet messageSet = null;
		String sendFormula = "";
		String emailTemp = "";
		String emailType = "";
		OperationSel operationSel = workflowDesigneDtl.getAuditOptSel();
		OperationSelDtl operationSelDtl = null;
		if (operationSel != null) {
			operationSelDtl = operationSel.getOperationSelDtlMap().get(optKey);
			if (operationSelDtl != null) {
				messageSet = operationSelDtl.getMessageSet();
				sendFormula = operationSelDtl.getSendFormula();
				emailTemp = operationSelDtl.getEmailTemp();
				emailType = operationSelDtl.getEmailType();
			}
		}
		String operationName = workitemInf.getBPMLog().getWorkitemName();
		String content = "审批工作项：" + operationName;
		Operation operation = null;
		if (messageSet == null) {
			messageSet = workflowTypeDt.getMessageSetEnd();
			sendFormula = workflowTypeDt.getSendFormulaEnd();
			emailTemp = workflowTypeDt.getEmailTempEnd();
			emailType = workflowTypeDt.getEmailTypeEnd();
		}
		// 如果发送方式为空，找指定操作发送方式
		if (messageSet == null) {
			operation = oaContext.getOperationMap().get(optKey);
			if (operation != null) {
				messageSet = operation.getMessageSet();
				sendFormula = operation.getSendFormula();
				emailTemp = operation.getEmailTemp();
				emailType = operation.getEmailType();
				// 如果发送方式还为空，直接返回
				if (messageSet == null) {
					return sendMessage;
				}
			} else {
				return sendMessage;
			}
		}

		if (!StringUtil.isBlankOrNull(ids)) {
			Long dataOID = context.applyNewOID();
			String insertSql = "insert into OA_InstanceEmailMark (OID,SOID,InstanceID,WorkitemID,operatorIDs,formkey,billoid,emailtype,nodeid,inserttime) values (?,?,?,?,?,?,?,?,?,?)";
			context.getDBManager().execPrepareUpdate(insertSql, dataOID, dataOID, instanceID, workItemID, ids, formKey,
					oid, emailType,nodeID,new Date());
			MetaDataObject mdo = srcDoc.getMetaDataObject();
			String mainTableKey = mdo.getMainTableKey();
			DataTable srcDt = srcDoc.get(mainTableKey);
			String topic = "";
			if (srcDt != null && srcDt.getMetaData().constains("Topic")) {
				topic = srcDt.getString("Topic");
			} else {
				topic = srcDt.getString("NO");
			}
			String billNO = srcDt.getString("NO");
			Long userID = context.getVE().getEnv().getUserID();
			String copyUserIDs = "";
			if (operationSelDtl != null) {
				OperatorSel ccOptSel = operationSelDtl.getCcOptSel();
				if (ccOptSel != null && ccOptSel.getOperatorSelDtlMap().size() > 0) {
					copyUserIDs = ccOptSel.getParticipatorIDs(oid, ",");
				}
			}
			Message message = new Message(oaContext, false, false, time, userID, topic, content, ids, copyUserIDs,
					messageSet, formKey, billNO, oid);
			message.setSendFormula(sendFormula);
			message.setEmailTemp(emailTemp);
			WorkitemInf workitem = oaContext.getWorkitemInfMap().get(workItemID);
			message.setWorkitemInf(workitem);
			if (preWorkitemID > 0) {
				message.setPreWorkitemInf(oaContext.getWorkitemInfMap().get(preWorkitemID));
			}
			if (preOperatorID > 0) {
				message.setPreOperator(oaContext.getOperatorMap().get(preOperatorID));
			}
			sendMessage = SendMessage.sendMessage(oaContext, message);
		}

		return sendMessage;
	}
}
