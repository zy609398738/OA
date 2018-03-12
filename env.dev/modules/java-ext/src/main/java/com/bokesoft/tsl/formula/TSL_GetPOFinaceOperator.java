package com.bokesoft.tsl.formula;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Set;

import com.bokesoft.oa.base.OAContext;
import com.bokesoft.oa.mid.wf.base.ISelRule;
import com.bokesoft.oa.mid.wf.base.SelRule;
import com.bokesoft.oa.mid.wf.base.SelRuleParameterMap;
import com.bokesoft.yigo.common.util.TypeConvertor;
import com.bokesoft.yigo.mid.base.DefaultContext;
import com.bokesoft.yigo.mid.connection.IDBManager;
import com.bokesoft.yigo.struct.datatable.DataTable;
import com.bokesoft.yigo.struct.document.Document;

public class TSL_GetPOFinaceOperator implements ISelRule {
	private static String AuditConditionQuery = "select * from MT_AuditCondition where OU_CODE=? and COSTCENTER=?";
	private static String[] OperatorIDs = { "069829", "065390", "008690" };
	private static String[] BudgetFinance = { "BUDGET_CHECK_ACCOUNT", "FINANCE_ONE_LEVEL_ACCOUNT",
			"FINANCE_TWO_LEVEL_ACCOUNT" };
	private static String[] ContractFinance = { "MANAGE3_ACCOUNT", "MANAGE4_ACCOUNT", "FINANCE_TWO_LEVEL_ACCOUNT" };

	@Override
	public Set<Long> getOpteratorSet(OAContext oaContext, SelRule selRule, Set<Long> opteratorSet, DataTable businessDt,
			DataTable operatorDt, Long oid) throws Throwable {
		DefaultContext context = oaContext.getContext();
		IDBManager dbManager = context.getDBManager();
		SelRuleParameterMap map = selRule.getSelRuleParameterMap();
		int level = TypeConvertor.toInteger(map.getValue("level"));

		Document document = context.getDocument();
		DataTable headTable = document.get("B_PO");
		DataTable detailTable = document.get("B_PODtl");

		String OUID = headTable.getString("OU_CODE");

		DataTable dt = null;
		String costCenterN = null;
		String budgetClass = null;
		String adaccounts = null;
		detailTable.beforeFirst();
		while (detailTable.next()) {
			budgetClass = detailTable.getString("BUDGET_CLASS");
			costCenterN = detailTable.getString("CostCenterN");
			if (budgetClass.equalsIgnoreCase("CAPEX") || budgetClass.equalsIgnoreCase("PROJECT")) {
				opteratorSet.addAll(getOperatorIDByCode(dbManager, OperatorIDs[level]));
			} else {
				dt = dbManager.execPrepareQuery(AuditConditionQuery, OUID, costCenterN);
				if (dt.first()) {
					if (OUID.equals("1655")) {
						adaccounts = dt.getString(BudgetFinance[level]);
						opteratorSet.addAll(getOperatorIDByADAccount(dbManager, adaccounts));
					} else {
						adaccounts = dt.getString(ContractFinance[level]);
						opteratorSet.addAll(getOperatorIDByADAccount(dbManager, adaccounts));
					}
				}
			}
		}

		return opteratorSet;
	}

	private ArrayList<Long> getOperatorIDByADAccount(IDBManager dbManager, String adaccounts) throws Throwable {
		ArrayList<Long> list = new ArrayList<Long>();

		String[] ADAccounts = adaccounts.split(",");
		int count = ADAccounts.length;
		String sql = "select oid from sys_operator where empid in (select OID from OA_Employee_H where ADAccount in (";
		for (int i = 0; i < count; i++) {
			sql += "?,";
		}
		sql = sql.substring(0, sql.length() - 1) + "))";
		DataTable dt = dbManager.execPrepareQuery(sql, Arrays.asList(ADAccounts));
		dt.beforeFirst();
		while (dt.next()) {
			list.add(dt.getLong("oid"));
		}
		return list;
	}

	private ArrayList<Long> getOperatorIDByCode(IDBManager dbManager, String code) throws Throwable {
		ArrayList<Long> list = new ArrayList<Long>();
		String sql = "select oid from sys_operator where code=?";
		DataTable dt = dbManager.execPrepareQuery(sql, code);
		dt.beforeFirst();
		while (dt.next()) {
			list.add(dt.getLong("oid"));
		}
		return list;
	}
}
