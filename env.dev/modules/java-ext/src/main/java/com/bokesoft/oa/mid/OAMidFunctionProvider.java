package com.bokesoft.oa.mid;

import com.bokesoft.yigo.parser.IFunImplCluster;
import com.bokesoft.yigo.parser.IFunctionProvider;

/**
 * OA中间层公式注册
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
