package com.bokesoft.oa.mid.wf.base;

import java.util.LinkedHashMap;

import com.bokesoft.oa.base.DtlBaseMap;
import com.bokesoft.oa.base.OAContext;
import com.bokesoft.yigo.mid.connection.IDBManager;
import com.bokesoft.yigo.struct.datatable.DataTable;

/**
 * 业务来源明细表集合
 * 
 * @author zhoukaihe
 *
 */
public class BusinessSourceDtlMap extends DtlBaseMap<Long, BusinessSourceDtl, BusinessSource> {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	/**
	 * 按照关键字符串存放的业务来源明细集合
	 */
	private LinkedHashMap<String, BusinessSourceDtl> businessSourceDtlMap;

	/**
	 * 按照关键字符串存放的业务来源明细集合
	 * 
	 * @return 按照关键字符串存放的业务来源明细集合
	 */
	public LinkedHashMap<String, BusinessSourceDtl> getBusinessSourceDtlMap() {
		if (businessSourceDtlMap == null) {
			businessSourceDtlMap = new LinkedHashMap<String, BusinessSourceDtl>();
		}
		return businessSourceDtlMap;
	}

	/**
	 * 按照关键字符串存放的业务来源明细集合
	 * 
	 * @param businessSourceDtlMap
	 *            按照关键字符串存放的业务来源明细集合
	 */
	public void setBusinessSourceDtlMap(LinkedHashMap<String, BusinessSourceDtl> businessSourceDtlMap) {
		this.businessSourceDtlMap = businessSourceDtlMap;
	}

	/**
	 * 唯一标识字段Key
	 */
	private String oidFieldKey;

	/**
	 * 唯一标识字段Key
	 * 
	 * @return 唯一标识字段Key
	 */
	public String getOidFieldKey() {
		return oidFieldKey;
	}

	/**
	 * 唯一标识字段Key
	 * 
	 * @param oidFieldKey
	 *            唯一标识字段Key
	 */
	public void setOidFieldKey(String oidFieldKey) {
		this.oidFieldKey = oidFieldKey;
	}

	/**
	 * 构造业务来源明细集合对象
	 * 
	 * @param context
	 *            OA上下文对象
	 * @param businessSource
	 *            业务来源
	 */
	public BusinessSourceDtlMap(OAContext context, BusinessSource businessSource) {
		super(context, businessSource);
	}

	/**
	 * 载入数据
	 * 
	 * @param dt
	 *            明细数据集
	 * @throws Throwable
	 */
	public void loadData(DataTable dt) throws Throwable {
		LinkedHashMap<String, BusinessSourceDtl> businessSourceDtlMap = getBusinessSourceDtlMap();
		dt.beforeFirst();
		while (dt.next()) {
			BusinessSourceDtl obj = new BusinessSourceDtl(getContext(), getHeadBase());
			obj.loadData(dt);
			put(obj.getOID(), obj);
			String fieldKey = obj.getFieldKey();
			businessSourceDtlMap.put(fieldKey, obj);
			if (fieldKey.equalsIgnoreCase("oid")) {
				setOidFieldKey(fieldKey);
			}
		}
	}

	/**
	 * 获得业务来源明细明细对象
	 * 
	 * @param fieldKey
	 *            字段的Key
	 * @return 业务来源明细对象
	 * @throws Throwable
	 */
	public BusinessSourceDtl get(String fieldKey) throws Throwable {
		LinkedHashMap<String, BusinessSourceDtl> businessSourceDtlMap = getBusinessSourceDtlMap();
		BusinessSourceDtl obj = businessSourceDtlMap.get(fieldKey);
		if (obj == null) {
			OAContext context = getContext();
			IDBManager dbm = context.getContext().getDBManager();
			String headSql = "select * from OA_BusinessSource_D where oid>0 and FieldKey=?";
			DataTable headDt = dbm.execPrepareQuery(headSql, fieldKey);
			if (headDt.size() > 0) {
				obj = new BusinessSourceDtl(context, getHeadBase());
				obj.loadData(headDt);
				super.put(obj.getOID(), obj);
				businessSourceDtlMap.put(fieldKey, obj);
				if (fieldKey.equalsIgnoreCase("oid")) {
					setOidFieldKey(fieldKey);
				}
			}
		}
		return obj;
	}
}
