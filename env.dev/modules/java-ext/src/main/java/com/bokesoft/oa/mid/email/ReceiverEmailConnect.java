package com.bokesoft.oa.mid.email;

import java.util.ArrayList;

import com.bokesoft.oa.base.OAContext;
import com.bokesoft.yigo.common.util.TypeConvertor;
import com.bokesoft.yigo.mid.base.DefaultContext;
import com.bokesoft.yigo.mid.service.IExtService;

/**
 * 接收邮件连接测试
 * 
 * @author minjian
 *
 */
public class ReceiverEmailConnect implements IExtService {
	@Override
	public Object doCmd(DefaultContext context, ArrayList<Object> paramArrayList) throws Throwable {
		OAContext ocContext = new OAContext(context);
		EMailMidFunction eMailMidFunction = new EMailMidFunction(ocContext);
		Long operatorId = TypeConvertor.toLong(paramArrayList.get(0));
		eMailMidFunction.getCurrentEmailConfig(false, operatorId);
		return eMailMidFunction.receiverEmailConnect(operatorId);
	}
}
