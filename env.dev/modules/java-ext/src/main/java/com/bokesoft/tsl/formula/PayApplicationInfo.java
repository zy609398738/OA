package com.bokesoft.tsl.formula;

import com.bokesoft.yigo.mid.base.DefaultContext;
import com.bokesoft.yigo.struct.datatable.DataTable;

public class PayApplicationInfo implements PaymentInfo {

	private DefaultContext context = null;
	// 主表
	private String headTable = "B_PayApplication";
	// 单据唯一标识
	private static String OIDField = "InstanceID";
	// 付款实体
	private static String OUCodeField = "OU_CODE";
	// 付款实体名称
	private static String OUNAMEField = "OU_NAME";
	// 发票ID
	private static String INVOICEIDField = "INVOICE_ID";
	// 发票号
	private static String INVOICENUMField = "INVOICE_NUM";
	// 付款金额
	private static String Actual_Pay_AmountField = "Actual_Pay_Amount";
	// 付款金额（USD）
	private static String ActualPayAmountUSDField = "Actual_Pay_Amount_USD";
	// 币种
	private static String CurrencyCodeField = "CURRENCY";
	// 银行名称
	private static String BankNameField = "Bank_Name";
	// 付款银行账户名称
	private static String BANKACCOUNTNAMEField = "BANK_ACCOUNT_NAME";
	// 付款银行账号
	private static String BANKACCOUNTNUMField = "BANK_ACCOUNT_NUM";
	// 付款银行ID
	private static String PEXTBANKACCIDField = "p_ext_bank_acc_id";
	// 1688付款码
	private static String CODE1688Field = "Code1688";
	// BU
	private static String BUField = "BU";
	// BANK_ACCOUNT_ID
	private static String BANKACCOUNTIDField = "BANK_ACCOUNT_ID";
	//
	// BANK_ACCOUNT_ID
	private static String CashItemCodeField = "CashItemCode";

	public PayApplicationInfo(DefaultContext context) {
		this.context = context;
	}

	@Override

	public String getHeadTable() {
		return headTable;
	}

	public String getOIDField() {
		return OIDField;
	}

	public DefaultContext getContext() {
		return context;
	}

	public String getOUCodeField() {
		return OUCodeField;
	}

	public String getOUNAMEField() {
		return OUNAMEField;
	}

	public String getINVOICEIDField() {
		return INVOICEIDField;
	}

	public String getINVOICENUMField() {
		return INVOICENUMField;
	}

	public String getActual_Pay_AmountField() {
		return Actual_Pay_AmountField;
	}

	public String getActualPayAmountUSDField() {
		return ActualPayAmountUSDField;
	}

	public long getCurrencyCodeField(DataTable dataTable) {
		return dataTable.getLong(CurrencyCodeField);
	}

	public String getBankNameField(DataTable dataTable) {
		return dataTable.getString(BankNameField);
	}

	public String getBANKACCOUNTNAMEField() {
		return BANKACCOUNTNAMEField;
	}

	public String getBANKACCOUNTNUMField(DataTable dataTable) {
		return dataTable.getString(BANKACCOUNTNUMField);
	}

	public String getPEXTBANKACCIDField(DataTable dataTable) {
		return dataTable.getString(PEXTBANKACCIDField);
	}

	public String getCODE1688Field(DataTable dataTable) {
		return dataTable.getString(CODE1688Field);
	}

	public long getBUField(DataTable dataTable) {
		return dataTable.getLong(BUField);
	}

	public String getBANKACCOUNTIDField(DataTable dataTable) {
		return dataTable.getString(BANKACCOUNTIDField);
	}

	public String getCashItemCodeField() {
		return CashItemCodeField;
	}

}
