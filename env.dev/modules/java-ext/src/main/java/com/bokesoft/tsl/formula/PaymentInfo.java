package com.bokesoft.tsl.formula;

import com.bokesoft.yigo.mid.base.DefaultContext;

public interface PaymentInfo {

	public String getHeadTable();

	public String getOIDField();

	public DefaultContext getContext();

	public String getOUCodeField();

	public String getOUNAMEField();

	public String getINVOICEIDField();

	public String getINVOICENUMField();

	public String getActual_Pay_AmountField();

	public String getActualPayAmountUSDField();

	public String getCurrencyCodeField();

	public String getBankNameField();

	public String getBANKACCOUNTNAMEField();

	public String getBANKACCOUNTNUMField();

	public String getPEXTBANKACCIDField();

	public String getCODE1688Field();

	public String getVendorBranchICOField();

	public String getBANKACCOUNTIDField();
	
	public  String getCashItemCodeField();
}
