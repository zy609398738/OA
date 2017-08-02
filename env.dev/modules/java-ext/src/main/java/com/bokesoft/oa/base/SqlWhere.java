package com.bokesoft.oa.base;

import java.util.ArrayList;
import java.util.List;

/**
 * SQL条件
 * 
 * @author minjian
 *
 */
public class SqlWhere {
	/**
	 * 默认替换符
	 */
	public static final String DefaultRep = "?";
	/**
	 * 默认空格符
	 */
	public static final String DefaultBlank = " ";
	/**
	 * Sql的条件
	 */
	private StringBuffer sqlWhere = new StringBuffer();

	/**
	 * Sql的条件
	 * 
	 * @return Sql的条件
	 */
	public StringBuffer getSqlWhere() {
		return sqlWhere;
	}

	/**
	 * Sql的条件
	 * 
	 * @param sqlWhere
	 *            Sql的条件
	 */
	public void setSqlWhere(StringBuffer sqlWhere) {
		this.sqlWhere = sqlWhere;
	}

	/**
	 * Sql的条件
	 * 
	 * @param sqlWhere
	 *            Sql的条件
	 */
	public void setSqlWhere(String sqlWhere) {
		this.sqlWhere.append(sqlWhere);
	}

	/**
	 * Sql的条件
	 * 
	 * @return Sql的条件
	 */
	public String getSqlWhereString() {
		return sqlWhere.toString();
	}

	/**
	 * 值的列表
	 */
	private List<Object> valueList = new ArrayList<Object>();

	/**
	 * 值的列表
	 * 
	 * @return
	 */
	public List<Object> getValueList() {
		return valueList;
	}

	/**
	 * 值的列表
	 * 
	 * @param valueList
	 *            值的列表
	 */
	public void setValueList(List<Object> valueList) {
		this.valueList = valueList;
	}
}
