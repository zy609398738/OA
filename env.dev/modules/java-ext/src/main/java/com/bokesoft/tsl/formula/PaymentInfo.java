package com.bokesoft.tsl.formula;

import com.bokesoft.yigo.mid.base.DefaultContext;
import com.bokesoft.yigo.struct.datatable.DataTable;

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

	public long getCurrencyCodeField(DataTable dataTable);

	public String getBankNameField(DataTable dataTable);

	public String getBANKACCOUNTNAMEField();

	public String getBANKACCOUNTNUMField(DataTable dataTable);

	public String getPEXTBANKACCIDField(DataTable dataTable);

	public String getCODE1688Field(DataTable dataTable);

	public long getBUField(DataTable dataTable);

	public String getBANKACCOUNTIDField(DataTable dataTable);

	public String getCashItemCodeField();
}
