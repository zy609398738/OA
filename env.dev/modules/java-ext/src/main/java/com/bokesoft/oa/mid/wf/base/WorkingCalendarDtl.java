package com.bokesoft.oa.mid.wf.base;

import java.util.Date;

import com.bokesoft.oa.base.DtlBase;
import com.bokesoft.oa.base.OAContext;
import com.bokesoft.yigo.struct.datatable.DataTable;

/**
 * 工作日历明细
 * 
 * @author minjian
 *
 */
public class WorkingCalendarDtl extends DtlBase<WorkingCalendar> {
	/**
	 * 日期
	 */
	private Date dateOfYear;

	/**
	 * 日期
	 * 
	 * @return 日期
	 */
	public Date getDateOfYear() {
		return dateOfYear;
	}

	/**
	 * 日期
	 * 
	 * @param dateOfYear
	 *            日期
	 */
	public void setDateOfYear(Date dateOfYear) {
		this.dateOfYear = dateOfYear;
	}

	/**
	 * 是否休息日
	 */
	private Integer offDay;

	/**
	 * 是否休息日
	 * 
	 * @return 是否休息日
	 */
	public Integer getOffDay() {
		return offDay;
	}

	/**
	 * 是否休息日
	 * 
	 * @param offDay
	 *            是否休息日
	 */
	public void setOffDay(Integer offDay) {
		this.offDay = offDay;
	}

	/**
	 * 构造工作日历明细对象
	 * 
	 * @param context
	 *            OA上下文
	 * @param workingCalendar
	 *            工作日历
	 */
	public WorkingCalendarDtl(OAContext context, WorkingCalendar workingCalendar) {
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
		super.loadData(dt);
		setDateOfYear(dt.getDateTime("DateOfYear"));
		setOffDay(dt.getInt("OffDay"));
	}

	/**
	 * 重载
	 */
	public String toString() {
		return super.toString() + "，日期:" + getDateOfYear() + "，是否休息日:" + getOffDay();
	}
}
