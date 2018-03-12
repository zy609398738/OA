package com.bokesoft.oa.mid.wf;

import java.util.ArrayList;
import java.util.Date;

import com.bokesoft.oa.base.OAContext;
import com.bokesoft.oa.mid.message.Message;
import com.bokesoft.oa.mid.message.MessageSet;
import com.bokesoft.oa.mid.message.SendMessage;
import com.bokesoft.oa.mid.wf.base.Operation;
import com.bokesoft.oa.mid.wf.base.WorkitemInf;
import com.bokesoft.yes.common.util.StringUtil;
import com.bokesoft.yigo.common.util.TypeConvertor;
import com.bokesoft.yigo.meta.dataobject.MetaDataObject;
import com.bokesoft.yigo.mid.base.DefaultContext;
import com.bokesoft.yigo.mid.service.IExtService;
import com.bokesoft.yigo.struct.datatable.DataTable;
import com.bokesoft.yigo.struct.document.Document;

/**
 * 审批操作之后指定操作发送消息 </br>
 * 独立指定一个审批操作字典中的对应操作发送消息，不涉及流程设置
 * 
 */
public class OptSendMessageOperation implements IExtService {

	@Override
	public Object doCmd(DefaultContext paramDefaultContext, ArrayList<Object> paramArrayList) throws Throwable {
		return optSendMessageOperation(paramDefaultContext, TypeConvertor.toString(paramArrayList.get(0)),
				TypeConvertor.toString(paramArrayList.get(1)), TypeConvertor.toLong(paramArrayList.get(2)),
				TypeConvertor.toLong(paramArrayList.get(3)), TypeConvertor.toDate(paramArrayList.get(4)),
				TypeConvertor.toString(paramArrayList.get(5)));
	}

	/**
	 * 审批操作之后指定操作发送消息 </br>
	 * 独立指定一个审批操作字典中的对应操作发送消息，不涉及流程设置
	 * 
	 * @param context
	 *            上下文对象
	 * @param formKey
	 *            表单的key
	 * @param optKey
	 *            审批操作字典的代码标识
	 * @param workItemID
	 *            当前工作项标识的id
	 * @param ids
	 *            指定发送人员的字符串，以“,”分隔
	 * @return 不发送返回false,发送成功返回true
	 * @throws Throwable
	 */
	public static Object optSendMessageOperation(DefaultContext context, String formKey, String optKey, Long workItemID,
			Long oid, Date time, String ids) throws Throwable {
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
		Long instanceID = workitemInf.getInstanceID();
		Integer nodeID = workitemInf.getNodeID();
		String operationName = workitemInf.getBPMLog().getWorkitemName();
		String content = "审批工作项：" + operationName;
		Operation operation = oaContext.getOperationMap().get(optKey);
		if (operation == null) {
			return sendMessage;
		}

		MessageSet messageSet = operation.getMessageSet();
		String sendFormula = operation.getSendFormula();
		String emailTemp = operation.getEmailTemp();
		String emailType = operation.getEmailType();
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
			Message message = new Message(oaContext, false, false, time, userID, topic, content, ids, copyUserIDs,
					messageSet, formKey, billNO, oid);
			message.setSendFormula(sendFormula);
			message.setEmailTemp(emailTemp);
			message.setWorkitemInf(workitemInf);
			sendMessage = SendMessage.sendMessage(oaContext, message);
		}

		return sendMessage;
	}
}
