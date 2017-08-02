package com.bokesoft.oa.mid.wf;

import java.util.ArrayList;
import java.util.Date;

import com.bokesoft.oa.base.OAContext;
import com.bokesoft.oa.mid.message.Message;
import com.bokesoft.oa.mid.message.MessageSet;
import com.bokesoft.oa.mid.message.SendMessage;
import com.bokesoft.oa.mid.wf.base.BPMInstance;
import com.bokesoft.oa.mid.wf.base.OperationSel;
import com.bokesoft.oa.mid.wf.base.OperationSelDtl;
import com.bokesoft.oa.mid.wf.base.OperatorSel;
import com.bokesoft.oa.mid.wf.base.WorkflowDesigneDtl;
import com.bokesoft.oa.mid.wf.base.WorkflowTypeDtl;
import com.bokesoft.oa.mid.wf.base.WorkitemInf;
import com.bokesoft.yes.common.util.StringUtil;
import com.bokesoft.yigo.common.util.TypeConvertor;
import com.bokesoft.yigo.mid.base.DefaultContext;
import com.bokesoft.yigo.mid.connection.IDBManager;
import com.bokesoft.yigo.mid.service.IExtService;
import com.bokesoft.yigo.struct.datatable.DataTable;

/*
 * 审批操作通过之后发送消息
 * 
 */
public class OptSendMessage implements IExtService {

	@Override
	public Object doCmd(DefaultContext paramDefaultContext, ArrayList<Object> paramArrayList) throws Throwable {
		return optSendMessage(paramDefaultContext, TypeConvertor.toString(paramArrayList.get(0)),
				TypeConvertor.toString(paramArrayList.get(1)), TypeConvertor.toLong(paramArrayList.get(2)),
				TypeConvertor.toLong(paramArrayList.get(3)), TypeConvertor.toDate(paramArrayList.get(4)),
				TypeConvertor.toLong(paramArrayList.get(5)));
	}

	/**
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
	 * @throws Error
	 */
	public static Object optSendMessage(DefaultContext context, String formKey, String optKey, Long workItemID,
			Long oid, Date time, Long workflowTypeDtlID) throws Throwable, Error {
		boolean sendMessage = false;
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
		if (operationSelDtl == null) {
			return sendMessage;
		}
		String operationName = workitemInf.getWFWorkitem().getWorkitemName();
		String content = "工作项：" + operationName;
		MessageSet messageSet = operationSelDtl.getMessageSet();
		if (messageSet == null) {
			return sendMessage;
		}
		String sql = "SELECT p.operatorid FROM (SELECT l.workitemid FROM BPM_LOG l WHERE EXISTS(SELECT INSTANCEID FROM BPM_INSTANCE i WHERE OID = "
				+ oid + " AND i.INSTANCEID = l.INSTANCEID)) wi JOIN WF_PARTICIPATOR p ON wi.workitemid = p.workitemid";
		String ids = "";
		IDBManager dbManager = context.getDBManager();
		DataTable dtQuery = dbManager.execPrepareQuery(sql);
		dtQuery.beforeFirst();
		while (dtQuery.next()) {
			ids = ids + "," + dtQuery.getLong("operatorid");
		}
		if (ids.length() > 0) {
			ids = ids.substring(1);
		}

		String topic = oaContext.getwFMigrationMap().get(oid).getTopic();
		String billNO = oaContext.getwFMigrationMap().get(oid).getBillNO();
		Long userID = context.getVE().getEnv().getUserID();
		if (!StringUtil.isBlankOrNull(ids)) {
			Message message = new Message(oaContext, false, false, "", time, userID, topic, content, ids, messageSet,
					formKey, billNO, oid);
			message.setEmailTemp(operationSelDtl.getEmailTemp());
			sendMessage = SendMessage.sendMessage(oaContext, message);
		}

		OperatorSel ccOptSel = operationSelDtl.getCcOptSel();
		if (ccOptSel != null && ccOptSel.getOperatorSelDtlMap().size() > 0) {
			ids = ccOptSel.getParticipatorIDs(oid);
			if (!StringUtil.isBlankOrNull(ids)) {
				Message message = new Message(oaContext, false, false, "", time, userID, topic, content, ids,
						messageSet, formKey, billNO, oid);
				sendMessage = SendMessage.sendMessage(oaContext, message);
			}
		}
		return sendMessage;
	}
}
