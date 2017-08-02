package com.bokesoft.oa.mid.wf.base;

import com.bokesoft.oa.base.OAContext;
import com.bokesoft.yigo.struct.datatable.DataTable;

/**
 * 人员匹配条件明细
 * 
 * @author zhoukaihe
 *
 */
public class EmpSelCondition extends SelRuleDtl {
	/**
	 * 是否变量
	 */
	private Integer isVariate;

	/**
	 * 是否变量
	 * 
	 * @return 是否变量
	 */
	public Integer getIsVariate() {
		return isVariate;
	}

	/**
	 * 是否变量
	 * 
	 * @param isVariate
	 *            是否变量
	 */
	public void setIsVariate(Integer isVariate) {
		this.isVariate = isVariate;
	}

	/**
	 * 构造人员匹配条件明细
	 * 
	 * @param context
	 *            OA上下文
	 * @param selRule
	 *            选择规则
	 */
	public EmpSelCondition(OAContext context, SelRule selRule) {
		super(context, selRule);
	}

	/**
	 * 载入数据
	 * 
	 * @param dt
	 *            明细数据集
	 * @throws Throwable
	 */
	public void loadData(DataTable dt) throws Throwable {
		super.loadData(dt);
		setIsVariate(dt.getInt("IsVariate"));
	}
}
