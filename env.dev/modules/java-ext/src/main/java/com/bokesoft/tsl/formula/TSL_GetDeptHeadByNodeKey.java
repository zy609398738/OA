package com.bokesoft.tsl.formula;

import java.util.ArrayList;
import java.util.Set;

import com.bokesoft.oa.base.OAContext;
import com.bokesoft.oa.mid.wf.base.ISelRule;
import com.bokesoft.oa.mid.wf.base.SelRule;
import com.bokesoft.oa.mid.wf.base.SelRuleParameterMap;
import com.bokesoft.yigo.common.util.TypeConvertor;
import com.bokesoft.yigo.mid.base.DefaultContext;
import com.bokesoft.yigo.mid.connection.IDBManager;
import com.bokesoft.yigo.struct.datatable.DataTable;

public class TSL_GetDeptHeadByNodeKey implements ISelRule {
	String OPERATOR_QUERY = "select operatorID from wf_workitem w join bpm_workiteminfo b on w.workitemid=b.workitemid where b.instanceid=? and b.nodeid=? and w.srcoperatorid=-1";
	String INSTANCEID_QUERY = "select instanceid from bpm_instance where oid = ?";

	@Override
	public Set<Long> getOpteratorSet(OAContext oaContext, SelRule selRule, Set<Long> opteratorSet, DataTable businessDt,
			DataTable operatorDt, Long oid) throws Throwable {
		DefaultContext context = oaContext.getContext();
		IDBManager dbManager = context.getDBManager();
		
		SelRuleParameterMap map = selRule.getSelRuleParameterMap();
		String nodeKey = TypeConvertor.toString(map.getValue("NodeKey"));
		String formula = "GetFirstExecutorByKey('"+nodeKey+"')";
		
		DataTable dt = null;
		long deptID = 0L;
		long id = TypeConvertor.toLong(context.getMidParser().eval(0, formula));
		if (id <= 0) {
			return opteratorSet;
		}
		
		ArrayList<Long> ignoreOperators = new ArrayList<Long>();
		String ignoreNodeKey = TypeConvertor.toString(map.getValue("IgnoreNodeKey"));
		if (!ignoreNodeKey.isEmpty()) {
			String[] ignoreNodeKeys = ignoreNodeKey.split(",");
			for (String iNodeKey : ignoreNodeKeys) {
				formula = "GetFirstExecutorByKey('"+iNodeKey+"')";
				ignoreOperators.add(TypeConvertor.toLong(context.getMidParser().eval(0, formula)));
			}
		}
		
		String sql = "select DeptID from OA_Employee_H where oid=(select EmpID from SYS_Operator where oid=?)";
		int count = 1;
		for (int i = 0; i < count; ++i) {
			dt = dbManager.execPrepareQuery(sql, id);
			if (dt.size() > 0) {
				deptID = dt.getLong("DeptID");
			}

			id = TSL_DepartmentHeadTools.getDeptHead(oaContext.getContext(), deptID, selRule, businessDt, id, ignoreOperators);
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
