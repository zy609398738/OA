package com.bokesoft.tsl.formula;

import com.bokesoft.yigo.parser.IFunImplCluster;
import com.bokesoft.yigo.parser.IFunctionProvider;

public class TSLMidFunctionProvider implements IFunctionProvider {

	@Override
	public IFunImplCluster[] getClusters() {
		return new IFunImplCluster[] { new TSLMidFunction(), };
	}
}
