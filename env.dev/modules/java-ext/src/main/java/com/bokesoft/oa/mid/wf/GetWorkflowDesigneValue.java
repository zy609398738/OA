package com.bokesoft.oa.mid.wf;

import java.util.ArrayList;

import com.bokesoft.oa.base.OAContext;
import com.bokesoft.oa.mid.wf.base.NodeProperty;
import com.bokesoft.yigo.common.util.TypeConvertor;
import com.bokesoft.yigo.mid.base.DefaultContext;
import com.bokesoft.yigo.mid.service.IExtService;

/**
 * 获得流程设计的指定字段值
 * 
 * @author zhkh
 *
 */
public class GetWorkflowDesigneValue implements IExtService {
	@Override
	public Object doCmd(DefaultContext paramDefaultContext, ArrayList<Object> paramArrayList) throws Throwable {
		if (paramArrayList.size() <= 3) {
			return getWorkflowDesigneValue(paramDefaultContext, TypeConvertor.toLong(paramArrayList.get(0)),
					TypeConvertor.toString(paramArrayList.get(1)), null, TypeConvertor.toString(paramArrayList.get(2)));
		} else {
			return getWorkflowDesigneValue(paramDefaultContext, TypeConvertor.toLong(paramArrayList.get(0)),
					TypeConvertor.toString(paramArrayList.get(1)), TypeConvertor.toLong(paramArrayList.get(2)),
					TypeConvertor.toString(paramArrayList.get(3)));
		}
	}

	/**
	 * 获得流程设计的节点属性值
	 * 
	 * @param context
	 *            上下文对象
	 * @param workItemID
	 *            流程工作项
	 * @param formKey
	 *            流程单据Key
	 * @param workflowTypeDtlID
	 *            流程类别明细ID
	 * @param key
	 *            节点属性字段Key
	 * @return 流程设计的指定字段值
	 * @throws Throwable
	 */
	public Object getWorkflowDesigneValue(DefaultContext context, Long workItemID, String formKey,
			Long workflowTypeDtlID, String key) throws Throwable {
		OAContext oaContext = new OAContext(context);
		NodeProperty node = oaContext.getWorkflowTypeDtlMap().getNodeProperty(formKey, workflowTypeDtlID, workItemID);
		if (node == null) {
			return null;
		}

		Object value = node.getNodeValueMap().get(key.toUpperCase());
		return value;
	}
}
