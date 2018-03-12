package com.bokesoft.tsl.service;

import java.math.BigDecimal;
import java.util.Map;

import com.bokesoft.yigo.common.util.TypeConvertor;
import com.bokesoft.yigo.mid.base.DefaultContext;
import com.bokesoft.yigo.mid.service.IExtService2;

public class TSL_CheckHomeUseService implements IExtService2 {

	@Override
	public Object doCmd(DefaultContext context, Map<String, Object> args) throws Throwable {
		BigDecimal homeUser = TypeConvertor.toBigDecimal(args.get("homeUse"));
		
		int num = homeUser.multiply(new BigDecimal(10)).intValue();
		int remainder = num % 5;

		return remainder == 0;
	}
}
