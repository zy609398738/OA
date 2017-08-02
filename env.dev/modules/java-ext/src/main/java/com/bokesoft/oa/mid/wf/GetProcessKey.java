package com.bokesoft.oa.mid.wf;

import java.util.ArrayList;
import com.bokesoft.oa.base.OAContext;
import com.bokesoft.oa.mid.wf.base.WorkflowTypeDtl;
import com.bokesoft.yigo.common.util.TypeConvertor;
import com.bokesoft.yigo.mid.base.DefaultContext;
import com.bokesoft.yigo.mid.service.IExtService;

/**
 * 根据单据标识返回关联流程标识
 * 
 * @author zkh
 *
 */
public class GetProcessKey implements IExtService {

	@Override
	public Object doCmd(DefaultContext paramDefaultContext, ArrayList<Object> paramArrayList) throws Throwable {
		return getProcessKey(paramDefaultContext, TypeConvertor.toString(paramArrayList.get(0)));
	}

	/**
	 * 
	 * @param context
	 *            上下文对象
	 * @param formKey
	 *            单据key
	 * @return 流程key
	 * @throws Throwable
	 */
	public String getProcessKey(DefaultContext context, String formKey) throws Throwable {
		OAContext oaContext = new OAContext(context);
		WorkflowTypeDtl workflowTypeDtl = oaContext.getWorkflowTypeDtlMap().getWorkflowTypeDtl(formKey, "");
		String processKey = workflowTypeDtl.getWorkflow().getWorkflowKey();
		return processKey;
	}

}
