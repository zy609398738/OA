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
	 * 人员ID
	 */
	private Long employeeID;

	/**
	 * 人员ID
	 * 
	 * @return 人员
	 */
	public Long getEmployeeID() {
		return employeeID;
	}

	/**
	 * 人员ID
	 * 
	 * @param employeeID
	 *            人员
	 */
	public void setEmployeeID(Long employeeID) {
		this.employeeID = employeeID;
	}

	/**
	 * 人员
	 */
	private Employee employee;

	/**
	 * 人员
	 * 
	 * @return 人员
	 * @throws Throwable
	 */
	public Employee getEmployee() throws Throwable {
		if (employee == null) {
			if (employeeID > 0) {
				employee = getContext().getEmployeeMap().get(employeeID);
			}
		}
		return employee;
	}

	/**
	 * 人员
	 * 
	 * @param employee
	 *            人员
	 */
	public void setEmployee(Employee employee) {
		this.employee = employee;
		setEmployeeID(employee.getOID());
	}

	/**
	 * 部门ID
	 */
	private Long departmentID;

	/**
	 * 部门ID
	 * 
	 * @return 部门ID
	 */
	public Long getDepartmentID() {
		return departmentID;
	}

	/**
	 * 部门ID
	 * 
	 * @param departmentID
	 *            部门ID
	 */
	public void setDepartmentID(Long departmentID) {
		this.departmentID = departmentID;
	}

	/**
	 * 部门
	 */
	private Department department;

	/**
	 * 部门
	 * 
	 * @return 部门
	 * @throws Throwable
	 */
	public Department getDepartment() throws Throwable {
		if (department == null) {
			if (departmentID > 0) {
				department = getContext().getDepartmentMap().get(departmentID);
			}
		}
		return department;
	}

	/**
	 * 部门
	 * 
	 * @param department
	 *            部门
	 */
	public void setDepartment(Department department) {
		this.department = department;
		setDepartmentID(department.getOID());
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
		setEmployeeID(dt.getLong("EmpID"));
		setDepartmentID(dt.getLong("DeptID"));
	}

	/**
	 * 构造操作员对象
	 * 
	 * @param context
	 *            上下文对象
	 */
	public Operator(OAContext context) {
		super(context);
	}
}
