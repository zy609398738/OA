package com.bokesoft.oa.mid.wf;

import java.util.ArrayList;

import com.bokesoft.oa.mid.wf.base.Workflow;
import com.bokesoft.yes.common.util.StringUtil;
import com.bokesoft.yigo.common.util.TypeConvertor;
import com.bokesoft.yigo.mid.base.DefaultContext;
import com.bokesoft.yigo.mid.service.IExtService;
import com.bokesoft.yigo.struct.datatable.DataTable;
import com.bokesoft.yigo.struct.usrpara.Paras;

/**
 * 获得当前流程的参与者列表
 *
 */
public class GetParticipatorList implements IExtService {

	@Override
	public Object doCmd(DefaultContext paramDefaultContext, ArrayList<Object> paramArrayList) throws Throwable {
		if (paramArrayList.size() <= 5) {
			return getParticipatorList(paramDefaultContext, TypeConvertor.toLong(paramArrayList.get(0)),
					TypeConvertor.toString(paramArrayList.get(1)), TypeConvertor.toLong(paramArrayList.get(2)),
					TypeConvertor.toString(paramArrayList.get(3)), TypeConvertor.toLong(paramArrayList.get(4)), ",");
		} else {
			return getParticipatorList(paramDefaultContext, TypeConvertor.toLong(paramArrayList.get(0)),
					TypeConvertor.toString(paramArrayList.get(1)), TypeConvertor.toLong(paramArrayList.get(2)),
					TypeConvertor.toString(paramArrayList.get(3)), TypeConvertor.toLong(paramArrayList.get(4)),
					TypeConvertor.toString(paramArrayList.get(5)));
		}
	}

	/**
	 * 获得当前流程的参与者列表
	 * 
	 * @param context
	 *            上下文对象
	 * @param workItemID
	 *            流程工作项
	 * @param formKey
	 *            流程单据Key
	 * @param workflowTypeDtlID
	 *            流程类别明细ID
	 * @return 参与者列表
	 */
	public static String getParticipatorList(DefaultContext context, Long workItemID, String formKey,
			Long workflowTypeDtlID, String operatorSelKey, Long billOid, String sept) throws Throwable {
		String ids = "";
		// 将流程类别明细ID设置到上下文对象的参数集合中，以便后面获取流程类别明细对象时调用
		Paras paras = context.getParas();
		if (paras == null) {
			paras = new Paras();
			context.setParas(paras);
		}
		paras.put(Workflow.WorkflowTypeDtlID, workflowTypeDtlID);
		DataTable participatorDt = GetDropItemByWorkItem.getNextNodeParticipator(context, workItemID, formKey,
				workflowTypeDtlID, operatorSelKey, billOid);
		if (participatorDt == null || participatorDt.size() <= 0) {
			return ids;
		}
		participatorDt.beforeFirst();
		while (participatorDt.next()) {
			String optId = TypeConvertor.toString(participatorDt.getObject("OID"));
			if (StringUtil.isBlankOrNull(sept)) {
				ids = ids + "," + optId;
			} else {
				ids = ids + sept + optId;
			}
		}
		if (ids.length() > 0) {
			ids = ids.substring(1);
		}

		return ids;
	}

}
