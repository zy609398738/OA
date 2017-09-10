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

public class TSL_ImportAPInvoice extends BaseMidFunctionImpl {

	private static String ACTION = "ERP_AP_Import_TO_BPM";

	@Override
	public Object evalImpl(String name, DefaultContext context, Object[] args, IExecutor iExecutor) throws Throwable {
		Document document = context.getDocument();
		DataTable headTable = document.get("B_CostApply");
		String SQL = "select distinct CEDetail_PaymentType from B_CostApplyCE WHERE SOID = ?";
		DataTable dt = context.getDBManager().execPrepareQuery(SQL, document.getOID());
		// paymenttype
		String paymenttype = null;
		if (dt.size() > 0) {
			// 获取SQL查询值赋给变量
			paymenttype = dt.getString(0, 0);
		}
		// TaskID
		String TaskId = null;
		if (paymenttype == null) {
			TaskId = headTable.getObject("InstanceID").toString();
		} else if (paymenttype.equalsIgnoreCase("PersonalPayment")) {
			TaskId = headTable.getObject("InstanceID") + "_P";
		} else if (paymenttype.equalsIgnoreCase("CompanyPayment")) {
			TaskId = headTable.getObject("InstanceID") + "_C";
		}
		// 预算承担组织编号
		String BudgetOuId = headTable.getString("OU_Code");

		TSL_BokeDeeFactory factory = new TSL_BokeDeeFactory();
		HashMap<String, String> paramenter = factory.getParameter();
		paramenter.put("p_invoice_num", TaskId);
		paramenter.put("p_org_id", BudgetOuId);
		// 执行BokeDee接口
		String stringJson = factory.executeAction(ACTION);
		// 获取返回值，并转换为JSONObject
		JSONObject reJSONObject = JSONObject.parseObject(stringJson);
		String returnStatus = TypeConvertor.toString(reJSONObject.get("x_return_status"));
		if (returnStatus.equalsIgnoreCase("E")) {
			throw new Exception(
					"导入AP发票失败，任务ID：" + TaskId + ".错误信息：" + TypeConvertor.toString(reJSONObject.get("x_return_msg")));
		}

		return true;
	}
}
