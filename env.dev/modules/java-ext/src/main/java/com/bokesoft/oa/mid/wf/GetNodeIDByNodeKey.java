package com.bokesoft.oa.mid.wf;

import java.util.ArrayList;

import com.bokesoft.oa.base.OAContext;
import com.bokesoft.oa.mid.wf.base.WorkflowTypeDtl;
import com.bokesoft.yigo.common.util.TypeConvertor;
import com.bokesoft.yigo.meta.bpm.process.MetaProcess;
import com.bokesoft.yigo.meta.bpm.process.node.MetaNode;
import com.bokesoft.yigo.meta.factory.IMetaFactory;
import com.bokesoft.yigo.meta.form.MetaForm;
import com.bokesoft.yigo.mid.base.DefaultContext;
import com.bokesoft.yigo.mid.service.IExtService;

/**
 * 根据流程节点标识获取节点ID
 * 
 * @author zhoukh
 *
 */
public class GetNodeIDByNodeKey implements IExtService {

	@Override
	public Object doCmd(DefaultContext paramDefaultContext, ArrayList<Object> paramArrayList) throws Throwable {
		return getNodeIDByNodeKey(paramDefaultContext, TypeConvertor.toString(paramArrayList.get(0)),
				TypeConvertor.toString(paramArrayList.get(1)), TypeConvertor.toString(paramArrayList.get(2)));
	}

	/**
	 * 
	 * @param context
	 *            上下文对象
	 * @param formKey
	 *            单据标识
	 * @param nodeKey
	 *            节点标识
	 * @return 节点id
	 * @throws Throwable
	 */
	public Integer getNodeIDByNodeKey(DefaultContext context, String formKey, String processKey, String nodeKey)
			throws Throwable {
		OAContext oaContext = new OAContext(context);
		IMetaFactory metaFactory = context.getVE().getMetaFactory();
		MetaForm metaForm = metaFactory.getMetaForm(formKey);
		if (metaForm.getAliasKey() != null && metaForm.getAliasKey().length() > 0) {
			formKey = metaForm.getAliasKey();
		}
		
		WorkflowTypeDtl workflowTypeDtl = oaContext.getWorkflowTypeDtlMap().getWorkflowTypeDtl(formKey, processKey);
		Integer workflowVersion = workflowTypeDtl.getWorkflow().getWorkflowVersion();
		MetaProcess process = context.getVE().getMetaFactory().getProcessDefinationBy(processKey, workflowVersion);
		MetaNode node = process.get(nodeKey);
		if (node == null) {
			throw new Error("当前流程“" + process.getCaption() + "”中缺少拒绝节点：" + nodeKey);
		}
		Integer nodeID = node.getID();
		return nodeID;
	}
}
