package com.bokesoft.oa.mid.wf.base;

import com.bokesoft.oa.base.DtlBase;
import com.bokesoft.oa.base.OAContext;
import com.bokesoft.yigo.struct.datatable.DataTable;

/**
 * 人员明细
 * 
 * @author minjian
 *
 */
public class EmployeeDtl extends DtlBase<Employee> {
	/**
	 * 所属部门
	 */
	private Department dept;

	/**
	 * 所属部门
	 * 
	 * @return 所属部门
	 */
	public Department getDept() {
		return dept;
	}

	/**
	 * 所属部门
	 * 
	 * @param dept
	 *            所属部门
	 */
	public void setDept(Department dept) {
		this.dept = dept;
	}

	/**
	 * 职务
	 */
	private Duty position;

	/**
	 * 职务
	 * 
	 * @return 职务
	 */
	public Duty getPosition() {
		return position;
	}

	/**
	 * 职务
	 * 
	 * @param position
	 *            职务
	 */
	public void setPosition(Duty position) {
		this.position = position;
	}

	/**
	 * 是否主职务
	 */
	private int mainPosition;

	/**
	 * 是否主职务
	 * 
	 * @return 是否主职务
	 */
	public int getMainPosition() {
		return mainPosition;
	}

	/**
	 * 是否主职务
	 * 
	 * @param mainPosition
	 *            是否主职务
	 */
	public void setMainPosition(int mainPosition) {
		this.mainPosition = mainPosition;
	}

	/**
	 * 构造人员明细对象
	 * 
	 * @param context
	 *            OA上下文
	 * @param employee
	 *            人员对象
	 */
	public EmployeeDtl(OAContext context, Employee employee) {
		super(context, employee);
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
		Department dept = getContext().getDepartmentMap().get(dt.getLong("DepartmentID"));
		setDept(dept);
		Duty duty = getContext().getDutyMap().get(dt.getLong("PositionID"));
		setPosition(duty);
		setMainPosition(dt.getInt("MainPosition"));
	}
}
