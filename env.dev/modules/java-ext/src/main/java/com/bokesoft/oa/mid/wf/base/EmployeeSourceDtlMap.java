package com.bokesoft.oa.mid.wf.base;

import java.util.LinkedHashMap;

import com.bokesoft.oa.base.DtlBaseMap;
import com.bokesoft.oa.base.OAContext;
import com.bokesoft.yigo.mid.connection.IDBManager;
import com.bokesoft.yigo.struct.datatable.DataTable;

/**
 * 业务来源明细
 * 
 * @author zhoukaihe
 *
 */
public class EmployeeSourceDtlMap extends DtlBaseMap<Long, EmployeeSourceDtl, EmployeeSource> {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	/**
	 * 按照关键字符串存放的业务来源明细集合
	 */
	private LinkedHashMap<String, EmployeeSourceDtl> employeeSourceDtlMap;

	/**
	 * 按照关键字符串存放的业务来源明细集合
	 * 
	 * @return 按照关键字符串存放的业务来源明细集合
	 */
	public LinkedHashMap<String, EmployeeSourceDtl> getEmployeeSourceDtlMap() {
		if (employeeSourceDtlMap == null) {
			employeeSourceDtlMap = new LinkedHashMap<String, EmployeeSourceDtl>();
		}
		return employeeSourceDtlMap;
	}

	/**
	 * 按照关键字符串存放的业务来源明细集合
	 * 
	 * @param employeeSourceDtlMap
	 *            按照关键字符串存放的业务来源明细集合
	 */
	public void setEmployeeSourceDtlMap(LinkedHashMap<String, EmployeeSourceDtl> employeeSourceDtlMap) {
		this.employeeSourceDtlMap = employeeSourceDtlMap;
	}

	/**
	 * 构造业务来源明细对象
	 * 
	 * @param context
	 *            OA上下文对象
	 * @param employeeSource
	 *            人员来源
	 */
	public EmployeeSourceDtlMap(OAContext context, EmployeeSource employeeSource) {
		super(context, employeeSource);
	}

	/**
	 * 唯一标识字段Key
	 */
	private String oidFieldKey;

	/**
	 * 标识字段Key
	 * 
	 * @return 标识字段Key
	 */
	public String getOidFieldKey() {
		return oidFieldKey;
	}

	/**
	 * 标识字段Key
	 * 
	 * @param oidFieldKey
	 *            标识字段Key
	 */
	public void setOidFieldKey(String oidFieldKey) {
		this.oidFieldKey = oidFieldKey;
	}

	/**
	 * 用户字段Key
	 */
	private String userFieldKey;

	/**
	 * 用户字段Key
	 * 
	 * @return 用户字段Key
	 */
	public String getUserFieldKey() {
		return userFieldKey;
	}

	/**
	 * 用户字段Key
	 * 
	 * @param userFieldKey
	 *            用户字段Key
	 */
	public void setUserFieldKey(String userFieldKey) {
		this.userFieldKey = userFieldKey;
	}

	/**
	 * 载入数据
	 * 
	 * @param dt
	 *            明细数据集
	 * @throws Throwable
	 */
	public void loadData(DataTable dt) throws Throwable {
		LinkedHashMap<String, EmployeeSourceDtl> employeeSourceDtlMap = getEmployeeSourceDtlMap();
		dt.beforeFirst();
		while (dt.next()) {
			EmployeeSourceDtl obj = new EmployeeSourceDtl(getContext(), getHeadBase());
			obj.loadData(dt);
			String fieldKey = obj.getFieldKey();
			String fieldType = obj.getFieldType();
			put(obj.getOID(), obj);
			employeeSourceDtlMap.put(fieldKey, obj);
			if (fieldType.equalsIgnoreCase("oid")) {
				setOidFieldKey(fieldKey);
			}
			if (fieldType.equalsIgnoreCase("user")) {
				setUserFieldKey(fieldKey);
			}
		}
	}

	/**
	 * 获得业务来源明细对象
	 * 
	 * @param fieldKey
	 *            字段的Key
	 * @return 业务来源明细对象
	 * @throws Throwable
	 */
	public EmployeeSourceDtl get(String fieldKey) throws Throwable {
		LinkedHashMap<String, EmployeeSourceDtl> employeeSourceDtlMap = getEmployeeSourceDtlMap();
		EmployeeSourceDtl obj = employeeSourceDtlMap.get(fieldKey);
		if (obj == null) {
			OAContext context = getContext();
			IDBManager dbm = context.getContext().getDBManager();
			String headSql = "select * from OA_EmployeeSource_D where oid>0 and FieldKey=?";
			DataTable headDt = dbm.execPrepareQuery(headSql, fieldKey);
			if (headDt.size() > 0) {
				obj = new EmployeeSourceDtl(context, getHeadBase());
				obj.loadData(headDt);
				super.put(obj.getOID(), obj);
				employeeSourceDtlMap.put(fieldKey, obj);
				if (fieldKey.equalsIgnoreCase("oid")) {
					setOidFieldKey(fieldKey);
				}
				if (fieldKey.equalsIgnoreCase("user")) {
					setUserFieldKey(fieldKey);
				}
			}
		}
		return obj;
	}
}