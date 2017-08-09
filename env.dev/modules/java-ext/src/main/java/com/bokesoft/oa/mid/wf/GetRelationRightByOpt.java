package com.bokesoft.oa.mid.wf;

import java.util.ArrayList;

import com.bokesoft.oa.base.OAContext;
import com.bokesoft.oa.mid.wf.base.WorkflowDesigneDtl;
import com.bokesoft.oa.mid.wf.base.WorkflowTypeDtl;
import com.bokesoft.yigo.common.util.TypeConvertor;
import com.bokesoft.yigo.mid.base.DefaultContext;
import com.bokesoft.yigo.mid.service.IExtService;
import com.bokesoft.yigo.struct.datatable.DataTable;
import com.bokesoft.yigo.struct.document.Document;

public class GetRelationRightByOpt implements IExtService{

	@Override
	public Object doCmd(DefaultContext paramDefaultContext, ArrayList<Object> paramArrayList) throws Throwable {
		return getRelationRightByOpt(paramDefaultContext,TypeConvertor.toLong(paramArrayList.get(0)));
	}

	private Object getRelationRightByOpt(DefaultContext context ,Long operatorID) throws Throwable {
		OAContext oac = new OAContext(context);
		Document doc = context.getDocument();
		String sql = "select i.verid,i.oid,i.formkey,i.processkey,l.nodeid from bpm_log l join bpm_instance i on l.instanceid = i.instanceid where l.operatorid = ?";
		DataTable dt = context.getDBManager().execPrepareQuery(sql, operatorID);
		DataTable rdt = doc.get("OA_OptRelationWF");
		dt.beforeFirst();
		while(dt.next()){
			Integer nodeID = dt.getInt("nodeid");
			//Long oid = dt.getLong("oid");
			String formKey = dt.getString("formkey");
			String processKey = dt.getString("processkey");
			WorkflowTypeDtl workflowTypeDtl = oac.getWorkflowTypeDtlMap().getWorkflowTypeDtl(formKey, processKey);
			if(workflowTypeDtl==null){
				continue;
			}
			Long workflowTypeDtlID = workflowTypeDtl.getOID();
			WorkflowDesigneDtl workflowDesigneDtl = workflowTypeDtl.getWorkflowDesigneDtl(nodeID.toString());
			if(workflowDesigneDtl==null){
				continue;
			}
			Long workflowDesigneDtlID = workflowDesigneDtl.getOID();
			Long operatorSelID = workflowDesigneDtl.getAuditPerSelID();
			String optDesc = workflowTypeDtl.getWorkflowDesigneDtl(nodeID.toString()).getAuditPerSel().getOperatorSelDtlMap().getHeadBase().getOptDesc();
			rdt.append();
			rdt.setString("BillKey", formKey);
			rdt.setLong("WorkflowDesigneDtlID",workflowDesigneDtlID);
			rdt.setLong("OperatorSelID", operatorSelID);
			rdt.setInt("WorkflowDesigneNodeID", nodeID);
			rdt.setString("OptDesc", optDesc);
			rdt.setLong("WorkflowTypeDtlID",workflowTypeDtlID);
		}
		return rdt;
	}

}
