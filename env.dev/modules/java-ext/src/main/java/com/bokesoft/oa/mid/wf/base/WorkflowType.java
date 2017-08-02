package com.bokesoft.oa.mid.wf.base;

import com.bokesoft.oa.base.DicBase;
import com.bokesoft.oa.base.OAContext;
import com.bokesoft.yigo.struct.datatable.DataTable;

/**
 * 流程类别
 * 
 * @author minjian
 *
 */
public class WorkflowType extends DicBase {
	/**
	 * 流程类别明细集合
	 */
	private WorkflowTypeDtlMap workflowTypeDtlMap;

	/**
	 * 流程类别明细集合
	 * 
	 * @return 流程类别明细集合
	 * @throws Throwable
	 */
	public WorkflowTypeDtlMap getWorkflowTypeDtlMap() throws Throwable {
		if (workflowTypeDtlMap == null) {
			workflowTypeDtlMap = new WorkflowTypeDtlMap(getContext(), this);
			Long oid = getOID();
			if (oid > 0) {
				String dtlSql = "select * from OA_WorlflowType_D where OID>0 and SOID=?";
				DataTable dtlDt = getContext().getContext().getDBManager().execPrepareQuery(dtlSql, oid);
				workflowTypeDtlMap.loadData(dtlDt);
			}
		}
		return workflowTypeDtlMap;
	}

	/**
	 * 流程类别明细集合
	 * 
	 * @param workflowTypeDtlMap
	 *            流程类别明细集合
	 */
	public void setWorkflowTypeDtlMap(WorkflowTypeDtlMap workflowTypeDtlMap) {
		this.workflowTypeDtlMap = workflowTypeDtlMap;
	}

	/**
	 * 载入数据
	 * 
	 * @param dt
	 *            头表数据集
	 * @throws Throwable
	 */
	public void loadData(DataTable dt) throws Throwable {
		super.loadData(dt);
	}

	/**
	 * 载入数据
	 * 
	 * @param headDt
	 *            头表数据集
	 * @param DtlDt
	 *            明细数据集
	 * @throws Throwable
	 */
	public void loadData(DataTable headDt, DataTable dtlDt) throws Throwable {
		loadData(headDt);
		getWorkflowTypeDtlMap().loadData(dtlDt);
	}

	/**
	 * 构造流程定义对象
	 * 
	 * @param context
	 *            OA上下文对象
	 */
	public WorkflowType(OAContext context) {
		super(context);
	}
}
