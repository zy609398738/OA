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

public class TSL_DeletePOTaskid extends BaseMidFunctionImpl {

	private static String ACTION = "ERP_POEFLOW_To_BPM";

	@Override
	public Object evalImpl(String name, DefaultContext context, Object[] args, IExecutor iExecutor) throws Throwable {

		String billkey = TypeConvertor.toString(args[0]);
		String flow = TypeConvertor.toString(args[1]);
		String node = TypeConvertor.toString(args[2]);
		String oid = TypeConvertor.toString(args[3]);

		Document doc = context.getDocument();
		DataTable dtHead = doc.get("B_RrpairConfirmation");
		DataTable dtDtl = doc.get("B_RrpairConfirmationDtl");
		int isAutoGenerate = TypeConvertor.toInteger(dtHead.getObject("isAutoGenerate"));
		String[] line_ids = TypeConvertor.toString(dtHead.getObject("DtlLines")).split(",");
		if (isAutoGenerate == 0) {
			return true;
		}
		for (String line_id : line_ids) {
			if (!line_id.isEmpty()) {
				boolean bFind = false;
				dtDtl.beforeFirst();
				while (dtDtl.next()) {
					String line = dtDtl.getString("Line");
					if (line.equals(line_id)) {
						bFind = true;
						break;
					}
				}

				if (!bFind) {
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
					paramenter.put("p_line_id", line_id);
					// 获取返回值，并转换为JSONObject
					String stringJson = factory.executeAction(ACTION);
					JSONObject reJSONObject = JSONObject.parseObject(stringJson);
					String returnStatus = TypeConvertor.toString(reJSONObject.get("x_return_status"));
					if (returnStatus.equalsIgnoreCase("e")) {
						throw new Exception(
								"删除Taskid失败,错误信息:" + TypeConvertor.toString(reJSONObject.get("x_msg_data")));
					}
				}
			}

		}
		return true;
	}
}