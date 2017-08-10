package com.bokesoft.tsl.formula;

import com.bokesoft.yigo.mid.base.DefaultContext;

public class BankPaymentInfo implements PaymentInfo {

	private DefaultContext context = null;
	// 主表
	private String headTable = "B_BankPayment";
	// 单据唯一标识
	private static String OIDField = "OID";
	// 付款实体
	private static String OUCodeField = "OU_CODE";
	// 付款实体名称
	private static String OUNAMEField = "OU_NAME";
	// 发票ID
	private static String INVOICEIDField = "INVOICE_ID";
	// 发票号
	private static String INVOICENUMField = "INVOICE_NUM";
	// 付款金额
	private static String Actual_Pay_AmountField = "Actual_Invoice_Amount";
	// 付款金额（USD）
	private static String ActualPayAmountUSDField = "Actual_Amount";
	// 币种 配置需添加隐藏字段
	private static String CurrencyCodeField = "CURRENCY";
	// 银行名称  配置需添加隐藏字段
	private static String BankNameField = "Bank_Name";
	// 付款银行账户名称
	private static String BANKACCOUNTNAMEField = "BANK_ACCOUNT_NAME";
	// 付款银行账号
	private static String BANKACCOUNTNUMField = "BANK_ACCOUNT_NUM";
	//付款银行ID  配置需添加隐藏字段
	private static String PEXTBANKACCIDField = "p_ext_bank_acc_id";
	//1688付款码  配置需添加隐藏字段
	private static String CODE1688Field = "Code1688";
	//Vendor_Branch_ICO  配置需添加隐藏字段
	private static String VendorBranchICOField = "Vendor_Branch_ICO";
	//BANK_ACCOUNT_ID  配置需添加隐藏字段
	private static String BANKACCOUNTIDField = "BANK_ACCOUNT_ID";
	//CashItemCode 配置需添加隐藏字段
	private static String CashItemCodeField = "CashItemCode";
	public BankPaymentInfo(DefaultContext context) {
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

	public  String getOUCodeField() {
		return OUCodeField;
	}

	public  String getOUNAMEField() {
		return OUNAMEField;
	}

	public  String getINVOICEIDField() {
		return INVOICEIDField;
	}

	public  String getINVOICENUMField() {
		return INVOICENUMField;
	}

	public  String getActual_Pay_AmountField() {
		return Actual_Pay_AmountField;
	}

	public  String getActualPayAmountUSDField() {
		return ActualPayAmountUSDField;
	}

	public  String getCurrencyCodeField() {
		return CurrencyCodeField;
	}

	public  String getBankNameField() {
		return BankNameField;
	}

	public  String getBANKACCOUNTNAMEField() {
		return BANKACCOUNTNAMEField;
	}

	public  String getBANKACCOUNTNUMField() {
		return BANKACCOUNTNUMField;
	}

	public  String getPEXTBANKACCIDField() {
		return PEXTBANKACCIDField;
	}

	public  String getCODE1688Field() {
		return CODE1688Field;
	}

	public  String getVendorBranchICOField() {
		return VendorBranchICOField;
	}

	public  String getBANKACCOUNTIDField() {
		return BANKACCOUNTIDField;
	}

	public  String getCashItemCodeField() {
		return CashItemCodeField;
	}

}
