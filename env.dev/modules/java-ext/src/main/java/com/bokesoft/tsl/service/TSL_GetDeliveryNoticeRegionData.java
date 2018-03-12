package com.bokesoft.tsl.service;

import java.util.Map;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.bokesoft.tsl.common.TSL_BokeDeeFactory;
import com.bokesoft.yigo.common.def.DataType;
import com.bokesoft.yigo.common.util.TypeConvertor;
import com.bokesoft.yigo.mid.base.DefaultContext;
import com.bokesoft.yigo.mid.service.IExtService2;
import com.bokesoft.yigo.struct.datatable.ColumnInfo;
import com.bokesoft.yigo.struct.datatable.DataTable;

public class TSL_GetDeliveryNoticeRegionData implements IExtService2 {
	private static String ACTION = "ERP_Region_TO_BPM";

	@Override
	public Object doCmd(DefaultContext context, Map<String, Object> args) throws Throwable {
		String billkey = TypeConvertor.toString(args.get("billkey"));
		String flow = TypeConvertor.toString(args.get("flow"));
		String node = TypeConvertor.toString(args.get("node"));
		String oid = TypeConvertor.toString(args.get("oid"));
		TSL_BokeDeeFactory factory = new TSL_BokeDeeFactory();
		JSONArray ja = new JSONArray();
		JSONObject jo = factory.getRowNumberCondition();
		ja.add(jo);
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
		factory.addParameter("json", ja.toString());
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
