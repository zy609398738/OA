package com.bokesoft.tsl.service;

import java.math.BigDecimal;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Map;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.bokesoft.oa.util.OAStrUtil;
import com.bokesoft.tsl.common.TSL_BokeDeeFactory;
import com.bokesoft.yigo.common.def.DataType;
import com.bokesoft.yigo.common.util.TypeConvertor;
import com.bokesoft.yigo.mid.base.DefaultContext;
import com.bokesoft.yigo.mid.service.IExtService2;
import com.bokesoft.yigo.struct.datatable.ColumnInfo;
import com.bokesoft.yigo.struct.datatable.DataTable;

public class TSL_GetTrinaAssignment implements IExtService2 {

	private static String ACTION = "AD_Trina_Assignment_To_BPM";

	@Override
	public Object doCmd(DefaultContext context, Map<String, Object> args) throws Throwable {
		String billkey = TypeConvertor.toString(args.get("billkey"));
		String flow = TypeConvertor.toString(args.get("flow"));
		String node = TypeConvertor.toString(args.get("node"));
		String oid = TypeConvertor.toString(args.get("oid"));
		String applicantcode = TypeConvertor.toString(args.get("ApplicantCode"));		
		Date date = new Date();
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
		String applicant_date_from = sdf.format(date);
		String applicant_date_to = sdf.format(date);

		TSL_BokeDeeFactory factory = new TSL_BokeDeeFactory();
		JSONArray ja = new JSONArray();
		JSONObject jo = factory.createCondition("a.EmployeeID", "=", applicantcode);
		ja.add(jo);

		jo = factory.createCondition("a.DepartureDate", "<=", applicant_date_to);
		ja.add(jo);

		jo = factory.createCondition("dateadd(DAY,360,a.ReturnDate)", ">=", applicant_date_from);
		ja.add(jo);

		if (!flow.isEmpty() && !flow.equalsIgnoreCase("null")) {
			factory.addParameter("flow", flow);
		}
		if (!node.isEmpty() && !node.equalsIgnoreCase("null")) {
			factory.addParameter("node", node);
		}
		if (!billkey.isEmpty() && !billkey.equalsIgnoreCase("null")) {
			factory.addParameter("billkey", billkey);
		}
		if (!oid.isEmpty() && !oid.equalsIgnoreCase("null")) {
			factory.addParameter("oid", oid);
		}
		factory.addParameter("json", ja.toString());
		
		String stringJson = factory.executeAction(ACTION);
		
		JSONObject reJSONObject = JSONObject.parseObject(stringJson);
		Object data = reJSONObject.get("data");
		JSONObject jsonObject = new JSONObject();
		
		DataTable dt = new DataTable();
		if(((JSONArray) data).isEmpty()) {
			return dt;
		}
		
				
		if (data instanceof JSONArray) {
			JSONArray reJSONArray = (JSONArray) data;
										
			for (int i = 0; i < reJSONArray.size(); ++i) {
				jsonObject = (JSONObject) reJSONArray.get(i);
				
				// // 创建数据表列
				dt.addColumn(new ColumnInfo("AssignStartDate", DataType.STRING));
				dt.addColumn(new ColumnInfo("AssignEndDate", DataType.STRING));
				dt.addColumn(new ColumnInfo("country", DataType.STRING));
				dt.addColumn(new ColumnInfo("city", DataType.STRING));
				// // 插入新行
				dt.append();
				// // 赋值
				dt.setObject("AssignStartDate", jsonObject.get("assignstartdate").toString());
				dt.setObject("AssignEndDate", jsonObject.get("assignenddate").toString());
				dt.setObject("country", jsonObject.get("country").toString());
				dt.setObject("city", jsonObject.get("city").toString());
			
			}
				
		}
			
			return dt;
		
	}

}
