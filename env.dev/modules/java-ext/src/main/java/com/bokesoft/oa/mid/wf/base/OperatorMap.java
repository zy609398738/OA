package com.bokesoft.oa.mid.wf.base;

import java.util.LinkedHashMap;

import com.bokesoft.oa.base.BaseMap;
import com.bokesoft.oa.base.OAContext;
import com.bokesoft.yes.common.util.StringUtil;
import com.bokesoft.yigo.mid.connection.IDBManager;
import com.bokesoft.yigo.struct.datatable.DataTable;

/**
 * 操作员集合
 * 
 * @author zhoukaihe
 *
 */
public class OperatorMap extends BaseMap<Long, Operator> {
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	/**
	 * 以代码为标识存放的操作员集合
	 */
	private LinkedHashMap<String, Operator> codeMap;

	/**
	 * 以代码为标识存放的操作员集合
	 * 
	 * @return 以代码为标识存放的操作员集合
	 */
	public LinkedHashMap<String, Operator> getCodeMap() {
		if (codeMap == null) {
			codeMap = new LinkedHashMap<String, Operator>();
		}
		return codeMap;
	}

	/**
	 * 以代码为标识存放的操作员集合
	 * 
	 * @param codeMap
	 *            以代码为标识存放的操作员集合
	 */
	public void setCodeMap(LinkedHashMap<String, Operator> codeMap) {
		this.codeMap = codeMap;
	}

	/**
	 * 构造操作员集合
	 * 
	 * @param context
	 *            OA上下文
	 */
	public OperatorMap(OAContext context) {
		super(context);
	}

	/**
	 * 操作员
	 * 
	 * @param oid
	 * @return
	 * @throws Throwable
	 */
	public Operator get(Long oid) throws Throwable {
		if (oid <= 0) {
			return null;
		}
		LinkedHashMap<String, Operator> codeMap = getCodeMap();
		Operator obj = super.get(oid);
		if (obj == null) {
			String headSql = "select * from SYS_Operator where OID>0 and oid=?";
			IDBManager dbm = getContext().getContext().getDBManager();
			DataTable headDt = dbm.execPrepareQuery(headSql, oid);
			headDt.beforeFirst();
			while (headDt.next()) {
				obj = new Operator(getContext());
				obj.loadData(headDt);
				super.put(oid, obj);
				codeMap.put(obj.getCode(), obj);
			}
		}
		return obj;
	}

	/**
	 * 操作员
	 * 
	 * @param oid
	 * @return
	 * @throws Throwable
	 */
	public Operator get(String code) throws Throwable {
		if (StringUtil.isBlankOrNull(code)) {
			return null;
		}
		LinkedHashMap<String, Operator> codeMap = getCodeMap();
		Operator obj = codeMap.get(code);
		if (obj == null) {
			String headSql = "select * from SYS_Operator where OID>0 and code=?";
			IDBManager dbm = getContext().getContext().getDBManager();
			DataTable headDt = dbm.execPrepareQuery(headSql, code);
			headDt.beforeFirst();
			while (headDt.next()) {
				obj = new Operator(getContext());
				obj.loadData(headDt);
				super.put(obj.getOID(), obj);
				codeMap.put(code, obj);
			}
		}
		return obj;
	}
}
