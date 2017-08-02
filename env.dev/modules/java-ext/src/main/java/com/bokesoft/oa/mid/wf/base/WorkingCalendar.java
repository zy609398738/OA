package com.bokesoft.oa.mid.wf.base;

import java.util.Date;
import java.util.LinkedHashMap;

import com.bokesoft.oa.base.DicBase;
import com.bokesoft.oa.base.OAContext;
import com.bokesoft.yigo.struct.datatable.DataTable;

/**
 * 工作日历
 * 
 * @author minjian
 *
 */
public class WorkingCalendar extends DicBase {
	/**
	 * 开始日期
	 */
	private Date startDate;

	/**
	 * 开始日期
	 * 
	 * @return 开始日期
	 */
	public Date getStartDate() {
		return startDate;
	}

	/**
	 * 开始日期
	 * 
	 * @param startDate
	 *            开始日期
	 */
	public void setStartDate(Date startDate) {
		this.startDate = startDate;
	}

	/**
	 * 结束日期
	 */
	private Date endDate;

	/**
	 * 结束日期
	 * 
	 * @return 结束日期
	 */
	public Date getEndDate() {
		return endDate;
	}

	/**
	 * 结束日期
	 * 
	 * @param endDate
	 *            结束日期
	 */
	public void setEndDate(Date endDate) {
		this.endDate = endDate;
	}

	/**
	 * 工时区间
	 */
	private WorkingTime workingTime;

	/**
	 * 工时区间
	 * 
	 * @return 工时区间
	 */
	public WorkingTime getWorkingTime() {
		return workingTime;
	}

	/**
	 * 工时区间
	 * 
	 * @param workingTime
	 *            工时区间
	 */
	public void setWorkingTime(WorkingTime workingTime) {
		this.workingTime = workingTime;
	}

	/**
	 * 工作日历明细集合
	 */
	private WorkingCalendarDtlMap workingCalendarDtlMap;

	/**
	 * 工作日历明细集合
	 * 
	 * @return 工作日历明细集合
	 * @throws Throwable
	 */
	public WorkingCalendarDtlMap getWorkingCalendarDtlMap() throws Throwable {
		if (workingCalendarDtlMap == null) {
			workingCalendarDtlMap = new WorkingCalendarDtlMap(getContext(), this);
			Long oid = getOID();
			if (oid > 0) {
				String dtlSql = "select * from OA_WorkingCalendar_D where OID>0 and SOID=? order by DateOfYear asc";
				DataTable dtlDt = getContext().getContext().getDBManager().execPrepareQuery(dtlSql, oid);
				workingCalendarDtlMap.loadData(dtlDt);
			}
		}
		return workingCalendarDtlMap;
	}

	/**
	 * 工作日历明细集合
	 * 
	 * @param workingCalendarDtlMap
	 *            工作日历明细集合
	 */
	public void setWorkingCalendarDtlMap(WorkingCalendarDtlMap workingCalendarDtlMap) {
		this.workingCalendarDtlMap = workingCalendarDtlMap;
	}

	/**
	 * 休息日明细集合
	 * 
	 * @return 休息日明细集合
	 * @throws Throwable
	 */
	public LinkedHashMap<Long, WorkingCalendarDtl> getNoWorkDayMap() throws Throwable {
		if (workingCalendarDtlMap == null) {
			workingCalendarDtlMap = new WorkingCalendarDtlMap(getContext(), this);
			Long oid = getOID();
			if (oid > 0) {
				String dtlSql = "select * from OA_WorkingCalendar_D where SOID=? and OffDay=1 and OID>0";
				DataTable dtlDt = getContext().getContext().getDBManager().execPrepareQuery(dtlSql, oid);
				workingCalendarDtlMap.loadData(dtlDt);
			}
		}
		return workingCalendarDtlMap.getWorkingCalendarDtlMap();
	}

	/**
	 * 载入数据
	 * 
	 * @param dt
	 *            头表数据集
	 * @throws Throwable
	 */
	public void loadData(DataTable dt) throws Throwable {
		super.loadData(dt);
		setStartDate(dt.getDateTime("StartDate"));
		setEndDate(dt.getDateTime("EndDate"));
		Long workingTimeID = dt.getLong("WorkingTimeID");
		WorkingTime workingTime = getContext().getWorkingTimeMap().get(workingTimeID);
		setWorkingTime(workingTime);
	}

	/**
	 * 载入数据
	 * 
	 * @param headDt
	 *            头表数据集
	 * @param DtlDt
	 *            明细数据集
	 * @throws Throwable
	 */
	public void loadData(DataTable headDt, DataTable dtlDt) throws Throwable {
		loadData(headDt);
		getWorkingCalendarDtlMap().loadData(dtlDt);
	}

	/**
	 * 构造工作日历对象
	 * 
	 * @param context
	 *            OA上下文
	 */
	public WorkingCalendar(OAContext context) {
		super(context);
	}

}
