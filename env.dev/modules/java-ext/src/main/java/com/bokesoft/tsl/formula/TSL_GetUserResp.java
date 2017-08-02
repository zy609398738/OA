package com.bokesoft.tsl.formula;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.bokesoft.tsl.common.TSL_BokeDeeFactory;
import com.bokesoft.yes.tools.dic.DictCacheUtil;
import com.bokesoft.yigo.mid.base.DefaultContext;
import com.bokesoft.yigo.mid.parser.BaseMidFunctionImpl;
import com.bokesoft.yigo.parser.IExecutor;
import com.bokesoft.yigo.struct.datatable.DataTable;
import com.bokesoft.yigo.struct.document.Document;

public class TSL_GetUserResp extends BaseMidFunctionImpl {

	private String ACTION = "ERP_USER_RESP_TO_BPM";

	@Override
	public Object evalImpl(String name, DefaultContext context, Object[] args, IExecutor arg3) throws Throwable {
		Document document = context.getDocument();
		DataTable headTable = document.get("B_ERPAccAuzChgApp");
		// TaskID
		String task_id = headTable.getObject("OID").toString();
		String email = DictCacheUtil
				.getDictValue(context.getVE(), "Dict_Employee", headTable.getLong("ApplicantID"), "Email").toString();
		TSL_BokeDeeFactory factory = new TSL_BokeDeeFactory();
		JSONArray ja = new JSONArray();
		JSONObject jo = factory.getRowNumberCondition();
		ja.add(jo);
		if (!task_id.equalsIgnoreCase("null")) {
			jo = factory.createCondition("task_id", "=", task_id);
			ja.add(jo);
		}
		factory.addParameter("json", ja.toString());
		String rowcount = null;
		String msg="";
		String stringJson = factory.executeAction(ACTION);
		JSONObject reJSONObject = JSONObject.parseObject(stringJson);
		Object data = reJSONObject.get("data");
		if (data instanceof JSONArray) {
			JSONArray reJSONArray = (JSONArray) data;
			for (int i = 0; i < reJSONArray.size(); ++i) {
				JSONObject jsonObject = (JSONObject) reJSONArray.get(i);
				rowcount = jsonObject.get("no").toString();
			}
			if (rowcount.equalsIgnoreCase("0")) {
				msg = "";
			} else {
				msg ="数据导入ERP成功,但需要在oracle数据库中添加" + email + "(新用户)";
			}
		}
		return msg;
	}
}
