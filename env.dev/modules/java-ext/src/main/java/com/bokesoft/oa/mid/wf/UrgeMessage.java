package com.bokesoft.oa.mid.wf;

import java.util.ArrayList;
import java.util.Date;

import com.bokesoft.oa.base.OAContext;
import com.bokesoft.oa.mid.message.Message;
import com.bokesoft.oa.mid.message.MessageSet;
import com.bokesoft.oa.mid.message.SendMessage;
import com.bokesoft.oa.mid.wf.base.BPMInstance;
import com.bokesoft.oa.mid.wf.base.Operation;
import com.bokesoft.oa.mid.wf.base.WorkflowDesigneDtl;
import com.bokesoft.oa.mid.wf.base.WorkflowTypeDtl;
import com.bokesoft.oa.mid.wf.base.WorkitemInf;
import com.bokesoft.oa.util.OAUtility;
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
public class UrgeMessage implements IExtService {

	@Override
	public Object doCmd(DefaultContext paramDefaultContext, ArrayList<Object> paramArrayList) throws Throwable {
		return urgeMessage(paramDefaultContext, TypeConvertor.toString(paramArrayList.get(0)),
				TypeConvertor.toLong(paramArrayList.get(1)), TypeConvertor.toLong(paramArrayList.get(2)),
				TypeConvertor.toDate(paramArrayList.get(3)), TypeConvertor.toLong(paramArrayList.get(4)),
				TypeConvertor.toString(paramArrayList.get(5)),TypeConvertor.toString(paramArrayList.get(6)));
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
	public static Object urgeMessage(DefaultContext context, String formKey, Long workItemID, Long oid, Date time,
			Long workflowTypeDtlID, String billNO,String optKey) throws Throwable, Error {
		boolean sendMessage = false;
		OAContext oaContext = new OAContext(context);
		WorkitemInf workitemInf = oaContext.getWorkitemInfMap().get(workItemID);
		if (workitemInf == null) {
			return sendMessage;
		}
		BPMInstance bPMInstance = workitemInf.getHeadBase();
		Integer nodeID = workitemInf.getNodeID();
		String pkKey = bPMInstance.getProcesskey();
		WorkflowTypeDtl workflowTypeDt = oaContext.getWorkflowTypeDtlMap().get(formKey, pkKey, workflowTypeDtlID, oid);
		WorkflowDesigneDtl workflowDesigneDtl = workflowTypeDt.getWorkflowDesigneDtl(nodeID.toString());
		if (workflowDesigneDtl == null) {
			return sendMessage;
		}
		MessageSet messageSet = workflowDesigneDtl.getMessageSet();
		Operation operation = null;
		String sendFormula = workflowTypeDt.getSendFormula();
		String emailTemp = workflowTypeDt.getEmailTemp();
		// 如果发送方式为空，找指定操作发送方式
		if (messageSet == null) {
			operation = oaContext.getOperationMap().get(optKey);
			if (operation != null) {
				messageSet = operation.getMessageSet();
				sendFormula = operation.getSendFormula();
				emailTemp = operation.getEmailTemp();
				// 如果发送方式还为空，直接返回
				if (messageSet == null) {
					return sendMessage;
				}

			}
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
		Long userID = context.getVE().getEnv().getUserID();
		if (!StringUtil.isBlankOrNull(ids)) {
			Message message = new Message(oaContext, false, false, time, userID, "", "", ids, "", messageSet, formKey,
					billNO, oid);
			message.setDocument(OAUtility.loadDocument(context, formKey, oid));
			message.setSendFormula(sendFormula);
			message.setEmailTemp(emailTemp);
			message.setWorkitemInf(workitemInf);
			sendMessage = SendMessage.sendMessage(oaContext, message);
		}

		return sendMessage;
	}
}
