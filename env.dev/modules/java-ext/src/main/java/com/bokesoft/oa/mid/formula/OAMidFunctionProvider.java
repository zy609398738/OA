package com.bokesoft.oa.mid.formula;

import com.bokesoft.yigo.parser.IFunImplCluster;
import com.bokesoft.yigo.parser.IFunctionProvider;

/**
 * OA中间层公式提供
 * 
 * @author minjian
 *
 */
public class OAMidFunctionProvider implements IFunctionProvider {

	@Override
	public IFunImplCluster[] getClusters() {
		return new IFunImplCluster[] { new OAMidFunction(), };
	}
}
