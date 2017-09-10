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
import com.bokesoft.yigo.mid.service.IExtService;
import com.bokesoft.yigo.struct.datatable.DataTable;
import com.bokesoft.yigo.struct.document.Document;

/*
 * 审批操作通过之后发送消息
 * 
 */
public class OptSendMessageEnd implements IExtService {

	@Override
	public Object doCmd(DefaultContext paramDefaultContext, ArrayList<Object> paramArrayList) throws Throwable {
		return optSendMessageReject(paramDefaultContext, TypeConvertor.toString(paramArrayList.get(0)),
				TypeConvertor.toString(paramArrayList.get(1)), TypeConvertor.toLong(paramArrayList.get(2)),
				TypeConvertor.toLong(paramArrayList.get(3)), TypeConvertor.toDate(paramArrayList.get(4)),
				TypeConvertor.toLong(paramArrayList.get(5)),TypeConvertor.toLong(paramArrayList.get(6)));
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
	public static Object optSendMessageReject(DefaultContext context, String formKey, String optKey, Long workItemID,
			Long oid, Date time, Long workflowTypeDtlID,Long creatorID) throws Throwable, Error {
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
		String content = "审批工作项：" + operationName;
		MessageSet messageSet = workflowTypeDt.getMessageSet();
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
			}else{
				return sendMessage;
			}
		}
		String ids=TypeConvertor.toString(creatorID);
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
		if (!StringUtil.isBlankOrNull(ids)) {
			Message message = new Message(oaContext, false, false, time, userID, topic, content, ids, null, messageSet,
					formKey, billNO, oid);
			message.setSendFormula(sendFormula);
			message.setEmailTemp(emailTemp);
			message.setWorkitemInf(workitemInf);
			sendMessage = SendMessage.sendMessage(oaContext, message);
		}

		return sendMessage;
	}
}
