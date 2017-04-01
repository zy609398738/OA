package com.bokesoft.oa.mid.wf;

import com.bokesoft.yigo.parser.IFunImplCluster;
import com.bokesoft.yigo.parser.IFunctionProvider;


public class FunctionsProvider implements IFunctionProvider{

	@Override
	public IFunImplCluster[] getClusters() {
		
		return new IFunImplCluster[]{
				new Functions(),
	};

}
}
