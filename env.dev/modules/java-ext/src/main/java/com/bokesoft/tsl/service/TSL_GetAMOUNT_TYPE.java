package com.bokesoft.tsl.service;

import java.util.Map;
import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.bokesoft.tsl.common.TSL_BokeDeeFactory;
import com.bokesoft.yigo.common.util.TypeConvertor;
import com.bokesoft.yigo.mid.base.DefaultContext;
import com.bokesoft.yigo.mid.service.IExtService2;

public class TSL_GetAMOUNT_TYPE implements IExtService2 {

	private static String ACTION = "ERP_AMOUNT_TYPE_TO_BPM";

	@Override
	public Object doCmd(DefaultContext context, Map<String, Object> args) throws Throwable {
		String budget_num = (String) args.get("budget_num");
		String budget_year = (String) args.get("budget_year");
		TSL_BokeDeeFactory factory = new TSL_BokeDeeFactory();
		JSONArray ja = new JSONArray();
		JSONObject jo = factory.createCondition("budget_num", " = ", budget_num);
		ja.add(jo);

		jo = factory.createCondition("budget_year", " = ", budget_year);
		ja.add(jo);

		factory.addParameter("json", ja.toString());
		String amount_type = "";
		String stringJson = factory.executeAction(ACTION);
		JSONObject reJSONObject = JSONObject.parseObject(stringJson);
		Object data = reJSONObject.get("data");
		if (data instanceof JSONArray) {
			JSONArray reJSONArray = (JSONArray) data;
			for (int i = 0; i < reJSONArray.size(); ++i) {
				JSONObject jsonObject = (JSONObject) reJSONArray.get(i);
				if (TypeConvertor.toString(jsonObject.get("amount_type")) == null) {
					amount_type = "";
				} else {
					amount_type = TypeConvertor.toString(jsonObject.get("amount_type"));
				}
			}
		}

		return amount_type;
	}
}
