package com.bokesoft.tsl.formula;

import java.util.Set;

import com.bokesoft.oa.base.OAContext;
import com.bokesoft.oa.mid.wf.base.ISelRule;
import com.bokesoft.oa.mid.wf.base.SelRule;
import com.bokesoft.yigo.meta.dataobject.MetaTable;
import com.bokesoft.yigo.mid.base.DefaultContext;
import com.bokesoft.yigo.struct.datatable.DataTable;
import com.bokesoft.yigo.struct.document.Document;

/**
 * 获得部门领导
 *
 */
public class TSL_GetDeptHead implements ISelRule {

	@Override
	public Set<Long> getOpteratorSet(OAContext oaContext, SelRule selRule, Set<Long> opteratorSet, DataTable businessDt,
			DataTable operatorDt, Long oid) throws Throwable {
		DefaultContext context = oaContext.getContext();
		Document document = context.getDocument();
		MetaTable metaTable = document.getMetaDataObject().getMainTable();
		DataTable dataTable = document.get(metaTable.getKey());

		Long empID = dataTable.getLong("ApplicantID");
		if (empID <= 0) {
			return opteratorSet;
		}

		long deptID = 0L;
		long id = 0L;
		DataTable dt = null;

		String operatorQuery = "select oid from SYS_Operator where EmpID=?";
		dt = context.getDBManager().execPrepareQuery(operatorQuery, empID);
		if (dt.size() == 0) {
			return opteratorSet;
		}

		id = dt.getLong(0, 0);
		String sql = "select DeptID from OA_Employee_H where oid=(select EmpID from SYS_Operator where oid=?)";

		int count = 1;
		for (int i = 0; i < count; ++i) {
			dt = context.getDBManager().execPrepareQuery(sql, id);
			if (dt.size() > 0) {
				deptID = dt.getLong("DeptID");
			}

			id = TSL_DepartmentHeadTools.getDeptHead(context, deptID, selRule, businessDt, id);
			if (id <= 0) {
				break;
			}
		}

		if (id > 0) {
			opteratorSet.add(id);
		}

		return opteratorSet;
	}
}
