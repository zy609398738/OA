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
import com.bokesoft.oa.mid.wf.base.WorkflowDesigneDtl;
import com.bokesoft.oa.mid.wf.base.WorkflowTypeDtl;
import com.bokesoft.oa.mid.wf.base.WorkitemInf;
import com.bokesoft.yes.common.util.StringUtil;
import com.bokesoft.yigo.common.util.TypeConvertor;
import com.bokesoft.yigo.meta.dataobject.MetaDataObject;
import com.bokesoft.yigo.mid.base.DefaultContext;
import com.bokesoft.yigo.mid.connection.IDBManager;
import com.bokesoft.yigo.mid.service.IExtService;
import com.bokesoft.yigo.struct.datatable.DataTable;
import com.bokesoft.yigo.struct.document.Document;

/**
 * 拒绝操作之后发送消息
 * 
 */
public class OptSendMessageRefuse implements IExtService {

	@Override
	public Object doCmd(DefaultContext paramDefaultContext, ArrayList<Object> paramArrayList) throws Throwable {
		return optSendMessageReject(paramDefaultContext, TypeConvertor.toString(paramArrayList.get(0)),
				TypeConvertor.toString(paramArrayList.get(1)), TypeConvertor.toLong(paramArrayList.get(2)),
				TypeConvertor.toLong(paramArrayList.get(3)), TypeConvertor.toDate(paramArrayList.get(4)),
				TypeConvertor.toLong(paramArrayList.get(5)));
	}

	/**
	 * 拒绝操作通过之后发送消息
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
	 * @return 不发送返回false,发送成功返回true
	 * @throws Throwable
	 */
	public static Object optSendMessageReject(DefaultContext context, String formKey, String optKey, Long workItemID,
			Long oid, Date time, Long workflowTypeDtlID) throws Throwable {
		boolean sendMessage = false;
		Document srcDoc = context.getDocument();
		if (optKey == null || oid == null || oid <= 0) {
			return sendMessage;
		}
		OAContext oaContext = new OAContext(context);
		WorkitemInf workitemInf = oaContext.getWorkitemInfMap().get(workItemID);
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
		OperationSel operationSel = workflowDesigneDtl.getAuditOptSel();
		if (operationSel == null) {
			return sendMessage;
		}
		OperationSelDtl operationSelDtl = operationSel.getOperationSelDtlMap().get(optKey);
		String operationName = workitemInf.getBPMLog().getWorkitemName();
		String content = "审批工作项：" + operationName;
		MessageSet messageSet = new MessageSet(oaContext);
		String sendFormula = "";
		String emailTemp = "";
		String emailType = "";
		if (operationSelDtl == null) {
			Operation operation = null;
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
			}
		} else {
			messageSet = operationSelDtl.getMessageSet();
			sendFormula = operationSelDtl.getSendFormula();
			emailTemp = operationSelDtl.getEmailTemp();
			emailType = operationSelDtl.getEmailType();
			// 如果发送方式为空，找指定操作发送方式
			if (messageSet == null) {
				return sendMessage;
			}
		}
		IDBManager dbManager = context.getDBManager();
		Long loginID = context.getUserID();
		String sql = "SELECT l.operatorID FROM BPM_Log l WHERE l.WorkitemState<>3 and l.instanceID=? AND l.operatorID > 0 union "
				+ "SELECT p.operatorid FROM (SELECT workitemid FROM BPM_LOG WHERE WorkitemState<>3 and INSTANCEID=?) wi JOIN WF_PARTICIPATOR p ON wi.workitemid = p.workitemid";
		String ids = "";
		DataTable dtQuery = dbManager.execPrepareQuery(sql, bPMInstance.getOID(),bPMInstance.getOID());
		dtQuery.beforeFirst();
		while (dtQuery.next()) {
			Long operatorID = dtQuery.getLong("operatorid");
			if (operatorID.equals(loginID)) {
				continue;
			} else {
				ids = ids + "," + operatorID;
			}
		}
		if (ids.length() > 0) {
			ids = ids.substring(1);
		}
		if (!StringUtil.isBlankOrNull(ids)) {
			Long dataOID = context.applyNewOID();
			String insertSql = "insert into OA_InstanceEmailMark (OID,SOID,InstanceID,WorkitemID,operatorIDs,formkey,billoid,emailtype,nodeid,inserttime) values (?,?,?,?,?,?,?,?,?,?)";
			dbManager.execPrepareUpdate(insertSql, dataOID, dataOID, instanceID, workItemID, ids, formKey, oid,
					emailType, nodeID, new Date());
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
			Message message = new Message(oaContext, false, false, time, loginID, topic, content, ids, null, messageSet,
					formKey, billNO, oid);
			message.setSendFormula(sendFormula);
			message.setEmailTemp(emailTemp);
			message.setWorkitemInf(workitemInf);
			sendMessage = SendMessage.sendMessage(oaContext, message);
		}

		return sendMessage;
	}
}
