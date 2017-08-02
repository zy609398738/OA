package com.bokesoft.oa.mid.wf.base;

import java.util.LinkedHashMap;

import com.bokesoft.oa.base.BaseMap;
import com.bokesoft.oa.base.OAContext;
import com.bokesoft.yigo.mid.connection.IDBManager;
import com.bokesoft.yigo.struct.datatable.DataTable;

/**
 * 操作选择集合
 * 
 * @author minjian
 *
 */
public class OperationSelMap extends BaseMap<Long, OperationSel> {
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	/**
	 * 按照关键字符串存放的操作选择集合
	 */
	private LinkedHashMap<String, OperationSel> operationSelMap;

	/**
	 * 按照关键字符串存放的操作选择集合
	 * 
	 * @return 按照关键字符串存放的操作选择集合
	 */
	public LinkedHashMap<String, OperationSel> getOperationSelMap() {
		if (operationSelMap == null) {
			operationSelMap = new LinkedHashMap<String, OperationSel>();
		}
		return operationSelMap;
	}

	/**
	 * 按照关键字符串存放的操作选择集合
	 * 
	 * @param OperationSelMap
	 *            按照关键字符串存放的操作选择集合
	 */
	public void setOperationSelMap(LinkedHashMap<String, OperationSel> OperationSelMap) {
		this.operationSelMap = OperationSelMap;
	}

	/**
	 * 构造操作选择集合对象
	 * 
	 * @param context
	 *            OA上下文对象
	 */
	public OperationSelMap(OAContext context) {
		super(context);
	}

	/**
	 * 获得操作选择对象
	 * 
	 * @param oid
	 *            操作选择对象标识
	 * @return 操作选择对象
	 * @throws Throwable
	 */
	public OperationSel get(Long oid) throws Throwable {
		if (oid <= 0) {
			return null;
		}
		OperationSel obj = super.get(oid);
		if (obj == null) {
			LinkedHashMap<String, OperationSel> operationSelMap = getOperationSelMap();
			OAContext context = getContext();
			IDBManager dbm = context.getContext().getDBManager();
			String headSql = "select * from OA_OperationSel_H where OID>0 and OID=?";
			DataTable headDt = dbm.execPrepareQuery(headSql, oid);
			if (headDt.size() > 0) {
				obj = new OperationSel(context);
				obj.loadData(headDt);
				super.put(oid, obj);
				String key = obj.getSelectKey();
				operationSelMap.put(key, obj);
			}
		}
		return obj;
	}
}
