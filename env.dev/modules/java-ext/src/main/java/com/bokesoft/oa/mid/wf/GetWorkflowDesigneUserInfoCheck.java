package com.bokesoft.oa.mid.wf;

import java.util.ArrayList;

import com.bokesoft.oa.base.OAContext;
import com.bokesoft.oa.mid.wf.base.OperationSel;
import com.bokesoft.oa.mid.wf.base.OperationSelDtl;
import com.bokesoft.oa.mid.wf.base.OperationSelDtlMap;
import com.bokesoft.oa.mid.wf.base.WorkflowDesigneDtl;
import com.bokesoft.yigo.common.util.TypeConvertor;
import com.bokesoft.yigo.mid.base.DefaultContext;
import com.bokesoft.yigo.mid.service.IExtService;

/**
 * 获取流程设计中操作对应的审批意见必填的值
 * 
 * @author minjian
 *
 */
public class GetWorkflowDesigneUserInfoCheck implements IExtService {
	@Override
	public Object doCmd(DefaultContext paramDefaultContext, ArrayList<Object> paramArrayList) throws Throwable {
		return getWorkflowDesigneUserInfoCheck(paramDefaultContext, TypeConvertor.toLong(paramArrayList.get(0)),
				TypeConvertor.toString(paramArrayList.get(1)), TypeConvertor.toLong(paramArrayList.get(2)),
				TypeConvertor.toString(paramArrayList.get(3)));
	}

	/**
	 * 获取流程设计中操作对应的审批意见必填的值
	 * 
	 * @param context
	 *            上下文对象
	 * @param workItemID
	 *            流程工作项
	 * @param formKey
	 *            流程单据Key
	 * @param workflowTypeDtlID
	 *            流程类别明细ID
	 * @param operationKey
	 *            操作的key
	 * @return 获取流程设计中操作对应的审批意见必填的值
	 * @throws Throwable
	 */
	public Object getWorkflowDesigneUserInfoCheck(DefaultContext context, Long workItemID, String formKey,
			Long workflowTypeDtlID, String operatorSelKey) throws Throwable {
		Integer value = 0;
		OAContext oaContext = new OAContext(context);
		WorkflowDesigneDtl workflowDesigneDtl = oaContext.getWorkflowTypeDtlMap().getWorkflowDesigneDtl(formKey,
				workflowTypeDtlID, workItemID);
		if (workflowDesigneDtl == null) {
			return value;
		}
		OperationSel operationSel = workflowDesigneDtl.getAuditOptSel();

		if (operationSel == null) {
			return value;
		}
		OperationSelDtlMap operationSelDtlMap = operationSel.getOperationSelDtlMap();
		if (operationSelDtlMap == null || operationSelDtlMap.size() <= 0) {
			return value;
		}
		OperationSelDtl operationSelDtl = operationSelDtlMap.get(operatorSelKey);
		value = operationSelDtl.getOpinion();
		return value;
	}
}
