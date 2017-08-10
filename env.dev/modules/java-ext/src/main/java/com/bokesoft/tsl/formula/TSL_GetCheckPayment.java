package com.bokesoft.tsl.formula;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.bokesoft.tsl.common.TSL_BokeDeeFactory;
import com.bokesoft.yigo.common.util.TypeConvertor;
import com.bokesoft.yigo.mid.base.DefaultContext;
import com.bokesoft.yigo.mid.parser.BaseMidFunctionImpl;
import com.bokesoft.yigo.parser.IExecutor;
import com.bokesoft.yigo.struct.datatable.DataTable;
import com.bokesoft.yigo.struct.document.Document;

public class TSL_GetCheckPayment extends BaseMidFunctionImpl {

	private String ACTION = "ERP_CheckPayment_TO_BPM";

	@Override
	public Object evalImpl(String name, DefaultContext context, Object[] args, IExecutor arg3) throws Throwable {
		String dataObjectKey = TypeConvertor.toString(args[0]);
		PaymentInfo info = TSLPaymentInfoFactory.CreateInfo(context, dataObjectKey);
		Document document = context.getDocument();
		DataTable headTable = document.get(info.getHeadTable());
		// TaskID
		String p_task_id = headTable.getObject(info.getOIDField()).toString();
		TSL_BokeDeeFactory factory = new TSL_BokeDeeFactory();
		JSONArray ja = new JSONArray();
		JSONObject jo = factory.getRowNumberCondition();
		ja.add(jo);
		if (!p_task_id.equalsIgnoreCase("null")) {
			jo = factory.createCondition("p_task_id", "=", p_task_id);
			ja.add(jo);
		}
		factory.addParameter("json", ja.toString());
		String task_id = null;
		String msg="";
		String stringJson = factory.executeAction(ACTION);
		JSONObject reJSONObject = JSONObject.parseObject(stringJson);
		Object data = reJSONObject.get("data");
		if (data instanceof JSONArray) {
			JSONArray reJSONArray = (JSONArray) data;
			for (int i = 0; i < reJSONArray.size(); ++i) {
				JSONObject jsonObject = (JSONObject) reJSONArray.get(i);
				task_id = jsonObject.get("no").toString();
			}
			if (task_id.isEmpty()&&task_id.equalsIgnoreCase("null")) {
				msg = "";
			} else {
				msg ="已存在付款";
			}
		}
		return msg;
	}
}
