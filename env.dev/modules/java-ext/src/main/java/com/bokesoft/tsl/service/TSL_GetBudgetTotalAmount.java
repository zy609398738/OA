package com.bokesoft.tsl.service;

import java.math.BigDecimal;
import java.util.Map;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.bokesoft.tsl.common.TSL_BokeDeeFactory;
import com.bokesoft.yigo.common.util.TypeConvertor;
import com.bokesoft.yigo.mid.base.DefaultContext;
import com.bokesoft.yigo.mid.service.IExtService2;

public class TSL_GetBudgetTotalAmount implements IExtService2 {

	private static String ACTION = "ERP_BudgetTotalAmount_TO_BPM";

	@Override
	public Object doCmd(DefaultContext context, Map<String, Object> args) throws Throwable {
		String budget_num = (String) args.get("budget_num");
		String budget_name = (String) args.get("budget_name");
		String budget_year = (String) args.get("budget_year");
		String budget_version = (String) args.get("budget_version");
		String budget_amount_type = (String) args.get("budget_amount_type");
		int budget_monthto = TypeConvertor.toInteger(args.get("budget_month"));
		String org_id = (String) args.get("org_id");
		String budget_type = "B";
		String primary_flag = "Y";
		int budget_monthfrom = 0;
		if (budget_amount_type.equalsIgnoreCase("Y")) {
			budget_monthfrom = 1;
		} else if (budget_amount_type.equalsIgnoreCase("其他")) {
			budget_monthfrom = budget_monthto;
		} else if (budget_amount_type.equalsIgnoreCase("Q")) {
			if (budget_monthto == 1 || budget_monthto == 2 || budget_monthto == 3) {
				budget_monthfrom = 1;
			} else if (budget_monthto == 4 || budget_monthto == 5 || budget_monthto == 6) {
				budget_monthfrom = 4;
			} else if (budget_monthto == 7 || budget_monthto == 8 || budget_monthto == 9) {
				budget_monthfrom = 7;
			} else if (budget_monthto == 10 || budget_monthto == 11 || budget_monthto == 12) {
				budget_monthfrom = 10;
			}
		}

		TSL_BokeDeeFactory factory = new TSL_BokeDeeFactory();
		JSONArray ja = new JSONArray();
		JSONObject jo = factory.createCondition("a.budget_num", "=", budget_num);
		ja.add(jo);

		jo = factory.createCondition("budget_name", "=", budget_name);
		ja.add(jo);

		jo = factory.createCondition("b.budget_year", "=", budget_year);
		ja.add(jo);

		jo = factory.createCondition("a.budget_version", "=", budget_version);
		ja.add(jo);

		jo = factory.createCondition("b.budget_type", "=", budget_type);
		ja.add(jo);

		jo = factory.createCondition("primary_flag", "=", primary_flag);
		ja.add(jo);

		jo = factory.createCondition("b.budget_month", ">=", budget_monthfrom);
		ja.add(jo);

		jo = factory.createCondition("b.budget_month", "<=", budget_monthto);
		ja.add(jo);

		jo = factory.createCondition("a.org_id", "=", org_id);
		ja.add(jo);

		factory.addParameter("json", ja.toString());

		BigDecimal budgettotalamount = BigDecimal.ZERO;
		String stringJson = factory.executeAction(ACTION);
		JSONObject reJSONObject = JSONObject.parseObject(stringJson);
		Object data = reJSONObject.get("data");
		if (data instanceof JSONArray) {
			JSONArray reJSONArray = (JSONArray) data;
			for (int i = 0; i < reJSONArray.size(); ++i) {
				JSONObject jsonObject = (JSONObject) reJSONArray.get(i);
				budgettotalamount = TypeConvertor.toBigDecimal(jsonObject.get("totalamount"));
				budgettotalamount = budgettotalamount.setScale(4, BigDecimal.ROUND_HALF_UP);
			}
		}

		return budgettotalamount;
	}
}
