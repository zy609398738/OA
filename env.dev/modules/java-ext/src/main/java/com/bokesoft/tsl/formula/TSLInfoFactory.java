package com.bokesoft.tsl.formula;

import com.bokesoft.yigo.mid.base.DefaultContext;

public class TSLInfoFactory {
	public static CostInfo CreateInfo(DefaultContext context, String dataObject) {
		if ("B_CostApply".equalsIgnoreCase(dataObject)) {
			return new CostApplyInvoiceInfo(context);
		} else if ("B_TravelExpenseApply".equalsIgnoreCase(dataObject)) {
			return new TravelExpenseApplyInvoiceInfo(context);
		}

		return null;
	}
}
