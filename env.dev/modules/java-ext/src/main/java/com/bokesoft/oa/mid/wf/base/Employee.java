package com.bokesoft.oa.mid.wf.base;

import com.bokesoft.oa.base.DicBase;
import com.bokesoft.oa.base.OAContext;
import com.bokesoft.yigo.struct.datatable.DataTable;

/**
 * 人员
 * 
 * @author zhoukaihe
 *
 */
public class Employee extends DicBase {
	/**
	 * 所属部门标识
	 */
	private Long departmentID;

	/**
	 * 所属部门标识
	 * 
	 * @return 所属部门标识
	 */
	public Long getDepartmentID() {
		return departmentID;
	}

	/**
	 * 所属部门标识
	 * 
	 * @param departmentID
	 *            所属部门标识
	 */
	public void setDepartmentID(Long departmentID) {
		this.departmentID = departmentID;
	}

	/**
	 * 所属部门
	 */
	private Department department;

	/**
	 * 所属部门
	 * 
	 * @return 所属部门
	 * @throws Throwable
	 */
	public Department getDepartment() throws Throwable {
		if (departmentID <= 0) {
			return department;
		}
		if (department == null) {
			department = getContext().getDepartmentMap().get(departmentID);
		}
		return department;
	}

	/**
	 * 所属部门
	 * 
	 * @param department
	 *            所属部门
	 */
	public void setDepartment(Department department) {
		this.department = department;
		setDepartmentID(department.getOID());
	}

	/**
	 * 直属领导标识
	 */
	private Long leaderID;

	/**
	 * 直属领导标识
	 * 
	 * @return 直属领导标识
	 */
	public Long getLeaderID() {
		return leaderID;
	}

	/**
	 * 直属领导标识
	 * 
	 * @param leaderID
	 *            直属领导标识
	 */
	public void setLeaderID(Long leaderID) {
		this.leaderID = leaderID;
	}

	/**
	 * 直属领导
	 */
	private Employee leader;

	/**
	 * 直属领导
	 * 
	 * @return 直属领导
	 * @throws Throwable
	 */
	public Employee getLeader() throws Throwable {
		if (leaderID <= 0) {
			return leader;
		}
		if (leader == null) {
			leader = getContext().getEmployeeMap().get(leaderID);
		}
		return leader;
	}

	/**
	 * 直属领导
	 * 
	 * @param leader
	 *            直属领导
	 */
	public void setLeader(Employee leader) {
		this.leader = leader;
		setLeaderID(leader.getOID());
	}

	/**
	 * 人员明细集合
	 */
	private EmployeeDtlMap employeeDtlMap;

	/**
	 * 人员明细集合
	 * 
	 * @return 人员明细集合
	 * @throws Throwable
	 */
	public EmployeeDtlMap getEmployeeDtlMap() throws Throwable {
		if (employeeDtlMap == null) {
			employeeDtlMap = new EmployeeDtlMap(getContext(), this);
			Long oid = getOID();
			if (oid > 0) {
				String dtlSql = "select * from OA_Employee_D where OID>0 and SOID=?";
				DataTable dtlDt = getContext().getContext().getDBManager().execPrepareQuery(dtlSql, oid);
				employeeDtlMap.loadData(dtlDt);
			}
		}
		return employeeDtlMap;
	}

	/**
	 * 人员明细集合
	 * 
	 * @param employeeDtlMap
	 *            人员明细集合
	 */
	public void setEmployeeDtlMap(EmployeeDtlMap employeeDtlMap) {
		this.employeeDtlMap = employeeDtlMap;
	}

	/**
	 * 构造人员对象
	 * 
	 * @param context
	 *            OA上下文
	 */
	public Employee(OAContext context) {
		super(context);
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
		setLeaderID(dt.getLong("LeaderID"));
		setDepartmentID(dt.getLong("DeptID"));
	}

	/**
	 * 载入数据
	 * 
	 * @param headDt
	 *            头表数据集
	 * @param dtlDt
	 *            明细数据集
	 * @throws Throwable
	 */
	public void loadData(DataTable headDt, DataTable dtlDt) throws Throwable {
		loadData(headDt);
		getEmployeeDtlMap().loadData(dtlDt);
	}
}
