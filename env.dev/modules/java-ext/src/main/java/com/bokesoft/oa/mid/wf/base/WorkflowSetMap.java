package com.bokesoft.oa.mid.wf.base;

import java.util.LinkedHashMap;

import com.bokesoft.oa.base.BaseMap;
import com.bokesoft.oa.base.OAContext;
import com.bokesoft.yigo.mid.connection.IDBManager;
import com.bokesoft.yigo.struct.datatable.DataTable;

/**
 * 流程设置集合
 * 
 * @author minjian
 *
 */
public class WorkflowSetMap extends BaseMap<Long, WorkflowSet> {
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	/**
	 * 按照关键字符串存放的流程设置集合
	 */
	private LinkedHashMap<String, WorkflowSet> workflowSetMap;

	/**
	 * 按照关键字符串存放的流程设置集合
	 * 
	 * @return 按照关键字符串存放的流程设置集合
	 */
	public LinkedHashMap<String, WorkflowSet> getWorkflowSetMap() {
		if (workflowSetMap == null) {
			workflowSetMap = new LinkedHashMap<String, WorkflowSet>();
		}
		return workflowSetMap;
	}

	/**
	 * 按照关键字符串存放的流程设置集合
	 * 
	 * @param workflowSetMap
	 *            按照关键字符串存放的流程设置集合
	 */
	public void setWorkflowSetMap(LinkedHashMap<String, WorkflowSet> workflowSetMap) {
		this.workflowSetMap = workflowSetMap;
	}

	/**
	 * 构造流程设置集合对象
	 * 
	 * @param context
	 *            OA上下文对象
	 */
	public WorkflowSetMap(OAContext context) {
		super(context);
	}

	/**
	 * 获得流程设置对象
	 * 
	 * @param oid
	 *            流程设置对象标识
	 * @return 流程设置对象
	 * @throws Throwable
	 */
	public WorkflowSet get(Long oid) throws Throwable {
		if (oid <= 0) {
			return null;
		}
		WorkflowSet obj = super.get(oid);
		if (obj == null) {
			LinkedHashMap<String, WorkflowSet> workflowSetMap = getWorkflowSetMap();
			OAContext context = getContext();
			IDBManager dbm = context.getContext().getDBManager();
			String headSql = "select * from OA_WorkflowSet where OID>0 and OID=?";
			DataTable headDt = dbm.execPrepareQuery(headSql, oid);
			if (headDt.size() > 0) {
				obj = new WorkflowSet(context);
				obj.loadData(headDt);
				super.put(oid, obj);
				String key = obj.getSelectKey();
				workflowSetMap.put(key, obj);
			}
		}
		return obj;
	}

	/**
	 * 获得流程设置对象
	 * 
	 * @param workflowKey
	 *            流程标识
	 * @param workflowName
	 *            流程名称
	 * @param workflowVersion
	 *            流程版本
	 * @param workflowState
	 *            流程状态
	 * @return 流程设置对象
	 * @throws Throwable
	 */
	public WorkflowSet get(String workflowKey, String workflowName, Integer workflowVersion, Integer workflowState)
			throws Throwable {
		LinkedHashMap<String, WorkflowSet> workflowSetMap = getWorkflowSetMap();
		String key = WorkflowSet.getSelectKey(workflowKey, workflowName, workflowVersion, workflowState);
		WorkflowSet obj = workflowSetMap.get(key);
		if (obj == null) {
			OAContext context = getContext();
			IDBManager dbm = context.getContext().getDBManager();
			String sqlWhere = WorkflowSet.getSqlWhere(workflowKey, workflowName, workflowVersion, workflowState);
			String headSql = "select * from OA_WorkflowSet where" + sqlWhere;
			DataTable headDt = dbm.execPrepareQuery(headSql);
			if (headDt.size() > 0) {
				Long oid = headDt.getLong("oid");
				obj = new WorkflowSet(context);
				obj.loadData(headDt);
				super.put(oid, obj);
				workflowSetMap.put(key, obj);
			}
		}
		return obj;
	}
}
