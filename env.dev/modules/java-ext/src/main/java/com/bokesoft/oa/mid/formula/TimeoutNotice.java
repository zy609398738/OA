package com.bokesoft.oa.mid.formula;

import java.util.Date;

import com.bokesoft.oa.base.OAContext;
import com.bokesoft.oa.mid.message.Message;
import com.bokesoft.oa.mid.message.MessageSet;
import com.bokesoft.oa.mid.message.SendMessage;
import com.bokesoft.oa.mid.wf.base.NodeProperty;
import com.bokesoft.oa.mid.wf.base.OperatorSel;
import com.bokesoft.oa.mid.wf.base.WorkflowDesigneDtl;
import com.bokesoft.oa.mid.wf.base.WorkflowTypeDtl;
import com.bokesoft.oa.mid.wf.base.WorkitemInf;
import com.bokesoft.yes.common.util.StringUtil;
import com.bokesoft.yigo.common.util.TypeConvertor;
import com.bokesoft.yigo.mid.base.DefaultContext;
import com.bokesoft.yigo.mid.parser.BaseMidFunctionImpl;
import com.bokesoft.yigo.parser.IExecutor;

/**
 * 超时通知
 *
 */
public class TimeoutNotice extends BaseMidFunctionImpl {

	@Override
	public Object evalImpl(String name, DefaultContext context, Object[] args, IExecutor iExecutor) throws Throwable {
		OAContext oaContext = new OAContext(context);
		Long workItemID = TypeConvertor.toLong(args[2]);
		WorkitemInf workitemInf = oaContext.getWorkitemInfMap().get(workItemID);
		if (workitemInf == null) {
			return true;
		}
		Long workflowTypeDtlID = TypeConvertor.toLong(args[5]);
		WorkflowTypeDtl workflowTypeDt = oaContext.getWorkflowTypeDtlMap().get(workflowTypeDtlID);
		Long workflowDesigneDtlID = TypeConvertor.toLong(args[6]);
		WorkflowDesigneDtl workflowDesigneDtl = workflowTypeDt.getWorkflow().getWorkflowDesigne()
				.getWorkflowDesigneDtlMap().get(workflowDesigneDtlID);
		NodeProperty nodeProperty = workflowDesigneDtl.getNodeProperty();
		MessageSet messageSet = nodeProperty.getSendType();
		Long billOID = TypeConvertor.toLong(args[1]);
		String formKey = TypeConvertor.toString(args[0]);
		String topic = oaContext.getwFMigrationMap().get(billOID).getTopic();
		String billNO = oaContext.getwFMigrationMap().get(billOID).getBillNO();
		String operationName = workitemInf.getWFWorkitem().getWorkitemName();
		String content = operationName + " 任务超时";
		OperatorSel informPerSel = nodeProperty.getInformPerSel();
		if (informPerSel != null && informPerSel.getOperatorSelDtlMap().size() > 0) {
			String ids = informPerSel.getParticipatorIDs(billOID, ",");
			if (!StringUtil.isBlankOrNull(ids)) {
				Message message = new Message(oaContext, false, false, new Date(), context.getVE().getEnv().getUserID(),
						topic, content, ids, "", messageSet, formKey, billNO, billOID);
				message.setSendFormula(nodeProperty.getSendFormula());
				message.setEmailTemp(nodeProperty.getEmailTemp());
				message.setWorkitemInf(workitemInf);
				SendMessage.sendMessage(oaContext, message);
			}
		}
		return true;
	}
}
