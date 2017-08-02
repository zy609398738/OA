package com.bokesoft.oa.mid.wf.base;

import java.util.LinkedHashMap;

import com.bokesoft.oa.base.BaseMap;
import com.bokesoft.oa.base.OAContext;
import com.bokesoft.yigo.mid.connection.IDBManager;
import com.bokesoft.yigo.struct.datatable.DataTable;

/**
 * 流程设计集合
 * 
 * @author minjian
 *
 */
public class WorkflowDesigneMap extends BaseMap<Long, WorkflowDesigne> {
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	/**
	 * 按照关键字符串存放的流程设计集合
	 */
	private LinkedHashMap<String, WorkflowDesigne> workflowDesigneMap;

	/**
	 * 按照关键字符串存放的流程设计集合
	 * 
	 * @return 按照关键字符串存放的流程设计集合
	 */
	public LinkedHashMap<String, WorkflowDesigne> getWorkflowDesigneMap() {
		if (workflowDesigneMap == null) {
			workflowDesigneMap = new LinkedHashMap<String, WorkflowDesigne>();
		}
		return workflowDesigneMap;
	}

	/**
	 * 按照关键字符串存放的流程设计集合
	 * 
	 * @param workflowDesigneMap
	 *            按照关键字符串存放的流程设计集合
	 */
	public void setWorkflowDesigneMap(LinkedHashMap<String, WorkflowDesigne> workflowDesigneMap) {
		this.workflowDesigneMap = workflowDesigneMap;
	}

	/**
	 * 构造流程设计集合对象
	 * 
	 * @param context
	 *            OA上下文对象
	 */
	public WorkflowDesigneMap(OAContext context) {
		super(context);
	}

	/**
	 * 获得流程设计对象
	 * 
	 * @param oid
	 *            流程设计对象标识
	 * @return 流程设计对象
	 * @throws Throwable
	 */
	public WorkflowDesigne get(Long oid) throws Throwable {
		if (oid <= 0) {
			return null;
		}
		WorkflowDesigne obj = super.get(oid);
		if (obj == null) {
			LinkedHashMap<String, WorkflowDesigne> workflowDesigneMap = getWorkflowDesigneMap();
			OAContext context = getContext();
			IDBManager dbm = context.getContext().getDBManager();
			String headSql = "select * from OA_WorkflowDesigne_H where OID>0 and OID=?";
			DataTable headDt = dbm.execPrepareQuery(headSql, oid);
			if (headDt.size() > 0) {
				obj = new WorkflowDesigne(context);
				obj.loadData(headDt);
				super.put(oid, obj);
				String key = obj.getSelectKey();
				workflowDesigneMap.put(key, obj);
			}
		}
		return obj;
	}

	/**
	 * 获得流程设计对象
	 * 
	 * @param workflowKey
	 *            流程标识
	 * @param workflowVersion
	 *            流程版本
	 * @param tag1
	 *            标签1
	 * @param tag2
	 *            标签2
	 * @param tag3
	 *            标签3
	 * @param tag4
	 *            标签4
	 * @return 流程设计对象
	 * @throws Throwable
	 */
	public WorkflowDesigne get(String workflowKey, Integer workflowVersion, String tag1, String tag2, String tag3,
			String tag4) throws Throwable {
		LinkedHashMap<String, WorkflowDesigne> workflowDesigneMap = getWorkflowDesigneMap();
		String key = WorkflowDesigne.getSelectKey(workflowKey, workflowVersion, tag1, tag2, tag3, tag4);
		WorkflowDesigne obj = workflowDesigneMap.get(key);
		if (obj == null) {
			OAContext context = getContext();
			IDBManager dbm = context.getContext().getDBManager();
			String sqlWhere = WorkflowDesigne.getSqlWhere(workflowKey, workflowVersion, tag1, tag2, tag3, tag4);
			String headSql = "select * from OA_WorkflowDesigne_H where" + sqlWhere;
			DataTable headDt = dbm.execPrepareQuery(headSql);
			if (headDt.size() > 0) {
				obj = new WorkflowDesigne(context);
				obj.loadData(headDt);
				super.put(obj.getOID(), obj);
				workflowDesigneMap.put(key, obj);
			}
		}
		return obj;
	}

	/**
	 * 获得流程设计对象集合
	 * 
	 * @param headDt
	 *            流程设计头表数据集
	 * @return 流程设计对象集合
	 * @throws Throwable
	 */
	public WorkflowDesigneMap getMapByDataTable(DataTable headDt) throws Throwable {
		LinkedHashMap<String, WorkflowDesigne> workflowDesigneMap = getWorkflowDesigneMap();
		OAContext context = getContext();
		WorkflowDesigneMap map = new WorkflowDesigneMap(getContext());
		headDt.beforeFirst();
		while (headDt.next()) {
			Long oid = headDt.getLong("OID");
			WorkflowDesigne obj = super.get(oid);
			if (obj == null) {
				obj = new WorkflowDesigne(context);
				obj.loadData(headDt);
				super.put(oid, obj);
				String key = obj.getSelectKey();
				workflowDesigneMap.put(key, obj);
			}
			map.put(oid, obj);
		}
		return map;
	}
}
