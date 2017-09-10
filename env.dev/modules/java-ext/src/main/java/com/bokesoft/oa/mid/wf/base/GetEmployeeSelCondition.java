package com.bokesoft.oa.mid.wf.base;

import java.util.Set;

import com.bokesoft.oa.base.OAContext;
import com.bokesoft.yigo.struct.datatable.DataTable;

/**
 * 取人员匹配规则的人员
 * 
 * @author minjian
 *
 */
public class GetEmployeeSelCondition implements ISelRule {

	@Override
	public Set<Long> getOpteratorSet(OAContext oaContext, SelRule selRule, Set<Long> opteratorSet, DataTable businessDt,
			DataTable operatorDt, Long oid) throws Throwable {
		if (operatorDt == null || operatorDt.size() <= 0) {
			return opteratorSet;
		}
		EmployeeSource employeeSource = selRule.getEmployeeSource();
		if (employeeSource == null) {
			return opteratorSet;
		}
		EmployeeSourceDtlMap employeeSourceDtlMap = employeeSource.getEmployeeSourceDtlMap();
		if (employeeSourceDtlMap == null) {
			return opteratorSet;
		}
		String userFieldKey = employeeSourceDtlMap.getUserFieldKey();
		operatorDt.beforeFirst();
		while (operatorDt.next()) {
			Long id = operatorDt.getLong(userFieldKey);
			opteratorSet.add(id);
		}
		return opteratorSet;
	}

}
