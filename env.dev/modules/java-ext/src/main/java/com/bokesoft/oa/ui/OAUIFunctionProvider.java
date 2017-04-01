package com.bokesoft.oa.ui;

import com.bokesoft.yigo.parser.IFunImplCluster;
import com.bokesoft.yigo.parser.IFunctionProvider;

/**
 * OA界面公式注册
 * 
 * @author minjian
 *
 */
public class OAUIFunctionProvider implements IFunctionProvider {

	@Override
	public IFunImplCluster[] getClusters() {
		return new IFunImplCluster[] { new OAUIFunction(), };
	}
}
