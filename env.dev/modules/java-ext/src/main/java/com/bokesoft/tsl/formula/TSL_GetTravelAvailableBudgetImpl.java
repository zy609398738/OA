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

public class TSL_GetTravelAvailableBudgetImpl extends BaseMidFunctionImpl {

	private String ACTION = "ERP_GetAvailableBudget_TO_BPM";

	@Override
	public Object evalImpl(String name, DefaultContext context, Object[] args, IExecutor arg3) throws Throwable {
		String billkey = TypeConvertor.toString(args[0]);
		String flow = TypeConvertor.toString(args[1]);
		String node = TypeConvertor.toString(args[2]);
		String oid = TypeConvertor.toString(args[3]);
		Document document = context.getDocument();
		DataTable headTable = document.get("B_TravelExpenseApply");
		// 费用承担组织编号
		String BudgetOuCode = TypeConvertor.toString(headTable.getString("OU_CODE"));
		// 预算年
		String BudgetYear = TypeConvertor.toString(headTable.getString("BUD_Y"));
		// 预算月
		String BudgetMonth = TypeConvertor.toString(headTable.getString("BUD_M"));
		// 差旅费预算号
		String TRIP_BudgetNo = TypeConvertor.toString(headTable.getString("TRIP_BUDGET_NO"));
		// 差旅费预算币种
		String TRIP_BudgetCurrency = TypeConvertor.toString(headTable.getString("TRIP_BUDGET_CURRENCY"));
		// 招待费预算号
		String GUEST_BudgetNo = TypeConvertor.toString(headTable.getString("GUEST_BUDGET_NO"));
		// 招待费预算币种
		String GUEST_BudgetCurrency = TypeConvertor.toString(headTable.getString("GUEST_BUDGET_CURRENCY"));
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
		// 预算承担组织编号
		paramenter.put("p_org_id", BudgetOuCode);
		// 预算年
		paramenter.put("p_budget_year", BudgetYear);
		// 预算月
		paramenter.put("p_budget_month", BudgetMonth);
		if (!TRIP_BudgetNo.isEmpty() && TRIP_BudgetNo != null) {
			// 预算号
			paramenter.put("p_budget_num", TRIP_BudgetNo);
			// 预算币种
			paramenter.put("p_currency_code", TRIP_BudgetCurrency);
			// 执行BokeDee接口
			String stringJson = factory.executeAction(ACTION);
			// 获取返回值，并转换为JSONObject
			JSONObject reJSONObject = JSONObject.parseObject(stringJson);
			BigDecimal p_e_amount = new BigDecimal(reJSONObject.get("p_e_amount").toString());
			headTable.setObject("TRIP_BUDGET_Balance", p_e_amount);
		}
		if (!GUEST_BudgetNo.isEmpty() && GUEST_BudgetNo != null) {
			// 预算号
			paramenter.put("p_budget_num", GUEST_BudgetNo);
			// 预算币种
			paramenter.put("p_currency_code", GUEST_BudgetCurrency);
			// 执行BokeDee接口
			String stringJson = factory.executeAction(ACTION);
			// 获取返回值，并转换为JSONObject
			JSONObject reJSONObject = JSONObject.parseObject(stringJson);
			BigDecimal p_e_amount = new BigDecimal(reJSONObject.get("p_e_amount").toString());
			headTable.setObject("GUEST_BUDGET_Balance", p_e_amount);
		}
		return true;
	}
}