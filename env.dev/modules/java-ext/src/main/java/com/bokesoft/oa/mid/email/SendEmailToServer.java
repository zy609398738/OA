package com.bokesoft.oa.mid.email;

import java.util.ArrayList;

import com.bokesoft.yigo.common.util.TypeConvertor;
import com.bokesoft.yigo.mid.base.DefaultContext;
import com.bokesoft.yigo.mid.service.IExtService;

public class SendEmailToServer implements IExtService {
	@Override
	public Object doCmd(DefaultContext paramDefaultContext, ArrayList<Object> paramArrayList) throws Throwable {
		EMailMidFunction eMailMidFunction = new EMailMidFunction(paramDefaultContext);
		Long operatorId = TypeConvertor.toLong(paramArrayList.get(0));
		eMailMidFunction.emailConfig(false, operatorId);
		return eMailMidFunction.sendEmailToServer(operatorId, TypeConvertor.toString(paramArrayList.get(1)),
				TypeConvertor.toString(paramArrayList.get(2)), TypeConvertor.toString(paramArrayList.get(3)),
				TypeConvertor.toString(paramArrayList.get(4)), TypeConvertor.toString(paramArrayList.get(5)),
				TypeConvertor.toString(paramArrayList.get(6)),
				TypeConvertor.toString(paramArrayList.get(7)));
	}
}
