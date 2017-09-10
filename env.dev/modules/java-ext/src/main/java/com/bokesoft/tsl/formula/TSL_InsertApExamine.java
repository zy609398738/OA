package com.bokesoft.tsl.formula;

import java.util.HashMap;
import com.bokesoft.tsl.common.TSL_BokeDeeFactory;
import com.bokesoft.yes.tools.dic.DictCacheUtil;
import com.bokesoft.yigo.common.util.TypeConvertor;
import com.bokesoft.yigo.mid.base.DefaultContext;
import com.bokesoft.yigo.mid.parser.BaseMidFunctionImpl;
import com.bokesoft.yigo.parser.IExecutor;
import com.bokesoft.yigo.struct.datatable.DataTable;
import com.bokesoft.yigo.struct.document.Document;

public class TSL_InsertApExamine extends BaseMidFunctionImpl {

	private static String ACTION = "BPM_AP_EXAMINE_TO_ERP";

	@Override
	public Object evalImpl(String name, DefaultContext context, Object[] args, IExecutor arg3) throws Throwable {
		String dataObjectKey = TypeConvertor.toString(args[0]);
		PaymentInfo info = TSLPaymentInfoFactory.CreateInfo(context, dataObjectKey);
		// 最后处理人工号
		String approver_number = TypeConvertor.toString(args[1]);
		// 最后处理人名称
		String approver = TypeConvertor.toString(args[2]);
		Document document = context.getDocument();
		DataTable headTable = document.get(info.getHeadTable());
		// org_id 付款实体OU_CODE
		String org_id = TypeConvertor.toString(headTable.getObject(info.getOUCodeField()));
		// INVOICE_ID 发票ID
		String invoice_id = TypeConvertor.toString(headTable.getObject(info.getINVOICEIDField()));
		// INVOICE_NUM 发票号
		String invoice_num = TypeConvertor.toString(headTable.getObject(info.getINVOICENUMField()));
		// invoice_amount 付款金额
		String invoice_amount = TypeConvertor.toString(headTable.getObject(info.getActual_Pay_AmountField()));
		// Actual_Amount 付款金额（USD）
		String amount = TypeConvertor.toString(headTable.getObject(info.getActualPayAmountUSDField()));
		// CURRENCY_CODE 币种
		// String currency_code = DictCacheUtil.getDictValue(context.getVE(),
		// "Dict_Currency", headTable.getLong(info.getCurrencyCodeField()),
		// "Code").toString();
		String currency_code = DictCacheUtil
				.getDictValue(context.getVE(), "Dict_Currency", info.getCurrencyCodeField(headTable), "Code")
				.toString();
		// BANK_NAME 银行名称
		// String bank_name =
		// headTable.getObject(info.getBankNameField()).toString();
		String bank_name = info.getBankNameField(headTable);
		// BANK_ACCOUNT_NAME 付款银行账户名称
		String bank_account_name = TypeConvertor.toString(headTable.getObject(info.getBANKACCOUNTNAMEField()));
		// BANK_ACCOUNT_NUM 付款银行账号
		// String bank_account_num =
		// headTable.getObject(info.getBANKACCOUNTNUMField()).toString();
		String bank_account_num = info.getBANKACCOUNTNUMField(headTable);
		// bank_acct_use_id 付款银行ID
		// String bank_acct_use_id =
		// headTable.getObject(info.getBANKACCOUNTIDField()).toString();
		String bank_acct_use_id = info.getBANKACCOUNTIDField(headTable);
		// TASKID OID
		String task_id = TypeConvertor.toString(headTable.getObject(info.getOIDField()));
		// 接口调用
		TSL_BokeDeeFactory factory = new TSL_BokeDeeFactory();
		HashMap<String, String> paramenter = factory.getParameter();
		paramenter.put("org_id", org_id);
		paramenter.put("invoice_id", invoice_id);
		paramenter.put("invoice_num", invoice_num);
		paramenter.put("invoice_amount", invoice_amount);
		paramenter.put("amount", amount);
		paramenter.put("currency_code", currency_code);
		paramenter.put("bank_name", bank_name);
		paramenter.put("bank_account_name", bank_account_name);
		paramenter.put("bank_account_num", bank_account_num);
		paramenter.put("bank_acct_use_id", bank_acct_use_id);
		paramenter.put("task_id", task_id);
		paramenter.put("approver_number", approver_number);
		paramenter.put("approver", approver);
		// 执行BokeDee接口
		String stringJson = factory.executeAction(ACTION);
		// 返回执行结果
		return stringJson;
	}
}
