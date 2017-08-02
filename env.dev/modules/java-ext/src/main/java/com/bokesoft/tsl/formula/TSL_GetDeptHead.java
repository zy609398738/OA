package com.bokesoft.tsl.formula;

import com.bokesoft.yigo.common.util.TypeConvertor;
import com.bokesoft.yigo.mid.base.DefaultContext;
import com.bokesoft.yigo.mid.parser.BaseMidFunctionImpl;
import com.bokesoft.yigo.parser.IExecutor;
import com.bokesoft.yigo.struct.datatable.DataTable;

/**
 * 获得部门领导
 *
 */
public class TSL_GetDeptHead extends BaseMidFunctionImpl {

	@Override
	public Object evalImpl(String name, DefaultContext context, Object[] args, IExecutor iExecutor) throws Throwable {
		Long empID = TypeConvertor.toLong(args[0]);
		if (empID <= 0) {
			return 0;
		}
		Long deptID = 0L;
		String sql = "select DeptID from OA_Employee_H where oid=?";
		DataTable dt = context.getDBManager().execPrepareQuery(sql, empID);
		if (dt.size() > 0) {
			deptID = dt.getLong("DeptID");
		}
		return getDeptHead(context, deptID, empID);
	}

	/**
	 * 获得部门领导ID
	 * 
	 * @param context
	 *            上下文对象
	 * @param deptID
	 *            当前部门ID
	 * @param empID
	 *            当前申请人id
	 * @return 部门领导ID
	 * @throws Throwable
	 */
	public Long getDeptHead(DefaultContext context, Long deptID, Long empID) throws Throwable {
		Long deptHeadID = 0L;
		if (deptID <= 0) {
			return deptHeadID;
		}
		String sql = "select DeptHeadID,ParentID from OA_Department_H where oid>0 and oid=?";
		DataTable dt = context.getDBManager().execPrepareQuery(sql, deptID);
		deptHeadID = dt.getLong("DeptHeadID");
		if (empID != null && empID > 0 && empID.equals(deptHeadID)) {
			Long parentID = dt.getLong("ParentID");
			deptHeadID = getDeptHead(context, parentID, empID);
		}
		return deptHeadID;
	}
}
