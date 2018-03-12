package com.bokesoft.tsl.formula;

import java.util.HashMap;

import com.alibaba.fastjson.JSONObject;
import com.bokesoft.tsl.common.TSL_BokeDeeFactory;
import com.bokesoft.yigo.common.util.TypeConvertor;
import com.bokesoft.yigo.mid.base.DefaultContext;
import com.bokesoft.yigo.mid.parser.BaseMidFunctionImpl;
import com.bokesoft.yigo.parser.IExecutor;

public class TSL_PoAndPrApproveReject extends BaseMidFunctionImpl {

	private static String ACTION = "ERP_PO_PR_APPROVE_REJECT";

	@Override
	public Object evalImpl(String name, DefaultContext context, Object[] args, IExecutor executor) throws Throwable {
		String billkey = TypeConvertor.toString(args[0]);
		String flow = TypeConvertor.toString(args[1]);
		String node = TypeConvertor.toString(args[2]);
		String oid = TypeConvertor.toString(args[3]);
		String p_inf_id = TypeConvertor.toString(args[4]);
		String p_doc_type = TypeConvertor.toString(args[5]);
		String p_action = TypeConvertor.toString(args[6]);
		String p_employee_number = TypeConvertor.toString(args[7]);
		String p_note = TypeConvertor.toString(args[8]);
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
		paramenter.put("p_inf_id", p_inf_id);
		paramenter.put("p_doc_type", p_doc_type);
		paramenter.put("p_action", p_action);
		paramenter.put("p_employee_number", p_employee_number);
		paramenter.put("p_note", p_note);
		// 执行BokeDee接口
		String stringJson = factory.executeAction(ACTION);
		// 获取返回值，并转换为JSONObject
		JSONObject reJSONObject = JSONObject.parseObject(stringJson);
		String returnStatus = TypeConvertor.toString(reJSONObject.get("x_return_status"));
		if (returnStatus.equalsIgnoreCase("E")) {
			throw new Exception("调用po_eflow_approve_pkg失败，ID：" + p_inf_id + ".错误信息："
					+ TypeConvertor.toString(reJSONObject.get("x_msg_data")));
		}

		return true;
	}
}
