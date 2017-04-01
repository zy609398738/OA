package com.bokesoft.oa.mid.email;

import java.util.ArrayList;

import com.bokesoft.yigo.common.util.TypeConvertor;
import com.bokesoft.yigo.mid.base.DefaultContext;
import com.bokesoft.yigo.mid.service.IExtService;

public class ReceiveEmail implements IExtService {
	@Override
	public Object doCmd(DefaultContext paramDefaultContext, ArrayList<Object> paramArrayList) throws Throwable {
		EMailMidFunction eMailMidFunction = new EMailMidFunction(paramDefaultContext);
		Long operatorId = TypeConvertor.toLong(paramArrayList.get(0));
		eMailMidFunction.emailConfig(false, operatorId);
		return eMailMidFunction.receiveEmail(operatorId);
	}
}
