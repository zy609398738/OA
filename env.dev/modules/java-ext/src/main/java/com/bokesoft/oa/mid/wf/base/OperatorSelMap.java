package com.bokesoft.oa.mid.wf.base;

import java.util.LinkedHashMap;

import com.bokesoft.oa.base.BaseMap;
import com.bokesoft.oa.base.OAContext;
import com.bokesoft.yigo.mid.connection.IDBManager;
import com.bokesoft.yigo.struct.datatable.DataTable;

/**
 * 人员选择集合
 * 
 * @author minjian
 *
 */
public class OperatorSelMap extends BaseMap<Long, OperatorSel> {
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	/**
	 * 按照关键字符串存放的人员选择集合
	 */
	private LinkedHashMap<String, OperatorSel> operatorSelMap;

	/**
	 * 按照关键字符串存放的人员选择集合
	 * 
	 * @return 按照关键字符串存放的人员选择集合
	 */
	public LinkedHashMap<String, OperatorSel> getOperatorSelMap() {
		if (operatorSelMap == null) {
			operatorSelMap = new LinkedHashMap<String, OperatorSel>();
		}
		return operatorSelMap;
	}

	/**
	 * 按照关键字符串存放的人员选择集合
	 * 
	 * @param OperatorSelMap
	 *            按照关键字符串存放的人员选择集合
	 */
	public void setOperatorSelMap(LinkedHashMap<String, OperatorSel> OperatorSelMap) {
		this.operatorSelMap = OperatorSelMap;
	}

	/**
	 * 构造人员选择集合对象
	 * 
	 * @param context
	 *            OA上下文对象
	 */
	public OperatorSelMap(OAContext context) {
		super(context);
	}

	/**
	 * 获得人员选择对象
	 * 
	 * @param oid
	 *            人员选择对象标识
	 * @return 人员选择对象
	 * @throws Throwable
	 */
	public OperatorSel get(Long oid) throws Throwable {
		if (oid <= 0) {
			return null;
		}
		OperatorSel obj = super.get(oid);
		if (obj == null) {
			OAContext context = getContext();
			IDBManager dbm = context.getContext().getDBManager();
			String headSql = "select * from OA_OperatorSel_H where OID>0 and OID=?";
			DataTable headDt = dbm.execPrepareQuery(headSql, oid);
			if (headDt.size() > 0) {
				LinkedHashMap<String, OperatorSel> operatorSelMap = getOperatorSelMap();
				obj = new OperatorSel(context);
				obj.loadData(headDt);
				super.put(oid, obj);
				String key = obj.getSelectKey();
				operatorSelMap.put(key, obj);
			}
		}
		return obj;
	}
}
