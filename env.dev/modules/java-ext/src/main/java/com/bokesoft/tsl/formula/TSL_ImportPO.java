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

public class TSL_ImportPO extends BaseMidFunctionImpl {

	private static String ACTION = "ERP_PO_Import_To_BPM";

	@Override
	public Object evalImpl(String name, DefaultContext context, Object[] args, IExecutor iExecutor) throws Throwable {
		Document document = context.getDocument();
		DataTable headTable = document.get("B_RrpairConfirmation");
		DataTable detailTable = document.get("B_RrpairConfirmationDtl");
		String billkey = TypeConvertor.toString(args[0]);
		String flow = TypeConvertor.toString(args[1]);
		String node = TypeConvertor.toString(args[2]);
		String oid = TypeConvertor.toString(args[3]);
		int isAutoGenerate = TypeConvertor.toInteger(headTable.getObject("isAutoGenerate"));
		String source_id = headTable.getObject("InstanceID").toString();
		String line_id ="";
		if (isAutoGenerate == 0) {
			return true;
		}
		int rowCount = detailTable.size();
		for (int index = 0; index < rowCount; index++) {
			line_id = TypeConvertor.toString(detailTable.getString(index, "Line"));	

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
		paramenter.put("p_task_id",source_id );
		paramenter.put("p_line_id",line_id );
		String stringJson = factory.executeAction(ACTION);
		// 获取返回值，并转换为JSONObject
		JSONObject reJSONObject = JSONObject.parseObject(stringJson);
		String returnStatus = TypeConvertor.toString(reJSONObject.get("x_return_status"));
		if (returnStatus.equalsIgnoreCase("e")) {
				throw new Exception(
						 "更新Taskid失败,错误信息" + TypeConvertor.toString(reJSONObject.get("x_msg_data")));
		}

	}	
		return true;
}
}