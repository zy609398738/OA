package com.bokesoft.oa.mid.wf.base;

import java.util.LinkedHashMap;

import com.bokesoft.oa.base.BaseMap;
import com.bokesoft.oa.base.OAContext;
import com.bokesoft.yigo.mid.connection.IDBManager;
import com.bokesoft.yigo.struct.datatable.DataTable;

/**
 * 权限选择集合
 * 
 * @author minjian
 *
 */
public class RightSelMap extends BaseMap<Long, RightSel> {
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	/**
	 * 按照关键字符串存放的权限选择集合
	 */
	private LinkedHashMap<String, RightSel> rightSelMap;

	/**
	 * 按照关键字符串存放的权限选择集合
	 * 
	 * @return 按照关键字符串存放的权限选择集合
	 */
	public LinkedHashMap<String, RightSel> getRightSelMap() {
		if (rightSelMap == null) {
			rightSelMap = new LinkedHashMap<String, RightSel>();
		}
		return rightSelMap;
	}

	/**
	 * 按照关键字符串存放的权限选择集合
	 * 
	 * @param RightSelMap
	 *            按照关键字符串存放的权限选择集合
	 */
	public void setRightSelMap(LinkedHashMap<String, RightSel> RightSelMap) {
		this.rightSelMap = RightSelMap;
	}

	/**
	 * 构造权限选择集合对象
	 * 
	 * @param context
	 *            OA上下文对象
	 */
	public RightSelMap(OAContext context) {
		super(context);
	}

	/**
	 * 获得权限选择对象
	 * 
	 * @param oid
	 *            权限选择对象标识
	 * @param workflowDesigneDtl
	 *            流程设计明细
	 * @return 权限选择对象
	 * @throws Throwable
	 */
	public RightSel get(Long oid, WorkflowDesigneDtl workflowDesigneDtl) throws Throwable {
		RightSel obj = get(oid);
		if (obj != null) {
			obj.setWorkflowDesigneDtl(workflowDesigneDtl);
		}
		return obj;
	}

	/**
	 * 获得权限选择对象
	 * 
	 * @param oid
	 *            权限选择对象标识
	 * @return 权限选择对象
	 * @throws Throwable
	 */
	public RightSel get(Long oid) throws Throwable {
		if (oid <= 0) {
			return null;
		}
		RightSel obj = super.get(oid);
		if (obj == null) {
			LinkedHashMap<String, RightSel> rightSelMap = getRightSelMap();
			OAContext context = getContext();
			IDBManager dbm = context.getContext().getDBManager();
			String headSql = "select * from OA_RightSel_H where OID>0 and OID=?";
			DataTable headDt = dbm.execPrepareQuery(headSql, oid);
			if (headDt.size() > 0) {
				obj = new RightSel(context);
				obj.loadData(headDt);
				super.put(oid, obj);
				String key = obj.getSelectKey();
				rightSelMap.put(key, obj);
			}
		}
		return obj;
	}

	/**
	 * 获得权限选择对象
	 * 
	 * @param workflowDesigneDtl
	 *            流程设计明细
	 * @return 权限选择对象
	 * @throws Throwable
	 */
	public RightSel get(WorkflowDesigneDtl workflowDesigneDtl) throws Throwable {
		WorkflowDesigne workflowDesigne = workflowDesigneDtl.getHeadBase();
		String sourceKey = workflowDesigne.getKey();
		Long sourceID = workflowDesigne.getOID();
		String tag1 = workflowDesigne.getWorkflowKey();
		String tag2 = workflowDesigneDtl.getAuditNode();
		String tag3 = "";
		String tag4 = "";
		LinkedHashMap<String, RightSel> rightSelMap = getRightSelMap();
		String key = RightSel.getSelectKey(sourceKey, sourceID, tag1, tag2, tag3, tag4);
		RightSel obj = rightSelMap.get(key);
		if (obj == null) {
			OAContext context = getContext();
			IDBManager dbm = context.getContext().getDBManager();
			String sqlWhere = RightSel.getSqlWhere(sourceKey, sourceID, tag1, tag2, tag3, tag4);
			String headSql = "select * from OA_RightSel_H where" + sqlWhere;
			DataTable headDt = dbm.execPrepareQuery(headSql);
			if (headDt.size() > 0) {
				obj = new RightSel(context);
				obj.loadData(headDt);
				obj.setWorkflowDesigneDtl(workflowDesigneDtl);
				super.put(obj.getOID(), obj);
				rightSelMap.put(key, obj);
			}
		}
		return obj;
	}
}
