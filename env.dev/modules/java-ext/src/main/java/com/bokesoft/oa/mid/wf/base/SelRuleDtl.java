package com.bokesoft.oa.mid.wf.base;

import com.bokesoft.oa.base.DtlBase;
import com.bokesoft.oa.base.OAContext;
import com.bokesoft.yigo.struct.datatable.DataTable;

/**
 * 人员选择规则明细
 * 
 * @author minjian
 *
 */
public class SelRuleDtl extends DtlBase<SelRule> {
	/**
	 * 右括号
	 */
	private String rBracket;

	/**
	 * 右括号
	 * 
	 * @return 右括号
	 */
	public String getRBracket() {
		if (rBracket == "" || rBracket == null) {
			return "";
		}
		return rBracket;
	}

	/**
	 * 右括号
	 * 
	 * @param rBracket
	 *            右括号
	 */
	public void setRBracket(String rBracket) {
		this.rBracket = rBracket;
	}

	/**
	 * 字段标识
	 */
	private String fieldKey;

	/**
	 * 字段标识
	 * 
	 * @return 字段标识
	 */
	public String getFieldKey() {
		return fieldKey;
	}

	/**
	 * 字段标识
	 * 
	 * @param fieldKey
	 *            字段标识
	 */
	public void setFieldKey(String fieldKey) {
		this.fieldKey = fieldKey;
	}

	/**
	 * 操作
	 */
	private String operation;

	/**
	 * 操作
	 * 
	 * @return 操作
	 */
	public String getOperation() {
		return operation;
	}

	/**
	 * 操作
	 * 
	 * @param operation
	 *            操作
	 */
	public void setOperation(String operation) {
		this.operation = operation;
	}

	/**
	 * 值
	 */
	private String Value;

	/**
	 * 值
	 * 
	 * @return 值
	 */
	public String getValue() {
		return Value;
	}

	/**
	 * 值
	 * 
	 * @param Value
	 *            值
	 */
	public void setValue(String Value) {
		this.Value = Value;
	}

	/**
	 * 左括号
	 */
	private String lBracket;

	/**
	 * 左括号
	 * 
	 * @return 左括号
	 */
	public String getLBracket() {
		if (lBracket == "" || lBracket == null) {
			return "";
		}
		return lBracket;
	}

	/**
	 * 左括号
	 * 
	 * @param lBracket
	 *            左括号
	 */
	public void setLBracket(String lBracket) {
		this.lBracket = lBracket;
	}

	/**
	 * 逻辑操作
	 */
	private String logicOperation;

	/**
	 * 逻辑操作
	 * 
	 * @return 逻辑操作
	 */
	public String getLogicOperation() {
		return logicOperation;
	}

	/**
	 * 逻辑操作
	 * 
	 * @param logicOperation
	 *            逻辑操作
	 */
	public void setLogicOperation(String logicOperation) {
		this.logicOperation = logicOperation;
	}

	/**
	 * 构造人员选择规则明细对象
	 * 
	 * @param context
	 *            OA上下文
	 * @param selRule
	 *            选择规则
	 */
	public SelRuleDtl(OAContext context, SelRule selRule) {
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
		setRBracket(dt.getString("RBracket"));
		setFieldKey(dt.getString("FieldKey"));
		setOperation(dt.getString("Operation"));
		setValue(dt.getString("SValue"));
		setLBracket(dt.getString("LBracket"));
		setLogicOperation(dt.getString("LogicOperation"));
	}

	/**
	 * 载入数据
	 * 
	 * @param dt
	 *            明细数据集
	 * @throws Throwable
	 */
	public void uploadData(DataTable dt) throws Throwable {
		super.loadData(dt);
		setRBracket(dt.getString("RBracket"));
		setFieldKey(dt.getString("FieldKey"));
		setOperation(dt.getString("Operation"));
		setValue(dt.getString("SValue"));
		setLBracket(dt.getString("LBracket"));
		setLogicOperation(dt.getString("LogicOperation"));
	}
}
