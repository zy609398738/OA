package com.bokesoft.oa.mid.wf.base;

import com.bokesoft.oa.base.DtlBase;
import com.bokesoft.oa.base.OAContext;
import com.bokesoft.yigo.struct.datatable.DataTable;

/**
 * 选择规则参数明细
 * 
 * @author zhoukh
 *
 */
public class SelRuleParameter extends DtlBase<SelRule> {
	/**
	 * 参数标识
	 */
	private String paraKey;

	/**
	 * 参数标识
	 * 
	 * @return 参数标识
	 */
	public String getParaKey() {
		return paraKey;
	}

	/**
	 * 参数标识
	 * 
	 * @param paraKey
	 *            参数标识
	 */
	public void setParaKey(String paraKey) {
		this.paraKey = paraKey;
	}

	/**
	 * 参数值
	 */
	private String paraValue;

	/**
	 * 参数值
	 * 
	 * @return 参数值
	 */
	public String getParaValue() {
		return paraValue;
	}

	/**
	 * 参数值
	 * 
	 * @param paraValue
	 *            参数值
	 */
	public void setParaValue(String paraValue) {
		this.paraValue = paraValue;
	}

	/**
	 * 
	 * @param context
	 *            上下文对象
	 * @param selRule
	 *            选择规则
	 **/
	public SelRuleParameter(OAContext context, SelRule selRule) {
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
		setParaKey(dt.getString("ParaKey"));
		setParaValue(dt.getString("ParaValue"));
	}
}
