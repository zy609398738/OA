package com.bokesoft.oa.mid.wf.base;

import com.bokesoft.oa.base.DtlBase;
import com.bokesoft.oa.base.OAContext;
import com.bokesoft.yigo.struct.datatable.DataTable;

/**
 * 节点完成
 * 
 * @author minjian
 *
 */
public class NodePropertyFinish extends DtlBase<NodeProperty> {

	/**
	 * 执行内容
	 */
	private String formula;

	/**
	 * 执行内容
	 * 
	 * @return 执行内容
	 */
	public String getFormula() {
		return formula;
	}

	/**
	 * 执行内容
	 * 
	 * @param formula
	 *            执行内容
	 */
	public void setFormula(String formula) {
		this.formula = formula;
	}

	/**
	 * 构造节点完成对象
	 * 
	 * @param context
	 *            OA上下文
	 * @param NodeProperty
	 *            选择规则
	 */
	public NodePropertyFinish(OAContext context, NodeProperty NodeProperty) {
		super(context, NodeProperty);
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
		setFormula(dt.getString("Formula"));
	}
}
