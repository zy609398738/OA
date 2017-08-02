package com.bokesoft.oa.mid.wf.base;

import java.util.List;

import com.bokesoft.oa.base.DicBase;
import com.bokesoft.oa.base.OAContext;
import com.bokesoft.oa.util.StrUtil;
import com.bokesoft.yigo.struct.datatable.DataTable;

/**
 * 工时区间
 * 
 * @author minjian
 *
 */
public class WorkingTime extends DicBase {
	/**
	 * 每周固定休息日
	 */
	private String weekend;

	/**
	 * 每周固定休息日
	 * 
	 * @return 每周固定休息日
	 */
	public String getWeekend() {
		return weekend;
	}

	/**
	 * 每周固定休息日
	 * 
	 * @param weekend
	 *            每周固定休息日
	 */
	public void setWeekend(String weekend) {
		this.weekend = weekend;
	}

	/**
	 * 每周固定休息日
	 * 
	 * @return 每周固定休息日
	 */
	public List<Integer> getWeekendList() {
		List<Integer> weekendList = StrUtil.getIntegerListByStr(weekend);
		return weekendList;
	}

	/**
	 * 工时区间
	 */
	private String officeHour;

	/**
	 * 工时区间
	 * 
	 * @return 工时区间
	 */
	public String getOfficeHour() {
		return officeHour;
	}

	/**
	 * 工时区间
	 * 
	 * @param officeHour
	 *            工时区间
	 */
	public void setOfficeHour(String officeHour) {
		this.officeHour = officeHour;
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
		setWeekend(dt.getString("Weekend"));
		setOfficeHour(dt.getString("OfficeHour"));
	}

	/**
	 * 构造工时区间对象
	 * 
	 * @param context
	 *            OA上下文
	 */
	public WorkingTime(OAContext context) {
		super(context);
	}
}
