package com.bokesoft.oa.mid.wf.base;

import java.util.LinkedHashMap;

import com.bokesoft.oa.base.BaseMap;
import com.bokesoft.oa.base.OAContext;
import com.bokesoft.yes.common.util.StringUtil;
import com.bokesoft.yigo.mid.connection.IDBManager;
import com.bokesoft.yigo.struct.datatable.DataTable;

/**
 * 审批操作集合
 * 
 * @author minjian
 *
 */
public class OperationMap extends BaseMap<Long, Operation> {
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	/**
	 * 按照代码存放的审批操作集合
	 */
	private LinkedHashMap<String, Operation> operationMap;

	/**
	 * 按照代码存放的审批操作集合
	 * 
	 * @return 按照代码存放的审批操作集合
	 */
	public LinkedHashMap<String, Operation> getOperationMap() {
		if (operationMap == null) {
			operationMap = new LinkedHashMap<String, Operation>();
		}
		return operationMap;
	}

	/**
	 * 按照代码存放的审批操作集合
	 * 
	 * @param operationMap
	 *            按照代码存放的审批操作集合
	 */
	public void setOperationMap(LinkedHashMap<String, Operation> operationMap) {
		this.operationMap = operationMap;
	}

	/**
	 * 构造审批操作集合对象
	 * 
	 * @param context
	 *            OA上下文
	 */
	public OperationMap(OAContext context) {
		super(context);
	}

	/**
	 * 获得审批操作
	 * 
	 * @param oid
	 *            审批操作标识
	 * @return 审批操作
	 * @throws Throwable
	 */
	public Operation get(Long oid) throws Throwable {
		if (oid <= 0) {
			return null;
		}
		Operation obj = super.get(oid);
		if (obj == null) {
			String headSql = "select * from OA_OptModule_H where OID>0 and oid=?";
			IDBManager dbm = getContext().getContext().getDBManager();
			DataTable headDt = dbm.execPrepareQuery(headSql, oid);
			headDt.beforeFirst();
			while (headDt.next()) {
				obj = new Operation(getContext());
				obj.loadData(headDt);
				super.put(oid, obj);
				getOperationMap().put(obj.getCode(), obj);
			}
		}
		return obj;
	}

	/**
	 * 获得审批操作
	 * 
	 * @param oid
	 *            审批操作标识
	 * @return 审批操作
	 * @throws Throwable
	 */
	public Operation get(String code) throws Throwable {
		if (StringUtil.isBlankOrNull(code)) {
			return null;
		}
		LinkedHashMap<String, Operation> operationMap = getOperationMap();
		Operation obj = operationMap.get(code);
		if (obj == null) {
			String headSql = "select * from OA_OptModule_H where OID>0 and code=?";
			IDBManager dbm = getContext().getContext().getDBManager();
			DataTable headDt = dbm.execPrepareQuery(headSql, code);
			headDt.beforeFirst();
			while (headDt.next()) {
				obj = new Operation(getContext());
				obj.loadData(headDt);
				super.put(obj.getOID(), obj);
				operationMap.put(code, obj);
			}
		}
		return obj;
	}
}
