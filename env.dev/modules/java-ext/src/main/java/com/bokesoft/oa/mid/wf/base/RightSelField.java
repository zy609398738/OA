package com.bokesoft.oa.mid.wf.base;

import com.bokesoft.oa.base.BillDtlBase;
import com.bokesoft.oa.base.OAContext;
import com.bokesoft.yigo.struct.datatable.DataTable;

/**
 * 字段选择明细
 * 
 * @author minjian
 *
 */
public class RightSelField extends BillDtlBase<RightSel> {
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
	 * 字段名称
	 */
	private String fieldName;

	/**
	 * 字段名称
	 * 
	 * @return 字段名称
	 */
	public String getFieldName() {
		return fieldName;
	}

	/**
	 * 字段名称
	 * 
	 * @param fieldName
	 *            字段名称
	 */
	public void setFieldName(String fieldName) {
		this.fieldName = fieldName;
	}

	/**
	 * 可见
	 */
	private Integer fieldVisible;

	/**
	 * 可见
	 * 
	 * @return 可见
	 */
	public Integer getFieldVisible() {
		return fieldVisible;
	}

	/**
	 * 可见
	 * 
	 * @param fieldVisible
	 *            可见
	 */
	public void setFieldVisible(Integer fieldVisible) {
		this.fieldVisible = fieldVisible;
	}

	/**
	 * 可编辑
	 */
	private Integer fieldEnable;

	/**
	 * 可编辑
	 * 
	 * @return 可编辑
	 */
	public Integer getFieldEnable() {
		return fieldEnable;
	}

	/**
	 * 可编辑
	 * 
	 * @param fieldEnable
	 *            可编辑
	 */
	public void setFieldEnable(Integer fieldEnable) {
		this.fieldEnable = fieldEnable;
	}

	/**
	 * 构造字段选择明细对象
	 * 
	 * @param context
	 *            OA上下文
	 * @param rightSel
	 *            权限选择
	 */
	public RightSelField(OAContext context, RightSel rightSel) {
		super(context, rightSel);
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
		setFieldKey(dt.getString("FieldKey"));
		setFieldName(dt.getString("FieldName"));
		setFieldVisible(dt.getInt("FieldVisible"));
		setFieldEnable(dt.getInt("FieldEnable"));
	}
}
