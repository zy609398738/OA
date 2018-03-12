package com.bokesoft.tsl.formula;

import java.util.HashMap;
import com.alibaba.fastjson.JSONObject;
import com.bokesoft.tsl.common.TSL_BokeDeeFactory;
import com.bokesoft.yigo.common.util.TypeConvertor;
import com.bokesoft.yigo.mid.base.DefaultContext;
import com.bokesoft.yigo.mid.parser.BaseMidFunctionImpl;
import com.bokesoft.yigo.parser.IExecutor;
import com.bokesoft.yigo.struct.datatable.DataTable;
import com.bokesoft.yigo.struct.document.Document;

public class TSL_ImportInvItempkg extends BaseMidFunctionImpl {

	private static String ACTION = "ERP_Inv_Itempkg_Import_To_BPM";

	@Override
	public Object evalImpl(String name, DefaultContext context, Object[] args, IExecutor iExecutor) throws Throwable {
		Document document = context.getDocument();
		DataTable headTable = document.get("B_MaterialDistribute");
		DataTable detailTable = document.get("B_MaterialDistributeDtl");
		String billkey = TypeConvertor.toString(args[0]);
		String flow = TypeConvertor.toString(args[1]);
		String node = TypeConvertor.toString(args[2]);
		String oid = TypeConvertor.toString(args[3]);
		String p_task_id =  headTable.getObject("InstanceID").toString();
		String p_process_type = "CREATE";
		String p_email_add = "";
		TSL_BokeDeeFactory factory = new TSL_BokeDeeFactory();
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
		HashMap<String, String> paramenter = factory.getParameter();
		paramenter.put("p_task_id", p_task_id);
		paramenter.put("p_process_type", p_process_type);
		paramenter.put("p_email_add", p_email_add);
		// 执行BokeDee接口
		String stringJson = factory.executeAction(ACTION);
		// 获取返回值，并转换为JSONObject
		JSONObject reJSONObject = JSONObject.parseObject(stringJson);
		String x_request_id = reJSONObject.get("x_request_id").toString();
		int rowCount = detailTable.size();
		for (int index = 0; index < rowCount; index++) {
		detailTable.setObject(index, "ERPNO", x_request_id);
		}
		return true;
	}
}
