package com.bokesoft.oa.mid;

import java.util.ArrayList;

import com.bokesoft.yigo.meta.factory.MetaFactory;
import com.bokesoft.yigo.mid.base.DefaultContext;
import com.bokesoft.yigo.mid.service.IExtService;

public class GetSolutionProperty implements IExtService{

	@Override
	public Object doCmd(DefaultContext paramDefaultContext, ArrayList<Object> paramArrayList) throws Throwable {
		return getSolutionProperty(paramDefaultContext);
	}

	private String getSolutionProperty(DefaultContext context) throws Throwable {
		String path = MetaFactory.getGlobalInstance().getSolution().getDataPath();
		return path;
	}

}
