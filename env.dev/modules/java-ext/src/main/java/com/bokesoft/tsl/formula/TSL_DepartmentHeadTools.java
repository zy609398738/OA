package com.bokesoft.tsl.formula;

import java.util.List;
import java.util.Set;

import com.bokesoft.oa.base.SqlWhere;
import com.bokesoft.oa.mid.wf.base.EmpSelConditionMap;
import com.bokesoft.oa.mid.wf.base.SelRule;
import com.bokesoft.yigo.mid.base.DefaultContext;
import com.bokesoft.yigo.struct.datatable.DataTable;

public class TSL_DepartmentHeadTools {
	public static Set<Long> getDeptHead(DefaultContext context, Long deptID, Set<Long> opteratorSet, SelRule selRule,
			DataTable businessDt, int level) {

		return opteratorSet;
	}

	public static long getDeptHead(DefaultContext context, Long deptID, SelRule selRule, DataTable businessDt,
			long excludeOperator) throws Throwable {
		Long deptHeadID = 0L;
		if (deptID <= 0) {
			return 0;
		}

		String sql = "select DeptHeadID,ParentID from OA_Department_H where oid>0 and oid=?";
		DataTable dt = context.getDBManager().execPrepareQuery(sql, deptID);
		if (dt.size() > 0) {
			deptID = dt.getLong("ParentID");
			deptHeadID = dt.getLong("DeptHeadID");
		}

		SqlWhere sqlWhere = getSqlWhere(selRule, businessDt);
		if (sqlWhere == null) {
			String employeeSQL = "select * from sys_operator where empid = ? and oid <> ? ";
			dt = context.getDBManager().execPrepareQuery(employeeSQL, deptHeadID, excludeOperator);
		} else {
			String sWhere = sqlWhere.getSqlWhereString();
			List<Object> valueList = sqlWhere.getValueList();

			String employeeSQL = "select * from sys_operator where empid = ? and oid <> ?";
			employeeSQL = "Select * from (" + employeeSQL + ") SourceTable where " + sWhere;
			valueList.add(0, deptHeadID);
			valueList.add(1, excludeOperator);
			dt = context.getDBManager().execPrepareQuery(employeeSQL, valueList);
		}

		if (dt.size() > 0) {
			return dt.getLong("oid");
		}

		return getDeptHead(context, deptID, selRule, businessDt, excludeOperator);
	}

	private static SqlWhere getSqlWhere(SelRule selRule, DataTable businessDt) throws Throwable {
		EmpSelConditionMap empSelConditionMap = selRule.getEmpSelConditionMap();
		if (empSelConditionMap == null || empSelConditionMap.size() <= 0) {
			return null;
		}
		SqlWhere sqlWhere = empSelConditionMap.getSqlWhere(businessDt);

		return sqlWhere;
	}
}
