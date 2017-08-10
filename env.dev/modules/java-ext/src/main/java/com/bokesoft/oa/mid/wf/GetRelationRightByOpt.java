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

public class GetRelationRightByOpt implements IExtService {

	@Override
	public Object doCmd(DefaultContext paramDefaultContext, ArrayList<Object> paramArrayList) throws Throwable {
		return getRelationRightByOpt(paramDefaultContext, TypeConvertor.toLong(paramArrayList.get(0)));
	}

	private Object getRelationRightByOpt(DefaultContext context, Long operatorID) throws Throwable {
		OAContext oac = new OAContext(context);
		Document doc = context.getDocument();
		DataTable rdt = doc.get("OA_OptRelationWF");
		rdt.deleteAll();
		String sql = "select distinct i.verid,i.formkey,i.processkey,l.workitemname,l.nodeid from (select workitemname,instanceid,nodeid from bpm_log where operatorid = ?) l join bpm_instance i on l.instanceid = i.instanceid";
		DataTable dt = context.getDBManager().execPrepareQuery(sql, operatorID);
		dt.beforeFirst();
		while (dt.next()) {
			Integer verID = dt.getInt("verid");
			String formKey = dt.getString("formkey");
			String processKey = dt.getString("processkey");
			String workitemName = dt.getString("workitemname");
			WorkflowTypeDtl workflowTypeDtl = oac.getWorkflowTypeDtlMap().getWorkflowTypeDtl(formKey, processKey);
			Integer nodeID = dt.getInt("nodeid");
			if (workflowTypeDtl == null) {
				continue;
			}
			WorkflowDesigneDtl workflowDesigneDtl = workflowTypeDtl.getWorkflowDesigneDtl(nodeID.toString());
			if (workflowDesigneDtl == null) {
				continue;
			}
			Long workflowDesigneDtlID = workflowDesigneDtl.getOID();
			Long operatorSelID = workflowDesigneDtl.getAuditPerSelID();
			String optDesc = workflowTypeDtl.getWorkflowDesigneDtl(nodeID.toString()).getAuditPerSel()
					.getOperatorSelDtlMap().getHeadBase().getOptDesc();
			Long workflowID = workflowTypeDtl.getWorkflow().getOID();
			String workflowCaption = workflowTypeDtl.getWorkflow().getCaption();
			Long workflowTypeID = workflowTypeDtl.getHeadBase().getOID();
			String workflowTypeCaption = workflowTypeDtl.getHeadBase().getCaption();
			rdt.append();
			rdt.setString("BillKey", formKey);
			rdt.setLong("WorkflowDesigneDtlID", workflowDesigneDtlID);
			rdt.setLong("OperatorSelID", operatorSelID);
			rdt.setInt("WorkflowDesigneNodeID", nodeID);
			rdt.setString("OptDesc", optDesc);
			rdt.setInt("VERID", verID);
			rdt.setString("WorkitemName", workitemName);
			rdt.setString("ProcessKey", processKey);
			rdt.setLong("WorkflowID", workflowID);
			rdt.setLong("WorkflowTypeID", workflowTypeID);
			rdt.setString("WorkflowTypeCaption", workflowTypeCaption);
			rdt.setString("WorkflowCaption", workflowCaption);
		}
		return rdt;
	}

}
