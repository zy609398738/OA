package com.bokesoft.tsl.service;

import java.math.BigDecimal;
import java.util.Map;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.bokesoft.tsl.common.TSL_BokeDeeFactory;
import com.bokesoft.yigo.common.util.TypeConvertor;
import com.bokesoft.yigo.mid.base.DefaultContext;
import com.bokesoft.yigo.mid.service.IExtService2;

public class TSL_GetBudgetUsedAmount implements IExtService2 {

	private static String ACTION = "ERP_BudgetUsedAmount_TO_BPM";

	@Override
	public Object doCmd(DefaultContext context, Map<String, Object> args) throws Throwable {
		String budget_num = (String) args.get("budget_num");
		String budget_year = (String) args.get("budget_year");
		String budget_version = (String) args.get("budget_version");
		String budget_amount_type = (String) args.get("budget_amount_type");
		int budget_month = TypeConvertor.toInteger(args.get("budget_month"));
		String org_id = (String) args.get("org_id");
		String primary_flag = "Y";
		TSL_BokeDeeFactory factory = new TSL_BokeDeeFactory();
		JSONArray ja = new JSONArray();
		JSONObject jo = factory.createCondition("budget_num", "=", budget_num);
		ja.add(jo);

		jo = factory.createCondition("budget_year", "=", budget_year);
		ja.add(jo);

		jo = factory.createCondition("budget_version", "=", budget_version);
		ja.add(jo);

		jo = factory.createCondition("primary_flag", "=", primary_flag);
		ja.add(jo);

		jo = factory.createCondition("org_id", "=", org_id);
		ja.add(jo);

		factory.addParameter("json", ja.toString());

		BigDecimal budgetusedamount = BigDecimal.ZERO;
		String stringJson = factory.executeAction(ACTION);
		JSONObject reJSONObject = JSONObject.parseObject(stringJson);
		Object data = reJSONObject.get("data");
		if (data instanceof JSONArray) {
			JSONArray reJSONArray = (JSONArray) data;
			for (int i = 0; i < reJSONArray.size(); ++i) {
				JSONObject jsonObject = (JSONObject) reJSONArray.get(i);
				if (budget_amount_type.equalsIgnoreCase("Y")) {

					switch (budget_month) {
					case 1:
						budgetusedamount = TypeConvertor.toBigDecimal(jsonObject.get("actual_amt_1"));
						break;
					case 2:
						budgetusedamount = TypeConvertor.toBigDecimal(jsonObject.get("actual_amt_1"))
								.add(TypeConvertor.toBigDecimal(jsonObject.get("actual_amt_2")));
						break;
					case 3:
						budgetusedamount = TypeConvertor.toBigDecimal(jsonObject.get("actual_amt_1"))
								.add(TypeConvertor.toBigDecimal(jsonObject.get("actual_amt_2")))
								.add(TypeConvertor.toBigDecimal(jsonObject.get("actual_amt_3")));
						break;
					case 4:
						budgetusedamount = TypeConvertor.toBigDecimal(jsonObject.get("actual_amt_1"))
								.add(TypeConvertor.toBigDecimal(jsonObject.get("actual_amt_2")))
								.add(TypeConvertor.toBigDecimal(jsonObject.get("actual_amt_3")))
								.add(TypeConvertor.toBigDecimal(jsonObject.get("actual_amt_4")));
						break;
					case 5:
						budgetusedamount = TypeConvertor.toBigDecimal(jsonObject.get("actual_amt_1"))
								.add(TypeConvertor.toBigDecimal(jsonObject.get("actual_amt_2")))
								.add(TypeConvertor.toBigDecimal(jsonObject.get("actual_amt_3")))
								.add(TypeConvertor.toBigDecimal(jsonObject.get("actual_amt_4")))
								.add(TypeConvertor.toBigDecimal(jsonObject.get("actual_amt_5")));
						break;
					case 6:
						budgetusedamount = TypeConvertor.toBigDecimal(jsonObject.get("actual_amt_1"))
								.add(TypeConvertor.toBigDecimal(jsonObject.get("actual_amt_2")))
								.add(TypeConvertor.toBigDecimal(jsonObject.get("actual_amt_3")))
								.add(TypeConvertor.toBigDecimal(jsonObject.get("actual_amt_4")))
								.add(TypeConvertor.toBigDecimal(jsonObject.get("actual_amt_5")))
								.add(TypeConvertor.toBigDecimal(jsonObject.get("entered_amt_6")));
						break;
					case 7:
						budgetusedamount = TypeConvertor.toBigDecimal(jsonObject.get("actual_amt_1"))
								.add(TypeConvertor.toBigDecimal(jsonObject.get("actual_amt_2")))
								.add(TypeConvertor.toBigDecimal(jsonObject.get("actual_amt_3")))
								.add(TypeConvertor.toBigDecimal(jsonObject.get("actual_amt_4")))
								.add(TypeConvertor.toBigDecimal(jsonObject.get("actual_amt_5")))
								.add(TypeConvertor.toBigDecimal(jsonObject.get("actual_amt_6")))
								.add(TypeConvertor.toBigDecimal(jsonObject.get("actual_amt_7")));
						break;
					case 8:
						budgetusedamount = TypeConvertor.toBigDecimal(jsonObject.get("actual_amt_1"))
								.add(TypeConvertor.toBigDecimal(jsonObject.get("actual_amt_2")))
								.add(TypeConvertor.toBigDecimal(jsonObject.get("actual_amt_3")))
								.add(TypeConvertor.toBigDecimal(jsonObject.get("actual_amt_4")))
								.add(TypeConvertor.toBigDecimal(jsonObject.get("actual_amt_5")))
								.add(TypeConvertor.toBigDecimal(jsonObject.get("actual_amt_6")))
								.add(TypeConvertor.toBigDecimal(jsonObject.get("actual_amt_7")))
								.add(TypeConvertor.toBigDecimal(jsonObject.get("actual_amt_8")));
						break;
					case 9:
						budgetusedamount = TypeConvertor.toBigDecimal(jsonObject.get("actual_amt_1"))
								.add(TypeConvertor.toBigDecimal(jsonObject.get("actual_amt_2")))
								.add(TypeConvertor.toBigDecimal(jsonObject.get("actual_amt_3")))
								.add(TypeConvertor.toBigDecimal(jsonObject.get("actual_amt_4")))
								.add(TypeConvertor.toBigDecimal(jsonObject.get("actual_amt_5")))
								.add(TypeConvertor.toBigDecimal(jsonObject.get("actual_amt_6")))
								.add(TypeConvertor.toBigDecimal(jsonObject.get("actual_amt_7")))
								.add(TypeConvertor.toBigDecimal(jsonObject.get("actual_amt_8")))
								.add(TypeConvertor.toBigDecimal(jsonObject.get("actual_amt_9")));
						break;
					case 10:
						budgetusedamount = TypeConvertor.toBigDecimal(jsonObject.get("actual_amt_1"))
								.add(TypeConvertor.toBigDecimal(jsonObject.get("actual_amt_2")))
								.add(TypeConvertor.toBigDecimal(jsonObject.get("actual_amt_3")))
								.add(TypeConvertor.toBigDecimal(jsonObject.get("actual_amt_4")))
								.add(TypeConvertor.toBigDecimal(jsonObject.get("actual_amt_5")))
								.add(TypeConvertor.toBigDecimal(jsonObject.get("actual_amt_6")))
								.add(TypeConvertor.toBigDecimal(jsonObject.get("actual_amt_7")))
								.add(TypeConvertor.toBigDecimal(jsonObject.get("actual_amt_8")))
								.add(TypeConvertor.toBigDecimal(jsonObject.get("actual_amt_9")))
								.add(TypeConvertor.toBigDecimal(jsonObject.get("actual_amt_10")));
						break;
					case 11:
						budgetusedamount = TypeConvertor.toBigDecimal(jsonObject.get("actual_amt_1"))
								.add(TypeConvertor.toBigDecimal(jsonObject.get("actual_amt_2")))
								.add(TypeConvertor.toBigDecimal(jsonObject.get("actual_amt_3")))
								.add(TypeConvertor.toBigDecimal(jsonObject.get("actual_amt_4")))
								.add(TypeConvertor.toBigDecimal(jsonObject.get("actual_amt_5")))
								.add(TypeConvertor.toBigDecimal(jsonObject.get("actual_amt_6")))
								.add(TypeConvertor.toBigDecimal(jsonObject.get("actual_amt_7")))
								.add(TypeConvertor.toBigDecimal(jsonObject.get("actual_amt_8")))
								.add(TypeConvertor.toBigDecimal(jsonObject.get("actual_amt_9")))
								.add(TypeConvertor.toBigDecimal(jsonObject.get("actual_amt_10")))
								.add(TypeConvertor.toBigDecimal(jsonObject.get("actual_amt_11")));
						break;
					case 12:
						budgetusedamount = TypeConvertor.toBigDecimal(jsonObject.get("actual_amt_1"))
								.add(TypeConvertor.toBigDecimal(jsonObject.get("actual_amt_2")))
								.add(TypeConvertor.toBigDecimal(jsonObject.get("actual_amt_3")))
								.add(TypeConvertor.toBigDecimal(jsonObject.get("actual_amt_4")))
								.add(TypeConvertor.toBigDecimal(jsonObject.get("actual_amt_5")))
								.add(TypeConvertor.toBigDecimal(jsonObject.get("entered_amt_6")))
								.add(TypeConvertor.toBigDecimal(jsonObject.get("entered_amt_7")))
								.add(TypeConvertor.toBigDecimal(jsonObject.get("entered_amt_8")))
								.add(TypeConvertor.toBigDecimal(jsonObject.get("entered_amt_9")))
								.add(TypeConvertor.toBigDecimal(jsonObject.get("entered_amt_10")))
								.add(TypeConvertor.toBigDecimal(jsonObject.get("entered_amt_11")))
								.add(TypeConvertor.toBigDecimal(jsonObject.get("entered_amt_12")));
						break;
					}
				} else if (budget_amount_type.equalsIgnoreCase("Q")) {
					switch (budget_month) {
					case 1:
						budgetusedamount = TypeConvertor.toBigDecimal(jsonObject.get("actual_amt_1"));
						break;
					case 2:
						budgetusedamount = TypeConvertor.toBigDecimal(jsonObject.get("actual_amt_1"))
								.add(TypeConvertor.toBigDecimal(jsonObject.get("actual_amt_2")));
						break;
					case 3:
						budgetusedamount = TypeConvertor.toBigDecimal(jsonObject.get("actual_amt_1"))
								.add(TypeConvertor.toBigDecimal(jsonObject.get("actual_amt_2")))
								.add(TypeConvertor.toBigDecimal(jsonObject.get("actual_amt_3")));
						break;
					case 4:
						budgetusedamount = TypeConvertor.toBigDecimal(jsonObject.get("actual_amt_4"));
						break;
					case 5:
						budgetusedamount = TypeConvertor.toBigDecimal(jsonObject.get("actual_amt_4"))
								.add(TypeConvertor.toBigDecimal(jsonObject.get("actual_amt_5")));
						break;
					case 6:
						budgetusedamount = TypeConvertor.toBigDecimal(jsonObject.get("actual_amt_4"))
								.add(TypeConvertor.toBigDecimal(jsonObject.get("actual_amt_5")))
								.add(TypeConvertor.toBigDecimal(jsonObject.get("actual_amt_6")));
						break;
					case 7:
						budgetusedamount = TypeConvertor.toBigDecimal(jsonObject.get("actual_amt_7"));
						break;
					case 8:
						budgetusedamount = TypeConvertor.toBigDecimal(jsonObject.get("actual_amt_7"))
								.add(TypeConvertor.toBigDecimal(jsonObject.get("actual_amt_8")));
						break;
					case 9:
						budgetusedamount = TypeConvertor.toBigDecimal(jsonObject.get("actual_amt_7"))
								.add(TypeConvertor.toBigDecimal(jsonObject.get("actual_amt_8")))
								.add(TypeConvertor.toBigDecimal(jsonObject.get("actual_amt_9")));
						break;
					case 10:
						budgetusedamount = TypeConvertor.toBigDecimal(jsonObject.get("actual_amt_10"));
						break;
					case 11:
						budgetusedamount = TypeConvertor.toBigDecimal(jsonObject.get("actual_amt_10"))
								.add(TypeConvertor.toBigDecimal(jsonObject.get("actual_amt_11")));
						break;
					case 12:
						budgetusedamount = TypeConvertor.toBigDecimal(jsonObject.get("actual_amt_10"))
								.add(TypeConvertor.toBigDecimal(jsonObject.get("actual_amt_11")))
								.add(TypeConvertor.toBigDecimal(jsonObject.get("actual_amt_12")));
						break;
					}
				} else if (budget_amount_type.equalsIgnoreCase("其他")) {
					switch (budget_month) {
					case 1:
						budgetusedamount = TypeConvertor.toBigDecimal(jsonObject.get("actual_amt_1"));
						break;
					case 2:
						budgetusedamount = TypeConvertor.toBigDecimal(jsonObject.get("actual_amt_2"));
						break;
					case 3:
						budgetusedamount = TypeConvertor.toBigDecimal(jsonObject.get("actual_amt_3"));
						break;
					case 4:
						budgetusedamount = TypeConvertor.toBigDecimal(jsonObject.get("actual_amt_4"));
						break;
					case 5:
						budgetusedamount = TypeConvertor.toBigDecimal(jsonObject.get("actual_amt_5"));
						break;
					case 6:
						budgetusedamount = TypeConvertor.toBigDecimal(jsonObject.get("actual_amt_6"));
						break;
					case 7:
						budgetusedamount = TypeConvertor.toBigDecimal(jsonObject.get("actual_amt_7"));
						break;
					case 8:
						budgetusedamount = TypeConvertor.toBigDecimal(jsonObject.get("actual_amt_8"));
						break;
					case 9:
						budgetusedamount = TypeConvertor.toBigDecimal(jsonObject.get("actual_amt_9"));
						break;
					case 10:
						budgetusedamount = TypeConvertor.toBigDecimal(jsonObject.get("actual_amt_10"));
						break;
					case 11:
						budgetusedamount = TypeConvertor.toBigDecimal(jsonObject.get("actual_amt_11"));
						break;
					case 12:
						budgetusedamount = TypeConvertor.toBigDecimal(jsonObject.get("actual_amt_12"));
						break;
					}
				}
				budgetusedamount = budgetusedamount.setScale(4, BigDecimal.ROUND_HALF_UP);
			}
		}

		return budgetusedamount;
	}
}
