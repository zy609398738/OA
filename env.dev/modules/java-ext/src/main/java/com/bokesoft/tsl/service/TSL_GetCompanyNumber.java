package com.bokesoft.tsl.service;

import java.util.Map;
import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.bokesoft.tsl.common.TSL_BokeDeeFactory;
import com.bokesoft.yigo.mid.base.DefaultContext;
import com.bokesoft.yigo.mid.service.IExtService2;

public class TSL_GetCompanyNumber implements IExtService2 {

	private static String ACTION = "ERP_Company_Number_TO_BPM";

	@Override
	public Object doCmd(DefaultContext context, Map<String, Object> args) throws Throwable {		
		String org_id = (String) args.get("Organization_id");
		TSL_BokeDeeFactory factory = new TSL_BokeDeeFactory();
		JSONArray ja = new JSONArray();
		JSONObject jo = factory.createCondition("organization_id", " = ", org_id);
		ja.add(jo);
		factory.addParameter("json", ja.toString());
		
		String companycode = null;
		String stringJson = factory.executeAction(ACTION);
		JSONObject reJSONObject = JSONObject.parseObject(stringJson);
		Object data = reJSONObject.get("data");
		if (data instanceof JSONArray) {
			JSONArray reJSONArray = (JSONArray) data;
			for (int i = 0; i < reJSONArray.size(); ++i) {
				JSONObject jsonObject = (JSONObject) reJSONArray.get(i);
				companycode = jsonObject.get("flex_value").toString();
			}
		}
		
		return companycode;
	}
}
