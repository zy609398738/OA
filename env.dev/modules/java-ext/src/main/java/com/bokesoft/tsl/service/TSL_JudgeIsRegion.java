package com.bokesoft.tsl.service;

import java.util.Map;

import com.bokesoft.yigo.mid.base.DefaultContext;
import com.bokesoft.yigo.mid.service.IExtService2;

public class TSL_JudgeIsRegion implements IExtService2 {

	@Override
	public Object doCmd(DefaultContext context, Map<String, Object> args) throws Throwable {
		String region = (String) args.get("region");
		String arrivalRegion = (String) args.get("arrivalRegion");
		int IsRegion = 0;
		if (region.indexOf(arrivalRegion) > -1) {
			IsRegion = 1;
		} else {
			IsRegion = 0;
		}
		return IsRegion;
	}
}
