package com.bokesoft.oa.mid.wf.base;

import java.util.LinkedHashMap;

import com.bokesoft.oa.base.DtlBaseMap;
import com.bokesoft.oa.base.OAContext;
import com.bokesoft.yigo.mid.connection.IDBManager;
import com.bokesoft.yigo.struct.datatable.DataTable;

/**
 * 流程节点属性集合
 * 
 * @author minjian
 *
 */
public class NodePropertyMap extends DtlBaseMap<Long, NodeProperty, WorkflowDesigneDtl> {
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	/**
	 * 按照关键字符串存放的流程节点属性集合
	 */
	private LinkedHashMap<String, NodeProperty> nodePropertyMap;

	/**
	 * 按照关键字符串存放的流程节点属性集合
	 * 
	 * @return 按照关键字符串存放的流程节点属性集合
	 */
	public LinkedHashMap<String, NodeProperty> getNodePropertyMap() {
		if (nodePropertyMap == null) {
			nodePropertyMap = new LinkedHashMap<String, NodeProperty>();
		}
		return nodePropertyMap;
	}

	/**
	 * 按照关键字符串存放的流程节点属性集合
	 * 
	 * @param NodePropertyMap
	 *            按照关键字符串存放的流程节点属性集合
	 */
	public void setNodePropertyMap(LinkedHashMap<String, NodeProperty> NodePropertyMap) {
		this.nodePropertyMap = NodePropertyMap;
	}

	/**
	 * 构造流程节点属性集合对象
	 * 
	 * @param context
	 *            OA上下文对象
	 * @param workflowDesigneDtl
	 *            流程设计明细
	 */
	public NodePropertyMap(OAContext context, WorkflowDesigneDtl workflowDesigneDtl) {
		super(context, workflowDesigneDtl);
	}

	/**
	 * 获得流程节点属性对象
	 * 
	 * @param oid
	 *            流程节点属性对象标识
	 * @param workflowDesigneDtl
	 *            流程设计明细
	 * @return 流程节点属性对象
	 * @throws Throwable
	 */
	public NodeProperty get(Long oid, WorkflowDesigneDtl workflowDesigneDtl) throws Throwable {
		if (oid <= 0) {
			return null;
		}
		NodeProperty obj = super.get(oid);
		if (obj == null) {
			OAContext context = getContext();
			IDBManager dbm = context.getContext().getDBManager();
			String headSql = "select * from OA_NodeProperty_H where OID>0 and OID=?";
			DataTable headDt = dbm.execPrepareQuery(headSql, oid);
			if (headDt.size() > 0) {
				LinkedHashMap<String, NodeProperty> nodePropertyMap = getNodePropertyMap();
				obj = new NodeProperty(context, workflowDesigneDtl);
				obj.loadData(headDt);
				super.put(oid, obj);
				String key = obj.getSelectKey();
				nodePropertyMap.put(key, obj);
			}
		}
		return obj;
	}

	/**
	 * 获得流程节点属性对象
	 * 
	 * @param workflowDesigneDtl
	 *            流程设计明细
	 * @return 流程节点属性对象
	 * @throws Throwable
	 */
	public NodeProperty get(WorkflowDesigneDtl workflowDesigneDtl) throws Throwable {
		WorkflowDesigne workflowDesigne = workflowDesigneDtl.getHeadBase();
		String sourceKey = workflowDesigne.getKey();
		Long sourceID = workflowDesigne.getOID();
		String tag1 = workflowDesigne.getWorkflowKey();
		String tag2 = workflowDesigneDtl.getAuditNode();
		String tag3 = "";
		String tag4 = "";
		LinkedHashMap<String, NodeProperty> nodePropertyMap = getNodePropertyMap();
		String key = NodeProperty.getSelectKey(sourceKey, sourceID, tag1, tag2, tag3, tag4);
		NodeProperty obj = nodePropertyMap.get(key);
		if (obj == null) {
			OAContext context = getContext();
			IDBManager dbm = context.getContext().getDBManager();
			String sqlWhere = NodeProperty.getSqlWhere(sourceKey, sourceID, tag1, tag2, tag3, tag4);
			String headSql = "select * from OA_NodeProperty_H where" + sqlWhere;
			DataTable headDt = dbm.execPrepareQuery(headSql);
			if (headDt.size() > 0) {
				obj = new NodeProperty(context, workflowDesigneDtl);
				obj.loadData(headDt);
				super.put(obj.getOID(), obj);
				nodePropertyMap.put(key, obj);
			}
		}
		return obj;
	}
}
