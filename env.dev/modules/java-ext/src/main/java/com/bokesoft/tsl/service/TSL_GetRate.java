package com.bokesoft.tsl.service;

import java.math.BigDecimal;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Map;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.bokesoft.tsl.common.TSL_BokeDeeFactory;
import com.bokesoft.yigo.common.util.TypeConvertor;
import com.bokesoft.yigo.mid.base.DefaultContext;
import com.bokesoft.yigo.mid.service.IExtService2;

public class TSL_GetRate implements IExtService2 {

	private static String ACTION = "ERP_Exchange_Rates_TO_BPM";

	@Override
	public Object doCmd(DefaultContext context, Map<String, Object> args) throws Throwable {
		String currencyFrom = (String) args.get("currencyFrom");
		String currencyTo = (String) args.get("currencyTo");
		String RateTypes = (String) args.get("RateTypes");
		
		if (currencyFrom.equalsIgnoreCase(currencyTo)) {
			return 1;
		}

		Date date = TypeConvertor.toDate(args.get("date"));
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
		String strDate = sdf.format(date);
		
		TSL_BokeDeeFactory factory = new TSL_BokeDeeFactory();
		JSONArray ja = new JSONArray();
		JSONObject jo = factory.createCondition("conversion_date", "=", strDate);
		ja.add(jo);
		
		jo = factory.createCondition("from_currency", "=", currencyFrom);
		ja.add(jo);
		
		jo = factory.createCondition("to_currency", "=", currencyTo);
		ja.add(jo);
		jo = factory.createCondition("user_conversion_type", "=", RateTypes);
		ja.add(jo);
		factory.addParameter("json", ja.toString());
		
		BigDecimal rate = BigDecimal.ZERO;
		String stringJson = factory.executeAction(ACTION);
		JSONObject reJSONObject = JSONObject.parseObject(stringJson);
		Object data = reJSONObject.get("data");
		if (data instanceof JSONArray) {
			JSONArray reJSONArray = (JSONArray) data;
			for (int i = 0; i < reJSONArray.size(); ++i) {
				JSONObject jsonObject = (JSONObject) reJSONArray.get(i);
				rate = new BigDecimal(jsonObject.get("conversion_rate").toString());
				rate = rate.setScale(6, BigDecimal.ROUND_HALF_UP);
			}
		}
		
		return rate;
	}
}
