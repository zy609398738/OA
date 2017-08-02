package com.bokesoft.oa.mid.wf;

import java.util.ArrayList;
import java.util.Set;

import com.bokesoft.oa.base.OAContext;
import com.bokesoft.oa.mid.wf.base.OperatorSel;
import com.bokesoft.oa.mid.wf.base.WorkflowDesigneDtl;
import com.bokesoft.yes.bpm.engine.common.BPMContext;
import com.bokesoft.yigo.bpm.dev.Spoon;
import com.bokesoft.yigo.meta.bpm.process.MetaProcess;
import com.bokesoft.yigo.meta.bpm.process.node.MetaNode;
import com.bokesoft.yigo.meta.dataobject.MetaDataObject;
import com.bokesoft.yigo.mid.base.DefaultContext;
import com.bokesoft.yigo.mid.document.SaveData;
import com.bokesoft.yigo.mid.service.IExtService;
import com.bokesoft.yigo.struct.datatable.DataTable;
import com.bokesoft.yigo.struct.document.Document;
import com.bokesoft.yigo.tools.document.DocumentUtil;

/**
 * 流程监控
 * 
 * @author minjian
 *
 */
public class WorkflowMonitor implements IExtService {
	@Override
	public Object doCmd(DefaultContext paramDefaultContext, ArrayList<Object> paramArrayList) throws Throwable {
		return workflowMonitor(paramDefaultContext, (OAContext) paramArrayList.get(0), (String) paramArrayList.get(1),
				(MetaProcess) paramArrayList.get(2), (MetaNode) paramArrayList.get(3), (Spoon) paramArrayList.get(4),
				(WorkflowDesigneDtl) paramArrayList.get(5), (Long) paramArrayList.get(6));
	}

	/**
	 * 流程监控
	 * 
	 * @param context
	 *            上下文对象
	 * @param oaContext
	 *            OA上下文对象
	 * @param formKey
	 *            单据标识
	 * @param process
	 *            流程
	 * @param node
	 *            节点
	 * @param spoon
	 *            决定是否替换原有的操作列表
	 * @param workflowDesigneDtl
	 *            流程设计明细
	 * @param workitemID
	 *            工作项标识
	 * @return 流程监控执行完成返回true
	 * @throws Throwable
	 */
	public Boolean workflowMonitor(DefaultContext context, OAContext oaContext, String formKey, MetaProcess process,
			MetaNode node, Spoon spoon, WorkflowDesigneDtl workflowDesigneDtl, Long workitemID) throws Throwable {
		// 设置为true，替换，否则不替换
		spoon.setMarked(true);
		String processKey = process.getFormKey();
		Integer version = process.getVersion();
		Long instanceID = ((BPMContext)context).getActiveBPMInstance().getInstanceID();
		String nodeKey = node.getKey();
		Long oid = context.getDocument().getOID();
		MetaDataObject metaDataObject = context.getVE().getMetaFactory().getDataObject("OA_WorkflowMonitor");
		Document doc = DocumentUtil.newDocument(metaDataObject);
		DataTable dt = doc.get("OA_WorkflowMonitor");
		OperatorSel operatorSel = workflowDesigneDtl.getMonitoringPerSel();
		Set<Long> operators = operatorSel.getParticipatorSet(oid);
		if (operators.size() <= 0) {
			return false;
		} else {
			doc.setNew();
			if (dt.size() > 0) {
				dt.clear();
			}
			for (Long operator : operators) {
				dt.append();
				Long srcOID = context.applyNewOID();
				dt.setString("FormKey", formKey);
				dt.setString("ProcessKey", processKey);
				dt.setString("NodeKey", nodeKey);
				dt.setLong("Operator", operator);
				dt.setInt("Version", version);
				dt.setLong("WorkitemID", workitemID);
				dt.setLong("BillOID", oid);
				dt.setLong("OID", srcOID);
				dt.setLong("SOID", srcOID);
				dt.setLong("InstanceID", instanceID);
			}
			DefaultContext newContext = new DefaultContext(context);
			SaveData saveData = new SaveData(metaDataObject, null, doc);
			saveData.save(newContext);
			return true;
		}
	}
}
