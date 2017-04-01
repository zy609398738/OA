package com.bokesoft.oa.mid.wf;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.Map.Entry;

import com.bokesoft.yigo.meta.bpm.process.MetaProcess;
import com.bokesoft.yigo.meta.bpm.process.node.MetaNode;
import com.bokesoft.yigo.mid.base.DefaultContext;
import com.bokesoft.yigo.mid.service.IExtService;
import com.bokesoft.yigo.struct.datatable.DataTable;
import com.bokesoft.yigo.struct.document.Document;

/**
 * 根据流程key获取该流程中所有审批节点的下拉字符串
 * 
 * @author fengfeifei
 *
 */
public class GetAuditNodeByBPM implements IExtService {
	@Override
	public Object doCmd(DefaultContext paramDefaultContext, ArrayList<Object> paramArrayList) throws Throwable {
		return getAuditNode(paramDefaultContext);
	}

	/**
	 * 根据流程key获取该流程中所有审批节点的下拉字符串
	 * 
	 * @return 流程中所有审批节点的下拉字符串
	 * @throws Throwable
	 */
	public String getAuditNode(DefaultContext context) throws Throwable {
		String dropItem = "";
		Document doc = context.getDocument();
		DataTable dt = doc.get("OA_WorkflowDesigne_H");
		String workflowKey = dt.getString("WorkflowKey");//流程标识
		int workflowVersion = Integer.valueOf(dt.getString("WorkflowVersion"));//流程版本
		MetaProcess process=context.getVE().getMetaFactory().getProcessDefinationBy(workflowKey, workflowVersion);
		Iterator<Entry<String, MetaNode>> nodeIterator = process.entryIterator();
		while(nodeIterator.hasNext()){
			Entry<String, MetaNode> entry = nodeIterator.next();
			MetaNode node = entry.getValue();
			int nodeID = node.getID();//节点标识
			String nodeCaption = node.getCaption();//节点名称
			int nodeType=node.getNodeType();//节点类型
			if(3==nodeType || 4==nodeType){//3-审批节点，4-会签节点
				dropItem = dropItem + ";" + nodeID + "," + nodeCaption;
			}
		}			
		return dropItem;
	}
}
