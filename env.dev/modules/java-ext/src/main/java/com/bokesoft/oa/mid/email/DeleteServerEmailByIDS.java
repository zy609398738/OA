package com.bokesoft.oa.mid.email;

import java.util.ArrayList;
import java.util.List;

import com.bokesoft.yigo.common.util.TypeConvertor;
import com.bokesoft.yigo.mid.base.DefaultContext;
import com.bokesoft.yigo.mid.service.IExtService;

public class DeleteServerEmailByIDS implements IExtService {
	@Override
	public Object doCmd(DefaultContext paramDefaultContext, ArrayList<Object> paramArrayList) throws Throwable {
		EMailMidFunction eMailMidFunction = new EMailMidFunction(paramDefaultContext);
		Long operatorId = TypeConvertor.toLong(paramArrayList.get(0));
		eMailMidFunction.emailConfig(false, operatorId);
		if(paramArrayList.get(1) instanceof String ){
			return eMailMidFunction.deleteServerEmailByIDS(operatorId, TypeConvertor.toString(paramArrayList.get(1)));
		}else{
			@SuppressWarnings("unchecked")
			List<Object> ids=(List<Object>)paramArrayList.get(1);
			return eMailMidFunction.deleteServerEmailByIDS(operatorId, ids);
		}
		
	}
}
