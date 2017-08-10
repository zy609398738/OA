package com.bokesoft.tsl.formula;

import com.bokesoft.yigo.mid.base.DefaultContext;

public class TSLPaymentInfoFactory {
	public static PaymentInfo CreateInfo(DefaultContext context, String dataObject) {
		if ("B_PayApplication".equalsIgnoreCase(dataObject)) {
			return new PayApplicationInfo(context);
		} else if ("B_BankPayment".equalsIgnoreCase(dataObject)) {
			return new BankPaymentInfo(context);
		}

		return null;
	}
}
