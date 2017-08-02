package com.bokesoft.oa.mid.wf.base;

import com.bokesoft.oa.base.DtlBase;
import com.bokesoft.oa.base.OAContext;
import com.bokesoft.yigo.struct.datatable.DataTable;

/**
 * 人员来源明细
 * 
 * @author zhoukaihe
 *
 */
public class EmployeeSourceDtl extends DtlBase<EmployeeSource> {
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
	private String fieldCaption;

	/**
	 * 字段名称
	 * 
	 * @return 字段名称
	 */
	public String getFieldCaption() {
		return fieldCaption;
	}

	/**
	 * 字段名称
	 * 
	 * @param fieldCaption
	 *            字段名称
	 */
	public void setFieldCaption(String fieldCaption) {
		this.fieldCaption = fieldCaption;
	}

	/**
	 * 字段类型
	 */
	private String fieldType;

	/**
	 * 字段类型
	 * 
	 * @return 字段类型
	 */
	public String getFieldType() {
		return fieldType;
	}

	/**
	 * 字段类型
	 * 
	 * @param fieldType
	 *            字段类型
	 */
	public void setFieldType(String fieldType) {
		this.fieldType = fieldType;
	}

	/**
	 * 下拉内容
	 */
	private String comboContent;

	/**
	 * 下拉内容
	 * 
	 * @return 下拉内容
	 */
	public String getComboContent() {
		return comboContent;
	}

	/**
	 * 下拉内容
	 * 
	 * @param comboContent
	 *            下拉内容
	 */
	public void setComboContent(String comboContent) {
		this.comboContent = comboContent;
	}

	/**
	 * 对应字典
	 */
	private String paraDict;

	/**
	 * 对应字典
	 * 
	 * @return 对应字典
	 */
	public String getParaDict() {
		return paraDict;
	}

	/**
	 * 对应字典
	 * 
	 * @param paraDict
	 *            对应字典
	 */
	public void setParaDict(String paraDict) {
		this.paraDict = paraDict;
	}

	/**
	 * 长度
	 */
	private Integer len;

	/**
	 * 长度
	 * 
	 * @return 长度
	 */
	public Integer getLen() {
		return len;
	}

	/**
	 * 长度
	 * 
	 * @param len
	 *            长度
	 */
	public void setLen(int len) {
		this.len = len;
	}

	/**
	 * 精度
	 */
	private Integer accuracy;

	/**
	 * 精度
	 * 
	 * @return 精度
	 */
	public Integer getAccuracy() {
		return accuracy;
	}

	/**
	 * 精度
	 * 
	 * @param accuracy
	 *            精度
	 */
	public void setAccuracy(int accuracy) {
		this.accuracy = accuracy;
	}

	/**
	 * 构造人员来源明细对象
	 * 
	 * @param context
	 *            OA上下文
	 * @param employeeSource
	 *            人员来源
	 */
	public EmployeeSourceDtl(OAContext context, EmployeeSource employeeSource) {
		super(context, employeeSource);
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
		setFieldCaption(dt.getString("FieldCaption"));
		setFieldType(dt.getString("FieldType"));
		setComboContent(dt.getString("ComboContent"));
		setParaDict(dt.getString("ParaDict"));
		setLen(dt.getInt("LEN"));
		setAccuracy(dt.getInt("Accuracy"));
	}

	/**
	 * 重载
	 */
	public String toString() {
		return super.toString() + "，字段标识:" + getFieldKey() + "，字段名称:" + getFieldCaption() + "，字段类型:" + getFieldType()
				+ "，下拉内容:" + getComboContent() + "，对应字典:" + getParaDict() + "，长度:" + getLen() + "，精度" + getAccuracy();
	}

}
