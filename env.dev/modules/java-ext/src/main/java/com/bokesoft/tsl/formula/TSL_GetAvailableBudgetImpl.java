package com.bokesoft.tsl.formula;

import java.math.BigDecimal;
import java.util.HashMap;

import com.alibaba.fastjson.JSONObject;
import com.bokesoft.tsl.common.TSL_BokeDeeFactory;
import com.bokesoft.yigo.common.util.TypeConvertor;
import com.bokesoft.yigo.mid.base.DefaultContext;
import com.bokesoft.yigo.mid.parser.BaseMidFunctionImpl;
import com.bokesoft.yigo.parser.IExecutor;
import com.bokesoft.yigo.struct.datatable.DataTable;
import com.bokesoft.yigo.struct.document.Document;

public class TSL_GetAvailableBudgetImpl extends BaseMidFunctionImpl {

	private String ACTION = "ERP_GetAvailableBudget_TO_BPM";

	@Override
	public Object evalImpl(String name, DefaultContext context, Object[] args, IExecutor arg3) throws Throwable {
		String billkey = TypeConvertor.toString(args[0]);
		String flow = TypeConvertor.toString(args[1]);
		String node = TypeConvertor.toString(args[2]);
		String oid = TypeConvertor.toString(args[3]);
		Document document = context.getDocument();
		DataTable headTable = document.get("B_CostApply");
		DataTable detailTable = document.get("B_CostApplyDtl");
		String BudgetOuCode = TypeConvertor.toString(headTable.getString("OU_CODE"));
		String BudgetNo = "";
		String BudgetYear = "";
		String BudgetMonth = "";
		String BudgetCurrency = "";
		int rowCount = detailTable.size();
		for (int index = 0; index < rowCount; index++) {
			BudgetNo = TypeConvertor.toString(detailTable.getString(index, "CAD_BudgetNo"));
			BudgetYear = TypeConvertor.toString(detailTable.getString(index, "CAD_BudgetYear"));
			BudgetMonth = TypeConvertor.toString(detailTable.getString(index, "CAD_BudgetMonth"));
			BudgetCurrency = TypeConvertor.toString(detailTable.getString(index, "CurrencyDetail1"));
			TSL_BokeDeeFactory factory = new TSL_BokeDeeFactory();
			if (!flow.isEmpty() && flow != null) {
				factory.addParameter("flow", flow);
			}
			if (!node.isEmpty() && node != null) {
				factory.addParameter("node", node);
			}
			if (!billkey.isEmpty() && billkey != null) {
				factory.addParameter("billkey", billkey);
			}
			if (!oid.isEmpty() && oid != null) {
				factory.addParameter("oid", oid);
			}
			HashMap<String, String> paramenter = factory.getParameter();
			// 预算币种
			paramenter.put("p_currency_code", BudgetCurrency);
			// 预算年
			paramenter.put("p_budget_year", BudgetYear);
			// 预算月
			paramenter.put("p_budget_month", BudgetMonth);
			// 预算号
			paramenter.put("p_budget_num", BudgetNo);
			// 预算承担组织编号
			paramenter.put("p_org_id", BudgetOuCode);

			// 执行BokeDee接口
			String stringJson = factory.executeAction(ACTION);
			// 获取返回值，并转换为JSONObject
			JSONObject reJSONObject = JSONObject.parseObject(stringJson);
			BigDecimal p_e_amount = new BigDecimal(reJSONObject.get("p_e_amount").toString());
			detailTable.setObject(index, "AvailableQuota", p_e_amount);
		}
		return true;
	}
}