package com.bokesoft.oa.ui;

import com.bokesoft.yigo.parser.BaseFunImplCluster;

/**
 * OA界面公式入口
 * 
 * @author minjian
 *
 */
public class OAUIFunction extends BaseFunImplCluster {

	@Override
	public Object[][] getImplTable() {
		return new Object[][] { { "OA_UITest", new Test() } };
	}
}
