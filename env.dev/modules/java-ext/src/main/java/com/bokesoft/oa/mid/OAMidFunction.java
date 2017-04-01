package com.bokesoft.oa.mid;

import com.bokesoft.yigo.parser.BaseFunImplCluster;

/** 
 * @author xialj
 *
 */
public class OAMidFunction extends BaseFunImplCluster {

	@Override
	public Object[][] getImplTable() {
		//返回一个自动的开发类和公式名的二维数组
		return new Object[][] { 
			{ "OA_NewsDraftPreSave", new OA_NewsDraftPreSave() },
			{ "OA_NewsDraftPostSave", new OA_NewsDraftPostSave() },
			{ "OA_Taskdistribution", new OA_Taskdistribution()}
		};
	}
}
