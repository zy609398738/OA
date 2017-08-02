package com.bokesoft.oa.mid.formula;

import com.bokesoft.yigo.parser.BaseFunImplCluster;

/**
 * OA中间层公式注册
 * 
 * @author minjian
 *
 */
public class OAMidFunction extends BaseFunImplCluster {

	@Override
	public Object[][] getImplTable() {
		// 返回一个自动的开发类和公式名的二维数组
		return new Object[][] { { "OA_NewsDraftPreSave", new NewsDraftPreSave() },
				{ "OA_NewsDraftPostSave", new NewsDraftPostSave() },
				{ "OA_Taskdistribution", new Taskdistribution() }, { "OA_WriteoffBudget", new TimeoutNotice() } };
	}
}
