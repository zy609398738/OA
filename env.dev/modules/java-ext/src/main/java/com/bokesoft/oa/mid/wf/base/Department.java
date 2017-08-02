package com.bokesoft.oa.mid.wf.base;

import com.bokesoft.oa.base.DicBase;
import com.bokesoft.oa.base.OAContext;
import com.bokesoft.yigo.struct.datatable.DataTable;

/**
 * 部门
 * 
 * @author zhoukaihe
 *
 */
public class Department extends DicBase {
	/**
	 * 部门层级
	 */
	private int org_Level;

	/**
	 * 部门层级
	 * 
	 * @return 部门层级
	 */
	public int getOrg_Level() {
		return org_Level;
	}

	/**
	 * 部门层级
	 * 
	 * @param org_Level
	 *            部门层级
	 */
	public void setOrg_Level(int org_Level) {
		this.org_Level = org_Level;
	}

	/**
	 * 上级部门标识
	 */
	private Long parentID;

	/**
	 * 上级部门标识
	 * 
	 * @return 上级部门标识
	 */
	public Long getParentID() {
		return parentID;
	}

	/**
	 * 上级部门标识
	 * 
	 * @param parentID
	 *            上级部门标识
	 */
	public void setParentID(Long parentID) {
		this.parentID = parentID;
	}

	/**
	 * 上级部门
	 */
	private Department parent;

	/**
	 * 上级部门
	 * 
	 * @return 上级部门
	 * @throws Throwable
	 */
	public Department getParent() throws Throwable {
		if (parentID <= 0) {
			return parent;
		}
		if (parent == null) {
			parent = getContext().getDepartmentMap().get(parentID);
		}
		return parent;
	}

	/**
	 * 上级部门
	 * 
	 * @param parent
	 *            上级部门
	 */
	public void setParent(Department parent) {
		this.parent = parent;
		setParentID(parent.getOID());
	}

	/**
	 * 部门负责人标识
	 */
	private Long deptHeadID;

	/**
	 * 部门负责人标识
	 * 
	 * @return 部门负责人标识
	 */
	public Long getDeptHeadID() {
		return deptHeadID;
	}

	/**
	 * 部门负责人标识
	 * 
	 * @param deptHeadID
	 *            部门负责人标识
	 */
	public void setDeptHeadID(Long deptHeadID) {
		this.deptHeadID = deptHeadID;
	}

	/**
	 * 部门负责人
	 */
	private Employee deptHead;

	/**
	 * 部门负责人
	 * 
	 * @return 部门负责人
	 * @throws Throwable
	 */
	public Employee getDeptHead() throws Throwable {
		if (deptHeadID <= 0) {
			return deptHead;
		}
		if (deptHead == null) {
			deptHead = getContext().getEmployeeMap().get(deptHeadID);
		}
		return deptHead;
	}

	/**
	 * 部门负责人
	 * 
	 * @param deptHead
	 *            部门负责人
	 */
	public void setDeptHead(Employee deptHead) {
		this.deptHead = deptHead;
		setDeptHeadID(deptHead.getOID());
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
		setOrg_Level(dt.getInt("Org_Level"));
		setDeptHeadID(dt.getLong("DeptHeadID"));
		setParentID(dt.getLong("ParentID"));
	}

	public Department(OAContext context) {
		super(context);
	}
}
