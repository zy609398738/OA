package com.bokesoft.oa.mid.wf.base;

import java.util.LinkedHashMap;

import com.bokesoft.oa.base.DtlBaseMap;
import com.bokesoft.oa.base.OAContext;
import com.bokesoft.yigo.mid.connection.IDBManager;
import com.bokesoft.yigo.struct.datatable.DataTable;

/**
 * 工作日历明细表集合
 * 
 * @author minjian
 *
 */
public class WorkingCalendarDtlMap extends DtlBaseMap<Long, WorkingCalendarDtl, WorkingCalendar> {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	/**
	 * 存放的非工作日的工作日历明细集合
	 */
	private LinkedHashMap<Long, WorkingCalendarDtl> workingCalendarDtlMap;

	/**
	 * 存放的非工作日的工作日历明细集合
	 * 
	 * @return 存放的非工作日的工作日历明细集合
	 */
	public LinkedHashMap<Long, WorkingCalendarDtl> getWorkingCalendarDtlMap() {
		if (workingCalendarDtlMap == null) {
			workingCalendarDtlMap = new LinkedHashMap<Long, WorkingCalendarDtl>();
		}
		return workingCalendarDtlMap;
	}

	/**
	 * 存放的非工作日的工作日历明细集合
	 * 
	 * @param workingCalendarDtlMap
	 *            存放的非工作日的工作日历明细集合
	 */
	public void setWorkingCalendarDtlMap(LinkedHashMap<Long, WorkingCalendarDtl> workingCalendarDtlMap) {
		this.workingCalendarDtlMap = workingCalendarDtlMap;
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
	 * 构造工作日历明细集合对象
	 * 
	 * @param context
	 *            OA上下文对象
	 * @param workingCalendar
	 *            工作日历
	 */
	public WorkingCalendarDtlMap(OAContext context, WorkingCalendar workingCalendar) {
		super(context, workingCalendar);
	}

	/**
	 * 载入数据
	 * 
	 * @param dt
	 *            明细数据集
	 * @throws Throwable
	 */
	public void loadData(DataTable dt) throws Throwable {
		LinkedHashMap<Long, WorkingCalendarDtl> workingCalendarDtlMap = getWorkingCalendarDtlMap();
		dt.beforeFirst();
		while (dt.next()) {
			WorkingCalendarDtl obj = new WorkingCalendarDtl(getContext(), getHeadBase());
			obj.loadData(dt);
			put(obj.getOID(), obj);
			if (obj.getOffDay() == 1) {
				workingCalendarDtlMap.put(obj.getOID(), obj);
			}
		}
	}

	/**
	 * 获得工作日历明细明细对象
	 * 
	 * @param fieldKey
	 *            字段的Key
	 * @return 工作日历明细对象
	 * @throws Throwable
	 */
	public WorkingCalendarDtl get(String fieldKey) throws Throwable {
		LinkedHashMap<Long, WorkingCalendarDtl> workingCalendarDtlMap = getWorkingCalendarDtlMap();
		WorkingCalendarDtl obj = workingCalendarDtlMap.get(fieldKey);
		if (obj == null) {
			OAContext context = getContext();
			IDBManager dbm = context.getContext().getDBManager();
			String headSql = "select * from OA_WorkingCalendar_D where oid>0 and FieldKey=?";
			DataTable headDt = dbm.execPrepareQuery(headSql, fieldKey);
			if (headDt.size() > 0) {
				obj = new WorkingCalendarDtl(context, getHeadBase());
				obj.loadData(headDt);
				super.put(obj.getOID(), obj);
				if (obj.getOffDay() == 1) {
					workingCalendarDtlMap.put(obj.getOID(), obj);
				}
			}
		}
		return obj;
	}
}
