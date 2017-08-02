package com.bokesoft.tsl.service;

import java.util.ArrayList;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.bokesoft.tsl.common.TSL_BokeDeeFactory;
import com.bokesoft.yigo.common.def.DataType;
import com.bokesoft.yigo.mid.base.DefaultContext;
import com.bokesoft.yigo.mid.service.IExtService;
import com.bokesoft.yigo.struct.datatable.ColumnInfo;
import com.bokesoft.yigo.struct.datatable.DataTable;

public class TSL_GetRegionData implements IExtService {
	private static String ACTION = "ERP_AREA_TO_BPM";

	@Override
	public Object doCmd(DefaultContext context, ArrayList<Object> args) throws Throwable {
		TSL_BokeDeeFactory factory = new TSL_BokeDeeFactory();

		String stringJson = factory.executeAction(ACTION);

		DataTable dt = new DataTable();
		dt.addColumn(new ColumnInfo("Value", DataType.STRING));
		dt.addColumn(new ColumnInfo("Name", DataType.STRING));
		JSONObject reJSONObject = JSONObject.parseObject(stringJson);
		
		Object data = reJSONObject.get("data");
		if (data instanceof JSONArray) {
			JSONArray reJSONArray = (JSONArray) data;
			for (int i = 0; i < reJSONArray.size(); ++i) {
				JSONObject jsonObject = (JSONObject) reJSONArray.get(i);
				String region = jsonObject.get("region").toString();
				dt.append();
				dt.setObject("Value", region);
				dt.setObject("Name", region);
			}
		}
		return dt;
	}
}
