package com.bokesoft.oa.mid.wf;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashSet;
import java.util.Iterator;
import java.util.LinkedHashMap;
import java.util.Map.Entry;
import java.util.Set;

import com.bokesoft.oa.base.OAContext;
import com.bokesoft.oa.mid.message.Message;
import com.bokesoft.oa.mid.message.MessageSet;
import com.bokesoft.oa.mid.message.SendMessage;
import com.bokesoft.oa.mid.wf.base.BPMInstance;
import com.bokesoft.oa.mid.wf.base.Operation;
import com.bokesoft.oa.mid.wf.base.OperationSel;
import com.bokesoft.oa.mid.wf.base.OperationSelDtl;
import com.bokesoft.oa.mid.wf.base.OperatorSel;
import com.bokesoft.oa.mid.wf.base.OperatorSelDtl;
import com.bokesoft.oa.mid.wf.base.OperatorSelDtlMap;
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
 * 审批操作通过之后发送消息
 * 
 */
public class OptSendMessageTSL implements IExtService {

	@Override
	public Object doCmd(DefaultContext paramDefaultContext, ArrayList<Object> paramArrayList) throws Throwable {
		return optSendMessageTSL(paramDefaultContext, TypeConvertor.toString(paramArrayList.get(0)),
				TypeConvertor.toString(paramArrayList.get(1)), TypeConvertor.toLong(paramArrayList.get(2)),
				TypeConvertor.toLong(paramArrayList.get(3)), TypeConvertor.toDate(paramArrayList.get(4)),
				TypeConvertor.toLong(paramArrayList.get(5)), TypeConvertor.toLong(paramArrayList.get(6)),
				TypeConvertor.toLong(paramArrayList.get(7)));
	}

	/**
	 * 审批操作通过之后发送消息
	 * 
	 * @param context
	 *            上下文对象
	 * @param formKey
	 *            表单的key
	 * @param optKey
	 *            审批操作字典的代码标识
	 * @param workItemID
	 *            当前工作项标识
	 * @param workflowTypeDtlID
	 *            明细表id
	 * @param preWorkitemID
	 *            前一个工作项ID
	 * @param preOperatorID
	 *            前一个审批人员ID
	 * @return 不发送返回false,发送成功返回true
	 * @throws Throwable
	 */
	public static Object optSendMessageTSL(DefaultContext context, String formKey, String optKey, Long workItemID,
			Long oid, Date time, Long workflowTypeDtlID, Long preWorkitemID, Long preOperatorID) throws Throwable {
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
		String pkKey = bPMInstance.getProcesskey();
		Long instanceID = bPMInstance.getOID();
		WorkflowTypeDtl workflowTypeDt = oaContext.getWorkflowTypeDtlMap().get(formKey, pkKey, workflowTypeDtlID, oid);
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
		String operationName = workitemInf.getBPMLog().getWorkitemName();
		String content = "审批工作项：" + operationName;
		MessageSet messageSet = operationSelDtl.getMessageSet();
		Operation operation = null;
		String sendFormula = operationSelDtl.getSendFormula();
		String emailTemp = operationSelDtl.getEmailTemp();
		String emailType = operationSelDtl.getEmailType();
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
		// 因为待办的工作项在并签的情况下会出现不同工作项，先按照每个工作项分组人员，然后每组工作项人员发消息
		LinkedHashMap<Long, Set<Long>> operatorMap = new LinkedHashMap<Long, Set<Long>>();
		String sql = "SELECT p.operatorid,wi.workitemid FROM (SELECT workitemid FROM BPM_LOG WHERE WorkitemState<>3 and INSTANCEID=?) wi JOIN WF_PARTICIPATOR p ON wi.workitemid = p.workitemid";
		IDBManager dbManager = context.getDBManager();
		DataTable dtQuery = dbManager.execPrepareQuery(sql, bPMInstance.getOID());
		dtQuery.beforeFirst();
		while (dtQuery.next()) {
			Long operatorid = dtQuery.getLong("operatorid");
			Long workitemid = dtQuery.getLong("workitemid");
			Set<Long> operatorSet = operatorMap.get(workitemid);
			if (operatorSet == null) {
				operatorSet = new HashSet<>();
				operatorMap.put(workitemid, operatorSet);
			}
			operatorSet.add(operatorid);

		}
		for (Iterator<Entry<Long, Set<Long>>> i = operatorMap.entrySet().iterator(); i.hasNext();) {
			Entry<Long, Set<Long>> e = i.next();
			Long workitemid = e.getKey();
			workitemInf = oaContext.getWorkitemInfMap().get(workitemid);
			if (workitemInf == null) {
				continue;
			}
			Integer nodeid = workitemInf.getNodeID();
			String widSql = "select WorkitemID from OA_InstanceEmailMark where WorkitemID =? and nodeid = ?";
			DataTable typeDt = dbManager.execPrepareQuery(widSql, workitemid,nodeid);
			if (typeDt.size() > 0) {
				continue;
			} else {
				StringBuffer sb = new StringBuffer();
				Set<Long> operatorSet = e.getValue();
				for (Long operatorid : operatorSet) {
					sb.append(",");
					sb.append(operatorid);
				}
				String ids = "";
				if (sb.length() > 0) {
					ids = sb.substring(1);
				}

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
					Long dataOID = context.applyNewOID();
					String insertSql = "insert into OA_InstanceEmailMark (OID,SOID,InstanceID,WorkitemID,operatorIDs,formkey,billoid,emailtype,nodeid,inserttime) values (?,?,?,?,?,?,?,?,?,?)";
					dbManager.execPrepareUpdate(insertSql, dataOID, dataOID, instanceID, workitemid, ids, formKey, oid,
							emailType,nodeid,new Date());
					OperatorSel ccOptSel = operationSelDtl.getCcOptSel();
					String copyUserIDs = "";
					if (ccOptSel != null && ccOptSel.getOperatorSelDtlMap().size() > 0) {
						copyUserIDs = ccOptSel.getParticipatorIDs(oid, ",");
					}
					Message message = new Message(oaContext, false, false, time, userID, topic, content, ids,
							copyUserIDs, messageSet, formKey, billNO, oid);
					message.setSendFormula(sendFormula);
					message.setEmailTemp(emailTemp);
					WorkitemInf workitem = oaContext.getWorkitemInfMap().get(workitemid);
					message.setWorkitemInf(workitem);
					if (preWorkitemID > 0) {
						message.setPreWorkitemInf(oaContext.getWorkitemInfMap().get(preWorkitemID));
					}
					if (preOperatorID > 0) {
						message.setPreOperator(oaContext.getOperatorMap().get(preOperatorID));
					}
					sendMessage = SendMessage.sendMessage(oaContext, message);
				}

				// 如果有自定义邮件接收人员，则继续发送邮件
				workitemInf = oaContext.getWorkitemInfMap().get(workItemID);
				if (workitemInf == null) {
					continue;
				}
				bPMInstance = workitemInf.getHeadBase();
				nodeID = workitemInf.getNodeID();
				pkKey = bPMInstance.getProcesskey();
				workflowTypeDt = oaContext.getWorkflowTypeDtlMap().get(formKey, pkKey, workflowTypeDtlID, oid);
				workflowDesigneDtl = workflowTypeDt.getWorkflowDesigneDtl(nodeID.toString());
				if (workflowDesigneDtl == null) {
					continue;
				}
				OperatorSel optCarbonCopyPerSel = workflowDesigneDtl.getOptCarbonCopyPerSel();
				if (optCarbonCopyPerSel == null) {
					continue;
				}
				OperatorSelDtlMap operatorSelDtlMap = optCarbonCopyPerSel.getOperatorSelDtlMap();
				if (operatorSelDtlMap == null) {
					continue;
				}
				for (OperatorSelDtl operatorSelDtl : operatorSelDtlMap.values()) {
					String sendOptSelID = TypeConvertor.toString(operatorSelDtl.getOptID());
					messageSet = operatorSelDtl.getMessageSet();
					sendFormula = operatorSelDtl.getSendFormula();
					emailTemp = operatorSelDtl.getEmailTemp();
					if (messageSet == null) {
						messageSet = optCarbonCopyPerSel.getMessageSet();
						sendFormula = optCarbonCopyPerSel.getSendFormula();
						emailTemp = optCarbonCopyPerSel.getEmailTemp();
						if (messageSet == null) {
							continue;
						}
					}
					Message message = new Message(oaContext, false, false, time, userID, topic, content, sendOptSelID,
							"", messageSet, formKey, billNO, oid);
					WorkitemInf workitem = oaContext.getWorkitemInfMap().get(preWorkitemID);
					message.setWorkitemInf(workitem);
					message.setSendFormula(sendFormula);
					message.setEmailTemp(emailTemp);
					sendMessage = SendMessage.sendMessage(oaContext, message);
				}
			}
		}
		return sendMessage;
	}
}
