package com.bokesoft.oa.mid.wf;

import java.util.ArrayList;
import java.util.HashMap;

import com.bokesoft.oa.base.OAContext;
import com.bokesoft.oa.mid.wf.base.WorkflowDesigne;
import com.bokesoft.oa.mid.wf.base.WorkflowDesigneMap;
import com.bokesoft.yigo.common.util.TypeConvertor;
import com.bokesoft.yigo.meta.bpm.process.ProcessDefinitionProfile;
import com.bokesoft.yigo.meta.bpm.total.MetaBPM;
import com.bokesoft.yigo.mid.base.DefaultContext;
import com.bokesoft.yigo.mid.service.IExtService;
import com.bokesoft.yigo.struct.datatable.DataTable;

/**
 * 根据流程设计获得的下拉字符串
 * 
 * @author minjian
 *
 */
public class GetDropItemByDesigne implements IExtService {
	@Override
	public Object doCmd(DefaultContext paramDefaultContext, ArrayList<Object> paramArrayList) throws Throwable {
		return getOperationDropItem(paramDefaultContext, TypeConvertor.toString(paramArrayList.get(0)));
	}

	/**
	 * 根据流程设计获得的下拉字符串
	 * 
	 * @param context
	 *            上下文对象
	 * @param formKey
	 *            单据的Key
	 * @return 操作的下拉字符串
	 * @throws Throwable
	 */
	public String getOperationDropItem(DefaultContext context, String formKey) throws Throwable {
		OAContext oaContext = new OAContext(context);
		String headSql = "select * from OA_WorkflowDesigne_H where oid>0 and tag1=?";
		DataTable headDt = context.getDBManager().execPrepareQuery(headSql, formKey);
		WorkflowDesigneMap workflowDesigneMap = oaContext.getWorkflowDesigneMap().getMapByDataTable(headDt);
		MetaBPM metaBPM = context.getVE().getMetaFactory().getMetaBPM();
		HashMap<String, ProcessDefinitionProfile> profileMap = metaBPM.getProfileMap();
		StringBuffer sb = new StringBuffer();
		for (WorkflowDesigne workflowDesigne : workflowDesigneMap.values()) {
			Integer version = workflowDesigne.getWorkflowVersion();
			String profileKey = workflowDesigne.getWorkflowKey() + "_V" + version;
			ProcessDefinitionProfile p = profileMap.get(profileKey);
			sb = sb.append(";");
			sb = sb.append(workflowDesigne.getOID());
			sb = sb.append(",");
			sb = sb.append(p.getCaption() + "_版本" + version);
		}
		String dropItem = sb.toString();
		if (dropItem.length() > 0) {
			dropItem = dropItem.substring(1);
		}
		return dropItem;
	}
}
