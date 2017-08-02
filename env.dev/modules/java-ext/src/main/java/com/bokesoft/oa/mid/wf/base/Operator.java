package com.bokesoft.oa.mid.wf.base;

import com.bokesoft.oa.base.DicBase;
import com.bokesoft.oa.base.OAContext;
import com.bokesoft.yigo.struct.datatable.DataTable;

/**
 * 操作员
 * 
 * @author zhoukaihe
 *
 */
public class Operator extends DicBase {
	/**
	 * 人员
	 */
	private Employee empID;

	/**
	 * 人员
	 * 
	 * @return 人员
	 */
	public Employee getEmpID() {
		return empID;
	}

	/**
	 * 人员
	 * 
	 * @param empID
	 *            人员
	 */
	public void setEmpID(Employee empID) {
		this.empID = empID;
	}

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
	 * 载入数据
	 * 
	 * @param dt
	 *            头表数据集
	 * @throws Throwable
	 */
	public void loadData(DataTable dt) throws Throwable {
		super.loadData(dt);
		Employee emp = getContext().getEmployeeMap().get(dt.getLong("EmpID"));
		setEmpID(emp);
		Department department = getContext().getDepartmentMap().get(dt.getLong("DeptID"));
		setDept(department);
	}

	public Operator(OAContext context) {
		super(context);
	}

	/**
	 * 重载，输出标识ID,单据标识，单据名称
	 */
	public String toString() {
		return super.toString() + ",单据标识:" + getKey() + ",单据名称:" + getCaption();
	}
}
