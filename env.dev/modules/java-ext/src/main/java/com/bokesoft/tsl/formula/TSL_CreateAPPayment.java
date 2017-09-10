package com.bokesoft.tsl.formula;

import java.util.HashMap;

import com.alibaba.fastjson.JSONObject;
import com.bokesoft.tsl.common.TSL_BokeDeeFactory;
import com.bokesoft.yes.tools.dic.DictCacheUtil;
import com.bokesoft.yigo.common.util.TypeConvertor;
import com.bokesoft.yigo.mid.base.DefaultContext;
import com.bokesoft.yigo.mid.parser.BaseMidFunctionImpl;
import com.bokesoft.yigo.parser.IExecutor;
import com.bokesoft.yigo.struct.datatable.DataTable;
import com.bokesoft.yigo.struct.document.Document;

public class TSL_CreateAPPayment extends BaseMidFunctionImpl {

	private static String ACTION = "ERP_Create_Ap_Payment_TO_BPM";

	@Override
	public Object evalImpl(String name, DefaultContext context, Object[] args, IExecutor arg3) throws Throwable {
		String dataObjectKey = TypeConvertor.toString(args[0]);
		PaymentInfo info = TSLPaymentInfoFactory.CreateInfo(context, dataObjectKey);
		Document document = context.getDocument();
		DataTable headTable = document.get(info.getHeadTable());

		String p_api_version = "1.0";

		String p_init_msg_list = "";

		String p_commit = "";

		String p_org_id = TypeConvertor.toString(headTable.getObject(info.getOUCodeField()));

		String p_invoice_id = TypeConvertor.toString(headTable.getObject(info.getINVOICEIDField()));

		String p_description = "";

		// String p_bank_account_id =
		// headTable.getObject(info.getBANKACCOUNTIDField(headTable)).toString();
		String p_bank_account_id = info.getBANKACCOUNTIDField(headTable);

		// String p_ext_bank_acc_id =
		// headTable.getObject(info.getPEXTBANKACCIDField(headTable)).toString();
		String p_ext_bank_acc_id = info.getPEXTBANKACCIDField(headTable);

		String p_payment_amount = TypeConvertor.toString(headTable.getObject(info.getActual_Pay_AmountField()));

		// Date p_payment_date = new Date();

		String p_payment_type_flag = "A";

		String p_payment_document_id = "";

		// String p_bu =
		// headTable.getObject(info.getVendorBranchICOField(headTable)).toString();
		String p_bu = DictCacheUtil
				.getDictValue(context.getVE(), "Dict_PaymentMehtod", info.getBUField(headTable), "Name").toString();

		String p_attribute_13 = "";

		// String p_attribute_14
		// =headTable.getObject(info.getCODE1688Field()).toString();
		String p_attribute_14 = info.getCODE1688Field(headTable);

		String p_cash_item = TypeConvertor.toString(headTable.getObject(info.getCashItemCodeField()));

		String p_employee_nam = TypeConvertor.toString(args[1]);

		String p_employee_num = TypeConvertor.toString(args[2]);

		String p_task_id = TypeConvertor.toString(headTable.getObject(info.getOIDField()));

		// 接口调用
		TSL_BokeDeeFactory factory = new TSL_BokeDeeFactory();
		HashMap<String, String> paramenter = factory.getParameter();
		paramenter.put("p_api_version", p_api_version);
		paramenter.put("p_init_msg_list", p_init_msg_list);
		paramenter.put("p_commit", p_commit);
		paramenter.put("p_org_id", p_org_id);
		paramenter.put("p_invoice_id", p_invoice_id);
		paramenter.put("p_description", p_description);
		paramenter.put("p_bank_account_id", p_bank_account_id);
		paramenter.put("p_ext_bank_acc_id", p_ext_bank_acc_id);
		paramenter.put("p_payment_amount", p_payment_amount);
		// paramenter.put("p_payment_date", p_payment_date);
		paramenter.put("p_payment_type_flag", p_payment_type_flag);
		paramenter.put("p_payment_document_id", p_payment_document_id);
		paramenter.put("p_bu", p_bu);
		paramenter.put("p_attribute_13", p_attribute_13);
		paramenter.put("p_attribute_14", p_attribute_14);
		paramenter.put("p_cash_item", p_cash_item);
		paramenter.put("p_employee_nam", p_employee_nam);
		paramenter.put("p_employee_num", p_employee_num);
		paramenter.put("p_task_id", p_task_id);
		// 执行BokeDee接口
		String stringJson = factory.executeAction(ACTION);
		// 获取返回值，并转换为JSONObject
		JSONObject reJSONObject = JSONObject.parseObject(stringJson);
		String returnStatus = TypeConvertor.toString(reJSONObject.get("x_return_status"));
		if (returnStatus.equalsIgnoreCase("E")) {
			throw new Exception(
					"创建付款单失败，任务ID：" + p_task_id + ".错误信息：" + TypeConvertor.toString(reJSONObject.get("x_msg_data")));
		}

		return true;
	}
}
